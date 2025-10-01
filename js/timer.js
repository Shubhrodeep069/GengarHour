// Timer functionality
const TimerManager = {
    timer: null,
    timeLeft: 0,
    currentMode: 'pomodoro',
    isRunning: false,
    sessionsCompleted: 0,
    totalTime: 0,

    // Time settings in seconds
    pomodoroTime: 25 * 60,
    shortBreakTime: 5 * 60,
    longBreakTime: 15 * 60,

    init() {
        this.setupEventListeners();
        this.initTimer();
    },

    setupEventListeners() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        const modeBtns = document.querySelectorAll('.mode-btn');
        const pomodoroTimeInput = document.getElementById('pomodoro-time');
        const shortBreakTimeInput = document.getElementById('short-break-time');
        const longBreakTimeInput = document.getElementById('long-break-time');

        if (startBtn) startBtn.addEventListener('click', () => this.startTimer());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseTimer());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetTimer());

        if (modeBtns) {
            modeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.switchMode(btn.dataset.mode);
                });
            });
        }

        if (pomodoroTimeInput) {
            pomodoroTimeInput.addEventListener('change', () => {
                this.updateTimeInputs();
                if (this.currentMode === 'pomodoro') {
                    this.initTimer();
                }
            });
        }

        if (shortBreakTimeInput) {
            shortBreakTimeInput.addEventListener('change', () => {
                this.updateTimeInputs();
                if (this.currentMode === 'short-break') {
                    this.initTimer();
                }
            });
        }

        if (longBreakTimeInput) {
            longBreakTimeInput.addEventListener('change', () => {
                this.updateTimeInputs();
                if (this.currentMode === 'long-break') {
                    this.initTimer();
                }
            });
        }
    },

    initTimer() {
        clearInterval(this.timer);
        this.updateTimeInputs();

        switch (this.currentMode) {
            case 'pomodoro':
                this.totalTime = this.pomodoroTime;
                break;
            case 'short-break':
                this.totalTime = this.shortBreakTime;
                break;
            case 'long-break':
                this.totalTime = this.longBreakTime;
                break;
        }

        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.updateProgressBar();
    },

    updateTimeInputs() {
        const pomodoroInput = document.getElementById('pomodoro-time');
        const shortBreakInput = document.getElementById('short-break-time');
        const longBreakInput = document.getElementById('long-break-time');

        if (pomodoroInput) this.pomodoroTime = parseInt(pomodoroInput.value) * 60;
        if (shortBreakInput) this.shortBreakTime = parseInt(shortBreakInput.value) * 60;
        if (longBreakInput) this.longBreakTime = parseInt(longBreakInput.value) * 60;
    },

    updateDisplay() {
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) {
            timerDisplay.textContent = Utils.formatTime(this.timeLeft);
            
            if (this.isRunning) {
                timerDisplay.classList.add('pulse');
            } else {
                timerDisplay.classList.remove('pulse');
            }
        }
    },

    updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const percentage = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', Math.round(percentage));
        }
    },

    switchMode(mode) {
        this.currentMode = mode;
        const modeBtns = document.querySelectorAll('.mode-btn');
        
        if (modeBtns) {
            modeBtns.forEach(btn => {
                const isActive = btn.dataset.mode === mode;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);
            });
        }

        this.initTimer();
    },

    startTimer() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.timer = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft < 0) {
                clearInterval(this.timer);
                this.handleTimerComplete();
            } else {
                this.updateDisplay();
                this.updateProgressBar();
            }
        }, 1000);
    },

    handleTimerComplete() {
        if (this.currentMode === 'pomodoro') {
            this.sessionsCompleted++;
            const sessionCount = document.getElementById('session-count');
            if (sessionCount) {
                sessionCount.textContent = this.sessionsCompleted;
            }
            
            // Update stats and achievements
            const pomodoroInput = document.getElementById('pomodoro-time');
            const pomodoroDuration = pomodoroInput ? parseInt(pomodoroInput.value) : 25;
            
            StatsManager.updateStats(pomodoroDuration);
            AchievementsManager.updateAchievements();
            GamificationManager.awardPoints();
            
            // After 4 sessions, take a long break
            if (this.sessionsCompleted % 4 === 0) {
                this.switchMode('long-break');
            } else {
                this.switchMode('short-break');
            }
        } else {
            this.switchMode('pomodoro');
        }
        
        Utils.playNotificationSound();
        this.startTimer();
    },

    pauseTimer() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.updateDisplay();
    },

    resetTimer() {
        this.pauseTimer();
        this.initTimer();
    }
};