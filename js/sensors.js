// Sensors JavaScript with Firebase Realtime Database
// Handle monitoring pergerakan otot lengan untuk rehabilitasi stroke
// Versi untuk dokter - dengan fitur recording manual

let sensorUpdateInterval = null;
let updateInterval = 2000; // Default 2 seconds
let sensorDataListener = null;
let monitoringStartTime = null;
let movementCount = 0;
let maxAcceleration = 0;
let emgReadings = [];
let monitoringTimeInterval = null;
let lastMpuUpdateTime = null; // Track last MPU update time
const MPU_TIMEOUT = 5000; // 5 seconds timeout for MPU data
let currentDevice = 'device 2'; // Default device
let currentUser = null; // Current logged in doctor

// Recording state
let isRecording = false;
let recordingStartTime = null;
let recordedData = []; // Array to store recorded sensor data

// Check if user is logged in
window.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to load
    if (typeof firebase !== 'undefined') {
        initializeFirebase();
        
        // Check authentication
        auth.onAuthStateChanged(function(user) {
            if (!user) {
                window.location.href = 'auth.html';
                return;
            }
            
            currentUser = user;
            
            // Load patients list
            loadPatientsList();
            
            // Load saved device preference
            const savedDevice = localStorage.getItem('selectedDevice');
            if (savedDevice) {
                currentDevice = savedDevice;
            }
            
            // Setup device selector
            const deviceSelect = document.getElementById('deviceSelect');
            if (deviceSelect) {
                deviceSelect.value = currentDevice;
                deviceSelect.addEventListener('change', function(e) {
                    currentDevice = e.target.value;
                    localStorage.setItem('selectedDevice', currentDevice);
                    // Reconnect to new device
                    reconnectSensors();
                });
            }
            
            // User is logged in, setup sensors (but don't auto-record)
            setupRealtimeSensorListener();
            // Don't start monitoring time here - it will start when recording begins
            
            // Initialize monitoring stats UI to zero
            resetMonitoringStatsUI();
            
            // Check MPU timeout periodically
            setInterval(checkMpuTimeout, 1000);
        });
    } else {
        console.error('Firebase SDK not loaded');
        // Fallback to simulated data
        initializeSensors();
        startMonitoringTime();
    }
});

// Load patients list from Firestore
async function loadPatientsList() {
    const patientSelect = document.getElementById('patientSelect');
    if (!patientSelect) return;
    
    try {
        // Get all patients from subcollection under this doctor's document
        if (firestore && currentUser) {
            const snapshot = await firestore.collection('users')
                .doc(currentUser.uid)
                .collection('patients')
                .get();
            
            // Clear existing options except the first one
            patientSelect.innerHTML = '<option value="">-- Pilih Pasien --</option>';
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = data.name || data.email || `Pasien ${doc.id.substring(0, 8)}`;
                patientSelect.appendChild(option);
            });
        } else {
            // Fallback: show message
            patientSelect.innerHTML = '<option value="">-- Tidak ada pasien --</option>';
        }
    } catch (error) {
        console.error('Error loading patients:', error);
        if (typeof showAlert === 'function') {
            showAlert('Gagal memuat daftar pasien.', 'Kesalahan');
        }
    }
}

// Start recording sensor data
function startRecording() {
    const patientSelect = document.getElementById('patientSelect');
    const selectedPatientId = patientSelect ? patientSelect.value : null;
    
    // Validation: check if patient is selected
    if (!selectedPatientId) {
        if (typeof showAlert === 'function') {
            showAlert('Silakan pilih pasien terlebih dahulu!', 'Peringatan');
        } else {
            alert('Silakan pilih pasien terlebih dahulu!');
        }
        return;
    }
    
    // Check if already recording
    if (isRecording) {
        return;
    }
    
    // Start recording
    isRecording = true;
    recordingStartTime = Date.now();
    recordedData = []; // Reset recorded data
    
    // Reset all monitoring stats for new recording session
    movementCount = 0;
    maxAcceleration = 0;
    emgReadings = []; // Clear previous readings
    
    // Reset monitoring time - start from 0 when recording starts
    monitoringStartTime = Date.now();
    
    // Update UI - reset all summary stats to 0
    resetMonitoringStatsUI();
    
    // Start monitoring time counter
    startMonitoringTime();
    
    // Update UI buttons and status
    const btnRecord = document.getElementById('btnRecord');
    const btnStop = document.getElementById('btnStop');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingStatusText = document.getElementById('recordingStatusText');
    
    if (btnRecord) btnRecord.disabled = true;
    if (btnStop) btnStop.disabled = false;
    
    if (recordingStatus) {
        recordingStatus.style.display = 'block';
        recordingStatus.className = 'recording-status recording';
    }
    if (recordingStatusText) {
        recordingStatusText.textContent = 'Sedang merekam...';
    }
    
    if (typeof showAlert === 'function') {
        showAlert('Recording dimulai!', 'Info');
    }
}

