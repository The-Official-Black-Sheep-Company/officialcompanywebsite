// Firebase auth is initialized in firebase-config.js and available as 'auth' globally

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const googleSignInButton = document.getElementById('google-signin-button');
    const userEmailElement = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');

    // Handle Email/Password Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Logged in as:', user.email);
                    window.location.href = 'portal.html';
                })
                .catch((error) => {
                    alert(`Error: ${error.message}`);
                });
        });
    }

    // Handle Google Sign-In
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    console.log('Google sign-in successful:', result.user.displayName);
                    window.location.href = 'portal.html';
                }).catch((error) => {
                    alert(`Google sign-in error: ${error.message}`);
                });
        });
    }

    // Handle Sign-Up
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log('Signed up as:', userCredential.user.email);
                    window.location.href = 'portal.html';
                })
                .catch((error) => {
                    alert(`Signup error: ${error.message}`);
                });
        });
    }

    // Observer for auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is signed in:', user.email);
            if (userEmailElement) {
                userEmailElement.textContent = user.email;
            }
            // Auto-redirect if on login or signup pages
            const path = window.location.pathname;
            if (path.includes('login.html') || path.includes('signup.html')) {
                window.location.href = 'portal.html';
            }
        }
    });

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut().then(() => {
                window.location.href = '../index.html';
            }).catch((error) => {
                console.error('Logout error:', error);
            });
        });
    }
});
