
import { auth } from './firebase-config.js';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const googleSignInButton = document.getElementById('google-signin-button');
    const userEmailElement = document.getElementById('user-email'); // Assuming you have an element to display the user's email
    const logoutButton = document.getElementById('logout-button'); // Assuming you have a logout button

    // Handle Email/Password Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log('Logged in as:', user.email);
                    window.location.href = 'portal.html'; // Redirect to portal on successful login
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(`Error: ${errorMessage}`);
                });
        });
    }

    // Handle Google Sign-In
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    console.log('Google sign-in successful:', user.displayName);
                    window.location.href = 'portal.html'; // Redirect to portal
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    alert(`Google sign-in error: ${errorMessage}`);
                });
        });
    }

    // Handle Sign-Up (if you have a separate signup form)
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    console.log('Signed up as:', user.email);
                    window.location.href = 'portal.html'; // Redirect to portal after signup
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(`Signup error: ${errorMessage}`);
                });
        });
    }

    // Observer for auth state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            console.log('User is signed in:', user.email);
            if (userEmailElement) {
                userEmailElement.textContent = user.email;
            }
            if(window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')){
                window.location.href = 'portal.html';
            }
        } else {
            // User is signed out
            console.log('User is signed out');
        }
    });

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut().then(() => {
                // Sign-out successful.
                console.log('User logged out');
                window.location.href = '../index.html'; // Redirect to home page after logout
            }).catch((error) => {
                // An error happened.
                console.error('Logout error:', error);
            });
        });
    }
});
