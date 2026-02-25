/**
 * Switches the task detail view into edit mode for the given task.
 * Renders the edit form and initializes subtasks and assigned contacts.
 *
 * @param {string} taskId - The ID of the task to edit.
 */
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const container = document.getElementById('taskDetailContent');
    container.innerHTML = templateEditTaskForm(task);

    renderEditSubtasks(task.subtasks || []);
    renderEditContactList(task.assignedTo || []);
    updateEditSelectedContactsIcons();
    initEditSubtaskInput();
}

/**
 * Renders the editable subtask list in the edit view.
 *
 * @param {Array<Object>} subtasks - Array of subtask objects.
 */
function renderEditSubtasks(subtasks) {
    const listContainer = document.getElementById('editSubtasksList');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    subtasks.forEach((st, index) => {
        listContainer.innerHTML += templateEditSubtaskItem(st, index);
    });
}

/**
 * Sets the active priority button in the edit view
 * and updates its visual state and icon.
 *
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function setEditPriority(prio) {
    const priorities = ['urgent', 'medium', 'low'];

    priorities.forEach(p => {
        const btn = document.getElementById(`prio-${p}`);
        const img = document.getElementById(`prio-img-${p}`);
        if (btn && img) {
            btn.classList.remove('active', 'urgent', 'medium', 'low');
            img.src = `../assets/img/addtask/${p}.svg`;
        }
    });

    const activeBtn = document.getElementById(`prio-${prio}`);
    const activeImg = document.getElementById(`prio-img-${prio}`);
    if (activeBtn && activeImg) {
        activeBtn.classList.add('active', prio);
        activeImg.src = `../assets/img/addtask/${prio}selected.svg`;
    }
}

/**
 * Renders the full contact list in the edit dropdown
 * and marks currently assigned contacts as selected.
 *
 * @param {Array<string>} currentlyAssigned - Array of assigned contact IDs.
 */
function renderEditContactList(currentlyAssigned) {
    const list = document.getElementById('editDropdownList');
    if (!list) return;
    const contactsArray = getContacts();
    list.innerHTML = contactsArray.map(contact => {
        const isSelected = currentlyAssigned.includes(contact.id);
        const initials = contact.name.split(" ").map(n => n[0]).join("");

        return templateEditContactItem(contact, isSelected, initials);
    }).join('');
}

/**
 * Toggles the selection state of a contact item
 * in the edit dropdown and updates the selected contact icons.
 *
 * @param {string} contactId - The contact ID.
 * @param {string} color - The contact's assigned color.
 * @param {string} initials - The contact's initials.
 */
function toggleContactSelectionEdit(contactId, color, initials) {
    const item = event.currentTarget;
    item.classList.toggle('selected');
    const checkmark = item.querySelector('.selection-checkmark');
    if (checkmark) {
        checkmark.classList.toggle('checked');
    }
    updateEditSelectedContactsIcons();
}

/**
 * Updates the visual badges of selected contacts
 * in the edit task view.
 */
function updateEditSelectedContactsIcons() {
    const selectedContainer = document.getElementById('editSelectedContacts');
    const selectedItems = document.querySelectorAll('#editDropdownList .contact-item.selected');

    if (!selectedContainer) return;
    selectedContainer.innerHTML = '';
    selectedItems.forEach(item => {
        const initial = item.querySelector('.assign-to-initial').innerText;
        const color = item.querySelector('.assign-to-initial').style.backgroundColor;

        selectedContainer.innerHTML += `
            <div class="assign-to-initial" style="background-color: ${color}">
                ${initial}
            </div>
        `;
    });
}

/**
 * Collects all editable form data from the edit task view
 * and returns it as a task update object.
 *
 * @returns {Object} The updated task data including title,
 * description, due date, priority, and assigned contacts.
 */
function getFormDataFromEdit() {
    const activePrioBtn = document.querySelector('#editPriority .priority__button.active');

    return {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        dueDate: document.getElementById('editDueDate').value,
        priority: activePrioBtn ? activePrioBtn.id.replace('prio-', '') : 'medium',
        assignedTo: Array.from(document.querySelectorAll('#editDropdownList .contact-item.selected'))
            .map(item => item.getAttribute('data-id'))
    };
}

/**
 * Saves the updated task data to storage, updates the current task reference,
 * and re-renders the board and task overlay.
 *
 * @param {string} taskId - The ID of the task to update.
 */
function saveEditedTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    const updatedData = getFormDataFromEdit();
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
    currentTask = tasks[taskIndex];
    renderBoard();
    renderTaskOverlay();
}

