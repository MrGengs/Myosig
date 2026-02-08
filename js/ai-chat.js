// AI Chat JavaScript
// Handle AI chat functionality with Firebase data integration

let currentUser = null;
let chatHistory = []; // Store chat history for context
let isLoading = false;

// Initialize AI chat page
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
            
            // Initialize chat with welcome message
            initializeChat();
        });
    }
    
    // Start initialization
    initWhenReady();
});

// Initialize chat with welcome message
function initializeChat() {
    // Suggestions are already visible by default in HTML
    // No need to show/hide them here
    
    // Add welcome message from AI
    addMessage('ai', 'Halo, Dokter! Saya adalah AI Assistant khusus untuk membantu Anda dalam mengelola pasien rehabilitasi stroke. Saya dapat membantu dengan:\n\n• Analisis data pasien dan monitoring\n• Rekomendasi program rehabilitasi berdasarkan data\n• Evaluasi perkembangan dan tren pasien\n• Saran perawatan dan intervensi medis\n• Interpretasi hasil monitoring dan statistik\n\nSilakan tanyakan sesuatu tentang pasien Anda atau pilih salah satu pertanyaan di atas!');
}

// Auto resize textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Handle Enter key in chat input
function handleChatInputKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const message = input.value.trim();
    
    if (!message || isLoading) {
        return;
    }
    
    // Hide suggestions after first message
    const suggestionsEl = document.getElementById('chatSuggestions');
    if (suggestionsEl) {
        suggestionsEl.style.display = 'none';
    }
    
    // Scroll messages wrapper to bottom
    const messagesWrapper = document.querySelector('.chat-messages-wrapper');
    if (messagesWrapper) {
        setTimeout(() => {
            messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
        }, 100);
    }
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Disable input and button
    input.disabled = true;
    sendBtn.disabled = true;
    isLoading = true;
    
    // Add user message to chat
    addMessage('user', message);
    
    // Show loading indicator
    showLoading();
    
    try {
        // Get response from AI
        const response = await getAIResponse(message);
        
        // Remove loading indicator
        hideLoading();
        
        // Add AI response to chat
        addMessage('ai', response);
        
    } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Remove loading indicator
        hideLoading();
        
        // Show error message
        addMessage('ai', 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi atau tanyakan hal lain.');
    } finally {
        // Re-enable input and button
        input.disabled = false;
        sendBtn.disabled = false;
        isLoading = false;
        input.focus();
    }
}

// Send suggestion message
function sendSuggestion(suggestion) {
    const input = document.getElementById('chatInput');
    input.value = suggestion;
    sendMessage();
}

