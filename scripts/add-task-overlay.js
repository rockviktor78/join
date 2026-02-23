/**
 * Global map to track selected contacts in overlay.
 */
const selectedContacts = new Map();

/**
 * Toggles dropdown visibility (called from HTML onclick).
 */
function toggleDropdown(e) {
  if (e) e.stopPropagation();
  const arrow = e?.target;
  const dropdown = arrow?.closest(".dropdown");
  const list = dropdown?.querySelector(".dropdown-list, #dropdown-list");
  if (!list) return;

  const isVisible = list.style.display === "block";
  list.style.display = isVisible ? "none" : "block";
  if (arrow) arrow.classList.toggle("rotated", !isVisible);
}

/**
 * Loads add-task HTML content.
 * @returns {Promise<Document>} - Parsed HTML document
 */
async function loadAddTaskHTML() {
  const response = await fetch("../html/add-task.html");
  const html = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

/**
 * Inserts add-task content into panel.
 * @param {Document} doc - Parsed HTML document
 * @param {HTMLElement} content - Target content container
 */
function initializeFormHandlers(content) {
  if (typeof initDropdown === "function") initDropdown();
  ensureDropdownPopulated(content);
  bindDropdownListeners(content);
  if (typeof initDateInput === "function") initDateInput();
  if (typeof initSubtaskInput === "function") initSubtaskInput();
}

function insertAddTaskContent(doc, content) {
  const taskContent = doc.querySelector(".add-task-content");
  const buttonWrapper = doc.querySelector(".button-wrapper");
  if (!taskContent) return;
  content.innerHTML = "";
  content.appendChild(taskContent.cloneNode(true));
  if (buttonWrapper) content.appendChild(buttonWrapper.cloneNode(true));
  content.setAttribute("data-loaded", "true");
  const selectedBox = content.querySelector(".selected-contacts");
  if (selectedBox)
    selectedBox.classList.add("overlay-dropdown__selected-contacts");
  setTimeout(() => initializeFormHandlers(content), 100);
}

/**
 * Handles mobile navigation to add-task page.
 * @param {Event} event - Click event
 */
function handleMobileAddTask(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  window.location.assign("add-task.html");
}

/**
 * Loads content into overlay if needed.
 * @param {HTMLElement} content - Content container
 */
async function loadOverlayContent(content) {
  if (!content || content.hasAttribute("data-loaded")) return;
  try {
    const doc = await loadAddTaskHTML();
    insertAddTaskContent(doc, content);
  } catch (error) {
    console.error("Error loading add-task content:", error);
  }
}

/**
 * Shows overlay panel.
 */
function showOverlayPanel() {
  const panel = document.querySelector(".addtask-panel");
  const overlay = document.querySelector(".addtask-overlay");
  if (panel) panel.classList.add("is-open");
  if (overlay) overlay.classList.add("is-open");
}

/**
 * Opens overlay panel on desktop.
 */
async function openAddTaskOverlay() {
  const content = document.querySelector(".addtask-panel__content");
  await loadOverlayContent(content);
  showOverlayPanel();
}

/**
 * Opens Add Task on desktop or navigates on mobile.
 * @param {Event} event - Click event
 */
async function addTask(event) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
    handleMobileAddTask(event);
    return;
  }
  await openAddTaskOverlay();
}

/**
 * Closes the Add Task overlay panel.
 */
function closeAddTaskPanel() {
  const panel = document.querySelector(".addtask-panel");
  const overlay = document.querySelector(".addtask-overlay");

  if (panel) panel.classList.remove("is-open");
  if (overlay) overlay.classList.remove("is-open");
}

/**
 * Extracts first two initials from a contact name.
 * @param {string} name - The contact name
 * @returns {string} - Two-letter initials
 */
function getContactInitials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Creates a colored badge element for a selected contact.
 * @param {Object} contact - Contact object with name and color
 * @returns {HTMLElement} - Span element with contact initials
 */
function createContactBadge(contact) {
  const badge = document.createElement("span");
  badge.className = "overlay-dropdown__badge";
  badge.textContent = getContactInitials(contact.name);
  badge.style.background = contact.color;
  return badge;
}

/**
 * Updates the selected contacts display box with badges.
 * @param {HTMLElement} selectedBox - Container for selected contact badges
 */
function updateSelectedBox(selectedBox) {
  if (!selectedBox) return;
  selectedBox.innerHTML = "";
  selectedContacts.forEach((c) =>
    selectedBox.appendChild(createContactBadge(c)),
  );
}

/**
 * Toggles contact selection state with visual feedback.
 * @param {HTMLElement} li - List item element
 * @param {Object} contact - Contact object
 * @param {HTMLElement} selectedBox - Selected contacts display container
 */
function toggleContactSelection(li, contact, selectedBox) {
  const isSelected = li.classList.toggle("selected");
  li.style.background = isSelected ? "#2A3647" : "";
  li.querySelector(".overlay-dropdown__checkmark").style.backgroundImage =
    isSelected
      ? "url('../assets/img/addtask/check-checked-white.svg')"
      : "url('../assets/img/addtask/checkempty.svg')";
  li.querySelector(".overlay-dropdown__info span").style.color = isSelected
    ? "white"
    : "";
  isSelected
    ? selectedContacts.set(contact.id, contact)
    : selectedContacts.delete(contact.id);
  updateSelectedBox(selectedBox);
}

