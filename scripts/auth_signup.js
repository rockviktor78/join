const signupForm = document.getElementById('signupForm');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');
const signupBtn = document.getElementById('signupBtn');

const signUpNameGroup = document.getElementById('signUpNameGroup');
const signEmailGroup = document.getElementById('signEmailGroup');
const signupPasswordGroup = document.getElementById('signupPasswordGroup');
const signupConfirmGroup = document.getElementById('signupConfirmGroup');

const signupNameError = document.getElementById('signupNameError');
const signupEmailError = document.getElementById('signupEmailError');
const signupPasswordError = document.getElementById('signupPasswordError');
const signupConfirmError = document.getElementById('signupConfirmError');

const policyCheckbox = document.getElementById('policyCheckbox');
const policyError = document.getElementById('policyError');
const passwordIcon = document.getElementById('signupPasswordIcon');
const confirmPasswordIcon = document.getElementById('signupConfirmIcon');
const signupSuccessModal = document.getElementById('signupSuccessModal');


initPasswordIconToggle(signupPassword, passwordIcon);
initPasswordIconToggle(signupConfirmPassword, confirmPasswordIcon);


function validateName() {
    if (signupName.value.trim() === "") {
        showInputError(signupNameError, signUpNameGroup, "Please enter your name.");
        return false;
    }
    hideInputError(signupNameError, signUpNameGroup);
    return true;
}


function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(signupEmail.value)) {
        showInputError(signupEmailError, signEmailGroup, "Please enter a valid email.");
        return false;
    }
    hideInputError(signupEmailError, signEmailGroup);
    return true;
}


function validatePasswords() {
    if (signupPassword.value.length < 6) {
        showInputError(signupPasswordError, signupPasswordGroup, "Password must be at least 6 characters long.");
        return false;
    }
    if (signupPassword.value !== signupConfirmPassword.value) {
        showInputError(signupConfirmError, signupConfirmGroup, "Your passwords don't match. Please try again.");
        return false;
    }
    hideInputError(signupPasswordError, signupPasswordGroup);
    hideInputError(signupConfirmError, signupConfirmGroup);
    return true;
}


function validatePolicy() {
    if (!policyCheckbox.checked) {
        policyError.innerText = "Please accept the Privacy Policy.";
        policyError.classList.add('show');
        return false;
    }
    policyError.classList.remove('show');
    return true;
}


function getNewUserData() {
    return {
        name: signupName.value.trim(),
        email: signupEmail.value.trim(),
        password: signupPassword.value
    };
}


function setSubmitting(isSubmitting) {
    signupBtn.disabled = isSubmitting;
}


function isSignupValid() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePasswords();
    const isPolicyValid = validatePolicy();
    return isNameValid && isEmailValid && isPasswordValid && isPolicyValid;
}


function handleSignupSuccess() {
    signupSuccessModal.classList.add('show');

    setTimeout(() => {
        signupSuccessModal.classList.remove('show');
        signupForm.reset();

        if (typeof showLogin === "function") {
            showLogin({ preventDefault: () => { } });
        }
    }, 2000);
}


async function checkIfEmailExists(email) {
    const allUsers = await getData("users");
    if (allUsers === null) {
        return false;
    }
    const userList = Object.values(allUsers);
    const found = userList.some(user => user.email.toLowerCase() === email.toLowerCase());
    return found;
}


function showEmailInUseError() {
    signupEmailError.innerText = "This email is already in use.";
    signupEmailError.classList.add('show');
    signEmailGroup.classList.add('auth-card__input-group--error');
}


async function createUser(userData) {
    await postData("users", userData);
}


async function addUser() {
    if (!isSignupValid()) return;
    const newUser = getNewUserData();
    setSubmitting(true);
    try {
        const emailExists = await checkIfEmailExists(newUser.email);
        if (emailExists) {
            showEmailInUseError();
            setSubmitting(false);
            return;
        }
        await createUser(newUser);
        handleSignupSuccess();
    } catch (error) {
        console.error("Firebase Error:", error);
    } finally {
        setSubmitting(false);
    }
}


function handleSignUpSubmit(event) {
    event.preventDefault();
    addUser();
}


function handleNameInput() {
    if (signupName.value.trim() !== "") {
        hideInputError(signupNameError, signUpNameGroup);
    }
}


function handleEmailInput() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(signupEmail.value)) {
        hideInputError(signupEmailError, signEmailGroup);
    }
}


function handlePasswordInput() {
    if (signupPassword.value.length >= 6) hideInputError(signupPasswordError, signupPasswordGroup);
    if (signupPassword.value === signupConfirmPassword.value) hideInputError(signupConfirmError, signupConfirmGroup);
}

function handleConfirmPasswordInput() {
    if (signupPassword.value === signupConfirmPassword.value) {
        hideInputError(signupConfirmError, signupConfirmGroup);
        if (signupPassword.value.length >= 6) hideInputError(signupPasswordError, signupPasswordGroup);
    }
}


function handlePolicyChange() {
    if (policyCheckbox.checked) {
        policyError.classList.remove('show');
    }
}


if (signupForm) signupForm.addEventListener('submit', handleSignUpSubmit);
if (signupName) signupName.addEventListener('input', handleNameInput);
if (signupEmail) signupEmail.addEventListener('input', handleEmailInput);
if (signupPassword) signupPassword.addEventListener('input', handlePasswordInput);
if (signupConfirmPassword) signupConfirmPassword.addEventListener('input', handleConfirmPasswordInput);
if (policyCheckbox) policyCheckbox.addEventListener('change', handlePolicyChange);
