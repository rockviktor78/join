// 1. Inputs (Die Datenquellen)
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('signupName');
const emailInput = document.getElementById('signupEmail');
const passwordInput = document.getElementById('signupPassword');
const confirmPasswordInput = document.getElementById('signupConfirmPassword');
const signupBtn = document.getElementById('signupBtn');

// 2. Groups & Wrappers
const nameGroup = document.getElementById('nameGroup');
const emailGroup = document.getElementById('emailGroup');
const passwordGroup = document.getElementById('signupPasswordGroup');
const confirmGroup = document.getElementById('signupConfirmGroup');

// 3. Error Container
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');

// 4. UI Components (Icons, Modals, Buttons)
const policyCheckbox = document.getElementById('signup-policy');
const policyError = document.getElementById('policyError');
const passwortIcon = document.getElementById('signupPasswordIcon');
const confirmPasswordIcon = document.getElementById('signupConfirmIcon');
const modal = document.getElementById('signupSuccessModal');

// 4. Assets 
const eyeOff = "./assets/img/auth/visibility-off-default.svg";
const eyeOn = "./assets/img/auth/visibility-on-default.svg";


function validateName() {
    if (nameInput.value.trim() === "") {
        nameError.innerText = "Please enter your name.";
        nameError.classList.add('show');
        nameGroup.classList.add('auth-card__input-group--error');
        return false;
    }
    nameError.classList.remove('show');
    nameGroup.classList.remove('auth-card__input-group--error');
    return true;
}


function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
        emailError.innerText = "Please enter a valid email.";
        emailError.classList.add('show');
        emailGroup.classList.add('auth-card__input-group--error');
        return false;
    }
    emailError.classList.remove('show');
    emailGroup.classList.remove('auth-card__input-group--error');
    return true;
}


function validatePasswords() {
    if (passwordInput.value.length < 6) {
        passwordError.innerText = "Password must be at least 6 characters long.";
        passwordError.classList.add('show');
        passwordGroup.classList.add('auth-card__input-group--error');
        return false;
    }
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmError.innerText = "Your passwords don't match. Please try again.";
        confirmError.classList.add('show');
        confirmGroup.classList.add('auth-card__input-group--error');
        return false;
    }
    passwordError.classList.remove('show');
    confirmError.classList.remove('show');
    passwordGroup.classList.remove('auth-card__input-group--error');
    confirmGroup.classList.remove('auth-card__input-group--error');
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
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value
    };
}


function setSubmitting(isSubmitting) {
    signupBtn.disabled = isSubmitting;
}


async function addUser() {
    const nameOk = validateName();
    const emailOk = validateEmail();
    const passOk = validatePasswords();
    const policyOk = validatePolicy();

    if (!nameOk || !emailOk || !passOk || !policyOk) return;
    const newUser = getNewUserData();
    setSubmitting(true);
    try {
        await postData("users", newUser);
        modal.classList.add('show');

        setTimeout(() => {
            modal.classList.remove('show');
            signupForm.reset();
            if (typeof showLogin === "function") {
                showLogin({ preventDefault: () => { } });
            }
        }, 2000);
    } catch (error) {
        console.error("Firebase Error:", error);
    } finally {
        setSubmitting(false);
    }
}


passwordInput.onfocus = function () {
    if (passwordInput.type === 'password') {
        passwortIcon.src = eyeOff;
    }
};


passwortIcon.onclick = function () {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwortIcon.src = eyeOn;
    } else {
        passwordInput.type = 'password';
        passwortIcon.src = eyeOff;
    }
};


confirmPasswordInput.onfocus = function () {
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordIcon.src = eyeOff;
    }
};


confirmPasswordIcon.onclick = function () {
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        confirmPasswordIcon.src = eyeOn;
    } else {
        confirmPasswordInput.type = 'password';
        confirmPasswordIcon.src = eyeOff;
    }
};


signupForm.addEventListener('submit', (onSubmit) => {
    onSubmit.preventDefault();
    addUser();
});


nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== "") {
        nameError.classList.remove('show');
        nameGroup.classList.remove('auth-card__input-group--error');
    }
});


emailInput.addEventListener('input', () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(emailInput.value)) {
        emailError.classList.remove('show');
        emailGroup.classList.remove('auth-card__input-group--error');
    }
});


passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length >= 6) {
        passwordError.classList.remove('show');
        passwordGroup.classList.remove('auth-card__input-group--error');
    }
    if (passwordInput.value === confirmPasswordInput.value) {
        confirmError.classList.remove('show');
        confirmGroup.classList.remove('auth-card__input-group--error');
    }
});


confirmPasswordInput.addEventListener('input', () => {
    if (passwordInput.value === confirmPasswordInput.value) {
        confirmError.classList.remove('show');
        confirmGroup.classList.remove('auth-card__input-group--error');
        if (passwordInput.value.length >= 6) {
            passwordError.classList.remove('show');
            passwordGroup.classList.remove('auth-card__input-group--error');
        }
    }
});


policyCheckbox.addEventListener('change', () => {
    if (policyCheckbox.checked) {
        policyError.classList.remove('show');
    }
});