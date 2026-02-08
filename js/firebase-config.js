// Firebase Configuration
// Initialize Firebase SDK

// Import Firebase modules (using CDN)
// Firebase will be loaded via script tags in HTML

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJ8g3YOUfExXdwB6vMz4dm3kmEg-b-VdM",
    authDomain: "myosiq.firebaseapp.com",
    databaseURL: "https://myosiq-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "myosiq",
    storageBucket: "myosiq.firebasestorage.app",
    messagingSenderId: "1044705645243",
    appId: "1:1044705645243:web:9ea55b106e89b96b664f9e",
    measurementId: "G-FN2FN7PWHK"
};

// Initialize Firebase (will be initialized after Firebase SDK loads)
let app, auth, database, firestore, analytics;

// Wait for Firebase to load
function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        // Check if already initialized
        if (app) {
            return true;
        }
        
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        database = firebase.database();
        firestore = firebase.firestore();
        
        // Initialize Analytics if available
        if (firebase.analytics) {
            try {
                analytics = firebase.analytics();
            } catch (e) {
                console.warn('Analytics initialization failed:', e);
            }
        }
        
        console.log('Firebase initialized successfully');
        return true;
    }
    return false;
}

// Gemini API Key - Loaded from config.js (secure file, not in git)
// If config.js is not available, these will be undefined
// Make sure to load config.js before this file in HTML
// Access from window object set by config.js
// Use getter functions to access safely
function getGeminiApiKey() {
    return typeof window !== 'undefined' && window.GEMINI_API_KEY 
        ? window.GEMINI_API_KEY 
        : undefined;
}

function getGeminiApiUrl() {
    return typeof window !== 'undefined' && window.GEMINI_API_URL 
        ? window.GEMINI_API_URL 
        : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
}

// Create constants that reference the window values
// These are safe because they're just references, not redeclarations
const GEMINI_API_KEY = getGeminiApiKey();
const GEMINI_API_URL = getGeminiApiUrl();

// Function to get AI health tips
async function getAIHealthTips() {
    try {
        const prompt = `Sebagai ahli kesehatan dan rehabilitasi stroke, berikan satu tips kesehatan praktis untuk hari ini. Tips harus:
- Singkat dan jelas (maksimal 100 kata)
- Praktis dan mudah diterapkan
- Berkaitan dengan rehabilitasi stroke atau kesehatan umum
- Dalam bahasa Indonesia
- Format: Judul singkat di baris pertama, lalu penjelasan singkat
- JANGAN gunakan markdown formatting seperti ** atau __ atau # atau lainnya
- Hanya gunakan teks biasa tanpa formatting

Contoh format yang benar:
"Tetap Terhidrasi
Minum air yang cukup sangat penting untuk pemulihan. Pastikan minum minimal 8 gelas air per hari untuk menjaga tubuh tetap terhidrasi dan membantu proses pemulihan otot."

JANGAN gunakan format seperti:
"**Tetap Terhidrasi**
Minum air yang cukup..."`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            // If API fails, return default tip instead of throwing error
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let text = data.candidates[0].content.parts[0].text;
            // Remove markdown formatting
            text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold**
            text = text.replace(/__(.*?)__/g, '$1'); // Remove __bold__
            text = text.replace(/\*(.*?)\*/g, '$1'); // Remove *italic*
            text = text.replace(/_(.*?)_/g, '$1'); // Remove _italic_
            text = text.replace(/^#+\s*/gm, ''); // Remove # headers
            text = text.replace(/`(.*?)`/g, '$1'); // Remove `code`
            text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove [links](url)
            return text.trim();
        }
        
        // Fallback if response structure is unexpected
        throw new Error('Unexpected response structure');
    } catch (error) {
        console.error('Error getting AI health tips:', error);
        // Return default tips if API fails - this ensures app always works
        const defaultTips = [
            'Istirahat yang Cukup\nPastikan Anda beristirahat minimal 8 jam setiap malam untuk pemulihan yang optimal setelah latihan rehabilitasi.',
            'Tetap Terhidrasi\nMinum air yang cukup sangat penting untuk pemulihan. Pastikan minum minimal 8 gelas air per hari untuk menjaga tubuh tetap terhidrasi dan membantu proses pemulihan otot.',
            'Nutrisi Seimbang\nKonsumsi makanan bergizi dengan protein yang cukup untuk membantu pemulihan otot. Pilih makanan yang kaya akan vitamin dan mineral.',
            'Lakukan Pemanasan\nSelalu lakukan pemanasan ringan sebelum memulai latihan untuk mencegah cedera dan mempersiapkan otot untuk aktivitas.',
            'Konsistensi adalah Kunci\nLakukan latihan secara rutin setiap hari, meskipun hanya 10-15 menit, lebih baik daripada latihan panjang sekali seminggu.',
            'Posisi Tubuh yang Benar\nPastikan posisi duduk dan berdiri yang benar untuk mencegah ketegangan otot dan meningkatkan keseimbangan.',
            'Istirahat Aktif\nSetelah latihan, lakukan peregangan ringan dan berjalan santai untuk membantu pemulihan otot.'
        ];
        const randomTip = defaultTips[Math.floor(Math.random() * defaultTips.length)];
        return randomTip;
    }
}
