# Quick Start - Menambahkan Record ke Pasien MyoSig

Script ini sudah dikonfigurasi untuk akun **MyoSig** (`myosig.team@gmail.com`).

## 🚀 Cara Cepat Menggunakan

### 1. Install Dependencies (jika belum)
```bash
cd scripts
npm install
```

### 2. Pastikan Service Account Key Ada
- File `serviceAccountKey.json` harus ada di folder `scripts/`
- Jika belum ada, download dari Firebase Console:
  1. Buka Firebase Console → Project Settings → Service Accounts
  2. Klik "Generate new private key"
  3. Rename file menjadi `serviceAccountKey.json`
  4. Simpan di folder `scripts/`

### 3. Jalankan Script
```bash
npm run add-records
```

atau

```bash
node add-records-to-patient.js
```

### 4. Ikuti Instruksi di Terminal
1. Script akan menampilkan daftar pasien
2. Pilih nomor pasien yang ingin ditambahkan record
3. Masukkan jumlah record yang ingin ditambahkan (default: 50)
4. Masukkan periode dalam hari (default: 30 hari ke belakang)

## 📋 Contoh Penggunaan

```
═══════════════════════════════════════════════════════════════
  MyoSig - Batch Insert Records ke Pasien
═══════════════════════════════════════════════════════════════

User: myosig.team@gmail.com
User ID: Gv6rYmDBEjMXxMY8wGhA3SUhmxT2

📋 Mengambil daftar pasien untuk user: Gv6rYmDBEjMXxMY8wGhA3SUhmxT2...

Daftar Pasien:
────────────────────────────────────────────────────────────────
1. Nama Pasien 1
   ID: abc123...
   Email: patient1@example.com

2. Nama Pasien 2
   ID: def456...
   Email: patient2@example.com
────────────────────────────────────────────────────────────────

Pilih nomor pasien (1-2): 1

✓ Pasien terpilih: Nama Pasien 1
  ID: abc123...

Berapa banyak record yang ingin ditambahkan? (default: 50): 100
Berapa hari ke belakang? (default: 30): 30

📝 Generating 100 records untuk 30 hari terakhir...
✅ Generated 100 records

🚀 Memulai batch insert 100 records...
📦 Menjalankan 1 batch(es)...
   ✓ Batch 1/1 selesai

✅ Berhasil menambahkan 100 records!

✨ Selesai!
```

## ⚙️ Konfigurasi

Script sudah dikonfigurasi untuk:
- **User ID**: `Gv6rYmDBEjMXxMY8wGhA3SUhmxT2`
- **Email**: `myosig.team@gmail.com`

Jika ingin mengubah user, edit file `add-records-to-patient.js`:
```javascript
const USER_ID = 'Gv6rYmDBEjMXxMY8wGhA3SUhmxT2';
const USER_EMAIL = 'myosig.team@gmail.com';
```

## 📝 Format Data

Data yang ditambahkan mengikuti format yang sama dengan data dari sensor:
- **time**: HH:MM:SS
- **dateMonthYear**: DD-MM-YYYY
- **timestamp**: Firestore Timestamp
- **duration**: dalam detik
- **avgMuscleActivity**: persentase (30-70%)
- **movementCount**: jumlah gerakan (50-150)
- **maxAcceleration**: dalam g (1.5-3.0g)
- **recordedData**: array data sensor

## 🔧 Troubleshooting

### Error: "Cannot find module './serviceAccountKey.json'"
- Pastikan file `serviceAccountKey.json` ada di folder `scripts/`
- Download dari Firebase Console jika belum ada

### Error: "Permission denied"
- Pastikan service account memiliki akses ke Firestore
- Pastikan Firestore Rules mengizinkan admin access

### Tidak ada pasien muncul
- Pastikan user ID benar
- Pastikan ada pasien di Firestore untuk user tersebut

---

## 📥 Import Data dari File injection_data.txt

Jika Anda memiliki file `injection_data.txt` dengan data record pasien, gunakan script import:

### Cara Menggunakan Import Script

1. **Pastikan file `injection_data.txt` ada di root project**
   ```
   Myosig_v2/
   ├── injection_data.txt  ← File ini harus ada di sini
   ├── scripts/
   │   └── ...
   └── ...
   ```

2. **Jalankan script import:**
   ```bash
   npm run import-txt
   ```
   
   atau
   
   ```bash
   node import-from-txt.js
   ```

3. **Script akan:**
   - Membaca file `injection_data.txt`
   - Mencari pasien di Firestore berdasarkan nama
   - Convert data ke format Firestore
   - Insert semua records ke Firestore

### Format File injection_data.txt

File harus memiliki format:
```
1. Nama Pasien
   1. Tanggal: DD/MM/YYYY
      Waktu: HH:MM
      Rata-rata Aktivitas Otot (%): Sedang/Rendah/Tinggi/Tidak Bergerak
      Jumlah Gerakan: angka
      Akselerasi Maksimum (g): angka
      Durasi (detik): angka
   2. Tanggal: ...
      ...
```

### Mapping Aktivitas Otot

Script akan mengkonversi teks aktivitas otot menjadi persentase:

- **Tidak Bergerak** → 2% (hampir tidak ada aktivitas)
- **Rendah** → 28% (aktivitas rendah/minimal)
- **Sedang** → 50% (aktivitas sedang/normal)
- **Tinggi** → 75% (aktivitas tinggi/intensif)

**Catatan:** Jika ada nilai aktivitas otot yang tidak dikenali, script akan menggunakan default 50% (Sedang).

### Contoh Output

