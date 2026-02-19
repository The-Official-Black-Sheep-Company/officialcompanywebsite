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

// Initialize Firebase (assuming compat SDKs are loaded in HTML)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var auth = firebase.auth();
var db = firebase.firestore();

// Exporting to window explicitly just in case
window.auth = auth;
window.db = db;