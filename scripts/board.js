let tasks = [];
let contacts = {};
let currentDraggedElement = null;

const columns = ["toDo", "inProgress", "awaitFeedback", "done"];
const CATEGORY_MAP = {
    "toDo": "to do",
    "inProgress": "in progress",
    "awaitFeedback": "await feedback",
    "done": "done"
};


/**
 * Initializes the board: loads data, renders tasks, and sets up event listeners.
 * @async
 */
async function initBoard() {
    await loadContactsFromFirebase()
    await loadTasksFromFirebase();
    renderBoard();
    initDragAndDrop();
    initButtons();
}


/**
 * Fetches contact data from Firebase and updates the local contacts object.
 */
async function loadContactsFromFirebase() {
    const data = await getData("contacts");
    contacts = data || {};
}


/**
 * Fetches tasks from Firebase and transforms the data into an array with IDs.
 * @async
 * @returns {Promise<void>}
 */
async function loadTasksFromFirebase() {
    const data = await getData("tasks");
    if (!data) {
        tasks = [];
        return;
    }
    tasks = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
    }));
}


/**
 * Renders all task columns and initializes drag events for the cards.
 */
function renderBoard() {
    renderTaskColumn("toDo", "to do");
    renderTaskColumn("inProgress", "in progress");
    renderTaskColumn("awaitFeedback", "await feedback");
    renderTaskColumn("done", "done");
    attachDragEventsToCards();
}


/**
 * Filters tasks by category and renders them into the corresponding column.
 * @param {string} columnId - The ID of the HTML container element.
 * @param {string} categoryName - The category string used to filter the tasks.
 */
function renderTaskColumn(columnId, categoryName) {
    const taskColumn = document.getElementById(columnId);
    if (!taskColumn) return;

    const filteredTasks = tasks.filter(task => task.category === categoryName);

    if (filteredTasks.length === 0) {
        taskColumn.innerHTML = getNoTaskTemplate();
    } else {
        taskColumn.innerHTML = filteredTasks.map(task => generateTaskHTML(task)).join("");
    }
}


/**
 * Assembles the full HTML structure for a task card by processing subtasks, assignments, and priority.
 * @param {Object} task - The task object containing all card data.
 * @returns {string} The complete HTML string for the task card.
 */
function generateTaskHTML(task) {
    const taskType = task.taskType.toLowerCase().replace(/\s/g, '-');
    const subtasksSection = createSubtasksHTML(task.subtasks);
    const assignedSection = createAssignedUsersHTML(task.assignedTo);
    const priorityIcon = `../assets/img/board/prio-${task.priority.toLowerCase()}.svg`;

    return getTaskCardTemplate(task, taskType, subtasksSection, assignedSection, priorityIcon);
}



/**
 * Calculates progress and returns the subtasks progress bar HTML if subtasks exist.
 * @param {Array} subtasks - Array of subtask objects.
 * @returns {string} The formatted progress bar HTML or an empty string.
 */
function createSubtasksHTML(subtasks) {
    if (!subtasks || subtasks.length === 0) return "";

    const total = subtasks.length;
    const done = subtasks.filter(st => st.done).length;
    const percentage = (done / total) * 100;

    return getSubtasksTemplate(done, total, percentage);
}


/**
 * Maps assigned user IDs to their respective contact data and returns a string of badge HTML.
 * @param {string[]} assignedIds - Array of contact IDs assigned to the task.
 * @returns {string} A concatenated string of user badge HTML templates.
 */
function createAssignedUsersHTML(assignedIds) {
    if (!assignedIds || assignedIds.length === 0) return "";

    return assignedIds.map(id => {
        const contact = contacts[id];
        const initials = contact ? contact.name.split(" ").map(n => n[0]).join("") : "?";
        const bgColor = contact?.color || "#29abe2";
        const name = contact?.name || 'Unassigned';

        return getAssignedUserBadgeTemplate(initials, bgColor, name);
    }).join("");
}



/**
 * Attaches dragstart event listeners to all task cards to track the currently dragged element.
 */
function attachDragEventsToCards() {
    const cards = document.querySelectorAll(".task-card");
    cards.forEach((card) => {
        card.addEventListener("dragstart", () => {
            currentDraggedElement = card.dataset.id;
        });
    });
}


/**
 * Sets up dragover, dragleave, and drop event listeners for each task column.
 */
function initDragAndDrop() {
    columns.forEach((columnId) => {
        const dropZone = document.getElementById(columnId);

        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("board-column__drop-zone--highlight");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("board-column__drop-zone--highlight");
        });

        dropZone.addEventListener("drop", () => {
            moveTaskToColumn(columnId);
            dropZone.classList.remove("board-column__drop-zone--highlight");
        });
    });
}


/**
 * Updates a task's category based on the drop target and re-renders the board.
 * @param {string} columnId - The ID of the target column where the task was dropped.
 */
function moveTaskToColumn(columnId) {
    const newCategory = CATEGORY_MAP[columnId];
    if (!newCategory) return;

    const task = tasks.find(t => t.id === currentDraggedElement);
    if (!task) return;

    task.category = newCategory;

    if (columnId === "done") {
        autoCompleteSubtasks(task);
    }
    renderBoard();
}


/**
 * Helper to mark all subtasks as done.
 */
function autoCompleteSubtasks(task) {
    if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach(subtask => subtask.done = true);
    }
}


/**
 * Attaches click event listeners to all 'Add Task' buttons in the header and columns.
 */
function initButtons() {
    const headerButton = document.querySelector(".board__add-btn");
    if (headerButton) {
        headerButton.addEventListener("click", addTask);
    }

    const gridButtons = document.querySelectorAll(".board-column__add-btn");
    gridButtons.forEach((btn) => {
        btn.addEventListener("click", addTask);
    });
}


/**
 * DEMO ADD TASK
 */
function addTask() {
    alert("Demo-Version: Task hinzufügen ist deaktiviert.");
}


/**
 * DEMO ADD TASK
 */
function openTaskDetails(params) {
    alert("ADD task details overlay");
}


document.addEventListener("DOMContentLoaded", initBoard);