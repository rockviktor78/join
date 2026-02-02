/**
 * Menu Navigation Handler
 * Verwaltet aktive Zustände und Navigation
 */

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

        // Entferne active von allen Buttons
        document.querySelectorAll(".menu__btn").forEach((btn) => {
          btn.classList.remove("active");
        });

        // Setze active auf geklickten Button
        button.classList.add("active");

        // Navigiere zur Seite
        window.location.href = url;
      });
    }
  });
}

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
  setActiveMenuButton();
  setupMenuNavigation();
});
