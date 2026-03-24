# Analisis Struktur Data Firestore

Dokumen ini menjelaskan struktur data Firestore berdasarkan `firestore.rules` dan implementasi di codebase.

## 📊 Struktur Hierarki Data

```
Firestore Database
└── users/{userId}                          # Collection: Dokter/User accounts
    ├── [user document fields]              # Data user (name, email, phone, dll)
    │
    └── patients/{patientId}                 # Subcollection: Pasien milik dokter ini
        ├── [patient document fields]        # Data pasien (name, email, dll)
        │
        └── monitoringRecords/{recordId}    # Subcollection: Record monitoring pasien
            └── [record document fields]     # Data record (time, dateMonthYear, dll)
```

## 🔐 Security Rules

### Helper Functions

```javascript
// Cek apakah user sudah login
function isAuthenticated() {
  return request.auth != null;
}

// Cek apakah user adalah admin
function isAdmin() {
  return isAuthenticated() && request.auth.token.email == 'admin@myosig.com';
}
```

### Access Control Summary

| Collection/Subcollection | User Biasa | Admin |
|-------------------------|------------|-------|
| `users/{userId}` | Read/Update sendiri | Read/Update semua |
| `users/{userId}/patients/{patientId}` | Read/Write sendiri | Read/Write semua |
| `users/{userId}/patients/{patientId}/monitoringRecords/{recordId}` | Read/Write sendiri | Read/Write semua |
| `medicalRecords/{recordId}` | Read/Write jika doctorId match | Read/Write semua |
| `exercises/{exerciseId}` | Read/Write | Read/Write |
| `healthRecords/{recordId}` | Read/Write | Read/Write |

---

## 📁 Detail Struktur Data

### 1. Users Collection
**Path:** `users/{userId}`

**Document Fields:**
```javascript
{
  name: string,              // Nama dokter/user
  email: string,             // Email dokter
  phone: string,             // Nomor telepon (optional)
  photoURL: string,          // URL foto profil (optional)
  birthDate: string,         // Tanggal lahir (optional)
  gender: string,            // Jenis kelamin (optional)
  address: string,           // Alamat (optional)
  createdAt: Timestamp       // Waktu pembuatan akun
}
```

**Access Rules:**
- ✅ User bisa read/update document sendiri
- ✅ Admin bisa read/update semua user documents
- ❌ User tidak bisa read/update user lain

**Contoh:**
```
users/
  └── Gv6rYmDBEjMXxMY8wGhA3SUhmxT2/
      ├── name: "MyoSig Team"
      ├── email: "myosig.team@gmail.com"
      └── ...
```

---

### 2. Patients Subcollection
**Path:** `users/{userId}/patients/{patientId}`

**Document Fields:**
```javascript
{
  name: string,              // Nama pasien
  email: string,             // Email pasien (optional)
  phone: string,             // Nomor telepon (optional)
  birthDate: string,         // Tanggal lahir (optional)
  gender: string,            // Jenis kelamin (optional)
  address: string,           // Alamat (optional)
  strokeDate: string,        // Tanggal stroke (optional)
  medicalNotes: string,      // Catatan medis (optional)
  createdAt: Timestamp       // Waktu pembuatan data pasien
}
```

**Access Rules:**
- ✅ Dokter bisa read/write pasien miliknya
- ✅ Admin bisa read/write semua pasien dari semua dokter
- ❌ Dokter tidak bisa akses pasien milik dokter lain

**Contoh:**
```
users/
  └── Gv6rYmDBEjMXxMY8wGhA3SUhmxT2/
      └── patients/
          ├── x9b3wbcWAyHiPhyUJArr/        # Dyah Kusumawati
          │   ├── name: "Dyah Kusumawati"
          │   ├── email: "..."
          │   └── ...
          ├── abc123def456/                # Rahmat Priyanto V
          │   ├── name: "Rahmat Priyanto V"
          │   └── ...
          └── ...
```

---

### 3. Monitoring Records Subcollection
**Path:** `users/{userId}/patients/{patientId}/monitoringRecords/{recordId}`

**Document Fields:**
```javascript
{
  time: string,                    // Format: "HH:MM:SS" (contoh: "16:28:00")
  dateMonthYear: string,           // Format: "DD-MM-YYYY" (contoh: "04-02-2026")
  timestamp: Timestamp,           // Firestore Timestamp untuk sorting
  duration: number,                // Durasi dalam detik (contoh: 60)
  avgMuscleActivity: number,       // Rata-rata aktivitas otot dalam % (contoh: 50.0)
  movementCount: number,           // Jumlah gerakan (contoh: 10)
  maxAcceleration: number,         // Akselerasi maksimum dalam g (contoh: 0.01)
  recordedData: Array<Object>,     // Array data sensor (IMU + EMG)
  createdAt: Timestamp             // Waktu pembuatan record
}
```

