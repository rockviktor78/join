/**
 * A Map storing selected contact objects, indexed by their unique ID.
 * @type {Map<string, Object>}
 */
const selectedContacts = new Map();

/**
 * The DOM element where selected contact initials are rendered as tags.
 * @type {HTMLElement}
 */
const selectedContactsBox = document.querySelector('.selected-contacts');

/**
 * Initializes the contact dropdown by loading contacts from session storage
 * and rendering them into the list.
 */
function initDropdown() {
  const contacts = loadContactsFromSession();
  const list = document.getElementById('dropdown-list');
  if (!list) return;
  list.innerHTML = '';
  contacts.forEach(contact => {
    list.appendChild(createContactItem(contact));
  });
}

/**
 * Fetches contact data from the session storage.
 * @returns {Array<{id: string, name: string, color: string}>} An array of contact objects.
 */
function loadContactsFromSession() {
  const rawData = sessionStorage.getItem('joinData');
  if (!rawData) return [];
  const data = JSON.parse(rawData);
  const contacts = data.contacts || {};
  return Object.entries(contacts).map(([id, contact]) => ({
    id, name: contact.name, color: contact.color
  }));
}

/**
 * Creates an HTML list item (LI) for a single contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLLIElement} The constructed list item element.
 */
function createContactItem(contact) {
  const li = document.createElement('li');
  const initial = getInitial(contact.name);
  const color = contact.color || "#D1D1D1";
  li.innerHTML = templateContact(initial, contact.name, color);
  li.addEventListener('click', e => handleContactClick(e, li, contact));
  return li;
}

/**
 * Filters the contact dropdown list based on the search input value.
 */
function filterContacts() {
  const searchInput = document.getElementById('contact-search-input');
  const list = document.getElementById('dropdown-list');
  const filter = searchInput.value.toLowerCase();
  list.style.display = 'block';
  const listItems = list.querySelectorAll('li');
  listItems.forEach(li => {
    const nameSpan = li.querySelector('.contact-info span');
    if (nameSpan) {
      const contactName = nameSpan.textContent.toLowerCase();
      li.style.display = contactName.includes(filter) ? "" : "none";
    }
  });
}

/**
 * Opens the dropdown and ensures the arrow is rotated upwards.
 * @param {Event} e - The click event.
 */
function openDropdown(e) {
    if (e) e.stopPropagation();
    const list = document.getElementById('dropdown-list');
    const arrow = document.querySelector('.dropdown-arrow');
    list.style.display = 'block';
    if (arrow) arrow.classList.add('rotated');
}

/**
 * Toggles the dropdown visibility and rotates the arrow icon.
 * @param {Event} e - The click event.
 */
function toggleDropdown(e) {
    if (e) e.stopPropagation();
    const list = document.getElementById('dropdown-list');
    const arrow = document.querySelector('.dropdown-arrow'); // Suche über Klasse
    const isVisible = list.style.display === 'block';
    if (isVisible) {
        list.style.display = 'none';
        if (arrow) arrow.classList.remove('rotated');
    } else {
        list.style.display = 'block';
        if (arrow) arrow.classList.add('rotated');
    }
}

/**
 * Closes the dropdown and resets the arrow rotation.
 * @param {Event} e - The click event.
 */
function closeDropdownExternal(e) {
    const container = document.getElementById('dropdown-container');
    const list = document.getElementById('dropdown-list');
    const arrow = document.querySelector('.dropdown-arrow');
    if (container && !container.contains(e.target)) {
        list.style.display = 'none';
        if (arrow) arrow.classList.remove('rotated');
    }
}

/**
 * Handles selection and deselection of a contact when clicked.
 * @param {Event} e - The click event.
 * @param {HTMLElement} li - The list item element of the contact.
 * @param {Object} contact - The clicked contact data.
 */
function handleContactClick(e, li, contact) {
  e.stopPropagation();
  const isSelected = selectedContacts.has(contact.id);
  if (isSelected) {
    selectedContacts.delete(contact.id);
    li.classList.remove('selected');
  } else {
    selectedContacts.set(contact.id, contact);
    li.classList.add('selected');
  }
  renderSelectedContacts();
}

/**
 * Renders the initials of all selected contacts into the display box 
 * and updates the search input placeholder.
 */
