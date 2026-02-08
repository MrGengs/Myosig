// Patient Detail JavaScript
// Handle patient detail page with records and charts

let currentUser = null;
let patientId = null;
let recordsChart = null;
let patientData = null; // Store patient data globally
let patientRecords = []; // Store patient records globally
let chartPeriod = 'weekly'; // Default: weekly, can be 'weekly' or 'monthly'

// Note: GEMINI_API_KEY and GEMINI_API_URL are declared in firebase-config.js
// Use the existing constants from firebase-config.js

// Initialize patient detail page
window.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase SDK and config to load
    function initWhenReady() {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            setTimeout(initWhenReady, 100);
            return;
        }
        
        // Check if initializeFirebase function is available
        if (typeof initializeFirebase === 'undefined') {
            setTimeout(initWhenReady, 100);
            return;
        }
        
        // Initialize Firebase
        initializeFirebase();
        
        // Check authentication
        auth.onAuthStateChanged(function(user) {
            if (!user) {
                window.location.href = 'auth.html';
                return;
            }
            
            currentUser = user;
            
            // Get patient ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            patientId = urlParams.get('id');
            
            if (!patientId) {
                if (typeof showAlert === 'function') {
                    showAlert('ID Pasien tidak ditemukan!', 'Kesalahan');
                }
                window.location.href = 'patient.html';
                return;
            }
            
            // Load patient data and records
            loadPatientData();
            loadPatientRecords();
        });
    }
    
    // Start initialization
    initWhenReady();
});

// Load patient data from Firestore
async function loadPatientData() {
    try {
        if (firestore && patientId && currentUser) {
            // Get patient from subcollection under doctor's document
            const doc = await firestore.collection('users')
                .doc(currentUser.uid)
                .collection('patients')
                .doc(patientId)
                .get();
            
            if (doc.exists) {
                const data = doc.data();
                patientData = data; // Store patient data globally
                displayPatientInfo(data);
            } else {
                if (typeof showAlert === 'function') {
                    showAlert('Data pasien tidak ditemukan!', 'Kesalahan');
                }
                window.location.href = 'patient.html';
            }
        }
    } catch (error) {
        console.error('Error loading patient data:', error);
        if (typeof showAlert === 'function') {
            showAlert('Gagal memuat data pasien: ' + error.message, 'Kesalahan');
        }
    }
}

// Display patient information
function displayPatientInfo(data) {
    // Patient name and ID
    const patientName = document.getElementById('patientName');
    const patientIdValue = document.getElementById('patientIdValue');
    
    if (patientName) {
        patientName.textContent = data.name || 'Nama Pasien';
    }
    
    if (patientIdValue && patientId) {
        // Use first 8 characters of ID as patient ID
        patientIdValue.textContent = patientId.substring(0, 8).toUpperCase();
    }
    
    // Patient information
    document.getElementById('infoEmail').textContent = data.email || '-';
    document.getElementById('infoPhone').textContent = data.phone || '-';
    document.getElementById('infoBirthDate').textContent = data.birthDate 
        ? formatDate(new Date(data.birthDate)) 
        : '-';
    document.getElementById('infoGender').textContent = data.gender || '-';
    document.getElementById('infoAddress').textContent = data.address || '-';
    
    // Medical information
    document.getElementById('infoStrokeDate').textContent = data.strokeDate 
        ? formatDate(new Date(data.strokeDate)) 
        : '-';
    
    const medicalNotes = document.getElementById('infoMedicalNotes');
    if (medicalNotes) {
        const notesText = data.medicalNotes || '-';
        medicalNotes.querySelector('p').textContent = notesText;
    }
}

