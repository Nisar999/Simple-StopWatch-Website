// Enhanced Stopwatch with Millisecond Precision
class AdvancedStopwatch {
    constructor() {
        // DOM Elements
        this.outBox = document.getElementById("outBox");
        this.timeDisplay = document.getElementById("time");
        this.startStopBtn = document.getElementById("green");
        this.lapBtn = document.getElementById("yellow");
        this.resetBtn = document.getElementById("red");
        this.lapContainer = document.getElementById("inner");
        
        // State management
        this.isRunning = false;
        this.startTime = null;
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.updateInterval = null;
        this.currentTheme = 'light';
        
        // Simplified theme configurations
        this.themes = {
            light: {
                name: 'Light',
                colors: {
                    'color-bg-primary': '#f8fafc',
                    'color-bg-secondary': '#f1f5f9',
                    'color-success': '#10b981',
                    'color-warning': '#f59e0b',
                    'color-danger': '#ef4444',
                    'color-glass-primary': 'rgba(255, 255, 255, 0.25)',
                    'color-glass-secondary': 'rgba(255, 255, 255, 0.15)',
                    'color-glass-accent': 'rgba(255, 255, 255, 0.35)',
                    'color-text-primary': '#1e293b',
                    'color-text-secondary': 'rgba(30, 41, 59, 0.7)'
                }
            },
            dark: {
                name: 'Dark',
                colors: {
                    'color-bg-primary': '#0f172a',
                    'color-bg-secondary': '#1e293b',
                    'color-success': '#10b981',
                    'color-warning': '#f59e0b',
                    'color-danger': '#ef4444',
                    'color-glass-primary': 'rgba(255, 255, 255, 0.1)',
                    'color-glass-secondary': 'rgba(255, 255, 255, 0.05)',
                    'color-glass-accent': 'rgba(255, 255, 255, 0.15)',
                    'color-text-primary': '#f8fafc',
                    'color-text-secondary': 'rgba(248, 250, 252, 0.7)'
                }
            }
        };
        
        // Snowfall state
        this.snowfallEnabled = localStorage.getItem('stopwatch-snowfall') === 'true';
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.createThemeSelector();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateVisualState('reset');
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('stopwatch-theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        this.applyTheme(this.currentTheme);
    }
    
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
        
        this.currentTheme = themeName;
        localStorage.setItem('stopwatch-theme', themeName);
        
        // Update theme selector
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = themeName;
        }
    }
    
    createThemeSelector() {
        // Check if controls already exist
        if (document.querySelector('.top-controls')) return;
        
        const container = document.querySelector('.stopwatch-container');
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'top-controls';
        controlsContainer.innerHTML = `
            <div class="theme-controls">
                <button id="theme-toggle" class="theme-toggle" title="Toggle Theme">
                    ${this.currentTheme === 'light' ? '🌙' : '☀️'}
                </button>
                <button id="snowfall-toggle" class="snowfall-toggle ${this.snowfallEnabled ? 'active' : ''}" title="Toggle Snowfall">
                    ❄️
                </button>
            </div>
            <button id="fullscreen-btn" class="fullscreen-btn" title="Toggle Fullscreen (F)">⛶</button>
        `;
        
        // Insert at the beginning of the container
        container.insertBefore(controlsContainer, container.firstChild);
        
        // Add event listeners
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.getElementById('snowfall-toggle').addEventListener('click', () => {
            this.toggleSnowfall();
        });
        
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Initialize snowfall if enabled
        if (this.snowfallEnabled) {
            this.createSnowfall();
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        
        // Update button icon
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
    
    toggleSnowfall() {
        this.snowfallEnabled = !this.snowfallEnabled;
        localStorage.setItem('stopwatch-snowfall', this.snowfallEnabled.toString());
        
        const snowfallToggle = document.getElementById('snowfall-toggle');
        snowfallToggle.classList.toggle('active', this.snowfallEnabled);
        
        if (this.snowfallEnabled) {
            this.createSnowfall();
        } else {
            this.removeSnowfall();
        }
    }
    
    createSnowfall() {
        // Remove existing snowfall
        this.removeSnowfall();
        
        const snowContainer = document.createElement('div');
        snowContainer.className = 'snowfall-container';
        document.body.appendChild(snowContainer);
        
        // Create snowflakes
        for (let i = 0; i < 50; i++) {
            this.createSnowflake(snowContainer);
        }
    }
    
    createSnowflake(container) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        
        // Random properties
        const size = Math.random() * 0.8 + 0.5; // 0.5 to 1.3
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2; // 2 to 5 seconds
        const opacity = Math.random() * 0.6 + 0.4; // 0.4 to 1
        
        snowflake.style.cssText = `
            left: ${left}%;
            font-size: ${size}rem;
            animation-duration: ${animationDuration}s;
            opacity: ${opacity};
        `;
        
        container.appendChild(snowflake);
        
        // Remove snowflake after animation
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
                // Create new snowflake if snowfall is still enabled
                if (this.snowfallEnabled) {
                    this.createSnowflake(container);
                }
            }
        }, animationDuration * 1000);
    }
    
    removeSnowfall() {
        const existing = document.querySelector('.snowfall-container');
        if (existing) {
            existing.remove();
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                document.body.classList.add('fullscreen-mode');
            }).catch(err => {
                console.log('Fullscreen not supported or denied');
                // Fallback to CSS-only fullscreen
                document.body.classList.add('pseudo-fullscreen');
            });
        } else {
            document.exitFullscreen().then(() => {
                document.body.classList.remove('fullscreen-mode');
            });
        }
    }
    
    setupEventListeners() {
        this.startStopBtn.addEventListener('click', () => this.toggleTimer());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'Space':
                    event.preventDefault();
                    this.toggleTimer();
                    break;
                case 'KeyL':
                    if (!this.lapBtn.disabled) {
                        this.recordLap();
                    }
                    break;
                case 'KeyR':
                    this.reset();
                    break;
                case 'KeyF':
                    event.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (document.body.classList.contains('pseudo-fullscreen')) {
                        document.body.classList.remove('pseudo-fullscreen');
                    }
                    break;
            }
        });
        
        // Handle fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                document.body.classList.remove('fullscreen-mode');
            }
        });
    }
    
    toggleTimer() {
        this.addButtonPressAnimation(this.startStopBtn);
        
        if (!this.isRunning) {
            this.start();
        } else {
            this.stop();
        }
    }
    
    start() {
        this.isRunning = true;
        this.startTime = performance.now() - this.elapsedTime;
        this.lapBtn.disabled = false;
        this.updateVisualState('running');
        
        // Update every 10ms for smooth display
        this.updateInterval = setInterval(() => {
            this.elapsedTime = performance.now() - this.startTime;
            this.updateDisplay();
        }, 10);
    }
    
    stop() {
        this.isRunning = false;
        this.updateVisualState('stopped');
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    reset() {
        this.addButtonPressAnimation(this.resetBtn);
        
        this.stop();
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.lapBtn.disabled = true;
        this.updateDisplay();
        this.updateLapDisplay();
        this.updateVisualState('reset');
    }
    
    recordLap() {
        if (!this.isRunning) return;
        
        this.addButtonPressAnimation(this.lapBtn);
        
        const lapTime = this.elapsedTime;
        const lapNumber = this.lapTimes.length + 1;
        
        this.lapTimes.push({
            number: lapNumber,
            time: lapTime,
            formattedTime: this.formatTime(lapTime)
        });
        
        this.updateLapDisplay();
        this.showLapFeedback();
    }
    
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const ms = Math.floor(milliseconds % 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');
        const msFormatted = ms.toString().padStart(3, '0');
        
        return `${h}:${m}:${s}.${msFormatted}`;
    }
    
    updateDisplay() {
        const formattedTime = this.formatTime(this.elapsedTime);
        
        // Only update if time has changed to prevent unnecessary DOM updates
        if (this.timeDisplay.textContent !== formattedTime) {
            this.timeDisplay.textContent = formattedTime;
        }
    }
    
    updateLapDisplay() {
        // Clear existing laps
        this.lapContainer.innerHTML = '';
        
        if (this.lapTimes.length === 0) {
            this.lapContainer.innerHTML = 'LAPS';
            return;
        }
        
        // Calculate lap intervals (time between laps)
        const lapIntervals = this.lapTimes.map((lap, index) => {
            const previousTime = index > 0 ? this.lapTimes[index - 1].time : 0;
            return {
                ...lap,
                interval: lap.time - previousTime,
                formattedInterval: this.formatTime(lap.time - previousTime)
            };
        });
        
        // Find fastest and slowest lap intervals (excluding first lap)
        if (lapIntervals.length > 1) {
            const intervals = lapIntervals.slice(1); // Skip first lap
            const fastestInterval = Math.min(...intervals.map(lap => lap.interval));
            const slowestInterval = Math.max(...intervals.map(lap => lap.interval));
            
            lapIntervals.forEach(lap => {
                if (lap.interval === fastestInterval && lapIntervals.length > 1) {
                    lap.isFastest = true;
                }
                if (lap.interval === slowestInterval && lapIntervals.length > 1) {
                    lap.isSlowest = true;
                }
            });
        }
        
        // Add each lap with proper styling and animation
        lapIntervals.forEach((lap, index) => {
            const lapEntry = document.createElement('div');
            lapEntry.className = 'lap-entry';
            
            // Add fastest/slowest classes
            if (lap.isFastest) lapEntry.classList.add('fastest');
            if (lap.isSlowest) lapEntry.classList.add('slowest');
            
            // Create lap content with both interval and total time
            lapEntry.innerHTML = `
                <div class="lap-info">
                    <span class="lap-number">Lap ${lap.number}</span>
                    <span class="lap-badges">
                        ${lap.isFastest ? '<span class="badge fastest-badge">⚡ Fastest</span>' : ''}
                        ${lap.isSlowest ? '<span class="badge slowest-badge">🐌 Slowest</span>' : ''}
                    </span>
                </div>
                <div class="lap-times">
                    <span class="lap-interval">${lap.formattedInterval}</span>
                    <span class="lap-total">${lap.formattedTime}</span>
                </div>
                <button class="lap-delete" onclick="stopwatch.deleteLap(${index})" title="Delete lap">×</button>
            `;
            
            // Add with animation delay for smooth appearance
            lapEntry.style.animationDelay = `${index * 50}ms`;
            
            this.lapContainer.appendChild(lapEntry);
        });
        
        // Add export button if there are laps
        if (this.lapTimes.length > 0) {
            const exportContainer = document.createElement('div');
            exportContainer.className = 'lap-export-controls';
            exportContainer.innerHTML = `
                <button class="export-btn" onclick="stopwatch.exportLaps('csv')">Export CSV</button>
                <button class="export-btn" onclick="stopwatch.exportLaps('json')">Export JSON</button>
                <button class="clear-btn" onclick="stopwatch.clearAllLaps()">Clear All</button>
            `;
            this.lapContainer.appendChild(exportContainer);
        }
        
        // Scroll to show latest lap
        this.lapContainer.scrollTop = this.lapContainer.scrollHeight;
    }
    
    deleteLap(index) {
        if (confirm('Delete this lap?')) {
            this.lapTimes.splice(index, 1);
            // Renumber remaining laps
            this.lapTimes.forEach((lap, i) => {
                lap.number = i + 1;
            });
            this.updateLapDisplay();
        }
    }
    
    clearAllLaps() {
        if (confirm('Clear all lap times?')) {
            this.lapTimes = [];
            this.updateLapDisplay();
        }
    }
    
    exportLaps(format) {
        if (this.lapTimes.length === 0) {
            alert('No lap times to export');
            return;
        }
        
        let content, filename, mimeType;
        
        if (format === 'csv') {
            content = this.generateCSV();
            filename = `stopwatch-laps-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
        } else if (format === 'json') {
            content = this.generateJSON();
            filename = `stopwatch-session-${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
        }
        
        this.downloadFile(content, filename, mimeType);
    }
    
    generateCSV() {
        const headers = ['Lap', 'Lap Time', 'Total Time', 'Timestamp'];
        const rows = this.lapTimes.map(lap => [
            lap.number,
            lap.formattedTime,
            lap.formattedTime,
            new Date().toISOString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    generateJSON() {
        return JSON.stringify({
            session: {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                totalTime: this.elapsedTime,
                mode: 'stopwatch'
            },
            laps: this.lapTimes,
            metadata: {
                precision: 'milliseconds',
                exportedAt: new Date().toISOString()
            }
        }, null, 2);
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    showLapFeedback() {
        // Visual feedback for lap recording
        this.outBox.style.background = 'rgba(255, 179, 71, 0.3)';
        this.lapBtn.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            this.outBox.style.background = '';
            this.lapBtn.style.transform = '';
        }, 300);
    }
    
    updateVisualState(state) {
        // Remove all state classes
        this.outBox.classList.remove('running', 'stopped');
        this.startStopBtn.classList.remove('start-state', 'stop-state');
        this.timeDisplay.classList.remove('running', 'stopped', 'reset');
        
        if (state === 'running') {
            this.outBox.classList.add('running');
            this.startStopBtn.classList.add('stop-state');
            this.timeDisplay.classList.add('running');
            this.startStopBtn.innerHTML = "STOP";
        } else if (state === 'stopped') {
            this.outBox.classList.add('stopped');
            this.startStopBtn.classList.add('start-state');
            this.timeDisplay.classList.add('stopped');
            this.startStopBtn.innerHTML = "START";
        } else if (state === 'reset') {
            this.outBox.classList.add('stopped');
            this.startStopBtn.classList.add('start-state');
            this.timeDisplay.classList.add('reset');
            this.startStopBtn.innerHTML = "START";
        }
    }
    
    addButtonPressAnimation(button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 300);
    }
}

// Initialize the advanced stopwatch
const stopwatch = new AdvancedStopwatch();