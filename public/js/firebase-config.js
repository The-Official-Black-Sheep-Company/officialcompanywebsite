console.log('Firebase Protocol: Script Loading...');

// Use Firebase Compat SDK for global availability (safest for file:// protocol)
// These variables will be available globally after this script loads
var firebaseConfig = {
  apiKey: "AIzaSyCCe_tPol3BtaqPXLzR8O7CxVBIor-8Bs8",
  authDomain: "website-space-34008211-14686.firebaseapp.com",
  projectId: "website-space-34008211-14686",
  storageBucket: "website-space-34008211-14686.firebasestorage.app",
  messagingSenderId: "942333760970",
  appId: "1:942333760970:web:97d41b2b7ce699b81c6b33"
};

console.log('Firebase Protocol: Configuration loaded for', firebaseConfig.projectId);

// Initialize Firebase (assuming compat SDKs are loaded in HTML)
try {
    if (typeof firebase === 'undefined') {
        throw new Error('Firebase SDK not detected. Check script tags.');
    }
    
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase Core: Initialized successfully.');
    } else {
        console.log('Firebase Core: Already active.');
    }
} catch (error) {
    console.error('Firebase Core: Initialization failure!', error);
    alert('Critical System Error: Authentication service failed to initialize.');
}

var auth = firebase.auth();
var db = firebase.firestore();

// Exporting to window explicitly just in case
window.auth = auth;
window.db = db;

console.log('Firebase Protocol: Ready.');