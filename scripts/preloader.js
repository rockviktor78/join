const preloader = document.getElementById("preloader");
const animLogo = document.getElementById("animatingLogo");
const finalLogo = document.getElementById("header-logo-final");

/**
 * Starts the preloader animation sequence.
 */
function startAnimation() {
    setTimeout(() => {
        animLogo.classList.add("logo-fly-to-header");
        handleMobileLogo(animLogo);
        setTimeout(() => preloader.classList.add("loader-fade-out"), 300);
        setTimeout(() => finishAnimation(preloader, animLogo, finalLogo), 1200);
    }, 600);
}

/**
 * Handles logo change for mobile devices.
 * @param {HTMLImageElement} logo - The logo image element to be changed.
 */
function handleMobileLogo(logo) {
    if (window.innerWidth <= 767) {
        setTimeout(() => {
            logo.src = "../assets/img/shared/join-logo-blue.svg";
        }, 390);
    }
}

/**
 * Finishes the preloader animation by revealing the final logo and hiding the preloader.
 * @param {HTMLElement} preloader - The preloader element to be hidden.
 * @param {HTMLImageElement} animLogo - The animated logo element to be hidden.
 * @param {HTMLImageElement} finalLogo - The final logo element to be revealed. 
 */
function finishAnimation(preloader, animLogo, finalLogo) {
    finalLogo.classList.remove("header-logo-hidden");
    finalLogo.classList.add("header-logo-visible");
    setTimeout(() => {
        animLogo.style.transition = "opacity 0.3s ease";
        animLogo.style.opacity = "0";
        setTimeout(() => {
            animLogo.style.display = "none";
            preloader.style.display = "none";
        }, 300);
    }, 50);
}


window.addEventListener("load", startAnimation);