/**
 * Initializes the shared template (header/menu) after includes are loaded.
 */
async function initTemplate() {
  if (typeof includeHTML !== "function") {
    console.error(
      "includeHTML is not available. Make sure include-html.js is loaded first.",
    );
    return;
  }

  await includeHTML();
  updateNavigation();

  // Initialisiere Menu-Navigation nach dem Template-Laden
  if (typeof initMenuNavigation === "function") {
    initMenuNavigation();
  }

  // Setze User-Initialen
  setUserInitials();

  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("loggedInUser");
      window.location.href = "../index.html";
    });
  }

  setupUserMenu();

  if (typeof setActiveMenuBtnOnLoad === "function") {
    setActiveMenuBtnOnLoad();
  }

  if (typeof setupMenuNavigation === "function") {
    setupMenuNavigation();
  }
}

function updateNavigation() {
  const path = window.location.pathname.toLowerCase();

  document.querySelectorAll(".menu__btn").forEach((btn) => {
    btn.classList.remove("active");

    const pageName = btn.id.replace("nav", "").toLowerCase();

    if (path.includes(pageName)) {
      btn.classList.add("active");
    }

    if (path.endsWith("/") && pageName === "summary") {
      btn.classList.add("active");
    }
  });
}

function setupUserMenu() {
  const elements = getUserMenuElements();
  if (!elements) return;
  const { avatar, menu } = elements;
  avatar.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleUserMenu(avatar, menu);
  });
  menu.addEventListener("click", () => setUserMenuState(avatar, menu, false));
  document.addEventListener("click", (event) =>
    handleOutsideClick(event, avatar, menu),
  );
  document.addEventListener("keydown", (event) =>
    handleEscape(event, avatar, menu),
  );
}

function getUserMenuElements() {
  const avatar = document.getElementById("userAvatar");
  const menu = document.getElementById("userMenu");
  if (!avatar || !menu) return null;
  return { avatar, menu };
}

function setUserMenuState(avatar, menu, open) {
  menu.classList.toggle("is-open", open);
  avatar.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-hidden", String(!open));
}

function toggleUserMenu(avatar, menu) {
  const isOpen = menu.classList.contains("is-open");
  setUserMenuState(avatar, menu, !isOpen);
}

function handleOutsideClick(event, avatar, menu) {
  if (!menu.contains(event.target) && event.target !== avatar) {
    setUserMenuState(avatar, menu, false);
  }
}

function handleEscape(event, avatar, menu) {
  if (event.key === "Escape") {
    setUserMenuState(avatar, menu, false);
  }
}

/**
 * Extrahiert Initialen aus einem Namen
 * @param {string} name - Der vollständige Name (z.B. "Max Mustermann")
 * @returns {string} Die Initialen (z.B. "MM")
 */
function getInitialsFromName(name) {
  if (!name) return "MS";

  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length === 1) {
    // Nur ein Name: Nimm die ersten 2 Buchstaben
    return nameParts[0].substring(0, 2).toUpperCase();
  }

  // Mehrere Namen: Nimm ersten Buchstaben von erstem und letztem Namen
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];
  return (firstInitial + lastInitial).toUpperCase();
}

/**
 * Setzt die User-Initialen im Header-Avatar
 */
function setUserInitials() {
  const avatar = document.getElementById("userAvatar");
  if (!avatar) return;

  // Hole User-Daten aus sessionStorage
  const loggedInUserString = sessionStorage.getItem("loggedInUser");
  let initials = "MS"; // Default: Monika Simens

  if (loggedInUserString) {
    try {
      const user = JSON.parse(loggedInUserString);
      if (user && user.name) {
        initials = getInitialsFromName(user.name);
      }
    } catch (e) {
      console.error("Fehler beim Parsen der User-Daten:", e);
    }
  }

  // Setze die Initialen
  const initialsElement = avatar.querySelector(".header__user-initials");
  if (initialsElement) {
    initialsElement.textContent = initials;
  } else {
    avatar.textContent = initials;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTemplate();
});
