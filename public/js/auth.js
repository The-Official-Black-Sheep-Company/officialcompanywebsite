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
                    if (user.emailVerified) {
                        console.log('Logged in as:', user.email);
                        window.location.href = 'portal.html';
                    } else {
                        // User not verified - show alert and sign out to prevent auto-portal-redirect
                        alert('Identity not yet verified. Please check your inbox for the activation protocol.');
                        user.sendEmailVerification().then(() => {
                           console.log('Resent verification email');
                        });
                        auth.signOut();
                    }
                })
                .catch((error) => {
                    alert(`Authorization Failed: ${error.message}`);
                });
        });
    }

    // Handle Google Sign-In
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    console.log('Google identity verified:', result.user.displayName);
                    // Google users are automatically verified
                    window.location.href = 'portal.html';
                }).catch((error) => {
                    alert(`Nexus Connection Error: ${error.message}`);
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
                    const user = userCredential.user;
                    console.log('Identity Created:', user.email);
                    
                    // Send verification email
                    user.sendEmailVerification().then(() => {
                        alert('Success! Registration initiated. Please check your inbox for the activation link.');
                        auth.signOut().then(() => {
                            window.location.href = 'login.html';
                        });
                    }).catch(err => {
                        console.error('Signal Error:', err);
                        alert('Account created, but failed to send verification signal. Please try logging in.');
                    });
                })
                .catch((error) => {
                    alert(`Recruitment Failed: ${error.message}`);
                });
        });
    }

    // Observer for auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Authorized Identity detected:', user.email);
            if (userEmailElement) {
                userEmailElement.textContent = user.email;
            }

            // Redirect if verified and on auth pages
            if (user.emailVerified) {
                const path = window.location.pathname;
                if (path.includes('login.html') || path.includes('signup.html')) {
                    window.location.href = 'portal.html';
                }
            }
        }
    });

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut().then(() => {
                window.location.href = '../index.html';
            }).catch((error) => {
                console.error('De-authorization failed:', error);
            });
        });
    }
});