```
═══════════════════════════════════════════════════════════════
  MyoSig - Import Data dari injection_data.txt
═══════════════════════════════════════════════════════════════

User: myosig.team@gmail.com
User ID: Gv6rYmDBEjMXxMY8wGhA3SUhmxT2

📄 Membaca file: .../injection_data.txt...

✅ Ditemukan 8 pasien dengan total 58 records

📋 Memproses pasien: Dyah Kusumawati
   Records: 9
   ✓ Patient ID: abc123...
   ✅ Berhasil insert 9 records!

📋 Memproses pasien: Rahmat Priyanto V
   Records: 3
   ✓ Patient ID: def456...
   ✅ Berhasil insert 3 records!

...

═══════════════════════════════════════════════════════════════
  SUMMARY
═══════════════════════════════════════════════════════════════
✅ Total berhasil: 58 records
❌ Total gagal: 0 records
═══════════════════════════════════════════════════════════════

✨ Selesai!
```

### Troubleshooting Import

**Error: "Pasien tidak ditemukan di Firestore"**
- Pastikan nama pasien di file sama persis dengan nama di Firestore
- Cek spasi dan karakter khusus
- Script akan melewati pasien yang tidak ditemukan dan melanjutkan ke pasien berikutnya

---

## 🔄 Update Data Record dari File injection_data.txt

Jika Anda ingin **mengupdate** field `avgMuscleActivity` pada record yang sudah ada di Firestore berdasarkan file `injection_data.txt`, gunakan script update:

### Cara Menggunakan Update Script

1. **Pastikan file `injection_data.txt` ada di root project**
   ```
   Myosig_v2/
   ├── injection_data.txt  ← File ini harus ada di sini
   ├── scripts/
   │   └── ...
   └── ...
   ```

2. **Jalankan script update:**
   ```bash
   npm run update-txt
   ```
   
   atau
   
   ```bash
   node update-from-txt.js
   ```

3. **Script akan:**
   - Membaca file `injection_data.txt`
   - Mencari pasien di Firestore berdasarkan nama
   - Mencari record yang sudah ada berdasarkan tanggal (`dateMonthYear`) dan waktu (`time`)
   - **Mengupdate** field `avgMuscleActivity` pada record yang ditemukan dengan nilai random dalam range
   - Melewati record yang tidak ditemukan

### Perbedaan Import vs Update

| Fitur | `import-from-txt.js` (INSERT) | `update-from-txt.js` (UPDATE) |
|-------|-------------------------------|-------------------------------|
| **Aksi** | Menambahkan record **BARU** | Mengupdate record yang **SUDAH ADA** |
| **ID Record** | Auto-generate ID baru | Menggunakan ID record yang sudah ada |
| **Field yang diubah** | Semua field (lengkap) | Hanya `avgMuscleActivity` |
| **Record tidak ditemukan** | Tidak masalah (tetap insert baru) | Dilewati (warning) |
| **Kapan digunakan** | Data baru belum ada di Firestore | Data sudah ada, hanya ingin update aktivitas otot |

### Mapping Aktivitas Otot (Update Script)

Script update akan mengkonversi teks aktivitas otot menjadi persentase **bilangan bulat** dengan variasi random:

- **Tidak Bergerak** → 0-5% (random, contoh: 2, 4, 5)
- **Rendah** → 20-35% (random, contoh: 28, 32, 35)
- **Sedang** → 40-60% (random, contoh: 47, 53, 50)
- **Tinggi** → 65-85% (random, contoh: 72, 78, 85)

**Catatan:** Setiap record akan mendapat nilai random yang berbeda dalam range yang sesuai, sehingga data terlihat lebih real.

### Contoh Output Update Script

```
═══════════════════════════════════════════════════════════════
  MyoSig - Update Rata-rata Aktivitas Otot dari injection_data.txt
═══════════════════════════════════════════════════════════════

User: myosig.team@gmail.com
User ID: Gv6rYmDBEjMXxMY8wGhA3SUhmxT2

📄 Membaca file: .../injection_data.txt...

✅ Ditemukan 8 pasien dengan total 58 records

📋 Memproses pasien: Dyah Kusumawati
   Records: 9
   ✓ Patient ID: abc123...
   🔄 Mencari dan mengupdate 9 records...
   ✅ Berhasil update 9 records!

📋 Memproses pasien: Rahmat Priyanto V
   Records: 3
   ✓ Patient ID: def456...
   🔄 Mencari dan mengupdate 3 records...
   ⚠️  Record tidak ditemukan: 04-02-2026 16:28
   ✅ Berhasil update 2 records!
   ⚠️  1 records tidak ditemukan (dilewati)

...

═══════════════════════════════════════════════════════════════
  SUMMARY
═══════════════════════════════════════════════════════════════
✅ Total berhasil diupdate: 55 records
⚠️  Total tidak ditemukan: 3 records
═══════════════════════════════════════════════════════════════

✨ Selesai!
```

### Troubleshooting Update

**Warning: "Record tidak ditemukan"**
- Record dengan tanggal dan waktu yang sama tidak ditemukan di Firestore
- Pastikan record sudah ada di Firestore sebelum menjalankan update script
- Script akan melewati record yang tidak ditemukan dan melanjutkan ke record berikutnya

**Tidak ada yang terupdate**
- Pastikan format tanggal dan waktu di file sama dengan di Firestore
- Format tanggal: `DD-MM-YYYY` (contoh: `04-02-2026`)
- Format waktu: `HH:MM:SS` (contoh: `16:28:00`)

---

## 📋 Ringkasan Semua Script

| Script | Command | Fungsi |
|--------|---------|--------|
| `add-records-to-patient.js` | `npm run add-records` | Menambahkan record dummy secara interaktif |
| `import-from-txt.js` | `npm run import-txt` | **INSERT** record baru dari `injection_data.txt` |
| `update-from-txt.js` | `npm run update-txt` | **UPDATE** `avgMuscleActivity` dari `injection_data.txt` |
