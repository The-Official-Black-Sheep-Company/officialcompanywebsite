console.log('Auth Protocol: Script Loaded');
alert('Auth Protocol: Handshake Initiated. If you see this, the authentication script is active.');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth Protocol: DOM Content Loaded');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const googleSignInButton = document.getElementById('google-signin-button');
    const userEmailElement = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const togglePasswordBtn = document.getElementById('toggle-password');

    console.warn('Auth Protocol: System Check', { 
        loginForm: !!loginForm, 
        signupForm: !!signupForm, 
        google: !!googleSignInButton,
        firebaseExist: typeof firebase !== 'undefined'
    });

    // Password Visibility Toggle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const passwordInput = document.getElementById('login-password') || document.getElementById('signup-password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon visual state if needed
            togglePasswordBtn.classList.toggle('text-violet-400');
        });
    }

    // Handle Email/Password Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            console.log('Identity Handshake: Initiating check for', email);

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Account state check:', user.email, 'Verified:', user.emailVerified);
                    
                    if (user.emailVerified) {
                        console.log('Authorization Success. Transitioning to portal...');
                        window.location.href = 'portal.html';
                    } else {
                        console.warn('Identity not verified for:', user.email);
                        alert('Identity not yet verified. Please check your inbox for the activation protocol.');
                        
                        // Send verification if not recently sent (Firebase handles throttle)
                        user.sendEmailVerification().then(() => {
                            console.log('Verification signal resent.');
                        }).catch(err => console.error('Signal resend failed:', err));

                        // Explicit sign out to clear session
                        auth.signOut();
                    }
                })
                .catch((error) => {
                    console.error('Authorization Error:', error.code, error.message);
                    let userFriendlyMsg = `Authorization Failed: ${error.message}`;
                    if (error.code === 'auth/user-not-found') userFriendlyMsg = "Identity check failed: No record found with this handle.";
                    if (error.code === 'auth/wrong-password') userFriendlyMsg = "Identity check failed: Password mismatch detected.";
                    if (error.code === 'auth/invalid-email') userFriendlyMsg = "Identity check failed: Handle format invalid.";
                    
                    alert(userFriendlyMsg);
                    console.trace('Auth Error Source');
                });
        });
    }

    // Handle Google Sign-In
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            console.log('Initiating Google Nexus Handshake...');
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    console.log('Google identity verified:', result.user.displayName);
                    // Google users are automatically verified - transition immediately
                    window.location.href = 'portal.html';
                }).catch((error) => {
                    console.error('Google Nexus Error:', error.code, error.message);
                    if (error.code === 'auth/popup-blocked') {
                        alert("Nexus Connection Blocked: Please enable popups to sign in with Google.");
                    } else if (error.code === 'auth/cancelled-popup-request') {
                        console.log('Popup closed by user.');
                    } else {
                        alert(`Nexus Connection Error: ${error.message}`);
                    }
                });
        });
    }

    // Handle Sign-Up
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            console.log('Recruitment Protocol: Initiating for', email);

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Identity Record Created:', user.email);
                    
                    // Send verification email immediately
                    user.sendEmailVerification().then(() => {
                        console.log('Verification signal dispatched.');
                        alert('Success! Registration initiated. Please check your inbox for the activation link.');
                        
                        // Redirect to login after a short delay to allow state to settle
                        setTimeout(() => {
                            auth.signOut().then(() => {
                                window.location.href = 'login.html';
                            });
                        }, 1000);
                    }).catch(err => {
                        console.error('Signal dispatch failure:', err);
                        alert('Account created, but failed to send verification signal. Please try logging in to resend.');
                        auth.signOut().then(() => {
                            window.location.href = 'login.html';
                        });
                    });
                })
                .catch((error) => {
                    console.error('Recruitment Error:', error.code, error.message);
                    let userFriendlyMsg = `Recruitment Failed: ${error.message}`;
                    if (error.code === 'auth/email-already-in-use') userFriendlyMsg = "Recruitment conflict: This handle is already registered.";
                    if (error.code === 'auth/weak-password') userFriendlyMsg = "Recruitment failure: Password strength insufficient (needs 6+ chars).";
                    
                    alert(userFriendlyMsg);
                });
        });
    }

    // Observer for auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Identity Detected: Active session for', user.email);
            if (userEmailElement) {
                userEmailElement.textContent = user.email;
            }

            // Global auto-redirect only if verified
            if (user.emailVerified) {
                const path = window.location.pathname;
                if (path.includes('login.html') || path.includes('signup.html')) {
                    console.log('Identity Confirmed: Redirecting to Portal.');
                    window.location.href = 'portal.html';
                }
            } else {
                console.warn('Identity Pending: Email verification required.');
            }
        } else {
            console.log('Identity Status: No session active.');
        }
    });

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log('De-authorization requested...');
            auth.signOut().then(() => {
                window.location.href = '../index.html';
            }).catch((error) => {
                console.error('De-authorization failed:', error);
            });
        });
    }
});
