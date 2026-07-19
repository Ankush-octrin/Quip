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
    setTimeout(interaction, 5000);
});


function interaction() {

const likes = document.querySelectorAll(".like");
const dislikes = document.querySelectorAll(".dislike");


likes.forEach((like,index) => {
    const dislike = dislikes[index];
    like.addEventListener("click", () => {
    like.innerHTML= "❤️";
    dislike.innerHTML = "👎 0";
});

    dislike.addEventListener("click", () => {
    like.innerHTML= "♡";
    dislike.innerHTML = "👎 1";
});

});

}

