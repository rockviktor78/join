let task = [];

/**
 * Initializes the due date input field by setting the minimum selectable date
 * to today and formatting the selected date for display.
 */
function initDateInput() {
  const dateInput = document.getElementById("task-due-date");
  if (!dateInput) return;
  dateInput.min = new Date().toISOString().split("T")[0];

  dateInput.addEventListener("change", () => {
    if (dateInput.value) {
      const [y, m, d] = dateInput.value.split("-");
      dateInput.setAttribute("data-date", `${d}/${m}/${y}`);
    }
  });
}

/**
 * Opens the native date picker of the due date input field, if available.
 */
function openDatePicker() {
  const dateInput = document.getElementById("task-due-date");
  if (dateInput) dateInput.showPicker();
}

/**
 * Selects a priority button, applies the active state,
 * and updates its icon accordingly.
 *
 * @param {HTMLButtonElement} button - The clicked priority button element.
 */
function selectPriority(button) {
  deselectPriority();
  const priority = button.value;
  button.classList.add(priority, "active");
  button.querySelector("img").src = `../assets/img/addtask/${priority}selected.svg`;
}

function deselectPriority() {
  document.querySelectorAll(".priority__button").forEach((btn) => {
    btn.classList.remove("urgent", "medium", "low", "active");
    btn.querySelector("img").src = `../assets/img/addtask/${btn.value}.svg`;
  });
}

/**
 * Resets the task form to its initial state by clearing inputs,
 * dropdowns, subtasks, validation states, selected contacts,
 * and restoring the default priority.
 */
function clearFields() {
  resetInputs();
  resetDropdownState();
  const subtaskContainer = document.getElementById("added-subtask");
  if (subtaskContainer) subtaskContainer.innerHTML = "";
  deselectPriority();
  resetValidation();
  if (typeof resetSelectedContacts === 'function') resetSelectedContacts();
  const mediumBtn = document.querySelector('.priority__button[value="medium"]');
  if (mediumBtn) selectPriority(mediumBtn);
}

/**
 * Clears all task input fields and removes the custom date attribute
 * from the due date input.
 */
function resetInputs() {
  const ids = ["task-title", "task-description", "task-due-date", "task-category", "task-subtasks"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = "";
    if (id === "task-due-date") el.removeAttribute("data-date");
  });
}

/**
 * Resets the contact dropdown state by clearing the search input,
 * removing selected contact elements, and resetting the selected contacts set.
 */
function resetDropdownState() {
  const searchInput = document.getElementById("contact-search-input");
  const selectedBox = document.getElementById("selected-contacts");
  if (searchInput) {
    searchInput.value = "";
    searchInput.placeholder = "Select contacts to assign";
  }
  if (selectedBox) selectedBox.innerHTML = "";
  if (typeof selectedContacts !== 'undefined') selectedContacts.clear();
}

/**
 * Clears all validation error messages and removes error styling from form elements.
 */
function resetValidation() {
  document.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.error-border').forEach(el => el.classList.remove('error-border'));
}

/**
 * Adds a new subtask to the subtask list if the input is not empty,
 * then clears the input field and updates the subtask action state.
 */
function addSubtask() {
  const subtaskInput = document.getElementById("task-subtasks");
  const text = subtaskInput.value.trim();
  if (!text) return;

  const container = document.getElementById("added-subtask");
  container.innerHTML += templateAddSubtask(text);
  subtaskInput.value = "";
  toggleSubtaskActions();
}

/**
 * Initializes the subtask input field by adding a keypress listener
 * that creates a new subtask when the Enter key is pressed.
 */
function initSubtaskInput() {
  const subInput = document.getElementById("task-subtasks");
  subInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSubtask(); }
  });
}

/**
 * Toggles the visibility of subtask action buttons
 * based on whether the subtask input field contains text.
 */
function toggleSubtaskActions() {
  const input = document.getElementById("task-subtasks");
  const actions = document.querySelector(".subtask-actions");
  if (input && actions) {
    actions.classList.toggle("visible", input.value.trim() !== "");
  }
}

/**
 * Cancels the current subtask input by clearing the input field
 * and updating the subtask action buttons.
 */
function cancelSubtask() {
  const input = document.getElementById("task-subtasks");
  if (input) input.value = "";
  toggleSubtaskActions();
}

/**
 * Enables editing of a subtask by replacing its text with an input field,
 * focusing it, and attaching listeners to save changes on Enter or blur.
 *
 * @param {HTMLElement} trigger - The element that triggered the edit action.
 */
function editSubtask(trigger) {
  const item = trigger.closest(".subtask-item");
  const textSpan = item?.querySelector(".subtask-text");
  if (!item || item.querySelector(".subtask-edit-input")) return;

  const input = document.createElement("input");
  input.type = "text";
  input.value = textSpan.textContent;
  input.className = "subtask-edit-input";

  item.replaceChild(input, textSpan);
  input.focus();
  input.addEventListener("keydown", (e) => e.key === "Enter" && saveEdit(item, input));
  input.addEventListener("blur", () => saveEdit(item, input));
}

