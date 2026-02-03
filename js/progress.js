// Progress JavaScript
// Load and display progress data

let currentUser = null;

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
            
            currentUser = user;
            loadProgressData(user);
            loadExerciseHistory(user);
            loadWeeklyChart(user);
            loadMonthlyProgress(user);
            loadAchievements(user);
        });
    } else {
        // Fallback to localStorage check
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'auth.html';
            return;
        }
        
        loadProgressData();
        loadExerciseHistory();
        loadWeeklyChart();
        loadMonthlyProgress();
        loadAchievements();
    }
});

// Load overall progress statistics
function loadProgressData(user = null) {
    if (user && firestore) {
        // Load from Firestore
        firestore.collection('exercises')
            .where('userId', '==', user.uid)
            .get()
            .then(snapshot => {
                const exercises = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                    exercises.push({
                        ...data,
                        date: createdAt.toISOString(),
                        duration: data.duration || 0,
                        reps: data.reps || 0
                    });
                });
                calculateProgressStats(exercises);
            })
            .catch(error => {
                console.error('Error loading progress:', error);
                // Fallback to localStorage
                const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
                calculateProgressStats(exercises);
            });
    } else {
        // Get exercises from localStorage
        const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
        calculateProgressStats(exercises);
    }
}

// Calculate progress statistics
function calculateProgressStats(exercises) {
    if (!exercises || exercises.length === 0) {
        const totalDaysEl = document.getElementById('totalDays');
        const totalHoursEl = document.getElementById('totalHours');
        const totalRepsEl = document.getElementById('totalReps');
        const improvementEl = document.getElementById('improvement');
        
        if (totalDaysEl) totalDaysEl.textContent = '0';
        if (totalHoursEl) totalHoursEl.textContent = '0';
        if (totalRepsEl) totalRepsEl.textContent = '0';
        if (improvementEl) improvementEl.textContent = '+0%';
        return;
    }
    
    // Calculate total days (unique dates)
    const uniqueDates = new Set();
    exercises.forEach(ex => {
        if (ex.date) {
            const dateStr = ex.date.split('T')[0];
            uniqueDates.add(dateStr);
        }
    });
    
    const totalDaysEl = document.getElementById('totalDays');
    if (totalDaysEl) {
        totalDaysEl.textContent = uniqueDates.size || 0;
    }
    
    // Calculate total hours
    const totalMinutes = exercises.reduce((sum, ex) => sum + (parseInt(ex.duration) || 0), 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalHoursEl = document.getElementById('totalHours');
    if (totalHoursEl) {
        totalHoursEl.textContent = totalHours || 0;
    }
    
    // Calculate total reps
    const totalReps = exercises.reduce((sum, ex) => sum + (parseInt(ex.reps) || 0), 0);
    const totalRepsEl = document.getElementById('totalReps');
    if (totalRepsEl) {
        totalRepsEl.textContent = totalReps || 0;
    }
    
    // Calculate improvement based on recent activity
    let improvement = '+0%';
    if (exercises.length >= 20) {
        improvement = '+25%';
    } else if (exercises.length >= 10) {
        improvement = '+15%';
    } else if (exercises.length >= 5) {
        improvement = '+10%';
    } else if (exercises.length > 0) {
        improvement = '+5%';
    }
    
    const improvementEl = document.getElementById('improvement');
    if (improvementEl) {
        improvementEl.textContent = improvement;
    }
}

// Load weekly chart data
function loadWeeklyChart(user = null) {
    const chartContainer = document.querySelector('.chart-container > div');
    if (!chartContainer) return;
    
    // Get exercises for this week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const getExercisesForWeek = (exercises) => {
        return exercises.filter(ex => {
            if (!ex.date) return false;
            const exDate = new Date(ex.date);
            return exDate >= startOfWeek;
        });
    };
    
    if (user && firestore) {
        firestore.collection('exercises')
            .where('userId', '==', user.uid)
            .get()
            .then(snapshot => {
                const exercises = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                    exercises.push({
                        ...data,
                        date: createdAt.toISOString(),
                        duration: data.duration || 0
                    });
                });
                const weekExercises = getExercisesForWeek(exercises);
                updateWeeklyChart(weekExercises);
            })
            .catch(error => {
                console.error('Error loading weekly chart:', error);
                const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
                const weekExercises = getExercisesForWeek(exercises);
                updateWeeklyChart(weekExercises);
            });
    } else {
        const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
        const weekExercises = getExercisesForWeek(exercises);
        updateWeeklyChart(weekExercises);
    }
}

