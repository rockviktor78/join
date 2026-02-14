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


function renderBoard() {
    renderTaskColumn("toDo", "to do");
    renderTaskColumn("inProgress", "in progress");
    renderTaskColumn("awaitFeedback", "await feedback");
    renderTaskColumn("done", "done");
    attachDragEventsToCards();
}


/**
 * Renders a single column by filtering tasks and generating their HTML.
 */
function renderTaskColumn(columnId, categoryName) {
    const column = document.getElementById(columnId);
    if (!column) return;

    const filteredTasks = tasks.filter(task => task.category === categoryName);

    if (filteredTasks.length === 0) {
        column.innerHTML = `<div class="no-tasks">No tasks</div>`;
    } else {
        column.innerHTML = filteredTasks.map(task => generateTaskHTML(task)).join("");
    }
}

/**
 * Main function to assemble the Task Card HTML.
 */
function generateTaskHTML(task) {
    const typeClass = task.taskType.toLowerCase().replace(/\s/g, '-');
    const subtasksSection = createSubtasksHTML(task.subtasks);
    const assignedSection = createAssignedUsersHTML(task.assignedTo);
    const prioIcon = `../assets/img/board/prio-${task.priority.toLowerCase()}.svg`;

    // Wir rufen die Template-Funktion auf und übergeben nur die fertigen Bausteine
    return getTaskCardTemplate(task, typeClass, subtasksSection, assignedSection, prioIcon);
}


/**
 * Template function: Only returns the HTML structure.
 */
function getTaskCardTemplate(task, typeClass, subtasksSection, assignedSection, prioIcon) {
    return `
        <div draggable="true" class="task-card" data-id="${task.id}" onclick="openTaskDetails('${task.id}')">
            <div class="task-card__category task-card__category--${typeClass}">
                ${task.taskType}
            </div>
            <div class="task-card__content">
                <div class="task-card__title">${task.title}</div>
                <div class="task-card__description">${task.description}</div>
            </div>
            ${subtasksSection}
            <div class="task-card__footer">
                <div class="task-card__assigned-users">
                    ${assignedSection}
                </div>
                <div class="task-card__priority">
                    <img class="task-card__priority-icon" src="${prioIcon}" alt="${task.priority}">
                </div>
            </div>
        </div>
    `;
}


/**
 * Helper: Generates the Progress Bar HTML only if subtasks exist.
 */
function createSubtasksHTML(subtasks) {
    if (!subtasks || subtasks.length === 0) return "";

    const total = subtasks.length;
    const done = subtasks.filter(st => st.done).length;
    const percentage = (done / total) * 100;

    return `
        <div class="task-card__progress-container">
            <div class="task-card__progress-bar">
                <div class="task-card__progress-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="task-card__progress-text">${done}/${total} Subtasks</span>
        </div>
    `;
}

/**
 * Helper: Generates the initials-badges for assigned contacts.
 */
function createAssignedUsersHTML(assignedIds) {
    if (!assignedIds) return "";

    return assignedIds.map(id => {
        const contact = contacts[id];
        const initials = contact ? contact.name.split(" ").map(n => n[0]).join("") : "?";
        const bgColor = contact?.color || "#29abe2";

        return `
            <div class="task-card__user-badge" 
                 style="background-color: ${bgColor}" 
                 title="${contact?.name || 'Unassigned'}">
                 ${initials}
            </div>`;
    }).join("");
}







function attachDragEventsToCards() {
    const cards = document.querySelectorAll(".task-card");

    cards.forEach((card) => {
        card.addEventListener("dragstart", () => {
            currentDraggedElement = card.dataset.id;
        });
    });
}


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




function moveTaskToColumn(columnId) {
    const newCategory = CATEGORY_MAP[columnId];
    if (!newCategory) return;

    const task = tasks.find(t => t.id === currentDraggedElement);
    if (!task) return;

    // 1. Kategorie aktualisieren (Spalte wechseln)
    task.category = newCategory;

    // 2. WICHTIG: Wenn in "done" geschoben, alle Subtasks auf erledigt setzen
    if (columnId === "done" && task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach(subtask => {
            subtask.done = true;
        });
    }

    // 3. Optional: Hier könntest du den Task auch wieder in Firebase speichern
    // updateTaskInFirebase(task); 

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