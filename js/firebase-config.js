
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCHdQRoANFp5gx8wfQKWCzDuoG61hd8e0U",
    authDomain: "device-streaming-f99bef81.firebaseapp.com",
    projectId: "device-streaming-f99bef81",
    storageBucket: "device-streaming-f99bef81.firebasestorage.app",
    messagingSenderId: "785931843997",
    appId: "1:785931843997:web:e0914a582dc9411abad774"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
