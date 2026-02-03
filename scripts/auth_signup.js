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
        signupNameError.innerText = "Please enter your name.";
        signupNameError.classList.add('show');
        signUpNameGroup.classList.add('auth-card__input-group--error');
        return false;
    }
    signupNameError.classList.remove('show');
    signUpNameGroup.classList.remove('auth-card__input-group--error');
    return true;
}


function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(signupEmail.value)) {
        signupEmailError.innerText = "Please enter a valid email.";
        signupEmailError.classList.add('show');
        signEmailGroup.classList.add('auth-card__input-group--error');
        return false;
    }
    signupEmailError.classList.remove('show');
    signEmailGroup.classList.remove('auth-card__input-group--error');
    return true;
}


function validatePasswords() {
    if (signupPassword.value.length < 6) {
        signupPasswordError.innerText = "Password must be at least 6 characters long.";
        signupPasswordError.classList.add('show');
        signupPasswordGroup.classList.add('auth-card__input-group--error');
        return false;
    }
    if (signupPassword.value !== signupConfirmPassword.value) {
        signupConfirmError.innerText = "Your passwords don't match. Please try again.";
        signupConfirmError.classList.add('show');
        signupConfirmGroup.classList.add('auth-card__input-group--error');
        return false;
    }
    signupPasswordError.classList.remove('show');
    signupConfirmError.classList.remove('show');
    signupPasswordGroup.classList.remove('auth-card__input-group--error');
    signupConfirmGroup.classList.remove('auth-card__input-group--error');
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
        signupNameError.classList.remove('show');
        signUpNameGroup.classList.remove('auth-card__input-group--error');
    }
}


function handleEmailInput() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(signupEmail.value)) {
        signupEmailError.classList.remove('show');
        signEmailGroup.classList.remove('auth-card__input-group--error');
    }
}


function handlePasswordInput() {
    if (signupPassword.value.length >= 6) {
        signupPasswordError.classList.remove('show');
        signupPasswordGroup.classList.remove('auth-card__input-group--error');
    }
    if (signupPassword.value === signupConfirmPassword.value) {
        signupConfirmError.classList.remove('show');
        signupConfirmGroup.classList.remove('auth-card__input-group--error');
    }
}


function handleConfirmPasswordInput() {
    if (signupPassword.value === signupConfirmPassword.value) {
        signupConfirmError.classList.remove('show');
        signupConfirmGroup.classList.remove('auth-card__input-group--error');
        if (signupPassword.value.length >= 6) {
            signupPasswordError.classList.remove('show');
            signupPasswordGroup.classList.remove('auth-card__input-group--error');
        }
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
