import{ db, auth } from "./jfirebase.js";


import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

//import {
   // onAuthStateChanged
//} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


//onAuthStateChanged(auth, (user) => {
//    if (user) {
//        console.log(`User Detected: ${user.email}`);
//    }
 //   else {
 //       alert("Kindly login first to post a quip.");
 //       window.location.replace("login.html");
//    }
//});

const usernameInput = document.getElementById("username");
const thoughtInput = document.getElementById("thoughts");
const postBtn = document.getElementById("quip");
const countText = document.getElementById("count");

thoughtInput.addEventListener("input", () => {
  countText.innerHTML = `Quip Length: ${thoughtInput.value.length}/500`;
});

postBtn.addEventListener("click", async () => {

  let username = usernameInput.value.trim();
  const thought = thoughtInput.value.trim();

    if (username === "") {
        username = "Anonymous";
    }
    
  if (thought === "") {
    alert("Please enter your name and a quip.");
    return;
  }

  try {

    await addDoc(collection(db, "quips"), {
      username: username,
      thought: thought,
      likes: 0,
      dislikes: 0,
      timestamp: serverTimestamp()
    });

    alert("Quip posted successfully!");

    usernameInput.value = "";
    thoughtInput.value = "";

    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert("Posting failed. Check the browser console.");
    console.error(error);
  }

});
