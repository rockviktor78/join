# Team Join - Projekt Checkliste

**Projektabgabe:** TBD
**Team:** 3 Kollegen
**Aufgabenverteilung:**

- 👤 **Kollege 1**: Login, Register, Auth & User Management
- 📋 **Kollege 2**: Kanbanboard, Tasks & Drag & Drop
- 👥 **Kollege 3**: Kontakte, Summary & Dashboard

---

## 📌 Setup & Infrastruktur (Alle gemeinsam)

### GitHub & Versionskontrolle

- [ ] Repository auf "public" setzen ✅ (bereits erledigt)
- [ ] `.gitignore` Datei erstellen/prüfen (node_modules, config files, etc.)
- [ ] Alle Teammitglieder haben Zugriff
- [ ] Branch-Strategie festlegen (main, dev, feature-branches)
- [ ] Regelmäßige Commits von jedem (min. 1 pro Arbeitssitzung)
- [ ] Aussagekräftige Commit-Messages verwenden
- [ ] Nach Abschluss: Jedes Mitglied forkt das Projekt

**Verantwortlich:** Alle

### Projekt-Struktur & Grundlagen

- [ ] Dateistruktur überprüfen und ggf. optimieren
- [ ] `index.html` als Startseite vorhanden
- [ ] Firebase Config korrekt eingerichtet
- [ ] Gemeinsame Code-Conventions festlegen
- [ ] JSDoc Standard für alle Funktionen

**Verantwortlich:** Alle (Kickoff-Meeting)

---

## 👤 Bereich 1: Benutzeraccount & Administration (Kollege 1)

### Registrierung

- [ ] **US:** Registrierungsformular erstellen
  - [ ] Felder: Name, E-Mail, Passwort
  - [ ] E-Mail-Validierung implementieren
  - [ ] Passwort-Validierung (Mindestlänge, etc.)
  - [ ] Checkbox für Datenschutzerklärung (Pflicht)
  - [ ] Button deaktiviert, bis alle Pflichtfelder gefüllt
  - [ ] Fehlermeldungen bei falscher Eingabe
  - [ ] User in Firebase speichern
  - [ ] Nach erfolgreicher Registrierung: Weiterleitung zum Login

### Login

- [ ] **US:** Login-Formular erstellen
  - [ ] Felder: E-Mail, Passwort
  - [ ] Fehlermeldung bei falschen Credentials
  - [ ] "Guest Login"-Option implementieren
  - [ ] Nach Login: Weiterleitung zu Summary
  - [ ] Session/Token-Management (LocalStorage/SessionStorage)

### Auth-Schutz

- [ ] **US:** Route-Guards implementieren
  - [ ] Nicht-angemeldete User zu Login umleiten
  - [ ] Geschützte Seiten: Summary, Add-Task, Board, Contacts
  - [ ] Auth-Check bei jedem Seitenaufruf

### Logout

- [ ] **US:** Logout-Funktion implementieren
  - [ ] Logout-Button in Header/Menu
  - [ ] Session/Token löschen
  - [ ] Weiterleitung zu Login
  - [ ] Persönliche Daten nicht mehr zugänglich

### Header & User-Info

- [ ] User-Initialen im Header anzeigen
- [ ] User-Dropdown-Menü (Profil, Logout)
- [ ] Eigenen Account in Contacts bearbeitbar machen

**Verantwortlich:** 👤 Kollege 1

**Files:**

- `js/login.js`, `js/register.js`, `js/header.js`
- `services/auth.service.js`, `services/user.service.js`
- `css/login.css`, `css/register.css`
- `index.html`, `pages/` (Login-relevante Seiten)

---

## 📋 Bereich 2: Kanbanboard & Taskmanagement (Kollege 2)

### Board-Übersicht

- [ ] **US 1:** Kanban-Board Layout erstellen
  - [ ] 4 Spalten: ToDo, In Progress, Awaiting Feedback, Done
  - [ ] "No tasks"-Hinweis bei leeren Spalten
  - [ ] Tasks anzeigen mit: Kategorie, Titel, Beschreibung (Preview), Assigned Users (Initialen), Priorität
  - [ ] "+"-Icon in jeder Spalte zum Hinzufügen
  - [ ] Tasks aus Firebase laden

- [ ] **US 2:** Subtask-Fortschritt visualisieren
  - [ ] Fortschrittsbalken bei Tasks mit Subtasks
  - [ ] "X von Y Subtasks erledigt" anzeigen
  - [ ] 100% Fortschritt visuell hervorheben
  - [ ] Hover/Klick: detaillierte Übersicht

### Task-Suche

