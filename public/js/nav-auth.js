/**
 * nav-auth.js
 * Shared nav script: swaps Login/SignUp buttons for Avatar + Dropdown when authenticated.
 * Include this script AFTER firebase-config.js on any page.
 */

(function () {
    function initNavAuth() {
        const authBtnsContainer = document.getElementById('auth-buttons-container');
        const avatarContainer   = document.getElementById('user-avatar-container');
        const avatarImg         = document.getElementById('user-avatar-img');
        const emailDisplay      = document.getElementById('user-email-display');

        // Inject the full dropdown into the avatar container if not already present
        if (avatarContainer && !avatarContainer.querySelector('#user-nav-dropdown')) {
            avatarContainer.innerHTML = `
                <button id="user-avatar-btn"
                    class="flex items-center gap-2 p-1 rounded-full border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 transition-all duration-300"
                    aria-label="User menu" aria-haspopup="true" aria-expanded="false">
                    <img id="user-avatar-img" src="" alt="User avatar"
                        class="w-8 h-8 rounded-full border border-violet-400/50 object-cover bg-zinc-800">
                    <span id="user-email-display"
                        class="hidden md:inline text-[10px] text-violet-300 font-['Orbitron'] tracking-widest px-1 max-w-[120px] truncate"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-violet-400 mr-1" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>

                <!-- Dropdown Menu -->
                <div id="user-nav-dropdown"
                    class="absolute right-0 top-full mt-2 w-52 z-50 hidden
                           bg-zinc-950/90 backdrop-blur-md border border-zinc-800
                           rounded-2xl shadow-2xl shadow-black/50 overflow-hidden
                           transition-all duration-200 origin-top-right">
                    <!-- User info header -->
                    <div class="px-4 py-3 border-b border-zinc-800">
                        <p id="dropdown-name" class="text-xs font-bold text-white truncate">Loading...</p>
                        <p id="dropdown-email" class="text-[10px] text-zinc-500 truncate"></p>
                    </div>
                    <!-- Nav Links -->
                    <div class="py-1">
                        <a href="html/portal.html"
                            class="flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
                                <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
                            </svg>
                            Portal
                        </a>
                        <a href="html/portal.html#dashboard"
                            class="flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/>
                            </svg>
                            Dashboard
                        </a>
                        <a href="html/portal.html#feeds"
                            class="flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>
                            </svg>
                            Live Feed
                        </a>
                        <a href="#" id="nav-settings-btn"
                            class="flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            Settings
                        </a>
                    </div>
                    <!-- Divider + Logout -->
                    <div class="border-t border-zinc-800 py-1">
                        <button id="nav-logout-btn"
                            class="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            `;

            // Toggle dropdown on avatar button click
            const btn      = avatarContainer.querySelector('#user-avatar-btn');
            const dropdown = avatarContainer.querySelector('#user-nav-dropdown');
            if (btn && dropdown) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = !dropdown.classList.contains('hidden');
                    dropdown.classList.toggle('hidden', isOpen);
                    btn.setAttribute('aria-expanded', String(!isOpen));
                });
                // Close on outside click
                document.addEventListener('click', () => {
                    dropdown.classList.add('hidden');
                    btn.setAttribute('aria-expanded', 'false');
                });
            }

            // Logout handler
            avatarContainer.querySelector('#nav-logout-btn')?.addEventListener('click', () => {
                if (window.auth) {
                    window.auth.signOut().then(() => {
                        window.location.reload();
                    });
                }
            });

            // Settings link — opens portal settings modal if on portal, otherwise redirects
            avatarContainer.querySelector('#nav-settings-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = document.getElementById('settings-modal');
                if (modal) {
                    modal.classList.remove('hidden');
                    setTimeout(() => modal.classList.add('opacity-100'), 10);
                } else {
                    window.location.href = 'html/portal.html#settings';
                }
            });
        }

        // Listen to Firebase auth state
        if (!window.auth) {
            console.warn('[nav-auth] Firebase auth not yet available. Retrying...');
            setTimeout(initNavAuth, 500);
            return;
        }

        window.auth.onAuthStateChanged((user) => {
            if (user) {
                // Authenticated — hide login/signup, show avatar
                if (authBtnsContainer) authBtnsContainer.style.display = 'none';
                if (avatarContainer)   avatarContainer.style.display   = 'block';

                // Set avatar image (use Google photo if available, else initials fallback)
                const img    = avatarContainer.querySelector('#user-avatar-img');
                const email  = avatarContainer.querySelector('#user-email-display');
                const dName  = avatarContainer.querySelector('#dropdown-name');
                const dEmail = avatarContainer.querySelector('#dropdown-email');

                if (img) {
                    if (user.photoURL) {
                        img.src = user.photoURL;
                    } else {
                        // Generate initials avatar
                        const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
                        img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=f97316&color=000&size=64&bold=true`;
                    }
                }
                if (email)  email.textContent  = user.displayName || user.email.split('@')[0];
                if (dName)  dName.textContent   = user.displayName || 'User';
                if (dEmail) dEmail.textContent  = user.email;

            } else {
                // Not authenticated — show login/signup, hide avatar
                if (authBtnsContainer) authBtnsContainer.style.display = '';
                if (avatarContainer)   avatarContainer.style.display   = 'none';
            }
        });
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavAuth);
    } else {
        initNavAuth();
    }
})();
