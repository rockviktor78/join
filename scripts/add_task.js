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

function getFormattedDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${month}-${day}-${year}`;
}

function getPriority() {
  const activeBtn = document.querySelector('.priority__button.active');
  return activeBtn ? activeBtn.value : 'medium';
}

function getSubtasks() {
  const subtasks = [];
  document.querySelectorAll('#added-subtask .subtask').forEach(st => {
    subtasks.push({ title: st.textContent.trim(), done: false });
  });
  return subtasks;
}

function assembleTask() {
  const categorySelect = document.getElementById('task-category');
  const task = {
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-description').value.trim(),
    dueDate: getFormattedDate(document.getElementById('task-due-date').value),
    priority: getPriority(),
    taskType: categorySelect.options[categorySelect.selectedIndex].text.toLowerCase(),
    category: 'to do',
    assignedTo: Array.from(selectedContacts.keys())
  };
  const subs = getSubtasks();
  if (subs.length > 0) task.subtasks = subs;
  return task;
}

function saveToStorage(newTask) {
  const raw = sessionStorage.getItem('joinData');
  if (!raw) return console.error('joinData not found');

  const joinData = JSON.parse(raw);
  joinData.tasks ??= {};
  
  const taskId = `task${Object.keys(joinData.tasks).length + 1}`;
  joinData.tasks[taskId] = newTask;
  
  sessionStorage.setItem('joinData', JSON.stringify(joinData));
  console.log(`Task ${taskId} saved`, newTask);
}

function createTask() {
  if (!taskFormManager.validateAll()) return;
  const newTask = assembleTask();
  saveToStorage(newTask);
}

function getNextTaskId(tasks) {
  const ids = Object.keys(tasks)
    .map(id => parseInt(id.replace('task', ''), 10))
    .filter(Number.isFinite);
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  return `task${nextId}`;
}

const taskFormManager = {
  fields: [
    { id: 'task-title', err: 'title-error-message' },
    { id: 'task-due-date', err: 'date-error-message' },
    { id: 'task-category', err: 'category-error-message' }
  ],

  showError(input, error, isValid) {
    error.textContent = isValid ? "" : "This field is required";
    error.style.display = isValid ? "none" : "block";
    input.style.borderColor = isValid ? "" : "red";
    return isValid;
  },

  validateSingle(field) {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.err);
    const isValid = input && input.value.trim() !== "";
    return this.showError(input, error, isValid);
  },

  validateAll() {
    const results = this.fields.map(f => this.validateSingle(f));
    return results.every(res => res === true);
  }
};