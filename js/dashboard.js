// Dashboard JavaScript with Firebase
// Load and display dashboard data for doctors

let currentUser = null;

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
            
            // User is logged in, load data
            loadUserData(user);
            loadDashboardData(user);
            loadRecentRecords(user);
            loadPatientSummary();
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
                    welcomeName.textContent = `Selamat Datang, ${userData.name || user.displayName || 'Dokter'}!`;
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
                    welcomeName.textContent = `Selamat Datang, ${user.displayName || 'Dokter'}!`;
                }
            }
        }).catch(error => {
            console.error('Error loading user data:', error);
            // Fallback to auth data
            if (user) {
                const welcomeName = document.getElementById('welcomeName');
                if (welcomeName) {
                    welcomeName.textContent = `Selamat Datang, ${user.displayName || 'Dokter'}!`;
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
                welcomeName.textContent = `Selamat Datang, ${user.name || 'Dokter'}!`;
            }
        }
    }
}

// Load and display dashboard statistics for doctors
async function loadDashboardData(user = null) {
    try {
        if (firestore && user) {
            // Get all patients first (we'll use this for both total count and records)
            const patientsSnapshot = await firestore.collection('users')
                .doc(user.uid)
                .collection('patients')
                .get();
            
            // Get total patients count
            const totalPatients = patientsSnapshot.size;
            const totalPatientsEl = document.getElementById('totalPatients');
            if (totalPatientsEl) {
                totalPatientsEl.textContent = totalPatients;
            }
            
            // Get all monitoring records for this doctor from all patients' subcollections
            // Structure: users/{userId}/patients/{patientId}/monitoringRecords/{recordId}
            const allRecords = [];
            
            // Get records from each patient's subcollection
            for (const patientDoc of patientsSnapshot.docs) {
                const patientId = patientDoc.id;
                const recordsSnapshot = await firestore.collection('users')
                    .doc(user.uid)
                    .collection('patients')
                    .doc(patientId)
                    .collection('monitoringRecords')
                    .get();
                
                recordsSnapshot.forEach(doc => {
                    const data = doc.data();
                    allRecords.push({
                        ...data,
                        patientId: patientId, // Ensure patientId is included
                        timestamp: data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp)) : new Date()
                    });
                });
            }
            
            const totalRecords = allRecords.length;
            const totalRecordsEl = document.getElementById('totalRecords');
            if (totalRecordsEl) {
                totalRecordsEl.textContent = totalRecords;
            }
            
            // Get today's records
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayRecords = allRecords.filter(record => {
                const recordDate = record.timestamp;
                recordDate.setHours(0, 0, 0, 0);
                return recordDate.getTime() === today.getTime();
            });
            
            const todayRecordsEl = document.getElementById('todayRecords');
            if (todayRecordsEl) {
                todayRecordsEl.textContent = todayRecords.length;
            }
            
            // Calculate average activity
            let totalActivity = 0;
            let activityCount = 0;
            allRecords.forEach(record => {
                if (record.avgMuscleActivity !== undefined && record.avgMuscleActivity !== null) {
                    totalActivity += record.avgMuscleActivity;
                    activityCount++;
                }
            });
            
            const avgActivity = activityCount > 0 ? Math.round(totalActivity / activityCount) : 0;
            const avgActivityEl = document.getElementById('avgActivity');
            if (avgActivityEl) {
                avgActivityEl.textContent = avgActivity + '%';
            }
            
        } else {
            // Fallback: set default values
            document.getElementById('totalPatients').textContent = '0';
            document.getElementById('totalRecords').textContent = '0';
            document.getElementById('todayRecords').textContent = '0';
            document.getElementById('avgActivity').textContent = '0%';
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default values on error
        document.getElementById('totalPatients').textContent = '0';
        document.getElementById('totalRecords').textContent = '0';
        document.getElementById('todayRecords').textContent = '0';
        document.getElementById('avgActivity').textContent = '0%';
    }
}

