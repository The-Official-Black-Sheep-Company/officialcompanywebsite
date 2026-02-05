
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcvUlbXh6V6CNVNdXjpBuOtTE_GXFWH-4",
  authDomain: "bswp-1e483.firebaseapp.com",
  projectId: "bswp-1e483",
  storageBucket: "bswp-1e483.firebasestorage.app",
  messagingSenderId: "930575506061",
  appId: "1:930575506061:web:4c3cc28fa9df6a6cafe0c4",
  measurementId: "G-8GYY8CNE8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
