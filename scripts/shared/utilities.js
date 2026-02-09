/**
 * Shared Utility Functions
 * Common helper functions used across multiple modules
 */

/**
 * Extracts initials from a full name
 * @param {string} name - The full name (e.g., "Max Mustermann")
 * @param {string} fallback - Fallback value if name is empty (default: "MS")
 * @returns {string} The initials (e.g., "MM")
 *
 * @example
 * getInitials("Max Mustermann") // Returns "MM"
 * getInitials("John") // Returns "JO" (first 2 chars)
 * getInitials("") // Returns "MS" (fallback)
 * getInitials("", "AB") // Returns "AB" (custom fallback)
 */
function getInitials(name, fallback = "SM") {
  if (!name || !name.trim()) return fallback;

  const parts = name.trim().split(/\s+/);

  // Single name: take first 2 characters
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Multiple names: take first char of first and last name
  const firstNameInitial = parts[0][0]; // Vorname (z.B. "S" von "Sonja")
  const lastNameInitial = parts[parts.length - 1][0]; // Nachname (z.B. "M" von "Müller")
  return (firstNameInitial + lastNameInitial).toUpperCase(); // "SM"
}

/**
 * Initializes the application when window loads
 * Calls init() function if it exists
 */
window.addEventListener("load", () => {
  if (typeof init === "function") {
    init();
  }
});

/**
 * Handles mouse down event for drag-to-scroll
 */
function handleScrollMouseDown(state, scrollArea, e) {
  state.isDown = true;
  state.startY = e.pageY - scrollArea.offsetTop;
  state.scrollTop = scrollArea.scrollTop;
}

/**
 * Handles mouse move event for drag-to-scroll
 */
function handleScrollMouseMove(state, scrollArea, e) {
  if (!state.isDown) return;
  e.preventDefault();
  const y = e.pageY - scrollArea.offsetTop;
  const walk = (y - state.startY) * 2;
  scrollArea.scrollTop = state.scrollTop - walk;
}

/**
 * Enables drag-to-scroll functionality for content areas
 * Allows users to scroll by clicking and dragging
 */
function initDragToScroll() {
  const scrollArea = document.querySelector(".content-area");
  if (!scrollArea) return;

  const state = { isDown: false, startY: 0, scrollTop: 0 };
  scrollArea.addEventListener("mousedown", (e) =>
    handleScrollMouseDown(state, scrollArea, e),
  );
  scrollArea.addEventListener("mouseleave", () => (state.isDown = false));
  scrollArea.addEventListener("mouseup", () => (state.isDown = false));
  scrollArea.addEventListener("mousemove", (e) =>
    handleScrollMouseMove(state, scrollArea, e),
  );
}

// Initialize drag-to-scroll when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDragToScroll);
} else {
  initDragToScroll();
}
