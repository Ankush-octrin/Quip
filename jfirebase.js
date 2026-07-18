// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHgAn-04vgICWREOgQdGxD1sKWI05Amo4",
  authDomain: "thoughts-on-octrin.firebaseapp.com",
  projectId: "thoughts-on-octrin",
  storageBucket: "thoughts-on-octrin.firebasestorage.app",
  messagingSenderId: "471979870316",
  appId: "1:471979870316:web:b55b9ef3f10990e2e47049",
  measurementId: "G-4FG2CZ1HFN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

// Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export them so other files can use them
export { db, auth, provider };

console.log("Firebase Connected!");