const greetingElement = document.querySelector('.summary__greeting-title');
const nameElement = document.getElementById('user-name-display');
const dateElement = document.getElementById('display-date');


/**
 *  Updates the date display element with the current date.
 */
function updateDate() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    dateElement.innerText = now.toLocaleDateString('en-US', options);
    dateElement.setAttribute('datetime', now.toISOString().split('T')[0]);
}


/**
 * Returns a greeting based on the current time of day.
 * @return {string} - The greeting message.
 */
function getGreetingByTime() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
}



/*
async function loadInitialTasks() {
    // Hier holst du die Demo-Daten
    const allTasks = await getData("tasks");

    // Anstatt sie in die Datenbank zurückzuschreiben, 
    // speicherst du sie nur in einer lokalen Variable in deinem Script.
    renderBoard(allTasks);
}

*/


document.addEventListener("DOMContentLoaded", async () => {
    const userData = sessionStorage.getItem('loggedInUser');
    if (!userData) {
        window.location.href = "../index.html";
        return;
    }
    const currentUser = JSON.parse(userData);

    updateDate(dateElement);
    greetingElement.innerText = getGreetingByTime();

    if (currentUser.guest) {
        nameElement.innerText = "";
    } else {
        nameElement.innerText = `, ${currentUser.name}`;
    }

    // await loadInitialTasks();
});