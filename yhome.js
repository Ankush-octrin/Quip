import { auth } from "./jfirebase.js";

import { signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.getElementById("logOut").addEventListener("click", async () => {
    try{
        await signOut(auth);
        alert("You have successfully logged out.");
    }
    catch(error) {
        alert(error.message);
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
