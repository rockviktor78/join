/**
 * Generates the HTML template for the task detail view,
 * including task information, assigned users, subtasks, and action buttons.
 *
 * @param {Object} task - The task object containing all task details.
 * @param {string} contactsHTML - Pre-generated HTML string for assigned contacts.
 * @param {string} subtasksHTML - Pre-generated HTML string for subtasks.
 * @returns {string} The complete HTML string for the task detail component.
 */
function getTaskDetailTemplate(task, contactsHTML, subtasksHTML) {
    const priorityIcon = `../assets/img/board/prio-${task.priority.toLowerCase()}.svg`;
    const priorityName = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    return `
        <div class="task-detail">
            <div class="task-detail__header">
                <span class="task-card__category task-card__category--${task.taskType.toLowerCase().replace(/\s/g, '-')}">
                    ${task.taskType}
                </span>
                <button class="task-detail__close-btn" onclick="closeTaskDetails()">
                    <img src="../assets/img/contacts/cancel.svg" alt="Close">
                </button>
            </div>

            <h1 class="task-detail__title">${task.title}</h1>
            <p class="task-detail__description">${task.description || ''}</p>

            <div class="task-detail__property">
                <span class="label">Due date:</span>
                <span>${task.dueDate || 'No date set'}</span>
            </div>

            <div class="task-detail__property">
                <span class="label">Priority:</span>
                <div class="priority-badge">
                    <span>${priorityName} <img src="${priorityIcon}" alt=""></span>
                </div>
            </div>

            <div class="task-detail__section">
                <span class="label">Assigned To:</span>
                <div class="detail-assigned-list">
                    ${contactsHTML}
                </div>
            </div>

            <div class="task-detail__section">
                <span class="label">Subtasks</span>
                <div class="detail-subtask-list">
                    ${subtasksHTML}
                </div>
            </div>

            <div class="task-detail__actions">
                <button class="action-btn" onclick="deleteTask('${task.id}')">
                    <img src="../assets/img/contacts/delete.svg" alt="Delete Icon"> Delete
                </button>
                <div class="action-divider"></div>
                <button class="action-btn" onclick="editTask('${task.id}')">
                    <img src="../assets/img/contacts/edit.svg" alt="Edit Icon"> Edit
                </button>
            </div>
        </div>
    `;
}


function getDetailedContactItemTemplate(contact, initials) {
    return `
        <div class="detail-contact-item">
            <div class="task-card__user-badge"
                 style="background-color: ${contact.color}">
                 ${initials}
            </div>
            <span>${contact.name}</span>
        </div>
    `;
}

function getNoAssignedTemplate() {
    return `
        <span class="no-assigned">
            No one assigned
        </span>
    `;
}

function getDetailSubtaskItemTemplate(taskId, index, title, isDone) {
    const imgChecked = isDone
        ? '../assets/img/auth/checkbox-checked.svg'
        : '../assets/img/auth/checkbox-default.svg';

    return `
        <div class="detail-subtask-item"
             onclick="toggleSubtask('${taskId}', ${index})">
            <img src="${imgChecked}" alt="checkbox">
            <span>${title}</span>
        </div>
    `;
}

function getNoSubtasksTemplate() {
    return `
        <span class="no-subtasks">
            No subtasks
        </span>
    `;
}


