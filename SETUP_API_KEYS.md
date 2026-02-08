# Setup API Keys

## Penting: Konfigurasi API Keys

File `js/config.js` berisi API keys yang sensitif dan **TIDAK** akan di-commit ke GitHub.

## Setup Awal

1. **Copy file template:**
   ```bash
   cp js/config.example.js js/config.js
   ```

2. **Edit `js/config.js` dan isi dengan API keys Anda:**
   ```javascript
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   ```

3. **File `js/config.js` sudah ditambahkan ke `.gitignore`** sehingga tidak akan ter-commit.

## Mendapatkan API Keys

### Gemini API Key
1. Kunjungi: https://aistudio.google.com/apikey
2. Login dengan akun Google Anda
3. Klik "Create API Key"
4. Copy API key yang dihasilkan
5. Paste ke `js/config.js`

## Struktur File

- `js/config.js` - File konfigurasi dengan API keys (TIDAK di-commit)
- `js/config.example.js` - Template untuk referensi (di-commit)
- `js/firebase-config.js` - Menggunakan API keys dari config.js

## Catatan Keamanan

⚠️ **JANGAN** commit file `js/config.js` ke repository!
- File ini sudah ditambahkan ke `.gitignore`
- Gunakan `js/config.example.js` sebagai template
- Setiap developer harus membuat `js/config.js` sendiri

## Troubleshooting

Jika aplikasi tidak berfungsi:
1. Pastikan `js/config.js` sudah dibuat
2. Pastikan API keys sudah diisi dengan benar
3. Pastikan `js/config.js` dimuat sebelum `js/firebase-config.js` di HTML
