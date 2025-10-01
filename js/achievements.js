// Achievements management
const AchievementsManager = {
    achievements: {
        first: { unlocked: false, progress: 0, target: 1 },
        daily: { unlocked: false, progress: 0, target: 4 },
        consistency: { unlocked: false, progress: 0, target: 7 },
        marathon: { unlocked: false, progress: 0, target: 50 },
        level5: { unlocked: false, progress: 0, target: 5 },
        points100: { unlocked: false, progress: 0, target: 100 }
    },

    init() {
        this.loadAchievements();
    },

    updateAchievements() {
        const stats = StatsManager.getStats();
        let unlockedAchievement = null;

        // First session achievement
        if (!this.achievements.first.unlocked) {
            this.achievements.first.progress = Math.min(this.achievements.first.progress + 1, this.achievements.first.target);
            if (this.achievements.first.progress >= this.achievements.first.target) {
                this.achievements.first.unlocked = true;
                this.unlockAchievement('first', "First Step");
                unlockedAchievement = "First Step";
            }
            this.updateProgressBar('first');
        }

        // Daily goal achievement
        if (!this.achievements.daily.unlocked) {
            this.achievements.daily.progress = stats.today;
            if (this.achievements.daily.progress >= this.achievements.daily.target) {
                this.achievements.daily.unlocked = true;
                this.unlockAchievement('daily', "Daily Goal");
                unlockedAchievement = "Daily Goal";
            }
            this.updateProgressBar('daily');
        }

        // Consistency achievement
        if (!this.achievements.consistency.unlocked) {
            this.achievements.consistency.progress = stats.streak;
            if (this.achievements.consistency.progress >= this.achievements.consistency.target) {
                this.achievements.consistency.unlocked = true;
                this.unlockAchievement('consistency', "Consistency");
                unlockedAchievement = "Consistency";
            }
            this.updateProgressBar('consistency');
        }

        // Marathon achievement
        if (!this.achievements.marathon.unlocked) {
            this.achievements.marathon.progress = stats.total;
            if (this.achievements.marathon.progress >= this.achievements.marathon.target) {
                this.achievements.marathon.unlocked = true;
                this.unlockAchievement('marathon', "Marathon");
                unlockedAchievement = "Marathon";
            }
            this.updateProgressBar('marathon');
        }

        if (unlockedAchievement) {
            this.showAchievementNotification(unlockedAchievement);
        }

        this.saveAchievements();
    },

    unlockAchievement(achievementId, achievementName) {
        const element = document.getElementById(`ach-${achievementId}`);
        if (element) {
            element.classList.remove('locked');
            element.classList.add('unlocked');
        }
    },

    updateProgressBar(achievementId) {
        const achievement = this.achievements[achievementId];
        const progressBar = document.querySelector(`#ach-${achievementId} .achievement-progress-bar`);
        if (progressBar) {
            progressBar.style.width = `${(achievement.progress / achievement.target) * 100}%`;
        }
    },

    showAchievementNotification(achievementName) {
        const notification = document.getElementById('achievement-notification');
        if (notification) {
            notification.textContent = `Achievement Unlocked: ${achievementName}!`;
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    },

    saveAchievements() {
        localStorage.setItem('pomodoroAchievements', JSON.stringify(this.achievements));
    },

    loadAchievements() {
        const storedAchievements = localStorage.getItem('pomodoroAchievements');
        if (storedAchievements) {
            const parsedAchievements = JSON.parse(storedAchievements);
            this.achievements = {...this.achievements, ...parsedAchievements};

            // Update UI for all achievements
            Object.keys(this.achievements).forEach(achievementId => {
                if (this.achievements[achievementId].unlocked) {
                    this.unlockAchievement(achievementId, "");
                }
                this.updateProgressBar(achievementId);
            });
        }
    }
};