// Stop recording and save to Firestore
async function stopRecording() {
    if (!isRecording) {
        return;
    }
    
    const patientSelect = document.getElementById('patientSelect');
    const selectedPatientId = patientSelect ? patientSelect.value : null;
    
    if (!selectedPatientId) {
        if (typeof showAlert === 'function') {
            showAlert('Tidak ada pasien yang dipilih!', 'Peringatan');
        }
        return;
    }
    
    // Stop recording
    isRecording = false;
    
    // Stop monitoring time counter (time will freeze at current value)
    if (monitoringTimeInterval) {
        clearInterval(monitoringTimeInterval);
        monitoringTimeInterval = null;
    }
    
    // Update UI
    const btnRecord = document.getElementById('btnRecord');
    const btnStop = document.getElementById('btnStop');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingStatusText = document.getElementById('recordingStatusText');
    
    if (btnRecord) btnRecord.disabled = false;
    if (btnStop) btnStop.disabled = true;
    
    if (recordingStatus) {
        recordingStatus.className = 'recording-status stopped';
    }
    if (recordingStatusText) {
        recordingStatusText.textContent = 'Tidak sedang merekam';
    }
    
    // Calculate recording duration
    const recordingDuration = recordingStartTime ? Math.floor((Date.now() - recordingStartTime) / 1000) : 0;
    
    // Prepare data to save
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.getDate();
    const month = now.getMonth() + 1; // Month is 0-indexed
    const year = now.getFullYear();
    const dateMonthYear = `${date}-${month}-${year}`;
    
    // Calculate average muscle activity
    const avgMuscleActivity = emgReadings.length > 0 
        ? Math.round(emgReadings.reduce((a, b) => a + b, 0) / emgReadings.length)
        : 0;
    
    // Prepare record data
    const recordData = {
        patientId: selectedPatientId,
        doctorId: currentUser ? currentUser.uid : null,
        device: currentDevice,
        time: time,
        dateMonthYear: dateMonthYear,
        timestamp: firebase && firebase.firestore ? firebase.firestore.Timestamp.now() : new Date(),
        duration: recordingDuration, // in seconds
        avgMuscleActivity: avgMuscleActivity,
        movementCount: movementCount,
        maxAcceleration: maxAcceleration,
        recordedData: recordedData, // Store all recorded sensor data
        createdAt: firebase && firebase.firestore ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
    };
    
    // Show loading
    if (recordingStatusText) {
        recordingStatusText.textContent = 'Menyimpan data...';
    }
    
    try {
        // Save to Firestore - store in patient's subcollection under user's document
        // Structure: users/{userId}/patients/{patientId}/monitoringRecords/{recordId}
        if (firestore && currentUser && selectedPatientId) {
            await firestore.collection('users')
                .doc(currentUser.uid)
                .collection('patients')
                .doc(selectedPatientId)
                .collection('monitoringRecords')
                .add(recordData);
            
            if (typeof showAlert === 'function') {
                showAlert(`Data berhasil disimpan! Waktu: ${time}, Tanggal: ${dateMonthYear}`, 'Berhasil');
            } else {
                alert(`Data berhasil disimpan! Waktu: ${time}, Tanggal: ${dateMonthYear}`);
            }
        } else {
            // Fallback: save to localStorage
            const records = JSON.parse(localStorage.getItem('monitoringRecords') || '[]');
            records.push({
                ...recordData,
                id: 'local_' + Date.now()
            });
            localStorage.setItem('monitoringRecords', JSON.stringify(records));
            
            if (typeof showAlert === 'function') {
                showAlert('Data disimpan ke localStorage (Firestore tidak tersedia)', 'Info');
            }
        }
        
        // Reset stats after saving (prepare for next recording)
        resetMonitoringStatsAfterSave();
        
    } catch (error) {
        console.error('Error saving record:', error);
        if (typeof showAlert === 'function') {
            showAlert('Gagal menyimpan data: ' + error.message, 'Kesalahan');
        } else {
            alert('Gagal menyimpan data: ' + error.message);
        }
    }
}