// Update weekly chart with real data
function updateWeeklyChart(exercises) {
    const chartContainer = document.querySelector('.chart-container > div');
    if (!chartContainer) return;
    
    // Group exercises by day of week (0 = Sunday, 1 = Monday, etc.)
    const dayData = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    
    exercises.forEach(ex => {
        if (ex.date) {
            const exDate = new Date(ex.date);
            const dayOfWeek = exDate.getDay(); // 0 = Sunday
            dayData[dayOfWeek] += (parseInt(ex.duration) || 0);
        }
    });
    
    // Find max value for scaling
    const maxValue = Math.max(...dayData, 1); // At least 1 to avoid division by zero
    
    // Day names in Indonesian
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    
    // Update chart
    chartContainer.innerHTML = dayData.map((value, index) => {
        const height = Math.max((value / maxValue) * 100, 5); // Minimum 5% height
        return `
            <div style="text-align: center; flex: 1;">
                <div style="background: var(--gradient-primary); width: 40%; height: ${height}%; margin: 0 auto; border-radius: 4px 4px 0 0; margin-bottom: 0.5rem; transition: height 0.3s ease;"></div>
                <div style="font-size: 0.75rem; color: var(--text-light);">${dayNames[index]}</div>
                ${value > 0 ? `<div style="font-size: 0.65rem; color: var(--text-light); margin-top: 0.25rem;">${value}m</div>` : ''}
            </div>
        `;
    }).join('');
}

// Load monthly progress
function loadMonthlyProgress(user = null) {
    const getExercisesForMonth = (exercises, monthOffset = 0) => {
        const now = new Date();
        const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 1);
        
        return exercises.filter(ex => {
            if (!ex.date) return false;
            const exDate = new Date(ex.date);
            return exDate >= targetMonth && exDate < nextMonth;
        });
    };
    
    if (user && firestore) {
        firestore.collection('exercises')
            .where('userId', '==', user.uid)
            .get()
            .then(snapshot => {
                const exercises = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                    exercises.push({
                        ...data,
                        date: createdAt.toISOString(),
                        duration: data.duration || 0
                    });
                });
                updateMonthlyProgress(exercises);
            })
            .catch(error => {
                console.error('Error loading monthly progress:', error);
                const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
                updateMonthlyProgress(exercises);
            });
    } else {
        const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
        updateMonthlyProgress(exercises);
    }
}

// Update monthly progress
function updateMonthlyProgress(exercises) {
    const now = new Date();
    
    // Current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const currentMonthDays = currentMonthEnd.getDate();
    const currentDay = now.getDate();
    
    const currentMonthExercises = exercises.filter(ex => {
        if (!ex.date) return false;
        const exDate = new Date(ex.date);
        return exDate >= currentMonthStart && exDate <= currentMonthEnd;
    });
    const currentMonthMinutes = currentMonthExercises.reduce((sum, ex) => sum + (parseInt(ex.duration) || 0), 0);
    const currentMonthTarget = 30 * currentMonthDays; // 30 minutes per day target
    const currentMonthProgress = currentMonthTarget > 0 ? Math.min((currentMonthMinutes / currentMonthTarget) * 100, 100) : 0;
    
    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthDays = lastMonthEnd.getDate();
    
    const lastMonthExercises = exercises.filter(ex => {
        if (!ex.date) return false;
        const exDate = new Date(ex.date);
        return exDate >= lastMonthStart && exDate <= lastMonthEnd;
    });
    const lastMonthMinutes = lastMonthExercises.reduce((sum, ex) => sum + (parseInt(ex.duration) || 0), 0);
    const lastMonthTarget = 30 * lastMonthDays; // 30 minutes per day target
    const lastMonthProgress = lastMonthTarget > 0 ? Math.min((lastMonthMinutes / lastMonthTarget) * 100, 100) : 0;
    
    // Update UI
    const currentMonthValueEl = document.getElementById('currentMonthProgress');
    const currentMonthBar = document.getElementById('currentMonthBar');
    const lastMonthValueEl = document.getElementById('lastMonthProgress');
    const lastMonthBar = document.getElementById('lastMonthBar');
    
    if (currentMonthValueEl) {
        currentMonthValueEl.textContent = Math.round(currentMonthProgress) + '%';
    }
    if (currentMonthBar) {
        currentMonthBar.style.width = Math.round(currentMonthProgress) + '%';
        currentMonthBar.textContent = Math.round(currentMonthProgress) + '%';
    }
    
    if (lastMonthValueEl) {
        lastMonthValueEl.textContent = Math.round(lastMonthProgress) + '%';
    }
    if (lastMonthBar) {
        lastMonthBar.style.width = Math.round(lastMonthProgress) + '%';
        lastMonthBar.textContent = Math.round(lastMonthProgress) + '%';
    }
    
    // Calculate improvement
    const improvement = currentMonthProgress - lastMonthProgress;
    const improvementText = improvement > 0 ? `+${Math.round(improvement)}%` : `${Math.round(improvement)}%`;
    
    // Update improvement alert
    const improvementAlert = document.querySelector('.alert-success');
    if (improvementAlert) {
        if (improvement > 0) {
            improvementAlert.innerHTML = `
                <i class="bi bi-arrow-up-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Peningkatan ${improvementText}!</strong>
                    <p style="margin: 0; margin-top: 0.25rem;">Anda menunjukkan kemajuan yang konsisten. Terus semangat!</p>
                </div>
            `;
        } else if (improvement < 0) {
            improvementAlert.innerHTML = `
                <i class="bi bi-arrow-down-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Perlu Peningkatan</strong>
                    <p style="margin: 0; margin-top: 0.25rem;">Coba tingkatkan konsistensi latihan Anda untuk hasil yang lebih baik.</p>
                </div>
            `;
        } else {
            improvementAlert.innerHTML = `
                <i class="bi bi-arrow-right-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Konsisten</strong>
                    <p style="margin: 0; margin-top: 0.25rem;">Pertahankan konsistensi latihan Anda!</p>
                </div>
            `;
        }
    }
}

