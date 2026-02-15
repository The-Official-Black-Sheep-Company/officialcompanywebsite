
// Use proxied API path - works for both HTTP and HTTPS, no mixed content issues
const API_BASE_URL = '/api/';

import { auth } from './firebase-config.js'; // Import the auth object
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';

// Global reference for current user
let currentUser = null;

function initFirebaseAuth() {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.displayName || user.email);
            if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
                window.location.href = './html/portal.html';
            }
        } else {
            // User is signed out
            console.log('User is signed out.');
            if (window.location.pathname.endsWith('portal.html')) {
                window.location.href = '../index.html';
            }
        }
        updateUI();
    });
}

function updateUI() {
    const authButtonsContainer = document.getElementById('auth-buttons-container');
    const userAvatarContainer = document.getElementById('user-avatar-container');
    const userAvatarImg = document.getElementById('user-avatar-img');

    if (currentUser) {
        // User is signed in
        if (authButtonsContainer) authButtonsContainer.style.display = 'none';
        if (userAvatarContainer) {
            userAvatarContainer.style.display = 'block';
            userAvatarImg.src = currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName ? currentUser.displayName.substring(0, 2) : currentUser.email.substring(0, 2).toUpperCase()}&background=FBBF24&color=000&size=128`;
        }
    } else {
        // User is signed out
        if (authButtonsContainer) authButtonsContainer.style.display = 'flex';
        if (userAvatarContainer) userAvatarContainer.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initFirebaseAuth();

    const googleSignInButton = document.getElementById('google-signin-button');
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log("Google Sign-In successful!", result.user);
                })
                .catch((error) => {
                    console.error("Google Sign-In error:", error);
                    alert(`Google Sign-In failed: ${error.message}`);
                });
        });
    }

    const signOutButton = document.getElementById('signout-button');
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                console.log("User signed out.");
            }).catch((error) => {
                console.error("Sign-out error:", error);
                alert(`Sign-out failed: ${error.message}`);
            });
        });
    }

    // Tab switching logic
    const tabs = document.querySelectorAll('.tab-dropdown .tab-button');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Hide all sections
            document.querySelectorAll('.server-section, .content-section').forEach(section => {
                section.style.display = 'none';
            });

            // Show the correct section based on the tab clicked
            const sectionId = tab.parentElement.querySelector('.dropdown-menu').children[0].getAttribute('onclick').match(/\('([^\)]+)'\)/)[1];
            showSection(sectionId);
        });
    });
});


// Show a specific server/content section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.server-section, .content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}