- [ ] **US 3:** Suchfunktion implementieren
  - [ ] Suchfeld auf Board
  - [ ] Echtzeit-Filterung nach Titel/Beschreibung
  - [ ] "Keine Ergebnisse gefunden"-Meldung
  - [ ] Bei leerem Suchfeld: alle Tasks anzeigen

### Task erstellen (Add Task)

- [ ] **US 4:** Add Task Formular
  - [ ] Titel\* (Pflichtfeld)
  - [ ] Beschreibung (optional)
  - [ ] Due Date\* (Pflichtfeld, Datepicker)
  - [ ] Priorität (urgent, medium, low) - Default: medium
  - [ ] Assigned to (Dropdown mit Kontakten)
  - [ ] Kategorie\* (Technical Task, User Story)
  - [ ] Formvalidierung: Button nur aktiv wenn alle Pflichtfelder gefüllt
  - [ ] Task in Firebase speichern
  - [ ] Mehrere Wege: Menü, "+" in Spalte, Icon neben Suchleiste
  - [ ] Bei "+" in Spalte: Status automatisch setzen

- [ ] **US 5:** Subtasks hinzufügen
  - [ ] Subtask-Eingabefeld
  - [ ] Enter-Taste oder Häkchen: Subtask hinzufügen
  - [ ] X-Icon: Eingabe zurücksetzen
  - [ ] Hover: Bearbeiten (Stift) & Löschen (Mülleimer)
  - [ ] Subtask bearbeiten/löschen funktional

### Task bearbeiten & löschen

- [ ] **US 6:** Task-Detailansicht
  - [ ] Klick auf Task: Detailansicht öffnen (Overlay/Modal)
  - [ ] Alle Task-Infos anzeigen
  - [ ] Stift-Icon: Bearbeitungsmodus
  - [ ] Im Edit-Modus: alle Felder änderbar (außer Kategorie!)
  - [ ] Änderungen speichern/verwerfen
  - [ ] Papierkorb-Icon: Task löschen
  - [ ] Löschen-Bestätigung (optional aber empfohlen)

### Drag & Drop

- [ ] **US 7:** Drag & Drop Desktop
  - [ ] Tasks zwischen Spalten verschiebbar
  - [ ] Visuelle Rückmeldung beim Dragging (z.B. Rotation)
  - [ ] Gestrichelte Box beim Hover über Spalte
  - [ ] Status-Update beim Drop
  - [ ] Flüssige Animation

- [ ] **US 7:** Mobile Touch
  - [ ] Spalten vertikal angeordnet
  - [ ] Long Tap oder Pfeil-Icon für Verschieben
  - [ ] Popup-Menü zur Spaltenauswahl (mobile)

### Qualitätssicherung Board

- [ ] Tickets verschwinden nicht beim Drag & Drop
- [ ] Spalten nicht zu lang (max-height mit Scroll)
- [ ] User-Feedback beim Speichern/Ändern (Toast)
- [ ] Content läuft nicht aus (overflow)

**Verantwortlich:** 📋 Kollege 2

**Files:**

- `js/board/*.js`, `js/add-task/*.js`
- `css/board.css`, `css/addTask.css`
- `pages/board.html`, `pages/addTask.html`

---

## 👥 Bereich 3: Kontaktverwaltung (Kollege 3)

### Kontaktliste

- [ ] **US 1:** Kontakte anzeigen
  - [ ] Alphabetische Sortierung nach Namen
  - [ ] Gruppierung nach Anfangsbuchstaben
  - [ ] Name + E-Mail anzeigen
  - [ ] Initialen-Avatar generieren
  - [ ] Klick: Detailansicht öffnen

- [ ] **US 2:** Kontakt-Details
  - [ ] Detailansicht mit: Name, E-Mail, Telefon
  - [ ] Initialen-Avatar
  - [ ] Bearbeiten & Löschen Optionen

### Kontakt hinzufügen

- [ ] **US 3:** Add Contact Formular
  - [ ] Name\* (Pflichtfeld)
  - [ ] E-Mail\* (Pflichtfeld, Validierung)
  - [ ] Telefon (optional, aber Validierung wenn gefüllt)
  - [ ] Formvalidierung
  - [ ] Button deaktiviert bis Pflichtfelder gefüllt
  - [ ] In Firebase speichern
  - [ ] Zur Liste hinzufügen
  - [ ] User-Feedback (Toast)

### Kontakt bearbeiten/löschen

- [ ] **US 4:** Edit Contact
  - [ ] Bearbeiten-Icon in Detailansicht
  - [ ] Formular mit vorausgefüllten Daten
  - [ ] Änderungen speichern
  - [ ] Validierung
  - [ ] User-Feedback

- [ ] **US 4:** Delete Contact
  - [ ] Löschen-Icon
  - [ ] Bestätigung (empfohlen)
  - [ ] Aus allen zugewiesenen Tasks entfernen!
  - [ ] Aus Firebase löschen

