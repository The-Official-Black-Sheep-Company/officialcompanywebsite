// Use global API base URL - works for both HTTP and HTTPS
const API_BASE_URL = '/api/';

// Auth state tracking
var currentUser = null;

// --- Authentication ---
function initFirebaseAuth() {
    // Assuming 'auth' is globally defined in firebase-config.js
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged((user) => {
            currentUser = user;
            updateUIVisibility();
            checkAccess(); // RBAC check
            
            if (user && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
                console.log("User is authenticated:", user.email || "No email");
                // Redirect REMOVED - allow using landing page with slideshow
                
                // --- Handle Hash Navigation on Login/Load ---
                handleHashNavigation();
            }
        });
    }
}

// Add event listener for hash changes
window.addEventListener('hashchange', handleHashNavigation);

function handleHashNavigation() {
    const hash = window.location.hash.substring(1); // Remove #
    if (hash) {
        // Special mapping if needed, otherwise use hash directly
        const sectionId = hash;
        if (typeof showSection === 'function') {
            showSection(sectionId);
            // Scroll to content for better UX
            const target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

function updateUIVisibility() {
    const authButtons = document.getElementById('auth-buttons-container');
    const avatarContainer = document.getElementById('user-avatar-container');
    const avatarImg = document.getElementById('user-avatar-img');

    if (currentUser) {
        // Only show logged-in UI if verified
        if (currentUser.emailVerified) {
            if (authButtons) authButtons.style.display = 'none';
            if (avatarContainer) avatarContainer.style.display = 'block';
            if (avatarImg) {
                avatarImg.src = currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email)}&background=FBBF24&color=000&size=128`;
            }
        } else {
            // Logged in but unverified - show buttons (or a separate indicator)
            if (authButtons) authButtons.style.display = 'flex';
            if (avatarContainer) avatarContainer.style.display = 'none';
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (avatarContainer) avatarContainer.style.display = 'none';
    }
}

function handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            console.log("Nexus connected:", result.user.email);
            // Google users are pre-verified
            updateUIVisibility();
        })
        .catch(error => {
            console.error("Connection failed:", error);
            alert(`Nexus Handshake Failed: ${error.message}`);
        });
}

function handleSignOut() {
    auth.signOut().then(() => {
        console.log("De-authorized");
        currentUser = null;
        updateUIVisibility();
        checkAccess();
        if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('index.html')) {
            window.location.href = '../index.html';
        }
    }).catch(error => console.error("Disconnect error:", error));
}

// Role-Based Access Control
function checkAccess() {
    const isVerified = currentUser && currentUser.emailVerified;
    const isEmployee = isVerified; // Only verified users get access

    const tabsContainer = document.querySelector('.tabs-container');
    if (!tabsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.tab-dropdown');
    
    const restrictedIndices = [1, 3, 4, 5, 7, 9];

    tabs.forEach((tab, index) => {
        if (restrictedIndices.includes(index)) {
            tab.style.display = isEmployee ? 'block' : 'none';
        } else {
            tab.style.display = 'block'; // Always show public tabs
        }
    });
}

// --- Content Section & Tab Management ---

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.server-section, .content-section, .blog-content').forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');

        // Reposition gold cross on new tab/section
        if (typeof window.repositionGoldCross === 'function') {
            window.repositionGoldCross();
        }

        // Update active classes for tabs
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-selection'));
        
        // Match section to tab (finding by index as a fallback)
        const tabs = document.querySelectorAll('.tab-button');
        // Indices updated for new "Blue" position
        if (sectionId === 'APIKeys') tabs[1]?.classList.add('active-selection');
        if (sectionId === 'BibleStudy') tabs[2]?.classList.add('active-selection');
        if (sectionId === 'Blogs') tabs[3]?.classList.add('active-selection');
        if (sectionId === 'ProductsContent') tabs[7]?.classList.add('active-selection'); // Shopping index
        
        // HeroSlideshow is treated as the default view
        if (sectionId !== 'HeroSlideshow') {
            const hero = document.getElementById('HeroSlideshow');
            if (hero) hero.classList.add('hidden');
        }
    } else if (!sectionId) {
        // Default to Hero if no section selected
        const hero = document.getElementById('HeroSlideshow');
        if (hero) hero.classList.remove('hidden');
    }

    if (sectionId === 'ProductsContent') loadProducts();
    if (sectionId === 'APIKeys') {
        loadEbayConfig();
        checkEndpointStatus();
        refreshNotifications();
    }
}

function showServiceContent(serviceName) {
    showSection('ServicesContent');
    
    // Reposition gold cross when service content changes as well
    if (typeof window.repositionGoldCross === 'function') {
        window.repositionGoldCross();
    }

    const serviceContent = document.querySelector('#ServicesContent .service-content');
    const serviceData = {
        'JunkRemoval': { title: 'Junk Removal', html: '<h2>Junk Removal Service</h2><p>Call swoop geezy at 555-black-sheep for rates!!</p>' },
        'MovingHauling': { title: 'Moving & Hauling', html: '<h2>Moving & Hauling Service</h2><p>Professional moving and hauling services.</p>' },
        'DogWalking': { title: 'Dog Walking', html: '<h2>Dog Walking Service</h2><p>Reliable dog walking services.</p>' },
        'CleaningCommercial': { title: 'Cleaning - Commercial', html: '<h2>Commercial Cleaning Services</h2><p>Professional commercial cleaning.</p>' },
        'CleaningResidential': { title: 'Cleaning - Residential', html: '<h2>Residential Cleaning Services</h2><p>Quality residential cleaning.</p>' },
        'CellphoneRepair': { title: 'Cellphone Repair', html: '<h2>Cellphone Repair Service</h2><p>Fast and affordable cellphone repairs.</p>' },
        'MobileLaundryMat': { title: 'Mobile Laundry Mat', html: '<h2>Mobile Laundry Mat</h2><p>On-demand laundry services.</p>' }
    };
    if (serviceContent && serviceData[serviceName]) {
        serviceContent.innerHTML = serviceData[serviceName].html;
    }
}

function showShoppingContent(platformName) {
    showSection('ShoppingContent');
    const shoppingContent = document.querySelector('#ShoppingContent .shopping-content');
    const platformData = {
        'eBay': { title: 'eBay', html: '<h2>eBay Store</h2><p><a href="https://www.ebay.com/usr/blackshepherd" target="_blank">Go to eBay</a></p>' },
        'Shopify': { title: 'Shopify', html: '<h2>Shopify Store</h2><p><a href="https://shopify.com" target="_blank">Go to Shopify</a></p>' },
    };
    if (shoppingContent && platformData[platformName]) {
        shoppingContent.innerHTML = platformData[platformName].html;
    }
}

function showBlogTab(tabName) {
    showSection('Blogs');
    document.querySelectorAll('.blog-content').forEach(content => {
        content.classList.add('hidden');
    });
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }
    document.querySelectorAll('.blog-subtab').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(tabName)) {
            button.classList.add('active');
        }
    });
}

// --- Status & Control Logic ---

const randomColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe', '#00b894', '#e17055'];

function getRandomColor() {
    return randomColors[Math.floor(Math.random() * randomColors.length)];
}

function isLightColor(color) {
    let hex = color.replace('#', '');
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);
    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

function setButtonColor(buttonElement, bgColor) {
    buttonElement.style.backgroundColor = bgColor;
    buttonElement.style.color = isLightColor(bgColor) ? '#000000' : '#ffffff';
}

function checkAllStatuses() {
    document.querySelectorAll('.app-button').forEach(button => {
        const appName = button.getAttribute('data-app-name');
        if (appName) checkStatus(appName, button);
    });
}

function checkStatus(appName, buttonElement) {
    fetch(API_BASE_URL + 'status/' + appName)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'running') {
                buttonElement.classList.replace('off', 'on');
                setButtonColor(buttonElement, getRandomColor());
            } else {
                buttonElement.classList.replace('on', 'off');
                buttonElement.removeAttribute('style');
            }
        })
        .catch(err => console.error('Error checking status:', appName, err));
}

function toggleStatus(appName, currentStatus, uniqueColor, buttonElement) {
    fetch(API_BASE_URL + 'toggle/' + appName, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'running') {
                buttonElement.classList.replace('off', 'on');
                setButtonColor(buttonElement, getRandomColor());
            } else {
                buttonElement.classList.replace('on', 'off');
                buttonElement.removeAttribute('style');
            }
        })
        .catch(err => console.error('Error toggling status:', appName, err));
}

// --- Product Loading ---

function loadProducts() {
    fetch(API_BASE_URL + 'products')
        .then(res => res.json())
        .then(data => {
            const countElement = document.getElementById('product-count');
            if (countElement) countElement.textContent = `${data.count || 0} Products`;
            
            const productGrid = document.getElementById('product-grid');
            if (productGrid) {
                productGrid.innerHTML = (data.all || []).map(p => `
                    <div class="product-card">
                        <img src="${p.image}" alt="${p.name}">
                        <h3>${p.name}</h3>
                        <p>$${(p.price || 0).toFixed(2)}</p>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading products:', err));
}

// --- eBay Config ---

async function loadEbayConfig() {
    try {
        const res = await fetch(API_BASE_URL + 'ebay/config');
        if (res.ok) {
            const config = await res.json();
            const tokenEl = document.getElementById('verificationToken');
            if (tokenEl) {
                tokenEl.textContent = config.verification_token || 'Not configured';
                tokenEl.style.color = config.is_configured ? '#00ff00' : '#ff5555';
            }
        }
    } catch (err) { console.error('eBay config error:', err); }
}

async function checkEndpointStatus() {
    try {
        const res = await fetch(API_BASE_URL + 'ebay/endpoint-status');
        const data = await res.json();
        const el = document.getElementById('endpointStatus');
        if (el) { el.textContent = data.status || 'Active'; el.style.color = '#28a745'; }
    } catch (err) { console.error('eBay status error:', err); }
}

async function refreshNotifications() {
    try {
        const res = await fetch(API_BASE_URL + 'ebay/notifications');
        const data = await res.json();
        const log = document.getElementById('notificationLog');
        if (log) log.innerHTML = (data.notifications || []).length > 0 ? 'Notifications loaded' : 'No notifications';
    } catch (err) { console.error('eBay notifications error:', err); }
}

// --- Main Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    initFirebaseAuth();
    
    // Ensure slideshow is visible if starting on index.html
    if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
        showSection('HeroSlideshow');
    }

    // Support for inline onclick and UI cleanup
    document.querySelectorAll('.tab-button, .dropdown-menu a, .submenu a').forEach(link => {
        link.addEventListener('click', function(e) {
            const menu = this.closest('.dropdown-menu');
            if (menu) {
                menu.style.display = 'none';
                setTimeout(() => menu.style.display = '', 100);
            }
        });
    });

    // Logout listener
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleSignOut();
        });
    }

    // Periodic status checks
    checkAllStatuses();
    setInterval(checkAllStatuses, 5000);
});

// Explicitly expose to window for inline onclick availability
window.showSection = showSection;
window.showServiceContent = showServiceContent;
window.showShoppingContent = showShoppingContent;
window.showProductsContent = () => showSection('ProductsContent');
window.showBlogTab = showBlogTab;
window.toggleStatus = toggleStatus;
window.loadProducts = loadProducts;
window.handleSignOut = handleSignOut;