function renderSelectedContacts() {
  selectedContactsBox.innerHTML = '';
  selectedContacts.forEach(contact => {
    const tag = document.createElement('span');
    tag.textContent = getInitial(contact.name);
    tag.style.backgroundColor = contact.color || "#D1D1D1";
    tag.className = 'assign-to-initial';
    selectedContactsBox.appendChild(tag);
  });
}

  const searchInput = document.getElementById('contact-search-input');
  if (searchInput) {
    searchInput.placeholder =
      selectedContacts.size > 0
        ? `${selectedContacts.size} contact(s) selected`
        : 'Select contacts to assign';
  }

/**
 * Extracts the initials from a full name (first letter of first and last name).
 * @param {string} name - The full name.
 * @returns {string} The uppercase initials.
 */
function getInitial(name) {
  if (!name) return "";
  let parts = name.trim().split(/\s+/);
  let first = parts[0].charAt(0);
  let last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

/**
 * Main initialization on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
  initDropdown();  
  const searchInput = document.getElementById('contact-search-input');
  if (searchInput) {
    searchInput.addEventListener('click', openDropdown);
  }
});

/**
 * Global click listener to close the dropdown when clicking outside.
 */
document.addEventListener('click', closeDropdownExternal);

/**
 * Creates and returns a list item (LI) element for a contact.
 * This function generates the HTML structure using a template, sets the background color 
 * for the initials, and attaches a click event listener to handle contact selection.
 *
 * @param {Object} contact - The contact object containing details.
 * @param {string} contact.name - The full name of the contact.
 * @param {string} [contact.color] - The hex color code for the contact's icon (defaults to #D1D1D1).
 * @param {string} contact.id - The unique identifier for the contact.
 * @returns {HTMLLIElement} The fully constructed list item element ready to be appended to the dropdown.
 */
function createContactItem(contact) {
  const li = document.createElement('li');
  const initial = getInitial(contact.name);
  const color = contact.color || "#D1D1D1";
  li.innerHTML = templateContact(initial, contact.name, color);
  li.addEventListener('click', e => handleContactClick(e, li, contact));
  return li;
}

/**
 * Reformats a date string from YYYY-MM-DD to MM-DD-YYYY.
 * @param {string} dateString - The date string from the input.
 * @returns {string} The formatted date string.
 */
function getFormattedDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${month}-${day}-${year}`;
}

/**
 * Determines the currently selected task priority.
 * @returns {string} The value of the active priority button, defaults to 'medium'.
 */
function getPriority() {
  const activeBtn = document.querySelector('.priority__button.active');
  return activeBtn ? activeBtn.value : 'medium';
}

/**
 * Collects all entered subtasks from the UI.
 * @returns {Array<{title: string, done: boolean}>} List of subtask objects.
 */
function getSubtasks() {
  const subtasks = [];
  document.querySelectorAll('#added-subtask .subtask').forEach(st => {
    subtasks.push({ title: st.textContent.trim(), done: false });
  });
  return subtasks;
}

/**
 * Assembles all form data into a single task object.
 * @returns {Object} The complete task object.
 */
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

/**
 * Saves a new task into the session storage under the 'joinData' key.
 * @param {Object} newTask - The task object to be saved.
 */
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

/**
 * Orchestrates the task creation process: validation, assembly, and storage.
 */
function createTask() {
  if (!taskFormManager.validateAll()) return;
  const newTask = assembleTask();
  saveToStorage(newTask);
}

/**
 * Calculates the next available task ID based on existing tasks.
 * @param {Object} tasks - The current tasks object from storage.
 * @returns {string} The new task ID (e.g., "task5").
 */
function getNextTaskId(tasks) {
  const ids = Object.keys(tasks)
    .map(id => parseInt(id.replace('task', ''), 10))
    .filter(Number.isFinite);
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  return `task${nextId}`;
}

/**
 * Object responsible for form field validation and error message handling.
 */
const taskFormManager = {
  fields: [
    { id: 'task-title', err: 'title-error-message' },
    { id: 'task-due-date', err: 'date-error-message' },
    { id: 'task-category', err: 'category-error-message' }
  ],

  /**
   * Validates all required fields and toggles error styling/messages.
   * @returns {boolean} True if all fields are valid, false otherwise.
   */
  validateAll() {
    let isAllValid = true;
    this.fields.forEach(f => {
      const input = document.getElementById(f.id);
      const errorSpan = document.getElementById(f.err);
      const isValid = input && input.value.trim() !== "" && input.value !== "undefined";
      if (!isValid) {errorSpan.style.display = 'block'; errorSpan.textContent = 'This field is required'; input.classList.add('error-border');
        isAllValid = false;
      } else {errorSpan.style.display = 'none'; input.classList.remove('error-border');}});
    return isAllValid;
  }
};  