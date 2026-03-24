// Script untuk INSERT data record dari injection_data.txt ke Firestore
// Menggunakan Firebase Admin SDK
// 
// Script ini MENAMBAHKAN record baru ke Firestore untuk setiap pasien
//
// Cara menggunakan:
// 1. Pastikan serviceAccountKey.json sudah ada
// 2. Pastikan injection_data.txt ada di root project
// 3. Jalankan: node import-from-txt.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ============================================================================
// CONFIGURATION - AKUN MYOSIG
// ============================================================================
const USER_ID = 'Gv6rYmDBEjMXxMY8wGhA3SUhmxT2'; // MyoSig account - FIXED
const USER_EMAIL = 'myosig.team@gmail.com'; // MyoSig email - FIXED
// ============================================================================

// Batch write limit di Firestore adalah 500 operasi per batch
const BATCH_SIZE = 500;

/**
 * Map aktivitas otot dari teks ke persentase dengan variasi random
 * Mapping berdasarkan tingkat aktivitas otot dengan range:
 * - Tidak Bergerak: 0-5% (tidak ada aktivitas)
 * - Rendah: 20-35% (aktivitas minimal)
 * - Sedang: 40-60% (aktivitas normal)
 * - Tinggi: 65-85% (aktivitas tinggi/intensif)
 * 
 * Setiap kategori akan menghasilkan nilai random dalam range untuk variasi yang lebih real
 */
function mapMuscleActivity(text) {
    const normalizedText = text.trim().toLowerCase();
    
    // Mapping dengan range untuk setiap kategori (bilangan bulat)
    if (normalizedText === 'tidak bergerak' || normalizedText.includes('tidak')) {
        // Tidak Bergerak: 0-5% dengan variasi
        return Math.round(Math.random() * 5); // 0 - 5
    } else if (normalizedText === 'rendah') {
        // Rendah: 20-35% dengan variasi
        return Math.round(20 + Math.random() * 15); // 20 - 35
    } else if (normalizedText === 'sedang') {
        // Sedang: 40-60% dengan variasi (contoh: 47, 53, 50, dll)
        return Math.round(40 + Math.random() * 20); // 40 - 60
    } else if (normalizedText === 'tinggi') {
        // Tinggi: 65-85% dengan variasi
        return Math.round(65 + Math.random() * 20); // 65 - 85
    }
    
    // Default: Sedang dengan variasi (40-60%)
    console.warn(`⚠️  Aktivitas otot "${text}" tidak dikenali, menggunakan default: Sedang (40-60%)`);
    return Math.round(40 + Math.random() * 20);
}

/**
 * Parse file injection_data.txt
 */
function parseInjectionData(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Handle Windows line endings (\r\n) and normalize
    const lines = content.split(/\r?\n/);
    
    const patients = [];
    let currentPatient = null;
    let currentRecord = null;
    
    for (let i = 0; i < lines.length; i++) {
        const originalLine = lines[i];
        const trimmedLine = originalLine.trim();
        
        // Skip empty lines
        if (!trimmedLine) {
            // Jika ada currentRecord yang sudah lengkap, save sebelum empty line
            if (currentRecord && currentPatient && currentRecord.date && currentRecord.time && currentRecord.duration !== null) {
                currentPatient.records.push(currentRecord);
                currentRecord = null;
            }
            continue;
        }
        
        // Check if line is patient name (starts with number and dot, NO tab/indent)
        // Format: "1. Dyah Kusumawati" (no leading tab or spaces)
        const patientMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
        if (patientMatch && !originalLine.match(/^[\t ]/)) {
            // Save previous patient if exists
            if (currentPatient) {
                // Save last record if exists and complete
                if (currentRecord && currentRecord.date && currentRecord.time && currentRecord.duration !== null) {
                    currentPatient.records.push(currentRecord);
                }
                patients.push(currentPatient);
            }
            
            // Start new patient
            currentPatient = {
                name: patientMatch[1].trim(),
                records: []
            };
            currentRecord = null; // Reset current record
            continue;
        }
        
        // Check if line is record number (starts with tab + number)
        // Format: "\t1. Tanggal: 04/02/2026" (has leading tab)
        const recordMatch = originalLine.match(/^\t(\d+)\.\s+Tanggal:\s*(.+)$/);
        if (recordMatch) {
            // Save previous record if exists and complete
            if (currentRecord && currentPatient) {
                // Check if record is complete (has all required fields)
                if (currentRecord.date && currentRecord.time && currentRecord.duration !== null) {
                    currentPatient.records.push(currentRecord);
                }
            }
            
            // Start new record
            currentRecord = {
                date: recordMatch[2].trim(),
                time: null,
                avgMuscleActivity: null,
                movementCount: null,
                maxAcceleration: null,
                duration: null
            };
            continue;
        }
        
        // Parse record fields (lines with tab + spaces, but not record number)
        // Format: "\t   Waktu: 16:28" (tab + 3 spaces + field)
        if (currentRecord && currentPatient && originalLine.startsWith('\t')) {
            const cleanLine = trimmedLine;
            
            if (cleanLine.includes('Waktu:')) {
                const match = cleanLine.match(/Waktu:\s+(.+)$/);
                if (match) {
                    currentRecord.time = match[1].trim();
                }
            } else if (cleanLine.includes('Rata-rata Aktivitas Otot')) {
                const match = cleanLine.match(/Rata-rata Aktivitas Otot.*?:\s+(.+)$/);
                if (match) {
                    currentRecord.avgMuscleActivity = match[1].trim();
                }
            } else if (cleanLine.includes('Jumlah Gerakan:')) {
                const match = cleanLine.match(/Jumlah Gerakan:\s+(\d+)/);
                if (match) {
                    currentRecord.movementCount = parseInt(match[1]);
                }
            } else if (cleanLine.includes('Akselerasi Maksimum')) {
                const match = cleanLine.match(/Akselerasi Maksimum.*?:\s+([\d.]+)/);
                if (match) {
                    currentRecord.maxAcceleration = parseFloat(match[1]);
                }
            } else if (cleanLine.includes('Durasi')) {
                const match = cleanLine.match(/Durasi.*?:\s+(\d+)/);
                if (match) {
                    currentRecord.duration = parseInt(match[1]);
                    // Record is complete, save it immediately
                    if (currentRecord.date && currentRecord.time) {
                        currentPatient.records.push(currentRecord);
                        currentRecord = null; // Reset untuk record berikutnya
                    }
                }
            }
        }
    }
    
    // Save last record and patient
    if (currentRecord && currentPatient && currentRecord.date && currentRecord.time && currentRecord.duration !== null) {
        currentPatient.records.push(currentRecord);
    }
    if (currentPatient) {
        patients.push(currentPatient);
    }
    
    return patients;
}

