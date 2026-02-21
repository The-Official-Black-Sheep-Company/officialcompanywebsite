
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-content');
    const navItems = document.querySelectorAll('.nav-item');
    const sectionTitle = document.getElementById('section-title');
    const settingsTrigger = document.getElementById('settings-trigger');
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-modal-close');

    function loadSection(sectionId) {
        if (!sectionId) return;

        // Toggle active class on sections
        sections.forEach(section => {
            if (section.id === `${sectionId}-section`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update title
        const titleMap = {
            profile: 'Profile',
            dashboard: 'Dashboard',
            feeds: 'Beast Control',
            messages: 'Messages',
            friends: 'Friends',
            photobooth: 'Photobooth',
            billing: 'Billing',
            support: 'Support',
            activity: 'Activity',
            settings: 'Settings'
        };
        sectionTitle.textContent = titleMap[sectionId] || 'Portal Area';
        
        // Re-run Lucide for any new elements
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const sectionId = item.dataset.section;
            if (!sectionId) return;

            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            loadSection(sectionId);
        });
    });

    // Settings Modal Logic
    if (settingsTrigger && settingsModal) {
        settingsTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            settingsModal.classList.remove('hidden');
            setTimeout(() => settingsModal.classList.add('opacity-100'), 10);
        });
    }

    if (settingsClose && settingsModal) {
        settingsClose.addEventListener('click', () => {
            settingsModal.classList.remove('opacity-100');
            setTimeout(() => settingsModal.classList.add('hidden'), 300);
        });
    }

    // Close modal on outside click
    settingsModal?.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsClose?.click();
        }
    });

    // Tactical Override Handlers
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.innerText.trim();
            if (action === "CANCEL" || action === "SAVE CHANGES") return; // Skip modal buttons
            
            console.log(`[TACTICAL] Triggering action: ${action}`);
            alert(`Beast Intelligence: Initiating ${action}...`);
        });
    });

    // Load initial section
    loadSection('dashboard');
});