### Eigener Account

- [ ] **US 5:** Eigener Account bearbeitbar
  - [ ] Eigener Account in Contacts sichtbar
  - [ ] Markierung als "You" oder ähnlich
  - [ ] Bearbeitung wie normale Kontakte

**Verantwortlich:** 👥 Kollege 3

**Files:**

- `js/contact/*.js`
- `css/contact/*.css`
- `pages/contacts.html`

---

## 📊 Bereich 4: Summary / Dashboard (Kollege 3)

### Dashboard-Übersicht

- [ ] **US 4 (Auth):** Summary-Seite erstellen
  - [ ] Anzahl Tasks: ToDo, In Progress, Awaiting Feedback, Done
  - [ ] Anzahl Tasks mit nächster Deadline
  - [ ] Task mit nächster Deadline hervorheben (Datum + Titel)
  - [ ] Tageszeit-abhängige Begrüßung ("Good morning/afternoon/evening, [Name]")
  - [ ] Responsive Design
  - [ ] Daten aus Firebase laden

**Verantwortlich:** 👥 Kollege 3

**Files:**

- `js/summary.js`
- `css/summary.css`
- `pages/summary.html`

---

## 🎨 Bereich 5: UI/UX & Design (Alle, Schwerpunkt je nach Bereich)

### Design-Konsistenz

- [ ] Alle UI-Elemente entsprechen Figma-Prototypen
  - [ ] Farben korrekt
  - [ ] Abstände (padding, margin)
  - [ ] Schatten (box-shadow)
  - [ ] Schriftarten & -größen

### Interaktionen

- [ ] Hover-Effekte auf allen interaktiven Elementen
- [ ] Transitions: 75-125ms
- [ ] `cursor: pointer` auf allen Buttons
- [ ] `border: unset` auf Inputs & Buttons (kein Standard-Border)
- [ ] Toast-Messages für User-Feedback
- [ ] Loading-States (Button disabled während Ladezeit)

### Dropdown-Menüs

- [ ] Assigned-to Dropdown schließt sich beim Außenklick
- [ ] Kontaktauswahl in Dropdowns funktional

### Formulare

- [ ] Form-Validation überall implementiert
- [ ] Fehlermeldungen bei leeren Pflichtfeldern
- [ ] Erstellter Content sofort sichtbar
- [ ] Enter-Key in Subtask-Feld: nur Subtask erstellen, nicht Task

**Verantwortlich:** Alle (je nach eigenem Bereich)

---

## 📱 Bereich 6: Responsiveness (Alle)

### Mobile-Optimierung

- [ ] **Jede Seite** funktioniert ab 320px Breite
  - [ ] Login/Register
  - [ ] Summary
  - [ ] Board
  - [ ] Add Task
  - [ ] Contacts
  - [ ] Help, Legal Notice, Privacy Policy

### Content-Begrenzung

- [ ] max-width für Content (z.B. 1920px, linksbündig)
- [ ] Design-Elemente dürfen durchgehen

### Landscape-Modus

- [ ] Mobile Landscape standardmäßig deaktiviert
- [ ] Oder speziell optimiert (wenn Zeit)

### Scrollbalken

- [ ] Keine horizontalen Scrollbalken bei kleinen Auflösungen
- [ ] Overflow richtig behandeln

### Board Mobile

- [ ] Spalten vertikal angeordnet
- [ ] Touch-Gesten für Drag & Drop

**Verantwortlich:** Alle (je nach eigenem Bereich)

---

## 🧪 Bereich 7: Testing & Qualitätssicherung (Alle)

### Funktionale Tests

- [ ] **Alle User Stories getestet**
- [ ] **Alle Akzeptanzkriterien erfüllt**

### Browser-Tests

- [ ] Chrome (neueste Version)
- [ ] Firefox (neueste Version)
- [ ] Safari (neueste Version)
- [ ] Edge (neueste Version)

### Device-Tests

- [ ] Desktop (verschiedene Auflösungen)
- [ ] Tablet
- [ ] Mobile (verschiedene Größen)

### Fehlerprüfung

- [ ] Keine Konsolenfehler
- [ ] Keine console.log() Statements im finalen Code
- [ ] Keine Warnungen

### Code-Qualität

- [ ] Max. 400 Zeilen pro Datei
- [ ] Funktionen max. 14 Zeilen (ohne HTML)
- [ ] Jede Funktion hat eine Aufgabe
- [ ] camelCase für Variablen, Funktionen, Files
- [ ] 2 Leerzeilen zwischen Funktionen
- [ ] JSDoc Dokumentation für alle Funktionen
- [ ] Aussagekräftige Funktionsnamen

### Häufige Fehler vermeiden