// Load patient records from Firestore
async function loadPatientRecords() {
    const recordsList = document.getElementById('recordsList');
    if (!recordsList) return;
    
    // Show loading state
    recordsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-light);">
            <i class="bi bi-hourglass-split" style="font-size: 2rem;"></i>
            <p style="margin-top: 1rem;">Memuat riwayat record...</p>
        </div>
    `;
    
    try {
        if (firestore && patientId && currentUser) {
            // Verify patient exists in doctor's subcollection
            const patientDoc = await firestore.collection('users')
                .doc(currentUser.uid)
                .collection('patients')
                .doc(patientId)
                .get();
            
            if (!patientDoc.exists) {
                if (typeof showAlert === 'function') {
                    showAlert('Anda tidak memiliki akses ke pasien ini!', 'Akses Ditolak');
                }
                window.location.href = 'patient.html';
                return;
            }
            
            // Get all monitoring records for this patient from patient's subcollection
            // Structure: users/{userId}/patients/{patientId}/monitoringRecords/{recordId}
            const snapshot = await firestore.collection('users')
                .doc(currentUser.uid)
                .collection('patients')
                .doc(patientId)
                .collection('monitoringRecords')
                .get();
            
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
                    maxAcceleration: data.maxAcceleration || 0
                });
            });
            
            // Sort by timestamp descending (newest first) for display
            records.sort((a, b) => {
                // Ensure timestamps are Date objects for comparison
                const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
                const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
                return dateB.getTime() - dateA.getTime();
            });
            
            // Store records globally for AI recommendation
            patientRecords = records;
            
            // Display records
            displayRecords(records);
            
            // Create chart - ensure DOM and Chart.js are ready
            // Use requestAnimationFrame to ensure DOM is fully rendered
            requestAnimationFrame(() => {
                setTimeout(() => {
                    createRecordsChart(records);
                    // Set default button state (weekly is default)
                    const btnWeekly = document.getElementById('btnChartWeekly');
                    const btnMonthly = document.getElementById('btnChartMonthly');
                    if (btnWeekly && btnMonthly) {
                        btnWeekly.className = 'btn btn-sm btn-primary';
                        btnMonthly.className = 'btn btn-sm btn-secondary';
                    }
                }, 50);
            });
            
            // Automatically load AI recommendation after data is loaded
            // Wait a bit to ensure chart is rendered first
            setTimeout(() => {
                getAIRecommendation();
            }, 500);
            
        } else {
            recordsList.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>Belum ada record monitoring untuk pasien ini.</p>
                </div>
            `;
            
            // Still try to load AI recommendation even if no records
            // AI can still provide general recommendations based on patient data
            setTimeout(() => {
                getAIRecommendation();
            }, 500);
        }
    } catch (error) {
        console.error('Error loading records:', error);
        recordsList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle"></i>
                <p>Gagal memuat riwayat record: ${error.message}</p>
            </div>
        `;
    }
}

// Display records list
function displayRecords(records) {
    const recordsList = document.getElementById('recordsList');
    if (!recordsList) return;
    
    if (!records || records.length === 0) {
        recordsList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>Belum ada record monitoring untuk pasien ini.</p>
            </div>
        `;
        return;
    }
    
    recordsList.innerHTML = records.map(record => {
        const dateStr = formatDate(record.timestamp);
        
        return `
            <div class="record-item">
                <div class="record-header">
                    <div>
                        <div class="record-date">${dateStr}</div>
                        <div class="record-time">${record.time}</div>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-light);">
                        ${record.duration} detik
                    </div>
                </div>
                <div class="record-stats">
                    <div class="record-stat">
                        <div class="record-stat-label">Aktivitas Otot Rata-rata</div>
                        <div class="record-stat-value">${record.avgMuscleActivity}%</div>
                    </div>
                    <div class="record-stat">
                        <div class="record-stat-label">Jumlah Gerakan</div>
                        <div class="record-stat-value">${record.movementCount}</div>
                    </div>
                    <div class="record-stat">
                        <div class="record-stat-label">Akselerasi Maks</div>
                        <div class="record-stat-value">${record.maxAcceleration.toFixed(2)} g</div>
                    </div>
                    <div class="record-stat">
                        <div class="record-stat-label">Durasi</div>
                        <div class="record-stat-value">${Math.floor(record.duration / 60)}:${String(record.duration % 60).padStart(2, '0')}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Change chart period (weekly/monthly)
// Make function globally accessible
window.changeChartPeriod = function changeChartPeriod(period) {
    chartPeriod = period;
    
    // Update button styles
    const btnWeekly = document.getElementById('btnChartWeekly');
    const btnMonthly = document.getElementById('btnChartMonthly');
    
    if (btnWeekly && btnMonthly) {
        if (period === 'weekly') {
            btnWeekly.className = 'btn btn-sm btn-primary';
            btnMonthly.className = 'btn btn-sm btn-secondary';
        } else {
            btnWeekly.className = 'btn btn-sm btn-secondary';
            btnMonthly.className = 'btn btn-sm btn-primary';
        }
    }
    
    // Recreate chart with new period
    if (patientRecords && patientRecords.length > 0) {
        createRecordsChart(patientRecords);
    }
}

// Create records chart
function createRecordsChart(records) {
    // Wait for Chart.js to be loaded (with retry mechanism)
    let retryCount = 0;
    const maxRetries = 10;
    
    function tryCreateChart() {
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            retryCount++;
            if (retryCount < maxRetries) {
                // Retry after 100ms
                setTimeout(tryCreateChart, 100);
                return;
            }
            
            // Max retries reached, show error
            console.error('Chart.js is not loaded after', maxRetries, 'retries');
            const chartContainer = document.querySelector('.chart-container');
            if (chartContainer) {
                chartContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                        <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                        <p style="margin-top: 1rem;">Chart.js tidak dimuat. Silakan refresh halaman.</p>
                    </div>
                `;
            }
            return;
        }
        
        // Chart.js is loaded, proceed with chart creation
        createChart(records);
    }
    
    // Start trying to create chart
    tryCreateChart();
}

