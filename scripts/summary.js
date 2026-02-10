let allTasks = [];
let currentUser = {};

const greetingEl = document.querySelector('.summary__greeting-title');
const nameElement = document.getElementById('user-name-display');
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
    displayGreeting(currentUser);
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

    if (sessionData) {
        allTasks = JSON.parse(sessionData);
        console.log("Tasks aus SessionStorage geladen");  // remove console.log in finnal version
    } else {
        const firebaseData = await getData("tasks");
        allTasks = transformData(firebaseData);
        sessionStorage.setItem('allTasks', JSON.stringify(allTasks));
        console.log("Tasks von Firebase geladen");        // remove console.log in finnal version
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
function displayGreeting(user) {
    const data = getGreetingText(user);

    greetingEl.innerText =
        `${data.greeting}${data.symbol}`;

    nameElement.innerText = data.name;
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


document.addEventListener("DOMContentLoaded", initSummary);