// Load recent records
async function loadRecentRecords(user = null) {
    const timelineContainer = document.getElementById('recentRecordsTimeline');
    if (!timelineContainer) return;
    
    try {
        if (firestore && user) {
            // Get recent monitoring records (last 5) for this doctor from all patients' subcollections
            // Structure: users/{userId}/patients/{patientId}/monitoringRecords/{recordId}
            const allRecords = [];
            
            // Get all patients first
            const patientsSnapshot = await firestore.collection('users')
                .doc(user.uid)
                .collection('patients')
                .get();
            
            // Get records from each patient's subcollection
            for (const patientDoc of patientsSnapshot.docs) {
                const patientId = patientDoc.id;
                try {
                    const recordsSnapshot = await firestore.collection('users')
                        .doc(user.uid)
                        .collection('patients')
                        .doc(patientId)
                        .collection('monitoringRecords')
                        .orderBy('createdAt', 'desc')
                        .limit(10) // Get more from each patient to ensure we have enough for top 5
                        .get();
                    
                    recordsSnapshot.forEach(doc => {
                        const data = doc.data();
                        allRecords.push({
                            id: doc.id,
                            patientId: patientId, // Ensure patientId is included
                            ...data,
                            timestamp: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date()
                        });
                    });
                } catch (e) {
                    // If orderBy fails (no index), get all and sort in memory
                    console.warn(`OrderBy failed for patient ${patientId}, getting all records:`, e);
                    const allSnapshot = await firestore.collection('users')
                        .doc(user.uid)
                        .collection('patients')
                        .doc(patientId)
                        .collection('monitoringRecords')
                        .get();
                    
                    allSnapshot.forEach(doc => {
                        const data = doc.data();
                        allRecords.push({
                            id: doc.id,
                            patientId: patientId,
                            ...data,
                            timestamp: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date()
                        });
                    });
                }
            }
            
            // Sort by timestamp descending and take first 5
            allRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            const records = allRecords.slice(0, 5);
            
            // Get patient names
            const patientIds = [...new Set(records.map(r => r.patientId))];
            const patientNames = {};
            
            for (const patientId of patientIds) {
                if (patientId && user) {
                    try {
                        const patientDoc = await firestore.collection('users')
                            .doc(user.uid)
                            .collection('patients')
                            .doc(patientId)
                            .get();
                        if (patientDoc.exists) {
                            patientNames[patientId] = patientDoc.data().name || 'Pasien';
                        }
                    } catch (e) {
                        console.error('Error loading patient name:', e);
                    }
                }
            }
            
            displayRecentRecords(records, patientNames);
        } else {
            timelineContainer.innerHTML = `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <p style="color: var(--text-light); font-style: italic;">Belum ada record monitoring</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading recent records:', error);
        timelineContainer.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-content">
                    <p style="color: var(--text-light); font-style: italic;">Gagal memuat record</p>
                </div>
            </div>
        `;
    }
}

// Display recent records
function displayRecentRecords(records, patientNames) {
    const timelineContainer = document.getElementById('recentRecordsTimeline');
    if (!timelineContainer) return;
    
    if (!records || records.length === 0) {
        timelineContainer.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-content">
                    <p style="color: var(--text-light); font-style: italic;">Belum ada record monitoring</p>
                </div>
            </div>
        `;
        return;
    }
    
    timelineContainer.innerHTML = records.map(record => {
        const date = record.timestamp;
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
        
        const patientName = patientNames[record.patientId] || 'Pasien';
        const duration = record.duration || 0;
        const activity = record.avgMuscleActivity || 0;
        
        return `
            <div class="timeline-item">
                <div class="timeline-date">${dateStr}</div>
                <div class="timeline-content">
                    <strong>${patientName}</strong>
                    <p style="margin-top: 0.5rem; margin-bottom: 0;">
                        Durasi: ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')} | 
                        Aktivitas: ${activity}%
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// Load patient summary
async function loadPatientSummary() {
    const patientSummary = document.getElementById('patientSummary');
    if (!patientSummary) return;
    
    // Get current user
    let userId = null;
    if (currentUser) {
        userId = currentUser.uid;
    } else {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userId = userData.uid;
    }
    
    if (!userId || !firestore) {
        patientSummary.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <i class="bi bi-exclamation-circle" style="font-size: 2rem;"></i>
                <p style="margin-top: 1rem;">Tidak dapat memuat data pasien</p>
            </div>
        `;
        return;
    }
    
    try {
        // Get first 5 patients from subcollection under this doctor's document
        const snapshot = await firestore.collection('users')
            .doc(userId)
            .collection('patients')
            .limit(5)
            .get();
        
        const patients = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            patients.push({
                id: doc.id,
                name: data.name || 'Tanpa Nama',
                email: data.email || '-'
            });
        });
        
        if (patients.length === 0) {
            patientSummary.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                    <i class="bi bi-person-x" style="font-size: 2rem;"></i>
                    <p style="margin-top: 1rem;">Belum ada pasien terdaftar</p>
                    <a href="patient.html" class="btn btn-primary" style="margin-top: 1rem; text-decoration: none;">
                        <i class="bi bi-plus-circle"></i> Tambah Pasien
                    </a>
                </div>
            `;
            return;
        }
        
        patientSummary.innerHTML = patients.map(patient => {
            return `
                <div style="padding: 0.75rem; border-bottom: 1px solid var(--lighter-blue); display: flex; align-items: center; gap: 1rem; cursor: pointer;" onclick="window.location.href='patient-detail.html?id=${patient.id}'">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: var(--white);">
                        <i class="bi bi-person-heart"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-dark);">${patient.name}</div>
                        <div style="font-size: 0.85rem; color: var(--text-light);">${patient.email}</div>
                    </div>
                    <i class="bi bi-chevron-right" style="color: var(--text-light);"></i>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading patient summary:', error);
        patientSummary.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                <p style="margin-top: 1rem;">Gagal memuat data pasien</p>
            </div>
        `;
    }
}
