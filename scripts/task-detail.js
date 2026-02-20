const overlayContainer = document.getElementById('overlay-container');
const overlayContent = document.getElementById('overlay-content');
const overlayTransitionDuration = 250;
let currentTask = null;


function openTaskDetails(taskId) {
    currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) return;

    renderTaskOverlay();
    showOverlay();
}


function closeTaskDetails() {
    overlayContainer.classList.remove('show');

    setTimeout(() => {
        overlayContainer.classList.add('hidden');
        document.body.style.overflow = 'auto';
        currentTask = null;
    }, overlayTransitionDuration);
}

function showOverlay() {
    overlayContainer.classList.remove('hidden');

    setTimeout(() => {
        overlayContainer.classList.add('show');
    }, 10);

    document.body.style.overflow = 'hidden';
}


function renderTaskOverlay() {
    if (!currentTask) return;

    const contactsHTML = getDetailedContactTemplate(currentTask.assignedTo);
    const subtasksHTML = getDetailSubtasksTemplate(currentTask.id, currentTask.subtasks);

    overlayContent.innerHTML = getTaskDetailTemplate(
        currentTask,
        contactsHTML,
        subtasksHTML
    );
}


async function toggleSubtask(taskId, subtaskIndex) {
    if (!currentTask || !currentTask.subtasks?.[subtaskIndex]) return;

    currentTask.subtasks[subtaskIndex].done =
        !currentTask.subtasks[subtaskIndex].done;

    await updateTasks(tasksFromArrayToObject(tasks));

    renderTaskOverlay();
    renderBoard(searchInput?.value || "");
}


async function deleteTask(taskId) {
    const previousTasks = [...tasks];

    tasks = tasks.filter(t => t.id !== taskId);

    try {
        await updateTasks(tasksFromArrayToObject(tasks));
        closeTaskDetails();
        renderBoard(searchInput?.value || "");
    } catch {
        tasks = previousTasks;
        renderBoard(searchInput?.value || "");
    }
}


function getDetailedContactTemplate(assignedIds) {
    if (!assignedIds?.length) {
        return getNoAssignedTemplate();
    }

    const contactsArray = getContacts();

    return assignedIds.map(id => {
        const contact = contactsArray.find(c => c.id === id);
        if (!contact) return "";

        const initials = getInitials(contact.name);

        return getDetailedContactItemTemplate(contact, initials);
    }).join("");
}


function getDetailSubtasksTemplate(taskId, subtasks) {
    if (!subtasks?.length) {
        return getNoSubtasksTemplate();
    }

    return subtasks.map((st, index) => {
        const isDone = st.done;
        return getDetailSubtaskItemTemplate(taskId, index, st.title, isDone);
    }).join("");
}

function getInitials(name) {
    return name
        .split(" ")
        .map(n => n[0])
        .join("");
}


