const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('signupName');
const emailInput = document.getElementById('signupEmail');
const passwordInput = document.getElementById('signupPassword');
const confirmPasswordInput = document.getElementById('signupConfirmPassword');
const signupBtn = document.getElementById('signupBtn');
const errorMsg = document.getElementById("errorMsg");
const passwordGroup = document.getElementById('signupPasswordGroup');
const confirmGroup = document.getElementById('signupConfirmGroup');
const passwortIcon = document.getElementById('signupPasswordIcon');
const confirmPasswordIcon = document.getElementById('signupConfirmIcon');
const eyeOff = "../assets/img/auth/visibility-off-default.svg";
const eyeOn = "../assets/img/auth/visibility-on-default.svg";


function validatePasswords() {
    const isMatch = passwordInput.value === confirmPasswordInput.value;

    if (!isMatch) {
        errorMsg.classList.add('show');
        confirmGroup.classList.add('auth-card__input-group--error');
    } else {
        errorMsg.classList.remove('show');
        confirmGroup.classList.remove('auth-card__input-group--error');
        confirmPasswordInput.setCustomValidity('');
    }
    return isMatch;
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
    if (!validatePasswords())
        return;

    const newUser = getNewUserData();
    setSubmitting(true);

    try {
        await postData("users", newUser);
        signupForm.reset();
        showLogin({ preventDefault: () => { } });
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


confirmPasswordInput.addEventListener('input', () => {
    if (passwordInput.value === confirmPasswordInput.value) {
        errorMsg.classList.remove('show');
        confirmGroup.classList.remove('auth-card__input-group--error');
    }
});