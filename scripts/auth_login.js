const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginPasswordIcon = document.getElementById('loginPasswordIcon');
const loginBtn = document.getElementById('loginBtn');
const loginEmailGroup = document.getElementById('loginEmailGroup');
const loginPasswordGroup = document.getElementById('loginPasswordGroup');
const loginErrorMessage = document.getElementById('loginErrorMessage');
const guestBtn = document.getElementById('guestBtn');


initPasswordIconToggle(loginPassword, loginPasswordIcon);
toggleLoginButton();

/**
 * Enables or disables the login button based on input field values.
 */
function toggleLoginButton() {
    const emailValue = loginEmail.value.trim();
    const passwordValue = loginPassword.value.trim();
    loginBtn.disabled = !(emailValue.length > 0 && passwordValue.length > 0);
}


/**
 * Fetches a user by email from the data storage. 
 * @param {string} email - The email of the user to fetch.
 * @return {Promise<Object|null>} The user object if found, otherwise null.
 */
async function getUserByEmail(email) {
    const allUsers = await getData("users");
    if (!allUsers) return null;
    const userList = Object.values(allUsers);
    const foundUser = userList.find(u => u.email.toLowerCase() === email.toLowerCase());
    return foundUser || null;
}


/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.    
 */
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


/**
 * Creates a guest user object.
 * @return {Object} The guest user object.
 */
function getGuestUser() {
    return {
        name: "Guest",
        email: "guest@mail.com",
        password: "guest_demo123",
        guest: true,
    };
}


/**
 * Fills the login fields with the provided user's credentials.
 * @param {Object} user - The user object containing email and password.
 */
function fillLoginFields(user) {
    if (loginEmail && loginPassword) {
        loginEmail.value = user.email;
        loginPassword.value = user.password;
    }
    enableLoginButton();
}

/**
 * Disables the login button.
 */
function enableLoginButton() {
    if (loginBtn) loginBtn.disabled = true;
}


/**
 * Saves the guest user session in session storage.
 * @param {Object} user - The user object to save.
 */
function saveGuestSession(user) {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
}


/**
 * Redirects to the specified URL after a delay.
 * @param {string} url - The URL to redirect to.
 * @param {number} [delay=2000] - The delay in milliseconds before redirecting.
 */
function redirectAfterDelay(url, delay = 2000) {
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}


/**
 * Handles the guest login process.
 */
function handleGuestLogin() {
    const guestUser = getGuestUser();
    fillLoginFields(guestUser);
    saveGuestSession(guestUser);
    redirectAfterDelay("summary.html");
}


/**
 * Handles successful login.
 * @param {Object} user - The user object that was successfully logged in.
 */
function loginSuccessful(user) {
    console.log("Login erfolgreich!");
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = "summary.html";
}

/**
 * Displays login error messages and highlights input fields.
 */
function showLoginError() {
    showInputError(loginErrorMessage, null, "Check your email and password. Please try again.");
    showInputError(loginEmailGroup, null);
    showInputError(loginPasswordGroup, null);
}


/**
 * Resets login error messages and input field highlights.
 */
function resetLoginErrors() {
    hideInputError(loginErrorMessage);
    hideInputError(loginEmailGroup);
    hideInputError(loginPasswordGroup);
}


loginForm.addEventListener('submit', handleLogin);
loginEmail.addEventListener('input', toggleLoginButton);
loginPassword.addEventListener('input', toggleLoginButton);
guestBtn.addEventListener('click', handleGuestLogin);