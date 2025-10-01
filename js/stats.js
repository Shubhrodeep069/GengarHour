// Statistics management
const StatsManager = {
    stats: {
        today: 0,
        week: 0,
        total: 0,
        focusTime: 0, // in minutes
        lastDate: null,
        streak: 0,
        lastStreakDate: null,
        weekStart: Utils.getWeekStartDate()
    },

    init() {
        this.loadStats();
    },

    updateStats(pomodoroDuration) {
        const today = new Date().toDateString();
        const now = new Date();
        
        // Check if it's a new day
        if (this.stats.lastDate !== today) {
            this.stats.today = 0;
            this.stats.lastDate = today;
            this.updateStreak(now);
        }
        
        // Check if it's a new week
        const weekStart = Utils.getWeekStartDate();
        if (this.stats.weekStart !== weekStart) {
            this.stats.week = 0;
            this.stats.weekStart = weekStart;
        }

        this.stats.today++;
        this.stats.week++;
        this.stats.total++;
        this.stats.focusTime += pomodoroDuration;

        this.updateStatsDisplay();
        this.saveStats();
    },

    updateStreak(now) {
        if (!this.stats.lastStreakDate) {
            this.stats.streak = 1;
        } else {
            const lastDate = new Date(this.stats.lastStreakDate);
            const diffTime = Math.abs(now - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                this.stats.streak++;
            } else if (diffDays > 1) {
                this.stats.streak = 1;
            }
        }
        this.stats.lastStreakDate = now.toDateString();
    },

    updateStatsDisplay() {
        document.getElementById('stat-today').textContent = this.stats.today;
        document.getElementById('stat-week').textContent = this.stats.week;
        document.getElementById('stat-total').textContent = this.stats.total;
        const hours = Math.floor(this.stats.focusTime / 60);
        const minutes = this.stats.focusTime % 60;
        document.getElementById('stat-focus').textContent = `${hours}h ${minutes}m`;
    },

    saveStats() {
        localStorage.setItem('pomodoroStats', JSON.stringify(this.stats));
    },

    loadStats() {
        const storedStats = localStorage.getItem('pomodoroStats');
        if (storedStats) {
            const parsedStats = JSON.parse(storedStats);
            this.stats = {...this.stats, ...parsedStats};
            
            const today = new Date().toDateString();
            if (this.stats.lastDate !== today) {
                this.stats.today = 0;
            }
            
            const weekStart = Utils.getWeekStartDate();
            if (this.stats.weekStart !== weekStart) {
                this.stats.week = 0;
                this.stats.weekStart = weekStart;
            }
            
            this.updateStatsDisplay();
        }
    },

    getStats() {
        return this.stats;
    }
};