/**
 * Toggles the visibility of the edit subtask action buttons
 * based on the input field content.
 */
function toggleEditSubtaskActions() {
    const input = document.getElementById('editSubtaskInput');
    const actions = document.getElementById('editSubtaskActions');
    if (!input || !actions) return;

    if (input.value.length > 0) {
        actions.classList.add('visible');
    } else {
        actions.classList.remove('visible');
    }
}

/**
 * Adds a new subtask to the current task in edit mode
 * and re-renders the subtask list.
 */
function addEditSubtask() {
    const input = document.getElementById('editSubtaskInput');
    const title = input ? input.value.trim() : '';
    if (!title) return;

    if (!currentTask.subtasks) currentTask.subtasks = [];
    currentTask.subtasks.push({ title: title, done: false });

    input.value = '';
    toggleEditSubtaskActions();
    renderEditSubtasks(currentTask.subtasks);
}

/**
 * Deletes a subtask from the current task in edit mode
 * by its index and re-renders the list.
 *
 * @param {number} index - The index of the subtask to remove.
 */
function deleteEditSubtask(index) {
    if (currentTask && currentTask.subtasks) {
        currentTask.subtasks.splice(index, 1);
        renderEditSubtasks(currentTask.subtasks);
    }
}

/**
 * Clears the edit subtask input field
 * and hides the action buttons.
 */
function clearSubtaskInput() {
    const input = document.getElementById('editSubtaskInput');
    if (input) {
        input.value = '';
        toggleEditSubtaskActions();
    }
}

/**
 * Loads an existing subtask into the input field for editing
 * and removes it temporarily from the list.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editExistingSubtask(index) {
    const input = document.getElementById('editSubtaskInput');
    if (!input || !currentTask.subtasks[index]) return;

    const subtask = currentTask.subtasks[index];
    input.value = subtask.title;
    input.focus();
    toggleEditSubtaskActions();
    deleteEditSubtask(index);
}

/**
 * Generates the HTML markup for the priority buttons
 * in the edit task view, marking the current priority as active.
 *
 * @param {string} currentPriority - The currently selected priority.
 * @returns {string} The generated HTML string for the priority buttons.
 */
function getPriorityButtonsHTML(currentPriority) {
    const priorityOptions = ['Urgent', 'Medium', 'Low'];

    return priorityOptions.map(prio => {
        const lowPrio = prio.toLowerCase();
        const isActive = currentPriority.toLowerCase() === lowPrio;
        const iconPath = isActive
            ? `../assets/img/addtask/${lowPrio}selected.svg`
            : `../assets/img/addtask/${lowPrio}.svg`;

        return `
            <button type="button" 
                    id="prio-${lowPrio}" 
                    class="priority__button ${isActive ? lowPrio + ' active' : ''}" 
                    onclick="setEditPriority('${lowPrio}')">
                ${prio} <img src="${iconPath}" id="prio-img-${lowPrio}">
            </button>
        `;
    }).join('');
}

/**
 * Adds an 'Enter' key listener to the edit subtask input
 * to trigger subtask creation and prevent form submission.
 */
function initEditSubtaskInput() {
    const subInput = document.getElementById('editSubtaskInput');
    if (subInput) {
        subInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addEditSubtask();
            }
        });
    }
}

/**
 * Toggles the visibility of the edit contact dropdown.
 * @param {Event} e - The click event.
 */
function toggleEditDropdown(e) {
    // Verhindert, dass der Klick den globalen Listener erreicht, 
    // der das Dropdown sofort wieder schließen würde.
    e.stopPropagation();

    const list = document.getElementById('editDropdownList');
    const arrow = document.getElementById('editDropdownArrow');

    if (!list) return;

    const isVisible = list.style.display === 'block';
    list.style.display = isVisible ? 'none' : 'block';

    if (arrow) {
        arrow.classList.toggle('rotated', !isVisible);
    }
}

/**
 * Closes the edit contact dropdown if a click occurs outside its container.
 * This ensures the dropdown is dismissed when interacting with other parts 
 * of the task detail view or the document.
 * * @param {MouseEvent} e - The click event used to determine the target of the interaction.
 */
function closeEditDropdownExternal(e) {
    const container = document.getElementById('editDropdownContainer');
    const list = document.getElementById('editDropdownList');
    const arrow = document.getElementById('editDropdownArrow');
    if (!container || !list || list.style.display === 'none') return;
    if (!container.contains(e.target)) {
        list.style.display = 'none';
        if (arrow) arrow.classList.remove('rotated');
    }
}

document.removeEventListener('click', closeEditDropdownExternal);
document.addEventListener('click', closeEditDropdownExternal);