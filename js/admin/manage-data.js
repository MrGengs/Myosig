// Manage Data JavaScript
// CRUD operations for patient monitoring records
// ADMIN ONLY — uses admin-shared.js for auth/logout/helpers

let usersList = [];
let patientsList = [];
let recordsList = [];
let currentSelectedUserId = null;
let currentSelectedPatientId = null;
let currentEditingRecordId = null;

// Init via admin-shared.js
initAdminPage(function () {
    loadUsersList();
});

// Load users list from Firestore
// Admin can see all users
async function loadUsersList() {
    const userSelect = document.getElementById('userSelect');
    if (!userSelect) return;
    
    try {
        if (firestore && currentUser && isAdmin(currentUser)) {
            // Admin: Get all users
            const usersSnapshot = await firestore.collection('users').get();
            
            usersList = [];
            
            usersSnapshot.forEach(userDoc => {
                const userData = userDoc.data();
                // Skip admin user
                if (userData.email !== ADMIN_EMAIL) {
                    usersList.push({
                        id: userDoc.id,
                        name: userData.name || 'Dokter Tanpa Nama',
                        email: userData.email || ''
                    });
                }
            });
            
            // Populate select dropdown
            if (usersList.length === 0) {
                userSelect.innerHTML = '<option value="">Tidak ada user. Silakan tambah user terlebih dahulu.</option>';
                userSelect.disabled = true;
            } else {
                userSelect.innerHTML = '<option value="">Pilih user...</option>';
                usersList.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = `${user.name} (${user.email})`;
                    userSelect.appendChild(option);
                });
            }
        } else {
            // Not admin or not authenticated
            userSelect.innerHTML = '<option value="">Akses ditolak</option>';
            userSelect.disabled = true;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        userSelect.innerHTML = '<option value="">Gagal memuat daftar user</option>';
        showStatus('error', 'Gagal memuat daftar user: ' + error.message);
    }
}

// Load patients for selected user
async function loadUserPatients() {
    const userSelect = document.getElementById('userSelect');
    const managePatientCard = document.getElementById('managePatientCard');
    const managePatientSelect = document.getElementById('managePatientSelect');
    const recordsCard = document.getElementById('recordsCard');
    
    // Get selected user ID
    const selectedUserId = userSelect.value;
    
    if (!selectedUserId) {
        // Hide patient and records sections
        managePatientCard.style.display = 'none';
        recordsCard.style.display = 'none';
        return;
    }
    
    currentSelectedUserId = selectedUserId;
    
    try {
        // Get patients for this user
        const patientsSnapshot = await firestore.collection('users')
            .doc(selectedUserId)
            .collection('patients')
            .get();
        
        patientsList = [];
        
        patientsSnapshot.forEach(patientDoc => {
            const patientData = patientDoc.data();
            patientsList.push({
                id: patientDoc.id,
                userId: selectedUserId,
                name: patientData.name || 'Pasien Tanpa Nama',
                email: patientData.email || ''
            });
        });
        
        // Populate patient select dropdown
        if (patientsList.length === 0) {
            managePatientSelect.innerHTML = '<option value="">Tidak ada pasien untuk user ini</option>';
            managePatientSelect.disabled = true;
        } else {
            managePatientSelect.innerHTML = '<option value="">Pilih pasien...</option>';
            patientsList.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = patient.name;
                managePatientSelect.appendChild(option);
            });
            managePatientSelect.disabled = false;
        }
        
        // Show patient selection card
        managePatientCard.style.display = 'block';
        
        // Hide records card until patient is selected
        recordsCard.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading patients:', error);
        showStatus('error', 'Gagal memuat daftar pasien: ' + error.message);
    }
}

