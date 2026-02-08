// Dummy Data Generator JavaScript
// Generate dummy monitoring records for patient charts
// ADMIN ONLY - This page is restricted to admin users only

let currentUser = null;
let patientsList = [];
const ADMIN_EMAIL = 'admin@myosig.com'; // Admin email address

// Check if current user is admin
function isAdmin(user) {
    return user && user.email === ADMIN_EMAIL;
}

// Initialize page
window.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase SDK and config to load
    function initWhenReady() {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            setTimeout(initWhenReady, 100);
            return;
        }
        
        // Check if initializeFirebase function is available
        if (typeof initializeFirebase === 'undefined') {
            setTimeout(initWhenReady, 100);
            return;
        }
        
        // Initialize Firebase
        initializeFirebase();
        
        // Check authentication and admin status
        auth.onAuthStateChanged(function(user) {
            if (!user) {
                // Not logged in - redirect to auth page
                window.location.href = 'auth.html';
                return;
            }
            
            // Check if user is admin
            if (!isAdmin(user)) {
                // Not admin - redirect to dashboard
                alert('Akses ditolak. Halaman ini hanya untuk admin.');
                window.location.href = 'dashboard.html';
                return;
            }
            
            // User is admin - proceed
            currentUser = user;
            
            // Load patients list (all patients from all users for admin)
            loadPatientsList();
        });
    }
    
    // Start initialization
    initWhenReady();
});

// Load patients list from Firestore
// Admin can see all patients from all users
async function loadPatientsList() {
    const patientSelect = document.getElementById('patientSelect');
    if (!patientSelect) return;
    
    try {
        if (firestore && currentUser && isAdmin(currentUser)) {
            // Admin: Get all patients from all users
            // First, get all users
            const usersSnapshot = await firestore.collection('users').get();
            
            patientsList = [];
            
            // For each user, get their patients
            for (const userDoc of usersSnapshot.docs) {
                const userId = userDoc.id;
                const userData = userDoc.data();
                
                // Get patients for this user
                const patientsSnapshot = await firestore.collection('users')
                    .doc(userId)
                    .collection('patients')
                    .get();
                
                patientsSnapshot.forEach(patientDoc => {
                    const patientData = patientDoc.data();
                    patientsList.push({
                        id: patientDoc.id,
                        userId: userId, // Store the user ID who owns this patient
                        userName: userData.name || 'Dokter Tanpa Nama',
                        name: patientData.name || 'Pasien Tanpa Nama',
                        email: patientData.email || ''
                    });
                });
            }
            
            // Populate select dropdown
            if (patientsList.length === 0) {
                patientSelect.innerHTML = '<option value="">Tidak ada pasien. Silakan tambah pasien terlebih dahulu.</option>';
                patientSelect.disabled = true;
            } else {
                patientSelect.innerHTML = '<option value="">Pilih pasien...</option>';
                patientsList.forEach(patient => {
                    const option = document.createElement('option');
                    // Store both patientId and userId in the value (separated by |)
                    option.value = `${patient.id}|${patient.userId}`;
                    option.textContent = `${patient.name} (Dokter: ${patient.userName})`;
                    patientSelect.appendChild(option);
                });
            }
        } else {
            // Not admin or not authenticated - should not reach here due to redirect
            patientSelect.innerHTML = '<option value="">Akses ditolak</option>';
            patientSelect.disabled = true;
        }
    } catch (error) {
        console.error('Error loading patients:', error);
        patientSelect.innerHTML = '<option value="">Gagal memuat daftar pasien</option>';
        showStatus('error', 'Gagal memuat daftar pasien: ' + error.message);
    }
}

