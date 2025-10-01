// Main application file - brings everything together
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    StatsManager.init();
    AchievementsManager.init();
    GamificationManager.init();
    ThemeManager.init();
    TimerManager.init();

    // Setup tab functionality
    setupTabs();
    
    // Setup tips functionality
    setupTips();
    
    // Setup manual modal
    setupManualModal();

    console.log('Pomodoro Timer initialized successfully!');
});

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabName) {
        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === tabName;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        tabContents.forEach(content => {
            const isActive = content.id === `${tabName}-tab`;
            content.classList.toggle('active', isActive);
            content.hidden = !isActive;
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });
}

function setupTips() {
    const tips = [
        {
            title: "The Pomodoro Technique",
            content: "The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro."
        },
        {
            title: "Minimize Distractions",
            content: "During your focus sessions, turn off notifications, close unnecessary tabs, and let others know you're in a focus period. This helps maintain deep concentration."
        },
        {
            title: "Plan Your Tasks",
            content: "Before starting your timer, make a list of tasks you want to accomplish. Breaking larger tasks into smaller, manageable pieces makes them less daunting."
        },
        {
            title: "Take Real Breaks",
            content: "During your breaks, step away from your work environment. Stretch, walk around, hydrate, or do something completely different to refresh your mind."
        },
        {
            title: "Review and Adapt",
            content: "At the end of each day, review what you accomplished. Adjust your Pomodoro intervals if needed - some tasks might need longer or shorter focus periods."
        }
    ];

    let currentTip = 0;
    const tipTitle = document.getElementById('tip-title');
    const tipContent = document.getElementById('tip-content');
    const prevTipBtn = document.getElementById('prev-tip');
    const nextTipBtn = document.getElementById('next-tip');

    function showTip(index) {
        if (tipTitle && tipContent) {
            tipTitle.textContent = tips[index].title;
            tipContent.textContent = tips[index].content;
        }
    }

    if (prevTipBtn) {
        prevTipBtn.addEventListener('click', () => {
            currentTip = (currentTip - 1 + tips.length) % tips.length;
            showTip(currentTip);
        });
    }

    if (nextTipBtn) {
        nextTipBtn.addEventListener('click', () => {
            currentTip = (currentTip + 1) % tips.length;
            showTip(currentTip);
        });
    }

    // Show first tip
    showTip(currentTip);
}

function setupManualModal() {
    const manualToggle = document.getElementById('manual-toggle');
    const manualModal = document.getElementById('manual-modal');
    const closeManual = document.getElementById('close-manual');

    if (manualToggle && manualModal) {
        manualToggle.addEventListener('click', () => {
            manualModal.classList.add('active');
        });
    }

    if (closeManual && manualModal) {
        closeManual.addEventListener('click', () => {
            manualModal.classList.remove('active');
        });
    }

    if (manualModal) {
        manualModal.addEventListener('click', (e) => {
            if (e.target === manualModal) {
                manualModal.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && manualModal && manualModal.classList.contains('active')) {
            manualModal.classList.remove('active');
        }
    });
}