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
  const mobileLinks = document.querySelectorAll(".menu__mobile__link");
  mobileLinks.forEach((link) => {
    link.classList.remove("menu__mobile__link--active");
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPage) {
      link.classList.add("menu__mobile__link--active");
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
    navSummary: "../html/summary.html",
    navAddTask: "../html/add-task.html",
    navBoard: "../html/board.html",
    navContacts: "../html/contacts.html",
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

/**
 * Sets the sidebar mode (internal vs external)
 * @param {string} mode - "external" or "internal"
 */
function setSidebarMode(mode) {
  const internalButtons = [
    "navSummary",
    "navAddTask",
    "navBoard",
    "navContacts",
  ];
  const loginButton = document.getElementById("navLogin");
  const menu = document.querySelector(".menu");
  const header = document.querySelector(".header__content");

  if (mode === "external") {
    // Add external class to menu and header
    if (menu) menu.classList.add("external");
    if (header) header.classList.add("external");
    // Hide internal navigation buttons
    internalButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.add("d-none");
    });
    // Show login button
    if (loginButton) loginButton.classList.remove("d-none");
  } else {
    // Remove external class from menu and header
    if (menu) menu.classList.remove("external");
    if (header) header.classList.remove("external");
    // Show internal navigation buttons
    internalButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.remove("d-none");
    });
    // Hide login button
    if (loginButton) loginButton.classList.add("d-none");
  }
}

/**
 * Detects if current page is an external page
 * @returns {boolean} True if external page (privacy-policy or legal-notice)
 */
function isExternalPage() {
  const path = window.location.pathname.toLowerCase();
  return (
    path.includes("privacy-policy.html") || path.includes("legal-notice.html")
  );
}

/**
 * Sets up the login button navigation handler
 */
function setupLoginButton() {
  const loginButton = document.getElementById("navLogin");
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../index.html";
    });
  }
}

/**
 * Sets up the header back button in external mode
 * Always navigates to login page
 */
function setupHeaderBackButton() {
  const backButton = document.querySelector(".header__content .back-btn");
  if (backButton) {
    backButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../index.html";
    });
  }
}
