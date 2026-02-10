/**
 * Initializes the shared template (header/menu) after includes are loaded
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
  setUserInitials();
  initializeMenuAndLogout();
  applySidebarMode();
}

/**
 * Initializes menu navigation and logout functionality
 */
function initializeMenuAndLogout() {
  if (typeof initMenuNavigation === "function") {
    initMenuNavigation();
  }
  setupLogoutLink();
  setupUserMenu();
  initializeMenuFeatures();
}

/**
 * Sets up the logout link functionality
 */
function setupLogoutLink() {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("loggedInUser");
      window.location.href = "../index.html";
    });
  }
}

/**
 * Initializes additional menu features if available
 */
function initializeMenuFeatures() {
  if (typeof setActiveMenuBtnOnLoad === "function") {
    setActiveMenuBtnOnLoad();
  }
  if (typeof setupMenuNavigation === "function") {
    setupMenuNavigation();
  }
}

/**
 * Updates navigation state based on current page
 */
function updateNavigation() {
  const path = window.location.pathname.toLowerCase();
  document.querySelectorAll(".menu__btn").forEach((btn) => {
    btn.classList.remove("active");
    const pageName = btn.id.replace("nav", "").toLowerCase();
    if (
      path.includes(pageName) ||
      (path.endsWith("/") && pageName === "summary")
    ) {
      btn.classList.add("active");
    }
  });
}

/**
 * Sets up the user menu with event listeners
 */
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

/**
 * Gets user menu DOM elements
 * @returns {Object|null} Object with avatar and menu elements, or null if not found
 */
function getUserMenuElements() {
  const avatar = document.getElementById("userAvatar");
  const menu = document.getElementById("userMenu");
  if (!avatar || !menu) return null;
  return { avatar, menu };
}

/**
 * Sets the user menu state (open/closed)
 * @param {HTMLElement} avatar - The avatar element
 * @param {HTMLElement} menu - The menu element
 * @param {boolean} open - Whether the menu should be open
 */
function setUserMenuState(avatar, menu, open) {
  menu.classList.toggle("is-open", open);
  avatar.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-hidden", String(!open));
  if (open) {
    menu.removeAttribute("inert");
  } else {
    menu.setAttribute("inert", "");
  }
}

/**
 * Toggles the user menu between open and closed states
 * @param {HTMLElement} avatar - The avatar element
 * @param {HTMLElement} menu - The menu element
 */
function toggleUserMenu(avatar, menu) {
  const isOpen = menu.classList.contains("is-open");
  setUserMenuState(avatar, menu, !isOpen);
}

/**
 * Handles clicks outside the user menu to close it
 * @param {Event} event - The click event
 * @param {HTMLElement} avatar - The avatar element
 * @param {HTMLElement} menu - The menu element
 */
function handleOutsideClick(event, avatar, menu) {
  if (!menu.contains(event.target) && event.target !== avatar) {
    setUserMenuState(avatar, menu, false);
  }
}

/**
 * Handles escape key press to close the user menu
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLElement} avatar - The avatar element
 * @param {HTMLElement} menu - The menu element
 */
function handleEscape(event, avatar, menu) {
  if (event.key === "Escape") {
    setUserMenuState(avatar, menu, false);
  }
}

/**
 * Sets user initials in the header avatar
 */
function setUserInitials() {
  const avatar = document.getElementById("userAvatar");
  if (!avatar) return;
  const initials = getUserInitials();
  setInitialsToAvatar(avatar, initials);
}

/**
 * Retrieves user initials from session storage
 * @returns {string} User initials or default "MS"
 */
function getUserInitials() {
  const loggedInUserString = sessionStorage.getItem("loggedInUser");
  let initials = "MS";
  if (loggedInUserString) {
    try {
      const user = JSON.parse(loggedInUserString);
      if (user && user.name) {
        initials = getInitials(user.name, "SM");
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
  return initials;
}

/**
 * Sets the initials to the avatar element
 * @param {HTMLElement} avatar - The avatar element
 * @param {string} initials - The initials to display
 */
function setInitialsToAvatar(avatar, initials) {
  const initialsElement = avatar.querySelector(".header__user-initials");
  if (initialsElement) {
    initialsElement.textContent = initials;
  } else {
    avatar.textContent = initials;
  }
}

/**
 * Applies the appropriate sidebar mode based on the current page
 */
function applySidebarMode() {
  if (
    typeof isExternalPage === "function" &&
    typeof setSidebarMode === "function"
  ) {
    const mode = isExternalPage() ? "external" : "internal";
    setSidebarMode(mode);

    if (mode === "external" && typeof setupLoginButton === "function") {
      setupLoginButton();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTemplate();
});
