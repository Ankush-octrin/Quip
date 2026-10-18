import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCES_e3N_jLLbC429hD42QKbly50KAXOXA",
  authDomain: "quip-43e58.firebaseapp.com",
  projectId: "quip-43e58",
  storageBucket: "quip-43e58.firebasestorage.app",
  messagingSenderId: "732919556087",
  appId: "1:732919556087:web:56b483627b3db6bbc9f0f2",
  measurementId: "G-NCSCFXB98Z"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };


