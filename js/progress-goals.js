// Progress Goals Module
// Set rehabilitation targets and track progress
// Inspired by Myontec rehabilitation tracking features

// Default rehabilitation goals
const DEFAULT_GOALS = {
    targetActivity: 50,       // Target average muscle activity %
    targetSessions: 5,        // Target sessions per week
    targetDuration: 300,      // Target total duration per week (seconds)
    targetMovements: 100      // Target total movements per week
};

// Load goals from Firestore
async function loadPatientGoals(userId, patientId) {
    try {
        if (!firestore || !userId || !patientId) return DEFAULT_GOALS;

        const doc = await firestore.collection('users').doc(userId)
            .collection('patients').doc(patientId)
            .collection('settings').doc('goals').get();

        if (doc.exists) {
            return { ...DEFAULT_GOALS, ...doc.data() };
        }
        return DEFAULT_GOALS;
    } catch (e) {
        console.error('Error loading goals:', e);
        return DEFAULT_GOALS;
    }
}

// Save goals to Firestore
async function savePatientGoals(userId, patientId, goals) {
    try {
        if (!firestore || !userId || !patientId) return false;

        await firestore.collection('users').doc(userId)
            .collection('patients').doc(patientId)
            .collection('settings').doc('goals').set(goals, { merge: true });

        return true;
    } catch (e) {
        console.error('Error saving goals:', e);
        return false;
    }
}

// Calculate progress from records (last 7 days)
function calculateWeeklyProgress(records, goals) {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const weekRecords = (records || []).filter(r => {
        const d = r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp);
        return d >= weekAgo;
    });

    const totalSessions = weekRecords.length;
    const avgActivity = totalSessions > 0
        ? Math.round(weekRecords.reduce((s, r) => s + (r.avgMuscleActivity || 0), 0) / totalSessions)
        : 0;
    const totalDuration = weekRecords.reduce((s, r) => s + (r.duration || 0), 0);
    const totalMovements = weekRecords.reduce((s, r) => s + (r.movementCount || 0), 0);

    return {
        activity: { current: avgActivity, target: goals.targetActivity, percent: Math.min(100, Math.round((avgActivity / goals.targetActivity) * 100)) },
        sessions: { current: totalSessions, target: goals.targetSessions, percent: Math.min(100, Math.round((totalSessions / goals.targetSessions) * 100)) },
        duration: { current: totalDuration, target: goals.targetDuration, percent: Math.min(100, Math.round((totalDuration / goals.targetDuration) * 100)) },
        movements: { current: totalMovements, target: goals.targetMovements, percent: Math.min(100, Math.round((totalMovements / goals.targetMovements) * 100)) }
    };
}

