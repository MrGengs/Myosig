// Myosig-Link - Redirect to Myosig Web App
// Initializes Firebase and redirects user to myosiq.web.app

const REDIRECT_URL = 'https://myosiq.web.app';
const REDIRECT_DELAY = 1500; // ms

let app, analytics;

function initFirebase() {
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        try {
            app = firebase.initializeApp(firebaseConfig);
            if (firebase.analytics) {
                analytics = firebase.analytics();
            }
            console.log('Firebase initialized (myosig-official)');
        } catch (e) {
            console.warn('Firebase init error:', e);
        }
    }
}

function redirect() {
    window.location.href = REDIRECT_URL;
}

document.addEventListener('DOMContentLoaded', function () {
    initFirebase();

    // Update countdown text
    const countdownEl = document.getElementById('countdown');
    let seconds = Math.ceil(REDIRECT_DELAY / 1000);

    if (countdownEl) {
        const tick = setInterval(function () {
            seconds--;
            if (seconds <= 0) {
                clearInterval(tick);
                countdownEl.textContent = '0';
            } else {
                countdownEl.textContent = seconds;
            }
        }, 1000);
    }

    // Redirect after delay
    setTimeout(redirect, REDIRECT_DELAY);
});
