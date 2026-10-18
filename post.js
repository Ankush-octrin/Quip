import { db, auth } from "./jfirebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const usernameInput = document.getElementById("username");
const thoughtInput = document.getElementById("thoughts");
const postBtn = document.getElementById("quip");
const countText = document.getElementById("count");

let currentUser = null;
let authReady = false;


// AUTHENTICATION

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    authReady = true;

    if (!user) {
        alert("Kindly log in first to post a quip.");
        window.location.replace("login.html");
    }
});


// CHARACTER COUNTER

thoughtInput.addEventListener("input", () => {
    countText.textContent =
        `Quip Length: ${thoughtInput.value.length}/500`;
});


// POST A QUIP

postBtn.addEventListener("click", async () => {

    if (!authReady) {
        alert("Please wait while we verify your login.");
        return;
    }

    if (!currentUser) {
        alert("Kindly log in first to post a quip.");
        window.location.replace("login.html");
        return;
    }

    const username =
        usernameInput.value.trim() || "Anonymous";

    const thought = thoughtInput.value.trim();

    if (!thought) {
        alert("Please enter a quip.");
        return;
    }

    if (thought.length > 500) {
        alert("Your quip cannot exceed 500 characters.");
        return;
    }

    postBtn.disabled = true;

    try {

        await addDoc(collection(db, "quips"), {
            uid: currentUser.uid,
            username: username,
            thought: thought,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            timestamp: serverTimestamp()
        });

        alert("Quip posted successfully!");

        usernameInput.value = "";
        thoughtInput.value = "";

        window.location.replace("index.html");

    } catch (error) {

        console.error("Quip posting failed:", error);

        alert("Unable to post your quip. Please try again.");

    } finally {

        postBtn.disabled = false;

    }

});