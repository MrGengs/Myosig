/**
 * Myosig — Admin Records (records.html)
 * List monitoring records + daily photos for a specific patient
 * URL params: ?uid=doctorId&pid=patientId&name=PatientName
 */

const params = new URLSearchParams(window.location.search);
const doctorUid = params.get('uid');
const patientId = params.get('pid');
const patientName = decodeURIComponent(params.get('name') || 'Pasien');

let photosMap = {}; // { 'YYYY-MM-DD': photoUrl }

initAdminPage(function () {
    if (!doctorUid || !patientId) {
        window.location.href = 'users.html';
        return;
    }

    setText('patientName', patientName);
    const initialEl = document.getElementById('patientInitial');
    if (initialEl) initialEl.textContent = patientName.charAt(0).toUpperCase();

    loadPatientInfo();
    loadAll();
});

async function loadPatientInfo() {
    try {
        const doc = await firestore.collection('users').doc(doctorUid)
            .collection('patients').doc(patientId).get();
        if (!doc.exists) return;
        const d = doc.data();

        const infoEl = document.getElementById('patientInfo');
        if (!infoEl) return;

        infoEl.innerHTML = `
            <div class="admin-patient-detail-grid">
                <div class="admin-patient-detail-item">
                    <span class="admin-detail-label"><i class="bi bi-envelope"></i> Email</span>
                    <span class="admin-detail-value">${esc(d.email || '-')}</span>
                </div>
                <div class="admin-patient-detail-item">
                    <span class="admin-detail-label"><i class="bi bi-telephone"></i> Telepon</span>
                    <span class="admin-detail-value">${esc(d.phone || '-')}</span>
                </div>
                <div class="admin-patient-detail-item">
                    <span class="admin-detail-label"><i class="bi bi-gender-ambiguous"></i> Gender</span>
                    <span class="admin-detail-value">${esc(d.gender || '-')}</span>
                </div>
                <div class="admin-patient-detail-item">
                    <span class="admin-detail-label"><i class="bi bi-calendar"></i> Lahir</span>
                    <span class="admin-detail-value">${esc(d.birthDate || '-')}</span>
                </div>
                <div class="admin-patient-detail-item">
                    <span class="admin-detail-label"><i class="bi bi-calendar-event"></i> Tanggal Stroke</span>
                    <span class="admin-detail-value">${esc(d.strokeDate || '-')}</span>
                </div>
                <div class="admin-patient-detail-item">
                    <span class="admin-detail-label"><i class="bi bi-geo-alt"></i> Alamat</span>
                    <span class="admin-detail-value">${esc(d.address || '-')}</span>
                </div>
            </div>
            ${d.medicalNotes ? '<div class="admin-patient-notes" style="-webkit-line-clamp:unset; line-clamp:unset;"><i class="bi bi-file-text"></i> ' + esc(d.medicalNotes) + '</div>' : ''}
        `;
    } catch (e) {
        console.warn('Patient info error:', e);
    }
}

async function loadAll() {
    // Load photos first, then records
    await loadDailyPhotos();
    await loadRecords();
}

async function loadDailyPhotos() {
    try {
        const snap = await firestore.collection('users').doc(doctorUid)
            .collection('patients').doc(patientId)
            .collection('dailyPhotos').get();

        photosMap = {};
        snap.forEach(doc => {
            const d = doc.data();
            // doc.id = YYYY-MM-DD
            if (d.photoUrl) {
                photosMap[doc.id] = d.photoUrl;
            }
        });
    } catch (e) {
        console.warn('Photos load error:', e);
    }
}

/**
 * Convert record dateMonthYear (D-M-YYYY) to YYYY-MM-DD to match photo keys
 */
function recordDateToPhotoKey(dateMonthYear) {
    if (!dateMonthYear) return null;
    const sep = dateMonthYear.includes('/') ? '/' : '-';
    const parts = dateMonthYear.split(sep);
    if (parts.length !== 3) return null;
    const dd = parts[0].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    const yyyy = parts[2];
    return `${yyyy}-${mm}-${dd}`;
}

