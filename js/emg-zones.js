// EMG Training Zones Module
// Categorizes EMG activity into training zones like Myontec app

// Zone definitions for stroke rehabilitation
const EMG_ZONES = [
    { name: 'Rest', nameId: 'Istirahat', min: 0, max: 10, color: '#7A8BA8', bgColor: 'rgba(122, 139, 168, 0.15)', icon: 'bi-moon' },
    { name: 'Light', nameId: 'Ringan', min: 10, max: 25, color: '#4A8B6A', bgColor: 'rgba(74, 139, 106, 0.15)', icon: 'bi-brightness-low' },
    { name: 'Moderate', nameId: 'Sedang', min: 25, max: 50, color: '#B8A85A', bgColor: 'rgba(184, 168, 90, 0.15)', icon: 'bi-brightness-high' },
    { name: 'High', nameId: 'Tinggi', min: 50, max: 75, color: '#B87A5A', bgColor: 'rgba(184, 122, 90, 0.15)', icon: 'bi-fire' },
    { name: 'Maximum', nameId: 'Maksimal', min: 75, max: 100, color: '#B85A5A', bgColor: 'rgba(184, 90, 90, 0.15)', icon: 'bi-lightning' }
];

// Get display name for zone based on current language
function getZoneDisplayName(zone) {
    if (typeof getLang === 'function' && getLang() === 'id') return zone.nameId;
    return zone.name;
}

// Get current zone based on EMG intensity percentage
function getCurrentZone(emgPercent) {
    for (const zone of EMG_ZONES) {
        if (emgPercent >= zone.min && emgPercent < zone.max) {
            return zone;
        }
    }
    return EMG_ZONES[EMG_ZONES.length - 1]; // Max zone for 100%
}

// Time-in-zone tracker for recording sessions
let zoneTimeTracker = {
    'Rest': 0,
    'Light': 0,
    'Moderate': 0,
    'High': 0,
    'Maximum': 0
};
let lastZoneUpdateTime = null;

// Reset zone tracker
function resetZoneTracker() {
    for (const key in zoneTimeTracker) {
        zoneTimeTracker[key] = 0;
    }
    lastZoneUpdateTime = null;
}

// Update zone time (called with each sensor reading during recording)
function updateZoneTime(emgPercent) {
    const now = Date.now();
    if (lastZoneUpdateTime !== null) {
        const elapsed = (now - lastZoneUpdateTime) / 1000; // seconds
        const zone = getCurrentZone(emgPercent);
        const key = zone.name; // Use English name as key
        if (zoneTimeTracker[key] !== undefined) {
            zoneTimeTracker[key] += elapsed;
        }
    }
    lastZoneUpdateTime = now;
}

// Get zone time distribution as percentages
function getZoneDistribution() {
    const total = Object.values(zoneTimeTracker).reduce((a, b) => a + b, 0);
    if (total === 0) return EMG_ZONES.map(z => ({ ...z, percent: 0, time: 0 }));

    return EMG_ZONES.map(zone => ({
        ...zone,
        percent: Math.round((zoneTimeTracker[zone.name] / total) * 100),
        time: Math.round(zoneTimeTracker[zone.name])
    }));
}

// Analyze zones from historical recorded data (for patient-detail page)
function analyzeZonesFromRecordedData(recordedData) {
    const zoneCounts = {
        'Rest': 0,
        'Light': 0,
        'Moderate': 0,
        'High': 0,
        'Maximum': 0
    };

    if (!recordedData || recordedData.length === 0) return [];

    recordedData.forEach(dataPoint => {
        const voltage = parseFloat(dataPoint.emg_voltage) || 0;
        const percent = Math.min((voltage / 3.3) * 100, 100);
        const zone = getCurrentZone(percent);
        zoneCounts[zone.name]++;
    });

    const total = recordedData.length;
    return EMG_ZONES.map(zone => ({
        ...zone,
        percent: total > 0 ? Math.round((zoneCounts[zone.name] / total) * 100) : 0,
        count: zoneCounts[zone.name]
    }));
}

// Analyze zones across multiple records (for patient overview)
function analyzeZonesFromRecords(records) {
    const allData = [];
    records.forEach(record => {
        if (record.recordedData && record.recordedData.length > 0) {
            allData.push(...record.recordedData);
        }
    });
    return analyzeZonesFromRecordedData(allData);
}

// Render zone indicator UI (for sensors page - real-time)
function renderZoneIndicator(containerId, emgPercent) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const zone = getCurrentZone(emgPercent);

    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: ${zone.bgColor}; border-radius: var(--border-radius); transition: all 0.3s ease;">
            <i class="bi ${zone.icon}" style="font-size: 1.5rem; color: ${zone.color};"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: ${zone.color}; font-size: 1.1rem;">${getZoneDisplayName(zone)}</div>
                <div style="font-size: 0.8rem; color: var(--text-light);">${zone.min}% - ${zone.max}% EMG</div>
            </div>
            <div style="font-size: 1.5rem; font-weight: 700; color: ${zone.color};">${Math.round(emgPercent)}%</div>
        </div>
    `;
}

// Render zone distribution bars (for recording summary or patient-detail)
function renderZoneDistribution(containerId, zoneData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!zoneData || zoneData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 1rem;">' + (typeof t === 'function' ? (typeof getLang === 'function' && getLang() === 'id' ? 'Belum ada data zona.' : 'No zone data yet.') : 'No zone data yet.') + '</p>';
        return;
    }

    container.innerHTML = zoneData.map(zone => `
        <div style="margin-bottom: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="bi ${zone.icon}" style="color: ${zone.color};"></i>
                    <span style="font-weight: 500; color: var(--text-dark); font-size: 0.9rem;">${getZoneDisplayName(zone)}</span>
                </div>
                <span style="font-weight: 600; color: ${zone.color}; font-size: 0.9rem;">${zone.percent}%${zone.time !== undefined ? ' (' + formatZoneTime(zone.time) + ')' : ''}</span>
            </div>
            <div style="width: 100%; height: 8px; background: var(--neumorphism-base); border-radius: 4px; box-shadow: inset 1px 1px 3px rgba(94, 104, 121, 0.2);">
                <div style="width: ${zone.percent}%; height: 100%; background: ${zone.color}; border-radius: 4px; transition: width 0.5s ease;"></div>
            </div>
        </div>
    `).join('');
}

// Format seconds to readable time
function formatZoneTime(seconds) {
    if (seconds < 60) return seconds + 's';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + 'm ' + secs + 's';
}
