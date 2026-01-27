/**
 * Bindet externe HTML-Dateien in Elemente mit dem Attribut "w3-include-html" ein.
 *
 * Diese Funktion sucht alle Elemente im DOM, die das Attribut "w3-include-html" besitzen,
 * lädt die angegebene HTML-Datei per Fetch-API und fügt den Inhalt in das Element ein.
 * Nach dem erfolgreichen Laden wird das Attribut automatisch entfernt.
 *
 * @function includeHTML
 * @returns {void} Diese Funktion gibt keinen Wert zurück
 *
 * @example
 * // HTML-Verwendung:
 * <div w3-include-html="../assets/templates/header.html"></div>
 *
 * // JavaScript-Aufruf:
 * includeHTML();
 *
 * @description
 * Ablauf:
 * 1. Sucht alle Elemente mit dem Attribut [w3-include-html]
 * 2. Lädt für jedes Element die angegebene HTML-Datei
 * 3. Fügt den Inhalt in das Element ein
 * 4. Entfernt das Attribut nach erfolgreichem Laden
 * 5. Zeigt Fehlermeldungen bei Problemen
 *
 * @throws {Error} Gibt einen Fehler in der Konsole aus, wenn das Laden fehlschlägt
 */
function includeHTML() {
  // Alle Elemente mit dem Attribut "w3-include-html" auswählen
  const elements = document.querySelectorAll("[w3-include-html]");

  // Jedes Element durchlaufen und HTML-Inhalt laden
  elements.forEach(async (element) => {
    // Dateipfad aus dem Attribut auslesen
    const file = element.getAttribute("w3-include-html");

    if (file) {
      try {
        // HTML-Datei per Fetch-API laden
        const response = await fetch(file);

        if (response.ok) {
          // Erfolgreicher Abruf: HTML-Text extrahieren und einfügen
          const html = await response.text();
          element.innerHTML = html;
        } else {
          // Fehler beim Abruf: Fehlermeldung anzeigen
          element.innerHTML = "Page not found.";
        }
      } catch (error) {
        // Fehlerbehandlung bei Netzwerk- oder anderen Fehlern
        element.innerHTML = "Error loading page.";
        console.error("Error loading HTML:", error);
      }

      // Attribut entfernen, um doppeltes Laden zu verhindern
      element.removeAttribute("w3-include-html");
    }
  });
}


