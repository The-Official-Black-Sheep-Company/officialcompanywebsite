
document.addEventListener('DOMContentLoaded', () => {
    const mainContentArea = document.getElementById('main-content-area');
    const navItems = document.querySelectorAll('.nav-item');
    const sectionTitle = document.getElementById('section-title');

    const sectionTemplates = {
        dashboard: '<h2>Dashboard Content</h2>',
        messages: '<h2>Messages Content</h2>',
        profile: '<h2>Profile Content</h2>',
        feeds: '<h2>Feeds Content</h2>',
        friends: '<h2>Friends Content</h2>',
        photobooth: '<h2>Photobooth Content</h2>',
        billing: '<h2>Billing Content</h2>',
        support: '<h2>Support Content</h2>',
        activity: '<h2>Activity Content</h2>',
        settings: '<h2>Settings Content</h2>',
    };

    function loadSection(sectionId) {
        mainContentArea.innerHTML = sectionTemplates[sectionId] || '<h2>Page Not Found</h2>';
        sectionTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;

            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            loadSection(sectionId);
        });
    });

    // Load initial section
    loadSection('dashboard');
});