// Generate dummy data
async function generateDummyData() {
    const patientSelect = document.getElementById('patientSelect');
    const periodRadios = document.querySelectorAll('input[name="period"]');
    const typeRadios = document.querySelectorAll('input[name="dataType"]');
    const generateBtn = document.getElementById('generateBtn');
    
    // Get selected values
    const selectedValue = patientSelect.value;
    const period = Array.from(periodRadios).find(r => r.checked)?.value || 'weekly';
    const dataType = Array.from(typeRadios).find(r => r.checked)?.value || 'good';
    
    // Validate
    if (!selectedValue) {
        showStatus('error', 'Silakan pilih pasien terlebih dahulu!');
        return;
    }
    
    // Parse patientId and userId from selected value (format: "patientId|userId")
    const [patientId, userId] = selectedValue.split('|');
    
    // Validate parsed values
    if (!patientId || !userId) {
        showStatus('error', 'Data pasien tidak valid!');
        return;
    }
    
    // Verify admin access
    if (!isAdmin(currentUser)) {
        showStatus('error', 'Akses ditolak. Hanya admin yang dapat membuat data dummy.');
        return;
    }
    
    // Disable button and show loading
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="loading-spinner"></span> <span>Membuat data dummy...</span>';
    showStatus('info', 'Sedang membuat data dummy, mohon tunggu...');
    
    try {
        // Calculate number of records based on period
        const numRecords = period === 'weekly' ? 7 : 30;
        
        // Generate records
        const records = [];
        const now = new Date();
        
        for (let i = numRecords - 1; i >= 0; i--) {
            const recordDate = new Date(now);
            recordDate.setDate(recordDate.getDate() - i);
            recordDate.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0); // Random time between 8 AM - 8 PM
            
            // Generate data based on type
            const progress = (numRecords - i) / numRecords; // 0 to 1
            
            let avgMuscleActivity, movementCount, maxAcceleration, duration;
            let recordedData = [];
            
            if (dataType === 'good') {
                // Good: Increasing trend
                avgMuscleActivity = 30 + (progress * 40); // 30% to 70%
                movementCount = Math.floor(50 + (progress * 100)); // 50 to 150
                maxAcceleration = 1.5 + (progress * 1.5); // 1.5g to 3.0g
                duration = 300 + Math.floor(progress * 600); // 5 to 15 minutes
            } else if (dataType === 'bad') {
                // Bad: Decreasing trend
                avgMuscleActivity = 70 - (progress * 40); // 70% to 30%
                movementCount = Math.floor(150 - (progress * 100)); // 150 to 50
                maxAcceleration = 3.0 - (progress * 1.5); // 3.0g to 1.5g
                duration = 900 - Math.floor(progress * 600); // 15 to 5 minutes
            } else {
                // Random: Varied data
                avgMuscleActivity = 30 + Math.random() * 40; // 30% to 70%
                movementCount = Math.floor(50 + Math.random() * 100); // 50 to 150
                maxAcceleration = 1.5 + Math.random() * 1.5; // 1.5g to 3.0g
                duration = 300 + Math.floor(Math.random() * 600); // 5 to 15 minutes
            }
            
            // Add some randomness to make it more realistic
            avgMuscleActivity += (Math.random() - 0.5) * 10;
            avgMuscleActivity = Math.max(0, Math.min(100, avgMuscleActivity)); // Clamp 0-100
            movementCount = Math.max(10, movementCount + Math.floor((Math.random() - 0.5) * 20));
            maxAcceleration = Math.max(0.5, maxAcceleration + (Math.random() - 0.5) * 0.5);
            
            // Generate recordedData array (sensor data points)
            // Each record should have multiple data points (simulating real-time sensor data)
            const numDataPoints = Math.floor(duration / 2); // One data point every 2 seconds
            for (let j = 0; j < numDataPoints; j++) {
                // Generate IMU data (accelerometer)
                const baseAx = (Math.random() - 0.5) * 2; // -1 to 1
                const baseAy = (Math.random() - 0.5) * 2;
                const baseAz = 1 + (Math.random() - 0.5) * 0.5; // Around 1g (gravity)
                
                // Scale based on maxAcceleration
                const scale = maxAcceleration / 2;
                const ax = baseAx * scale;
                const ay = baseAy * scale;
                const az = baseAz * scale;
                
                // Generate EMG data
                // EMG voltage ranges from 0 to 3.3V, convert to percentage
                const emgPercent = avgMuscleActivity + (Math.random() - 0.5) * 20; // Add variation
                const emgVoltage = Math.max(0, Math.min(3.3, (emgPercent / 100) * 3.3));
                const emgRaw = Math.floor(emgVoltage * 1000); // Raw value (0-3300)
                
                recordedData.push({
                    ax: ax.toFixed(3),
                    ay: ay.toFixed(3),
                    az: az.toFixed(3),
                    gx: ((Math.random() - 0.5) * 0.5).toFixed(3), // Gyroscope (small values)
                    gy: ((Math.random() - 0.5) * 0.5).toFixed(3),
                    gz: ((Math.random() - 0.5) * 0.5).toFixed(3),
                    emg_voltage: emgVoltage.toFixed(3),
                    emg_raw: emgRaw,
                    timestamp: new Date(recordDate.getTime() + j * 2000) // 2 seconds apart
                });
            }
            
            // Format time
            const hours = String(recordDate.getHours()).padStart(2, '0');
            const minutes = String(recordDate.getMinutes()).padStart(2, '0');
            const time = `${hours}:${minutes}`;
            
            // Format dateMonthYear
            const day = String(recordDate.getDate()).padStart(2, '0');
            const month = String(recordDate.getMonth() + 1).padStart(2, '0');
            const year = recordDate.getFullYear();
            const dateMonthYear = `${day}/${month}/${year}`;
            
            // Create record object
            const record = {
                time: time,
                dateMonthYear: dateMonthYear,
                timestamp: firebase.firestore.Timestamp.fromDate(recordDate),
                duration: duration,
                avgMuscleActivity: Math.round(avgMuscleActivity * 10) / 10, // Round to 1 decimal
                movementCount: movementCount,
                maxAcceleration: Math.round(maxAcceleration * 100) / 100, // Round to 2 decimals
                recordedData: recordedData
            };
            
            records.push(record);
        }
        
        // Save records to Firestore
        // Admin can write to any patient's data
        let savedCount = 0;
        let errorCount = 0;
        
        for (const record of records) {
            try {
                // Admin writes to the patient's owner's collection
                await firestore.collection('users')
                    .doc(userId) // Use the patient's owner's userId
                    .collection('patients')
                    .doc(patientId)
                    .collection('monitoringRecords')
                    .add(record);
                
                savedCount++;
            } catch (error) {
                console.error('Error saving record:', error);
                errorCount++;
            }
        }
        
        // Show success message
        if (errorCount === 0) {
            showStatus('success', `Berhasil membuat ${savedCount} record dummy data untuk pasien!`);
            
            // Reset button
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="bi bi-magic"></i> <span>Generate Dummy Data</span>';
            
            // Optionally redirect to patient detail page
            setTimeout(() => {
                if (confirm('Data dummy berhasil dibuat! Ingin melihat detail pasien?')) {
                    window.location.href = `patient-detail.html?id=${patientId}`;
                }
            }, 2000);
        } else {
            showStatus('error', `Berhasil membuat ${savedCount} record, tetapi ${errorCount} record gagal disimpan.`);
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="bi bi-magic"></i> <span>Generate Dummy Data</span>';
        }
        
    } catch (error) {
        console.error('Error generating dummy data:', error);
        showStatus('error', 'Gagal membuat data dummy: ' + error.message);
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="bi bi-magic"></i> <span>Generate Dummy Data</span>';
    }
}

// Show status message
function showStatus(type, message) {
    const statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) return;
    
    statusDiv.className = `dummy-status ${type}`;
    statusDiv.innerHTML = `
        <div style="display: flex; align-items: start; gap: 0.75rem;">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'}" 
               style="font-size: 1.5rem; color: ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--danger-red)' : 'var(--primary-blue)'}; flex-shrink: 0;"></i>
            <div style="flex: 1;">
                <strong>${type === 'success' ? 'Berhasil!' : type === 'error' ? 'Error!' : 'Info'}</strong>
                <p style="margin: 0.5rem 0 0 0;">${message}</p>
            </div>
        </div>
    `;
    
    // Auto hide after 5 seconds for success/info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}
