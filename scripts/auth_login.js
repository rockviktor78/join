const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginPasswordIcon = document.getElementById('loginPasswordIcon');
const loginBtn = document.getElementById('loginBtn');
const loginEmailGroup = document.getElementById('loginEmailGroup');
const loginPasswordGroup = document.getElementById('loginPasswordGroup');
const loginErrorMessage = document.getElementById('loginErrorMessage');
const guestBtn = document.querySelector('.auth-card__btn--guest');


initPasswordIconToggle(loginPassword, loginPasswordIcon);


function toggleLoginButton() {
    const emailValue = loginEmail.value.trim();
    const passwordValue = loginPassword.value.trim();
    loginBtn.disabled = !(emailValue.length > 0 && passwordValue.length > 0);
}


async function getUserByEmail(email) {
    const allUsers = await getData("users");
    if (!allUsers) return null;
    const userList = Object.values(allUsers);
    const foundUser = userList.find(u => u.email.toLowerCase() === email.toLowerCase());
    return foundUser || null;
}


async function handleLogin(event) {
    event.preventDefault();
    resetLoginErrors();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    const user = await getUserByEmail(email);
    if (user && user.password === password) {
        loginSuccessful(user);
    } else {
        showLoginError();
    }
}


function getGuestUser() {
    return {
        name: "Guest",
        email: "guest@mail.com",
        password: "guest_demo123",
        guest: true,
    };
}


function fillLoginFields(user) {
    if (loginEmail && loginPassword) {
        loginEmail.value = user.email;
        loginPassword.value = user.password;
    }
    enableLoginButton();
}


function enableLoginButton() {
    if (loginBtn) loginBtn.disabled = true;
}


function saveGuestSession(user) {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
}


function redirectAfterDelay(url, delay = 2000) {
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}


function handleGuestLogin() {
    const guestUser = getGuestUser();
    fillLoginFields(guestUser);
    saveGuestSession(guestUser);
    redirectAfterDelay("summary.html");
}


if (guestBtn) {
    guestBtn.addEventListener('click', handleGuestLogin);
}


function loginSuccessful(user) {
    console.log("Login erfolgreich!");
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = "summary.html";
}


function showLoginError() {
    showInputError(loginErrorMessage, null, "Check your email and password. Please try again.");
    showInputError(loginEmailGroup, null);
    showInputError(loginPasswordGroup, null);
}


function resetLoginErrors() {
    hideInputError(loginErrorMessage);
    hideInputError(loginEmailGroup);
    hideInputError(loginPasswordGroup);
}


loginForm.addEventListener('submit', handleLogin);
loginEmail.addEventListener('input', toggleLoginButton);
loginPassword.addEventListener('input', toggleLoginButton);

toggleLoginButton();