/**
 * Holds the current task being created.
 * Populated step by step with user input.
 * @type {Array}
 */
let task = []

/**
 * Reference to the task due date input.
 * @type {HTMLInputElement}
 */
const dateInput = document.getElementById('task-due-date');

/**
 * Sets the minimum selectable date to today.
 */
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

/**
 * Formats the selected date as dd/mm/yyyy
 * and stores it in a data attribute on the input.
 */
dateInput.addEventListener('change', () => {
    const date = new Date(dateInput.value);
    if (!isNaN(date)) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        dateInput.setAttribute('data-date', `${day}/${month}/${year}`);
    }
});

/**
 * Programmatically opens the native date picker.
 */
function openDatePicker() {
    dateInput.showPicker();
}

/**
 * Sets the task priority and updates the UI (buttons + icons).
 *
 * @param {HTMLButtonElement} button - The clicked priority button
 */
function selectPriority(priority) {
    task.priority = priority.value 
    document.querySelectorAll('.priority').forEach(el => el.classList.remove('selected'))
    priority.classList.add('selected')
}

/**
 * Deselects all priority buttons and resets their icons.
 */
function selectPriority(button) {
    const buttons = document.querySelectorAll('.priority__button');
    buttons.forEach(btn => {
        btn.classList.remove('urgent', 'medium', 'low', 'active');
        const img = btn.querySelector('img');
        const base = btn.value;
        img.src = `../assets/img/addtask/${base}.svg`;
    });
    const priority = button.value;
    button.classList.add(priority, 'active');
    const img = button.querySelector('img');
    img.src = `../assets/img/addtask/${priority}selected.svg`;
}

/**
 * Reads all input fields and prepares the task data.
 */
function saveTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const assignedTo = document.getElementById('task-assigned-to').value;
    const category = document.getElementById('task-category').value;
    const subtasks = document.getElementById('added-subtask').textContent.trim().split('\n').filter(subtask => subtask.trim() !== '');
}

/**
 * Clears all input fields and resets the task form to default state.
 */
function clearFields() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-due-date').value = '';
    document.getElementById('dropdown-selected').textContent = 'Select contacts to assign';
    document.getElementById('selected-contacts').innerHTML = '';
    document.getElementById('task-category').value = '';
    document.getElementById('task-subtasks').value = '';
    document.getElementById('added-subtask').innerHTML = '';
    deselectPriority();
    selectPriority(document.querySelector('.priority__button[value="medium"]'));
}

/**
 * Adds a new subtask to the list and clears the input field.
 */
function deselectPriority() {
     document.querySelectorAll('.priority__button').forEach(btn => {
            btn.classList.remove('urgent', 'medium', 'low', 'active');
            const img = btn.querySelector('img');
            const base = btn.value;
            img.src = `../assets/img/addtask/${base}.svg`;
        });
} 

/**
 * Adds a subtask when pressing Enter in the input field.
 */
function addSubtask() {
    const subtaskInput = document.getElementById('task-subtasks');
    const subtaskText = subtaskInput.value.trim();        
        document.getElementById('added-subtask').innerHTML += templateAddSubtask(subtaskText, task.length);
        subtaskInput.value = '';
}

/**
 * Adds a subtask when pressing Enter in the input field.
 */
document.getElementById('task-subtasks').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSubtask();
    }
});

/**
 * Shows or hides the subtask action icons based on input content.
 */
function toggleSubtaskActions() {
    const input = document.getElementById('task-subtasks');
    const actions = document.querySelector('.subtask-actions');
    if (input.value.trim() !== '') {
        actions.classList.add('visible');
    } else {
        actions.classList.remove('visible');
    }
}

/**
 * Cancels adding a subtask and clears the input field.
 */
function cancelSubtask() {
    const input = document.getElementById('task-subtasks');
    input.value = '';
    toggleSubtaskActions();
}

/**
 * Starts edit mode for a subtask.
 *
 * @param {HTMLElement} trigger - The clicked element (text or edit icon)
 */
function editSubtask(trigger) {
    const item = getSubtaskItem(trigger);
    if (isEditing(item)) return;
    const textSpan = item.querySelector('.subtask-text');
    startEdit(item, textSpan);
}

/**
 * Returns the subtask container element of a trigger.
 *
 * @param {HTMLElement} trigger
 * @returns {HTMLElement}
 */
function getSubtaskItem(trigger) {
    return trigger.closest('.subtask-item');
}

/**
 * Checks whether a subtask is currently being edited.
 *
 * @param {HTMLElement} item
 * @returns {boolean}
 */
function isEditing(item) {
    return !!item.querySelector('.subtask-edit-input');
}

/**
 * Initializes edit mode for a subtask.
 *
 * @param {HTMLElement} item
 * @param {HTMLElement} textSpan
 */
function startEdit(item, textSpan) {
    const input = createEditInput(textSpan.textContent);
    item.replaceChild(input, textSpan);
    input.focus();

    attachEditListeners(item, textSpan, input);
}

/**
 * Creates an input element for editing a subtask.
 *
 * @param {string} text
 * @returns {HTMLInputElement}
 */
function createEditInput(text) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    input.className = 'subtask-edit-input';
    return input;
}

