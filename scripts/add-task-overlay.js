/**
 * Opens the "Add Task" overlay panel on desktop screens, or navigates to the add-task page on mobile.
 * If the overlay exists, it also renders the task form into the panel.
 */
function openAddTaskOverlay() {
  if (window.innerWidth <= 768) {
    window.location.href = "../html/add-task.html";
    return;
  }
  const overlay = document.querySelector('.addtask-overlay');
  const panel = document.querySelector('.addtask-panel');
  if (overlay && panel) {
    overlay.classList.add('is-open');
    panel.classList.add('is-open');
    renderAddTask('addtask-panel-content-id');
  }
}

/**
 * Closes the "Add Task" overlay panel and resets all form fields.
 * Removes the `is-open` class from both overlay and panel elements.
 */
function closeAddTaskOverlay() {
  const overlay = document.querySelector('.addtask-overlay');
  const panel = document.querySelector('.addtask-panel');

  if (overlay && panel) {
    overlay.classList.remove('is-open');
    panel.classList.remove('is-open');
    if (typeof clearFields === 'function') {
      clearFields();
    }
  }
}

/**
 * Waits for the DOM to fully load and initializes event listeners
 * for closing the "Add Task" overlay:
 * 
 * - Click on the close button closes the overlay.
 * - Click on the overlay background closes the overlay if clicked outside the panel.
 */
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.addtask-panel__close');
  const overlay = document.querySelector('.addtask-overlay');

  closeBtn?.addEventListener('click', closeAddTaskOverlay);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeAddTaskOverlay();
    }
  });
});