// Actual chart creation function
function createChart(records) {
    // Get canvas element
    const ctx = document.getElementById('recordsChart');
    if (!ctx) {
        console.error('Chart canvas element not found');
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p style="margin-top: 1rem;">Canvas element tidak ditemukan.</p>
                </div>
            `;
        }
        return;
    }
    
    // Destroy existing chart if any
    if (recordsChart) {
        recordsChart.destroy();
        recordsChart = null;
    }
    
    // Handle empty records - show empty chart with message
    if (!records || records.length === 0) {
        recordsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Belum ada data'],
                datasets: [
                    {
                        label: 'Aktivitas Otot Rata-rata (%)',
                        data: [],
                        borderColor: 'rgb(91, 155, 213)',
                        backgroundColor: 'rgba(91, 155, 213, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Jumlah Gerakan',
                        data: [],
                        borderColor: 'rgb(157, 80, 255)',
                        backgroundColor: 'rgba(157, 80, 255, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Belum ada data record untuk ditampilkan',
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Aktivitas Otot (%)'
                        },
                        beginAtZero: true
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Jumlah Gerakan'
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
        return;
    }
    
    // Filter records based on selected period
    const now = new Date();
    let filteredRecords = [];
    
    if (chartPeriod === 'weekly') {
        // Get records from last 7 days
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0); // Start of day
        
        filteredRecords = records.filter(record => {
            const recordDate = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp);
            recordDate.setHours(0, 0, 0, 0);
            return recordDate >= sevenDaysAgo;
        });
    } else {
        // Get records from last 30 days (monthly)
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0); // Start of day
        
        filteredRecords = records.filter(record => {
            const recordDate = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp);
            recordDate.setHours(0, 0, 0, 0);
            return recordDate >= thirtyDaysAgo;
        });
    }
    
    // If no records in period, use all records
    if (filteredRecords.length === 0) {
        filteredRecords = records;
    }
    
    // Sort by timestamp ascending for chronological order
    const sortedRecords = [...filteredRecords].sort((a, b) => {
        // Ensure timestamps are Date objects
        const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return dateA.getTime() - dateB.getTime();
    });
    
    // Take records (limit to 30 for monthly, 10 for weekly)
    const maxRecords = chartPeriod === 'monthly' ? 30 : 10;
    const recentRecords = sortedRecords.slice(-maxRecords);
    
    // Create labels from timestamps based on period
    const labels = recentRecords.map(r => {
        try {
            // Ensure timestamp is a Date object
            const date = r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            
            if (chartPeriod === 'weekly') {
                // For weekly: show day and date (e.g., "Sen, 15/01")
                const days = ['Minggu', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
                const dayName = days[date.getDay()];
                const day = date.getDate();
                const month = date.getMonth() + 1;
                return `${dayName}, ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
            } else {
                // For monthly: show date only (e.g., "15/01")
                const day = date.getDate();
                const month = date.getMonth() + 1;
                return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
            }
        } catch (e) {
            console.error('Error formatting date:', e, r.timestamp);
            return 'N/A';
        }
    });
    
    // Extract data values, ensure they are numbers
    const avgMuscleActivityData = recentRecords.map(r => {
        const value = parseFloat(r.avgMuscleActivity) || 0;
        return isNaN(value) ? 0 : value;
    });
    
    const movementCountData = recentRecords.map(r => {
        const value = parseFloat(r.movementCount) || 0;
        return isNaN(value) ? 0 : value;
    });
    
    // Create chart with error handling
    try {
        recordsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Aktivitas Otot Rata-rata (%)',
                        data: avgMuscleActivityData,
                        borderColor: 'rgb(91, 155, 213)',
                        backgroundColor: 'rgba(91, 155, 213, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Jumlah Gerakan',
                        data: movementCountData,
                        borderColor: 'rgb(157, 80, 255)',
                        backgroundColor: 'rgba(157, 80, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Tanggal',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Aktivitas Otot (%)',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            stepSize: 10
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Jumlah Gerakan',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
        
        console.log('Chart created successfully with', recentRecords.length, 'records');
    } catch (error) {
        console.error('Error creating chart:', error);
        // Show error message
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p style="margin-top: 1rem;">Gagal membuat grafik: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Format date to Indonesian format
function formatDate(date) {
    if (!date) return '-';
    
    const d = new Date(date);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// Handle window resize to update chart
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (recordsChart) {
            recordsChart.resize();
        }
    }, 250);
});

