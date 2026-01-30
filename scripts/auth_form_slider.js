
function updateCardHeight(activeWrapper) {
    const authCard = document.querySelector(".auth-card");

    if (activeWrapper && authCard) {
        const height = activeWrapper.offsetHeight;
        authCard.style.height = height + "px";
    }
}


function showSignup(event) {
    event.preventDefault();
    const slider = document.getElementById("authSlider");
    const signupWrapper = document.getElementById("signupWrapper");
    const signupGroup = document.querySelector(".auth-header__signup-group");

    if (slider) slider.classList.add("slide-to-signup");
    if (signupGroup) signupGroup.classList.add("d-none-smooth");
    updateCardHeight(signupWrapper);
}


function showLogin(event) {
    event.preventDefault();

    const slider = document.getElementById("authSlider");
    const loginWrapper = document.getElementById("loginWrapper");
    const signupGroup = document.querySelector(".auth-header__signup-group");

    if (slider) slider.classList.remove("slide-to-signup");
    if (signupGroup) signupGroup.classList.remove("d-none-smooth");

    updateCardHeight(loginWrapper);
}


window.onload = function () {
    const loginWrapper = document.getElementById("loginWrapper");
    updateCardHeight(loginWrapper);

    const btnToSignup = document.getElementById("toSignup");
    const btnToLogin = document.getElementById("toLogin");

    if (btnToSignup) {
        btnToSignup.onclick = showSignup;
    }

    if (btnToLogin) {
        btnToLogin.onclick = showLogin;
    }
};