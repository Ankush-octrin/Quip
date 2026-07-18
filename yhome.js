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

const aboutMe = document.getElementById("me");
const meContent = document.getElementById("aboutMe");

aboutMe.addEventListener("click", () => {
    menu.style.display = "none";
    meContent.style.display = "block";
});

// For Likes

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(interaction, 8000);
});


function interaction() {

const likes = document.querySelector(".like");
const dislikes = document.querySelector(".dislike");
likes.addEventListener("click", () => {
    likes.innerHTML= "❤️";
    dislikes.innerHTML = "👎 0";
});

dislikes.addEventListener("click", () => {
    likes.innerHTML= "♡";
    dislikes.innerHTML = "👎 1";
});

}

