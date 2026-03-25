// Fatigue Monitoring Module
// Tracks muscle fatigue based on EMG signal analysis
// Inspired by Myontec fatigue monitoring features

// Fatigue calculation settings
const FATIGUE_WINDOW_SIZE = 20; // Number of readings for moving average
const FATIGUE_BASELINE_SAMPLES = 10; // First N samples used as baseline

// Fatigue tracker state
let fatigueState = {
    readings: [],          // All EMG readings during session
    baselineAvg: null,     // Average of first N readings (baseline)
    currentFatigue: 0,     // Current fatigue index (0-100%)
    fatigueHistory: [],    // History of fatigue values for chart
    onsetDetected: false,  // Whether fatigue onset has been detected
    onsetTime: null,       // When fatigue onset was detected
    peakFatigue: 0         // Maximum fatigue level reached
};

// Reset fatigue tracker
function resetFatigueTracker() {
    fatigueState = {
        readings: [],
        baselineAvg: null,
        currentFatigue: 0,
        fatigueHistory: [],
        onsetDetected: false,
        onsetTime: null,
        peakFatigue: 0
    };
}

// Update fatigue with new EMG reading (called during recording)
function updateFatigue(emgPercent) {
    fatigueState.readings.push(emgPercent);

    // Calculate baseline from first N samples
    if (fatigueState.readings.length === FATIGUE_BASELINE_SAMPLES) {
        const sum = fatigueState.readings.reduce((a, b) => a + b, 0);
        fatigueState.baselineAvg = sum / FATIGUE_BASELINE_SAMPLES;
    }

    // Need enough readings for meaningful analysis
    if (fatigueState.readings.length < FATIGUE_BASELINE_SAMPLES) {
        return fatigueState.currentFatigue;
    }

    // Calculate moving average of recent readings
    const recentReadings = fatigueState.readings.slice(-FATIGUE_WINDOW_SIZE);
    const recentAvg = recentReadings.reduce((a, b) => a + b, 0) / recentReadings.length;

    // Fatigue index: how much has average EMG decreased from baseline
    // In EMG fatigue analysis, a decrease in median frequency or amplitude variability indicates fatigue
    // For simplicity, we track the coefficient of variation and amplitude trend

    if (fatigueState.baselineAvg > 0) {
        // Calculate variability (coefficient of variation) - increased CV = more fatigue
        const variance = recentReadings.reduce((sum, val) => sum + Math.pow(val - recentAvg, 2), 0) / recentReadings.length;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / Math.max(recentAvg, 1)) * 100;

        // Calculate amplitude decline factor
        const amplitudeRatio = recentAvg / fatigueState.baselineAvg;

        // Fatigue index combines variability increase and amplitude changes
        // Higher CV and lower amplitude = more fatigue
        let fatigueIndex;
        if (amplitudeRatio < 0.5) {
            // Significant decline - high fatigue
            fatigueIndex = Math.min(70 + cv * 0.5, 100);
        } else if (amplitudeRatio < 0.8) {
            // Moderate decline
            fatigueIndex = Math.min(40 + cv * 0.5, 85);
        } else {
            // Normal or slight decline
            fatigueIndex = Math.min(cv * 0.8, 60);
        }

        fatigueState.currentFatigue = Math.round(Math.max(0, Math.min(100, fatigueIndex)));
    }

    // Track fatigue history
    fatigueState.fatigueHistory.push(fatigueState.currentFatigue);

    // Update peak fatigue
    if (fatigueState.currentFatigue > fatigueState.peakFatigue) {
        fatigueState.peakFatigue = fatigueState.currentFatigue;
    }

    // Detect fatigue onset (when fatigue exceeds 40%)
    if (!fatigueState.onsetDetected && fatigueState.currentFatigue >= 40) {
        fatigueState.onsetDetected = true;
        fatigueState.onsetTime = Date.now();
    }

    return fatigueState.currentFatigue;
}

// Get fatigue level label
function getFatigueLabel(fatigueIndex) {
    if (fatigueIndex < 20) return { label: 'Segar', color: '#4A8B6A', icon: 'bi-battery-full' };
    if (fatigueIndex < 40) return { label: 'Normal', color: '#5A8B8A', icon: 'bi-battery-half' };
    if (fatigueIndex < 60) return { label: 'Mulai Lelah', color: '#B8A85A', icon: 'bi-battery-half' };
    if (fatigueIndex < 80) return { label: 'Lelah', color: '#B87A5A', icon: 'bi-battery-low' };
    return { label: 'Sangat Lelah', color: '#B85A5A', icon: 'bi-battery' };
}

