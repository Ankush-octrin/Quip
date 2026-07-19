
import{ db } from "./jfirebase.js";


import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const usernameInput = document.getElementById("username");
const thoughtInput = document.getElementById("thoughts");
const postBtn = document.getElementById("quip");
const countText = document.getElementById("count");

thoughtInput.addEventListener("input", () => {
  countText.innerHTML = `Quip Length: ${thoughtInput.value.length}/500`;
});

postBtn.addEventListener("click", async () => {

  const username = usernameInput.value.trim();
  const thought = thoughtInput.value.trim();

  if (username === "" || thought === "") {
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