// Check MPU timeout
function checkMpuTimeout() {
    if (lastMpuUpdateTime && (Date.now() - lastMpuUpdateTime) > MPU_TIMEOUT) {
        // MPU data timeout - show "Gerak Off"
        const armMovementStatusElement = document.getElementById('armMovementStatus');
        if (armMovementStatusElement) {
            armMovementStatusElement.textContent = 'Gerak Off';
        }
        
        // Also update dashboard if on that page
        const dashboardArmMovement = document.getElementById('armMovement');
        if (dashboardArmMovement) {
            dashboardArmMovement.textContent = 'Gerak Off';
        }
    }
}

// Start monitoring time counter - only runs during recording
function startMonitoringTime() {
    if (monitoringTimeInterval) {
        clearInterval(monitoringTimeInterval);
    }
    
    monitoringTimeInterval = setInterval(() => {
        // Only update time if recording is active
        if (isRecording && monitoringStartTime) {
            const elapsed = Math.floor((Date.now() - monitoringStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timeElement = document.getElementById('monitoringTime');
            if (timeElement) {
                timeElement.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
            }
        }
    }, 1000);
}

// Reset monitoring stats UI to zero
function resetMonitoringStatsUI() {
    const avgMuscleActivityEl = document.getElementById('avgMuscleActivity');
    const movementCountEl = document.getElementById('movementCount');
    const maxAccelerationEl = document.getElementById('maxAcceleration');
    const monitoringTimeEl = document.getElementById('monitoringTime');
    
    if (avgMuscleActivityEl) avgMuscleActivityEl.textContent = '0%';
    if (movementCountEl) movementCountEl.textContent = '0';
    if (maxAccelerationEl) maxAccelerationEl.textContent = '0.0';
    if (monitoringTimeEl) monitoringTimeEl.textContent = '0:00';
}

// Setup real-time listener from Firebase Realtime Database
function setupRealtimeSensorListener() {
    if (!database) {
        console.error('Database not initialized');
        initializeSensors(); // Fallback to simulated
        return;
    }
    
    // Get current device from selector or use default
    const deviceSelect = document.getElementById('deviceSelect');
    if (deviceSelect) {
        currentDevice = deviceSelect.value;
    }
    
    // Listen to device data from selected device path (ESP32C3 → WiFi → Realtime Database)
    const deviceRef = database.ref(currentDevice);
    
    sensorDataListener = deviceRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Check if MPU data exists and is recent
            if (data.ax !== undefined && data.ax !== null && 
                data.ay !== undefined && data.ay !== null && 
                data.az !== undefined && data.az !== null) {
                lastMpuUpdateTime = Date.now();
            }
            updateMonitoringDataFromRealtime(data);
            
            // If recording, store data
            if (isRecording) {
                storeRecordedData(data);
            }
        } else {
            // No data available
            lastMpuUpdateTime = null;
            updateSensorData();
        }
    }, (error) => {
        console.error('Error reading sensor data:', error);
        lastMpuUpdateTime = null;
        updateSensorData(); // Fallback to simulated
    });
}

// Store recorded data (called during recording)
function storeRecordedData(data) {
    const timestamp = Date.now();
    recordedData.push({
        timestamp: timestamp,
        emg_voltage: data.emg_voltage || 0,
        emg_raw: data.emg_raw || 0,
        ax: data.ax || 0,
        ay: data.ay || 0,
        az: data.az || 0,
        gx: data.gx || 0,
        gy: data.gy || 0,
        gz: data.gz || 0
    });
    
    // Limit recorded data to prevent memory issues (keep last 1000 readings)
    if (recordedData.length > 1000) {
        recordedData.shift();
    }
}

