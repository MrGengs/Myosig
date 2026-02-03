// Dashboard JavaScript with Firebase
// Load and display dashboard data

let sensorDataListener = null;
let currentSensorData = null;
let lastMpuUpdateTime = null; // Track last MPU update time
const MPU_TIMEOUT = 5000; // 5 seconds timeout for MPU data

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
            
            // User is logged in, load data
            loadUserData(user);
            loadDashboardData(user);
            setupSensorListener();
            loadRecentActivity(user);
            loadHealthTips();
        });
    } else {
        console.error('Firebase SDK not loaded');
        // Fallback to localStorage check
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'auth.html';
            return;
        }
        loadUserData();
        loadDashboardData();
        updateSensorStatus();
    }
});

// Load user data
function loadUserData(user = null) {
    if (user) {
        // Get user data from Firestore
        firestore.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const welcomeName = document.getElementById('welcomeName');
                if (welcomeName) {
                    welcomeName.textContent = `Selamat Datang, ${userData.name || user.displayName || 'Pengguna'}!`;
                }
                
                // Store in localStorage for quick access
                localStorage.setItem('userData', JSON.stringify({
                    uid: user.uid,
                    name: userData.name || user.displayName,
                    email: userData.email || user.email,
                    phone: userData.phone || ''
                }));
            } else {
                // User document doesn't exist, use auth data
                const welcomeName = document.getElementById('welcomeName');
                if (welcomeName) {
                    welcomeName.textContent = `Selamat Datang, ${user.displayName || 'Pengguna'}!`;
                }
            }
        }).catch(error => {
            console.error('Error loading user data:', error);
            // Fallback to auth data
            if (user) {
                const welcomeName = document.getElementById('welcomeName');
                if (welcomeName) {
                    welcomeName.textContent = `Selamat Datang, ${user.displayName || 'Pengguna'}!`;
                }
            }
        });
    } else {
        // Fallback to localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            const welcomeName = document.getElementById('welcomeName');
            if (welcomeName) {
                welcomeName.textContent = `Selamat Datang, ${user.name || 'Pengguna'}!`;
            }
        }
    }
}

// Load and display dashboard statistics
function loadDashboardData(user = null) {
    // Get user ID
    let userId = null;
    if (user) {
        userId = user.uid;
    } else {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userId = userData.uid;
    }
    
    if (userId && firestore) {
        // Load from Firestore - avoid orderBy to prevent index requirement
        firestore.collection('exercises')
            .where('userId', '==', userId)
            .get()
            .then(snapshot => {
                const exercises = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                    exercises.push({
                        ...data,
                        date: createdAt.toISOString(),
                        duration: parseInt(data.duration) || 0,
                        reps: parseInt(data.reps) || 0
                    });
                });
                // Sort by date descending for consistency
                exercises.sort((a, b) => new Date(b.date) - new Date(a.date));
                updateDashboardStats(exercises);
            })
            .catch(error => {
                console.error('Error loading exercises:', error);
                // Fallback to localStorage
                const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
                exercises.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                updateDashboardStats(exercises);
            });
    } else {
        // Fallback to localStorage or simulated data
        const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
        exercises.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        updateDashboardStats(exercises);
    }
}

