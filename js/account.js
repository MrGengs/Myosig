// Account JavaScript
// Handle account settings and profile management

let currentUser = null;

// Show edit profile modal
function toggleEditMode() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        // Load current data into form first
        if (currentUser) {
            loadUserProfile(currentUser);
            loadHealthInfo(currentUser);
        } else {
            // Fallback to localStorage
            loadUserProfile();
            loadHealthInfo();
        }
        
        // Show modal
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

// Close edit profile modal
function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }
}

// Save all profile data (profile + health info)
async function saveAllProfileData() {
    // Get form values
    const name = document.getElementById('profileName').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const birthDate = document.getElementById('profileBirthDate').value;
    const gender = document.getElementById('profileGender')?.value || '';
    const address = document.getElementById('profileAddress')?.value.trim() || '';
    const strokeDate = document.getElementById('strokeDate').value;
    const medicalNotes = document.getElementById('medicalNotes').value.trim();
    
    // Validation
    if (!name || !email) {
        if (typeof showAlert === 'function') {
            showAlert('Nama dan email harus diisi!', 'Validasi');
        } else {
            alert('Nama dan email harus diisi!');
        }
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (typeof showAlert === 'function') {
            showAlert('Format email tidak valid!', 'Validasi');
        } else {
            alert('Format email tidak valid!');
        }
        return;
    }
    
    // Phone validation (if provided)
    if (phone && !/^[0-9]{10,13}$/.test(phone.replace(/\s/g, ''))) {
        if (typeof showAlert === 'function') {
            showAlert('Format nomor telepon tidak valid! Gunakan 10-13 digit angka.', 'Validasi');
        } else {
            alert('Format nomor telepon tidak valid! Gunakan 10-13 digit angka.');
        }
        return;
    }
    
    // Show loading
    const saveBtn = event?.target || document.querySelector('button[onclick="saveAllProfileData()"]');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Menyimpan...';
    
    try {
        // Save to Firestore if available
        if (currentUser && firestore) {
            const updateData = {
                name: name,
                email: email,
                phone: phone,
                birthDate: birthDate,
                gender: gender,
                address: address,
                strokeDate: strokeDate,
                medicalNotes: medicalNotes,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                healthInfoUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await firestore.collection('users').doc(currentUser.uid).update(updateData);
            
            // Update Firebase Auth email if changed
            if (email !== currentUser.email) {
                try {
                    await currentUser.updateEmail(email);
                    console.log('Email updated in Firebase Auth');
                } catch (error) {
                    console.error('Error updating email:', error);
                    // Email might require re-authentication, but continue with profile update
                }
            }
            
            // Update display name if changed
            if (name !== currentUser.displayName) {
                try {
                    await currentUser.updateProfile({
                        displayName: name
                    });
                } catch (error) {
                    console.error('Error updating display name:', error);
                }
            }
            
            console.log('Profile and health info updated in Firestore');
        }
        
        // Save to localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.name = name;
        userData.email = email;
        userData.phone = phone;
        userData.birthDate = birthDate;
        userData.gender = gender;
        userData.address = address;
        userData.updatedAt = new Date().toISOString();
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userEmail', email);
        
        // Save health info to localStorage
        const healthInfo = {
            strokeDate: strokeDate,
            medicalNotes: medicalNotes,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem('healthInfo', JSON.stringify(healthInfo));
        
        // Update header
        const userNameEl = document.getElementById('userName');
        const userEmailEl = document.getElementById('userEmail');
        if (userNameEl) userNameEl.textContent = name;
        if (userEmailEl) userEmailEl.textContent = email;
        
        // Reset button
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        // Show success message
        if (typeof showAlert === 'function') {
            showAlert('Semua data berhasil disimpan!', 'Berhasil');
        } else {
            alert('Semua data berhasil disimpan!');
        }
        
        // Close modal after successful save
        setTimeout(() => {
            closeEditModal();
        }, 1000);
        
    } catch (error) {
        console.error('Error saving profile data:', error);
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        let errorMessage = 'Terjadi kesalahan saat menyimpan data.';
        if (error.code === 'permission-denied') {
            errorMessage = 'Anda tidak memiliki izin untuk memperbarui profil.';
        } else if (error.code === 'unavailable') {
            errorMessage = 'Layanan tidak tersedia. Silakan coba lagi nanti.';
        } else if (error.message) {
            errorMessage += ' ' + error.message;
        }
        
        if (typeof showAlert === 'function') {
            showAlert(errorMessage, 'Kesalahan');
        } else {
            alert(errorMessage);
        }
    }
}

// Check if user is logged in
window.addEventListener('DOMContentLoaded', function() {
    // Set max date for birth date (today)
    const birthDateInput = document.getElementById('profileBirthDate');
    if (birthDateInput) {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 10); // Minimum 10 years old
        birthDateInput.max = today.toISOString().split('T')[0];
    }
    
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
            loadUserProfile(user);
            loadHealthInfo(user);
        });
    } else {
        // Fallback to localStorage check
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'auth.html';
            return;
        }
        
        loadUserProfile();
        loadHealthInfo();
    }
});

