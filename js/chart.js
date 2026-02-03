// Real-time Chart JavaScript
// Draw real-time chart for EMG and MPU data

let chartCanvas = null;
let chartContext = null;
let chartData = {
    emg: [],
    accel: []
};
const MAX_DATA_POINTS = 50; // Keep last 50 data points
let isDrawing = false;
let animationFrameId = null;

// Initialize chart
function initChart() {
    chartCanvas = document.getElementById('realtimeChart');
    if (!chartCanvas) return;
    
    chartContext = chartCanvas.getContext('2d');
    
    // Set canvas size with device pixel ratio for crisp rendering
    const rect = chartCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    chartCanvas.width = rect.width * dpr;
    chartCanvas.height = rect.height * dpr;
    chartContext.scale(dpr, dpr);
    
    // Set canvas CSS size
    chartCanvas.style.width = rect.width + 'px';
    chartCanvas.style.height = rect.height + 'px';
    
    // Start drawing loop
    startChartAnimation();
}

// Start chart animation loop
function startChartAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    function animate() {
        drawChart();
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Draw chart
function drawChart() {
    if (!chartContext || !chartCanvas || isDrawing) return;
    
    isDrawing = true;
    
    const rect = chartCanvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Clear canvas
    chartContext.clearRect(0, 0, width, height);
    
    // Draw background grid
    drawGrid(chartContext, padding, chartWidth, chartHeight);
    
    // Draw axes
    drawAxes(chartContext, padding, chartWidth, chartHeight);
    
    // Draw data lines
    if (chartData.emg.length > 1) {
        drawLine(chartContext, chartData.emg, padding, chartWidth, chartHeight, 
                'rgba(0, 212, 255, 0.8)', 'rgba(0, 212, 255, 0.2)', 0, 100);
    }
    
    if (chartData.accel.length > 1) {
        // Scale acceleration to 0-100 for better visualization (max 5g = 100%)
        const scaledAccel = chartData.accel.map(val => Math.min((val / 5) * 100, 100));
        drawLine(chartContext, scaledAccel, padding, chartWidth, chartHeight, 
                'rgba(157, 80, 255, 0.8)', 'rgba(157, 80, 255, 0.2)', 0, 100);
    }
    
    isDrawing = false;
}

// Draw grid
function drawGrid(ctx, padding, width, height) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + width, y);
        ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
        const x = padding + (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + height);
        ctx.stroke();
    }
}

// Draw axes
function drawAxes(ctx, padding, width, height) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + height);
    ctx.lineTo(padding + width, padding + height);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + height);
    ctx.stroke();
    
    // Y axis labels
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + height - (height / 5) * i;
        const value = i * 20; // 0-100 for EMG
        ctx.fillText(value.toString(), padding - 5, y + 3);
    }
}

// Draw line
function drawLine(ctx, data, padding, width, height, color, fillColor, minValue, maxValue) {
    if (data.length < 2) return;
    
    const range = maxValue - minValue;
    const stepX = width / (data.length - 1);
    
    // Draw filled area
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(padding, padding + height);
    
    for (let i = 0; i < data.length; i++) {
        const x = padding + (stepX * i);
        const normalizedValue = Math.max(0, Math.min(1, (data[i] - minValue) / range));
        const y = padding + height - (normalizedValue * height);
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(padding + width, padding + height);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
        const x = padding + (stepX * i);
        const normalizedValue = Math.max(0, Math.min(1, (data[i] - minValue) / range));
        const y = padding + height - (normalizedValue * height);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
}

// Add data point to chart
function addChartData(emgValue, accelValue) {
    // Normalize EMG value (0-100%) - EMG outputs 0-3.3V
    const emgNormalized = Math.min((emgValue / 3.3) * 100, 100);
    
    // Add to arrays
    chartData.emg.push(emgNormalized);
    chartData.accel.push(Math.abs(accelValue)); // Use absolute value for magnitude
    
    // Keep only last MAX_DATA_POINTS
    if (chartData.emg.length > MAX_DATA_POINTS) {
        chartData.emg.shift();
        chartData.accel.shift();
    }
}

// Initialize chart when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for canvas to be ready
    setTimeout(function() {
        initChart();
    }, 500);
    
    // Reinitialize on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (chartCanvas) {
                const rect = chartCanvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                chartCanvas.width = rect.width * dpr;
                chartCanvas.height = rect.height * dpr;
                chartContext.scale(dpr, dpr);
                chartCanvas.style.width = rect.width + 'px';
                chartCanvas.style.height = rect.height + 'px';
            }
        }, 250);
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
