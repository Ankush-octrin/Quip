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
