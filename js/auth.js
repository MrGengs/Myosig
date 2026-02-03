// Authentication JavaScript with Firebase
// Handle login and register form functionality

// Initialize Firebase when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to load
    if (typeof firebase !== 'undefined') {
        initializeFirebase();
        
        // Check if user is already logged in
        auth.onAuthStateChanged(function(user) {
            if (user) {
                // User is already logged in, redirect to dashboard
                window.location.href = 'dashboard.html';
            }
        });
    } else {
        console.error('Firebase SDK not loaded');
    }
});

// Toggle between login and register forms
function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle login form submission
document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simple validation
    if (!email || !password) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Disable button and show loading
    const submitBtn = document.getElementById('loginSubmitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="auth-loading"></span> <span>Memproses...</span>';
    
    try {
        // Sign in with Firebase Auth
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Set persistence
        if (rememberMe) {
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        } else {
            await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }
        
        // Get user data from Firestore
        const userDoc = await firestore.collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            // Store in localStorage for quick access
            localStorage.setItem('userData', JSON.stringify({
                uid: user.uid,
                name: userData.name || user.displayName || 'Pengguna',
                email: user.email,
                phone: userData.phone || '',
                createdAt: userData.createdAt || new Date().toISOString()
            }));
        } else {
            // First time login - create user document
            await createUserDocument(user);
        }
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Restore button
        submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> <span>Masuk</span>';
        submitBtn.disabled = false;
        
        // Show error message
        let errorMessage = 'Terjadi kesalahan saat login.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Email tidak terdaftar.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Kata sandi salah.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Format email tidak valid.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Terlalu banyak percobaan. Silakan coba lagi nanti.';
        }
        
        alert(errorMessage);
    }
});

// Handle register form submission
document.getElementById('registerFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    if (password.length < 8) {
        alert('Kata sandi minimal 8 karakter!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Kata sandi tidak cocok!');
        return;
    }
    
    if (!agreeTerms) {
        alert('Anda harus menyetujui Syarat & Ketentuan!');
        return;
    }
    
    // Disable button and show loading
    const submitBtn = document.getElementById('registerSubmitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="auth-loading"></span> <span>Memproses...</span>';
    
    try {
        // Create user with Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update display name
        await user.updateProfile({
            displayName: name
        });
        
        // Create user document in Firestore
        await createUserDocument(user, { name, phone });
        
        // Store in localStorage
        localStorage.setItem('userData', JSON.stringify({
            uid: user.uid,
            name: name,
            email: email,
            phone: phone,
            createdAt: new Date().toISOString()
        }));
        
        // Show success message and redirect
        alert('Pendaftaran berhasil! Selamat datang di Myosig!');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Registration error:', error);
        
        // Restore button
        submitBtn.innerHTML = '<i class="bi bi-person-plus"></i> <span>Daftar</span>';
        submitBtn.disabled = false;
        
        // Show error message
        let errorMessage = 'Terjadi kesalahan saat pendaftaran.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Format email tidak valid.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter.';
        }
        
        alert(errorMessage);
    }
});

// Sign in with Google
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Disable buttons
    const loginBtn = document.getElementById('googleLoginBtn');
    const registerBtn = document.getElementById('googleRegisterBtn');
    const buttons = [loginBtn, registerBtn].filter(btn => btn && !btn.disabled);
    
    buttons.forEach(btn => {
        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="auth-loading"></span> <span>Memproses...</span>';
        btn.dataset.originalText = originalText;
    });
    
    try {
        // Sign in with Google
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Get user data from Google
        const name = user.displayName || 'Pengguna';
        const email = user.email;
        const photoURL = user.photoURL || '';
        
        // Check if user document exists
        const userDoc = await firestore.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // First time login - create user document
            await createUserDocument(user, { 
                name: name,
                email: email,
                photoURL: photoURL
            });
        } else {
            // Update existing document
            await firestore.collection('users').doc(user.uid).update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Store in localStorage
        const userData = userDoc.exists ? userDoc.data() : {
            name: name,
            email: email,
            phone: '',
            photoURL: photoURL
        };
        
        localStorage.setItem('userData', JSON.stringify({
            uid: user.uid,
            name: userData.name || name,
            email: userData.email || email,
            phone: userData.phone || '',
            photoURL: userData.photoURL || photoURL,
            createdAt: userData.createdAt || new Date().toISOString()
        }));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Google Sign-In error:', error);
        
        // Restore buttons
        buttons.forEach(btn => {
            if (btn.dataset.originalText) {
                btn.innerHTML = btn.dataset.originalText;
                btn.disabled = false;
            }
        });
        
        // Show error message
        let errorMessage = 'Terjadi kesalahan saat login dengan Google.';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Login dibatalkan. Silakan coba lagi.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Popup diblokir. Silakan izinkan popup untuk browser ini.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'Akun dengan email ini sudah terdaftar dengan metode lain.';
        }
        
        alert(errorMessage);
    }
}

// Create user document in Firestore (allows first-time users to write)
async function createUserDocument(user, additionalData = {}) {
    const userRef = firestore.collection('users').doc(user.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
        // First time login - create document
        const userData = {
            uid: user.uid,
            email: user.email || additionalData.email,
            name: additionalData.name || user.displayName || 'Pengguna',
            phone: additionalData.phone || '',
            photoURL: additionalData.photoURL || user.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await userRef.set(userData);
        console.log('User document created:', user.uid);
    } else {
        // Update existing document
        await userRef.update({
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}
