const authCard = document.querySelector(".auth-card");
const slider = document.getElementById("authSlider");
const signupWrapper = document.getElementById("signupWrapper");
const signupGroup = document.querySelector(".auth-header__signup-group");
const loginWrapper = document.getElementById("loginWrapper");
const btnToSignup = document.getElementById("toSignup");
const btnToLogin = document.getElementById("toLogin");
const toSignupOnMobile = document.getElementById('toSignupOnMobile')

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
    document.querySelectorAll(".auth-header__signup-group").forEach(group => {
        group.classList.add("d-none-smooth");
    });
    updateCardHeight(signupWrapper);
}

function showLogin(event) {
    event.preventDefault();
    if (slider) slider.classList.remove("slide-to-signup");
    document.querySelectorAll(".auth-header__signup-group").forEach(group => {
        group.classList.remove("d-none-smooth");
    });
    updateCardHeight(loginWrapper);
}


function initAuthHeight() {
    authCard.classList.remove("transition-ready");
    updateCardHeight(loginWrapper);
    requestAnimationFrame(() => {
        authCard.classList.add("ready", "transition-ready");
    });
}



document.addEventListener("DOMContentLoaded", () => {
    initAuthHeight();
    if (btnToSignup) {
        btnToSignup.onclick = showSignup;
    }
    if (toSignupOnMobile) {
        toSignupOnMobile.onclick = showSignup;
    }
    if (btnToLogin) {
        btnToLogin.onclick = showLogin;
    }
});