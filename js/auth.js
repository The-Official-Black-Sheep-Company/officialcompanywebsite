document.addEventListener("DOMContentLoaded", function() {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const authButtonsContainer = document.querySelector("#auth-buttons-container");
    const userAvatarContainer = document.querySelector("#user-avatar-container");
    const userAvatarImg = document.querySelector("#user-avatar-img");
    const logoutLink = document.querySelector("#logout-link");

    // Monitor authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (user.emailVerified) {
                // Show avatar and hide login/signup
                authButtonsContainer.style.display = "none";
                userAvatarContainer.style.display = "block";
                if (user.photoURL) {
                    userAvatarImg.src = user.photoURL;
                } else {
                    // Optional: a default avatar if the user has no photo
                    userAvatarImg.src = "https://via.placeholder.com/40"; 
                }
                console.log("User is logged in:", user.email);
            } else {
                // User is not verified, ensure they are logged out from the UI
                authButtonsContainer.style.display = "flex";
                userAvatarContainer.style.display = "none";
            }
        } else {
            // User is signed out
            authButtonsContainer.style.display = "flex";
            userAvatarContainer.style.display = "none";
            console.log("User is logged out.");
        }
    });

    // Logout functionality
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                window.location.href = "/index.html"; // Redirect to home page after logout
            }).catch((error) => {
                console.error("Logout failed:", error);
                alert("Logout failed. Please try again.");
            });
        });
    }

    // Your existing form and Google sign-in logic...
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // Function to save user data to Firestore
    const saveUserToFirestore = (user) => {
        const userRef = db.collection("users").doc(user.uid);
        userRef.get().then((doc) => {
            if (!doc.exists) {
                userRef.set({
                    email: user.email,
                    displayName: user.displayName || null,
                    photoURL: user.photoURL || null,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    emailVerified: user.emailVerified
                });
            }
        });
    };

    // Signup Form
    const signupForm = document.querySelector("#signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = signupForm["signup-email"].value;
            const password = signupForm["signup-password"].value;
            auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
                userCredential.user.sendEmailVerification().then(() => {
                    alert("A verification email has been sent. Please check your inbox.");
                    auth.signOut();
                    window.location.href = "login.html";
                });
                saveUserToFirestore(userCredential.user);
            }).catch(error => {
                alert("Error creating account: " + error.message);
            });
        });
    }

    // Login Form
    const loginForm = document.querySelector("#login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = loginForm["login-email"].value;
            const password = loginForm["login-password"].value;
            auth.signInWithEmailAndPassword(email, password).then(userCredential => {
                if (userCredential.user.emailVerified) {
                    window.location.href = "/index.html";
                } else {
                    alert("Please verify your email first. We've sent another verification link.");
                    userCredential.user.sendEmailVerification();
                    auth.signOut();
                }
            }).catch(error => {
                alert("Login failed: " + error.message);
            });
        });
    }

    // Google Sign-in
    const googleSigninButton = document.querySelector("#google-signin-button");
    if (googleSigninButton) {
        googleSigninButton.addEventListener("click", () => {
            auth.signInWithPopup(googleProvider).then(result => {
                saveUserToFirestore(result.user);
                window.location.href = "/index.html";
            }).catch(error => {
                alert("Google sign-in failed: " + error.message);
            });
        });
    }
});
