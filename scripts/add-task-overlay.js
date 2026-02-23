
/**
 * Öffnet das Add-Task Overlay ODER leitet auf Mobile zur add_task.html weiter
 */
function openAddTaskOverlay() {
  // 1. Prüfen, ob wir auf Mobile sind (entspricht deinem CSS Media Query)
  if (window.innerWidth <= 768) {
    window.location.href = "../html/add-task.html";
    return; // Funktion hier abbrechen
  }

  // 2. Overlay-Logik für Desktop
  const overlay = document.querySelector('.addtask-overlay');
  const panel = document.querySelector('.addtask-panel');

  if (overlay && panel) {
    overlay.classList.add('is-open');
    panel.classList.add('is-open');

    // Rendern der Inhalte
    renderAddTask('addtask-panel-content-id');
  }
}

/**
 * Schließt das Overlay
 */
function closeAddTaskOverlay() {
  const overlay = document.querySelector('.addtask-overlay');
  const panel = document.querySelector('.addtask-panel');

  // Auch hier 'is-open' entfernen
  overlay?.classList.remove('is-open');
  panel?.classList.remove('is-open');
}

// Event-Listener für Schließen-Button und Hintergrund
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.addtask-panel__close');
  const overlay = document.querySelector('.addtask-overlay');

  closeBtn?.addEventListener('click', closeAddTaskOverlay);
  overlay?.addEventListener('click', (e) => {
    // Nur schließen, wenn direkt auf das Overlay (den Hintergrund) geklickt wurde
    if (e.target === overlay) {
      closeAddTaskOverlay();
    }
  });
});