// Calculate overall progress score
function calculateOverallProgress(progress) {
    const scores = [progress.activity.percent, progress.sessions.percent, progress.duration.percent, progress.movements.percent];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// Render progress goals card
function renderProgressGoals(containerId, progress, goals, onEditCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const overall = calculateOverallProgress(progress);
    const overallColor = overall >= 80 ? '#4A8B6A' : overall >= 50 ? '#B8A85A' : '#B85A5A';

    const items = [
        { label: 'Aktivitas Otot', icon: 'bi-activity', current: progress.activity.current + '%', target: progress.activity.target + '%', percent: progress.activity.percent },
        { label: 'Sesi Minggu Ini', icon: 'bi-calendar-check', current: progress.sessions.current, target: progress.sessions.target, percent: progress.sessions.percent },
        { label: 'Total Durasi', icon: 'bi-clock', current: formatGoalDuration(progress.duration.current), target: formatGoalDuration(progress.duration.target), percent: progress.duration.percent },
        { label: 'Total Gerakan', icon: 'bi-arrow-repeat', current: progress.movements.current, target: progress.movements.target, percent: progress.movements.percent }
    ];

    container.innerHTML = `
        <!-- Overall Progress Circle -->
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="position: relative; width: 120px; height: 120px; margin: 0 auto;">
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(94, 104, 121, 0.1)" stroke-width="10"/>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="${overallColor}" stroke-width="10"
                        stroke-dasharray="${2 * Math.PI * 52}"
                        stroke-dashoffset="${2 * Math.PI * 52 * (1 - overall / 100)}"
                        stroke-linecap="round" transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 1s ease;"/>
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                    <div style="font-size: 1.75rem; font-weight: 700; color: ${overallColor};">${overall}%</div>
                    <div style="font-size: 0.7rem; color: var(--text-light);">Progress</div>
                </div>
            </div>
            <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-light);">Progress minggu ini</p>
        </div>

        <!-- Individual Goals -->
        ${items.map(item => {
            const itemColor = item.percent >= 80 ? '#4A8B6A' : item.percent >= 50 ? '#B8A85A' : '#B85A5A';
            return `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="bi ${item.icon}" style="color: ${itemColor};"></i>
                            <span style="font-size: 0.85rem; color: var(--text-dark); font-weight: 500;">${item.label}</span>
                        </div>
                        <span style="font-size: 0.85rem; font-weight: 600; color: ${itemColor};">${item.current} / ${item.target}</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: var(--neumorphism-base); border-radius: 4px; box-shadow: inset 1px 1px 3px rgba(94, 104, 121, 0.2);">
                        <div style="width: ${item.percent}%; height: 100%; background: ${itemColor}; border-radius: 4px; transition: width 0.8s ease;"></div>
                    </div>
                </div>
            `;
        }).join('')}

        <!-- Edit Goals Button -->
        <button onclick="${onEditCallback || 'openGoalsEditor()'}" class="btn btn-secondary" style="margin-top: 0.5rem; padding: 0.6rem; font-size: 0.85rem;">
            <i class="bi bi-pencil"></i> Edit Target
        </button>
    `;
}

// Render goals editor modal content
function renderGoalsEditor(goals, onSaveCallback) {
    return `
        <div style="padding: 0.5rem 0;">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-dark); font-size: 0.9rem;">
                    <i class="bi bi-activity"></i> Target Aktivitas Otot (%)
                </label>
                <input type="number" id="goalActivity" value="${goals.targetActivity}" min="1" max="100"
                    style="width: 100%; padding: 0.6rem; border: 2px solid rgba(49, 69, 106, 0.2); border-radius: var(--border-radius); font-size: 1rem; background: var(--white);">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-dark); font-size: 0.9rem;">
                    <i class="bi bi-calendar-check"></i> Target Sesi per Minggu
                </label>
                <input type="number" id="goalSessions" value="${goals.targetSessions}" min="1" max="30"
                    style="width: 100%; padding: 0.6rem; border: 2px solid rgba(49, 69, 106, 0.2); border-radius: var(--border-radius); font-size: 1rem; background: var(--white);">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-dark); font-size: 0.9rem;">
                    <i class="bi bi-clock"></i> Target Durasi per Minggu (menit)
                </label>
                <input type="number" id="goalDuration" value="${Math.round(goals.targetDuration / 60)}" min="1" max="300"
                    style="width: 100%; padding: 0.6rem; border: 2px solid rgba(49, 69, 106, 0.2); border-radius: var(--border-radius); font-size: 1rem; background: var(--white);">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-dark); font-size: 0.9rem;">
                    <i class="bi bi-arrow-repeat"></i> Target Gerakan per Minggu
                </label>
                <input type="number" id="goalMovements" value="${goals.targetMovements}" min="1" max="10000"
                    style="width: 100%; padding: 0.6rem; border: 2px solid rgba(49, 69, 106, 0.2); border-radius: var(--border-radius); font-size: 1rem; background: var(--white);">
            </div>
        </div>
    `;
}

// Get goals from editor form
function getGoalsFromEditor() {
    return {
        targetActivity: parseInt(document.getElementById('goalActivity')?.value) || DEFAULT_GOALS.targetActivity,
        targetSessions: parseInt(document.getElementById('goalSessions')?.value) || DEFAULT_GOALS.targetSessions,
        targetDuration: (parseInt(document.getElementById('goalDuration')?.value) || 5) * 60,
        targetMovements: parseInt(document.getElementById('goalMovements')?.value) || DEFAULT_GOALS.targetMovements
    };
}

// Format duration for goals display
function formatGoalDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return mins + 'm';
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return hours + 'j ' + remMins + 'm';
}