// Update monitoring data from Realtime Database
function updateMonitoringDataFromRealtime(data) {
    // EMG - EMG Voltage (0-3.3V typical)
    const emgVoltage = data.emg_voltage || 0;
    const emgVoltageElement = document.getElementById('emgVoltage');
    if (emgVoltageElement) {
        emgVoltageElement.textContent = emgVoltage.toFixed(2);
    }
    
    // EMG Raw value
    const emgRaw = data.emg_raw || 0;
    const emgRawElement = document.getElementById('emgRaw');
    if (emgRawElement) {
        emgRawElement.textContent = emgRaw;
    }
    
    // Calculate EMG intensity (0-100%) - EMG typically outputs 0-3.3V
    const emgIntensity = Math.min((emgVoltage / 3.3) * 100, 100);
    const emgProgress = document.getElementById('emgProgress');
    if (emgProgress) {
        emgProgress.style.width = emgIntensity + '%';
        emgProgress.textContent = Math.round(emgIntensity) + '%';
    }
    
    const emgIntensityElement = document.getElementById('emgIntensity');
    if (emgIntensityElement) {
        emgIntensityElement.textContent = Math.round(emgIntensity) + '%';
    }
    
    // Store EMG readings for average calculation - ONLY during recording
    if (isRecording) {
        emgReadings.push(emgIntensity);
        if (emgReadings.length > 100) {
            emgReadings.shift(); // Keep last 100 readings
        }
        
        // Calculate average muscle activity - ONLY from recording session
        const avgMuscleActivity = emgReadings.length > 0 
            ? Math.round(emgReadings.reduce((a, b) => a + b, 0) / emgReadings.length)
            : 0;
        const avgMuscleActivityElement = document.getElementById('avgMuscleActivity');
        if (avgMuscleActivityElement) {
            avgMuscleActivityElement.textContent = avgMuscleActivity + '%';
        }
    }
    
    // MPU Sensor - Accelerometer
    const ax = data.ax || 0;
    const ay = data.ay || 0;
    const az = data.az || 0;
    
    const mpuAccelX = document.getElementById('mpuAccelX');
    const mpuAccelY = document.getElementById('mpuAccelY');
    const mpuAccelZ = document.getElementById('mpuAccelZ');
    
    if (mpuAccelX) mpuAccelX.textContent = ax.toFixed(2);
    if (mpuAccelY) mpuAccelY.textContent = ay.toFixed(2);
    if (mpuAccelZ) mpuAccelZ.textContent = az.toFixed(2);
    
    // Calculate acceleration magnitude
    const accelMagnitude = Math.sqrt(ax * ax + ay * ay + az * az);
    const accelMagnitudeElement = document.getElementById('accelMagnitude');
    if (accelMagnitudeElement) {
        accelMagnitudeElement.textContent = accelMagnitude.toFixed(2);
    }
    
    // Add data to chart
    if (typeof addChartData === 'function') {
        addChartData(emgVoltage, accelMagnitude);
    }
    
    // Update max acceleration - ONLY during recording
    if (isRecording && accelMagnitude > maxAcceleration) {
        maxAcceleration = accelMagnitude;
        const maxAccelElement = document.getElementById('maxAcceleration');
        if (maxAccelElement) {
            maxAccelElement.textContent = maxAcceleration.toFixed(1);
        }
    }
    
    // Detect movement (threshold for arm movement) - ONLY during recording
    if (isRecording) {
        const movementThreshold = 0.5; // g
        if (accelMagnitude > movementThreshold) {
            movementCount++;
            const movementCountElement = document.getElementById('movementCount');
            if (movementCountElement) {
                movementCountElement.textContent = movementCount;
            }
        }
    }
    
    // Determine arm movement status - check if MPU data is recent
    let armMovementStatus = 'Stabil';
    if (lastMpuUpdateTime && (Date.now() - lastMpuUpdateTime) <= MPU_TIMEOUT) {
        // MPU data is recent, determine status based on movement
        if (accelMagnitude > 1.5) {
            armMovementStatus = 'Gerak Aktif';
        } else if (accelMagnitude > 0.5) {
            armMovementStatus = 'Gerak Ringan';
        }
    } else {
        // No recent MPU update
        armMovementStatus = 'Gerak Off';
    }
    
    const armMovementStatusElement = document.getElementById('armMovementStatus');
    if (armMovementStatusElement) {
        armMovementStatusElement.textContent = armMovementStatus;
    }
    
    // MPU Sensor - Gyroscope
    const gx = data.gx || 0;
    const gy = data.gy || 0;
    const gz = data.gz || 0;
    
    const mpuGyroX = document.getElementById('mpuGyroX');
    const mpuGyroY = document.getElementById('mpuGyroY');
    const mpuGyroZ = document.getElementById('mpuGyroZ');
    
    if (mpuGyroX) mpuGyroX.textContent = gx.toFixed(2);
    if (mpuGyroY) mpuGyroY.textContent = gy.toFixed(2);
    if (mpuGyroZ) mpuGyroZ.textContent = gz.toFixed(2);
}