// Update dashboard statistics
function updateDashboardStats(exercises) {
    if (!exercises || exercises.length === 0) {
        // Set default values
        const todayExercisesEl = document.getElementById('todayExercises');
        const totalMinutesEl = document.getElementById('totalMinutes');
        const progressPercentEl = document.getElementById('progressPercent');
        const streakDaysEl = document.getElementById('streakDays');
        const todayProgressBarEl = document.getElementById('todayProgressBar');
        const todayProgressValueEl = document.getElementById('todayProgressValue');
        
        if (todayExercisesEl) todayExercisesEl.textContent = '0';
        if (totalMinutesEl) totalMinutesEl.textContent = '0';
        if (progressPercentEl) progressPercentEl.textContent = '0%';
        if (streakDaysEl) streakDaysEl.textContent = '0';
        if (todayProgressBarEl) {
            todayProgressBarEl.style.width = '0%';
            todayProgressBarEl.textContent = '0%';
        }
        if (todayProgressValueEl) todayProgressValueEl.textContent = '0 menit';
        return;
    }
    
    // Filter today's exercises
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayExercises = exercises.filter(ex => {
        if (!ex.date) return false;
        const exDate = new Date(ex.date);
        exDate.setHours(0, 0, 0, 0);
        return exDate.getTime() === today.getTime();
    });
    
    const todayExercisesEl = document.getElementById('todayExercises');
    if (todayExercisesEl) {
        todayExercisesEl.textContent = todayExercises.length;
    }
    
    // Calculate total minutes
    const totalMinutes = exercises.reduce((sum, ex) => sum + (parseInt(ex.duration) || 0), 0);
    const totalMinutesEl = document.getElementById('totalMinutes');
    if (totalMinutesEl) {
        totalMinutesEl.textContent = totalMinutes;
    }
    
    // Progress percentage based on total exercises (target: 30 exercises)
    const progressPercent = Math.min(Math.floor((exercises.length / 30) * 100), 100);
    const progressPercentEl = document.getElementById('progressPercent');
    if (progressPercentEl) {
        progressPercentEl.textContent = progressPercent + '%';
    }
    
    // Calculate streak days (consecutive days with exercises)
    const uniqueDates = new Set();
    exercises.forEach(ex => {
        if (ex.date) {
            const dateStr = ex.date.split('T')[0];
            uniqueDates.add(dateStr);
        }
    });
    
    const sortedDates = Array.from(uniqueDates).sort();
    let streakDays = 0;
    let currentStreak = 1;
    
    if (sortedDates.length > 0) {
        const dateObjects = sortedDates.map(d => new Date(d)).sort((a, b) => b - a); // Sort descending
        
        for (let i = 0; i < dateObjects.length - 1; i++) {
            const currDate = dateObjects[i];
            const nextDate = dateObjects[i + 1];
            const diffDays = Math.floor((currDate - nextDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Consecutive day
                currentStreak++;
            } else {
                // Not consecutive, check if this is the longest streak
                streakDays = Math.max(streakDays, currentStreak);
                currentStreak = 1;
            }
        }
        streakDays = Math.max(streakDays, currentStreak);
    }
    
    const streakDaysEl = document.getElementById('streakDays');
    if (streakDaysEl) {
        streakDaysEl.textContent = streakDays;
    }
    
    // Today's progress
    const todayMinutes = todayExercises.reduce((sum, ex) => sum + (parseInt(ex.duration) || 0), 0);
    const progressPercentValue = Math.min(Math.round((todayMinutes / 30) * 100), 100);
    
    const todayProgressBarEl = document.getElementById('todayProgressBar');
    if (todayProgressBarEl) {
        todayProgressBarEl.style.width = progressPercentValue + '%';
        todayProgressBarEl.textContent = progressPercentValue + '%';
    }
    
    const todayProgressValueEl = document.getElementById('todayProgressValue');
    if (todayProgressValueEl) {
        todayProgressValueEl.textContent = todayMinutes + ' menit';
    }
}

// Load recent activity
function loadRecentActivity(user = null) {
    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;
    
    // Get user ID
    let userId = null;
    if (user) {
        userId = user.uid;
    } else {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userId = userData.uid;
    }
    
    if (userId && firestore) {
        // Load from Firestore - avoid orderBy to prevent index requirement
        firestore.collection('exercises')
            .where('userId', '==', userId)
            .get()
            .then(snapshot => {
                const activities = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                    activities.push({
                        ...data,
                        date: createdAt.toISOString(),
                        duration: parseInt(data.duration) || 0,
                        reps: parseInt(data.reps) || 0
                    });
                });
                // Sort by date descending and take first 3
                activities.sort((a, b) => new Date(b.date) - new Date(a.date));
                displayRecentActivity(activities.slice(0, 3));
            })
            .catch(error => {
                console.error('Error loading recent activity:', error);
                // Fallback to localStorage
                const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
                exercises.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                displayRecentActivity(exercises.slice(0, 3));
            });
    } else {
        // Fallback to localStorage
        const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
        exercises.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        displayRecentActivity(exercises.slice(0, 3));
    }
}

