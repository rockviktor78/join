const taskAddedModal = document.getElementById('taskAddedModal');
let task = [];

/**
 * DATUM & PRIORITÄT
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

function openDatePicker() {
  const dateInput = document.getElementById("task-due-date");
  if (dateInput) dateInput.showPicker();
}

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
 * FORMULAR RESET LOGIK
 */
function clearFields() {
  resetInputs();
  resetDropdownState();
  document.getElementById("added-subtask").innerHTML = "";
  deselectPriority();
  resetValidation();
  if (typeof resetSelectedContacts === 'function') resetSelectedContacts();
  const mediumBtn = document.querySelector('.priority__button[value="medium"]');
  if (mediumBtn) selectPriority(mediumBtn);
}

function resetInputs() {
  const ids = ["task-title", "task-description", "task-due-date", "task-category", "task-subtasks"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = "";
    if (id === "task-due-date") el.removeAttribute("data-date");
  });
}

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

function resetValidation() {
  document.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.error-border').forEach(el => el.classList.remove('error-border'));
}

/**
 * SUBTASK LOGIK
 */
function addSubtask() {
  const subtaskInput = document.getElementById("task-subtasks");
  const text = subtaskInput.value.trim();
  if (!text) return;

  const container = document.getElementById("added-subtask");
  container.innerHTML += templateAddSubtask(text, task.length);
  subtaskInput.value = "";
  toggleSubtaskActions();
}

function initSubtaskInput() {
  const subInput = document.getElementById("task-subtasks");
  subInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSubtask(); }
  });
}

function toggleSubtaskActions() {
  const input = document.getElementById("task-subtasks");
  const actions = document.querySelector(".subtask-actions");
  if (input && actions) {
    actions.classList.toggle("visible", input.value.trim() !== "");
  }
}

function cancelSubtask() {
  const input = document.getElementById("task-subtasks");
  if (input) input.value = "";
  toggleSubtaskActions();
}

/**
 * SUBTASK EDITIEREN & LÖSCHEN
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
 * UI EFFEKTE & SUCCESS
 */
function rotateCategoryArrow(isOpened) {
  const arrow = document.querySelector('.category-arrow');
  arrow?.classList.toggle('rotated', isOpened);
}

function handleAddTaskSuccess() {
  taskAddedModal?.classList.add('show');
  setTimeout(() => {
    taskAddedModal?.classList.remove('show');
    window.location.href = "../html/board.html";
  }, 2000);
}

/**
 * INITIALISIERUNG DER LISTENERS
 */
function initDropdownListeners() {
  const input = document.getElementById('contact-search-input');
  const arrow = document.getElementById('dropdown-arrow');
  input?.addEventListener('keyup', filterContacts);
  input?.addEventListener('click', (e) => { e.stopPropagation(); openDropdown(e); });
  arrow?.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(e); });
}

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

function initFormButtons() {
  document.getElementById('calendar-icon')?.addEventListener('click', openDatePicker);
  document.getElementById('clear__button')?.addEventListener('click', clearFields);
  document.getElementById('create-task__button')?.addEventListener('click', createTask);
}

document.addEventListener("DOMContentLoaded", () => {
  initDateInput();
  initSubtaskInput();
  if (typeof initDropdown === 'function') initDropdown();
  initDropdownListeners();
  initPriorityAndCategory();
  initSubtaskListeners();
  initFormButtons();
});