// Load achievements
function loadAchievements(user = null) {
    const getExercises = (callback) => {
        if (user && firestore) {
            firestore.collection('exercises')
                .where('userId', '==', user.uid)
                .get()
                .then(snapshot => {
                    const exercises = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                        exercises.push({
                            ...data,
                            date: createdAt.toISOString()
                        });
                    });
                    callback(exercises);
                })
                .catch(error => {
                    console.error('Error loading achievements:', error);
                    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
                    callback(exercises);
                });
        } else {
            const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
            callback(exercises);
        }
    };
    
    getExercises((exercises) => {
        updateAchievements(exercises);
    });
}

// Update achievements based on real data
function updateAchievements(exercises) {
    // Calculate achievements
    const totalExercises = exercises.length;
    const uniqueDates = new Set(exercises.map(ex => ex.date ? ex.date.split('T')[0] : null).filter(d => d));
    const activeDays = uniqueDates.size;
    
    // Check for consecutive days
    const sortedDates = Array.from(uniqueDates).sort();
    let maxConsecutive = 0;
    let currentStreak = 1;
    
    if (sortedDates.length > 0) {
        // Convert to Date objects and sort
        const dateObjects = sortedDates.map(d => new Date(d)).sort((a, b) => a - b);
        
        for (let i = 1; i < dateObjects.length; i++) {
            const prevDate = dateObjects[i - 1];
            const currDate = dateObjects[i];
            const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Consecutive day
                currentStreak++;
            } else {
                // Not consecutive, reset streak
                maxConsecutive = Math.max(maxConsecutive, currentStreak);
                currentStreak = 1;
            }
        }
        maxConsecutive = Math.max(maxConsecutive, currentStreak);
    }
    
    // Update achievement cards
    // Pemula - First exercise completed
    const pemulaCard = document.getElementById('achievementPemula');
    if (pemulaCard) {
        if (totalExercises > 0) {
            pemulaCard.innerHTML = `
                <i class="bi bi-trophy-fill" style="font-size: 2rem; color: var(--warning-orange); margin-bottom: 0.5rem;"></i>
                <div style="font-weight: 600; color: var(--text-dark);">Pemula</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">Selesai</div>
            `;
        } else {
            pemulaCard.innerHTML = `
                <i class="bi bi-trophy" style="font-size: 2rem; color: var(--text-light); margin-bottom: 0.5rem;"></i>
                <div style="font-weight: 600; color: var(--text-dark);">Pemula</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">0/1</div>
            `;
        }
    }
    
    // 7 Hari - 7 consecutive days
    const sevenDaysCard = document.getElementById('achievement7Days');
    if (sevenDaysCard) {
        if (maxConsecutive >= 7) {
            sevenDaysCard.innerHTML = `
                <i class="bi bi-fire" style="font-size: 2rem; color: var(--danger-red); margin-bottom: 0.5rem;"></i>
                <div style="font-weight: 600; color: var(--text-dark);">7 Hari</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">Selesai</div>
            `;
        } else {
            sevenDaysCard.innerHTML = `
                <i class="bi bi-fire" style="font-size: 2rem; color: var(--text-light); margin-bottom: 0.5rem;"></i>
                <div style="font-weight: 600; color: var(--text-dark);">7 Hari</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">${maxConsecutive}/7</div>
            `;
        }
    }
    
    // 50 Latihan - 50 exercises completed
    const fiftyExercisesCard = document.getElementById('achievement50Exercises');
    if (fiftyExercisesCard) {
        if (totalExercises >= 50) {
            fiftyExercisesCard.innerHTML = `
                <i class="bi bi-star-fill" style="font-size: 2rem; color: var(--primary-blue); margin-bottom: 0.5rem;"></i>
                <div style="font-weight: 600; color: var(--text-dark);">50 Latihan</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">Selesai</div>
            `;
        } else {
            fiftyExercisesCard.innerHTML = `
                <i class="bi bi-star" style="font-size: 2rem; color: var(--text-light); margin-bottom: 0.5rem;"></i>
                <div style="font-weight: 600; color: var(--text-dark);">50 Latihan</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">${totalExercises}/50</div>
            `;
        }
    }
    
    // Konsisten - 30+ active days
    const konsistenCard = document.getElementById('achievementKonsisten');
    if (konsistenCard) {
        if (activeDays >= 30) {
            konsistenCard.innerHTML = `
                <i class="bi bi-heart-fill" style="font-size: 2rem; color: var(--danger-red); margin-bottom: 0.5rem;"></i>
                <div style="font-weight: 600; color: var(--text-dark);">Konsisten</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">Selesai</div>
            `;
        } else {
            konsistenCard.innerHTML = `
                <i class="bi bi-heart" style="font-size: 2rem; color: var(--text-light); margin-bottom: 0.5rem;"></i>
                <div style="font-weight: 600; color: var(--text-dark);">Konsisten</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">${activeDays}/30</div>
            `;
        }
    }
}

