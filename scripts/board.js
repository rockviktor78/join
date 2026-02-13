let tasks = [];
let contacts = {};
let currentDraggedElement = null;

const columns = ["todo", "inprogress", "awaitfeedback", "done"];
const CATEGORY_MAP = {
    "todo": "to do",
    "inprogress": "in progress",
    "awaitfeedback": "await feedback",
    "done": "done"
};


async function initBoard() {
    await loadContactsFromFirebase()
    await loadTasksFromFirebase();
    renderBoard();
    initDragAndDrop();
    initButtons();
}


async function loadContactsFromFirebase() {
    const data = await getData("contacts");
    contacts = data || {};
}


/**
 * LOAD TASKS FROM FIREBASE (READ ONLY)
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
 * RENDER COMPLETE BOARD
 */
function renderBoard() {
    renderTaskColumn("todo", "to do");
    renderTaskColumn("inprogress", "in progress");
    renderTaskColumn("awaitfeedback", "await feedback");
    renderTaskColumn("done", "done");
    attachDragEventsToCards();
}

/**
 * RENDER SINGLE COLUMN
 */
function renderTaskColumn(columnId, categoryName) {
    const column = document.getElementById(columnId);
    column.innerHTML = "";

    const filteredTasks = tasks.filter(
        (task) => task.category === categoryName
    );

    filteredTasks.forEach((task) => {
        column.innerHTML += generateTaskHTML(task);
    });
}

/**
 * GENERATE TASK CARD (Updated to BEM)
 */
function generateTaskHTML(task) {

    const typeClass = task.taskType.toLowerCase().replace(/\s/g, '-');

    const assignedCircles = task.assignedTo
        .map(id => {
            const contact = contacts[id];
            const initials = contact ? contact.name.split(" ").map(n => n[0]).join("") : "?";

            const bgColor = contact?.color || "#29abe2";
            return `<div class="task-card__user-badge" style="background-color: ${bgColor}" title="${contact?.name || 'Unassigned'}">${initials}</div>`;
        })
        .join("");

    return `
        <div draggable="true"
             class="task-card"
             data-id="${task.id}">
             
            <div class="task-card__category task-card__category--${typeClass}">${task.taskType}</div>
            
            <div class="task-card__content">
                <div class="task-card__title">${task.title}</div>
                <div class="task-card__description">${task.description}</div>
            </div>

            <div class="task-card__footer">
                <div class="task-card__assigned-users">
                    ${assignedCircles}
                </div>
                <div class="task-card__priority">
                    <img class="task-card__priority-icon" src="../assets/img/board/prio-${task.priority.toLowerCase()}.svg" alt="${task.priority}">
                </div>
            </div>
        </div>
    `;
}



/**
 * ATTACH DRAG EVENTS TO CARDS (Updated Class Name)
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
 * DRAG & DROP SETUP (Updated Highlight Class)
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
 * MOVE TASK (DEMO ONLY – LOCAL CHANGE)
 */
function moveTaskToColumn(columnId) {
    const newCategory = CATEGORY_MAP[columnId];
    if (!newCategory) return;

    const task = tasks.find(t => t.id === currentDraggedElement);
    if (!task) return;

    task.category = newCategory;
    renderBoard();
}


/**
 * BUTTON EVENTS (Updated Selectors)
 */
function initButtons() {
    // Header-Button (neue Klasse aus dem HTML)
    const headerButton = document.querySelector(".board__add-btn");
    if (headerButton) {
        headerButton.addEventListener("click", addTask);
    }

    // Spalten-Buttons
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
 * INIT
 */
document.addEventListener("DOMContentLoaded", initBoard);