/**
 * Attaches event listeners for saving or canceling subtask edits.
 *
 * @param {HTMLElement} item
 * @param {HTMLElement} textSpan
 * @param {HTMLInputElement} input
 */
function attachEditListeners(item, textSpan, input) {
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') saveEdit(item, input);
        if (e.key === 'Escape') cancelEdit(item, textSpan, input);
    });

    input.addEventListener('blur', () => saveEdit(item, input));
}

/**
 * Saves the changes made to a subtask.
 *
 * @param {HTMLElement} item
 * @param {HTMLInputElement} input
 */
function saveEdit(item, input) {
    const newText = input.value.trim();
    if (!newText) return;

    const span = document.createElement('span');
    span.className = 'subtask-text';
    span.textContent = newText;

    item.replaceChild(span, input);
}

/**
 * Cancels editing a subtask and restores original text.
 */
function cancelEdit(item, textSpan, input) {
    item.replaceChild(textSpan, input);
}

/**
 * Deletes a subtask from the DOM.
 *
 * @param {HTMLElement} trigger - The clicked delete icon
 */
function deleteSubtask(trigger) {
    const item = trigger.closest('.subtask-item');
    item.remove();
}

const dropdown = document.querySelector('.dropdown');
const dropdownSelected = dropdown.querySelector('.dropdown-selected');
const dropdownList = dropdown.querySelector('.dropdown-list');
const selectedContactsBox = document.querySelector('.selected-contacts');

const selectedContacts = new Map();

function loadContactsFromSession() {
  const rawData = sessionStorage.getItem('joinData');
  if (!rawData) return [];

  const data = JSON.parse(rawData);
  const contacts = data.contacts || {};

  return Object.entries(contacts).map(([id, contact]) => ({
    id,
    name: contact.name
  }));
}

function renderSelectedContacts() {
  selectedContactsBox.innerHTML = '';

  selectedContacts.forEach(contact => {
    const tag = document.createElement('span');
    tag.textContent = contact.name;
    selectedContactsBox.appendChild(tag);
  });

  dropdownSelected.textContent =
    selectedContacts.size > 0
      ? `${selectedContacts.size} contact(s) selected`
      : 'Select contacts to assign';
}

function initDropdown() {
  const contacts = loadContactsFromSession();
  dropdownList.innerHTML = '';

  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.innerHTML = templateContact(contact.name.charAt(0).toUpperCase(), contact);

    li.addEventListener('click', e => {
      e.stopPropagation();

      if (selectedContacts.has(contact.id)) {
        selectedContacts.delete(contact.id);
        li.classList.remove('selected');
      } else {
        selectedContacts.set(contact.id, contact);
        li.classList.add('selected');
      }

      renderSelectedContacts();
    });

    dropdownList.appendChild(li);
  });
}

dropdownSelected.addEventListener('click', e => {
    e.stopPropagation();
    dropdownList.style.display =
    dropdownList.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', e => {
  if (!dropdown.contains(e.target)) {
    dropdownList.style.display = 'none';
  }
});

function createTask() {
  const joinDataRaw = sessionStorage.getItem('joinData');
  if (!joinDataRaw) {
    console.error('joinData not found in sessionStorage');
    return;
  }

  const joinData = JSON.parse(joinDataRaw);
  joinData.tasks ??= {};

  // 🔹 Neue Task-ID erzeugen
  const taskCount = Object.keys(joinData.tasks).length + 1;
  const taskId = `task${taskCount}`;

  // 🔹 Werte auslesen
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-description').value.trim();
  const dueDateInput = document.getElementById('task-due-date').value;
  const categorySelect = document.getElementById('task-category');
  const taskType = categorySelect.options[categorySelect.selectedIndex].text.toLowerCase();

  // 🔹 Datum formatieren (YYYY-MM-DD → MM-DD-YYYY)
  const [year, month, day] = dueDateInput.split('-');
  const dueDate = `${month}-${day}-${year}`;

  // 🔹 Priority
  const activePriorityBtn = document.querySelector('.priority__button.active');
  const priority = activePriorityBtn ? activePriorityBtn.value : 'medium';

  // 🔹 Assigned Contacts (IDs!)
  const assignedTo = Array.from(selectedContacts.keys());

  // 🔹 Subtasks
  const subtasks = [];
  document.querySelectorAll('#added-subtask .subtask').forEach(subtask => {
    subtasks.push({
      title: subtask.textContent.trim(),
      done: false
    });
  });

  // 🔹 Task Objekt
  const newTask = {
    title,
    description,
    dueDate,
    priority,
    taskType,
    category: 'to do',
    assignedTo
  };

  if (subtasks.length > 0) {
    newTask.subtasks = subtasks;
  }

  // 🔹 Speichern
  joinData.tasks[taskId] = newTask;
  sessionStorage.setItem('joinData', JSON.stringify(joinData));

  console.log(`Task ${taskId} saved`, newTask);
}

function getNextTaskId(tasks) {
  const ids = Object.keys(tasks)
    .map(id => parseInt(id.replace('task', ''), 10))
    .filter(Number.isFinite);

  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  return `task${nextId}`;
}