**recordedData Structure:**
```javascript
[
  {
    ax: string,              // Accelerometer X (contoh: "0.123")
    ay: string,              // Accelerometer Y (contoh: "-0.456")
    az: string,              // Accelerometer Z (contoh: "1.012")
    gx: string,              // Gyroscope X (contoh: "0.045")
    gy: string,              // Gyroscope Y (contoh: "-0.023")
    gz: string,              // Gyroscope Z (contoh: "0.012")
    emg_voltage: string,     // EMG voltage dalam volt (contoh: "1.234")
    emg_raw: number,         // EMG raw value (contoh: 1234)
    timestamp: Timestamp     // Timestamp untuk data point ini
  },
  // ... lebih banyak data points
]
```

**Access Rules:**
- ✅ Dokter bisa read/write records pasien miliknya
- ✅ Admin bisa read/write semua records dari semua pasien
- ❌ Dokter tidak bisa akses records pasien milik dokter lain

**Contoh:**
```
users/
  └── Gv6rYmDBEjMXxMY8wGhA3SUhmxT2/
      └── patients/
          └── x9b3wbcWAyHiPhyUJArr/        # Dyah Kusumawati
              └── monitoringRecords/
                  ├── record1/
                  │   ├── time: "16:28:00"
                  │   ├── dateMonthYear: "04-02-2026"
                  │   ├── avgMuscleActivity: 50.0
                  │   ├── movementCount: 10
                  │   └── ...
                  ├── record2/
                  │   └── ...
                  └── ...
```

---

### 4. Medical Records Collection (Legacy)
**Path:** `medicalRecords/{recordId}`

**Document Fields:**
```javascript
{
  doctorId: string,          // ID dokter yang membuat record
  patientId: string,         // ID pasien
  notes: string,             // Catatan medis
  createdAt: Timestamp       // Waktu pembuatan
}
```

**Access Rules:**
- ✅ Dokter bisa read/write jika `doctorId` match dengan `request.auth.uid`
- ⚠️ Collection ini mungkin tidak digunakan lagi (legacy)

---

### 5. Exercises Collection (Legacy)
**Path:** `exercises/{exerciseId}`

**Access Rules:**
- ✅ Semua user authenticated bisa read/write
- ⚠️ Collection ini untuk backward compatibility

---

### 6. Health Records Collection (Legacy)
**Path:** `healthRecords/{recordId}`

**Access Rules:**
- ✅ Semua user authenticated bisa read/write
- ⚠️ Collection ini untuk backward compatibility

---

## 🔑 Key Points

### 1. Nested Structure
- Data menggunakan **nested subcollections** untuk isolasi data per dokter
- Setiap dokter hanya bisa akses pasien dan records miliknya
- Admin bisa akses semua data

### 2. Path Pattern
```
users/{userId}/patients/{patientId}/monitoringRecords/{recordId}
```

### 3. Admin Access
- Admin (`admin@myosig.com`) memiliki akses penuh ke semua data
- Admin bisa read/write semua users, patients, dan records
- Berguna untuk:
  - Generate dummy data
  - Manage data (CRUD)
  - Import data dari file

### 4. Data Isolation
- Setiap dokter memiliki data terpisah
- Tidak ada data sharing antar dokter (kecuali admin)
- Struktur ini memastikan privacy dan security

---

## 📝 Format Data yang Digunakan

### Date Format
- **dateMonthYear**: `"DD-MM-YYYY"` (contoh: `"04-02-2026"`)
- **timestamp**: Firestore Timestamp untuk sorting dan query

### Time Format
- **time**: `"HH:MM:SS"` (contoh: `"16:28:00"`)

### Number Formats
- **avgMuscleActivity**: Number dengan 1 decimal (contoh: `50.0`)
- **maxAcceleration**: Number dengan 2 decimals (contoh: `0.01`)
- **movementCount**: Integer (contoh: `10`)
- **duration**: Integer dalam detik (contoh: `60`)

---

## 🚀 Cara Mengakses Data

### Untuk Dokter Biasa:
```javascript
// Get own patients
firestore.collection('users')
  .doc(currentUser.uid)
  .collection('patients')
  .get();

// Get patient records
firestore.collection('users')
  .doc(currentUser.uid)
  .collection('patients')
  .doc(patientId)
  .collection('monitoringRecords')
  .get();
```

### Untuk Admin:
```javascript
// Get all users
firestore.collection('users').get();

// Get all patients from all users
const usersSnapshot = await firestore.collection('users').get();
for (const userDoc of usersSnapshot.docs) {
  const patientsSnapshot = await firestore.collection('users')
    .doc(userDoc.id)
    .collection('patients')
    .get();
}

// Get all records from specific patient
firestore.collection('users')
  .doc(userId)
  .collection('patients')
  .doc(patientId)
  .collection('monitoringRecords')
  .get();
```

---

## ✅ Kesimpulan

Struktur Firestore sudah:
- ✅ Terorganisir dengan nested subcollections
- ✅ Memiliki security rules yang tepat
- ✅ Mendukung admin access untuk management
- ✅ Mengisolasi data per dokter untuk privacy
- ✅ Menggunakan format data yang konsisten

Script import (`import-from-txt.js`) sudah sesuai dengan struktur ini dan akan menambahkan records ke path yang benar:
```
users/Gv6rYmDBEjMXxMY8wGhA3SUhmxT2/patients/{patientId}/monitoringRecords/{recordId}
```
