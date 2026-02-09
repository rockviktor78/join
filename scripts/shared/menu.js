/**
 * Menu Navigation Handler
 * Manages active states and navigation
 */

/**
 * Sets the active menu button based on the current page
 */
function setActiveMenuBtnOnLoad() {
  const currentPage = window.location.pathname.split("/").pop();
  const pageToButtonMap = {
    "summary.html": "navSummary",
    "add-task.html": "navAddTask",
    "board.html": "navBoard",
    "contacts.html": "navContacts",
  };
  const buttonId = pageToButtonMap[currentPage];
  if (buttonId) {
    setActiveMenuBtn(buttonId);
  }
  setActiveFooterLink(currentPage);
}

/**
 * Sets the active menu button
 * @param {string} buttonId - The ID of the active button (e.g., 'navSummary', 'navAddTask', etc.)
 */
function setActiveMenuBtn(buttonId) {
  const menuButtonIds = ["navSummary", "navAddTask", "navBoard", "navContacts"];
  menuButtonIds.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.remove("active-menu-btn");
    }
  });
  const activeButton = document.getElementById(buttonId);
  if (activeButton) {
    activeButton.classList.add("active-menu-btn");
  }
}

/**
 * Sets the active footer link based on the current page
 * @param {string} currentPage - The current filename (e.g., 'privacy-policy.html')
 */
function setActiveFooterLink(currentPage) {
  const footerLinks = document.querySelectorAll(".menu__footer-link");
  footerLinks.forEach((link) => {
    link.classList.remove("active-menu-btn");
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPage) {
      link.classList.add("active-menu-btn");
    }
  });
}

/**
 * Initializes menu navigation - called from init-template.js
 */
function initMenuNavigation() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setActiveMenuBtnOnLoad();
      setupMenuNavigation();
    });
  } else {
    setActiveMenuBtnOnLoad();
    setupMenuNavigation();
  }
}

/**
 * Sets up navigation handlers for menu buttons
 */
function setupMenuNavigation() {
  const menuButtons = {
    navSummary: "../pages/summary.html",
    navAddTask: "../pages/add-task.html",
    navBoard: "../pages/board.html",
    navContacts: "../pages/contacts.html",
  };
  Object.entries(menuButtons).forEach(([id, url]) => {
    setupMenuButton(id, url);
  });
}

/**
 * Sets up a single menu button with click handler
 * @param {string} id - The button ID
 * @param {string} url - The navigation URL
 */
function setupMenuButton(id, url) {
  const button = document.getElementById(id);
  if (button) {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveMenuBtn(id);
      window.location.href = url;
    });
  }
}
