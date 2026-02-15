const auth = firebase.auth();
const db = firebase.firestore();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCe_tPol3BtaqPXLzR8O7CxVBIor-8Bs8",
  authDomain: "website-space-34008211-14686.firebaseapp.com",
  projectId: "website-space-34008211-14686",
  storageBucket: "website-space-34008211-14686.firebasestorage.app",
  messagingSenderId: "942333760970",
  appId: "1:942333760970:web:97d41b2b7ce699b81c6b33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);