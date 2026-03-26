/**
 * Myosig — Admin Dashboard (index.html)
 * Stats overview only
 */

initAdminPage(function (user) {
    const greet = document.getElementById('adminGreeting');
    if (greet) greet.textContent = 'Selamat datang, ' + (user.displayName || user.email);
    loadStats();
});

async function loadStats() {
    try {
        const usersSnap = await firestore.collection('users').get();
        let totalUsers = 0;
        let totalPatients = 0;
        let totalRecords = 0;

        const promises = [];
        usersSnap.forEach(doc => {
            const d = doc.data();
            if (d.email !== ADMIN_EMAIL) {
                totalUsers++;
                promises.push(
                    firestore.collection('users').doc(doc.id).collection('patients').get().then(pSnap => {
                        totalPatients += pSnap.size;
                        const rp = [];
                        pSnap.forEach(pDoc => {
                            rp.push(
                                firestore.collection('users').doc(doc.id)
                                    .collection('patients').doc(pDoc.id)
                                    .collection('monitoringRecords').get().then(rSnap => {
                                        totalRecords += rSnap.size;
                                    })
                            );
                        });
                        return Promise.all(rp);
                    })
                );
            }
        });
        await Promise.all(promises);

        setText('statTotalUsers', totalUsers);
        setText('statTotalPatients', totalPatients);
        setText('statTotalRecords', totalRecords);

        const bannerSnap = await firestore.collection('app_banners').get();
        setText('statTotalBanners', bannerSnap.size);

    } catch (e) {
        console.error('Stats error:', e);
    }
}