// Load records for selected patient
async function loadPatientRecords() {
    const managePatientSelect = document.getElementById('managePatientSelect');
    const recordsCard = document.getElementById('recordsCard');
    const recordsListDiv = document.getElementById('recordsList');
    
    // Get selected patient ID
    const selectedPatientId = managePatientSelect.value;
    
    if (!selectedPatientId || !currentSelectedUserId) {
        recordsCard.style.display = 'none';
        return;
    }
    
    currentSelectedPatientId = selectedPatientId;
    
    try {
        // Show loading
        recordsListDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <i class="bi bi-hourglass-split" style="font-size: 2rem;"></i>
                <p style="margin-top: 1rem;">Memuat record...</p>
            </div>
        `;
        
        // Get records for this patient
        const recordsSnapshot = await firestore.collection('users')
            .doc(currentSelectedUserId)
            .collection('patients')
            .doc(selectedPatientId)
            .collection('monitoringRecords')
            .orderBy('timestamp', 'desc')
            .get();
        
        recordsList = [];
        
        recordsSnapshot.forEach(recordDoc => {
            const recordData = recordDoc.data();
            recordsList.push({
                id: recordDoc.id,
                ...recordData
            });
        });
        
        // Display records
        if (recordsList.length === 0) {
            recordsListDiv.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p style="margin-top: 1rem;">Belum ada record untuk pasien ini</p>
                </div>
            `;
        } else {
            displayRecords();
        }
        
        // Show records card
        recordsCard.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading records:', error);
        recordsListDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--danger-red);">
                <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                <p style="margin-top: 1rem;">Gagal memuat record: ${error.message}</p>
            </div>
        `;
        showStatus('error', 'Gagal memuat record: ' + error.message);
    }
}

// Display records in the list
function displayRecords() {
    const recordsListDiv = document.getElementById('recordsList');
    
    if (recordsList.length === 0) {
        recordsListDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                <p style="margin-top: 1rem;">Belum ada record</p>
            </div>
        `;
        return;
    }
    
    recordsListDiv.innerHTML = recordsList.map(record => {
        // Format dateMonthYear for display (convert DD-MM-YYYY to DD/MM/YYYY for better readability)
        let displayDate = record.dateMonthYear || 'N/A';
        if (displayDate !== 'N/A' && displayDate.includes('-')) {
            displayDate = displayDate.replace(/-/g, '/');
        }
        
        // Format time for display (show only HH:MM, remove seconds)
        let displayTime = record.time || 'N/A';
        if (displayTime !== 'N/A' && displayTime.includes(':')) {
            const timeParts = displayTime.split(':');
            displayTime = `${timeParts[0]}:${timeParts[1]}`; // Only HH:MM
        }
        
        return `
        <div class="record-item-card">
            <div class="record-item-header">
                <div class="record-item-info">
                    <div class="record-item-date">${displayDate}</div>
                    <div class="record-item-time">${displayTime}</div>
                </div>
                <div class="record-item-actions">
                    <button class="btn btn-primary btn-sm" onclick="editRecord('${record.id}')" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="deleteRecord('${record.id}')" title="Hapus">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="record-item-stats">
                <div class="record-item-stat">
                    <div class="record-item-stat-label">Aktivitas Otot</div>
                    <div class="record-item-stat-value">${record.avgMuscleActivity || 0}%</div>
                </div>
                <div class="record-item-stat">
                    <div class="record-item-stat-label">Jumlah Gerakan</div>
                    <div class="record-item-stat-value">${record.movementCount || 0}</div>
                </div>
                <div class="record-item-stat">
                    <div class="record-item-stat-label">Akselerasi Max</div>
                    <div class="record-item-stat-value">${record.maxAcceleration || 0}g</div>
                </div>
                <div class="record-item-stat">
                    <div class="record-item-stat-label">Durasi</div>
                    <div class="record-item-stat-value">${Math.floor((record.duration || 0) / 60)} menit</div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Show add record modal
function showAddRecordModal() {
    currentEditingRecordId = null;
    const modal = document.getElementById('recordModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('recordForm');
    
    // Set modal title
    modalTitle.textContent = 'Tambah Record Baru';
    
    // Reset form
    form.reset();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('recordDate').value = today;
    
    // Set default time to current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('recordTime').value = `${hours}:${minutes}`;
    
    // Show modal
    modal.style.display = 'flex';
}

// Edit record
function editRecord(recordId) {
    const record = recordsList.find(r => r.id === recordId);
    if (!record) {
        showStatus('error', 'Record tidak ditemukan');
        return;
    }
    
    currentEditingRecordId = recordId;
    const modal = document.getElementById('recordModal');
    const modalTitle = document.getElementById('modalTitle');
    
    // Set modal title
    modalTitle.textContent = 'Edit Record';
    
    // Parse date from dateMonthYear (format: DD-MM-YYYY or DD/MM/YYYY for backward compatibility)
    let dateParts;
    if (record.dateMonthYear.includes('-')) {
        dateParts = record.dateMonthYear.split('-');
    } else {
        dateParts = record.dateMonthYear.split('/');
    }
    const dateValue = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    
    // Parse time (format: HH:MM:SS or HH:MM for backward compatibility)
    let timeValue = record.time || '';
    if (timeValue && timeValue.split(':').length === 2) {
        // If only HH:MM, add :00 for seconds
        timeValue = timeValue + ':00';
    }
    
    // Fill form with record data
    document.getElementById('recordDate').value = dateValue;
    document.getElementById('recordTime').value = timeValue;
    document.getElementById('recordAvgMuscleActivity').value = record.avgMuscleActivity || 0;
    document.getElementById('recordMovementCount').value = record.movementCount || 0;
    document.getElementById('recordMaxAcceleration').value = record.maxAcceleration || 0;
    document.getElementById('recordDuration').value = record.duration || 0;
    
    // Show modal
    modal.style.display = 'flex';
}

// Close record modal
function closeRecordModal() {
    const modal = document.getElementById('recordModal');
    modal.style.display = 'none';
    currentEditingRecordId = null;
}

// Save record (Create or Update)
async function saveRecord(event) {
    event.preventDefault();
    
    if (!currentSelectedUserId || !currentSelectedPatientId) {
        showStatus('error', 'Silakan pilih user dan pasien terlebih dahulu!');
        return;
    }
    
    // Get form values
    const dateValue = document.getElementById('recordDate').value;
    const timeValue = document.getElementById('recordTime').value;
    const avgMuscleActivity = parseFloat(document.getElementById('recordAvgMuscleActivity').value);
    const movementCount = parseInt(document.getElementById('recordMovementCount').value);
    const maxAcceleration = parseFloat(document.getElementById('recordMaxAcceleration').value);
    const duration = parseInt(document.getElementById('recordDuration').value);
    
    // Parse date and time
    const date = new Date(dateValue);
    const timeParts = timeValue.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const seconds = timeParts.length > 2 ? parseInt(timeParts[2]) : 0;
    date.setHours(hours, minutes, seconds, 0);
    
    // Format dateMonthYear (format: DD-MM-YYYY to match sensors.js)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateMonthYear = `${day}-${month}-${year}`;
    
    // Format time (format: HH:MM:SS to match sensors.js)
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Create record object (format matches sensors.js)
    const recordData = {
        time: time,
        dateMonthYear: dateMonthYear,
        timestamp: firebase.firestore.Timestamp.fromDate(date),
        duration: duration,
        avgMuscleActivity: Math.round(avgMuscleActivity * 10) / 10,
        movementCount: movementCount,
        maxAcceleration: Math.round(maxAcceleration * 100) / 100,
        // Generate minimal recordedData for compatibility
        recordedData: [],
        // Add createdAt for consistency with sensors.js
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (currentEditingRecordId) {
            // Update existing record
            await firestore.collection('users')
                .doc(currentSelectedUserId)
                .collection('patients')
                .doc(currentSelectedPatientId)
                .collection('monitoringRecords')
                .doc(currentEditingRecordId)
                .update(recordData);
            
            showStatus('success', 'Record berhasil diperbarui!');
        } else {
            // Create new record
            await firestore.collection('users')
                .doc(currentSelectedUserId)
                .collection('patients')
                .doc(currentSelectedPatientId)
                .collection('monitoringRecords')
                .add(recordData);
            
            showStatus('success', 'Record berhasil ditambahkan!');
        }
        
        // Close modal
        closeRecordModal();
        
        // Reload records
        await loadPatientRecords();
        
    } catch (error) {
        console.error('Error saving record:', error);
        showStatus('error', 'Gagal menyimpan record: ' + error.message);
    }
}

// Delete record
async function deleteRecord(recordId) {
    if (!confirm('Apakah Anda yakin ingin menghapus record ini?')) {
        return;
    }
    
    if (!currentSelectedUserId || !currentSelectedPatientId) {
        showStatus('error', 'Data tidak valid!');
        return;
    }
    
    try {
        await firestore.collection('users')
            .doc(currentSelectedUserId)
            .collection('patients')
            .doc(currentSelectedPatientId)
            .collection('monitoringRecords')
            .doc(recordId)
            .delete();
        
        showStatus('success', 'Record berhasil dihapus!');
        
        // Reload records
        await loadPatientRecords();
        
    } catch (error) {
        console.error('Error deleting record:', error);
        showStatus('error', 'Gagal menghapus record: ' + error.message);
    }
}

// Show status message
function showStatus(type, message) {
    const statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) return;
    
    statusDiv.className = `dummy-status ${type}`;
    statusDiv.innerHTML = `
        <div style="display: flex; align-items: start; gap: 0.75rem;">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}" 
               style="font-size: 1.5rem; color: ${type === 'success' ? 'var(--accent-green)' : 'var(--danger-red)'}; flex-shrink: 0;"></i>
            <div style="flex: 1;">
                <strong>${type === 'success' ? 'Berhasil!' : 'Error!'}</strong>
                <p style="margin: 0.5rem 0 0 0;">${message}</p>
            </div>
        </div>
    `;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}