/**
 * Get patient ID from Firestore by name
 */
async function getPatientIdByName(userId, patientName) {
    try {
        const patientsSnapshot = await db.collection('users')
            .doc(userId)
            .collection('patients')
            .get();
        
        for (const doc of patientsSnapshot.docs) {
            const data = doc.data();
            if (data.name && data.name.trim() === patientName.trim()) {
                return doc.id;
            }
        }
        
        return null;
    } catch (error) {
        console.error(`Error mencari pasien "${patientName}":`, error);
        return null;
    }
}

/**
 * Convert parsed record to Firestore format
 */
function convertToFirestoreRecord(record) {
    // Parse date (format: DD/MM/YYYY)
    const [day, month, year] = record.date.split('/');
    const recordDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    // Parse time (format: HH:MM)
    const [hours, minutes] = record.time.split(':');
    recordDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Format time (HH:MM:SS)
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    
    // Format dateMonthYear (DD-MM-YYYY)
    const dateMonthYear = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    
    // Convert muscle activity text to number dengan variasi random (bilangan bulat)
    const avgMuscleActivity = mapMuscleActivity(record.avgMuscleActivity);
    
    // Generate recordedData untuk record baru
    const recordedData = [];
    const numDataPoints = Math.floor(record.duration / 2); // One point every 2 seconds
    for (let j = 0; j < numDataPoints; j++) {
        recordedData.push({
            ax: (Math.random() - 0.5).toFixed(3),
            ay: (Math.random() - 0.5).toFixed(3),
            az: (1 + (Math.random() - 0.5) * 0.5).toFixed(3),
            gx: ((Math.random() - 0.5) * 0.5).toFixed(3),
            gy: ((Math.random() - 0.5) * 0.5).toFixed(3),
            gz: ((Math.random() - 0.5) * 0.5).toFixed(3),
            emg_voltage: ((avgMuscleActivity / 100) * 3.3 + (Math.random() - 0.5) * 0.5).toFixed(3),
            emg_raw: Math.floor((avgMuscleActivity / 100) * 3300),
            timestamp: admin.firestore.Timestamp.fromDate(new Date(recordDate.getTime() + j * 2000))
        });
    }
    
    // Return semua data yang diperlukan untuk record baru
    return {
        time: time,
        dateMonthYear: dateMonthYear,
        timestamp: admin.firestore.Timestamp.fromDate(recordDate),
        duration: record.duration,
        avgMuscleActivity: avgMuscleActivity, // Bilangan bulat
        movementCount: record.movementCount,
        maxAcceleration: Math.round(record.maxAcceleration * 100) / 100,
        recordedData: recordedData
    };
}

