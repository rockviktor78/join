const selectedContacts = new Map();

/**
 * Initializes the contact dropdown by loading contacts from session storage,
 * rendering each contact as a list item, and updating the search input placeholder.
 */
function initDropdown() {
  const contacts = loadContactsFromSession();
  const list = document.getElementById('dropdown-list');
  if (!list) return;
  list.innerHTML = '';
  contacts.forEach(contact => list.appendChild(createContactItem(contact)));
  updateSearchPlaceholder();
}

/**
 * Loads contacts from session storage, converts them to an array,
 * and applies badge colors if the `assignContactColors` function exists.
 *
 * @returns {Array<Object>} Array of contact objects with ID and color applied.
 */
function loadContactsFromSession() {
  const rawData = sessionStorage.getItem('joinData');
  const data = rawData ? JSON.parse(rawData) : { contacts: {} };
  const contactsArray = Object.entries(data.contacts).map(([id, c]) => ({ id, ...c }));
  return typeof assignContactColors === 'function' ? assignContactColors(contactsArray) : contactsArray;
}

/**
 * Creates a dropdown list item element for a contact, sets its badge color and initials,
 * and attaches a click listener to handle selection.
 *
 * @param {Object} contact - The contact object containing at least `name` and optional `color`.
 * @returns {HTMLLIElement} The generated list item element for the contact.
 */
function createContactItem(contact) {
  const li = document.createElement('li');
  const initial = getInitial(contact.name);
  const color = contact.color || "#D1D1D1";
  li.innerHTML = templateContact(initial, contact.name, color);
  li.addEventListener('click', (e) => handleContactClick(e, li, contact));
  return li;
}

/**
 * Toggles the visibility of the contact dropdown list and rotates the arrow icon.
 *
 * @param {Event} [e] - The event that triggered the toggle (optional). Stops propagation if provided.
 */
function toggleDropdown(e) {
  if (e) e.stopPropagation();
  const list = document.getElementById('dropdown-list');
  const arrow = document.getElementById('dropdown-arrow');
  const isVisible = list?.style.display === 'block';
  if (list) list.style.display = isVisible ? 'none' : 'block';
  if (arrow) arrow.classList.toggle('rotated', !isVisible);
}

/**
 * Opens the contact dropdown list and rotates the arrow icon to indicate the open state.
 *
 * @param {Event} [e] - The event that triggered the dropdown (optional). Stops propagation if provided.
 */
function openDropdown(e) {
  if (e) e.stopPropagation();
  document.getElementById('dropdown-list').style.display = 'block';
  document.getElementById('dropdown-arrow')?.classList.add('rotated');
}

/**
 * Closes the contact dropdown if a click occurs outside of the dropdown container
 * and resets the arrow icon to its default state.
 *
 * @param {MouseEvent} e - The click event used to determine if it occurred outside the dropdown.
 */
function closeDropdownExternal(e) {
  const container = document.getElementById('dropdown-container');
  if (container && !container.contains(e.target)) {
    document.getElementById('dropdown-list').style.display = 'none';
    document.getElementById('dropdown-arrow')?.classList.remove('rotated');
  }
}

/**
 * Handles selecting or deselecting a contact from the dropdown.
 * Updates the selected contacts map and toggles the visual state of the list item.
 *
 * @param {MouseEvent} e - The click event triggered on the contact item.
 * @param {HTMLLIElement} li - The list item element representing the contact.
 * @param {Object} contact - The contact object being clicked.
 */
function handleContactClick(e, li, contact) {
  e.stopPropagation();
  const isSelected = selectedContacts.has(contact.id);
  isSelected ? selectedContacts.delete(contact.id) : selectedContacts.set(contact.id, contact);
  li.classList.toggle('selected', !isSelected);
  renderSelectedContacts();
}

/**
 * Renders visual badges for all currently selected contacts in the UI
 * and updates the search input placeholder accordingly.
 */
function renderSelectedContacts() {
  const box = document.getElementById('selected-contacts');
  if (!box) return;
  box.innerHTML = '';
  selectedContacts.forEach(contact => {
    const tag = document.createElement('span');
    tag.textContent = getInitial(contact.name);
    tag.style.backgroundColor = contact.color || "#D1D1D1";
    tag.className = 'assign-to-initial';
    box.appendChild(tag);
  });
  updateSearchPlaceholder();
}

