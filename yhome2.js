import { db, auth } from "./jfirebase.js";

import {
    collection,
    query,
    orderBy,
    getDocs,
    doc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// GLOBAL VARIABLES

const postsDiv = document.getElementById("posts");
const searchInput = document.getElementById("search");
const loading = document.getElementById("loading");

let allQuips = [];
let currentUser = null;


// AUTH STATE

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    loadQuips();
});


// ESCAPE USER CONTENT

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}


// LIKE / DISLIKE TOGGLE

async function toggleReaction(quipId, selectedReaction) {
    if (!currentUser) {
        alert("Please log in to react to a quip.");
        return false;
    }

    try {
        const reactionRef = doc(
            db,
            "quips",
            quipId,
            "interactions",
            currentUser.uid
        );

        await runTransaction(db, async (transaction) => {
            const reactionSnapshot = await transaction.get(reactionRef);

            const existingReaction = reactionSnapshot.exists()
                ? reactionSnapshot.data().reaction
                : null;

            // Clicking the same reaction removes it.
            if (existingReaction === selectedReaction) {
                transaction.delete(reactionRef);
                
            }

            // Otherwise, create or switch the reaction.
            else {
                transaction.set(reactionRef, {
                    reaction: selectedReaction,
                    timestamp: serverTimestamp()
                });
            }
        });

        return true;

    } catch (error) {
        console.error("Reaction failed:", error);

        alert(
            error.code === "permission-denied"
                ? "Permission denied. Check your Firestore Security Rules."
                : "Could not update your reaction. Please try again."
        );

        return false;
    }
}


// FORMAT TIMESTAMP

function formatTimestamp(timestamp) {
    if (!timestamp) {
        return "Just now";
    }

    const date = timestamp.toDate();
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    if (days < 7) {
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// LOAD QUIPS AND REACTIONS

async function loadQuips() {
    try {
        loading.style.display = "block";
        postsDiv.innerHTML = "";

        const quipsQuery = query(
            collection(db, "quips"),
            orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(quipsQuery);

        if (snapshot.empty) {
            allQuips = [];

            loading.style.display = "none";

            postsDiv.innerHTML = `
                <div class="post-container">
                    <p class="thought" style="text-align:center;">
                        No posts yet.<br>
                        Be the first to post.
                    </p>
                </div>
            `;

            return;
        }

        // Fetch reactions for each quip.
        allQuips = await Promise.all(
            snapshot.docs.map(async (quipDoc) => {
                const data = quipDoc.data();

                const interactionsRef = collection(
                    db,
                    "quips",
                    quipDoc.id,
                    "interactions"
                );

                const interactionsSnapshot =
                    await getDocs(interactionsRef);

                let likes = 0;
                let dislikes = 0;
                let userReaction = null;

                interactionsSnapshot.forEach((reactionDoc) => {
                    const reactionData = reactionDoc.data();

                    if (reactionData.reaction === "like") {
                        likes++;
                    } else if (reactionData.reaction === "dislike") {
                        dislikes++;
                    }

                    if (
                        currentUser &&
                        reactionDoc.id === currentUser.uid
                    ) {
                        userReaction = reactionData.reaction;
                    }
                });

                return {
                    id: quipDoc.id,
                    username: data.username || "Anonymous",
                    thought: data.thought || "",
                    timestamp: data.timestamp || null,
                    likes,
                    dislikes,
                    userReaction
                };
            })
        );

        loading.style.display = "none";

        displayQuips(allQuips);

    } catch (error) {
        console.error("Error loading quips:", error);

        loading.style.display = "none";

        postsDiv.innerHTML = `
            <div class="post-container">
                <p class="thought">
                    Failed to load quips. Please refresh the page.
                </p>
            </div>
        `;
    }
}


// DISPLAY QUIPS

function displayQuips(quips) {
    postsDiv.innerHTML = "";

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
        const userLiked = quip.userReaction === "like";
        const userDisliked = quip.userReaction === "dislike";

        const heartIcon = userLiked ? "❤️" : "♡";

        const postElement = document.createElement("div");

        postElement.className = "post-container";

        postElement.innerHTML = `
            <a class="owner" href="#">
                👤
                <p class="owner-name">
                    ${escapeHTML(quip.username)}
                </p>
            </a>

            <p class="post-time">
                ${escapeHTML(formatTimestamp(quip.timestamp))}
            </p>

            <div class="post">
                <p class="thought">
                    ${escapeHTML(quip.thought)}
                </p>
            </div>

            <div class="interact">
                <button
                    class="like ${userLiked ? "liked" : ""}"
                    data-quipid="${quip.id}"
                    aria-pressed="${userLiked}">
                    ${heartIcon} ${quip.likes}
                </button>

                <button
                    class="dislike ${userDisliked ? "disliked" : ""}"
                    data-quipid="${quip.id}"
                    aria-pressed="${userDisliked}">
                    👎 ${quip.dislikes}
                </button>
            </div>
        `;

        postsDiv.appendChild(postElement);
    });

    addButtonListeners();
}


// BUTTON LISTENERS

function addButtonListeners() {
document.querySelectorAll(".like, .dislike").forEach((button) => {
button.addEventListener("click", async () => {
const quipId = button.dataset.quipid;
const selectedReaction = button.classList.contains("like")
? "like"
: "dislike";

        button.disabled = true;

        const quip = allQuips.find((item) => item.id === quipId);

        if (!quip) {
            button.disabled = false;
            return;
        }

        const previousReaction = quip.userReaction;

        // Update the interface immediately.
        if (previousReaction === selectedReaction) {
            quip.userReaction = null;
        } else {
            quip.userReaction = selectedReaction;
        }

        displayQuips(allQuips);

        const success = await toggleReaction(quipId, selectedReaction);

        if (!success) {
            // Restore the previous state if Firestore rejects the action.
            quip.userReaction = previousReaction;
            displayQuips(allQuips);
            return;
        }

        // Refresh counts and confirm the saved state.
        await loadQuips();
    });
});

}


// SEARCH

searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredQuips = allQuips.filter((quip) => {
        return (
            quip.thought.toLowerCase().includes(searchText) ||
            quip.username.toLowerCase().includes(searchText)
        );
    });

    displayQuips(filteredQuips);
});