/**
 * Batch insert records ke Firestore
 * Fungsi ini MENAMBAHKAN record baru ke setiap pasien
 * Setiap record akan memiliki ID unik yang auto-generated oleh Firestore
 */
async function batchInsertRecords(userId, patientId, records) {
    try {
        const batches = [];
        let currentBatch = db.batch();
        let operationCount = 0;
        
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            
            // Auto-generate ID untuk setiap record baru
            // Menggunakan .doc() TANPA parameter = selalu membuat document BARU dengan ID unik
            const recordRef = db.collection('users')
                .doc(userId)
                .collection('patients')
                .doc(patientId)
                .collection('monitoringRecords')
                .doc(); // Auto-generate ID = SELALU membuat record BARU
            
            // Set data untuk record baru
            currentBatch.set(recordRef, {
                ...record,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            
            operationCount++;
            
            // Jika mencapai batas batch atau record terakhir
            if (operationCount === BATCH_SIZE || i === records.length - 1) {
                batches.push(currentBatch);
                currentBatch = db.batch();
                operationCount = 0;
            }
        }
        
        // Execute semua batches
        for (let i = 0; i < batches.length; i++) {
            await batches[i].commit();
        }
        
        return { 
            success: true, 
            count: records.length 
        };
        
    } catch (error) {
        console.error('❌ Error batch insert:', error);
        throw error;
    }
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('  MyoSig - Insert Data Record dari injection_data.txt');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`\nUser: ${USER_EMAIL}`);
        console.log(`User ID: ${USER_ID}\n`);
        
        // Path ke file injection_data.txt (di root project)
        const filePath = path.join(__dirname, '..', 'injection_data.txt');
        
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File tidak ditemukan: ${filePath}`);
            console.error('   Pastikan file injection_data.txt ada di root project!');
            process.exit(1);
        }
        
        console.log(`📄 Membaca file: ${filePath}...\n`);
        
        // Parse file
        const patients = parseInjectionData(filePath);
        
        // Debug: Show parsing results
        console.log(`✅ Ditemukan ${patients.length} pasien dengan total ${patients.reduce((sum, p) => sum + p.records.length, 0)} records\n`);
        
        // Debug: Show details for each patient
        if (patients.length > 0) {
            console.log('📊 Detail Parsing:');
            patients.forEach((patient, idx) => {
                console.log(`   ${idx + 1}. ${patient.name}: ${patient.records.length} records`);
                if (patient.records.length > 0) {
                    const firstRecord = patient.records[0];
                    console.log(`      Contoh record pertama: ${firstRecord.date} ${firstRecord.time || 'N/A'}`);
                }
            });
            console.log('');
        }
        
        // Process each patient
        let totalInserted = 0;
        let totalFailed = 0;
        
        for (const patient of patients) {
            console.log(`\n📋 Memproses pasien: ${patient.name}`);
            console.log(`   Records: ${patient.records.length}`);
            
            // Get patient ID from Firestore
            const patientId = await getPatientIdByName(USER_ID, patient.name);
            
            if (!patientId) {
                console.log(`   ⚠️  Pasien "${patient.name}" tidak ditemukan di Firestore!`);
                console.log(`   ⏭️  Melewati ${patient.records.length} records untuk pasien ini...`);
                totalFailed += patient.records.length;
                continue;
            }
            
            console.log(`   ✓ Patient ID: ${patientId}`);
            
             // Convert records to Firestore format
             const firestoreRecords = patient.records.map(record => convertToFirestoreRecord(record));
             
             // Insert records (menambahkan record baru)
             try {
                 console.log(`   📝 Menambahkan ${firestoreRecords.length} records BARU ke Firestore...`);
                 await batchInsertRecords(USER_ID, patientId, firestoreRecords);
                 console.log(`   ✅ Berhasil insert ${firestoreRecords.length} records!`);
                 totalInserted += firestoreRecords.length;
             } catch (error) {
                 console.error(`   ❌ Error insert records untuk ${patient.name}:`, error.message);
                 totalFailed += patient.records.length;
             }
        }
        
         console.log('\n═══════════════════════════════════════════════════════════════');
         console.log('  SUMMARY');
         console.log('═══════════════════════════════════════════════════════════════');
         console.log(`✅ Total berhasil diinsert: ${totalInserted} records`);
         console.log(`❌ Total gagal: ${totalFailed} records`);
         console.log('═══════════════════════════════════════════════════════════════\n');
        
        console.log('✨ Selesai!');
        
        // Close connection
        await admin.app().delete();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        await admin.app().delete();
        process.exit(1);
    }
}

// Jalankan script
if (require.main === module) {
    main();
}

// Export functions
module.exports = {
    parseInjectionData,
    getPatientIdByName,
    convertToFirestoreRecord,
    batchInsertRecords
};