/**
 * Creates a contact list item element for dropdown.
 * @param {Object} contact - Contact object with id, name, color
 * @param {HTMLElement} selectedBox - Selected contacts display container
 * @returns {HTMLElement} - List item with contact details
 */
function createContactListItem(contact, selectedBox) {
  const li = document.createElement("li");
  li.className = "overlay-dropdown__item";
  li.innerHTML = `<div class="overlay-dropdown__container"><div class="overlay-dropdown__initial" style="background:${contact.color}">${getContactInitials(contact.name)}</div><div class="overlay-dropdown__info"><span>${contact.name}</span></div><div class="overlay-dropdown__checkmark"></div></div>`;
  li.onclick = (e) => {
    e.stopPropagation();
    toggleContactSelection(li, contact, selectedBox);
  };
  return li;
}

/**
 * Populates dropdown list with contacts from session storage.
 * @param {HTMLElement} content - Overlay content container
 */
function ensureDropdownPopulated(content) {
  const list = content?.querySelector("#dropdown-list");
  if (!list || list.children.length > 0) return;
  const data = JSON.parse(sessionStorage.getItem("joinData") || "{}");
  const contacts = Object.entries(data.contacts || {}).map(([id, c]) => ({
    id,
    name: c.name,
    color: c.color || "#D1D1D1",
  }));
  const selectedBox = content?.querySelector(
    ".overlay-dropdown__selected-contacts",
  );
  contacts.forEach((contact) =>
    list.appendChild(createContactListItem(contact, selectedBox)),
  );
}

/**
 * Binds click listeners to dropdown elements in overlay.
 */
function bindDropdownListeners(content) {
  const input = content?.querySelector(".contact-search-input");
  const arrow = content?.querySelector(".dropdown-arrow");
  const list = content?.querySelector(".dropdown-list");

  if (input)
    input.onclick = (e) => {
      e.stopPropagation();
      list.style.display = "block";
    };
  if (arrow)
    arrow.onclick = (e) => {
      e.stopPropagation();
      list.style.display = list.style.display === "block" ? "none" : "block";
    };
  document.addEventListener("click", () => {
    if (list) list.style.display = "none";
  });
}

/**
 * Required form fields configuration for task creation.
 * (Shared with add_task.js via shared/utilities.js)
 */

/**
 * Required form fields configuration for task creation.
 * (Shared with add_task.js via shared/utilities.js)
 */

/**
 * Validates all required form fields.
 * Uses shared validation from utilities.js
 * @returns {boolean} - Whether all fields are valid
 */

/**
 * Converts date format from YYYY-MM-DD to MM-DD-YYYY.
 */
function getFormattedDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${month}-${day}-${year}`;
}

/**
 * Gets the currently selected task priority.
 */
function getPriority() {
  const activeBtn = document.querySelector(".priority__button.active");
  return activeBtn ? activeBtn.value : "medium";
}

/**
 * Collects all entered subtasks from the UI.
 */
function getSubtasks() {
  const subtasks = [];
  document.querySelectorAll("#added-subtask .subtask").forEach((st) => {
    subtasks.push({ title: st.textContent.trim(), done: false });
  });
  return subtasks;
}

/**
 * Assembles a complete task object from form inputs.
 * @returns {Object} - Task object with all properties
 */
function assembleTask() {
  const cat = document.getElementById("task-category");
  const task = {
    title: document.getElementById("task-title").value.trim(),
    description: document.getElementById("task-description").value.trim(),
    dueDate: getFormattedDate(document.getElementById("task-due-date").value),
    priority: getPriority(),
    taskType: cat.options[cat.selectedIndex].text.toLowerCase(),
    category: "to do",
    assignedTo: Array.from(selectedContacts.keys()),
  };
  const subs = getSubtasks();
  if (subs.length) task.subtasks = subs;
  return task;
}

/**
 * Saves a new task into the session storage.
 */
function saveToStorage(newTask) {
  const raw = sessionStorage.getItem("joinData");
  if (!raw) return console.error("joinData not found");
  const joinData = JSON.parse(raw);
  joinData.tasks ??= {};
  const taskId = `task${Object.keys(joinData.tasks).length + 1}`;
  joinData.tasks[taskId] = newTask;
  sessionStorage.setItem("joinData", JSON.stringify(joinData));
  console.log(`Task ${taskId} saved`, newTask);
}

/**
 * Creates and saves a new task from form data.
 */
function createTask() {
  if (!validateAllFields()) return;
  saveToStorage(assembleTask());
}

// Setup close handlers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".addtask-panel__close");
  const overlay = document.querySelector(".addtask-overlay");

  if (closeBtn) closeBtn.addEventListener("click", closeAddTaskPanel);
  if (overlay) overlay.addEventListener("click", closeAddTaskPanel);
});