/**
 * Saves the edited subtask text. If the input is empty, the subtask is removed;
 * otherwise, replaces the input field with the updated text element.
 *
 * @param {HTMLElement} item - The subtask container element.
 * @param {HTMLInputElement} input - The input element containing the edited text.
 */
function saveEdit(item, input) {
  const newText = input.value.trim();
  if (!newText) return item.remove();
  const span = document.createElement("span");
  span.className = "subtask-text";
  span.textContent = newText;
  item.replaceChild(span, input);
}

function deleteSubtask(trigger) {
  trigger.closest(".subtask-item")?.remove();
}

/**
 * Rotates the category arrow icon based on the open/closed state.
 *
 * @param {boolean} isOpened - True if the category is opened, false if closed.
 */
function rotateCategoryArrow(isOpened) {
  const arrow = document.querySelector('.category-arrow');
  arrow?.classList.toggle('rotated', isOpened);
}

/**
 * Displays a success message and handles navigation or overlay closing.
 */
function handleAddTaskSuccess() {
  const modal = document.getElementById('taskAddedModal');
  const isOverlay = document.getElementById('addtask-panel-content-id') !== null;
  modal?.classList.add('show');

  setTimeout(() => {
    modal?.classList.remove('show');

    if (isOverlay) {
      if (typeof closeAddTaskOverlay === 'function') {
        closeAddTaskOverlay();
      }
      if (typeof initBoard === 'function') {
        initBoard();
      }
    } else {
      window.location.href = "board.html";
    }
  }, 1500);
}


/**
 * Initializes event listeners for the contact dropdown.
 * 
 * - Registers `keyup` on the search input to filter contacts live.
 * - Registers `click` on the search input to open the dropdown without propagating the click.
 * - Registers `click` on the dropdown arrow to toggle the dropdown without propagating the click.
 */
function initDropdownListeners() {
  const input = document.getElementById('contact-search-input');
  const arrow = document.getElementById('dropdown-arrow');
  input?.addEventListener('keyup', filterContacts);
  input?.addEventListener('click', (e) => { e.stopPropagation(); openDropdown(e); });
  arrow?.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(e); });
}

/**
 * Initializes event listeners for priority buttons and the task category dropdown.
 *
 * - Click on a priority button selects the corresponding priority.
 * - Focus on the category dropdown rotates the arrow to indicate open state.
 * - Blur or change on the category dropdown rotates the arrow back to closed state.
 */
function initPriorityAndCategory() {
  document.getElementById('priority-selection')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.priority__button');
    if (btn) selectPriority(btn);
  });
  const cat = document.getElementById('task-category');
  cat?.addEventListener('focus', () => rotateCategoryArrow(true));
  cat?.addEventListener('blur', () => rotateCategoryArrow(false));
  cat?.addEventListener('change', () => rotateCategoryArrow(false));
}

/**
 * Initializes event listeners for subtask input and actions.
 *
 * - `input` event on #task-subtasks toggles subtask action buttons visibility.
 * - `click` on #subtask-cancel cancels the current subtask input.
 * - `click` on #subtask-confirm adds a new subtask.
 * - `click` on #added-subtask handles editing or deleting subtasks:
 *   - Click on `.edit-btn` triggers subtask editing.
 *   - Click on `.delete-btn` deletes the subtask.
 */
function initSubtaskListeners() {
  document.getElementById('task-subtasks')?.addEventListener('input', toggleSubtaskActions);
  document.getElementById('subtask-cancel')?.addEventListener('click', cancelSubtask);
  document.getElementById('subtask-confirm')?.addEventListener('click', addSubtask);
  document.getElementById('added-subtask')?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    if (editBtn) editSubtask(editBtn);
    if (deleteBtn) deleteSubtask(deleteBtn);
  });
}

/**
 * Initializes event listeners for form action buttons.
 *
 * - `click` on #calendar-icon opens the native date picker.
 * - `click` on #clear__button clears all form fields.
 * - `click` on #create-task__button triggers task creation.
 */
function initFormButtons() {
  document.getElementById('calendar-icon')?.addEventListener('click', openDatePicker);
  document.getElementById('clear__button')?.addEventListener('click', clearFields);
  document.getElementById('create-task__button')?.addEventListener('click', createTask);
}

/**
 * Initializes all interactive scripts and event listeners for the task form:
 * 
 * - Date input
 * - Subtask input
 * - Dropdown (if available)
 * - Dropdown event listeners
 * - Priority and category interactions
 * - Subtask event listeners
 * - Form action buttons
 */
function initializeAllScripts() {
  initDateInput();
  initSubtaskInput();
  if (typeof initDropdown === 'function') initDropdown();
  initDropdownListeners();
  initPriorityAndCategory();
  initSubtaskListeners();
  initFormButtons();
}

/**
 * Renders the task form into a specified container and initializes all related scripts.
 *
 * @param {string} containerId - The ID of the container element (e.g., main content or add-task panel).
 */
function renderAddTask(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container mit ID ${containerId} wurde nicht gefunden!`);
    return;
  }
  container.innerHTML = templateAddTaskForm();
  initializeAllScripts();
}

/**
 * Waits for the DOM to fully load and then renders the task form
 * into the main content container if it exists.
 */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById('main-content')) {
    renderAddTask('main-content');
  }
});