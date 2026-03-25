// Session Comparison JavaScript
// Compare two monitoring sessions side-by-side

let currentUser = null;
let allRecords = {};  // Cache: patientId -> records[]
let emgCompareChart = null;
let accelCompareChart = null;

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    function initWhenReady() {
        if (typeof firebase === 'undefined' || typeof initializeFirebase === 'undefined') {
            setTimeout(initWhenReady, 100);
            return;
        }
        initializeFirebase();
        auth.onAuthStateChanged(function(user) {
            if (!user) { window.location.href = 'auth.html'; return; }
            currentUser = user;
            loadPatients();

            // Check URL params for pre-selected patient
            const urlParams = new URLSearchParams(window.location.search);
            const prePatientId = urlParams.get('patientId');
            if (prePatientId) {
                setTimeout(() => {
                    const sel = document.getElementById('patientSelect');
                    if (sel) { sel.value = prePatientId; sel.dispatchEvent(new Event('change')); }
                }, 500);
            }
        });
    }
    initWhenReady();
});

// Load patients
async function loadPatients() {
    const select = document.getElementById('patientSelect');
    if (!select || !firestore || !currentUser) return;

    try {
        const snapshot = await firestore.collection('users').doc(currentUser.uid).collection('patients').get();
        select.innerHTML = '<option value="">-- Pilih Pasien --</option>';
        snapshot.forEach(doc => {
            const data = doc.data();
            const opt = document.createElement('option');
            opt.value = doc.id;
            opt.textContent = data.name || data.email || `Pasien ${doc.id.substring(0, 8)}`;
            select.appendChild(opt);
        });

        select.addEventListener('change', function() {
            if (this.value) loadRecords(this.value);
            else {
                document.getElementById('sessionA').innerHTML = '<option value="">-- Pilih Sesi --</option>';
                document.getElementById('sessionB').innerHTML = '<option value="">-- Pilih Sesi --</option>';
                document.getElementById('sessionA').disabled = true;
                document.getElementById('sessionB').disabled = true;
                document.getElementById('btnCompare').disabled = true;
            }
        });
    } catch (e) {
        console.error('Error loading patients:', e);
    }
}

// Load records for patient
async function loadRecords(patientId) {
    const sessionA = document.getElementById('sessionA');
    const sessionB = document.getElementById('sessionB');
    const btnCompare = document.getElementById('btnCompare');

    sessionA.innerHTML = '<option value="">Memuat...</option>';
    sessionB.innerHTML = '<option value="">Memuat...</option>';

    try {
        const snapshot = await firestore.collection('users').doc(currentUser.uid)
            .collection('patients').doc(patientId)
            .collection('monitoringRecords').get();

        const records = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            records.push({
                id: doc.id,
                time: data.time || '-',
                dateMonthYear: data.dateMonthYear || '-',
                timestamp: data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp)) : new Date(),
                duration: data.duration || 0,
                avgMuscleActivity: data.avgMuscleActivity || 0,
                movementCount: data.movementCount || 0,
                maxAcceleration: data.maxAcceleration || 0,
                recordedData: data.recordedData || []
            });
        });

        records.sort((a, b) => b.timestamp - a.timestamp);
        allRecords[patientId] = records;

        const optionsHTML = '<option value="">-- Pilih Sesi --</option>' +
            records.map((r, i) => {
                const date = r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp);
                const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                return `<option value="${i}">${dateStr} ${r.time} (${r.avgMuscleActivity}%)</option>`;
            }).join('');

        sessionA.innerHTML = optionsHTML;
        sessionB.innerHTML = optionsHTML;
        sessionA.disabled = false;
        sessionB.disabled = false;

        // Enable compare button when both selected
        const checkSelections = () => {
            btnCompare.disabled = !(sessionA.value !== '' && sessionB.value !== '' && sessionA.value !== sessionB.value);
        };
        sessionA.addEventListener('change', checkSelections);
        sessionB.addEventListener('change', checkSelections);

    } catch (e) {
        console.error('Error loading records:', e);
        sessionA.innerHTML = '<option value="">Error</option>';
        sessionB.innerHTML = '<option value="">Error</option>';
    }
}

// Compare sessions
function compareSession() {
    const patientId = document.getElementById('patientSelect').value;
    const idxA = parseInt(document.getElementById('sessionA').value);
    const idxB = parseInt(document.getElementById('sessionB').value);

    if (!patientId || isNaN(idxA) || isNaN(idxB)) return;

    const records = allRecords[patientId];
    if (!records) return;

    const sessionA = records[idxA];
    const sessionB = records[idxB];

    if (!sessionA || !sessionB) return;

    // Show results
    document.getElementById('comparisonResults').style.display = 'block';

    // Render stats comparison
    renderStatsComparison(sessionA, sessionB);

    // Render charts
    renderEMGComparison(sessionA, sessionB);
    renderAccelComparison(sessionA, sessionB);

    // Scroll to results
    document.getElementById('comparisonResults').scrollIntoView({ behavior: 'smooth' });
}

