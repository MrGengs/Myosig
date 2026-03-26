/**
 * Myosig — App Header & Banner Slider
 * Handles: app-bar date/time + image banner carousel
 */

/* =========================================================
   BANNER SLIDES DATA
   Default placeholder. Akan di-override dari Firestore jika ada.
   ========================================================= */
let BANNER_SLIDES = [
    { src: '', alt: 'Banner 1' },
    { src: '', alt: 'Banner 2' },
    { src: '', alt: 'Banner 3' },
];

let bannerIndex = 0;
let bannerInterval = null;
let bannerStartX = 0;
let bannerCurrentX = 0;
let bannerDragging = false;

/* =========================================================
   BANNER SLIDER
   ========================================================= */
async function initBannerSlider() {
    const slider = document.getElementById('bannerSlider');
    const track = document.getElementById('bannerTrack');
    const dotsContainer = document.getElementById('bannerDots');
    if (!slider || !track) return;

    // Try loading banners from Firestore
    await loadBannersFromFirestore();

    // Build slides
    track.innerHTML = BANNER_SLIDES.map((slide, i) => {
        if (slide.src) {
            return `<div class="banner-slide"><img src="${slide.src}" alt="${slide.alt}" loading="lazy"></div>`;
        }
        return `<div class="banner-slide">
            <div class="banner-slide-placeholder">
                <i class="bi bi-image"></i>
                <span>Banner ${i + 1}</span>
            </div>
        </div>`;
    }).join('');

    // Build dots
    if (dotsContainer) {
        dotsContainer.innerHTML = BANNER_SLIDES.map((_, i) =>
            `<span class="banner-dot${i === 0 ? ' active' : ''}" onclick="goToBanner(${i})"></span>`
        ).join('');
    }

    // Touch / pointer events for swipe
    track.addEventListener('pointerdown', onBannerPointerDown);
    track.addEventListener('pointermove', onBannerPointerMove);
    track.addEventListener('pointerup', onBannerPointerUp);
    track.addEventListener('pointercancel', onBannerPointerUp);

    // Auto-rotate
    resetBannerInterval();
}

async function loadBannersFromFirestore() {
    try {
        // Tunggu Firebase siap
        if (typeof firebase === 'undefined') return;
        if (!firebase.apps || firebase.apps.length === 0) {
            if (typeof initializeFirebase === 'function') initializeFirebase();
            else return;
        }

        const fs = firebase.firestore();
        const snap = await fs.collection('app_banners').orderBy('order', 'asc').get();
        if (!snap.empty) {
            const loaded = [];
            snap.forEach(doc => {
                const d = doc.data();
                if (d.url) loaded.push({ src: d.url, alt: d.alt || 'Banner' });
            });
            if (loaded.length > 0) BANNER_SLIDES = loaded;
        }
    } catch (e) {
        console.warn('Banner load from Firestore failed, using defaults:', e.message);
    }
}

function goToBanner(index) {
    const track = document.getElementById('bannerTrack');
    if (!track) return;
    bannerIndex = index;
    track.style.transform = `translateX(-${bannerIndex * 100}%)`;
    updateBannerDots();
    resetBannerInterval();
}

function nextBanner() {
    bannerIndex = (bannerIndex + 1) % BANNER_SLIDES.length;
    goToBanner(bannerIndex);
}

function updateBannerDots() {
    const dots = document.querySelectorAll('.banner-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === bannerIndex));
}

function resetBannerInterval() {
    if (bannerInterval) clearInterval(bannerInterval);
    bannerInterval = setInterval(nextBanner, 5000);
}

/* --- Swipe handling --- */
function onBannerPointerDown(e) {
    const track = document.getElementById('bannerTrack');
    if (!track) return;
    bannerDragging = true;
    bannerStartX = e.clientX;
    bannerCurrentX = e.clientX;
    track.classList.add('dragging');
    track.setPointerCapture(e.pointerId);
}

function onBannerPointerMove(e) {
    if (!bannerDragging) return;
    bannerCurrentX = e.clientX;
    const diff = bannerCurrentX - bannerStartX;
    const track = document.getElementById('bannerTrack');
    if (!track) return;
    const offset = -(bannerIndex * 100);
    let pxToPercent = (diff / track.offsetWidth) * 100;

    // Clamp: tidak bisa scroll melewati slide pertama atau terakhir
    const maxLeft = 0;
    const maxRight = -(BANNER_SLIDES.length - 1) * 100;
    let target = offset + pxToPercent;
    target = Math.max(maxRight, Math.min(maxLeft, target));

    track.style.transform = `translateX(${target}%)`;
}

function onBannerPointerUp(e) {
    if (!bannerDragging) return;
    bannerDragging = false;
    const track = document.getElementById('bannerTrack');
    if (track) track.classList.remove('dragging');

    const diff = bannerCurrentX - bannerStartX;
    const threshold = 50;

    if (diff < -threshold && bannerIndex < BANNER_SLIDES.length - 1) {
        goToBanner(bannerIndex + 1);
    } else if (diff > threshold && bannerIndex > 0) {
        goToBanner(bannerIndex - 1);
    } else {
        goToBanner(bannerIndex); // snap back
    }
}

/* =========================================================
   APP BAR — Date & Time
   ========================================================= */
function updateAppBarDate() {
    const el = document.getElementById('appBarDate');
    if (!el) return;

    const now  = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    el.innerHTML =
        `<span style="font-weight:600;color:var(--text-dark)">${hh}:${mm}</span>` +
        `<br>${days[now.getDay()]}, ${now.getDate()} ${mons[now.getMonth()]}`;
}

/* =========================================================
   APP BAR — Avatar (Firebase Auth)
   ========================================================= */
function setAppBarAvatar(user) {
    const avatarEl = document.getElementById('appBarAvatar');
    if (!avatarEl) return;

    if (user && user.photoURL) {
        const safeName = (user.displayName || user.email || 'User').replace(/"/g, '&quot;');
        avatarEl.innerHTML = `<img src="${user.photoURL}" alt="${safeName}" loading="lazy">`;
        return;
    }

    const initial = (user && (user.displayName || user.email) ? (user.displayName || user.email) : 'D')
        .charAt(0)
        .toUpperCase();
    avatarEl.textContent = initial;
}

function bindAppBarAvatarWithFirebase() {
    if (typeof firebase === 'undefined') return;
    if (window.__appBarAvatarBound) return;
    window.__appBarAvatarBound = true;

    if ((!firebase.apps || firebase.apps.length === 0) && typeof initializeFirebase === 'function') {
        initializeFirebase();
    }
    if (!firebase.apps || firebase.apps.length === 0) return;

    firebase.auth().onAuthStateChanged((user) => {
        setAppBarAvatar(user);
    });
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    updateAppBarDate();
    setInterval(updateAppBarDate, 60000);
    initBannerSlider();
    bindAppBarAvatarWithFirebase();
});
