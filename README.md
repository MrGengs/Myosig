# Myosig - Smart Wearable Device for Rehabilitation Stroke Patient

Aplikasi web responsif untuk monitoring dan rehabilitasi pasien stroke menggunakan sensor EMG dan MPU.

## Fitur Utama

- **Autentikasi**: Login dan Register dengan Email/Password atau Google Sign-In
- **Dashboard**: Overview kemajuan harian dan status sensor
- **Latihan**: Berbagai jenis latihan rehabilitasi dengan timer dan tracking
- **Kemajuan**: Tracking perkembangan dari waktu ke waktu dengan grafik dan statistik
- **Sensor**: Monitoring real-time data dari sensor EMG dan MPU
- **Akun**: Pengaturan profil dan informasi kesehatan

## Struktur Project

```
Myosig_v2/
├── auth.html          # Halaman login dan register
├── dashboard.html     # Halaman utama dashboard
├── exercise.html      # Halaman latihan rehabilitasi
├── progress.html      # Halaman tracking kemajuan
├── sensors.html       # Halaman monitoring sensor
├── account.html       # Halaman pengaturan akun
├── css/
│   └── style.css      # Stylesheet utama
├── js/
│   ├── auth.js        # Logika autentikasi
│   ├── dashboard.js   # Logika dashboard
│   ├── exercise.js    # Logika latihan
│   ├── progress.js    # Logika tracking kemajuan
│   ├── sensors.js     # Logika monitoring sensor
│   ├── account.js     # Logika pengaturan akun
│   └── navigation.js  # Logika navigasi bottom bar
└── README.md          # Dokumentasi
```

## Cara Menggunakan

1. Buka `auth.html` di browser untuk memulai
2. Daftar akun baru atau login dengan:
   - Email/Password
   - Google Sign-In (dengan logo Google asli)
3. Setelah login, Anda akan diarahkan ke dashboard
4. Gunakan bottom navigation bar untuk berpindah antar halaman

## Teknologi

- HTML5
- CSS3 (dengan CSS Variables)
- JavaScript (Vanilla JS)
- Bootstrap Icons

## Warna Tema

- **Primary Blue**: #87CEEB (Sky Blue)
- **Light Blue**: #B0E0E6 (Powder Blue)
- **Lighter Blue**: #E0F6FF (Very Light Blue)
- **Milky White**: #FFF8F0
- **White**: #FFFFFF

## Fitur Responsif

Aplikasi dirancang mobile-first dengan:
- Bottom navigation bar untuk mobile
- Layout yang menyesuaikan untuk desktop
- Touch-friendly buttons dan controls
- Optimized untuk berbagai ukuran layar

## Integrasi Firebase

Aplikasi ini terintegrasi dengan Firebase untuk:
- **Authentication**: Login dan register menggunakan Firebase Auth
- **Realtime Database**: Membaca data sensor real-time dari hardware
- **Firestore**: Menyimpan data user dan riwayat latihan
- **Gemini AI**: Rekomendasi latihan berdasarkan data sensor

### Setup Firebase

Lihat file `FIREBASE_SETUP.md` untuk instruksi lengkap setup Firebase.

### Struktur Data Sensor

Data sensor dari hardware disimpan di Realtime Database dengan path `device 2`:
- `ax`, `ay`, `az`: Accelerometer data
- `gx`, `gy`, `gz`: Gyroscope data  
- `emg_raw`: EMG raw value
- `emg_voltage`: EMG voltage value

### AI Recommendation

Aplikasi menggunakan Gemini AI untuk memberikan rekomendasi latihan berdasarkan:
- Data EMG sensor (voltage dan raw)
- Data MPU sensor (accelerometer dan gyroscope)
- Analisis pola gerakan

## Catatan

- Pastikan Firebase sudah di-setup sebelum menggunakan aplikasi
- Sensor data dibaca real-time dari Firebase Realtime Database
- Data user dan latihan disimpan di Firestore
- AI recommendation membutuhkan koneksi internet