// Initialize sensors (fallback to simulated)
function initializeSensors() {
    updateSensorData();
}

// Start automatic sensor updates (for UI refresh)
function startSensorUpdates() {
    stopSensorUpdates(); // Clear any existing interval
    
    sensorUpdateInterval = setInterval(() => {
        // If using realtime database, data is already updated via listener
        // This is just for UI refresh or fallback simulation
        if (!sensorDataListener) {
            updateSensorData();
        }
    }, updateInterval);
}

// Stop automatic sensor updates
function stopSensorUpdates() {
    if (sensorUpdateInterval) {
        clearInterval(sensorUpdateInterval);
        sensorUpdateInterval = null;
    }
}

// Restart sensor updates with new interval
function restartSensorUpdates() {
    const autoRefreshCheckbox = document.getElementById('autoRefresh');
    if (autoRefreshCheckbox && autoRefreshCheckbox.checked) {
        startSensorUpdates();
    }
}

// Update sensor data (simulated fallback)
function updateSensorData() {
    // Simulate EMG data (0-3.3V typical range)
    const emgVoltage = Math.random() * 2.5; // 0-2.5V for simulation
    const emgVoltageElement = document.getElementById('emgVoltage');
    if (emgVoltageElement) {
        emgVoltageElement.textContent = emgVoltage.toFixed(2);
    }
    
    // EMG Raw
    const emgRaw = Math.floor(Math.random() * 2000) + 500;
    const emgRawElement = document.getElementById('emgRaw');
    if (emgRawElement) {
        emgRawElement.textContent = emgRaw;
    }
    
    // Calculate EMG intensity
    const emgIntensity = Math.min((emgVoltage / 3.3) * 100, 100);
    const emgProgress = document.getElementById('emgProgress');
    if (emgProgress) {
        emgProgress.style.width = emgIntensity + '%';
        emgProgress.textContent = Math.round(emgIntensity) + '%';
    }
    
    const emgIntensityElement = document.getElementById('emgIntensity');
    if (emgIntensityElement) {
        emgIntensityElement.textContent = Math.round(emgIntensity) + '%';
    }
    
    // Store for average - ONLY during recording
    if (isRecording) {
        emgReadings.push(emgIntensity);
        if (emgReadings.length > 100) {
            emgReadings.shift();
        }
        
        const avgMuscleActivity = emgReadings.length > 0 
            ? Math.round(emgReadings.reduce((a, b) => a + b, 0) / emgReadings.length)
            : 0;
        const avgMuscleActivityElement = document.getElementById('avgMuscleActivity');
        if (avgMuscleActivityElement) {
            avgMuscleActivityElement.textContent = avgMuscleActivity + '%';
        }
    }
    
    // Simulate MPU data - but show "Gerak Off" if no real connection
    if (!sensorDataListener || !lastMpuUpdateTime) {
        // No real data connection, show "Gerak Off"
        const armMovementStatusElement = document.getElementById('armMovementStatus');
        if (armMovementStatusElement) {
            armMovementStatusElement.textContent = 'Gerak Off';
        }
        
        // Set MPU values to 0
        const mpuAccelX = document.getElementById('mpuAccelX');
        const mpuAccelY = document.getElementById('mpuAccelY');
        const mpuAccelZ = document.getElementById('mpuAccelZ');
        
        if (mpuAccelX) mpuAccelX.textContent = '0.00';
        if (mpuAccelY) mpuAccelY.textContent = '0.00';
        if (mpuAccelZ) mpuAccelZ.textContent = '0.00';
        
        const accelMagnitudeElement = document.getElementById('accelMagnitude');
        if (accelMagnitudeElement) {
            accelMagnitudeElement.textContent = '0.00';
        }
        
        const mpuGyroX = document.getElementById('mpuGyroX');
        const mpuGyroY = document.getElementById('mpuGyroY');
        const mpuGyroZ = document.getElementById('mpuGyroZ');
        
        if (mpuGyroX) mpuGyroX.textContent = '0.00';
        if (mpuGyroY) mpuGyroY.textContent = '0.00';
        if (mpuGyroZ) mpuGyroZ.textContent = '0.00';
        
        return;
    }
    
    // Simulate MPU data only if we have real connection
    const ax = (Math.random() * 4 - 2);
    const ay = (Math.random() * 4 - 2);
    const az = (Math.random() * 4 - 2);
    
    const mpuAccelX = document.getElementById('mpuAccelX');
    const mpuAccelY = document.getElementById('mpuAccelY');
    const mpuAccelZ = document.getElementById('mpuAccelZ');
    
    if (mpuAccelX) mpuAccelX.textContent = ax.toFixed(2);
    if (mpuAccelY) mpuAccelY.textContent = ay.toFixed(2);
    if (mpuAccelZ) mpuAccelZ.textContent = az.toFixed(2);
    
    // Calculate acceleration magnitude
    const accelMagnitude = Math.sqrt(ax * ax + ay * ay + az * az);
    const accelMagnitudeElement = document.getElementById('accelMagnitude');
    if (accelMagnitudeElement) {
        accelMagnitudeElement.textContent = accelMagnitude.toFixed(2);
    }
    
    // Add data to chart
    if (typeof addChartData === 'function') {
        addChartData(emgVoltage, accelMagnitude);
    }
    
    // Update max acceleration - ONLY during recording
    if (isRecording && accelMagnitude > maxAcceleration) {
        maxAcceleration = accelMagnitude;
        const maxAccelElement = document.getElementById('maxAcceleration');
        if (maxAccelElement) {
            maxAccelElement.textContent = maxAcceleration.toFixed(1);
        }
    }
    
    // Detect movement - ONLY during recording
    if (isRecording && accelMagnitude > 0.5) {
        movementCount++;
        const movementCountElement = document.getElementById('movementCount');
        if (movementCountElement) {
            movementCountElement.textContent = movementCount;
        }
    }
    
    // Determine arm movement status
    let armMovementStatus = 'Stabil';
    if (accelMagnitude > 1.5) {
        armMovementStatus = 'Gerak Aktif';
    } else if (accelMagnitude > 0.5) {
        armMovementStatus = 'Gerak Ringan';
    }
    
    const armMovementStatusElement = document.getElementById('armMovementStatus');
    if (armMovementStatusElement) {
        armMovementStatusElement.textContent = armMovementStatus;
    }
    
    // Gyroscope
    const gx = (Math.random() * 400 - 200);
    const gy = (Math.random() * 400 - 200);
    const gz = (Math.random() * 400 - 200);
    
    const mpuGyroX = document.getElementById('mpuGyroX');
    const mpuGyroY = document.getElementById('mpuGyroY');
    const mpuGyroZ = document.getElementById('mpuGyroZ');
    
    if (mpuGyroX) mpuGyroX.textContent = gx.toFixed(2);
    if (mpuGyroY) mpuGyroY.textContent = gy.toFixed(2);
    if (mpuGyroZ) mpuGyroZ.textContent = gz.toFixed(2);
}

