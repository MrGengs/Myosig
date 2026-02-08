# Update Struktur Data - Pemisahan Dokter dan Pasien

## Perubahan Struktur

### Sebelumnya
- Collection `users` digunakan untuk menyimpan data dokter DAN pasien
- Semua dokter bisa melihat semua users (termasuk dokter lain)

### Sekarang
- Collection `users` = Hanya untuk data dokter (akun yang login)
- Collection `patients` = Hanya untuk data pasien (bukan akun, hanya data)
- Dokter hanya bisa melihat dan mengelola pasien mereka sendiri

## Struktur Data

### Collection `users` (Dokter)
```javascript
{
  uid: string,              // Firebase Auth UID
  name: string,             // Nama dokter
  email: string,            // Email dokter
  phone: string,            // Nomor telepon (opsional)
  createdAt: Timestamp,     // Waktu pembuatan
  updatedAt: Timestamp     // Waktu update terakhir
}
```

**Rules:**
- Dokter hanya bisa membaca/mengupdate dokumen mereka sendiri
- Dokter tidak bisa melihat data dokter lain

### Collection `patients` (Pasien)
```javascript
{
  doctorId: string,         // ID dokter yang memiliki pasien ini (REQUIRED)
  name: string,             // Nama pasien
  email: string,            // Email pasien
  phone: string,            // Nomor telepon
  birthDate: string,        // Tanggal lahir
  gender: string,           // Jenis kelamin
  address: string,          // Alamat
  strokeDate: string,       // Tanggal stroke
  medicalNotes: string,     // Catatan medis
  createdAt: Timestamp,     // Waktu pembuatan
  updatedAt: Timestamp      // Waktu update terakhir
}
```

**Rules:**
- Dokter hanya bisa membaca/mengelola pasien dengan `doctorId` = `auth.uid`
- Dokter tidak bisa melihat pasien milik dokter lain

### Collection `monitoringRecords`
```javascript
{
  patientId: string,        // ID pasien
  doctorId: string,         // ID dokter (REQUIRED, harus sama dengan auth.uid)
  device: string,           // Device yang digunakan
  time: string,             // Waktu (HH:MM:SS)
  dateMonthYear: string,    // Tanggal (DD-MM-YYYY)
  timestamp: Timestamp,     // Timestamp Firestore
  duration: number,         // Durasi (detik)
  avgMuscleActivity: number, // Rata-rata aktivitas otot (%)
  movementCount: number,    // Jumlah gerakan
  maxAcceleration: number,  // Akselerasi maksimum
  recordedData: array,      // Array data sensor
  createdAt: Timestamp     // Waktu pembuatan
}
```

**Rules:**
- Dokter hanya bisa membaca/mengelola records dengan `doctorId` = `auth.uid`

## Perubahan Kode

### File yang Diupdate:

1. **firestore.rules**
   - Users: Dokter hanya bisa akses dokumen mereka sendiri
   - Patients: Collection baru dengan filter `doctorId`
   - MonitoringRecords: Filter berdasarkan `doctorId`

2. **js/patient.js**
   - Menggunakan collection `patients` bukan `users`
   - Filter dengan `where('doctorId', '==', currentUser.uid)`
   - Set `doctorId` saat create/update pasien

3. **js/sensors.js**
   - `loadPatientsList()` menggunakan collection `patients`
   - Filter dengan `where('doctorId', '==', currentUser.uid)`

4. **js/dashboard.js**
   - `loadDashboardData()` menggunakan collection `patients`
   - `loadRecentRecords()` filter dengan `doctorId`
   - `loadPatientSummary()` filter dengan `doctorId`

5. **js/patient-detail.js**
   - `loadPatientData()` menggunakan collection `patients`
   - Verifikasi `doctorId` sebelum menampilkan data
   - `loadPatientRecords()` filter dengan `doctorId`

## Migration (Jika Ada Data Lama)

Jika Anda sudah punya data di collection `users` yang berisi pasien:

1. **Backup data** terlebih dahulu
2. **Identifikasi** dokumen yang merupakan pasien (bukan dokter)
3. **Pindahkan** ke collection `patients` dengan menambahkan field `doctorId`
4. **Hapus** dokumen pasien dari collection `users`

Contoh script migration (jalankan di Firebase Console atau Cloud Functions):
```javascript
// WARNING: Hanya jalankan jika Anda yakin!
// Ganti 'DOCTOR_UID' dengan UID dokter yang memiliki pasien tersebut

const usersRef = firestore.collection('users');
const patientsRef = firestore.collection('patients');

usersRef.get().then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    // Jika dokumen ini adalah pasien (bukan dokter yang login)
    // Pindahkan ke collection patients
    if (data.isPatient || !data.uid) { // Sesuaikan kondisi dengan struktur data Anda
      patientsRef.add({
        ...data,
        doctorId: 'DOCTOR_UID', // Set doctorId
        createdAt: data.createdAt || firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        // Hapus dari users setelah berhasil dipindahkan
        doc.ref.delete();
      });
    }
  });
});
```

## Testing

Setelah update, test:
1. ✅ Login dengan akun dokter A
2. ✅ Tambah pasien baru (harus tersimpan dengan `doctorId` = dokter A)
3. ✅ Login dengan akun dokter B
4. ✅ Pastikan dokter B TIDAK bisa melihat pasien milik dokter A
5. ✅ Dokter B tambah pasien sendiri
6. ✅ Pastikan dokter B hanya melihat pasien mereka sendiri
7. ✅ Test monitoring recording (harus tersimpan dengan `doctorId` yang benar)

## Catatan Penting

- **Field `doctorId` WAJIB** ada di setiap dokumen `patients` dan `monitoringRecords`
- Dokter tidak bisa melihat atau mengakses data dokter lain
- Pasien bukan akun (tidak punya Firebase Auth), hanya dokumen di Firestore
- Semua query harus filter dengan `doctorId` untuk keamanan dan efisiensi
