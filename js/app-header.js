/**
 * Myosig — App Header & Daily Health Tip
 * Handles: app-bar date/time + rotating health tip banner
 */

/* =========================================================
   DAILY HEALTH TIPS (relevan untuk dokter rehabilitasi stroke)
   ========================================================= */
const HEALTH_TIPS = [
    {
        icon: 'bi-heart-pulse',
        text: 'Latihan ROM (Range of Motion) pasif 2× sehari membantu mencegah kontraktur pada pasien stroke fase akut.',
        category: 'Rehabilitasi',
        catIcon: 'bi-bandaid',
    },
    {
        icon: 'bi-activity',
        text: 'Pemantauan EMG secara rutin dapat mendeteksi pemulihan fungsi otot lebih awal, memungkinkan penyesuaian program terapi.',
        category: 'Monitoring',
        catIcon: 'bi-cpu',
    },
    {
        icon: 'bi-droplet-half',
        text: 'Pasien stroke perlu asupan cairan ≥ 2 L/hari untuk mendukung sirkulasi serebral dan fungsi kognitif.',
        category: 'Nutrisi',
        catIcon: 'bi-cup-hot',
    },
    {
        icon: 'bi-person-walking',
        text: 'Mobilisasi dini (24–48 jam pasca stroke) terbukti mengurangi risiko komplikasi DVT dan pneumonia aspirasi.',
        category: 'Rehabilitasi',
        catIcon: 'bi-bandaid',
    },
    {
        icon: 'bi-brain',
        text: 'Neuroplastisitas otak aktif selama 3–6 bulan pertama pasca stroke — periode emas untuk intervensi rehabilitasi intensif.',
        category: 'Ilmu Saraf',
        catIcon: 'bi-lightbulb',
    },
    {
        icon: 'bi-shield-check',
        text: 'Kontrol tekanan darah < 140/90 mmHg secara konsisten menurunkan risiko stroke rekuren hingga 40%.',
        category: 'Pencegahan',
        catIcon: 'bi-shield-fill-check',
    },
    {
        icon: 'bi-emoji-smile',
        text: 'Intervensi psikososial dan dukungan keluarga meningkatkan kepatuhan terapi hingga 65% pada pasien stroke.',
        category: 'Kesehatan Mental',
        catIcon: 'bi-emoji-smile',
    },
    {
        icon: 'bi-stars',
        text: 'Sesi terapi yang terdokumentasi secara digital memudahkan evaluasi perkembangan dan pengambilan keputusan klinis.',
        category: 'Dokumentasi',
        catIcon: 'bi-clipboard2-check',
    },
    {
        icon: 'bi-bicycle',
        text: 'Latihan aerobik intensitas sedang 30 menit/hari meningkatkan kapasitas fungsional dan mood pada penyintas stroke.',
        category: 'Olahraga',
        catIcon: 'bi-bicycle',
    },
    {
        icon: 'bi-moon-stars',
        text: 'Kualitas tidur yang baik (7–9 jam) mempercepat proses neuroplastisitas dan pemulihan fungsi motorik.',
        category: 'Gaya Hidup',
        catIcon: 'bi-moon',
    },
];

let currentTipIndex = 0;
let tipInterval = null;

/* =========================================================
   TIP BANNER
   ========================================================= */
function renderTip(index, animate = true) {
    const tip  = HEALTH_TIPS[index];
    const icon = document.getElementById('tipBannerIcon');
    const text = document.getElementById('tipBannerText');
    const cat  = document.getElementById('tipBannerCategory');
    const dots = document.querySelectorAll('.tip-dot');

    if (!icon || !text) return;

    if (animate) {
        text.classList.add('fade-out');
        setTimeout(() => {
            applyTipContent(tip, icon, text, cat, dots, index);
            text.classList.remove('fade-out');
        }, 320);
    } else {
        applyTipContent(tip, icon, text, cat, dots, index);
    }
}

function applyTipContent(tip, icon, text, cat, dots, index) {
    // Update icon class
    icon.className = 'bi ' + tip.icon;

    // Update text
    text.textContent = tip.text;

    // Update category
    if (cat) {
        cat.innerHTML = `<i class="bi ${tip.catIcon}"></i> ${tip.category}`;
    }

    // Update dots
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}

function nextTip() {
    currentTipIndex = (currentTipIndex + 1) % HEALTH_TIPS.length;
    renderTip(currentTipIndex);
    resetTipInterval();
}

function prevTip() {
    currentTipIndex = (currentTipIndex - 1 + HEALTH_TIPS.length) % HEALTH_TIPS.length;
    renderTip(currentTipIndex);
    resetTipInterval();
}

function goToTip(index) {
    currentTipIndex = index;
    renderTip(index);
    resetTipInterval();
}

function resetTipInterval() {
    if (tipInterval) clearInterval(tipInterval);
    tipInterval = setInterval(nextTip, 7000);
}

function initTipBanner() {
    const banner = document.getElementById('tipBanner');
    if (!banner) return;

    // Build dot indicators dynamically
    const dotsContainer = document.getElementById('tipDotsContainer');
    if (dotsContainer) {
        dotsContainer.innerHTML = HEALTH_TIPS.map((_, i) =>
            `<span class="tip-dot${i === 0 ? ' active' : ''}" onclick="goToTip(${i})"></span>`
        ).join('');
    }

    // Randomize starting tip
    currentTipIndex = Math.floor(Math.random() * HEALTH_TIPS.length);
    renderTip(currentTipIndex, false);

    // Auto-rotate
    resetTipInterval();
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

    // If user has photoURL, render profile photo inside app bar avatar.
    if (user && user.photoURL) {
        const safeName = (user.displayName || user.email || 'User').replace(/"/g, '&quot;');
        avatarEl.innerHTML = `<img src="${user.photoURL}" alt="${safeName}" loading="lazy">`;
        return;
    }

    // Fallback to text-based initial when photoURL is unavailable.
    const initial = (user && (user.displayName || user.email) ? (user.displayName || user.email) : 'D')
        .charAt(0)
        .toUpperCase();
    avatarEl.textContent = initial;
}

function bindAppBarAvatarWithFirebase() {
    if (typeof firebase === 'undefined') return;

    // Prevent duplicate listeners if this function is called more than once.
    if (window.__appBarAvatarBound) return;
    window.__appBarAvatarBound = true;

    // Ensure Firebase app exists before calling firebase.auth().
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
    initTipBanner();
    bindAppBarAvatarWithFirebase();
});
