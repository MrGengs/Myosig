/**
 * Myosig — Admin Users (users.html)
 * View doctors list with patient & record counts
 */

initAdminPage(function () {
    loadUsersList();
});

async function loadUsersList() {
    const container = document.getElementById('usersList');
    if (!container) return;

    container.innerHTML = '<div class="admin-list-loading"><i class="bi bi-hourglass-split"></i><p>Memuat data dokter...</p></div>';

    try {
        const usersSnap = await firestore.collection('users').get();
        const users = [];

        const promises = [];
        usersSnap.forEach(doc => {
            const d = doc.data();
            if (d.email !== ADMIN_EMAIL) {
                const u = {
                    id: doc.id,
                    name: d.name || 'Tanpa Nama',
                    email: d.email || '-',
                    phone: d.phone || '-',
                    gender: d.gender || '-',
                    address: d.address || '-',
                    photoURL: d.photoURL || d.photoUrl || d.photo_url || d.profilePhoto || '',
                    createdAt: d.createdAt || null,
                    patientCount: 0,
                    recordCount: 0
                };
                users.push(u);
                promises.push(
                    firestore.collection('users').doc(doc.id).collection('patients').get().then(pSnap => {
                        u.patientCount = pSnap.size;
                        const rp = [];
                        pSnap.forEach(pDoc => {
                            rp.push(
                                firestore.collection('users').doc(doc.id)
                                    .collection('patients').doc(pDoc.id)
                                    .collection('monitoringRecords').get().then(rSnap => {
                                        u.recordCount += rSnap.size;
                                    })
                            );
                        });
                        return Promise.all(rp);
                    })
                );
            }
        });
        await Promise.all(promises);

        setText('totalUsersCount', users.length);

        if (users.length === 0) {
            container.innerHTML = '<div class="admin-list-empty"><i class="bi bi-people"></i><p>Belum ada dokter terdaftar</p></div>';
            return;
        }

        container.innerHTML = users.map(u => `
            <div class="admin-user-card" onclick="window.location.href='patients.html?uid=${u.id}&name=${encodeURIComponent(u.name)}'" style="cursor:pointer;">
                <div class="admin-user-card-header">
                    <div class="admin-user-avatar">${u.photoURL ? '<img src="' + esc(u.photoURL) + '" alt="' + esc(u.name) + '" onerror="this.remove(); this.parentElement.textContent=\'' + u.name.charAt(0).toUpperCase() + '\'">' : u.name.charAt(0).toUpperCase()}</div>
                    <div class="admin-user-info">
                        <div class="admin-user-name">${esc(u.name)}</div>
                        <div class="admin-user-email">${esc(u.email)}</div>
                    </div>
                    <i class="bi bi-chevron-right" style="color:var(--text-light); font-size:1.2rem; flex-shrink:0;"></i>
                </div>
                <div class="admin-user-details">
                    <div class="admin-user-detail-row">
                        <i class="bi bi-telephone"></i>
                        <span>${esc(u.phone)}</span>
                    </div>
                    <div class="admin-user-detail-row">
                        <i class="bi bi-gender-ambiguous"></i>
                        <span>${esc(u.gender)}</span>
                    </div>
                    <div class="admin-user-detail-row">
                        <i class="bi bi-geo-alt"></i>
                        <span>${esc(u.address)}</span>
                    </div>
                </div>
                <div class="admin-user-stats-row">
                    <div class="admin-user-stat">
                        <div class="admin-user-stat-val">${u.patientCount}</div>
                        <div class="admin-user-stat-lbl">Pasien</div>
                    </div>
                    <div class="admin-user-stat">
                        <div class="admin-user-stat-val">${u.recordCount}</div>
                        <div class="admin-user-stat-lbl">Record</div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error('Users list error:', e);
        container.innerHTML = '<div class="admin-list-empty"><i class="bi bi-exclamation-triangle"></i><p>Gagal memuat data: ' + esc(e.message) + '</p></div>';
    }
}