// Reset monitoring statistics after saving (automatic, no confirmation)
function resetMonitoringStatsAfterSave() {
    // Reset all stats to prepare for next recording
    movementCount = 0;
    maxAcceleration = 0;
    emgReadings = [];
    monitoringStartTime = null;
    
    // Update UI to show zeros
    resetMonitoringStatsUI();
    
    // Stop monitoring time counter
    if (monitoringTimeInterval) {
        clearInterval(monitoringTimeInterval);
        monitoringTimeInterval = null;
    }
}

// Reset monitoring statistics (manual reset button)
function resetMonitoringStats() {
    if (typeof showConfirm === 'function') {
        showConfirm('Apakah Anda yakin ingin mereset statistik monitoring?', 'Konfirmasi Reset', () => {
            performResetMonitoringStats();
        });
    } else {
        if (confirm('Apakah Anda yakin ingin mereset statistik monitoring?')) {
            performResetMonitoringStats();
        }
    }
}

// Perform reset monitoring stats
function performResetMonitoringStats() {
    // Reset monitoring stats (but don't reset if recording)
    if (!isRecording) {
        movementCount = 0;
        maxAcceleration = 0;
        emgReadings = [];
        monitoringStartTime = Date.now();
        lastMpuUpdateTime = null;
        
        // Update UI
        const avgMuscleActivityEl = document.getElementById('avgMuscleActivity');
        const movementCountEl = document.getElementById('movementCount');
        const maxAccelerationEl = document.getElementById('maxAcceleration');
        const monitoringTimeEl = document.getElementById('monitoringTime');
        
        if (avgMuscleActivityEl) avgMuscleActivityEl.textContent = '0%';
        if (movementCountEl) movementCountEl.textContent = '0';
        if (maxAccelerationEl) maxAccelerationEl.textContent = '0.0';
        if (monitoringTimeEl) monitoringTimeEl.textContent = '0:00';
        
        // Restart monitoring time
        startMonitoringTime();
        
        // Show success message
        if (typeof showAlert === 'function') {
            showAlert('Statistik monitoring telah direset!', 'Berhasil');
        }
    } else {
        if (typeof showAlert === 'function') {
            showAlert('Tidak dapat mereset saat sedang recording!', 'Peringatan');
        }
    }
}