// Add message to chat
function addMessage(type, content) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    // Remove empty state if exists
    const emptyState = messagesContainer.querySelector('.chat-empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    // Get current time
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Avatar - use PhotoURL for user, icon for AI
    let avatarHTML = '';
    if (type === 'user') {
        // Get user photo URL from currentUser
        const photoURL = currentUser && currentUser.photoURL ? currentUser.photoURL : null;
        if (photoURL) {
            avatarHTML = `
                <div class="chat-avatar">
                    <img src="${photoURL}" alt="User Avatar" onerror="this.onerror=null; this.style.display='none'; const icon = this.nextElementSibling; if(icon) icon.style.display='flex';">
                    <i class="bi bi-person" style="display: none;"></i>
                </div>
            `;
        } else {
            avatarHTML = `
                <div class="chat-avatar">
                    <i class="bi bi-person"></i>
                </div>
            `;
        }
    } else {
        // Use logoAi.png for AI avatar
        avatarHTML = `
            <div class="chat-avatar">
                <img src="assets/image/logoAi.png" alt="AI Assistant Logo" onerror="this.onerror=null; this.style.display='none'; const icon = this.nextElementSibling; if(icon) icon.style.display='flex';">
                <i class="bi bi-robot" style="display: none;"></i>
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        ${avatarHTML}
        <div class="chat-content">
            <div class="chat-bubble">${formatMessage(content)}</div>
            <div class="chat-time">${timeStr}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    const messagesWrapper = document.querySelector('.chat-messages-wrapper');
    if (messagesWrapper) {
        setTimeout(() => {
            messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
        }, 50);
    }
    
    // Add to chat history
    chatHistory.push({
        type: type,
        content: content,
        timestamp: now
    });
}

// Format message content (handle line breaks and basic formatting)
function formatMessage(content) {
    // Escape HTML to prevent XSS
    let formatted = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Convert line breaks to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Convert bullet points
    formatted = formatted.replace(/^•\s/gm, '• ');
    
    return formatted;
}

// Show loading indicator
function showLoading() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message ai';
    loadingDiv.id = 'chatLoading';
    
    loadingDiv.innerHTML = `
        <div class="chat-avatar">
            <img src="assets/image/logoAi.png" alt="AI Assistant Logo" onerror="this.onerror=null; this.style.display='none'; const icon = this.nextElementSibling; if(icon) icon.style.display='flex';">
            <i class="bi bi-robot" style="display: none;"></i>
        </div>
        <div class="chat-content">
            <div class="chat-bubble" style="display: inline-block;">
                <div class="chat-loading">
                    <div class="chat-loading-dot"></div>
                    <div class="chat-loading-dot"></div>
                    <div class="chat-loading-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(loadingDiv);
    
    // Scroll to bottom
    const messagesWrapper = document.querySelector('.chat-messages-wrapper');
    if (messagesWrapper) {
        setTimeout(() => {
            messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
        }, 50);
    }
}

// Hide loading indicator
function hideLoading() {
    const loadingDiv = document.getElementById('chatLoading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Get AI response with Firebase data context
async function getAIResponse(userMessage) {
    // Check if Gemini API is available
    if (typeof GEMINI_API_KEY === 'undefined' || !GEMINI_API_KEY) {
        throw new Error('Gemini API key tidak ditemukan');
    }
    
    // Load Firebase data for context
    const firebaseData = await loadFirebaseDataForContext();
    
    // Build context prompt
    const contextPrompt = buildContextPrompt(userMessage, firebaseData);
    
    // Call Gemini API
    const apiUrl = GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    const apiKey = GEMINI_API_KEY;
    
    const requestBody = {
        contents: [{
            parts: [{
                text: contextPrompt
            }]
        }]
    };
    
    // Add chat history for context (last 3 messages)
    if (chatHistory.length > 1) {
        const recentHistory = chatHistory.slice(-6); // Last 3 exchanges (user + AI)
        const historyText = recentHistory.map(msg => {
            const role = msg.type === 'user' ? 'User' : 'AI Assistant';
            return `${role}: ${msg.content}`;
        }).join('\n\n');
        
        requestBody.contents[0].parts[0].text = `Konteks percakapan sebelumnya:\n${historyText}\n\n${contextPrompt}`;
    }
    
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
            console.warn('Could not parse error response:', e);
        }
        
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Extract text from Gemini response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        let text = data.candidates[0].content.parts[0].text;
        
        // Clean up markdown formatting
        text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold**
        text = text.replace(/__(.*?)__/g, '$1'); // Remove __bold__
        text = text.replace(/\*(.*?)\*/g, '$1'); // Remove *italic*
        text = text.replace(/_(.*?)_/g, '$1'); // Remove _italic_
        text = text.replace(/^#+\s*/gm, ''); // Remove # headers
        text = text.replace(/`(.*?)`/g, '$1'); // Remove `code`
        text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove [links](url)
        
        return text.trim();
    } else {
        throw new Error('Format respons API tidak valid');
    }
}

// Load Firebase data for context
async function loadFirebaseDataForContext() {
    if (!currentUser || !firestore) {
        return null;
    }
    
    try {
        const data = {
            patients: [],
            records: [],
            stats: {}
        };
        
        // Load patients
        const patientsSnapshot = await firestore.collection('users')
            .doc(currentUser.uid)
            .collection('patients')
            .get();
        
        const patientIds = [];
        patientsSnapshot.forEach(doc => {
            const patientData = doc.data();
            data.patients.push({
                id: doc.id,
                name: patientData.name || 'Tidak diketahui',
                email: patientData.email || '',
                gender: patientData.gender || '',
                birthDate: patientData.birthDate || '',
                strokeDate: patientData.strokeDate || ''
            });
            patientIds.push(doc.id);
        });
        
        // Load recent records (last 10 records from all patients)
        const allRecords = [];
        for (const patientId of patientIds) {
            try {
                const recordsSnapshot = await firestore.collection('users')
                    .doc(currentUser.uid)
                    .collection('patients')
                    .doc(patientId)
                    .collection('monitoringRecords')
                    .orderBy('createdAt', 'desc')
                    .limit(5)
                    .get();
                
                recordsSnapshot.forEach(doc => {
                    const recordData = doc.data();
                    allRecords.push({
                        patientId: patientId,
                        timestamp: recordData.timestamp || recordData.createdAt || null,
                        duration: recordData.duration || 0,
                        avgMuscleActivity: recordData.avgMuscleActivity || 0,
                        movementCount: recordData.movementCount || 0,
                        maxAcceleration: recordData.maxAcceleration || 0
                    });
                });
            } catch (e) {
                // If orderBy fails, skip this patient's records
                console.warn('Error loading records for patient:', patientId, e);
            }
        }
        
        // Sort records by timestamp (newest first)
        allRecords.sort((a, b) => {
            const dateA = a.timestamp ? (a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp)) : new Date(0);
            const dateB = b.timestamp ? (b.timestamp.toDate ? b.timestamp.toDate() : new Date(b.timestamp)) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
        
        data.records = allRecords.slice(0, 10); // Keep only 10 most recent
        
        // Calculate statistics
        if (data.records.length > 0) {
            const activities = data.records.map(r => parseFloat(r.avgMuscleActivity) || 0);
            const movements = data.records.map(r => parseFloat(r.movementCount) || 0);
            
            data.stats = {
                totalPatients: data.patients.length,
                totalRecords: allRecords.length,
                avgActivity: activities.length > 0 
                    ? (activities.reduce((a, b) => a + b, 0) / activities.length).toFixed(1)
                    : 0,
                avgMovements: movements.length > 0
                    ? (movements.reduce((a, b) => a + b, 0) / movements.length).toFixed(1)
                    : 0,
                recentRecordsCount: data.records.length
            };
        } else {
            data.stats = {
                totalPatients: data.patients.length,
                totalRecords: 0,
                avgActivity: 0,
                avgMovements: 0,
                recentRecordsCount: 0
            };
        }
        
        return data;
    } catch (error) {
        console.error('Error loading Firebase data:', error);
        return null;
    }
}

// Build context prompt with Firebase data
function buildContextPrompt(userMessage, firebaseData) {
    let prompt = `Anda adalah AI Assistant untuk aplikasi Myosig, sebuah sistem monitoring dan rehabilitasi stroke. Anda membantu dokter dalam mengelola pasien rehabilitasi stroke.

KONTEKS DATA FIREBASE:\n\n`;

    if (firebaseData && firebaseData.patients.length > 0) {
        prompt += `DATA PASIEN (Total: ${firebaseData.patients.length} pasien):\n`;
        firebaseData.patients.forEach((patient, index) => {
            prompt += `${index + 1}. ${patient.name}`;
            if (patient.gender) prompt += ` (${patient.gender})`;
            if (patient.strokeDate) {
                try {
                    const strokeDate = patient.strokeDate.toDate ? patient.strokeDate.toDate() : new Date(patient.strokeDate);
                    if (!isNaN(strokeDate.getTime())) {
                        prompt += ` - Stroke: ${strokeDate.toLocaleDateString('id-ID')}`;
                    }
                } catch (e) {
                    // Skip if date parsing fails
                }
            }
            prompt += '\n';
        });
        prompt += '\n';
        
        if (firebaseData.records.length > 0) {
            prompt += `DATA MONITORING TERBARU (${firebaseData.records.length} record terbaru):\n`;
            firebaseData.records.slice(0, 5).forEach((record, index) => {
                const patient = firebaseData.patients.find(p => p.id === record.patientId);
                const patientName = patient ? patient.name : 'Pasien';
                let dateStr = 'Tanggal tidak tersedia';
                if (record.timestamp) {
                    try {
                        const date = record.timestamp.toDate ? record.timestamp.toDate() : new Date(record.timestamp);
                        if (!isNaN(date.getTime())) {
                            dateStr = date.toLocaleDateString('id-ID');
                        }
                    } catch (e) {
                        // Use default if date parsing fails
                    }
                }
                prompt += `${index + 1}. ${patientName} - ${dateStr}:\n`;
                prompt += `   - Aktivitas Otot: ${record.avgMuscleActivity}%\n`;
                prompt += `   - Jumlah Gerakan: ${record.movementCount}\n`;
                prompt += `   - Akselerasi Maks: ${parseFloat(record.maxAcceleration || 0).toFixed(2)} g\n`;
                prompt += `   - Durasi: ${record.duration} detik\n`;
            });
            prompt += '\n';
            
            prompt += `STATISTIK KESELURUHAN:\n`;
            prompt += `- Total Pasien: ${firebaseData.stats.totalPatients}\n`;
            prompt += `- Total Record: ${firebaseData.stats.totalRecords}\n`;
            prompt += `- Rata-rata Aktivitas Otot: ${firebaseData.stats.avgActivity}%\n`;
            prompt += `- Rata-rata Jumlah Gerakan: ${firebaseData.stats.avgMovements}\n`;
            prompt += '\n';
        } else {
            prompt += `Belum ada data monitoring yang tercatat.\n\n`;
        }
    } else {
        prompt += `Belum ada data pasien yang terdaftar.\n\n`;
    }
    
    prompt += `PERTANYAAN USER:\n${userMessage}\n\n`;
    
    prompt += `INSTRUKSI:
1. Anda adalah AI Assistant khusus untuk DOKTER, bukan untuk pasien
2. Jawab pertanyaan dokter dengan jelas, informatif, dan profesional dalam bahasa Indonesia
3. Gunakan data Firebase di atas untuk memberikan analisis yang akurat dan kontekstual
4. Fokus pada aspek medis, evaluasi klinis, dan rekomendasi profesional untuk dokter
5. Berikan rekomendasi program rehabilitasi berdasarkan data monitoring yang tersedia
6. Analisis tren dan perkembangan pasien dari perspektif medis
7. Jika data tidak tersedia, jelaskan dengan sopan dan berikan saran umum dari sudut pandang medis
8. Format jawaban dengan jelas, gunakan line breaks untuk readability
9. JANGAN gunakan markdown formatting seperti ** atau __ atau #
10. Gunakan bullet points dengan • jika perlu
11. Jawab dengan ramah, profesional, dan sesuai dengan konteks sebagai asisten untuk dokter
12. Gunakan terminologi medis yang tepat namun tetap mudah dipahami
13. Berikan insight klinis dan rekomendasi yang dapat membantu dokter dalam pengambilan keputusan

Jawab pertanyaan dokter sekarang:`;
    
    return prompt;
}