/**
 * Filters the contact dropdown list based on the search input value
 * and ensures the dropdown list is visible.
 */
function filterContacts() {
  const filter = document.getElementById('contact-search-input')?.value.toLowerCase();
  const listItems = document.querySelectorAll('#dropdown-list li');
  listItems.forEach(li => {
    const name = li.querySelector('.contact-info span')?.textContent.toLowerCase();
    li.style.display = name?.includes(filter) ? "" : "none";
  });
  document.getElementById('dropdown-list').style.display = 'block';
}

/**
 * Updates the placeholder text of the contact search input
 * based on the number of currently selected contacts.
 */
function updateSearchPlaceholder() {
  const input = document.getElementById('contact-search-input');
  if (!input) return;
  input.placeholder = selectedContacts.size > 0
    ? `${selectedContacts.size} contact(s) selected`
    : 'Select contacts to assign';
}

/**
 * Clears all selected contacts, updates the dropdown UI, and removes selection states from list items.
 */
function resetSelectedContacts() {
  selectedContacts.clear();
  renderSelectedContacts();
  document.querySelectorAll("#dropdown-list li").forEach(li => li.classList.remove("selected"));
}

/**
 * Generates initials from a full name.
 * Uses the first character of the first and last word in the name.
 *
 * @param {string} name - The full name of the contact.
 * @returns {string} The uppercase initials (e.g., "JS" for "John Smith").
 */
function getInitial(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}


/**
 * Creates a new task by validating the form, saving it to storage,
 * clearing the form fields, and showing the success modal.
 */
function createTask() {
  if (!taskFormManager.validateAll()) return;
  saveToStorage(assembleTask());
  clearFields();
  handleAddTaskSuccess();
}

/**
 * Collects all task form input values and assembles them into a task object.
 *
 * @returns {Object} The task object containing title, description, due date, priority,
 *                   category, task type, assigned contacts, and subtasks.
 */
function assembleTask() {
  const cat = document.getElementById('task-category');
  return {
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-description').value.trim(),
    dueDate: document.getElementById('task-due-date').value,
    priority: document.querySelector('.priority__button.active')?.value || 'medium',
    taskType: cat.options[cat.selectedIndex].text.toLowerCase(),
    category: 'to do',
    assignedTo: Array.from(selectedContacts.keys()),
    subtasks: getSubtasks()
  };
}

/**
 * Retrieves all subtasks from the form and returns them as an array of objects.
 *
 * @returns {Array<Object>} An array of subtask objects with `title` and `done` properties.
 */
function getSubtasks() {
  return Array.from(document.querySelectorAll('#added-subtask .subtask-text'))
    .map(st => ({ title: st.textContent.trim(), done: false }));
}

/**
 * Manages validation for the task form.
 *
 * @property {Array<Object>} fields - List of form fields with their IDs and corresponding error message element IDs.
 * @property {Function} validateAll - Validates all fields, shows error messages for empty fields,
 *                                    applies/removes error styling, and returns whether the form is valid.
 *
 * @example
 * if (taskFormManager.validateAll()) {
 *   // proceed with task creation
 * }
 */
const taskFormManager = {
  fields: [
    { id: 'task-title', err: 'title-error-message' },
    { id: 'task-due-date', err: 'date-error-message' },
    { id: 'task-category', err: 'category-error-message' }
  ],
  validateAll() {
    let isAllValid = true;
    this.fields.forEach(f => {
      const input = document.getElementById(f.id);
      const errorSpan = document.getElementById(f.err);
      const isValid = input && input.value.trim() !== "";
      if (!isValid) {
        if (errorSpan) { errorSpan.style.display = 'block'; errorSpan.textContent = 'This field is required'; }
        input.classList.add('error-border');
        isAllValid = false;
      } else {
        if (errorSpan) errorSpan.style.display = 'none';
        input.classList.remove('error-border');
      }
    });
    return isAllValid;
  }
};


/**
 * Saves a new task object to session storage under a unique key based on the current timestamp.
 *
 * @param {Object} newTask - The task object to save.
 */
function saveToStorage(newTask) {
  const raw = sessionStorage.getItem('joinData');
  const data = raw ? JSON.parse(raw) : { tasks: {} };
  data.tasks[`task${Date.now()}`] = newTask;
  sessionStorage.setItem('joinData', JSON.stringify(data));
}

document.addEventListener('click', closeDropdownExternal);