// Reconnect sensors (called when device changes)
function reconnectSensors() {
    // Get current device from selector
    const deviceSelect = document.getElementById('deviceSelect');
    if (deviceSelect) {
        currentDevice = deviceSelect.value;
        localStorage.setItem('selectedDevice', currentDevice);
    }
    
    // Don't reset if recording
    if (isRecording) {
        if (typeof showAlert === 'function') {
            showAlert('Tidak dapat mengganti device saat sedang recording!', 'Peringatan');
        }
        // Revert device selection
        if (deviceSelect) {
            deviceSelect.value = localStorage.getItem('selectedDevice') || 'device 2';
        }
        return;
    }
    
    // Reset monitoring stats
    movementCount = 0;
    maxAcceleration = 0;
    emgReadings = [];
    monitoringStartTime = Date.now();
    lastMpuUpdateTime = null;
    
    // Update UI
    const avgMuscleActivityEl = document.getElementById('avgMuscleActivity');
    const movementCountEl = document.getElementById('movementCount');
    const maxAccelerationEl = document.getElementById('maxAcceleration');
    const monitoringTimeEl = document.getElementById('monitoringTime');
    
    if (avgMuscleActivityEl) avgMuscleActivityEl.textContent = '0%';
    if (movementCountEl) movementCountEl.textContent = '0';
    if (maxAccelerationEl) maxAccelerationEl.textContent = '0.0';
    if (monitoringTimeEl) monitoringTimeEl.textContent = '0:00';
    
    // Reconnect to database
    if (database) {
        // Remove old listener
        if (sensorDataListener) {
            // Get previous device (try to get from localStorage or use default)
            const prevDevice = localStorage.getItem('previousDevice') || 'device 2';
            database.ref(prevDevice).off('value', sensorDataListener);
            localStorage.setItem('previousDevice', currentDevice);
        }
        
        // Setup new listener
        setTimeout(() => {
            setupRealtimeSensorListener();
            
            // Show success message
            if (typeof showAlert === 'function') {
                showAlert('Berhasil', `Berhasil beralih ke ${currentDevice}!`);
            } else {
                console.log(`Berhasil beralih ke ${currentDevice}!`);
            }
        }, 500);
    } else {
        // Fallback
        setTimeout(() => {
            initializeSensors();
            
            // Show success message
            if (typeof showAlert === 'function') {
                showAlert('Berhasil', `Berhasil beralih ke ${currentDevice}!`);
            } else {
                console.log(`Berhasil beralih ke ${currentDevice}!`);
            }
        }, 500);
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopSensorUpdates();
    if (sensorDataListener && database) {
        database.ref(currentDevice).off('value', sensorDataListener);
    }
    if (monitoringTimeInterval) {
        clearInterval(monitoringTimeInterval);
    }
});