// Load user profile data
function loadUserProfile(user = null) {
    if (user && firestore) {
        // Load from Firestore
        firestore.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                
                // Display user name and email in header
                const userNameEl = document.getElementById('userName');
                const userEmailEl = document.getElementById('userEmail');
                
                if (userNameEl) {
                    userNameEl.textContent = userData.name || user.displayName || 'Pengguna';
                }
                if (userEmailEl) {
                    userEmailEl.textContent = userData.email || user.email || 'user@example.com';
                }
                
                // Display user photo if available
                const userProfilePhoto = document.getElementById('userProfilePhoto');
                const userProfileIcon = document.getElementById('userProfileIcon');
                const userProfileImage = document.getElementById('userProfileImage');
                
                // Get photoURL from userData (Firestore) or user object (Firebase Auth)
                // Priority: Firestore data > Firebase Auth user object
                const photoURL = userData.photoURL || (user ? user.photoURL : '') || '';
                
                if (photoURL && userProfilePhoto && userProfileIcon && userProfileImage) {
                    // Show image, hide icon
                    userProfileImage.src = photoURL;
                    userProfileImage.style.display = 'block';
                    userProfileIcon.style.display = 'none';
                    userProfilePhoto.style.background = 'transparent';
                } else if (userProfilePhoto && userProfileIcon && userProfileImage) {
                    // Show icon, hide image
                    userProfileImage.style.display = 'none';
                    userProfileIcon.style.display = 'block';
                    userProfilePhoto.style.background = 'var(--gradient-primary)';
                }
                
                // Fill form fields
                const nameInput = document.getElementById('profileName');
                const emailInput = document.getElementById('profileEmail');
                const phoneInput = document.getElementById('profilePhone');
                const birthDateInput = document.getElementById('profileBirthDate');
                const genderInput = document.getElementById('profileGender');
                const addressInput = document.getElementById('profileAddress');
                
                if (nameInput) nameInput.value = userData.name || user.displayName || '';
                if (emailInput) emailInput.value = userData.email || user.email || '';
                if (phoneInput) phoneInput.value = userData.phone || '';
                if (birthDateInput) birthDateInput.value = userData.birthDate || '';
                if (genderInput) genderInput.value = userData.gender || '';
                if (addressInput) addressInput.value = userData.address || '';
                
                // Store in localStorage for quick access
                localStorage.setItem('userData', JSON.stringify({
                    uid: user.uid,
                    name: userData.name || user.displayName,
                    email: userData.email || user.email,
                    phone: userData.phone || '',
                    birthDate: userData.birthDate || '',
                    photoURL: userData.photoURL || user.photoURL || ''
                }));
            } else {
                // User document doesn't exist, create it
                const userData = {
                    name: user.displayName || 'Pengguna',
                    email: user.email || '',
                    photoURL: user.photoURL || '',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                firestore.collection('users').doc(user.uid).set(userData).then(() => {
                    loadUserProfile(user);
                });
            }
        }).catch(error => {
            console.error('Error loading user profile:', error);
            // Fallback to localStorage
            loadUserProfileFromLocalStorage();
        });
    } else {
        // Fallback to localStorage
        loadUserProfileFromLocalStorage();
    }
}

