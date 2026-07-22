import { auth } from "./jfirebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


onAuthStateChanged(auth, (user) => {
    if (user) {
        alert(`User Detected: ${user.email}`);
    }
    else {
        window.location.replace("signup.html");
    }
});


const menuBtn = document.getElementById("menuBtn");
const mainContent = document.getElementById("content");
const menu = document.getElementById("menu");

let displayHome = "no";

menuBtn.addEventListener("click", () => {
    if (displayHome==="no") {
    mainContent.style.display = "none";
    menu.style.display = "flex";
    displayHome = "yes";
    }
    else {
        mainContent.style.display = "block";
        menu.style.display = "none";
        displayHome = "no";
    }
});
