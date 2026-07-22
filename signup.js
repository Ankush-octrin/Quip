import { auth } from './jfirebase.js';

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


let output = document.getElementById("output");

async function createUser(auth, email, password) {
    try{
        console.log("waiting for the server to respond");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        output.textContent = "Account created successfully.";
        window.location.replace("index.html");
    }
    catch(error) {
        output.textContent = error.message;
    }
}

document.getElementById("signUp").addEventListener("click", () => {
   const pwd = document.getElementById("pwd").value.trim();
   const email = document.getElementById("email").value.trim();
   createUser(auth, email, pwd);
});