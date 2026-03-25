// Export Data Module
// CSV and PDF export for monitoring data
// Inspired by Myontec export features

// Export single record to CSV
function exportRecordToCSV(record, patientName) {
    if (!record || !record.recordedData || record.recordedData.length === 0) {
        if (typeof showAlert === 'function') {
            showAlert('Tidak ada data sensor untuk di-export.', 'Peringatan');
        }
        return;
    }

    const headers = ['Timestamp', 'EMG Voltage (V)', 'EMG Raw', 'Accel X (g)', 'Accel Y (g)', 'Accel Z (g)', 'Gyro X (°/s)', 'Gyro Y (°/s)', 'Gyro Z (°/s)'];

    const rows = record.recordedData.map(dp => [
        dp.timestamp || '',
        (dp.emg_voltage || 0).toFixed(4),
        dp.emg_raw || 0,
        (dp.ax || 0).toFixed(4),
        (dp.ay || 0).toFixed(4),
        (dp.az || 0).toFixed(4),
        (dp.gx || 0).toFixed(4),
        (dp.gy || 0).toFixed(4),
        (dp.gz || 0).toFixed(4)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const dateStr = record.dateMonthYear || 'unknown';
    const timeStr = (record.time || 'unknown').replace(/:/g, '-');
    const fileName = `Myosig_${(patientName || 'patient').replace(/\s+/g, '_')}_${dateStr}_${timeStr}.csv`;

    downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
}

// Export all records summary to CSV
function exportAllRecordsToCSV(records, patientName) {
    if (!records || records.length === 0) {
        if (typeof showAlert === 'function') {
            showAlert('Tidak ada record untuk di-export.', 'Peringatan');
        }
        return;
    }

    const headers = ['Tanggal', 'Waktu', 'Durasi (detik)', 'Rata-rata Aktivitas Otot (%)', 'Jumlah Gerakan', 'Akselerasi Maks (g)', 'Jumlah Data Sensor'];

    const rows = records.map(r => {
        const date = r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp);
        const dateStr = date.toLocaleDateString('id-ID');
        return [
            dateStr,
            r.time || '-',
            r.duration || 0,
            r.avgMuscleActivity || 0,
            r.movementCount || 0,
            (r.maxAcceleration || 0).toFixed(2),
            (r.recordedData || []).length
        ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const fileName = `Myosig_${(patientName || 'patient').replace(/\s+/g, '_')}_semua_record.csv`;

    downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
}

// Generate PDF report
function exportToPDF(patientData, records, patientId) {
    if (!patientData) {
        if (typeof showAlert === 'function') {
            showAlert('Data pasien tidak tersedia.', 'Peringatan');
        }
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Calculate summary statistics
    const totalRecords = records ? records.length : 0;
    const avgActivity = totalRecords > 0
        ? Math.round(records.reduce((sum, r) => sum + (r.avgMuscleActivity || 0), 0) / totalRecords)
        : 0;
    const totalDuration = totalRecords > 0
        ? records.reduce((sum, r) => sum + (r.duration || 0), 0)
        : 0;
    const avgMovement = totalRecords > 0
        ? Math.round(records.reduce((sum, r) => sum + (r.movementCount || 0), 0) / totalRecords)
        : 0;

    // Calculate progress (compare first half vs second half)
    let progressText = 'Belum cukup data untuk analisis progress.';
    if (totalRecords >= 4) {
        const half = Math.floor(totalRecords / 2);
        const sortedRecords = [...records].sort((a, b) => {
            const da = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
            const db = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
            return da - db;
        });
        const firstHalfAvg = sortedRecords.slice(0, half).reduce((s, r) => s + (r.avgMuscleActivity || 0), 0) / half;
        const secondHalfAvg = sortedRecords.slice(half).reduce((s, r) => s + (r.avgMuscleActivity || 0), 0) / (totalRecords - half);
        const change = secondHalfAvg - firstHalfAvg;
        if (change > 0) {
            progressText = `Aktivitas otot meningkat ${change.toFixed(1)}% dari periode awal ke periode akhir. Menunjukkan perkembangan positif.`;
        } else if (change < 0) {
            progressText = `Aktivitas otot menurun ${Math.abs(change).toFixed(1)}% dari periode awal ke periode akhir. Perlu evaluasi lebih lanjut.`;
        } else {
            progressText = 'Aktivitas otot stabil antara periode awal dan akhir.';
        }
    }

    // Build HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Rehabilitasi - ${patientData.name || 'Pasien'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #31456A; padding: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #31456A; }
        .header h1 { font-size: 24px; color: #31456A; }
        .header p { color: #5A6B8A; font-size: 14px; margin-top: 5px; }
        .section { margin-bottom: 25px; }
        .section h2 { font-size: 18px; color: #31456A; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #E3EDF7; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .info-item { padding: 8px; background: #f8fafc; border-radius: 8px; }
        .info-label { font-size: 12px; color: #7A8BA8; }
        .info-value { font-weight: 600; color: #31456A; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 15px 0; }
        .stat-box { text-align: center; padding: 15px; background: #f0f4f8; border-radius: 12px; }
        .stat-value { font-size: 24px; font-weight: 700; color: #31456A; }
        .stat-label { font-size: 11px; color: #7A8BA8; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #E3EDF7; }
        th { background: #31456A; color: white; font-weight: 500; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #E3EDF7; text-align: center; font-size: 12px; color: #7A8BA8; }
        .progress-note { padding: 12px; background: #f0f8f4; border-radius: 8px; border-left: 4px solid #4A8B6A; margin-top: 10px; }
        @media print { body { padding: 20px; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Rehabilitasi Stroke</h1>
        <p>Myosig - Smart Wearable Device for Rehabilitation</p>
        <p>Tanggal Cetak: ${dateStr}</p>
    </div>

    <div class="section">
        <h2>Informasi Pasien</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Nama</div>
                <div class="info-value">${patientData.name || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">ID Pasien</div>
                <div class="info-value">${patientId ? patientId.substring(0, 8).toUpperCase() : '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Jenis Kelamin</div>
                <div class="info-value">${patientData.gender || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Tanggal Lahir</div>
                <div class="info-value">${patientData.birthDate || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Tanggal Stroke</div>
                <div class="info-value">${patientData.strokeDate || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${patientData.email || '-'}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Ringkasan Statistik</h2>
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-value">${totalRecords}</div>
                <div class="stat-label">Total Sesi</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${avgActivity}%</div>
                <div class="stat-label">Rata-rata Aktivitas</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${formatDurationForPDF(totalDuration)}</div>
                <div class="stat-label">Total Durasi</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${avgMovement}</div>
                <div class="stat-label">Rata-rata Gerakan</div>
            </div>
        </div>
        <div class="progress-note">
            <strong>Analisis Progress:</strong> ${progressText}
        </div>
    </div>

    <div class="section">
        <h2>Riwayat Sesi Monitoring</h2>
        <table>
            <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Durasi</th>
                    <th>Aktivitas Otot</th>
                    <th>Gerakan</th>
                    <th>Aksel. Maks</th>
                </tr>
            </thead>
            <tbody>
                ${records && records.length > 0 ? records.slice(0, 20).map(r => {
                    const date = r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp);
                    return `<tr>
                        <td>${date.toLocaleDateString('id-ID')}</td>
                        <td>${r.time || '-'}</td>
                        <td>${Math.floor((r.duration || 0) / 60)}:${String((r.duration || 0) % 60).padStart(2, '0')}</td>
                        <td>${r.avgMuscleActivity || 0}%</td>
                        <td>${r.movementCount || 0}</td>
                        <td>${(r.maxAcceleration || 0).toFixed(2)} g</td>
                    </tr>`;
                }).join('') : '<tr><td colspan="6" style="text-align: center;">Belum ada data</td></tr>'}
            </tbody>
        </table>
        ${records && records.length > 20 ? `<p style="font-size: 12px; color: #7A8BA8; margin-top: 5px;">Menampilkan 20 dari ${records.length} sesi.</p>` : ''}
    </div>

    ${patientData.medicalNotes ? `
    <div class="section">
        <h2>Catatan Medis</h2>
        <p style="padding: 10px; background: #f8fafc; border-radius: 8px;">${patientData.medicalNotes}</p>
    </div>
    ` : ''}

    <div class="footer">
        <p>Laporan ini dihasilkan secara otomatis oleh Myosig</p>
        <p>Smart Wearable Device for Rehabilitation Stroke Patient</p>
    </div>

    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 30px; background: #31456A; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
            Cetak / Simpan PDF
        </button>
        <button onclick="window.close()" style="padding: 10px 30px; background: #E3EDF7; color: #31456A; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; margin-left: 10px;">
            Tutup
        </button>
    </div>
</body>
</html>`;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    } else {
        if (typeof showAlert === 'function') {
            showAlert('Pop-up diblokir oleh browser. Izinkan pop-up untuk mencetak laporan.', 'Peringatan');
        }
    }
}

// Helper: format duration for PDF
function formatDurationForPDF(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return hours + 'j ' + minutes + 'm';
    return minutes + 'm';
}

// Helper: download file
function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (typeof showAlert === 'function') {
        showAlert('File berhasil di-download: ' + fileName, 'Berhasil');
    }
}
