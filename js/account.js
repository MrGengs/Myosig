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
            showAlert(t('account.validate.name_email'), t('label.validation'));
        } else {
            alert(t('account.validate.name_email'));
        }
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (typeof showAlert === 'function') {
            showAlert(t('account.validate.email_format'), t('label.validation'));
        } else {
            alert(t('account.validate.email_format'));
        }
        return;
    }

    // Phone validation (if provided)
    if (phone && !/^[0-9]{10,13}$/.test(phone.replace(/\s/g, ''))) {
        if (typeof showAlert === 'function') {
            showAlert(t('account.validate.phone_format'), t('label.validation'));
        } else {
            alert(t('account.validate.phone_format'));
        }
        return;
    }
    
    // Show loading
    const saveBtn = event?.target || document.querySelector('button[onclick="saveAllProfileData()"]');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> ' + t('label.saving');

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
            showAlert(t('account.save.success'), t('label.success'));
        } else {
            alert(t('account.save.success'));
        }
        
        // Close modal after successful save
        setTimeout(() => {
            closeEditModal();
        }, 1000);
        
    } catch (error) {
        console.error('Error saving profile data:', error);
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        let errorMessage = t('account.save.error');
        if (error.code === 'permission-denied') {
            errorMessage = t('account.save.permission_denied');
        } else if (error.code === 'unavailable') {
            errorMessage = t('account.save.unavailable');
        } else if (error.message) {
            errorMessage += ' ' + error.message;
        }

        if (typeof showAlert === 'function') {
            showAlert(errorMessage, t('label.error'));
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
                    userNameEl.textContent = userData.name || user.displayName || t('account.default_name');
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
                    name: user.displayName || t('account.default_name'),
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
            
            if (userNameEl) userNameEl.textContent = user.name || t('account.default_name');
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
            showAlert(t('account.validate.name_email'), t('label.validation'));
        } else {
            alert(t('account.validate.name_email'));
        }
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (typeof showAlert === 'function') {
            showAlert(t('account.validate.email_format'), t('label.validation'));
        } else {
            alert(t('account.validate.email_format'));
        }
        return;
    }
    
    // Show loading
    const saveBtn = event?.target || document.querySelector('button[onclick="saveProfile()"]');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> ' + t('label.saving');

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
            showAlert(t('account.profile.success'), t('label.success'));
        } else {
            alert(t('account.profile.success'));
        }
        
    } catch (error) {
        console.error('Error updating profile:', error);
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        let errorMessage = t('account.profile.error');
        if (error.code === 'permission-denied') {
            errorMessage = t('account.save.permission_denied');
        } else if (error.code === 'unavailable') {
            errorMessage = t('account.save.unavailable');
        } else if (error.message) {
            errorMessage += ' ' + error.message;
        }

        if (typeof showAlert === 'function') {
            showAlert(errorMessage, t('label.error'));
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
    saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> ' + t('label.saving');

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
            showAlert(t('account.health.success'), t('label.success'));
        } else {
            alert(t('account.health.success'));
        }
        
    } catch (error) {
        console.error('Error saving health info:', error);
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        
        if (typeof showAlert === 'function') {
            showAlert(t('account.health.error'), t('label.error'));
        } else {
            alert(t('account.health.error'));
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
            showAlert(t('account.password.login_first'), t('label.info'));
        } else {
            alert(t('account.password.login_first'));
        }
        return;
    }
    
    const oldPassword = prompt(t('account.password.old_prompt'));
    if (!oldPassword) return;
    
    const newPassword = prompt(t('account.password.new_prompt'));
    if (!newPassword) return;
    
    if (newPassword.length < 8) {
        if (typeof showAlert === 'function') {
            showAlert(t('account.password.min_chars'), t('label.validation'));
        } else {
            alert(t('account.password.min_chars'));
        }
        return;
    }
    
    const confirmPassword = prompt(t('account.password.confirm_prompt'));
    if (!confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
        if (typeof showAlert === 'function') {
            showAlert(t('account.password.mismatch'), t('label.validation'));
        } else {
            alert(t('account.password.mismatch'));
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
            showAlert(t('account.password.success'), t('label.success'));
        } else {
            alert(t('account.password.success'));
        }
    } catch (error) {
        console.error('Error changing password:', error);
        let errorMessage = t('account.password.error');

        if (error.code === 'auth/wrong-password') {
            errorMessage = t('account.password.wrong_old');
        } else if (error.code === 'auth/weak-password') {
            errorMessage = t('account.password.weak');
        } else if (error.code === 'auth/requires-recent-login') {
            errorMessage = t('account.password.relogin');
        }

        if (typeof showAlert === 'function') {
            showAlert(errorMessage, t('label.error'));
        } else {
            alert(errorMessage);
        }
    }
}

// Notification settings
function notificationSettings() {
    if (typeof showAlert === 'function') {
        showAlert(t('account.notification.coming'), t('label.info'));
    } else {
        alert(t('account.notification.coming'));
    }
}

// Privacy settings
function privacySettings() {
    if (typeof showAlert === 'function') {
        showAlert(t('account.privacy.coming'), t('label.info'));
    } else {
        alert(t('account.privacy.coming'));
    }
}

// Help & Support
function showHelpSupport() {
    if (typeof showAlert === 'function') {
        showAlert(t('account.help.message'), t('account.help.title'));
    } else {
        alert(t('account.help.message'));
    }
}

// Terms & Conditions
function showTermsConditions() {
    if (typeof showAlert === 'function') {
        showAlert(t('account.terms.message'), t('account.terms'));
    } else {
        alert(t('account.terms.message'));
    }
}

// Privacy Policy
function showPrivacyPolicy() {
    if (typeof showAlert === 'function') {
        showAlert(t('account.privacy.message'), t('account.privacy_policy'));
    } else {
        alert(t('account.privacy.message'));
    }
}

// Logout
function logout() {
    if (typeof showConfirm === 'function') {
        showConfirm(t('account.logout.confirm'), t('account.logout.title'), () => {
            performLogout();
        });
    } else {
        if (confirm(t('account.logout.confirm'))) {
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