// Get current fatigue state
function getFatigueState() {
    return { ...fatigueState };
}

// Render fatigue indicator (real-time on sensors page)
function renderFatigueIndicator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const fatigue = fatigueState.currentFatigue;
    const info = getFatigueLabel(fatigue);

    container.innerHTML = `
        <div style="padding: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="bi ${info.icon}" style="font-size: 1.3rem; color: ${info.color};"></i>
                    <span style="font-weight: 600; color: ${info.color};">${info.label}</span>
                </div>
                <span style="font-size: 1.5rem; font-weight: 700; color: ${info.color};">${fatigue}%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--neumorphism-base); border-radius: 5px; box-shadow: inset 1px 1px 3px rgba(94, 104, 121, 0.2); overflow: hidden;">
                <div style="width: ${fatigue}%; height: 100%; background: ${info.color}; border-radius: 5px; transition: width 0.5s ease;"></div>
            </div>
            ${fatigueState.onsetDetected ? `
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-light); display: flex; align-items: center; gap: 0.25rem;">
                    <i class="bi bi-exclamation-triangle" style="color: ${info.color};"></i>
                    Onset kelelahan terdeteksi
                </div>
            ` : ''}
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-light);">
                Puncak: ${fatigueState.peakFatigue}% | Sampel: ${fatigueState.readings.length}
            </div>
        </div>
    `;
}

// Analyze fatigue from historical recorded data (for patient-detail)
function analyzeFatigueFromRecordedData(recordedData) {
    if (!recordedData || recordedData.length < FATIGUE_BASELINE_SAMPLES) {
        return { avgFatigue: 0, peakFatigue: 0, onsetSample: null, fatigueProgression: [] };
    }

    // Reset and run through data
    const tempReadings = [];
    const tempHistory = [];
    let tempBaseline = null;
    let tempPeak = 0;
    let tempOnset = null;

    recordedData.forEach((dp, index) => {
        const voltage = parseFloat(dp.emg_voltage) || 0;
        const percent = Math.min((voltage / 3.3) * 100, 100);
        tempReadings.push(percent);

        if (tempReadings.length === FATIGUE_BASELINE_SAMPLES) {
            tempBaseline = tempReadings.reduce((a, b) => a + b, 0) / FATIGUE_BASELINE_SAMPLES;
        }

        if (tempReadings.length >= FATIGUE_BASELINE_SAMPLES && tempBaseline > 0) {
            const recent = tempReadings.slice(-FATIGUE_WINDOW_SIZE);
            const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((sum, val) => sum + Math.pow(val - recentAvg, 2), 0) / recent.length;
            const stdDev = Math.sqrt(variance);
            const cv = (stdDev / Math.max(recentAvg, 1)) * 100;
            const amplitudeRatio = recentAvg / tempBaseline;

            let fi;
            if (amplitudeRatio < 0.5) fi = Math.min(70 + cv * 0.5, 100);
            else if (amplitudeRatio < 0.8) fi = Math.min(40 + cv * 0.5, 85);
            else fi = Math.min(cv * 0.8, 60);

            fi = Math.round(Math.max(0, Math.min(100, fi)));
            tempHistory.push(fi);
            if (fi > tempPeak) tempPeak = fi;
            if (tempOnset === null && fi >= 40) tempOnset = index;
        } else {
            tempHistory.push(0);
        }
    });

    const avgFatigue = tempHistory.length > 0
        ? Math.round(tempHistory.reduce((a, b) => a + b, 0) / tempHistory.length)
        : 0;

    return {
        avgFatigue,
        peakFatigue: tempPeak,
        onsetSample: tempOnset,
        fatigueProgression: tempHistory
    };
}

// Analyze fatigue trend across multiple records
function analyzeFatigueTrend(records) {
    return records.map(record => {
        const analysis = analyzeFatigueFromRecordedData(record.recordedData || []);
        return {
            timestamp: record.timestamp,
            avgFatigue: analysis.avgFatigue,
            peakFatigue: analysis.peakFatigue,
            hadOnset: analysis.onsetSample !== null
        };
    });
}
