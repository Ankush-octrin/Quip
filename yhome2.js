
import { db } from "./jfirebase.js";

import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Likes and Dislikes handling (Starts)

async function likeQuip(quipid) {
    try{
        const quipRef = doc(db, "quips", quipid);
        await updateDoc(quipRef, {
            likes: increment(1)
        });
        alert("Likes added successfully.");
        window.location.href = "index.html";
    }
    catch(error) {
        alert(error.message);
    }
}


async function dislikeQuip(quipid) {
    try{
        const quipRef = doc(db, "quips", quipid);
        await updateDoc(quipRef, {
            dislikes: increment(1)
        });
        alert("Disliked successfully");
        window.location.href="index.html";
    }
    catch(error) {
        alert(error.message);
    }
}

// Likes and Dislikes handling (Ends)


let quipid;

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
      head.style.display = "none";
    postsDiv.innerHTML = `
      <div class="post-container">
        <p class="thought" style="text-align:center;">
          No posts yet <br />Be the first to post.
        </p>
      </div>
    `;
    return;
  }

  snapshot.forEach((doc) => {

    const data = doc.data();
    const quipid = doc.id;
    head.style.display = "none";
    postsDiv.innerHTML += `
      <div class="post-container">

        <a class="owner" href="#">
          👤
          <p class="owner-name">${data.username}</p>
        </a>

        <p class="post-time">Just Now</p>

        <div class="post">
          <p class="thought">${data.thought}</p>
        </div>

        <div class="interact">
          <button class="like" data-quipid=${quipid}>♡ ${data.likes}</button>
          <button class="dislike" data-quipid=${quipid}>👎 ${data.dislikes}</button>
        </div>

      </div>
    `;
   
   
  });
  
  // For like button
  
  const likeBtns = document.querySelectorAll(".like");
   likeBtns.forEach((likeBtn) => {
       likeBtn.addEventListener("click", async () => {
           const postId = likeBtn.dataset.quipid;
          await likeQuip(postId);
          likeBtn.disabled = true;
       });
       
   });
  
  
// For dislike button

    const dislikeBtns = document.querySelectorAll(".dislike");
    dislikeBtns.forEach((dislikeBtn) => {
        dislikeBtn.addEventListener("click", async () => {
            const dislikeId = dislikeBtn.dataset.quipid;
            await dislikeQuip(dislikeId);
            dislikeBtn.disabled = true;
        });
    });
}


loadQuips();