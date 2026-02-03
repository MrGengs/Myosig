// Exercise JavaScript
// Handle exercise session functionality

let exerciseTimer = null;
let exerciseStartTime = null;
let exercisePaused = false;
let exercisePausedTime = 0;
let exerciseReps = 0;
let currentExercise = null;

// Check if user is logged in
window.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to load
    if (typeof firebase !== 'undefined') {
        initializeFirebase();
        
        // Check authentication
        auth.onAuthStateChanged(function(user) {
            if (!user) {
                window.location.href = 'auth.html';
                return;
            }
        });
    } else {
        // Fallback to localStorage check
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'auth.html';
            return;
        }
    }
});

// Start exercise
function startExercise(exerciseType) {
    currentExercise = exerciseType;
    exerciseReps = 0;
    exercisePaused = false;
    exercisePausedTime = 0;
    exerciseStartTime = Date.now();
    
    // Hide exercise list and show session
    document.querySelectorAll('.exercise-item').forEach(item => {
        item.style.display = 'none';
    });
    document.getElementById('exerciseSession').classList.remove('hidden');
    
    // Set exercise name based on type
    const exerciseNames = {
        'lengan-kanan': 'Latihan Lengan Kanan',
        'lengan-kiri': 'Latihan Lengan Kiri',
        'peregangan': 'Latihan Peregangan',
        'koordinasi': 'Latihan Koordinasi',
        'kekuatan': 'Latihan Kekuatan'
    };
    
    document.getElementById('currentExerciseName').textContent = exerciseNames[exerciseType] || 'Latihan';
    
    // Start timer
    startTimer();
    
    // Simulate exercise reps (increment every 3 seconds)
    const repInterval = setInterval(() => {
        if (!exercisePaused) {
            exerciseReps++;
            document.getElementById('exerciseReps').textContent = exerciseReps;
            
            // Update progress (simulate 30 reps for completion)
            const progress = Math.min((exerciseReps / 30) * 100, 100);
            document.getElementById('exerciseProgress').style.width = progress + '%';
            document.getElementById('exerciseProgress').textContent = Math.round(progress) + '%';
        }
    }, 3000);
    
    // Store interval for cleanup
    window.exerciseRepInterval = repInterval;
}

// Start or resume timer
function startTimer() {
    if (exerciseTimer) {
        clearInterval(exerciseTimer);
    }
    
    exerciseTimer = setInterval(() => {
        if (!exercisePaused) {
            const elapsed = Date.now() - exerciseStartTime - exercisePausedTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            document.getElementById('exerciseTimer').textContent = 
                String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        }
    }, 1000);
}

// Pause exercise
function pauseExercise() {
    exercisePaused = !exercisePaused;
    
    if (exercisePaused) {
        exercisePausedTime = Date.now() - exerciseStartTime - exercisePausedTime;
        document.getElementById('pauseBtn').innerHTML = '<i class="bi bi-play-circle"></i> Lanjutkan';
        document.getElementById('pauseBtn').classList.remove('btn-secondary');
        document.getElementById('pauseBtn').classList.add('btn-primary');
    } else {
        exerciseStartTime = Date.now();
        exercisePausedTime = 0;
        document.getElementById('pauseBtn').innerHTML = '<i class="bi bi-pause-circle"></i> Jeda';
        document.getElementById('pauseBtn').classList.remove('btn-primary');
        document.getElementById('pauseBtn').classList.add('btn-secondary');
    }
}

// Stop exercise
function stopExercise() {
    if (typeof showConfirm === 'function') {
        showConfirm('Apakah Anda yakin ingin menghentikan latihan ini?', 'Konfirmasi Hentikan Latihan', () => {
            finishExercise();
        });
    } else {
        // Fallback to native confirm if modal not loaded
        if (confirm('Apakah Anda yakin ingin menghentikan latihan ini?')) {
            finishExercise();
        }
    }
}

// Finish exercise (called after confirmation)
function finishExercise() {
    // Clear intervals
    if (exerciseTimer) {
        clearInterval(exerciseTimer);
        exerciseTimer = null;
    }
    if (window.exerciseRepInterval) {
        clearInterval(window.exerciseRepInterval);
        window.exerciseRepInterval = null;
    }
    
    // Calculate total time
    const totalTime = Math.floor((Date.now() - exerciseStartTime - exercisePausedTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    
    // Save exercise data
    saveExerciseData(currentExercise, minutes, exerciseReps);
    
    // Show success message
    if (typeof showAlert === 'function') {
        showAlert(`Latihan selesai!\n\nDurasi: ${minutes} menit\nRepetisi: ${exerciseReps}x`, 'Latihan Selesai');
    } else {
        alert(`Latihan selesai!\nDurasi: ${minutes} menit\nRepetisi: ${exerciseReps}x`);
    }
    
    // Reset UI
    document.getElementById('exerciseSession').classList.add('hidden');
    document.querySelectorAll('.exercise-item').forEach(item => {
        item.style.display = 'flex';
    });
    
    // Reset values
    document.getElementById('exerciseTimer').textContent = '00:00';
    document.getElementById('exerciseReps').textContent = '0';
    document.getElementById('exerciseProgress').style.width = '0%';
    document.getElementById('exerciseProgress').textContent = '0%';
    
    currentExercise = null;
    exerciseReps = 0;
    exercisePaused = false;
}

// Save exercise data to Firestore and localStorage
async function saveExerciseData(exerciseType, minutes, reps) {
    const exerciseData = {
        type: exerciseType,
        date: new Date().toISOString(),
        duration: minutes,
        reps: reps,
        createdAt: new Date()
    };
    
    // Save to Firestore if available
    if (auth && firestore) {
        auth.onAuthStateChanged(async function(user) {
            if (user) {
                try {
                    await firestore.collection('exercises').add({
                        userId: user.uid,
                        type: exerciseType,
                        duration: minutes,
                        reps: reps,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log('Exercise saved to Firestore');
                } catch (error) {
                    console.error('Error saving exercise to Firestore:', error);
                }
            }
        });
    }
    
    // Also save to localStorage as backup
    let exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    exercises.push(exerciseData);
    
    // Keep only last 50 exercises
    if (exercises.length > 50) {
        exercises = exercises.slice(-50);
    }
    
    localStorage.setItem('exercises', JSON.stringify(exercises));
}
