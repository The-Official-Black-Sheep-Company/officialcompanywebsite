
// Use proxied API path - works for both HTTP and HTTPS, no mixed content issues
const API_BASE_URL = '/api/';

// Firebase imports
import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';

let currentUser = null;

// --- Authentication ---
function initFirebaseAuth() {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        updateUIVisibility();
        if (user && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
            // Redirect to portal if logged in on the main page
            window.location.href = 'html/portal.html';
        }
    });
}

function updateUIVisibility() {
    const authButtons = document.getElementById('auth-buttons-container');
    const avatarContainer = document.getElementById('user-avatar-container');
    const avatarImg = document.getElementById('user-avatar-img');

    if (currentUser) {
        // User is signed in
        if (authButtons) authButtons.style.display = 'none';
        if (avatarContainer) avatarContainer.style.display = 'block';
        if (avatarImg) {
            avatarImg.src = currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email)}&background=FBBF24&color=000&size=128`;
        }
    } else {
        // User is signed out
        if (authButtons) authButtons.style.display = 'flex';
        if (avatarContainer) avatarContainer.style.display = 'none';
    }
}

function handleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(result => console.log("Sign-in successful", result.user))
        .catch(error => console.error("Sign-in error", error));
}

function handleSignOut() {
    signOut(auth).then(() => {
        console.log("User signed out");
        // Redirect to home page after sign-out
        if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('index.html')) {
            window.location.href = '../index.html';
        }
    }).catch(error => console.error("Sign-out error", error));
}


// --- Content Section & Tab Management ---

function showSection(sectionId) {
    // Hide all main content sections first
    document.querySelectorAll('.server-section, .content-section').forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else {
        console.warn(`Section with ID '${sectionId}' not found.`);
    }

    // Optional: Special handling for certain sections
    if (sectionId === 'ProductsContent') {
        loadProducts(); 
    }
    if (sectionId === 'APIKeys') {
        loadEbayConfig();
        checkEndpointStatus();
        refreshNotifications();
    }
}

function showServiceContent(serviceName) {
    showSection('ServicesContent'); // Show the container
    const serviceContent = document.querySelector('#ServicesContent .service-content');
    
    // Your existing logic to populate serviceContent based on serviceName
    const serviceData = {
        'JunkRemoval': { title: 'Junk Removal', html: '<h2>Junk Removal Service</h2><p>Contact us for junk removal services.</p>' },
        'MovingHauling': { title: 'Moving & Hauling', html: '<h2>Moving & Hauling Service</h2><p>Professional moving and hauling services.</p>' },
        // ... add other services
    };

    if (serviceContent && serviceData[serviceName]) {
        serviceContent.innerHTML = serviceData[serviceName].html;
    }
}

function showShoppingContent(platformName) {
    showSection('ShoppingContent');
     const shoppingContent = document.querySelector('#ShoppingContent .shopping-content');
    // Your existing logic to populate shoppingContent
}

function showProductsContent() {
    showSection('ProductsContent');
}

function showBlogTab(tabName) {
    showSection('Blogs'); // Show the main blog container
    // Hide all blog content
    document.querySelectorAll('.blog-content').forEach(content => {
        content.style.display = 'none';
    });
    // Show the selected blog content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }

    // Update active state for subtabs
    document.querySelectorAll('.blog-subtab').forEach(button => {
        button.classList.remove('active');
    });
    const activeButton = document.querySelector(`.blog-subtab[onclick*="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}


// --- DOMContentLoaded - Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initFirebaseAuth();

    // --- Auth Buttons ---
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const logoutLink = document.getElementById('logout-link');

    if (loginButton) loginButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        window.location.href = 'html/login.html';
    });
    if (signupButton) signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'html/signup.html';
    });
    if (logoutLink) logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleSignOut();
    });

    // --- Tab & Dropdown Link Event Handling ---
    document.querySelectorAll('.tab-button, .dropdown-menu a, .submenu a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle supplemental UI logic, let the browser handle the onclick attribute
            
            // Close dropdowns after selection
            if (this.closest('.dropdown-menu')) {
                const menu = this.closest('.dropdown-menu');
                menu.style.display = 'none';
                setTimeout(() => {
                    menu.style.display = '';
                }, 100);
            }

            // Update active state for top-level tabs
            if (this.classList.contains('tab-button')) {
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active-selection');
                });
                this.classList.add('active-selection');
            }
        });
    });
});

// Make functions globally available so inline `onclick` attributes can find them
window.showSection = showSection;
window.showServiceContent = showServiceContent;
window.showShoppingContent = showShoppingContent;
window.showProductsContent = showProductsContent;
window.showBlogTab = showBlogTab;
// ... add other globally needed functions from your original index.js like loadProducts, etc.
