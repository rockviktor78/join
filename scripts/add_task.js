/**
 * Holds the current task being created.
 * Populated step by step with user input.
 * @type {Array}
 */
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
  document.getElementById("dropdown-selected").textContent =
    "Select contacts to assign";
  document.getElementById("selected-contacts").innerHTML = "";
  document.getElementById("task-category").value = "";
  document.getElementById("task-subtasks").value = "";
  document.getElementById("added-subtask").innerHTML = "";
  deselectPriority();
  selectPriority(document.querySelector('.priority__button[value="medium"]'));
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
 * Returns the subtask container element of a trigger.
 *
 * @param {HTMLElement} trigger
 * @returns {HTMLElement}
 */
function getSubtaskItem(trigger) {
  return trigger.closest(".subtask-item");
}

/**
 * Checks whether a subtask is currently being edited.
 *
 * @param {HTMLElement} item
 * @returns {boolean}
 */
function isEditing(item) {
  return !!item.querySelector(".subtask-edit-input");
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
  const input = document.createElement("input");
  input.type = "text";
  input.value = text;
  input.className = "subtask-edit-input";
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
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit(item, input);
    if (e.key === "Escape") cancelEdit(item, textSpan, input);
  });

  input.addEventListener("blur", () => saveEdit(item, input));
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

  const span = document.createElement("span");
  span.className = "subtask-text";
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