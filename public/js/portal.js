
document.addEventListener('DOMContentLoaded', () => {
    /* =========================================================
       SECTION NAVIGATION
    ========================================================= */
    const sections   = document.querySelectorAll('.section-content');
    const navItems   = document.querySelectorAll('.nav-item[data-section]');
    const sectionTitle  = document.getElementById('section-title');
    const settingsTrigger = document.getElementById('settings-trigger');
    const settingsModal   = document.getElementById('settings-modal');
    const settingsClose   = document.getElementById('settings-modal-close');

    const titleMap = {
        profile:    'Profile',
        dashboard:  'Dashboard',
        feeds:      'Beast Control',
        messages:   'Messages',
        friends:    'Friends',
        photobooth: 'Photobooth',
        billing:    'Billing',
        support:    'Support',
        activity:   'Activity',
        settings:   'Settings'
    };

    function loadSection(sectionId) {
        if (!sectionId) return;
        sections.forEach(s => {
            s.classList.toggle('active', s.id === `${sectionId}-section`);
        });
        if (sectionTitle) sectionTitle.textContent = titleMap[sectionId] || 'Portal';
        if (window.lucide) window.lucide.createIcons();

        // Hydrate profile form when switching to profile
        if (sectionId === 'profile') hydrateProfileForm();
        if (sectionId === 'photobooth') renderPhotobooth();
    }

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            const id = item.dataset.section;
            if (!id) return;
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadSection(id);
        });
    });

    // Settings modal
    if (settingsTrigger && settingsModal) {
        settingsTrigger.addEventListener('click', e => {
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
    settingsModal?.addEventListener('click', e => {
        if (e.target === settingsModal) settingsClose?.click();
    });

    // Tactical Override buttons (non-modal / non-profile)
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.innerText.trim();
            const skip = ['CANCEL', 'SAVE CHANGES', 'SAVE PROFILE', 'ADD PHOTO'];
            if (skip.some(s => action.includes(s))) return;
            console.log(`[TACTICAL] ${action}`);
            alert(`Beast Intelligence: Initiating ${action}...`);
        });
    });

    loadSection('dashboard');


    /* =========================================================
       PHOTOBOOTH — shared photo store (localStorage)
    ========================================================= */
    const PHOTO_KEY = 'bsc_photobooth';

    function getPhotos() {
        try { return JSON.parse(localStorage.getItem(PHOTO_KEY)) || []; }
        catch { return []; }
    }

    function savePhotos(arr) {
        localStorage.setItem(PHOTO_KEY, JSON.stringify(arr));
    }

    /**
     * addToPhotobooth(dataUrl, label)
     * Public helper — call from Profile or Feeds when a photo is picked.
     */
    window.addToPhotobooth = function(dataUrl, label) {
        const photos = getPhotos();
        photos.unshift({ src: dataUrl, label: label || 'Photo', ts: Date.now() });
        savePhotos(photos);
        renderPhotobooth();
        updatePhotoCount();
    };

    function updatePhotoCount() {
        const el = document.getElementById('profile-photo-count');
        if (el) {
            const n = getPhotos().length;
            el.textContent = `${n} photo${n !== 1 ? 's' : ''}`;
        }
    }

    function renderPhotobooth() {
        const grid  = document.getElementById('photobooth-grid');
        const empty = document.getElementById('photobooth-empty');
        if (!grid) return;

        const photos = getPhotos();
        // Remove old thumb tiles (keep the empty placeholder)
        grid.querySelectorAll('.photo-thumb').forEach(t => t.remove());

        if (photos.length === 0) {
            if (empty) empty.style.display = '';
            return;
        }
        if (empty) empty.style.display = 'none';

        photos.forEach((p, i) => {
            const tile = document.createElement('div');
            tile.className = 'photo-thumb relative aspect-square rounded-2xl overflow-hidden cursor-pointer group border border-zinc-800 hover:border-orange-500/60 transition-colors';
            tile.innerHTML = `
                <img src="${p.src}" alt="${p.label}"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                    <span class="text-[10px] text-white/80 truncate">${p.label}</span>
                </div>
                <button class="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full text-white/60 hover:text-red-400 hidden group-hover:flex items-center justify-center transition-colors photo-delete-btn" data-index="${i}" title="Remove photo" aria-label="Remove photo">
                    <i data-lucide="x" class="w-3 h-3"></i>
                </button>`;
            tile.querySelector('img').addEventListener('click', () => openLightbox(p.src));
            tile.querySelector('.photo-delete-btn').addEventListener('click', ev => {
                ev.stopPropagation();
                deletePhoto(i);
            });
            grid.insertBefore(tile, empty);
        });
        if (window.lucide) window.lucide.createIcons();
    }

    function deletePhoto(index) {
        const photos = getPhotos();
        photos.splice(index, 1);
        savePhotos(photos);
        renderPhotobooth();
        updatePhotoCount();
    }

    // Photobooth file input
    const pbInput = document.getElementById('photobooth-file-input');
    if (pbInput) {
        pbInput.addEventListener('change', () => {
            Array.from(pbInput.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = ev => window.addToPhotobooth(ev.target.result, file.name.replace(/\.[^.]+$/, ''));
                reader.readAsDataURL(file);
            });
            pbInput.value = '';
        });
    }

    // Drag and drop onto the photobooth grid
    const pbGrid = document.getElementById('photobooth-grid');
    if (pbGrid) {
        pbGrid.addEventListener('dragover', e => { e.preventDefault(); pbGrid.classList.add('ring-2', 'ring-orange-500/50'); });
        pbGrid.addEventListener('dragleave', () => { pbGrid.classList.remove('ring-2', 'ring-orange-500/50'); });
        pbGrid.addEventListener('drop', e => {
            e.preventDefault();
            pbGrid.classList.remove('ring-2', 'ring-orange-500/50');
            Array.from(e.dataTransfer.files).forEach(file => {
                if (!file.type.startsWith('image/')) return;
                const reader = new FileReader();
                reader.onload = ev => window.addToPhotobooth(ev.target.result, file.name.replace(/\.[^.]+$/, ''));
                reader.readAsDataURL(file);
            });
        });
    }


    /* =========================================================
       LIGHTBOX
    ========================================================= */
    function openLightbox(src) {
        const lb = document.getElementById('photobooth-lightbox');
        const img = document.getElementById('lightbox-img');
        if (!lb || !img) return;
        img.src = src;
        lb.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    window.closeLightbox = function() {
        const lb = document.getElementById('photobooth-lightbox');
        if (lb) lb.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // ESC key closes lightbox
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') window.closeLightbox();
    });


    /* =========================================================
       PROFILE — load / save / avatar
    ========================================================= */
    const PROFILE_KEY = 'bsc_profile';

    function getProfile() {
        try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; }
        catch { return {}; }
    }

    function saveProfile(data) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    }

    function hydrateProfileForm() {
        const profile = getProfile();

        // Header display
        const nameEl   = document.getElementById('profile-display-name');
        const emailEl  = document.getElementById('profile-email-display');
        const bioPreview = document.getElementById('profile-bio-preview');

        if (nameEl)  nameEl.textContent  = profile.name  || (auth?.currentUser?.displayName) || 'Unknown Member';
        if (emailEl) emailEl.textContent = profile.email || (auth?.currentUser?.email) || '';
        if (bioPreview) bioPreview.textContent = profile.bio || 'No bio yet — add one below.';

        // Form fields
        const nameInput     = document.getElementById('profile-name-input');
        const handleInput   = document.getElementById('profile-handle-input');
        const bioInput      = document.getElementById('profile-bio-input');
        const locationInput = document.getElementById('profile-location-input');

        if (nameInput)     nameInput.value     = profile.name     || (auth?.currentUser?.displayName) || '';
        if (handleInput)   handleInput.value   = profile.handle   || '';
        if (bioInput)      bioInput.value      = profile.bio      || '';
        if (locationInput) locationInput.value = profile.location || '';

        // Avatar
        setAvatarDisplay(profile.avatarUrl || auth?.currentUser?.photoURL || null,
                         profile.name || auth?.currentUser?.displayName || '');

        updatePhotoCount();
    }

    function setAvatarDisplay(src, name) {
        const img     = document.getElementById('profile-avatar-img');
        const initial = document.getElementById('profile-avatar-initial');
        if (!img || !initial) return;
        if (src) {
            img.src = src;
            img.classList.remove('hidden');
            initial.classList.add('hidden');
        } else {
            img.classList.add('hidden');
            initial.classList.remove('hidden');
            initial.textContent = name ? name.charAt(0).toUpperCase() : '?';
        }
    }

    // Avatar file input
    const avatarInput = document.getElementById('avatar-file-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', () => {
            const file = avatarInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const dataUrl = ev.target.result;
                // Show in profile
                setAvatarDisplay(dataUrl, '');
                // Persist in profile data
                const profile = getProfile();
                profile.avatarUrl = dataUrl;
                saveProfile(profile);
                // Also add to photobooth
                window.addToPhotobooth(dataUrl, 'Profile Photo');
            };
            reader.readAsDataURL(file);
            avatarInput.value = '';
        });
    }

    // Save profile button
    const saveBtn = document.getElementById('profile-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const profile = getProfile();
            profile.name     = document.getElementById('profile-name-input')?.value.trim() || profile.name;
            profile.handle   = document.getElementById('profile-handle-input')?.value.trim() || '';
            profile.bio      = document.getElementById('profile-bio-input')?.value.trim() || '';
            profile.location = document.getElementById('profile-location-input')?.value.trim() || '';
            profile.email    = auth?.currentUser?.email || '';
            saveProfile(profile);

            // Refresh header
            hydrateProfileForm();

            // Visual feedback
            saveBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> SAVED!`;
            saveBtn.classList.replace('btn-primary', 'btn-secondary');
            setTimeout(() => {
                saveBtn.innerHTML = `<i data-lucide="save" class="w-4 h-4"></i> SAVE PROFILE`;
                saveBtn.classList.replace('btn-secondary', 'btn-primary');
                if (window.lucide) window.lucide.createIcons();
            }, 2000);
            if (window.lucide) window.lucide.createIcons();
        });
    }

    // Pre-fill profile name from Firebase when user is known
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(user => {
            if (user) {
                const profile = getProfile();
                if (!profile.name) {
                    profile.name  = user.displayName || user.email.split('@')[0];
                    profile.email = user.email;
                    saveProfile(profile);
                }
            }
        });
    }
});