async function loadRecords() {
    const container = document.getElementById('recordsList');
    if (!container) return;

    try {
        const rSnap = await firestore.collection('users').doc(doctorUid)
            .collection('patients').doc(patientId)
            .collection('monitoringRecords')
            .orderBy('timestamp', 'desc')
            .get();

        setText('totalRecordsCount', rSnap.size);

        if (rSnap.empty) {
            container.innerHTML = '<div class="admin-list-empty"><i class="bi bi-activity"></i><p>Belum ada record monitoring untuk pasien ini</p></div>';
            return;
        }

        let html = '';
        rSnap.forEach(doc => {
            const r = doc.data();

            const dateStr = r.dateMonthYear || '-';
            const timeStr = r.time || '-';

            // Duration
            const dur = r.duration || 0;
            const durMin = Math.floor(dur / 60);
            const durSec = dur % 60;
            const durStr = durMin > 0 ? durMin + 'm ' + durSec + 's' : dur + 's';

            // EMG zone
            const emg = r.avgMuscleActivity || 0;
            let emgColor = '#7A8BA8';
            let emgLabel = 'Istirahat';
            if (emg >= 70) { emgColor = '#dc2626'; emgLabel = 'Sangat Tinggi'; }
            else if (emg >= 50) { emgColor = '#f59e0b'; emgLabel = 'Tinggi'; }
            else if (emg >= 30) { emgColor = '#0891b2'; emgLabel = 'Sedang'; }
            else if (emg >= 10) { emgColor = '#10b981'; emgLabel = 'Ringan'; }

            // Fatigue
            const fatigue = r.fatigueIndex || 0;
            const peakFatigue = r.peakFatigue || 0;

            // Zone distribution
            const zones = r.zoneDistribution || [];

            // Photo for this date
            const photoKey = recordDateToPhotoKey(dateStr);
            const photoUrl = photoKey ? (photosMap[photoKey] || null) : null;

            html += `
                <div class="admin-record-card">
                    <div class="admin-record-header">
                        <div class="admin-record-date">
                            <i class="bi bi-calendar3"></i> ${esc(dateStr)}
                        </div>
                        <div class="admin-record-time">
                            <i class="bi bi-clock"></i> ${esc(timeStr)}
                        </div>
                    </div>

                    ${photoUrl ? `
                    <div class="admin-record-photo" onclick="openPhoto('${photoUrl}')">
                        <img src="${photoUrl}" alt="Foto dokumentasi ${esc(dateStr)}" loading="lazy">
                        <div class="admin-record-photo-badge"><i class="bi bi-camera-fill"></i> Dokumentasi</div>
                    </div>
                    ` : ''}

                    <div class="admin-record-stats">
                        <div class="admin-record-stat">
                            <div class="admin-record-stat-icon" style="color:${emgColor};"><i class="bi bi-activity"></i></div>
                            <div>
                                <div class="admin-record-stat-val" style="color:${emgColor};">${emg.toFixed(1)}%</div>
                                <div class="admin-record-stat-lbl">Otot (${emgLabel})</div>
                            </div>
                        </div>
                        <div class="admin-record-stat">
                            <div class="admin-record-stat-icon"><i class="bi bi-arrow-repeat"></i></div>
                            <div>
                                <div class="admin-record-stat-val">${r.movementCount || 0}</div>
                                <div class="admin-record-stat-lbl">Gerakan</div>
                            </div>
                        </div>
                        <div class="admin-record-stat">
                            <div class="admin-record-stat-icon"><i class="bi bi-speedometer2"></i></div>
                            <div>
                                <div class="admin-record-stat-val">${(r.maxAcceleration || 0).toFixed(2)}g</div>
                                <div class="admin-record-stat-lbl">Akselerasi Maks</div>
                            </div>
                        </div>
                        <div class="admin-record-stat">
                            <div class="admin-record-stat-icon"><i class="bi bi-hourglass-split"></i></div>
                            <div>
                                <div class="admin-record-stat-val">${durStr}</div>
                                <div class="admin-record-stat-lbl">Durasi</div>
                            </div>
                        </div>
                        <div class="admin-record-stat">
                            <div class="admin-record-stat-icon"><i class="bi bi-battery-half"></i></div>
                            <div>
                                <div class="admin-record-stat-val">${fatigue.toFixed(1)}%</div>
                                <div class="admin-record-stat-lbl">Kelelahan (puncak ${peakFatigue.toFixed(1)}%)</div>
                            </div>
                        </div>
                        <div class="admin-record-stat">
                            <div class="admin-record-stat-icon"><i class="bi bi-router"></i></div>
                            <div>
                                <div class="admin-record-stat-val">${esc(r.device || '-')}</div>
                                <div class="admin-record-stat-lbl">Device</div>
                            </div>
                        </div>
                    </div>

                    ${zones.length > 0 ? `
                    <div class="admin-record-zones">
                        <div class="admin-record-zones-title"><i class="bi bi-bar-chart"></i> Distribusi Zona EMG</div>
                        ${zones.map(z => `
                            <div class="admin-record-zone-row">
                                <span class="admin-record-zone-name">${esc(z.name)}</span>
                                <div class="admin-record-zone-bar-bg">
                                    <div class="admin-record-zone-bar" style="width:${z.percent || 0}%;"></div>
                                </div>
                                <span class="admin-record-zone-pct">${(z.percent || 0).toFixed(0)}%</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (e) {
        console.error('Records error:', e);
        container.innerHTML = '<div class="admin-list-empty"><i class="bi bi-exclamation-triangle"></i><p>Gagal memuat record: ' + esc(e.message) + '</p></div>';
    }
}

/* Photo lightbox */
function openPhoto(url) {
    const lb = document.getElementById('photoLightbox');
    const img = document.getElementById('photoLightboxImg');
    if (!lb || !img) return;
    img.src = url;
    lb.classList.add('active');
}

function closePhotoLightbox(e) {
    if (e && e.target.tagName === 'IMG') return;
    const lb = document.getElementById('photoLightbox');
    if (lb) lb.classList.remove('active');
}
