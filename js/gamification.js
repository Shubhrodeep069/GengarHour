// Gamification system
const GamificationManager = {
    points: 0,
    level: 1,
    pointsToNextLevel: 100,
    levelHistory: [],

    init() {
        this.loadGamificationData();
    },

    awardPoints() {
        const pointsEarned = 10;
        this.points += pointsEarned;
        this.updatePointsDisplay();
        this.checkLevelUp();
        this.updatePointsAchievements();
        this.saveGamificationData();
    },

    updatePointsDisplay() {
        const pointsElement = document.getElementById('points-count');
        if (pointsElement) {
            pointsElement.textContent = this.points;
        }
    },

    checkLevelUp() {
        if (this.points >= this.pointsToNextLevel) {
            this.levelUp();
        }
    },

    levelUp() {
        this.level++;
        this.pointsToNextLevel = Math.floor(this.pointsToNextLevel * 1.5);
        
        this.levelHistory.push({
            level: this.level,
            date: new Date().toISOString(),
            points: this.points
        });
        
        this.showLevelUpNotification();
        this.updateLevelDisplay();
        this.updateLevelAchievements();
        this.saveGamificationData();
    },

    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <h3>Level Up!</h3>
            <p>You've reached level ${this.level}!</p>
            <button onclick="this.parentElement.remove()">Continue</button>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    updateLevelDisplay() {
        const levelElement = document.getElementById('level-count');
        if (levelElement) {
            levelElement.textContent = this.level;
        }
    },

    updatePointsAchievements() {
        if (this.points >= 100 && !AchievementsManager.achievements.points100.unlocked) {
            AchievementsManager.achievements.points100.unlocked = true;
            AchievementsManager.unlockAchievement('points100', "Points Collector");
            AchievementsManager.showAchievementNotification("Points Collector");
        }
        
        const pointsProgress = Math.min(this.points / 100, 1) * 100;
        const progressBar = document.querySelector('#ach-points100 .achievement-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${pointsProgress}%`;
        }
        AchievementsManager.achievements.points100.progress = this.points;
    },

    updateLevelAchievements() {
        if (this.level >= 5 && !AchievementsManager.achievements.level5.unlocked) {
            AchievementsManager.achievements.level5.unlocked = true;
            AchievementsManager.unlockAchievement('level5', "Level 5 Reached");
            AchievementsManager.showAchievementNotification("Level 5 Reached");
        }
        
        const levelProgress = Math.min(this.level / 5, 1) * 100;
        const progressBar = document.querySelector('#ach-level5 .achievement-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${levelProgress}%`;
        }
        AchievementsManager.achievements.level5.progress = this.level;
    },

    saveGamificationData() {
        const gamificationData = {
            points: this.points,
            level: this.level,
            pointsToNextLevel: this.pointsToNextLevel,
            levelHistory: this.levelHistory
        };
        localStorage.setItem('pomodoroGamification', JSON.stringify(gamificationData));
    },

    loadGamificationData() {
        const savedData = localStorage.getItem('pomodoroGamification');
        if (savedData) {
            const gamificationData = JSON.parse(savedData);
            this.points = gamificationData.points || 0;
            this.level = gamificationData.level || 1;
            this.pointsToNextLevel = gamificationData.pointsToNextLevel || 100;
            this.levelHistory = gamificationData.levelHistory || [];
            
            this.updatePointsDisplay();
            this.updateLevelDisplay();
            this.updatePointsAchievements();
            this.updateLevelAchievements();
        }
    }
};