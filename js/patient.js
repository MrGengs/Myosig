// Patient JavaScript - Doctor's Patient Management
// Handle patient list page with CRUD operations

let currentUser = null;
let currentEditingPatientId = null;
let allPatients = []; // Store all patients for filtering

// Initialize patient page
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
            loadPatientsList();
        });
    } else {
        // Fallback to localStorage check
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'auth.html';
            return;
        }
        
        loadPatientsList();
    }
});

// Load patients list from Firestore
async function loadPatientsList() {
    const patientList = document.getElementById('patientList');
    if (!patientList) return;
    
    // Show loading state
    patientList.innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem;">
            <i class="bi bi-hourglass-split" style="font-size: 2rem; color: var(--text-light);"></i>
            <p style="margin-top: 1rem; color: var(--text-light);">Memuat daftar pasien...</p>
        </div>
    `;
    
    try {
        if (firestore && currentUser) {
            // Get all patients from subcollection under this doctor's document
            const snapshot = await firestore.collection('users')
                .doc(currentUser.uid)
                .collection('patients')
                .get();
            
            allPatients = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                allPatients.push({
                    id: doc.id,
                    name: data.name || 'Tanpa Nama',
                    email: data.email || '-',
                    phone: data.phone || '-',
                    birthDate: data.birthDate || '',
                    gender: data.gender || '-',
                    address: data.address || '-',
                    strokeDate: data.strokeDate || '',
                    medicalNotes: data.medicalNotes || ''
                });
            });
            
            // Sort by name
            allPatients.sort((a, b) => a.name.localeCompare(b.name));
            
            displayPatientsList(allPatients);
        } else {
            // Fallback: show empty state
            patientList.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-exclamation-circle"></i>
                    <p>Firestore tidak tersedia. Tidak dapat memuat daftar pasien.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading patients:', error);
        patientList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle"></i>
                <p>Gagal memuat daftar pasien: ${error.message}</p>
            </div>
        `;
    }
}

// Display patients list
function displayPatientsList(patients) {
    const patientList = document.getElementById('patientList');
    if (!patientList) return;
    
    if (!patients || patients.length === 0) {
        patientList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-person-x"></i>
                <p>Belum ada pasien terdaftar.</p>
            </div>
        `;
        return;
    }
    
    patientList.innerHTML = patients.map(patient => {
        // Get first letter of name for avatar
        const firstLetter = patient.name.charAt(0).toUpperCase();
        
        return `
            <div class="patient-list-item" onclick="viewPatientDetail('${patient.id}')">
                <div class="patient-avatar">
                    <i class="bi bi-person-heart"></i>
                </div>
                <div class="patient-info">
                    <div class="patient-name">${patient.name}</div>
                    <div class="patient-details">
                        <span><i class="bi bi-envelope"></i> ${patient.email}</span>
                        ${patient.phone !== '-' ? `<span><i class="bi bi-telephone"></i> ${patient.phone}</span>` : ''}
                    </div>
                </div>
                <div class="patient-actions" onclick="event.stopPropagation();">
                    <button onclick="editPatient('${patient.id}')" class="btn btn-sm btn-secondary btn-icon" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button onclick="deletePatient('${patient.id}', '${patient.name}')" class="btn btn-sm btn-danger btn-icon" title="Hapus">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Filter patients based on search input
function filterPatients() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayPatientsList(allPatients);
        return;
    }
    
    const filtered = allPatients.filter(patient => {
        return patient.name.toLowerCase().includes(searchTerm) ||
               patient.email.toLowerCase().includes(searchTerm) ||
               (patient.phone && patient.phone.toLowerCase().includes(searchTerm));
    });
    
    displayPatientsList(filtered);
}

// View patient detail (navigate to patient detail page)
function viewPatientDetail(patientId) {
    window.location.href = `patient-detail.html?id=${patientId}`;
}

// Show add patient modal
function showAddPatientModal() {
    currentEditingPatientId = null;
    const modal = document.getElementById('patientModal');
    const modalTitle = document.getElementById('patientModalTitle');
    
    if (!modal) return;
    
    // Set title
    if (modalTitle) {
        modalTitle.textContent = 'Tambah Pasien';
    }
    
    // Clear form
    document.getElementById('patientName').value = '';
    document.getElementById('patientEmail').value = '';
    document.getElementById('patientPhone').value = '';
    document.getElementById('patientBirthDate').value = '';
    document.getElementById('patientGender').value = '';
    document.getElementById('patientAddress').value = '';
    document.getElementById('patientStrokeDate').value = '';
    document.getElementById('patientMedicalNotes').value = '';
    
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
}