// Get AI Recommendation using Gemini API
// Automatically called when patient data is loaded
async function getAIRecommendation() {
    const aiContent = document.getElementById('aiRecommendationContent');
    
    // Validate data availability
    if (!patientData) {
        if (aiContent) {
            aiContent.innerHTML = `
                <div class="ai-error">
                    <i class="bi bi-exclamation-triangle"></i>
                    <p>Data pasien belum dimuat. Silakan tunggu sebentar dan coba lagi.</p>
                </div>
            `;
        }
        return;
    }
    
    // Show loading state in content area
    if (!aiContent) return;
    
    aiContent.innerHTML = `
        <div class="ai-loading">
            <i class="bi bi-arrow-repeat" style="font-size: 2rem;"></i>
            <p style="margin-top: 1rem;">AI sedang menganalisis data pasien dan memberikan rekomendasi...</p>
            <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-light);">Mohon tunggu sebentar...</p>
        </div>
    `;
    
    try {
        // Check if there are any records
        if (!patientRecords || patientRecords.length === 0) {
            // Show message when no records available
            aiContent.innerHTML = `
                <div class="ai-recommendation">
                    <div style="color: var(--text-dark); line-height: 1.8; padding: 1rem;">
                        <p style="color: var(--text-light); font-style: italic; text-align: center; padding: 2rem;">
                            <i class="bi bi-info-circle" style="font-size: 2rem; display: block; margin-bottom: 1rem;"></i>
                            Belum ada data riwayat untuk pasien ini.
                        </p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Prepare patient data summary
        const patientSummary = preparePatientSummary();
        
        // Call Gemini API
        const recommendation = await callGeminiAPI(patientSummary);
        
        // Display recommendation
        displayAIRecommendation(recommendation);
        
    } catch (error) {
        console.error('Error getting AI recommendation:', error);
        
        // Check if error is due to API key issue
        const isAPIKeyError = error.message && (
            error.message.includes('API key') || 
            error.message.includes('leaked') || 
            error.message.includes('403') ||
            error.message.includes('Forbidden')
        );
        
        if (isAPIKeyError) {
            // Show user-friendly message for API key errors
            aiContent.innerHTML = `
                <div class="ai-error">
                    <i class="bi bi-exclamation-triangle"></i>
                    <p><strong>Layanan AI Recommendation Sementara Tidak Tersedia</strong></p>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem;">Layanan rekomendasi AI sedang dalam perawatan. Silakan hubungi administrator untuk informasi lebih lanjut.</p>
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(91, 155, 213, 0.1); border-radius: var(--border-radius); border-left: 3px solid var(--primary-blue);">
                        <p style="margin: 0; font-size: 0.9rem; color: var(--text-dark);">
                            <strong>Rekomendasi Umum untuk Rehabilitasi Stroke:</strong>
                        </p>
                        <ul style="margin-top: 0.5rem; margin-left: 1.5rem; color: var(--text-dark); line-height: 1.8;">
                            <li>Lakukan latihan gerak lengan secara rutin setiap hari</li>
                            <li>Pantau aktivitas otot dengan konsisten</li>
                            <li>Istirahat yang cukup antara sesi latihan</li>
                            <li>Konsultasikan dengan fisioterapis untuk program latihan yang sesuai</li>
                            <li>Catat perkembangan secara berkala</li>
                        </ul>
                    </div>
                </div>
            `;
        } else {
            // Show generic error message for other errors
            aiContent.innerHTML = `
                <div class="ai-error">
                    <i class="bi bi-exclamation-triangle"></i>
                    <p><strong>Gagal mendapatkan rekomendasi AI</strong></p>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem;">${error.message || 'Terjadi kesalahan saat memproses permintaan.'}</p>
                    <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-light);">Silakan refresh halaman untuk mencoba lagi.</p>
                </div>
            `;
        }
    }
}

// Prepare patient data summary for AI
function preparePatientSummary() {
    if (!patientData) return '';
    
    let summary = `DATA PASIEN REHABILITASI STROKE:\n\n`;
    
    // Patient basic info
    summary += `Informasi Pasien:\n`;
    summary += `- Nama: ${patientData.name || 'Tidak diketahui'}\n`;
    summary += `- Usia: ${patientData.birthDate ? calculateAge(patientData.birthDate) + ' tahun' : 'Tidak diketahui'}\n`;
    summary += `- Jenis Kelamin: ${patientData.gender || 'Tidak diketahui'}\n`;
    summary += `- Tanggal Stroke: ${patientData.strokeDate ? formatDate(new Date(patientData.strokeDate)) : 'Tidak diketahui'}\n`;
    
    if (patientData.medicalNotes) {
        summary += `- Catatan Medis: ${patientData.medicalNotes}\n`;
    }
    
    summary += `\n`;
    
    // Monitoring records summary
    // Check if there are any records at all
    if (!patientRecords || patientRecords.length === 0) {
        summary += `RIWAYAT MONITORING: Belum ada data riwayat untuk pasien ini.\n`;
        summary += `Pasien belum memiliki sesi monitoring yang tercatat.\n`;
        return summary;
    }
    
    if (patientRecords && patientRecords.length > 0) {
        summary += `RIWAYAT MONITORING (Total ${patientRecords.length} sesi):\n\n`;
        
        // Calculate statistics
        const avgMuscleActivities = patientRecords.map(r => parseFloat(r.avgMuscleActivity) || 0);
        const movementCounts = patientRecords.map(r => parseFloat(r.movementCount) || 0);
        const maxAccelerations = patientRecords.map(r => parseFloat(r.maxAcceleration) || 0);
        const durations = patientRecords.map(r => parseFloat(r.duration) || 0);
        
        const avgMuscleActivity = avgMuscleActivities.reduce((a, b) => a + b, 0) / avgMuscleActivities.length;
        const avgMovementCount = movementCounts.reduce((a, b) => a + b, 0) / movementCounts.length;
        const maxAcceleration = Math.max(...maxAccelerations);
        const totalDuration = durations.reduce((a, b) => a + b, 0);
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        
        // Recent records (last 5)
        const recentRecords = patientRecords.slice(0, 5);
        
        summary += `Statistik Keseluruhan:\n`;
        summary += `- Rata-rata Aktivitas Otot: ${avgMuscleActivity.toFixed(1)}%\n`;
        summary += `- Rata-rata Jumlah Gerakan per Sesi: ${avgMovementCount.toFixed(1)}\n`;
        summary += `- Akselerasi Maksimum: ${maxAcceleration.toFixed(2)} g\n`;
        summary += `- Total Durasi Monitoring: ${Math.floor(totalDuration / 60)} menit ${totalDuration % 60} detik\n`;
        summary += `- Rata-rata Durasi per Sesi: ${Math.floor(avgDuration / 60)} menit ${Math.floor(avgDuration % 60)} detik\n`;
        
        summary += `\n5 Sesi Terakhir:\n`;
        recentRecords.forEach((record, index) => {
            const date = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp);
            summary += `${index + 1}. ${formatDate(date)} - Aktivitas: ${record.avgMuscleActivity}%, Gerakan: ${record.movementCount}, Durasi: ${Math.floor(record.duration / 60)}:${String(record.duration % 60).padStart(2, '0')}\n`;
        });
        
        // Trend analysis
        if (recentRecords.length >= 2) {
            const firstActivity = parseFloat(recentRecords[recentRecords.length - 1].avgMuscleActivity) || 0;
            const lastActivity = parseFloat(recentRecords[0].avgMuscleActivity) || 0;
            const activityTrend = lastActivity > firstActivity ? 'Meningkat' : lastActivity < firstActivity ? 'Menurun' : 'Stabil';
            
            summary += `\nTren Aktivitas: ${activityTrend} (dari ${firstActivity.toFixed(1)}% ke ${lastActivity.toFixed(1)}%)\n`;
        }
    } else {
        summary += `RIWAYAT MONITORING: Belum ada data monitoring.\n`;
    }
    
    return summary;
}

// Calculate age from birth date
function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Call Gemini API
async function callGeminiAPI(patientSummary) {
    // Check if Gemini API constants are available (from firebase-config.js)
    if (typeof GEMINI_API_KEY === 'undefined' || typeof GEMINI_API_URL === 'undefined') {
        throw new Error('Gemini API configuration tidak ditemukan. Pastikan firebase-config.js dimuat terlebih dahulu.');
    }
    
    // Use the API URL from firebase-config.js (gemini-2.5-flash or fallback to gemini-pro)
    const apiUrl = GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const apiKey = GEMINI_API_KEY;
    
    // Validate API key format (basic check)
    if (!apiKey || apiKey.length < 20) {
        throw new Error('API key tidak valid');
    }
    
    const prompt = `Anda adalah seorang ahli fisioterapi dan rehabilitasi stroke. Berdasarkan data pasien berikut, berikan rekomendasi yang spesifik dan praktis untuk program rehabilitasi:

${patientSummary}

Berikan rekomendasi dalam format berikut:
1. Analisis singkat kondisi pasien berdasarkan data monitoring
2. Rekomendasi latihan yang sesuai (3-5 latihan spesifik)
3. Tips untuk meningkatkan aktivitas otot
4. Saran frekuensi dan durasi latihan
5. Peringatan atau hal yang perlu diperhatikan

Gunakan bahasa Indonesia yang mudah dipahami. Fokus pada rehabilitasi stroke dan peningkatan aktivitas otot lengan.`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };
    
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        
        try {
            const errorData = await response.json();
            if (errorData.error) {
                errorMessage = errorData.error.message || errorData.error.status || errorMessage;
            }
        } catch (e) {
            // If JSON parsing fails, use status text
            console.warn('Could not parse error response:', e);
        }
        
        // Provide more specific error messages
        if (response.status === 403) {
            errorMessage = 'API key tidak valid atau telah dilaporkan sebagai leaked. Silakan gunakan API key yang baru.';
        } else if (response.status === 401) {
            errorMessage = 'API key tidak valid atau tidak memiliki izin akses.';
        } else if (response.status === 429) {
            errorMessage = 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
        }
        
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Extract text from Gemini response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Format respons API tidak valid');
    }
}

// Display AI recommendation
function displayAIRecommendation(recommendation) {
    const aiContent = document.getElementById('aiRecommendationContent');
    
    if (!aiContent) return;
    
    // Format the recommendation text properly
    let formattedRecommendation = recommendation;
    
    // Escape HTML to prevent XSS
    formattedRecommendation = formattedRecommendation
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Convert double newlines to paragraph breaks
    formattedRecommendation = formattedRecommendation.replace(/\n\n+/g, '</p><p>');
    
    // Convert single newlines to line breaks
    formattedRecommendation = formattedRecommendation.replace(/\n/g, '<br>');
    
    // Highlight numbered sections (1., 2., etc.)
    formattedRecommendation = formattedRecommendation.replace(/(\d+\.\s+[^<]+?)(?=<br>|<\/p>|$)/g, '<strong>$1</strong>');
    
    // Wrap in paragraph tags
    if (!formattedRecommendation.startsWith('<p>')) {
        formattedRecommendation = '<p>' + formattedRecommendation + '</p>';
    }
    
    aiContent.innerHTML = `
        <div class="ai-recommendation">
            <div style="color: var(--text-dark); line-height: 1.8;">
                ${formattedRecommendation}
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.1); font-size: 0.85rem; color: var(--text-light); display: flex; align-items: start; gap: 0.5rem;">
                <i class="bi bi-info-circle" style="font-size: 1.1rem; margin-top: 0.1rem;"></i>
                <em>Rekomendasi ini dihasilkan oleh AI dan hanya sebagai panduan. Selalu konsultasikan dengan dokter atau fisioterapis sebelum mengikuti program rehabilitasi.</em>
            </div>
        </div>
    `;
}