- [ ] Menüpunkte verschieben sich nicht beim Hover
- [ ] Tickets verschwinden nicht beim Drag & Drop
- [ ] User-Feedback bei Speichern/Ändern
- [ ] Spalten auf Board nicht zu lang
- [ ] Formvalidation bei Add/Edit Contact
- [ ] Kein "Rauslaufen" von Subtasks, Kontakten, Content

**Verantwortlich:** Alle (Cross-Testing)

---

## 📄 Bereich 8: Rechtliches & Sonstiges (Kollege 1 oder 3)

### Legal Notice (Impressum)

- [ ] **US 1:** Legal Notice Seite erstellen
  - [ ] Link im Footer/Menu
  - [ ] Realitätsnahe Namen (kein Lorem Ipsum)
  - [ ] Vollständige Informationen

### Privacy Policy (Datenschutz)

- [ ] **US 2:** Privacy Policy Seite erstellen
  - [ ] Link im Footer/Menu
  - [ ] Detaillierte Datenschutzinformationen
  - [ ] Realitätsnahe Inhalte

### Help-Seite

- [ ] Help-Seite mit Anleitung/FAQ (optional aber empfohlen)

**Verantwortlich:** 👤 Kollege 1 oder 👥 Kollege 3

**Files:**

- `js/legality.js`, `js/policy.js`, `js/help.js`
- `css/legality.css`, `css/policy.css`, `css/help.css`
- `pages/legality.html`, `pages/policy.html`, `pages/help.html`

---

## 🎯 Bereich 9: Finalisierung & Abgabe (Alle)

### Test-Daten

- [ ] Mindestens 5 realistische Tasks hinzufügen
- [ ] Mindestens 10 Kontakte hinzufügen
- [ ] Tasks in verschiedenen Spalten verteilen
- [ ] Tasks mit Subtasks erstellen
- [ ] Verschiedene Prioritäten verwenden

### Dokumentation

- [ ] README.md aktualisieren
  - [ ] Projektbeschreibung
  - [ ] Installation & Setup
  - [ ] Features
  - [ ] Technologien
  - [ ] Team-Mitglieder
  - [ ] Screenshots (optional)

### GitHub

- [ ] Alle Änderungen committet
- [ ] Repository auf "public"
- [ ] Alle Branches gemerged
- [ ] Finaler Test vom main-Branch

### Abgabe

- [ ] Link zum GitHub Repository bereit
- [ ] Alle Gruppenmitglieder haben getestet
- [ ] Final Check: Alle DoD-Punkte erfüllt
- [ ] Projekt einreichen

### Nach Abgabe

- [ ] Jedes Mitglied forkt das Projekt
- [ ] Eigene README.md im Fork anpassen

**Verantwortlich:** Alle

---

## 📋 Arbeitsaufteilung: Quick Reference

| Bereich                | Verantwortlich   | Hauptaufgaben                                           |
| ---------------------- | ---------------- | ------------------------------------------------------- |
| **Auth & User**        | 👤 Kollege 1     | Login, Register, Logout, Route Guards, Header           |
| **Board & Tasks**      | 📋 Kollege 2     | Kanban-Board, Add/Edit/Delete Tasks, Drag & Drop, Suche |
| **Contacts & Summary** | 👥 Kollege 3     | Kontaktverwaltung, Dashboard, Statistics                |
| **Legal**              | 👤 K1 oder 👥 K3 | Impressum, Datenschutz, Help                            |
| **UI/UX**              | Alle             | Design, Responsiveness, User Feedback                   |
| **Testing**            | Alle             | Cross-Testing, Browser-Tests, QA                        |

---

## 💡 Tipps für die Zusammenarbeit

1. **Daily Standups:** Kurze tägliche Abstimmung (15 Min)
2. **Feature Branches:** Jeder arbeitet in eigenem Branch, dann PR zu dev
3. **Code Reviews:** Gegenseitig PRs reviewen
4. **Shared Services:** `backend.js`, `store.js`, `data.service.js` gemeinsam nutzen
5. **Kommunikation:** Discord/Slack/WhatsApp für schnelle Abstimmung
6. **Merge-Konflikte:** Regelmäßig pullen und mergen
7. **Pair Programming:** Bei komplexen Problemen zusammen arbeiten

---

## 📅 Meilensteine (Beispiel)

- [ ] **Woche 1:** Setup, Auth, Grundstruktur
- [ ] **Woche 2:** Board Grundfunktionen, Contacts, Summary
- [ ] **Woche 3:** Drag & Drop, Add/Edit Tasks, Advanced Features
- [ ] **Woche 4:** Responsiveness, Testing, Bugfixes
- [ ] **Woche 5:** Finalisierung, Test-Daten, Abgabe

---

**Viel Erfolg! 🚀**
