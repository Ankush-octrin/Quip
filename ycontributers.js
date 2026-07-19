const menuBtn = document.getElementById("menuBtn");
const mainContent = document.getElementById("content");
const aboutMe = document.getElementById("aboutMe");
const me = document.getElementById("me");
const menu = document.getElementById("menu");
let displayHome = "no";

menuBtn.addEventListener("click", () => {
    if (displayHome==="no") {
    aboutMe.style.display = "none";
    mainContent.style.display = "none";
    menu.style.display = "flex";
    displayHome = "yes";
    }
    else {
        aboutMe.style.display = "none";
        mainContent.style.display = "block";
        menu.style.display = "none";
        displayHome = "no";
    }
});

let displayMe= "no";

me.addEventListener("click", () => {
    if (displayMe==="no") {
        mainContent.style.display = "none";
        aboutMe.style.display = "block";
        menu.style.display = "none";
        displayMe = "yes";
    }
    else {
        displayMe = "no";
    }
});