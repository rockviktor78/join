const taskAddedModal = document.getElementById('taskAddedModal');
let task = [];

/**
 * Initializes the date input with today's date as minimum.
 */
function initDateInput() {
  const dateInput = document.getElementById("task-due-date");
  if (!dateInput) return;
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  dateInput.addEventListener("change", () => {
    const date = new Date(dateInput.value);
    if (!isNaN(date)) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      dateInput.setAttribute("data-date", `${day}/${month}/${year}`);
    }
  });
}

/**
 * Programmatically opens the native date picker.
 */
function openDatePicker() {
  const dateInput = document.getElementById("task-due-date");
  if (dateInput) dateInput.showPicker();
}

/**
 * Deselects all priority buttons and resets their icons.
  * @param {HTMLButtonElement} button - The clicked priority button element.
 */
function selectPriority(button) {
  const buttons = document.querySelectorAll(".priority__button");
  buttons.forEach((btn) => {
    btn.classList.remove("urgent", "medium", "low", "active");
    const img = btn.querySelector("img");
    const base = btn.value;
    img.src = `../assets/img/addtask/${base}.svg`;
  });
  const priority = button.value;
  button.classList.add(priority, "active");
  const img = button.querySelector("img");
  img.src = `../assets/img/addtask/${priority}selected.svg`;
}

/**
 * Clears all input fields and resets the task form to default state.
 */
function clearFields() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-due-date").value = "";
  const searchInput = document.getElementById("contact-search-input");
  if (searchInput) {
    searchInput.value = "";
    searchInput.placeholder = "Select contacts to assign";
  }
  document.getElementById("selected-contacts").innerHTML = "";
  document.getElementById("task-category").value = "";
  document.getElementById("task-subtasks").value = "";
  document.getElementById("added-subtask").innerHTML = "";
  selectedContacts.clear();
  deselectPriority();
  if (typeof resetSelectedContacts === "function") {
    resetSelectedContacts();
  }
  selectPriority(document.querySelector('.priority__button[value="medium"]'));
}

/**
 * Resets selected contacts display. Fallback if dropdown.js function unavailable.
 */
function resetSelectedContacts() {
  const selectedBox = document.getElementById("selected-contacts");
  if (selectedBox) {
    selectedBox.innerHTML = "";
  }
}

/**
 * Adds a new subtask to the list and clears the input field.
 */
function deselectPriority() {
  document.querySelectorAll(".priority__button").forEach((btn) => {
    btn.classList.remove("urgent", "medium", "low", "active");
    const img = btn.querySelector("img");
    const base = btn.value;
    img.src = `../assets/img/addtask/${base}.svg`;
  });
}

/**
 * Adds a subtask when pressing Enter in the input field.
 */
function addSubtask() {
  const subtaskInput = document.getElementById("task-subtasks");
  const subtaskText = subtaskInput.value.trim();
  document.getElementById("added-subtask").innerHTML += templateAddSubtask(
    subtaskText,
    task.length,
  );
  subtaskInput.value = "";
}

/**
 * Initializes subtask input event listener.
 */
function initSubtaskInput() {
  const subtaskInput = document.getElementById("task-subtasks");
  if (!subtaskInput) return;
  subtaskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtask();
    }
  });
}

/**
 * Shows or hides the subtask action icons based on input content.
 */
function toggleSubtaskActions() {
  const input = document.getElementById("task-subtasks");
  const actions = document.querySelector(".subtask-actions");
  if (input.value.trim() !== "") {
    actions.classList.add("visible");
  } else {
    actions.classList.remove("visible");
  }
}

/**
 * Cancels adding a subtask and clears the input field.
 */
function cancelSubtask() {
  const input = document.getElementById("task-subtasks");
  input.value = "";
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
  const textSpan = item.querySelector(".subtask-text");
  startEdit(item, textSpan);
}

/**
 * Returns the closest subtask container element related to the given trigger element.
 *
 * @param {HTMLElement} trigger - The element that triggered the action.
 * @returns {HTMLElement|null} The closest parent element with the class "subtask-item", or null if not found.
 */
function getSubtaskItem(trigger) {
  return trigger.closest(".subtask-item");
}

/**
 * Checks whether the given subtask item is currently in edit mode.
 *
 * @param {HTMLElement} item - The subtask container element.
 * @returns {boolean} True if the subtask is being edited, otherwise false.
 */
function isEditing(item) {
  return !!item.querySelector(".subtask-edit-input");
}

/**
 * Activates edit mode for a subtask by replacing the text element
 * with an input field and attaching the necessary event listeners.
 *
 * @param {HTMLElement} item - The subtask container element.
 * @param {HTMLElement} textSpan - The element containing the subtask text.
 */
function startEdit(item, textSpan) {
  const input = createEditInput(textSpan.textContent);
  item.replaceChild(input, textSpan);
  input.focus();

  attachEditListeners(item, textSpan, input);
}

/**
 * Creates and returns an input element for editing a subtask.
 *
 * @param {string} text - The current subtask text.
 * @returns {HTMLInputElement} The generated input element.
 */
function createEditInput(text) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = text;
  input.className = "subtask-edit-input";
  return input;
}

/**
 * Attaches keyboard and blur event listeners to handle saving
 * or canceling subtask edits.
 *
 * @param {HTMLElement} item - The subtask container element.
 * @param {HTMLElement} textSpan - The original text element.
 * @param {HTMLInputElement} input - The input element used for editing.
 */
function attachEditListeners(item, textSpan, input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit(item, input);
    if (e.key === "Escape") cancelEdit(item, textSpan, input);
  });

  input.addEventListener("blur", () => saveEdit(item, input));
}

/**
 * Saves the edited subtask text and replaces the input field
 * with an updated text element.
 *
 * @param {HTMLElement} item - The subtask container element.
 * @param {HTMLInputElement} input - The input element containing the updated text.
 */
function saveEdit(item, input) {
  const newText = input.value.trim();
  if (!newText) return;

  const span = document.createElement("span");
  span.className = "subtask-text";
  span.textContent = newText;

  item.replaceChild(span, input);
}

/**
 * Cancels subtask editing and restores the original text element.
 *
 * @param {HTMLElement} item - The subtask container element.
 * @param {HTMLElement} textSpan - The original text element to restore.
 * @param {HTMLInputElement} input - The input element currently in edit mode.
 */
function cancelEdit(item, textSpan, input) {
  item.replaceChild(textSpan, input);
}

/**
 * Deletes a subtask element from the DOM based on the clicked trigger element.
 *
 * @param {HTMLElement} trigger - The element (e.g., delete icon) that triggered the deletion.
 */
function deleteSubtask(trigger) {
  const item = trigger.closest(".subtask-item");
  item.remove();
}

/**
 * Rotates the category dropdown arrow based on focus state.
 * @param {boolean} isOpened - Whether the dropdown is opened.
 */
function rotateCategoryArrow(isOpened) {
  const arrow = document.querySelector('.category-arrow');
  if (arrow) {
    if (isOpened) {
      arrow.classList.add('rotated');
    } else {
      arrow.classList.remove('rotated');
    }
  }
}

/**
 * Shows the "Task Added" modal and redirects to board after delay.
 */
function handleAddTaskSuccess() {
  if (!taskAddedModal) return;

  taskAddedModal.classList.add('show');

  setTimeout(() => {
    taskAddedModal.classList.remove('show');
    window.location.href = "../html/board.html";
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  initDateInput();
});