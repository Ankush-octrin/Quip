import { db } from "./jfirebase.js";

import {
  collection,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const postsDiv = document.getElementById("posts");

async function loadQuips() {

  postsDiv.innerHTML = "";

  const q = query(
    collection(db, "quips"),
    orderBy("timestamp", "desc")
  );
  
  const snapshot = await getDocs(q);
  const head = document.getElementById("loading");

  // Show message if there are no quips
  if (snapshot.empty) {
    postsDiv.innerHTML = `
      <div class="post-container">
        <p class="thought" style="text-align:center;">
          No quips yet.<br>
          Be the first to share your thoughts!
        </p>
      </div>
    `;
    return;
  }

  snapshot.forEach((doc) => {

    const data = doc.data();
    head.style.display = "none";
    postsDiv.innerHTML += `
      <div class="post-container">

        <a class="owner" href="#">
          👤
          <p class="owner-name">Just Now</p>
        </a>

        <p class="post-time">${data.timestamp}</p>

        <div class="post">
          <p class="thought">${data.thought}</p>
        </div>

        <div class="interact">
          <button class="like">♡ ${data.likes}</button>
          <button class="dislike">👎 ${data.dislikes}</button>
        </div>

      </div>
    `;
   
  });
  
}

loadQuips();
