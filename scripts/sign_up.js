const form = document.getElementById('signupForm');
const nameInput = document.getElementById('signupName');
const emailInput = document.getElementById('signupEmail');
const passwordInput = document.getElementById('signupPassword');
const confirmPasswordInput = document.getElementById('signupConfirmPassword');
const submitBtn = document.getElementById('signupBtn');
const inputGroup = confirmPasswordInput.parentElement;


function validatePasswords() {
    const isMatch = passwordInput.value === confirmPasswordInput.value;

    if (!isMatch) {
        confirmPasswordInput.setCustomValidity('Passwords do not match');
        inputGroup.classList.add('auth-card__input-group--error');
        confirmPasswordInput.reportValidity();
    } else {
        confirmPasswordInput.setCustomValidity('');
        inputGroup.classList.remove('auth-card__input-group--error');
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
    submitBtn.disabled = isSubmitting;
}


async function addUser() {
    if (!validatePasswords())
        return;

    const newUser = getNewUserData();
    setSubmitting(true);

    try {
        await postData("users", newUser);
        form.reset();
        // redirect und nachricht "erfolgreich angemeldet"
    } catch (error) {
        console.error("Firebase Error:", error);
    } finally {
        setSubmitting(false);
    }
}


form.addEventListener('submit', (onSubmit) => {
    onSubmit.preventDefault();
    addUser();
});