// Edit patient
function editPatient(patientId) {
    const patient = allPatients.find(p => p.id === patientId);
    if (!patient) return;
    
    currentEditingPatientId = patientId;
    const modal = document.getElementById('patientModal');
    const modalTitle = document.getElementById('patientModalTitle');
    
    if (!modal) return;
    
    // Set title
    if (modalTitle) {
        modalTitle.textContent = 'Edit Pasien';
    }
    
    // Fill form with patient data
    document.getElementById('patientName').value = patient.name || '';
    document.getElementById('patientEmail').value = patient.email || '';
    document.getElementById('patientPhone').value = patient.phone || '';
    document.getElementById('patientBirthDate').value = patient.birthDate || '';
    document.getElementById('patientGender').value = patient.gender || '';
    document.getElementById('patientAddress').value = patient.address || '';
    document.getElementById('patientStrokeDate').value = patient.strokeDate || '';
    document.getElementById('patientMedicalNotes').value = patient.medicalNotes || '';
    
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
}

// Close patient modal
function closePatientModal() {
    const modal = document.getElementById('patientModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }
    currentEditingPatientId = null;
}

// Save patient (create or update)
async function savePatient() {
    const name = document.getElementById('patientName').value.trim();
    const email = document.getElementById('patientEmail').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const birthDate = document.getElementById('patientBirthDate').value;
    const gender = document.getElementById('patientGender').value;
    const address = document.getElementById('patientAddress').value.trim();
    const strokeDate = document.getElementById('patientStrokeDate').value;
    const medicalNotes = document.getElementById('patientMedicalNotes').value.trim();
    
    // Validation
    if (!name) {
        if (typeof showAlert === 'function') {
            showAlert('Nama harus diisi!', 'Validasi');
        } else {
            alert('Nama harus diisi!');
        }
        return;
    }
    
    if (!email) {
        if (typeof showAlert === 'function') {
            showAlert('Email harus diisi!', 'Validasi');
        } else {
            alert('Email harus diisi!');
        }
        return;
    }
    
    // Show loading
    const saveBtn = event?.target || document.querySelector('button[onclick="savePatient()"]');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Menyimpan...';
    
    try {
        const patientData = {
            name: name,
            email: email,
            phone: phone || '',
            birthDate: birthDate || '',
            gender: gender || '',
            address: address || '',
            strokeDate: strokeDate || '',
            medicalNotes: medicalNotes || '',
            updatedAt: firebase && firebase.firestore ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
        };
        
        if (currentEditingPatientId) {
            // Update existing patient in subcollection
            if (firestore && currentUser) {
                await firestore.collection('users')
                    .doc(currentUser.uid)
                    .collection('patients')
                    .doc(currentEditingPatientId)
                    .update(patientData);
                
                if (typeof showAlert === 'function') {
                    showAlert('Data pasien berhasil diperbarui!', 'Berhasil');
                } else {
                    alert('Data pasien berhasil diperbarui!');
                }
            }
        } else {
            // Create new patient in subcollection under doctor's document
            if (firestore && currentUser) {
                patientData.createdAt = firebase && firebase.firestore ? firebase.firestore.FieldValue.serverTimestamp() : new Date();
                await firestore.collection('users')
                    .doc(currentUser.uid)
                    .collection('patients')
                    .add(patientData);
                
                if (typeof showAlert === 'function') {
                    showAlert('Pasien baru berhasil ditambahkan!', 'Berhasil');
                } else {
                    alert('Pasien baru berhasil ditambahkan!');
                }
            }
        }
        
        // Reset button
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        // Close modal
        closePatientModal();
        
        // Reload patients list
        await loadPatientsList();
        
    } catch (error) {
        console.error('Error saving patient:', error);
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        if (typeof showAlert === 'function') {
            showAlert('Gagal menyimpan data pasien: ' + error.message, 'Kesalahan');
        } else {
            alert('Gagal menyimpan data pasien: ' + error.message);
        }
    }
}

// Delete patient
async function deletePatient(patientId, patientName) {
    if (typeof showConfirm === 'function') {
        showConfirm(
            `Apakah Anda yakin ingin menghapus pasien "${patientName}"? Tindakan ini tidak dapat dibatalkan.`,
            'Konfirmasi Hapus',
            async () => {
                await performDeletePatient(patientId);
            }
        );
    } else {
        if (confirm(`Apakah Anda yakin ingin menghapus pasien "${patientName}"?`)) {
            await performDeletePatient(patientId);
        }
    }
}

// Perform delete patient
async function performDeletePatient(patientId) {
    try {
        if (firestore && currentUser) {
            await firestore.collection('users')
                .doc(currentUser.uid)
                .collection('patients')
                .doc(patientId)
                .delete();
            
            if (typeof showAlert === 'function') {
                showAlert('Pasien berhasil dihapus!', 'Berhasil');
            } else {
                alert('Pasien berhasil dihapus!');
            }
            
            // Reload patients list
            await loadPatientsList();
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        if (typeof showAlert === 'function') {
            showAlert('Gagal menghapus pasien: ' + error.message, 'Kesalahan');
        } else {
            alert('Gagal menghapus pasien: ' + error.message);
        }
    }
}
