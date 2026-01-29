const updateCardHeight = (activeWrapper) => {
    const authCard = document.querySelector(".auth-card");
    if (activeWrapper && authCard) {
        const height = activeWrapper.offsetHeight;
        authCard.style.height = `${height}px`;
    }
};


const showSignup = (event) => {
    event.preventDefault();
    const slider = document.getElementById("authSlider");
    const signupWrapper = document.getElementById("signupWrapper");
    const signupGroup = document.querySelector(".auth-header__signup-group");

    slider?.classList.add("slide-to-signup");
    signupGroup?.classList.add("d-none-smooth");
    updateCardHeight(signupWrapper);
};


const showLogin = (event) => {
    event.preventDefault();
    const slider = document.getElementById("authSlider");
    const loginWrapper = document.getElementById("loginWrapper");
    const signupGroup = document.querySelector(".auth-header__signup-group");

    slider?.classList.remove("slide-to-signup");
    signupGroup?.classList.remove("d-none-smooth");
    updateCardHeight(loginWrapper);
};


window.addEventListener("load", () => {
    const loginWrapper = document.getElementById("loginWrapper");
    updateCardHeight(loginWrapper);
    document.getElementById("toSignup")?.addEventListener("click", showSignup);
    document.getElementById("toLogin")?.addEventListener("click", showLogin);
});