// Load user profile from localStorage
function loadUserProfileFromLocalStorage() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            
            const userNameEl = document.getElementById('userName');
            const userEmailEl = document.getElementById('userEmail');
            
            if (userNameEl) userNameEl.textContent = user.name || 'Pengguna';
            if (userEmailEl) userEmailEl.textContent = user.email || 'user@example.com';
            
            // Display user photo if available
            const userProfilePhoto = document.getElementById('userProfilePhoto');
            const userProfileIcon = document.getElementById('userProfileIcon');
            const userProfileImage = document.getElementById('userProfileImage');
            
            const photoURL = user.photoURL || '';
            
            if (photoURL && userProfilePhoto && userProfileIcon && userProfileImage) {
                // Show image, hide icon
                userProfileImage.src = photoURL;
                userProfileImage.style.display = 'block';
                userProfileIcon.style.display = 'none';
                userProfilePhoto.style.background = 'transparent';
            } else if (userProfilePhoto && userProfileIcon && userProfileImage) {
                // Show icon, hide image
                userProfileImage.style.display = 'none';
                userProfileIcon.style.display = 'block';
                userProfilePhoto.style.background = 'var(--gradient-primary)';
            }
            
            const nameInput = document.getElementById('profileName');
            const emailInput = document.getElementById('profileEmail');
            const phoneInput = document.getElementById('profilePhone');
            const birthDateInput = document.getElementById('profileBirthDate');
            const genderInput = document.getElementById('profileGender');
            const addressInput = document.getElementById('profileAddress');
            
            if (nameInput) nameInput.value = user.name || '';
            if (emailInput) emailInput.value = user.email || '';
            if (phoneInput) phoneInput.value = user.phone || '';
            if (birthDateInput) birthDateInput.value = user.birthDate || '';
            if (genderInput) genderInput.value = user.gender || '';
            if (addressInput) addressInput.value = user.address || '';
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
}

// Save profile changes
async function saveProfile() {
    const name = document.getElementById('profileName').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const birthDate = document.getElementById('profileBirthDate').value;
    
    if (!name || !email) {
        if (typeof showAlert === 'function') {
            showAlert('Nama dan email harus diisi!', 'Validasi');
        } else {
            alert('Nama dan email harus diisi!');
        }
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (typeof showAlert === 'function') {
            showAlert('Format email tidak valid!', 'Validasi');
        } else {
            alert('Format email tidak valid!');
        }
        return;
    }
    
    // Show loading
    const saveBtn = event?.target || document.querySelector('button[onclick="saveProfile()"]');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Menyimpan...';
    
    try {
        // Save to Firestore if available
        if (currentUser && firestore) {
            const updateData = {
                name: name,
                email: email,
                phone: phone,
                birthDate: birthDate,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await firestore.collection('users').doc(currentUser.uid).update(updateData);
            
            // Update Firebase Auth email if changed
            if (email !== currentUser.email) {
                try {
                    await currentUser.updateEmail(email);
                    console.log('Email updated in Firebase Auth');
                } catch (error) {
                    console.error('Error updating email:', error);
                    // Email might require re-authentication, but continue with profile update
                }
            }
            
            // Update display name if changed
            if (name !== currentUser.displayName) {
                try {
                    await currentUser.updateProfile({
                        displayName: name
                    });
                } catch (error) {
                    console.error('Error updating display name:', error);
                }
            }
            
            console.log('Profile updated in Firestore');
        }
        
        // Also save to localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.name = name;
        userData.email = email;
        userData.phone = phone;
        userData.birthDate = birthDate;
        userData.updatedAt = new Date().toISOString();
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userEmail', email);
        
        // Update header
        const userNameEl = document.getElementById('userName');
        const userEmailEl = document.getElementById('userEmail');
        if (userNameEl) userNameEl.textContent = name;
        if (userEmailEl) userEmailEl.textContent = email;
        
        // Reset button
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        if (typeof showAlert === 'function') {
            showAlert('Profil berhasil diperbarui!', 'Berhasil');
        } else {
            alert('Profil berhasil diperbarui!');
        }
        
    } catch (error) {
        console.error('Error updating profile:', error);
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        let errorMessage = 'Terjadi kesalahan saat memperbarui profil.';
        if (error.code === 'permission-denied') {
            errorMessage = 'Anda tidak memiliki izin untuk memperbarui profil.';
        } else if (error.code === 'unavailable') {
            errorMessage = 'Layanan tidak tersedia. Silakan coba lagi nanti.';
        } else if (error.message) {
            errorMessage += ' ' + error.message;
        }
        
        if (typeof showAlert === 'function') {
            showAlert(errorMessage, 'Kesalahan');
        } else {
            alert(errorMessage);
        }
    }
}

// Load health information
function loadHealthInfo(user = null) {
    if (user && firestore) {
        // Load from Firestore
        firestore.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const strokeDateInput = document.getElementById('strokeDate');
                const medicalNotesInput = document.getElementById('medicalNotes');
                
                if (strokeDateInput) strokeDateInput.value = userData.strokeDate || '';
                if (medicalNotesInput) medicalNotesInput.value = userData.medicalNotes || '';
            }
        }).catch(error => {
            console.error('Error loading health info:', error);
            // Fallback to localStorage
            loadHealthInfoFromLocalStorage();
        });
    } else {
        // Fallback to localStorage
        loadHealthInfoFromLocalStorage();
    }
}

