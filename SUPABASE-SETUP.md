# Tutorial Setup Supabase untuk Myosig v2

## Kenapa Supabase?

Supabase digunakan untuk menyimpan **foto dokumentasi pasien** setelah sesi monitoring selesai. Kita menggunakan **Supabase Storage** (bukan database-nya) karena:
- Firebase Storage memerlukan billing (Blaze plan)
- Supabase Storage **gratis** hingga 1GB
- Mudah diintegrasikan via REST API dari browser

---

## Langkah 1: Buat Akun Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"** atau **"Sign Up"**
3. Login menggunakan GitHub (recommended) atau email

---

## Langkah 2: Buat Project Baru

1. Klik **"New Project"**
2. Isi:
   - **Name**: `myosig` (atau nama lain)
   - **Database Password**: buat password (simpan, tapi kita tidak pakai untuk storage)
   - **Region**: pilih **Southeast Asia (Singapore)** untuk latency terbaik
3. Klik **"Create new project"**
4. Tunggu hingga project selesai dibuat (~2 menit)

---

## Langkah 3: Buat Storage Bucket

1. Di sidebar kiri, klik **"Storage"**
2. Klik **"New bucket"**
3. Isi:
   - **Name**: `patient-photos`
   - **Public bucket**: **ON** (centang/aktifkan) — agar foto bisa diakses via URL publik
   - **File size limit**: `5MB` (cukup untuk foto)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
4. Klik **"Create bucket"**

---

## Langkah 4: Set Storage Policy (RLS)

Setelah bucket dibuat, kita perlu set policy agar bisa upload dari browser:

1. Klik bucket **"patient-photos"**
2. Klik tab **"Policies"** (atau **"Configuration"** > **"Policies"**)
3. Klik **"New policy"**
4. Pilih **"For full customization"** (atau "Get started quickly" > "Allow access to all users")
5. Buat **2 policy**:

### Policy 1: Allow Upload (INSERT)
- **Policy name**: `Allow public upload`
- **Allowed operation**: `INSERT`
- **Target roles**: pilih `anon` (anonymous)
- **Policy definition (USING expression)**: `true`
- **WITH CHECK expression**: `true`
- Klik **"Review"** lalu **"Save policy"**

### Policy 2: Allow Read (SELECT)
- **Policy name**: `Allow public read`
- **Allowed operation**: `SELECT`
- **Target roles**: pilih `anon`
- **Policy definition (USING expression)**: `true`
- Klik **"Review"** lalu **"Save policy"**

> **Catatan**: Policy ini mengizinkan siapa saja upload dan baca. Untuk production, sebaiknya dibatasi dengan auth. Tapi untuk tahap development ini cukup.

---

## Langkah 5: Ambil Credential yang Dibutuhkan

### Yang perlu di-copy dan kirimkan ke saya:

Buka **Project Settings** (ikon gear di sidebar kiri) > **API**

Anda perlu **2 nilai** ini:

### 1. Project URL
```
Contoh: https://xyzabcdef.supabase.co
```
Lokasi: **Project Settings** > **API** > **Project URL**

### 2. Anon Public Key (anon key)
```
Contoh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```
Lokasi: **Project Settings** > **API** > **Project API keys** > **anon** (yang bertuliskan `public`)

> **PENTING**: Ambil yang `anon` / `public`, **JANGAN** yang `service_role` / `secret`!

---

## Ringkasan: Apa yang perlu dikirim ke saya

Setelah selesai setup, kirimkan **2 nilai** ini:

```
1. SUPABASE_URL     = https://xxxxx.supabase.co
2. SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIs...
```

---

## Apa yang akan saya implementasikan

Setelah mendapat credential di atas, saya akan:

1. **Menambahkan Supabase config** ke `js/config.js`
2. **Menambahkan Supabase JS SDK** via CDN di `sensors.html`
3. **Membuat modal kamera** yang otomatis muncul setelah data monitoring tersimpan ke Firestore
4. **Fungsi capture foto** dari kamera device (front/back camera)
5. **Upload foto ke Supabase Storage** bucket `patient-photos`
6. **Menyimpan URL foto ke Firestore** di document monitoring record yang baru dibuat

### Flow yang akan terjadi:
```
Klik Stop Recording
    → Data tersimpan ke Firestore ✓
    → Modal kamera otomatis terbuka
    → Dokter ambil foto pasien
    → Foto di-upload ke Supabase Storage
    → URL foto disimpan ke Firestore (update record)
    → Selesai!
```

### Struktur penyimpanan foto di Supabase:
```
patient-photos/
  └── {doctorId}/
      └── {patientId}/
          └── {timestamp}.jpg
```

### URL foto yang tersimpan di Firestore:
```
https://xxxxx.supabase.co/storage/v1/object/public/patient-photos/{doctorId}/{patientId}/{timestamp}.jpg
```

---

## FAQ

**Q: Apakah gratis?**
A: Ya, Supabase free tier memberikan 1GB storage gratis.

**Q: Apakah aman menyimpan anon key di frontend?**
A: Anon key memang dirancang untuk digunakan di frontend (seperti Firebase API key). Keamanan dijaga melalui RLS (Row Level Security) policies yang sudah kita set di bucket.

**Q: Bisa pakai kamera HP?**
A: Ya, menggunakan `navigator.mediaDevices.getUserMedia()` yang support di semua browser modern (Chrome, Safari, Firefox) baik desktop maupun mobile.
