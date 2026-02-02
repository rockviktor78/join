const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginPasswordIcon = document.getElementById('loginPasswordIcon');
const loginBtn = document.getElementById('loginBtn');
const loginEmailGroup = document.getElementById('loginEmailGroup');
const loginPasswordGroup = document.getElementById('loginPasswordGroup');
const loginErrorMessage = document.getElementById('loginErrorMessage');


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


function loginSuccessful(user) {
    console.log("Login erfolgreich!");
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = "summary.html";
}


function showLoginError() {
    loginErrorMessage.innerText = "Check your email and password. Please try again.";
    loginErrorMessage.classList.add('show');
    loginEmailGroup.classList.add('auth-card__input-group--error');
    loginPasswordGroup.classList.add('auth-card__input-group--error');
}


function resetLoginErrors() {
    loginErrorMessage.classList.remove('show');
    loginEmailGroup.classList.remove('auth-card__input-group--error');
    loginPasswordGroup.classList.remove('auth-card__input-group--error');
}


loginForm.addEventListener('submit', handleLogin);
loginEmail.addEventListener('input', toggleLoginButton);
loginPassword.addEventListener('input', toggleLoginButton);

toggleLoginButton();