// Load health info from localStorage
function loadHealthInfoFromLocalStorage() {
    const healthInfo = localStorage.getItem('healthInfo');
    if (healthInfo) {
        try {
            const health = JSON.parse(healthInfo);
            const strokeDateInput = document.getElementById('strokeDate');
            const medicalNotesInput = document.getElementById('medicalNotes');
            
            if (strokeDateInput) strokeDateInput.value = health.strokeDate || '';
            if (medicalNotesInput) medicalNotesInput.value = health.medicalNotes || '';
        } catch (e) {
            console.error('Error parsing health info:', e);
        }
    }
}

// Save health information
async function saveHealthInfo() {
    const strokeDate = document.getElementById('strokeDate').value;
    const medicalNotes = document.getElementById('medicalNotes').value.trim();
    
    // Show loading
    const saveBtn = event?.target || document.querySelector('button[onclick="saveHealthInfo()"]');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Menyimpan...';
    
    try {
        const healthInfo = {
            strokeDate: strokeDate,
            medicalNotes: medicalNotes,
            updatedAt: new Date().toISOString()
        };
        
        // Save to Firestore if available
        if (currentUser && firestore) {
            await firestore.collection('users').doc(currentUser.uid).update({
                strokeDate: strokeDate,
                medicalNotes: medicalNotes,
                healthInfoUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Also save to localStorage
        localStorage.setItem('healthInfo', JSON.stringify(healthInfo));
        
        // Reset button
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        if (typeof showAlert === 'function') {
            showAlert('Informasi kesehatan berhasil disimpan!', 'Berhasil');
        } else {
            alert('Informasi kesehatan berhasil disimpan!');
        }
        
    } catch (error) {
        console.error('Error saving health info:', error);
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        if (typeof showAlert === 'function') {
            showAlert('Terjadi kesalahan saat menyimpan informasi kesehatan.', 'Kesalahan');
        } else {
            alert('Terjadi kesalahan saat menyimpan informasi kesehatan.');
        }
    }
}

// Change password modal
function changePassword() {
    // Create password change modal
    if (typeof showPasswordChangeModal === 'function') {
        showPasswordChangeModal();
    } else {
        // Fallback to simple prompts
        changePasswordWithPrompts();
    }
}

// Change password with prompts (fallback)
async function changePasswordWithPrompts() {
    if (!currentUser) {
        if (typeof showAlert === 'function') {
            showAlert('Anda harus masuk terlebih dahulu untuk mengubah kata sandi.', 'Informasi');
        } else {
            alert('Anda harus masuk terlebih dahulu untuk mengubah kata sandi.');
        }
        return;
    }
    
    const oldPassword = prompt('Masukkan kata sandi lama:');
    if (!oldPassword) return;
    
    const newPassword = prompt('Masukkan kata sandi baru (minimal 8 karakter):');
    if (!newPassword) return;
    
    if (newPassword.length < 8) {
        if (typeof showAlert === 'function') {
            showAlert('Kata sandi baru harus minimal 8 karakter!', 'Validasi');
        } else {
            alert('Kata sandi baru harus minimal 8 karakter!');
        }
        return;
    }
    
    const confirmPassword = prompt('Konfirmasi kata sandi baru:');
    if (!confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
        if (typeof showAlert === 'function') {
            showAlert('Kata sandi tidak cocok!', 'Validasi');
        } else {
            alert('Kata sandi tidak cocok!');
        }
        return;
    }
    
    // Re-authenticate user
    try {
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            oldPassword
        );
        await currentUser.reauthenticateWithCredential(credential);
        
        // Update password
        await currentUser.updatePassword(newPassword);
        
        if (typeof showAlert === 'function') {
            showAlert('Kata sandi berhasil diubah!', 'Berhasil');
        } else {
            alert('Kata sandi berhasil diubah!');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        let errorMessage = 'Terjadi kesalahan saat mengubah kata sandi.';
        
        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Kata sandi lama tidak benar.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Kata sandi terlalu lemah. Gunakan kata sandi yang lebih kuat.';
        } else if (error.code === 'auth/requires-recent-login') {
            errorMessage = 'Untuk keamanan, silakan keluar dan masuk kembali sebelum mengubah kata sandi.';
        }
        
        if (typeof showAlert === 'function') {
            showAlert(errorMessage, 'Kesalahan');
        } else {
            alert(errorMessage);
        }
    }
}

// Notification settings
function notificationSettings() {
    if (typeof showAlert === 'function') {
        showAlert('Fitur pengaturan notifikasi akan segera tersedia!', 'Informasi');
    } else {
        alert('Fitur pengaturan notifikasi akan segera tersedia!');
    }
}

// Privacy settings
function privacySettings() {
    if (typeof showAlert === 'function') {
        showAlert('Fitur pengaturan privasi akan segera tersedia!', 'Informasi');
    } else {
        alert('Fitur pengaturan privasi akan segera tersedia!');
    }
}

// Help & Support
function showHelpSupport() {
    if (typeof showAlert === 'function') {
        showAlert('Untuk bantuan dan dukungan, silakan hubungi tim support kami melalui email: support@myosig.com atau melalui fitur chat yang akan segera tersedia.', 'Bantuan & Dukungan');
    } else {
        alert('Untuk bantuan dan dukungan, silakan hubungi tim support kami melalui email: support@myosig.com');
    }
}

// Terms & Conditions
function showTermsConditions() {
    if (typeof showAlert === 'function') {
        showAlert('Syarat & Ketentuan:\n\n1. Pengguna bertanggung jawab atas penggunaan aplikasi ini.\n2. Data kesehatan yang dimasukkan adalah tanggung jawab pengguna.\n3. Aplikasi ini hanya sebagai alat bantu, bukan pengganti konsultasi medis profesional.\n4. Kami berhak mengubah syarat dan ketentuan sewaktu-waktu.\n\nDengan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan yang berlaku.', 'Syarat & Ketentuan');
    } else {
        alert('Syarat & Ketentuan:\n\n1. Pengguna bertanggung jawab atas penggunaan aplikasi ini.\n2. Data kesehatan yang dimasukkan adalah tanggung jawab pengguna.\n3. Aplikasi ini hanya sebagai alat bantu, bukan pengganti konsultasi medis profesional.');
    }
}

// Privacy Policy
function showPrivacyPolicy() {
    if (typeof showAlert === 'function') {
        showAlert('Kebijakan Privasi:\n\n1. Kami menghormati privasi Anda dan melindungi data pribadi Anda.\n2. Data yang dikumpulkan hanya digunakan untuk keperluan aplikasi dan rehabilitasi.\n3. Data tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.\n4. Kami menggunakan enkripsi untuk melindungi data sensitif.\n5. Anda dapat menghapus data Anda kapan saja melalui pengaturan akun.\n\nUntuk informasi lebih lanjut, silakan hubungi kami di privacy@myosig.com', 'Kebijakan Privasi');
    } else {
        alert('Kebijakan Privasi:\n\n1. Kami menghormati privasi Anda dan melindungi data pribadi Anda.\n2. Data yang dikumpulkan hanya digunakan untuk keperluan aplikasi dan rehabilitasi.\n3. Data tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.');
    }
}

// Logout
function logout() {
    if (typeof showConfirm === 'function') {
        showConfirm('Apakah Anda yakin ingin keluar dari akun?', 'Konfirmasi Keluar', () => {
            performLogout();
        });
    } else {
        if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
            performLogout();
        }
    }
}

// Perform logout
function performLogout() {
    // Sign out from Firebase
    if (auth && currentUser) {
        auth.signOut().then(() => {
            // Clear localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            localStorage.removeItem('healthInfo');
            
            // Redirect to login page
            window.location.href = 'auth.html';
        }).catch(error => {
            console.error('Error signing out:', error);
            // Still clear and redirect
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            localStorage.removeItem('healthInfo');
            window.location.href = 'auth.html';
        });
    } else {
        // Fallback
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        localStorage.removeItem('healthInfo');
        window.location.href = 'auth.html';
    }
}
