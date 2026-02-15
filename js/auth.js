document.addEventListener("DOMContentLoaded", function() {

    const auth = firebase.auth();
    const db = firebase.firestore();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // Function to save user data to Firestore, checking if user already exists
    const saveUserToFirestore = (user) => {
        const userRef = db.collection("users").doc(user.uid);
        userRef.get().then((doc) => {
            if (!doc.exists) { // Only create doc if it doesn't exist from a previous sign-in
                userRef.set({
                    email: user.email,
                    displayName: user.displayName || null,
                    photoURL: user.photoURL || null,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    emailVerified: user.emailVerified // Store verification status
                }).then(() => {
                    console.log("New user data saved to Firestore!");
                }).catch((error) => {
                    console.error("Error saving new user to Firestore: ", error);
                });
            } else {
                 // If user exists, update their verification status if it has changed
                if (doc.data().emailVerified !== user.emailVerified) {
                    userRef.update({ emailVerified: user.emailVerified });
                }
            }
        }).catch((error) => {
            console.error("Error checking user in Firestore: ", error);
        });
    };

    // Signup Form
    const signupForm = document.querySelector("#signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = signupForm["signup-email"].value;
            const password = signupForm["signup-password"].value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    
                    // Send verification email
                    user.sendEmailVerification().then(() => {
                        alert("A verification email has been sent. Please check your inbox to activate your account before logging in.");
                    }).catch((error) => {
                        console.error("Error sending verification email: ", error);
                        alert("Could not send verification email, but your account was created. Please contact support or try logging in.");
                    });

                    saveUserToFirestore(user); // Save user to DB
                    
                    // Sign the user out and redirect to the login page to enforce verification
                    auth.signOut();
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    console.error("Error creating user:", error.code, error.message);
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

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if (user.emailVerified) {
                        // Email is verified, proceed to login
                        console.log("User successfully logged in:", user.email);
                        window.location.href = "../index.html"; // Redirect to main page
                    } else {
                        // Email not verified
                        alert("Please verify your email address before logging in. Click OK to resend the verification email.");
                        user.sendEmailVerification(); // Re-send the verification email
                        auth.signOut(); // Log them out to prevent access
                    }
                })
                .catch((error) => {
                    console.error("Error logging in:", error.code, error.message);
                    alert("Error logging in: " + error.message);
                });
        });
    }

    // Google Sign-in Button (works for both login and signup)
    const googleSigninButton = document.querySelector("#google-signin-button");
    if (googleSigninButton) {
        googleSigninButton.addEventListener("click", () => {
            auth.signInWithPopup(googleProvider)
                .then((result) => {
                    const user = result.user;
                    // Google provides verified emails, so we can proceed
                    saveUserToFirestore(user); // Save/check user in DB
                    console.log("User signed in with Google:", user.displayName);
                    window.location.href = "../index.html"; // Redirect to main page
                }).catch((error) => {
                    console.error("Google sign-in failed:", error.code, error.message);
                    alert("Google sign-in failed: " + error.message);
                });
        });
    }
});
