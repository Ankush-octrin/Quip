import { auth } from './jfirebase.js';

import { signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

async function loginUser(auth, email, password) {
    try {
        const userCreadential = await signInWithEmailAndPassword(auth, email, password);
        alert("You are successfully logged in.");
        window.location.replace("index.html");
    }
    catch(error) {
        alert(error.message);
    }
}

document.getElementById("login").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const pwd = document.getElementById("pwd").value.trim();
    loginUser(auth, email, pwd);
});