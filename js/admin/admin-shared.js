/**
 * Myosig — Admin Shared
 * Auth guard, logout, helpers — loaded on every admin page
 */

const ADMIN_EMAIL = 'admin@myosig.com';
let currentUser = null;

function isAdmin(user) {
    return user && user.email === ADMIN_EMAIL;
}

function adminLogout() {
    const doLogout = () => {
        if (typeof auth !== 'undefined' && auth) {
            auth.signOut().finally(() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
                localStorage.removeItem('healthInfo');
                window.location.href = '../auth.html';
            });
        } else {
            window.location.href = '../auth.html';
        }
    };
    if (typeof showConfirm === 'function') {
        showConfirm('Apakah Anda yakin ingin keluar?', 'Konfirmasi Keluar', doLogout);
    } else if (confirm('Keluar dari admin?')) {
        doLogout();
    }
}

/**
 * Init admin page — waits for Firebase, checks auth + admin role,
 * then calls onReady(user) callback.
 */
function initAdminPage(onReady) {
    function waitForFirebase() {
        if (typeof firebase === 'undefined' || typeof initializeFirebase === 'undefined') {
            setTimeout(waitForFirebase, 100);
            return;
        }
        initializeFirebase();

        auth.onAuthStateChanged(function (user) {
            if (!user) { window.location.href = '../auth.html'; return; }
            if (!isAdmin(user)) {
                alert('Akses ditolak. Halaman ini hanya untuk admin.');
                window.location.href = '../dashboard.html';
                return;
            }
            currentUser = user;
            initAdminAvatar(user);
            if (onReady) onReady(user);
        });
    }
    window.addEventListener('DOMContentLoaded', waitForFirebase);
}

/* =========================================================
   ADMIN AVATAR DROPDOWN
   ========================================================= */
function initAdminAvatar(user) {
    const btn = document.getElementById('adminAvatarBtn');
    if (!btn) return;

    // Set avatar photo or initial
    if (user.photoURL) {
        btn.innerHTML = '<img src="' + user.photoURL + '" alt="Admin">';
    } else {
        btn.textContent = (user.displayName || user.email || 'A').charAt(0).toUpperCase();
    }

    // Set dropdown info
    const nameEl = document.getElementById('adminDropdownName');
    const emailEl = document.getElementById('adminDropdownEmail');
    if (nameEl) nameEl.textContent = user.displayName || 'Admin';
    if (emailEl) emailEl.textContent = user.email || '';
}

function toggleAdminDropdown() {
    const dropdown = document.getElementById('adminAvatarDropdown');
    const overlay = document.getElementById('adminAvatarOverlay');
    if (!dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    dropdown.classList.toggle('open', !isOpen);
    if (overlay) overlay.classList.toggle('open', !isOpen);
}

function closeAdminDropdown() {
    const dropdown = document.getElementById('adminAvatarDropdown');
    const overlay = document.getElementById('adminAvatarOverlay');
    if (dropdown) dropdown.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

/* Helpers */
function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
