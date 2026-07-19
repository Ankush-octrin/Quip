const menuBtn = document.getElementById("menuBtn");
const mainContent = document.getElementById("content");
const menu = document.getElementById("menu");
const aboutMe = document.getElementById("me");
const meContent = document.getElementById("aboutMe");

let displayHome = "no";

menuBtn.addEventListener("click", () => {
    if (displayHome==="no") {
    mainContent.style.display = "none";
    menu.style.display = "flex";
    displayHome = "yes";
    }
    else {
        meContent.style.display = "none";
        mainContent.style.display = "block";
        menu.style.display = "none";
        displayHome = "no";
    }
});

const me = "no";

aboutMe.addEventListener("click", () => {
        menu.style.display = "none";
        meContent.style.display = "block";
        mainContent.style.display = "none";
        me = "";
});
