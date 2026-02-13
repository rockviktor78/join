let allTasks = [];
let currentUser = {};

const greetingEl = document.querySelector('.summary__greeting-title');
const nameEl = document.getElementById('user-name-display');
const todoCountEl = document.getElementById('todoCount');
const doneCountEl = document.getElementById('doneCount');
const progressCountEl = document.getElementById('progressCount');
const feedbackCountEl = document.getElementById('feedbackCount');
const boardCountEl = document.getElementById('boardCount');
const urgentCountEl = document.getElementById('urgentCount');
const displayDateEl = document.getElementById('displayDate');


/**
 * Initializes the summary page by loading user data and tasks, then displaying the greeting and task summary.     
 */
async function initSummary() {
    loadUserFromSessionStorage();
    displayGreetingDesktop(currentUser);
    displayGreetingMobile(currentUser);
    await loadTasksFromSessionOrFirebase();
}



/**
 * Loads the logged-in user's data from session storage. 
 * If no user data is found, redirects to the login page.
 * @return {void}
 */
function loadUserFromSessionStorage() {
    const userData = sessionStorage.getItem('loggedInUser');
    if (!userData) {
        window.location.href = "../index.html";
        return;
    }
    currentUser = JSON.parse(userData);
}


/**
 * Loads tasks from session storage if available; otherwise, fetches from Firebase, transforms the data, 
 * and stores it in session storage for future use. Finally, it renders the summary of tasks on the page.
 * @return {Promise<void>} A promise that resolves when the tasks are loaded and the summary is rendered.   
 */
async function loadTasksFromSessionOrFirebase() {
    const sessionData = sessionStorage.getItem('allTasks');
    let loadFromFirebase = true;
    if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed && parsed.length > 0) {
            allTasks = parsed;
            loadFromFirebase = false;
            console.log("Tasks aus SessionStorage geladen");
        }
    }
    if (loadFromFirebase) {
        const firebaseData = await getData("tasks");
        allTasks = transformData(firebaseData);
        sessionStorage.setItem('allTasks', JSON.stringify(allTasks));
        console.log("Tasks von Firebase geladen");
    }
    renderSummary();
}


/**
 * Transforms the data retrieved from Firebase into an array of task objects, each containing an id 
 * and its corresponding properties.
 * @param {Object} data - The raw data object from Firebase.
 * @return {Array} - An array of task objects.
 */
function transformData(data) {
    if (!data) return [];
    return Object.keys(data).map(id => ({
        id: id,
        ...data[id]
    }));
}


/**
 * Generates a greeting message based on the current time of day and user information.
 * @param {Object} user - The user object containing guest and name properties.
 * @return {Object} - An object with greeting, symbol, and name properties.
 */
function getGreetingText(user) {
    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    return {
        greeting,
        symbol: user.guest ? "!" : ",",
        name: user.guest ? "" : user.name
    };
}


/**
 * Displays a personalized greeting message on the summary page based on the user's information 
 * and the time of day.
 * @param {Object} user - The user object containing guest and name properties.
 */
function displayGreetingDesktop(user) {
    const data = getGreetingText(user);

    greetingEl.innerText =
        `${data.greeting}${data.symbol}`;

    nameEl.innerText = data.name;
}


/**
 * Calculates and renders the summary of tasks on the summary page, including counts for each category 
 * and priority, as well as the next upcoming deadline for urgent tasks. It updates the corresponding 
 * elements in the DOM with the calculated values.
 */
function renderSummary() {
    const summary = {
        todo: allTasks.filter(t => t.category === 'to do').length,
        done: allTasks.filter(t => t.category === 'done').length,
        progress: allTasks.filter(t => t.category === 'in progress').length,
        feedback: allTasks.filter(t => t.category === 'await feedback').length,
        urgent: allTasks.filter(t => t.priority === 'urgent').length,
    };

    todoCountEl.innerText = summary.todo;
    doneCountEl.innerText = summary.done;
    progressCountEl.innerText = summary.progress;
    feedbackCountEl.innerText = summary.feedback;
    boardCountEl.innerText = allTasks.length;
    urgentCountEl.innerText = summary.urgent;
    displayDateEl.innerText = getNextDeadline();
}


/**
 * Finds the next upcoming deadline among tasks marked as "urgent" and returns it in a human-readable format. 
 * If there are no urgent tasks with deadlines, it returns a message indicating that there are no upcoming deadlines.
 * @return {string} - The next deadline in "Month Day, Year" format or a message if there are no upcoming deadlines.
 */
function getNextDeadline() {
    const urgentTasks = allTasks.filter(t => t.priority === 'urgent' && t.dueDate);
    if (urgentTasks.length === 0) return "No upcoming deadlines";

    urgentTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const nextDate = new Date(urgentTasks[0].dueDate);

    return nextDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}


/**
 * Main function to handle the mobile greeting lifecycle.
 * @param {Object} user - The user object.     
 */
function displayGreetingMobile(user) {
    if (window.innerWidth > 768) return;

    const data = getGreetingText(user);
    const overlay = createOverlayElement(data);
    document.body.appendChild(overlay);
    runOverlayAnimation(overlay);
}


/**
 * Creates the overlay DOM element and fills it with HTML.
 * @param {Object} data - The greeting data object.
 * @return {Element} - The created overlay element.
 */
function createOverlayElement(data) {
    const overlay = document.createElement('div');

    overlay.id = 'greetingOverlay';
    overlay.className = 'summary__greeting-overlay';
    overlay.innerHTML = getGreetingOverlayHTML(data);
    return overlay;
}


/**
 * Manages the timing: Show -> Fade Out -> Remove.
 * @param {Element} overlay - The overlay element to animate.
 */
function runOverlayAnimation(overlay) {
    overlay.classList.add('show');

    setTimeout(() => {
        overlay.classList.remove('show');

        setTimeout(() => overlay.remove(), 1000);
    }, 1500);
}


/**
 * Pure HTML Template for the overlay.
 * @param {Object} data - The greeting data object.
 * @return {string} - The HTML string for the overlay.
 */
function getGreetingOverlayHTML(data) {
    return `
        <h2 class="summary__greeting-title">${data.greeting}${data.symbol}</h2>
        <span class="summary__greeting-name">${data.name}</span>
    `;
}


document.addEventListener("DOMContentLoaded", initSummary);



