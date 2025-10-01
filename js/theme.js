// Theme and color management
const ThemeManager = {
    customColors: {
        primary: '#764ba2',
        secondary: '#667eea',
        accent: '#4CAF50'
    },

    init() {
        this.loadTheme();
        this.loadCustomColors();
        this.setupEventListeners();
    },

    applyCustomColors() {
        const root = document.documentElement;
        const gradient = `linear-gradient(135deg, ${this.customColors.secondary} 0%, ${this.customColors.primary} 100%)`;
        
        root.style.setProperty('--primary-bg', gradient);
        root.style.setProperty('--button-bg', this.customColors.primary);
        root.style.setProperty('--button-color', '#ffffff');
        root.style.setProperty('--progress-bg', `${this.customColors.primary}20`);
        root.style.setProperty('--accent-color', this.customColors.accent);
        
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.style.color = this.customColors.accent;
        }
        
        this.saveCustomColors();
    },

    saveCustomColors() {
        localStorage.setItem('pomodoroCustomColors', JSON.stringify(this.customColors));
    },

    loadCustomColors() {
        const savedColors = localStorage.getItem('pomodoroCustomColors');
        if (savedColors) {
            this.customColors = JSON.parse(savedColors);
            
            const primaryInput = document.getElementById('primary-color');
            const secondaryInput = document.getElementById('secondary-color');
            const accentInput = document.getElementById('accent-color');
            
            if (primaryInput) primaryInput.value = this.customColors.primary;
            if (secondaryInput) secondaryInput.value = this.customColors.secondary;
            if (accentInput) accentInput.value = this.customColors.accent;
            
            this.applyCustomColors();
        }
    },

    resetColors() {
        this.customColors = {
            primary: '#764ba2',
            secondary: '#667eea',
            accent: '#4CAF50'
        };
        
        const primaryInput = document.getElementById('primary-color');
        const secondaryInput = document.getElementById('secondary-color');
        const accentInput = document.getElementById('accent-color');
        
        if (primaryInput) primaryInput.value = this.customColors.primary;
        if (secondaryInput) secondaryInput.value = this.customColors.secondary;
        if (accentInput) accentInput.value = this.customColors.accent;
        
        this.applyCustomColors();
        localStorage.removeItem('pomodoroCustomColors');
    },

    updateColorsFromPickers() {
        const primaryInput = document.getElementById('primary-color');
        const secondaryInput = document.getElementById('secondary-color');
        const accentInput = document.getElementById('accent-color');
        
        if (primaryInput) this.customColors.primary = primaryInput.value;
        if (secondaryInput) this.customColors.secondary = secondaryInput.value;
        if (accentInput) this.customColors.accent = accentInput.value;
        
        this.applyCustomColors();
    },

    toggleColorSettings() {
        const colorSettings = document.querySelector('.color-theme-settings');
        if (colorSettings) {
            colorSettings.style.display = colorSettings.style.display === 'none' ? 'block' : 'none';
        }
    },

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        this.applyCustomColors();
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            if (document.body.classList.contains('light-mode')) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            }
        }
        
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeToggle = document.getElementById('theme-toggle');
        
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        } else if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    },

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        const applyColorsBtn = document.getElementById('apply-colors');
        const resetColorsBtn = document.getElementById('reset-colors');
        const themeColorToggle = document.getElementById('theme-color-toggle');
        const primaryColorInput = document.getElementById('primary-color');
        const secondaryColorInput = document.getElementById('secondary-color');
        const accentColorInput = document.getElementById('accent-color');

        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
        if (applyColorsBtn) applyColorsBtn.addEventListener('click', () => this.updateColorsFromPickers());
        if (resetColorsBtn) resetColorsBtn.addEventListener('click', () => this.resetColors());
        if (themeColorToggle) themeColorToggle.addEventListener('click', () => this.toggleColorSettings());
        if (primaryColorInput) primaryColorInput.addEventListener('input', () => this.updateColorsFromPickers());
        if (secondaryColorInput) secondaryColorInput.addEventListener('input', () => this.updateColorsFromPickers());
        if (accentColorInput) accentColorInput.addEventListener('input', () => this.updateColorsFromPickers());
    }
};