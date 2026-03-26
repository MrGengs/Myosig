/**
 * Myosig — Admin Patients (patients.html)
 * List patients for a specific doctor
 * URL params: ?uid=doctorId&name=DoctorName
 */

const params = new URLSearchParams(window.location.search);
const doctorUid = params.get('uid');
const doctorName = params.get('name') || 'Dokter';

initAdminPage(async function () {
    if (!doctorUid) {
        window.location.href = 'users.html';
        return;
    }

    // Set doctor header
    setText('doctorName', decodeURIComponent(doctorName));

    // Load doctor info for avatar
    try {
        const userDoc = await firestore.collection('users').doc(doctorUid).get();
        if (userDoc.exists) {
            const d = userDoc.data();
            const avatarEl = document.getElementById('doctorAvatar');
            if (avatarEl) {
                const photo = d.photoURL || d.photoUrl || d.photo_url || d.profilePhoto || '';
                if (photo) {
                    const initial = (d.name || 'D').charAt(0).toUpperCase();
                    avatarEl.innerHTML = '<img src="' + esc(photo) + '" alt="' + esc(d.name || '') + '" onerror="this.remove(); this.parentElement.textContent=\'' + initial + '\'">';
                } else {
                    avatarEl.textContent = (d.name || 'D').charAt(0).toUpperCase();
                }
            }
        }
    } catch (_) {}

    loadPatients();
});

async function loadPatients() {
    const container = document.getElementById('patientsList');
    if (!container) return;

    try {
        const pSnap = await firestore.collection('users').doc(doctorUid).collection('patients').get();

        setText('totalPatientsCount', pSnap.size);

        if (pSnap.empty) {
            container.innerHTML = '<div class="admin-list-empty"><i class="bi bi-person-heart"></i><p>Dokter ini belum memiliki pasien</p></div>';
            return;
        }

        const patients = [];
        const promises = [];

        pSnap.forEach(doc => {
            const d = doc.data();
            const p = {
                id: doc.id,
                name: d.name || 'Tanpa Nama',
                email: d.email || '-',
                phone: d.phone || '-',
                gender: d.gender || '-',
                birthDate: d.birthDate || '-',
                strokeDate: d.strokeDate || '-',
                address: d.address || '-',
                medicalNotes: d.medicalNotes || '-',
                recordCount: 0
            };
            patients.push(p);
            promises.push(
                firestore.collection('users').doc(doctorUid)
                    .collection('patients').doc(doc.id)
                    .collection('monitoringRecords').get().then(rSnap => {
                        p.recordCount = rSnap.size;
                    })
            );
        });
        await Promise.all(promises);

        container.innerHTML = patients.map(p => `
            <div class="admin-patient-card" onclick="window.location.href='records.html?uid=${doctorUid}&pid=${p.id}&name=${encodeURIComponent(p.name)}'" style="cursor:pointer;">
                <div class="admin-patient-card-header">
                    <div class="admin-user-avatar" style="background:linear-gradient(135deg, #0891b2, #06b6d4);">
                        ${p.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="admin-user-info">
                        <div class="admin-user-name">${esc(p.name)}</div>
                        <div class="admin-user-email">${esc(p.email)}</div>
                    </div>
                    <div class="admin-user-badge">${p.recordCount} <small>record</small></div>
                </div>
                <div class="admin-patient-details">
                    <div class="admin-patient-detail-grid">
                        <div class="admin-patient-detail-item">
                            <span class="admin-detail-label"><i class="bi bi-telephone"></i> Telepon</span>
                            <span class="admin-detail-value">${esc(p.phone)}</span>
                        </div>
                        <div class="admin-patient-detail-item">
                            <span class="admin-detail-label"><i class="bi bi-gender-ambiguous"></i> Gender</span>
                            <span class="admin-detail-value">${esc(p.gender)}</span>
                        </div>
                        <div class="admin-patient-detail-item">
                            <span class="admin-detail-label"><i class="bi bi-calendar"></i> Lahir</span>
                            <span class="admin-detail-value">${esc(p.birthDate)}</span>
                        </div>
                        <div class="admin-patient-detail-item">
                            <span class="admin-detail-label"><i class="bi bi-calendar-event"></i> Stroke</span>
                            <span class="admin-detail-value">${esc(p.strokeDate)}</span>
                        </div>
                    </div>
                    ${p.medicalNotes !== '-' ? '<div class="admin-patient-notes"><i class="bi bi-file-text"></i> ' + esc(p.medicalNotes) + '</div>' : ''}
                </div>
                <div class="admin-patient-footer">
                    <span><i class="bi bi-activity"></i> Lihat ${p.recordCount} Record</span>
                    <i class="bi bi-chevron-right"></i>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error('Patients error:', e);
        container.innerHTML = '<div class="admin-list-empty"><i class="bi bi-exclamation-triangle"></i><p>Gagal memuat data: ' + esc(e.message) + '</p></div>';
    }
}
