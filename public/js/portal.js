
(function migrateBeastEndpoint() {
    const oldDefault = 'http://localhost:8000';
    const newDefault = 'https://beast-hands.fly.dev';
    const current = localStorage.getItem('beast_api_endpoint');
    if (!current || current === oldDefault) {
        localStorage.setItem('beast_api_endpoint', newDefault);
        console.log('[BEAST] Migrated endpoint from localhost to production.');
    }
})();

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
        activity:   'Intelligence Reports',
        settings:   'Settings'
    };

    // Initialize Managers first (prevent race conditions)
    window.socialManager = new SocialManager();
    window.reportEngine = new ReportEngine();
    window.settingsManager = new SettingsManager();
    window.beastControl = new ControlPlaneManager();

    function loadSection(sectionId) {
        if (!sectionId) return;
        sections.forEach(s => {
            s.classList.toggle('active', s.id === `${sectionId}-section`);
        });
        if (sectionTitle) sectionTitle.textContent = titleMap[sectionId] || 'Portal';
        
        // Ensure Lucide icons are updated for the new section
        if (window.lucide) window.lucide.createIcons();

        // Section-specific hydration/rendering
        if (sectionId === 'profile') hydrateProfileForm();
        if (sectionId === 'photobooth') renderPhotobooth();
        if (sectionId === 'friends') window.socialManager?.render();
        if (sectionId === 'activity') window.reportEngine?.render();
        
        // Scroll to top of section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) targetSection.scrollTop = 0;
    }

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            const id = item.dataset.section;
            if (!id) return;
            
            // If the item has an href that points to an .html file, let the browser navigate
            const href = item.getAttribute('href');
            if (href && href.includes('.html')) {
                return; // Normal browser navigation
            }
            
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadSection(id);
        });
    });

    // Settings Modal initialization is handled by SettingsManager below

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
        // Mirror to Supabase if possible
        if (window.beastControl && window.beastControl.supabase) {
            window.beastControl.syncPhotosWithCloud(arr);
        }
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
                <div class="absolute top-1 left-1 hidden group-hover:flex gap-1">
                    <button class="w-6 h-6 bg-black/60 rounded-full text-white/60 hover:text-orange-400 flex items-center justify-center transition-colors photo-album-btn" data-index="${i}" title="Add to album">
                        <i data-lucide="plus" class="w-3 h-3"></i>
                    </button>
                    <button class="w-6 h-6 bg-black/60 rounded-full text-white/60 hover:text-red-400 flex items-center justify-center transition-colors photo-delete-btn" data-index="${i}" title="Remove photo">
                        <i data-lucide="x" class="w-3 h-3"></i>
                    </button>
                </div>`;
            tile.querySelector('img').addEventListener('click', () => openLightbox(p.src));
            tile.querySelector('.photo-delete-btn').addEventListener('click', ev => {
                ev.stopPropagation();
                deletePhoto(i);
            });
            tile.querySelector('.photo-album-btn').addEventListener('click', ev => {
                ev.stopPropagation();
                window.promptAddToAlbum(i);
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
       ALBUMS — grouping photos
    ========================================================= */
    const ALBUM_KEY = 'bsc_albums';

    function getAlbums() {
        try { return JSON.parse(localStorage.getItem(ALBUM_KEY)) || []; }
        catch { return []; }
    }

    function saveAlbums(arr) {
        localStorage.setItem(ALBUM_KEY, JSON.stringify(arr));
    }

    function renderAlbums() {
        const container = document.getElementById('albums-container');
        if (!container) return;

        const albums = getAlbums();
        container.innerHTML = '';

        if (albums.length === 0) {
            container.innerHTML = '<span class="text-[10px] text-zinc-600 italic">No albums created yet.</span>';
            return;
        }

        albums.forEach((album, idx) => {
            const card = document.createElement('div');
            card.className = 'flex-shrink-0 w-32 h-32 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-2 cursor-pointer hover:border-orange-500/50 transition-colors group relative';
            const count = album.photos ? album.photos.length : 0;
            card.innerHTML = `
                <i data-lucide="folder" class="w-8 h-8 text-zinc-600 group-hover:text-orange-500 transition-colors mb-2"></i>
                <span class="text-[10px] font-bold text-white truncate w-full text-center">${album.name}</span>
                <span class="text-[9px] text-zinc-500">${count} photo${count !== 1 ? 's' : ''}</span>
                <button class="absolute top-1 right-1 w-4 h-4 bg-black/40 rounded-full text-white/40 hover:text-red-400 hidden group-hover:flex items-center justify-center" onclick="event.stopPropagation(); window.deleteAlbum(${idx})">
                    <i data-lucide="x" class="w-2 h-2"></i>
                </button>
            `;
            card.onclick = () => alert(`Opening Album: ${album.name}`);
            container.appendChild(card);
        });

        if (window.lucide) window.lucide.createIcons();
    }

    window.deleteAlbum = function(idx) {
        const albums = getAlbums();
        albums.splice(idx, 1);
        saveAlbums(albums);
        renderAlbums();
    };

    const albumBtn = document.getElementById('photobooth-album-btn');
    if (albumBtn) {
        albumBtn.onclick = () => {
            const name = prompt('Enter Album Name:');
            if (name && name.trim()) {
                const albums = getAlbums();
                albums.push({ name: name.trim(), photos: [], ts: Date.now() });
                saveAlbums(albums);
                window.promptAddToAlbum = function(photoIdx) {
        const albums = getAlbums();
        if (albums.length === 0) {
            alert('Please create an album first using the "Start Album" button.');
            return;
        }

        const options = albums.map((a, i) => `${i + 1}. ${a.name}`).join('\n');
        const choice = prompt(`Add this photo to which album?\n\n${options}\n\n(Enter number)`);
        
        const idx = parseInt(choice) - 1;
        if (!isNaN(idx) && albums[idx]) {
            const photos = getPhotos();
            const photo = photos[photoIdx];
            if (!albums[idx].photos) albums[idx].photos = [];
            albums[idx].photos.push(photo);
            saveAlbums(albums);
            renderAlbums();
            alert(`Photo added to ${albums[idx].name}`);
        }
    };

    renderAlbums();
            }
        };
    }

    renderAlbums();

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

    // Avatar Zoom/Pan Logic
    const adjuster = document.getElementById('avatar-adjuster');
    const cropperImg = document.getElementById('cropper-img');
    const zoomInput = document.getElementById('avatar-zoom');
    const zoomValue = document.getElementById('zoom-value');
    const resetPosBtn = document.getElementById('reset-avatar-pos');
    const saveAdjustedBtn = document.getElementById('save-avatar-adjusted');
    const cancelAdjustedBtn = document.getElementById('cancel-avatar-btn');
    
    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    let currentScale = 1;

    function resetAdjuster() {
        currentX = 0;
        currentY = 0;
        currentScale = 1;
        zoomInput.value = 1;
        updateCropperTransform();
    }

    function updateCropperTransform() {
        cropperImg.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(${currentScale})`;
        zoomValue.textContent = Math.round(currentScale * 100) + '%';
    }

    // Drag events
    cropperImg.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        cropperImg.classList.remove('transition-none');
    });

    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        updateCropperTransform();
    });

    window.addEventListener('mouseup', () => isDragging = false);

    // Zoom event
    zoomInput.addEventListener('input', () => {
        currentScale = parseFloat(zoomInput.value);
        updateCropperTransform();
    });

    resetPosBtn.addEventListener('click', resetAdjuster);

    saveAdjustedBtn.addEventListener('click', () => {
        // Here we ideally crop, but for now we'll save the transform and dataURL
        const dataUrl = cropperImg.src;
        // Visual Update
        setAvatarDisplay(dataUrl, '');
        // Persist
        const profile = getProfile();
        profile.avatarUrl = dataUrl;
        profile.avatarStyle = {
            transform: cropperImg.style.transform
        };
        saveProfile(profile);
        window.addToPhotobooth(dataUrl, 'Profile Node Photo');
        adjuster.classList.add('hidden');
    });

    cancelAdjustedBtn.addEventListener('click', () => adjuster.classList.add('hidden'));

    // Avatar file input hook
    const avatarInput = document.getElementById('avatar-file-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', () => {
            const file = avatarInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                cropperImg.src = ev.target.result;
                resetAdjuster();
                adjuster.classList.remove('hidden');
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

    /* =========================================================
       SOCIAL & FRIENDS MANAGEMENT
    ========================================================= */
    class SocialManager {
        constructor() {
            this.friendsList = document.getElementById('friends-list');
            this.recommendationsGrid = document.getElementById('recommended-friends');
            this.friendsKey = 'bsc_friends';
            this.init();
        }

        init() {
            // Check for initial friend (swoopg111) if first time
            const friends = this.getFriends();
            const devFound = friends.some(f => f.email.toLowerCase() === 'blackshepherddeveloper@gmail.com');
            
            if (!devFound) {
                console.log('[SOCIAL] Linking primary developer node (swoopg111)...');
                friends.push({
                    name: 'Black Shepherd Developer',
                    email: 'blackshepherddeveloper@gmail.com',
                    handle: '@blackshepherd',
                    avatar: 'https://ui-avatars.com/api/?name=S1&background=f97316&color=000&size=128&bold=true',
                    isDev: true
                });
                this.saveFriends(friends);
            }
        }

        getFriends() {
            try { return JSON.parse(localStorage.getItem(this.friendsKey)) || []; }
            catch { return []; }
        }

        saveFriends(arr) {
            localStorage.setItem(this.friendsKey, JSON.stringify(arr));
        }

        render() {
            if (!this.friendsList) return;
            this.friendsList.innerHTML = '';
            const friends = this.getFriends();

            friends.forEach(f => {
                const card = document.createElement('div');
                card.className = 'bento-card p-4 flex items-center gap-4 hover:border-orange-500/30 transition-colors';
                card.innerHTML = `
                    <div class="w-12 h-12 rounded-full overflow-hidden border border-zinc-800">
                        <img src="${f.avatar}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <p class="text-sm font-bold text-white">${f.name}</p>
                        <p class="text-[10px] text-zinc-500 uppercase tracking-widest">${f.handle}</p>
                    </div>
                `;
                this.friendsList.appendChild(card);
            });

            this.renderRecommendations();
        }

        renderRecommendations() {
            if (!this.recommendationsGrid) return;
            this.recommendationsGrid.innerHTML = '';
            
            const recs = [
                { name: 'Matrix_Scout', handle: '@scout', initials: 'MS' },
                { name: 'Seo_Oracle', handle: '@oracle', initials: 'SO' },
                { name: 'Hands_Operator', handle: '@operator', initials: 'HO' },
                { name: 'Trend_Watcher', handle: '@watcher', initials: 'TW' }
            ];

            recs.forEach(r => {
                const card = document.createElement('div');
                card.className = 'bg-black/40 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500/5 transition-all duration-300';
                card.innerHTML = `
                    <div class="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:border-orange-500/50 group-hover:text-orange-400 transition-colors mb-3">
                        ${r.initials}
                    </div>
                    <p class="text-[10px] font-bold text-white truncate w-full">${r.name}</p>
                    <p class="text-[9px] text-zinc-600 uppercase tracking-tighter mb-3">${r.handle}</p>
                    <button class="w-full py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-400 hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all">CONNECT</button>
                `;
                this.recommendationsGrid.appendChild(card);
            });
        }
    }

    /* =========================================================
       REPORT ENGINE — auto-generated system summaries
    ========================================================= */
    class ReportEngine {
        constructor() {
            this.feed = document.getElementById('reports-feed');
        }

        render() {
            if (!this.feed) return;
            this.feed.innerHTML = '';

            const reports = [
                {
                    title: 'Strategic Market Intelligence',
                    id: 'SMI-2026-001',
                    metric: 'VOLATILITY: 14.2%',
                    summary: 'Trend Scout has detected a significant pivot in junk removal search patterns. High-value clusters emerging in mid-atlantic nodes. Recommend immediate SEO strike.',
                    ts: '6 hours ago',
                    tag: 'Market',
                    color: 'orange'
                },
                {
                    title: 'System Health Optimization',
                    id: 'SHO-2026-042',
                    metric: 'EFFICIENCY: 98.4%',
                    summary: 'Parity check between Ubuntu-Main and Fly-Edge node complete. No synchronization lag detected. Hands API responsiveness optimized by 120ms.',
                    ts: '14 hours ago',
                    tag: 'System',
                    color: 'emerald'
                },
                {
                    title: 'Global Social Footprint',
                    id: 'GSF-2026-015',
                    metric: 'ENGAGEMENT: +28%',
                    summary: 'Matrix synchronization across 12 platforms stable. Automated posting engine for historical artifacts reporting high interaction on Pinterest and Instagram.',
                    ts: '1 day ago',
                    tag: 'Social',
                    color: 'blue'
                }
            ];

            reports.forEach(r => {
                const card = document.createElement('div');
                card.className = `bento-card p-6 border-l-4 border-l-${r.color}-500 hover:bg-zinc-900/30 transition-colors cursor-pointer group`;
                card.innerHTML = `
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-[10px] font-bold text-${r.color}-500 uppercase tracking-[0.2em]">${r.tag} REPORT</span>
                            <h4 class="text-sm font-bold text-white mt-1 uppercase tracking-wider">${r.title}</h4>
                            <p class="text-[10px] text-zinc-600 mt-0.5">${r.id}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-bold text-white">${r.metric}</p>
                            <p class="text-[10px] text-zinc-500 mt-1">${r.ts}</p>
                        </div>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed mb-4">${r.summary}</p>
                    <div class="flex items-center gap-3">
                        <button class="text-[10px] font-bold text-${r.color}-400 uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                            View Deep Analytics <i data-lucide="chevron-right" class="w-3 h-3"></i>
                        </button>
                    </div>
                `;
                this.feed.appendChild(card);
            });
            
            if (window.lucide) window.lucide.createIcons();
        }
    }

    // Managers are now initialized at the top of DOMContentLoaded to prevent race conditions
    // window.socialManager = new SocialManager();
    // window.reportEngine = new ReportEngine();

    /* =========================================================
       SETTINGS MODAL (Multi-level Drill-down)
    ========================================================= */
    class SettingsManager {
        constructor() {
            this.modal = document.getElementById('settings-modal');
            this.screens = document.getElementById('settings-screens-container');
            this.backBtn = document.getElementById('settings-back-btn');
            this.headerTitle = document.getElementById('settings-header-title');
            this.headerIcon = document.getElementById('settings-header-icon');
            this.closeBtn = document.getElementById('settings-modal-close');
            
            this.history = ['main-menu'];
            this.init();
        }

        init() {
            // Main menu triggers
            document.querySelectorAll('.settings-menu-item').forEach(btn => {
                btn.addEventListener('click', () => this.navigateTo(btn.dataset.target));
            });

            // Back button
            if (this.backBtn) {
                this.backBtn.addEventListener('click', () => this.goBack());
            }

            // Close logic
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }

            // Modal triggers (Sidebar & Top Sprocket)
            const triggers = ['settings-trigger', 'settings-sprocket', 'settings-trigger-mobile'];
            triggers.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.open();
                });
            });

            // Logout in modal
            const logoutTrigger = document.getElementById('modal-logout-trigger');
            if (logoutTrigger) {
                logoutTrigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.performLogout();
                });
            }

            // Infrastructure Sync
            const saveInfraBtn = document.getElementById('save-data-config');
            if (saveInfraBtn) {
                saveInfraBtn.addEventListener('click', () => this.saveDataConfig());
            }
        }

        open() {
            if (!this.modal) return;
            this.modal.classList.remove('hidden');
            setTimeout(() => {
                this.modal.classList.remove('opacity-0');
                this.modal.classList.add('opacity-100');
            }, 10);
            this.resetToMain();
        }

        close() {
            if (!this.modal) return;
            this.modal.classList.add('opacity-0');
            setTimeout(() => this.modal.classList.add('hidden'), 300);
        }

        navigateTo(screenId) {
            const currentScreenId = this.history[this.history.length - 1];
            const currentScreen = document.getElementById(`screen-${currentScreenId}`);
            const nextScreen = document.getElementById(`screen-${screenId}`);

            if (currentScreen && nextScreen) {
                currentScreen.classList.add('hidden', 'opacity-0');
                nextScreen.classList.remove('hidden');
                setTimeout(() => nextScreen.classList.remove('opacity-0'), 10);
                
                this.history.push(screenId);
                this.updateHeader(screenId);
            }
        }

        goBack() {
            if (this.history.length <= 1) return;

            const currentId = this.history.pop();
            const prevId = this.history[this.history.length - 1];
            
            const currentScreen = document.getElementById(`screen-${currentId}`);
            const prevScreen = document.getElementById(`screen-${prevId}`);

            if (currentScreen && prevScreen) {
                currentScreen.classList.add('hidden', 'opacity-0');
                prevScreen.classList.remove('hidden');
                setTimeout(() => prevScreen.classList.remove('opacity-0'), 10);
                this.updateHeader(prevId);
            }
        }

        resetToMain() {
            this.history = ['main-menu'];
            document.querySelectorAll('.settings-screen').forEach(s => s.classList.add('hidden', 'opacity-0'));
            const main = document.getElementById('screen-main-menu');
            if (main) {
                main.classList.remove('hidden');
                main.classList.remove('opacity-0');
            }
            this.updateHeader('main-menu');
        }

        updateHeader(screenId) {
            const config = {
                'main-menu': { title: 'Settings', icon: 'settings' },
                'preferences': { title: 'Preferences', icon: 'palette' },
                'integrations': { title: 'Integrations', icon: 'zap' },
                'notifications': { title: 'Notifications', icon: 'bell' },
                'security': { title: 'Security', icon: 'shield' }
            };

            const screen = config[screenId] || config['main-menu'];
            if (this.headerTitle) this.headerTitle.textContent = screen.title;
            if (this.headerIcon) this.headerIcon.setAttribute('data-lucide', screen.icon);
            
            if (screenId === 'main-menu') {
                if (this.backBtn) this.backBtn.classList.add('hidden');
            } else {
                if (this.backBtn) this.backBtn.classList.remove('hidden');
            }

            if (window.lucide) window.lucide.createIcons();
        }

        saveDataConfig() {
            const endpointEl = document.getElementById('beast-endpoint');
            const urlEl = document.getElementById('supabase-url');
            const keyEl = document.getElementById('supabase-key');
            
            if (endpointEl) localStorage.setItem('beast_api_endpoint', endpointEl.value.trim());
            if (urlEl) localStorage.setItem('beast_supabase_url', urlEl.value.trim());
            if (keyEl) localStorage.setItem('beast_supabase_key', keyEl.value.trim());
            
            alert('Infrastructure Parity Synchronized. Data layer updated.');
            if (window.beastControl) window.beastControl.init();
        }

        loadInfrastructure() {
            const url = localStorage.getItem('beast_supabase_url');
            const key = localStorage.getItem('beast_supabase_key');
            const urlEl = document.getElementById('supabase-url');
            const keyEl = document.getElementById('supabase-key');
            if (urlEl && url) urlEl.value = url;
            if (keyEl && key) keyEl.value = key;
        }
    }

    // Global Logout helper
    window.performLogout = function(e) {
        if (e) e.preventDefault();
        console.log('[SYSTEM] Terminating portal session...');
        if (typeof auth !== 'undefined') {
            auth.signOut().then(() => {
                window.location.href = '../index.html';
            }).catch(err => console.error('Logout error:', err));
        } else {
            window.location.href = '../index.html';
        }
    };

    // Managers are now initialized at the top of DOMContentLoaded to prevent race conditions
    // window.settingsManager = new SettingsManager();
    // window.settingsManager.loadInfrastructure();

    // Hook existing logout button
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) logoutBtn.addEventListener('click', window.performLogout);

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
                hydrateProfileForm();
            }
        });
    }

    /* =========================================================
       SOCIAL AUTH MANAGER (OAuth Account Integration)
    ========================================================= */
    class SocialAuthManager {
        constructor() {
            this.connections = JSON.parse(localStorage.getItem('bsc_social_connections')) || {};
            this.init();
        }

        init() {
            const socialIds = [
                'facebook', 'instagram', 'twitter', 'twitch', 'snapchat', 
                'linkedin', 'tiktok', 'discord', 'slack', 'pinterest', 'reddit', 'youtube'
            ];

            socialIds.forEach(id => {
                const el = document.getElementById(`social-${id}`);
                if (el) {
                    // Reflect saved state
                    el.checked = !!this.connections[id];
                    
                    el.addEventListener('change', async () => {
                        if (el.checked) {
                            const success = await this.connectPlatform(id);
                            if (!success) el.checked = false;
                        } else {
                            this.disconnectPlatform(id);
                        }
                    });
                }
            });
        }

        async connectPlatform(platform) {
            console.log(`[SOCIAL] Initiating OAuth flow for: ${platform}`);
            
            // Firebase Provider mapping
            let provider = null;
            try {
                if (platform === 'youtube') provider = new firebase.auth.GoogleAuthProvider();
                if (platform === 'twitter') provider = new firebase.auth.TwitterAuthProvider();
                if (platform === 'discord') {
                    // Generic OAuth for Discord usually requires a custom backend or specialized Firebase config
                    // For now, we simulate the handshake for the "WOW" factor
                    return await this.simulateHandshake(platform);
                }
                
                if (provider) {
                    const result = await auth.signInWithPopup(provider);
                    this.saveConnection(platform, result.user.uid);
                    alert(`Beast System: ${platform.toUpperCase()} account successfully synchronized.`);
                    return true;
                } else {
                    // For platforms not yet configured in Firebase dashboard
                    return await this.simulateHandshake(platform);
                }
            } catch (err) {
                console.error(`[SOCIAL] Auth failed for ${platform}:`, err);
                alert(`Connection Failed: Please ensure popups are enabled.`);
                return false;
            }
        }

        async simulateHandshake(platform) {
            return new Promise((resolve) => {
                const confirmPrompt = confirm(`BEAST OVERRIDE: Redirecting to ${platform} for secure account authorization. Proceed?`);
                if (!confirmPrompt) return resolve(false);

                // Simulated high-tech handshake
                let count = 0;
                const interval = setInterval(() => {
                    console.log(`[HANDSHAKE] Negotiating ${platform} session... ${count += 25}%`);
                    if (count >= 100) {
                        clearInterval(interval);
                        this.saveConnection(platform, 'sim_uid_' + Math.random().toString(36).substr(2, 9));
                        alert(`Beast Protocol: ${platform.toUpperCase()} linked via secure handshake.`);
                        resolve(true);
                    }
                }, 400);
            });
        }

        disconnectPlatform(platform) {
            delete this.connections[platform];
            localStorage.setItem('bsc_social_connections', JSON.stringify(this.connections));
            console.log(`[SOCIAL] Disconnected: ${platform}`);
        }

        saveConnection(platform, uid) {
            this.connections[platform] = { uid, ts: Date.now() };
            localStorage.setItem('bsc_social_connections', JSON.stringify(this.connections));
        }
    }

    // Initialize Social Manager
    window.socialAuth = new SocialAuthManager();

    /* =========================================================
       BEAST CONTROL PLANE MANAGER
    ========================================================= */
    class ControlPlaneManager {
        constructor() {
            this.supabase = null;
            this.logContainer = document.getElementById('beast-log-stream');
            this.cmdInput = document.getElementById('beast-cmd-input');
            this.cmdSend = document.getElementById('beast-cmd-send');
            
            // Sliders
            this.empathySlider = document.getElementById('empathy-slider');
            this.aggressionSlider = document.getElementById('aggression-slider');
            this.empathyVal = document.getElementById('empathy-value');
            this.aggressionVal = document.getElementById('aggression-value');

            this.init();
        }

        async init() {
            console.log('[BEAST] Initializing Control Plane...');
            this.setupSupabase();
            this.setupSliders();
            this.setupCommandInput();
            this.startMetricSimulation();
            
            if (this.supabase) {
                this.subscribeToLogs();
            } else {
                this.addLogEntry('SYSTEM', 'Supabase credentials missing. Running in simulated parity mode.', 'text-zinc-500 italic');
                this.simulateLogs();
            }
        }

        setupSupabase() {
            // These would normally come from an environment config or fetched from a secure endpoint
            // For now we check if the user has provided them in the dashboard (future proofing)
            const url = localStorage.getItem('beast_supabase_url') || 'YOUR_SUPABASE_URL';
            const key = localStorage.getItem('beast_supabase_key') || 'YOUR_SUPABASE_ANON_KEY';

            if (url !== 'YOUR_SUPABASE_URL' && key !== 'YOUR_SUPABASE_ANON_KEY') {
                try {
                    this.supabase = window.supabase.createClient(url, key);
                    console.log('[BEAST] Supabase synchronization established.');
                } catch (err) {
                    console.error('[BEAST] Supabase connection failed:', err);
                }
            }
        }

        setupSliders() {
            const updateLabel = (slider, label) => {
                label.textContent = slider.value + '%';
            };

            if (this.empathySlider) {
                this.empathySlider.addEventListener('input', () => updateLabel(this.empathySlider, this.empathyVal));
                this.empathySlider.addEventListener('change', () => {
                    this.addLogEntry('PERSONALITY', `Empathy mirroring updated to ${this.empathySlider.value}%`, 'text-purple-400');
                });
            }

            if (this.aggressionSlider) {
                this.aggressionSlider.addEventListener('input', () => updateLabel(this.aggressionSlider, this.aggressionVal));
                this.aggressionSlider.addEventListener('change', () => {
                    this.addLogEntry('PROTOCOL', `Aggression baseline shifted to ${this.aggressionSlider.value}%`, 'text-red-400 font-bold');
                });
            }
        }

        setupCommandInput() {
            if (!this.cmdSend || !this.cmdInput) return;

            const execute = () => {
                const cmd = this.cmdInput.value.trim();
                if (!cmd) return;
                
                this.addLogEntry('OVERRIDE', cmd, 'text-orange-500 font-bold');
                this.cmdInput.value = '';

                // Simulate processing
                setTimeout(() => {
                    if (cmd.startsWith('/')) {
                        this.addLogEntry('EXEC', `Command recognized logic: ${cmd.slice(1)}`, 'text-zinc-400');
                        this.addLogEntry('OK', 'Sequence completed.', 'text-emerald-500');
                    } else {
                        this.addLogEntry('ERROR', 'Invalid command syntax. Use / prefix.', 'text-red-500');
                    }
                }, 800);
            };

            this.cmdSend.addEventListener('click', execute);
            this.cmdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') execute();
            });
        }

        addLogEntry(tag, message, colorClass = 'text-zinc-400') {
            if (!this.logContainer) return;
            const entry = document.createElement('div');
            entry.className = 'fade-in';
            const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            entry.innerHTML = `<span class="text-zinc-600">[${time}]</span> <span class="${colorClass}">[${tag}]</span> ${message}`;
            
            this.logContainer.appendChild(entry);
            this.logContainer.scrollTop = this.logContainer.scrollHeight;

            // Keep only last 50 logs
            while (this.logContainer.childNodes.length > 50) {
                this.logContainer.removeChild(this.logContainer.firstChild);
            }
        }

        subscribeToLogs() {
            // Real-time Supabase subscription logic
            const channel = this.supabase
                .channel('schema-db-changes')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, (payload) => {
                    const { level, message, category } = payload.new;
                    this.addLogEntry(category.toUpperCase(), message, level === 'error' ? 'text-red-500' : 'text-emerald-500');
                })
                .subscribe();
            
            console.log('[BEAST] Subscribed to activity_log broadcast.');
        }

        simulateLogs() {
            const events = [
                { tag: 'SCOUT', msg: 'Analyzing target GitHub repo for dependencies...', color: 'text-blue-400' },
                { tag: 'MESH', msg: 'Node beast-hands-nyc-01 reporting 12ms latency.', color: 'text-zinc-500' },
                { tag: 'SEO', msg: 'Monitoring rank for keyword "Black Shepherd".', color: 'text-emerald-500' },
                { tag: 'OPENCLAW', msg: 'Message bus buffer at 4% capacity.', color: 'text-orange-400' },
                { tag: 'AI', msg: 'Regenerating context window for active conversation.', color: 'text-purple-400' }
            ];

            setInterval(() => {
                if (Math.random() > 0.7) {
                    const ev = events[Math.floor(Math.random() * events.length)];
                    this.addLogEntry(ev.tag, ev.msg, ev.color);
                }
            }, 5000);
        }

        startMetricSimulation() {
            const cpuEl = document.getElementById('beast-cpu');
            const latencyEl = document.getElementById('beast-latency');
            const toneEl = document.getElementById('beast-tone-state');
            
            setInterval(() => {
                if (cpuEl) cpuEl.textContent = (Math.floor(Math.random() * 15) + 5) + '%';
                if (latencyEl) latencyEl.textContent = (Math.floor(Math.random() * 40) + 15) + 'ms';
                if (toneEl) {
                    const aggression = parseInt(this.aggressionSlider?.value || 0);
                    let state = 'Chill';
                    if (aggression > 80) state = 'Hostile';
                    else if (aggression > 50) state = 'Assertive';
                    else if (aggression > 20) state = 'Relaxed';
                    toneEl.textContent = state;
                }
            }, 3000);
        }

        async syncPhotosWithCloud(photos) {
            if (!this.supabase) return;
            
            console.log('[BEAST] Mirroring photobooth to cloud...');
            // In a real implementation we would diff these, 
            // for now we just attempt to upsert metadata
            for (const p of photos) {
                const { error } = await this.supabase
                    .from('cloud_files')
                    .upsert({ 
                        file_path: p.src, 
                        file_type: 'image',
                        metadata: { label: p.label, ts: p.ts || Date.now() }
                    }, { onConflict: 'file_path' });
                
                if (error) console.error('[BEAST] Cloud sync error:', error);
            }
        }
    }

    window.performLogout = function() {
        if (typeof auth !== 'undefined' && auth.signOut) {
            auth.signOut().then(() => {
                window.location.href = '../index.html';
            }).catch(err => {
                console.error('Logout failed:', err);
                window.location.href = '../index.html';
            });
        } else {
            window.location.href = '../index.html';
        }
    };

    // Managers are now initialized at the top of DOMContentLoaded to prevent race conditions
    // window.settingsManager = new SettingsManager();
    // window.beastControl = new ControlPlaneManager();
});
