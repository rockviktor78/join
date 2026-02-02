/**
 * Menu Navigation Handler
 * Verwaltet aktive Zustände und Navigation
 */

/**
 * Setzt den aktiven Menu-Button basierend auf der aktuellen Seite
 */
function setActiveMenuBtnOnLoad() {
  const currentPage = window.location.pathname.split("/").pop();
  const pageToButtonMap = {
    "summary.html": "navSummary",
    "add_task.html": "navAddTask",
    "board.html": "navBoard",
    "contacts.html": "navContacts",
  };

  const buttonId = pageToButtonMap[currentPage];
  if (buttonId) {
    setActiveMenuBtn(buttonId);
  }
}

/**
 * Setzt den aktiven Menu-Button
 * @param {string} buttonId - Die ID des aktiven Buttons (z.B. 'navSummary', 'navAddTask', etc.)
 */
function setActiveMenuBtn(buttonId) {
  const menuButtonIds = ["navSummary", "navAddTask", "navBoard", "navContacts"];

  // Entferne active-menu-btn von allen Buttons
  menuButtonIds.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.remove("active-menu-btn");
    }
  });

  // Setze active-menu-btn auf den gewählten Button
  const activeButton = document.getElementById(buttonId);
  if (activeButton) {
    activeButton.classList.add("active-menu-btn");
  }
}

// Navigation Handler für Menu Buttons
function setupMenuNavigation() {
  const menuButtons = {
    navSummary: "../html/summary.html",
    navAddTask: "../html/add_task.html",
    navBoard: "../html/board.html",
    navContacts: "../html/contacts.html",
  };

  Object.entries(menuButtons).forEach(([id, url]) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        // Setze den aktiven Button
        setActiveMenuBtn(id);

        // Navigiere zur Seite
        window.location.href = url;
      });
    }
  });
}

// Initialisierung - warte bis Template geladen ist
document.addEventListener("DOMContentLoaded", () => {
  // Warte kurz, damit das Template geladen werden kann
  setTimeout(() => {
    setActiveMenuBtnOnLoad();
    setupMenuNavigation();
  }, 100);
});