// Display recent activity
function displayRecentActivity(activities) {
    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;
    
    if (!activities || activities.length === 0) {
        timelineContainer.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-content">
                    <p style="color: var(--text-light); font-style: italic;">Belum ada aktivitas latihan</p>
                </div>
            </div>
        `;
        return;
    }
    
    const exerciseNames = {
        'lengan-kanan': 'Latihan Lengan Kanan',
        'lengan-kiri': 'Latihan Lengan Kiri',
        'peregangan': 'Latihan Peregangan',
        'koordinasi': 'Latihan Koordinasi',
        'kekuatan': 'Latihan Kekuatan'
    };
    
    timelineContainer.innerHTML = activities.map(activity => {
        let date;
        try {
            date = activity.date ? new Date(activity.date) : new Date();
        } catch (e) {
            date = new Date();
        }
        
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        let dateStr = '';
        if (diffMins < 60) {
            dateStr = `${diffMins} menit yang lalu`;
        } else if (diffHours < 24) {
            dateStr = `${diffHours} jam yang lalu`;
        } else if (diffDays === 1) {
            dateStr = 'Kemarin, ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            dateStr = date.toLocaleDateString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
        } else {
            dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
        }
        
        const exerciseName = exerciseNames[activity.type] || activity.type || 'Latihan';
        const duration = activity.duration || 0;
        const reps = activity.reps || 0;
        
        return `
            <div class="timeline-item">
                <div class="timeline-date">${dateStr}</div>
                <div class="timeline-content">
                    <strong>${exerciseName}</strong>
                    <p style="margin-top: 0.5rem; margin-bottom: 0;">Durasi: ${duration} menit | Repetisi: ${reps}x</p>
                </div>
            </div>
        `;
    }).join('');
}

// Setup sensor data listener from Realtime Database
function setupSensorListener() {
    if (!database) {
        console.error('Database not initialized');
        updateSensorStatus(); // Fallback to simulated
        return;
    }
    
    // Get selected device from localStorage or use default
    const selectedDevice = localStorage.getItem('selectedDevice') || 'device 2';
    
    // Listen to device data from selected device
    const deviceRef = database.ref(selectedDevice);
    
    sensorDataListener = deviceRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Check if MPU data exists and is recent
            if (data.ax !== undefined && data.ax !== null && 
                data.ay !== undefined && data.ay !== null && 
                data.az !== undefined && data.az !== null) {
                lastMpuUpdateTime = Date.now();
            }
            currentSensorData = data;
            updateSensorStatusFromData(data);
        } else {
            // No data available
            lastMpuUpdateTime = null;
            updateSensorStatus();
        }
    }, (error) => {
        console.error('Error reading sensor data:', error);
        lastMpuUpdateTime = null;
        updateSensorStatus(); // Fallback to simulated
    });
    
    // Check MPU timeout periodically
    setInterval(() => {
        if (lastMpuUpdateTime && (Date.now() - lastMpuUpdateTime) > MPU_TIMEOUT) {
            const armMovementElement = document.getElementById('armMovement');
            if (armMovementElement) {
                armMovementElement.textContent = 'Gerak Off';
            }
        } else if (!lastMpuUpdateTime) {
            const armMovementElement = document.getElementById('armMovement');
            if (armMovementElement) {
                armMovementElement.textContent = 'Gerak Off';
            }
        }
    }, 1000);
}

// Update monitoring data from real sensor data
function updateSensorStatusFromData(data) {
    // EMG - EMG Voltage
    const emgVoltage = data.emg_voltage || 0;
    const emgVoltageElement = document.getElementById('emgVoltage');
    if (emgVoltageElement) {
        emgVoltageElement.textContent = emgVoltage.toFixed(2);
    }
    
    // Calculate EMG intensity (0-100%) - EMG typically outputs 0-3.3V
    const emgIntensity = Math.min((emgVoltage / 3.3) * 100, 100);
    const emgProgress = document.getElementById('emgProgress');
    if (emgProgress) {
        emgProgress.style.width = emgIntensity + '%';
        emgProgress.textContent = Math.round(emgIntensity) + '%';
    }
    
    // MPU - Calculate acceleration magnitude
    const ax = data.ax || 0;
    const ay = data.ay || 0;
    const az = data.az || 0;
    const accelMagnitude = Math.sqrt(ax * ax + ay * ay + az * az);
    
    const accelMagnitudeElement = document.getElementById('accelMagnitude');
    if (accelMagnitudeElement) {
        accelMagnitudeElement.textContent = accelMagnitude.toFixed(2);
    }
    
    // Determine arm movement status - check if MPU data is present
    let armMovement = 'Gerak Off'; // Default to 'Gerak Off' if no MPU data
    if (data.ax !== undefined && data.ax !== null) {
        // MPU data is present, determine status based on movement
        if (accelMagnitude > 1.5) {
            armMovement = 'Gerak Aktif';
        } else if (accelMagnitude > 0.5) {
            armMovement = 'Gerak Ringan';
        } else {
            armMovement = 'Stabil';
        }
    }
    
    const armMovementElement = document.getElementById('armMovement');
    if (armMovementElement) {
        armMovementElement.textContent = armMovement;
    }
}

// Update monitoring data (simulated fallback)
function updateSensorStatus() {
    // Simulate EMG data (0-3.3V typical range)
    const emgVoltage = Math.random() * 2.5; // 0-2.5V for simulation
    const emgVoltageElement = document.getElementById('emgVoltage');
    if (emgVoltageElement) {
        emgVoltageElement.textContent = emgVoltage.toFixed(2);
    }
    
    // Calculate EMG intensity
    const emgIntensity = Math.min((emgVoltage / 3.3) * 100, 100);
    const emgProgress = document.getElementById('emgProgress');
    if (emgProgress) {
        emgProgress.style.width = emgIntensity + '%';
        emgProgress.textContent = Math.round(emgIntensity) + '%';
    }
    
    // Simulate MPU data - but show "Gerak Off" if no real connection
    if (!sensorDataListener || !lastMpuUpdateTime) {
        // No real data connection, show "Gerak Off"
        const armMovementElement = document.getElementById('armMovement');
        if (armMovementElement) {
            armMovementElement.textContent = 'Gerak Off';
        }
        
        const accelMagnitudeElement = document.getElementById('accelMagnitude');
        if (accelMagnitudeElement) {
            accelMagnitudeElement.textContent = '0.00';
        }
        return;
    }
    
    // Simulate MPU data only if we have real connection
    const ax = (Math.random() * 4 - 2);
    const ay = (Math.random() * 4 - 2);
    const az = (Math.random() * 4 - 2);
    const accelMagnitude = Math.sqrt(ax * ax + ay * ay + az * az);
    
    const accelMagnitudeElement = document.getElementById('accelMagnitude');
    if (accelMagnitudeElement) {
        accelMagnitudeElement.textContent = accelMagnitude.toFixed(2);
    }
    
    // Determine arm movement status
    let armMovement = 'Stabil';
    if (accelMagnitude > 1.5) {
        armMovement = 'Gerak Aktif';
    } else if (accelMagnitude > 0.5) {
        armMovement = 'Gerak Ringan';
    }
    
    const armMovementElement = document.getElementById('armMovement');
    if (armMovementElement) {
        armMovementElement.textContent = armMovement;
    }
}

// Load health tips from AI
async function loadHealthTips() {
    const healthTipsDiv = document.getElementById('healthTips');
    if (!healthTipsDiv) return;
    
    try {
        // Get AI health tips
        const tips = await getAIHealthTips();
        
        // Parse tips (format: "Title\nDescription")
        // Remove any remaining markdown formatting
        let cleanTips = tips;
        cleanTips = cleanTips.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold**
        cleanTips = cleanTips.replace(/__(.*?)__/g, '$1'); // Remove __bold__
        cleanTips = cleanTips.replace(/\*(.*?)\*/g, '$1'); // Remove *italic*
        cleanTips = cleanTips.replace(/_(.*?)_/g, '$1'); // Remove _italic_
        cleanTips = cleanTips.replace(/^#+\s*/gm, ''); // Remove # headers
        cleanTips = cleanTips.replace(/`(.*?)`/g, '$1'); // Remove `code`
        cleanTips = cleanTips.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove [links](url)
        
        const lines = cleanTips.split('\n').filter(line => line.trim() !== '');
        const title = lines[0] || 'Tips Kesehatan';
        const description = lines.slice(1).join('\n').trim() || cleanTips;
        
        // Update UI with clean formatting
        healthTipsDiv.innerHTML = `
            <i class="bi bi-lightbulb-fill" style="font-size: 1.5rem; color: var(--primary-blue);"></i>
            <div>
                <strong style="color: var(--text-dark);">${title}</strong>
                <p style="margin: 0; margin-top: 0.25rem; color: var(--text-gray); white-space: pre-line; line-height: 1.6;">${description}</p>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading health tips:', error);
        healthTipsDiv.innerHTML = `
            <i class="bi bi-info-circle" style="font-size: 1.5rem;"></i>
            <div>
                <strong style="color: var(--text-dark);">Istirahat yang Cukup</strong>
                <p style="margin: 0; margin-top: 0.25rem; color: var(--text-gray);">Pastikan Anda beristirahat minimal 8 jam setiap malam untuk pemulihan yang optimal setelah latihan rehabilitasi.</p>
            </div>
        `;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (sensorDataListener && database) {
        const selectedDevice = localStorage.getItem('selectedDevice') || 'device 2';
        database.ref(selectedDevice).off('value', sensorDataListener);
    }
});
