import { db, auth } from "./jfirebase.js";

import {
    collection,
    query,
    orderBy,
    getDocs,
    doc,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// ====================================
// GLOBAL VARIABLES
// ====================================

const postsDiv = document.getElementById("posts");
const searchInput = document.getElementById("search");

let allQuips = [];

let currentUser = null;


// ====================================
// AUTH STATE
// ====================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    loadQuips();

});


// ====================================
// LIKE A QUIP
// ====================================

async function likeQuip(quipid) {

    try {

        if (!currentUser) {

            alert("Please log in to like a quip.");

            return false;

        }


        const quipRef = doc(db, "quips", quipid);


        await runTransaction(db, async (transaction) => {


            const quipSnapshot = await transaction.get(quipRef);


            if (!quipSnapshot.exists()) {

                throw new Error("This quip no longer exists.");

            }


            const data = quipSnapshot.data();


            const likedBy = data.likedBy || [];

            const dislikedBy = data.dislikedBy || [];


            // Already liked
            if (likedBy.includes(currentUser.uid)) {

                throw new Error(
                    "You have already liked this quip."
                );

            }


            const updates = {

                likes: (data.likes || 0) + 1,

                likedBy: [
                    ...likedBy,
                    currentUser.uid
                ]

            };


            // Remove previous dislike
            if (dislikedBy.includes(currentUser.uid)) {

                updates.dislikes = Math.max(
                    0,
                    (data.dislikes || 0) - 1
                );


                updates.dislikedBy = dislikedBy.filter(
                    (uid) => uid !== currentUser.uid
                );

            }


            transaction.update(quipRef, updates);

        });


        return true;

    }
    catch(error) {

        alert(error.message);

        return false;

    }

}


// ====================================
// DISLIKE A QUIP
// ====================================

async function dislikeQuip(quipid) {

    try {

        if (!currentUser) {

            alert("Please log in to dislike a quip.");

            return false;

        }


        const quipRef = doc(db, "quips", quipid);


        await runTransaction(db, async (transaction) => {


            const quipSnapshot = await transaction.get(quipRef);


            if (!quipSnapshot.exists()) {

                throw new Error("This quip no longer exists.");

            }


            const data = quipSnapshot.data();


            const likedBy = data.likedBy || [];

            const dislikedBy = data.dislikedBy || [];


            // Already disliked
            if (dislikedBy.includes(currentUser.uid)) {

                throw new Error(
                    "You have already disliked this quip."
                );

            }


            const updates = {

                dislikes: (data.dislikes || 0) + 1,

                dislikedBy: [
                    ...dislikedBy,
                    currentUser.uid
                ]

            };


            // Remove previous like
            if (likedBy.includes(currentUser.uid)) {

                updates.likes = Math.max(
                    0,
                    (data.likes || 0) - 1
                );


                updates.likedBy = likedBy.filter(
                    (uid) => uid !== currentUser.uid
                );

            }


            transaction.update(quipRef, updates);

        });


        return true;

    }
    catch(error) {

        alert(error.message);

        return false;

    }

}


// ====================================
// LOAD QUIPS
// ====================================

async function loadQuips() {

    try {

        postsDiv.innerHTML = "";


        const q = query(

            collection(db, "quips"),

            orderBy("timestamp", "desc")

        );


        const snapshot = await getDocs(q);


        const head = document.getElementById("loading");


        // No quips
        if (snapshot.empty) {

            head.style.display = "none";


            postsDiv.innerHTML = `

                <div class="post-container">

                    <p class="thought" style="text-align:center;">

                        No posts yet <br>

                        Be the first to post.

                    </p>

                </div>

            `;


            return;

        }


        allQuips = [];


        snapshot.forEach((quipDoc) => {


            const data = quipDoc.data();


            allQuips.push({

                id: quipDoc.id,

                username: data.username || "",

                thought: data.thought || "",

                likes: data.likes || 0,

                dislikes: data.dislikes || 0,

                likedBy: data.likedBy || [],

                dislikedBy: data.dislikedBy || []

            });

        });


        head.style.display = "none";


        displayQuips(allQuips);

    }
    catch(error) {

        alert(error.message);

    }

}


// ====================================
// DISPLAY QUIPS
// ====================================

function displayQuips(quips) {


    postsDiv.innerHTML = "";


    // No results
    if (quips.length === 0) {

        postsDiv.innerHTML = `

            <div class="post-container">

                <p class="thought" style="text-align:center;">

                    No quips found.

                </p>

            </div>

        `;


        return;

    }


    quips.forEach((quip) => {


        // Check whether current user liked this quip
        const userLiked = currentUser &&

            quip.likedBy.includes(
                currentUser.uid
            );


        // Check whether current user disliked this quip
        const userDisliked = currentUser &&

            quip.dislikedBy.includes(
                currentUser.uid
            );


        // Heart icon
        const heartIcon = userLiked

            ? "❤️"

            : "♡";


        postsDiv.innerHTML += `

            <div class="post-container">


                <a class="owner" href="#">

                    👤

                    <p class="owner-name">

                        ${quip.username}

                    </p>

                </a>


                <p class="post-time">

                    Just Now

                </p>


                <div class="post">

                    <p class="thought">

                        ${quip.thought}

                    </p>

                </div>


                <div class="interact">


                    <button

                        class="like ${userLiked ? "liked" : ""}"

                        data-quipid="${quip.id}"

                        ${userLiked ? "disabled" : ""}>

                        ${heartIcon} ${quip.likes}

                    </button>


                    <button

                        class="dislike ${userDisliked ? "disliked" : ""}"

                        data-quipid="${quip.id}"

                        ${userDisliked ? "disabled" : ""}>

                        👎 ${quip.dislikes}

                    </button>


                </div>


            </div>

        `;

    });


    addButtonListeners();

}


// ====================================
// BUTTON LISTENERS
// ====================================

function addButtonListeners() {


    const likeBtns = document.querySelectorAll(".like");


    likeBtns.forEach((likeBtn) => {


        likeBtn.addEventListener("click", async () => {


            const quipid = likeBtn.dataset.quipid;


            likeBtn.disabled = true;


            const success = await likeQuip(quipid);


            if (success) {

                await loadQuips();

            }
            else {

                likeBtn.disabled = false;

            }

        });

    });


    const dislikeBtns = document.querySelectorAll(".dislike");


    dislikeBtns.forEach((dislikeBtn) => {


        dislikeBtn.addEventListener("click", async () => {


            const quipid = dislikeBtn.dataset.quipid;


            dislikeBtn.disabled = true;


            const success = await dislikeQuip(quipid);


            if (success) {

                await loadQuips();

            }
            else {

                dislikeBtn.disabled = false;

            }

        });

    });

}


// ====================================
// SEARCH
// ====================================

searchInput.addEventListener("input", () => {


    const searchText = searchInput.value

        .toLowerCase()

        .trim();


    const filteredQuips = allQuips.filter((quip) => {


        const thought = quip.thought

            .toLowerCase();


        const username = quip.username

            .toLowerCase();


        return (

            thought.includes(searchText)

            ||

            username.includes(searchText)

        );

    });


    displayQuips(filteredQuips);

});