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
function insertAddTaskContent(doc, content) {
  const taskContent = doc.querySelector(".add-task-content");
  const buttonWrapper = doc.querySelector(".button-wrapper");
  if (!taskContent) return;
  content.innerHTML = "";
  content.appendChild(taskContent.cloneNode(true));
  if (buttonWrapper) content.appendChild(buttonWrapper.cloneNode(true));
  content.setAttribute("data-loaded", "true");
  setTimeout(() => {
    if (typeof initDropdown === "function") initDropdown();
    if (typeof initDateInput === "function") initDateInput();
    if (typeof initSubtaskInput === "function") initSubtaskInput();
  }, 0);
}

/**
 * Opens Add Task overlay panel on desktop or navigates to page on mobile.
 * @param {Event} event - Click event
 */
async function addTask(event) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.location.assign("add-task.html");
    return;
  }
  const panel = document.querySelector(".addtask-panel");
  const overlay = document.querySelector(".addtask-overlay");
  const content = document.querySelector(".addtask-panel__content");
  if (content && !content.hasAttribute("data-loaded")) {
    try {
      const doc = await loadAddTaskHTML();
      insertAddTaskContent(doc, content);
    } catch (error) {
      console.error("Error loading add-task content:", error);
    }
  }
  if (panel) panel.classList.add("is-open");
  if (overlay) overlay.classList.add("is-open");
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

// Setup close handlers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".addtask-panel__close");
  const overlay = document.querySelector(".addtask-overlay");

  if (closeBtn) closeBtn.addEventListener("click", closeAddTaskPanel);
  if (overlay) overlay.addEventListener("click", closeAddTaskPanel);
});