// Load exercise history
function loadExerciseHistory(user = null) {
    const historyContainer = document.getElementById('exerciseHistory');
    if (!historyContainer) return;
    
    if (user && firestore) {
        // Load from Firestore - avoid orderBy to prevent index requirement
        firestore.collection('exercises')
            .where('userId', '==', user.uid)
            .get()
            .then(snapshot => {
                const exercises = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                    exercises.push({
                        ...data,
                        date: createdAt.toISOString(),
                        duration: data.duration || 0,
                        reps: data.reps || 0
                    });
                });
                // Sort by date descending and take first 10
                exercises.sort((a, b) => new Date(b.date) - new Date(a.date));
                displayExerciseHistory(exercises.slice(0, 10));
            })
            .catch(error => {
                console.error('Error loading exercise history:', error);
                // Fallback to localStorage
                const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
                exercises.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                displayExerciseHistory(exercises.slice(0, 10));
            });
    } else {
        // Get exercises from localStorage
        const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
        exercises.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        displayExerciseHistory(exercises.slice(0, 10));
    }
}

// Display exercise history
function displayExerciseHistory(exercises) {
    const historyContainer = document.getElementById('exerciseHistory');
    if (!historyContainer) return;
    
    if (!exercises || exercises.length === 0) {
        historyContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Belum ada riwayat latihan</strong>
                    <p style="margin: 0; margin-top: 0.25rem;">Mulai latihan pertama Anda untuk melihat riwayat di sini.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    const sortedExercises = exercises.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
    });
    
    // Display last 10 exercises
    const recentExercises = sortedExercises.slice(0, 10);
    
    historyContainer.innerHTML = recentExercises.map(exercise => {
        let date;
        try {
            date = exercise.date ? new Date(exercise.date) : new Date();
        } catch (e) {
            date = new Date();
        }
        
        const dateStr = date.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const exerciseNames = {
            'lengan-kanan': 'Latihan Lengan Kanan',
            'lengan-kiri': 'Latihan Lengan Kiri',
            'peregangan': 'Latihan Peregangan',
            'koordinasi': 'Latihan Koordinasi',
            'kekuatan': 'Latihan Kekuatan'
        };
        
        const exerciseName = exerciseNames[exercise.type] || exercise.type || 'Latihan';
        const duration = exercise.duration || 0;
        const reps = exercise.reps || 0;
        
        return `
            <div class="exercise-item" style="margin-bottom: 1rem;">
                <div class="exercise-icon">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <div class="exercise-content">
                    <div class="exercise-name">${exerciseName}</div>
                    <div class="exercise-duration">
                        <i class="bi bi-clock"></i> ${duration} menit | 
                        <i class="bi bi-arrow-repeat"></i> ${reps}x repetisi
                        <br>
                        <i class="bi bi-calendar"></i> ${dateStr}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
