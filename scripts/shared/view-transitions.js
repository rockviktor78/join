/**
 * View Transitions API Support für MPA
 * Ermöglicht smooth page transitions zwischen verschiedenen Seiten
 */

// Body als geladen markieren (Fallback)
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

/**
 * Prüft ob View Transitions API unterstützt wird
 */
function supportsViewTransitions() {
  return "startViewTransition" in document;
}

/**
 * Aktiviert View Transitions für Links
 */
function setupViewTransitions() {
  if (!supportsViewTransitions()) {
    return;
  }

  // Alle internen Links abfangen
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");

    // Prüfen ob es ein interner Link ist
    if (
      !link ||
      link.target === "_blank" ||
      link.origin !== location.origin ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    // Verhindere Standard-Navigation
    e.preventDefault();

    // Starte View Transition
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = link.href;
      });
    } else {
      // Fallback ohne Transition
      window.location.href = link.href;
    }
  });

  // Auch für programmatische Navigation (z.B. onclick auf buttons)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        originalPushState.apply(history, args);
      });
    } else {
      originalPushState.apply(history, args);
    }
  };

  history.replaceState = function (...args) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        originalReplaceState.apply(history, args);
      });
    } else {
      originalReplaceState.apply(history, args);
    }
  };
}

// Initialisierung
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupViewTransitions);
} else {
  setupViewTransitions();
}
