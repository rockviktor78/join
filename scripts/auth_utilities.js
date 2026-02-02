const authCard = document.querySelector(".auth-card");
const slider = document.getElementById("authSlider");
const signupWrapper = document.getElementById("signupWrapper");
const signupGroup = document.querySelector(".auth-header__signup-group");
const loginWrapper = document.getElementById("loginWrapper");
const btnToSignup = document.getElementById("toSignup");
const btnToLogin = document.getElementById("toLogin");

const eyeOff = "./assets/img/auth/visibility-off-default.svg";
const eyeOn = "./assets/img/auth/visibility-on-default.svg";


function initPasswordIconToggle(input, icon) {
    if (!input || !icon) return;

    input.onfocus = function () {
        if (input.type === 'password') {
            icon.src = eyeOff;
        }
    };

    icon.onclick = function () {
        if (input.type === 'password') {
            input.type = 'text';
            icon.src = eyeOn;
        } else {
            input.type = 'password';
            icon.src = eyeOff;
        }
    };
}


function updateCardHeight(activeWrapper) {
    if (activeWrapper && authCard) {
        const height = activeWrapper.offsetHeight;
        authCard.style.height = height + "px";
    }
}


function showSignup(event) {
    event.preventDefault();
    if (slider) slider.classList.add("slide-to-signup");
    if (signupGroup) signupGroup.classList.add("d-none-smooth");
    updateCardHeight(signupWrapper);
}


function showLogin(event) {
    event.preventDefault();
    if (slider) slider.classList.remove("slide-to-signup");
    if (signupGroup) signupGroup.classList.remove("d-none-smooth");
    updateCardHeight(loginWrapper);
}


function initAuthHeight() {
    authCard.style.transition = "none";
    updateCardHeight(loginWrapper);

    requestAnimationFrame(() => {
        authCard.classList.add("ready");
        authCard.style.transition =
            "transform 0.6s ease-in-out, height 0.5s ease-in-out";
    });
}


document.addEventListener("DOMContentLoaded", () => {
    initAuthHeight();

    if (btnToSignup) {
        btnToSignup.onclick = showSignup;
    }
    if (btnToLogin) {
        btnToLogin.onclick = showLogin;
    }
});