// Render stats comparison
function renderStatsComparison(a, b) {
    const container = document.getElementById('statsComparison');
    if (!container) return;

    const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
    const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);

    const metrics = [
        { label: 'Aktivitas Otot', valueA: a.avgMuscleActivity, valueB: b.avgMuscleActivity, unit: '%', higherBetter: true },
        { label: 'Jumlah Gerakan', valueA: a.movementCount, valueB: b.movementCount, unit: '', higherBetter: true },
        { label: 'Akselerasi Maks', valueA: a.maxAcceleration, valueB: b.maxAcceleration, unit: ' g', higherBetter: true, decimal: 2 },
        { label: 'Durasi', valueA: a.duration, valueB: b.duration, unit: ' dtk', higherBetter: true }
    ];

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center; margin-bottom: 1rem;">
            <div style="text-align: center; padding: 0.5rem; background: rgba(54, 162, 235, 0.1); border-radius: var(--border-radius);">
                <div style="font-weight: 600; color: rgb(54, 162, 235); font-size: 0.85rem;">Sesi A</div>
                <div style="font-size: 0.75rem; color: var(--text-light);">${dateA.toLocaleDateString('id-ID')} ${a.time}</div>
            </div>
            <div style="color: var(--text-light); font-weight: 600;">VS</div>
            <div style="text-align: center; padding: 0.5rem; background: rgba(255, 99, 132, 0.1); border-radius: var(--border-radius);">
                <div style="font-weight: 600; color: rgb(255, 99, 132); font-size: 0.85rem;">Sesi B</div>
                <div style="font-size: 0.75rem; color: var(--text-light);">${dateB.toLocaleDateString('id-ID')} ${b.time}</div>
            </div>
        </div>

        ${metrics.map(m => {
            const vA = m.decimal ? parseFloat(m.valueA).toFixed(m.decimal) : m.valueA;
            const vB = m.decimal ? parseFloat(m.valueB).toFixed(m.decimal) : m.valueB;
            const diff = parseFloat(m.valueB) - parseFloat(m.valueA);
            const diffStr = diff > 0 ? '+' + (m.decimal ? diff.toFixed(m.decimal) : Math.round(diff)) : (m.decimal ? diff.toFixed(m.decimal) : Math.round(diff));
            const isPositive = m.higherBetter ? diff > 0 : diff < 0;
            const deltaClass = diff === 0 ? 'delta-neutral' : (isPositive ? 'delta-positive' : 'delta-negative');

            return `
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem;">
                    <div class="compare-stat">
                        <div class="compare-stat-label">${m.label}</div>
                        <div class="compare-stat-value" style="color: rgb(54, 162, 235);">${vA}${m.unit}</div>
                    </div>
                    <div style="text-align: center;">
                        <div class="delta-badge ${deltaClass}">${diffStr}${m.unit}</div>
                    </div>
                    <div class="compare-stat">
                        <div class="compare-stat-label">${m.label}</div>
                        <div class="compare-stat-value" style="color: rgb(255, 99, 132);">${vB}${m.unit}</div>
                    </div>
                </div>
            `;
        }).join('')}
    `;
}

// Render EMG comparison chart
function renderEMGComparison(a, b) {
    const ctx = document.getElementById('emgCompareChart');
    if (!ctx) return;
    if (emgCompareChart) { emgCompareChart.destroy(); emgCompareChart = null; }

    const dataA = (a.recordedData || []).map(dp => Math.min((parseFloat(dp.emg_voltage) || 0) / 3.3 * 100, 100));
    const dataB = (b.recordedData || []).map(dp => Math.min((parseFloat(dp.emg_voltage) || 0) / 3.3 * 100, 100));

    const maxLen = Math.max(dataA.length, dataB.length, 1);
    const labels = Array.from({ length: maxLen }, (_, i) => i + 1);

    emgCompareChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Sesi A - EMG (%)',
                    data: dataA,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0
                },
                {
                    label: 'Sesi B - EMG (%)',
                    data: dataB,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                x: { display: true, title: { display: true, text: 'Data Point' }, ticks: { maxTicksLimit: 10 } },
                y: { display: true, title: { display: true, text: 'EMG (%)' }, beginAtZero: true, max: 100 }
            }
        }
    });
}

// Render Acceleration comparison chart
function renderAccelComparison(a, b) {
    const ctx = document.getElementById('accelCompareChart');
    if (!ctx) return;
    if (accelCompareChart) { accelCompareChart.destroy(); accelCompareChart = null; }

    const calcMag = (dp) => Math.sqrt(Math.pow(dp.ax || 0, 2) + Math.pow(dp.ay || 0, 2) + Math.pow(dp.az || 0, 2));
    const dataA = (a.recordedData || []).map(calcMag);
    const dataB = (b.recordedData || []).map(calcMag);

    const maxLen = Math.max(dataA.length, dataB.length, 1);
    const labels = Array.from({ length: maxLen }, (_, i) => i + 1);

    accelCompareChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Sesi A - Akselerasi (g)',
                    data: dataA,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0
                },
                {
                    label: 'Sesi B - Akselerasi (g)',
                    data: dataB,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                x: { display: true, title: { display: true, text: 'Data Point' }, ticks: { maxTicksLimit: 10 } },
                y: { display: true, title: { display: true, text: 'Akselerasi (g)' }, beginAtZero: true }
            }
        }
    });
}
