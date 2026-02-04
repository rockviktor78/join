async function includeHTML() {
  const elements = document.querySelectorAll("[w3-include-html]");
  for (const node of elements) {
    const file = node.getAttribute("w3-include-html");
    try {
      const resp = await fetch(file);
      if (resp.ok) {
        node.innerHTML = await resp.text();
      }
    } catch (e) {
      console.error("Error loading include:", file);
    }
    node.removeAttribute("w3-include-html");
  }
}

function updateNavigation() {
  const path = window.location.pathname.toLowerCase();

  document.querySelectorAll(".menu__btn").forEach((btn) => {
    btn.classList.remove("active"); // Erstmal alle aufräumen

    const pageName = btn.id.replace("nav", "").toLowerCase();

    // Prüft ob der Seitenname in der URL vorkommt
    if (path.includes(pageName)) {
      btn.classList.add("active");
    }

    // Spezialfall: Wenn man auf der Root-Ebene ist, Summary markieren
    if (path.endsWith("/") && pageName === "summary") {
      btn.classList.add("active");
    }
  });
}

async function init() {
  await includeHTML();
  updateNavigation();
  // Optional: Avatar setzen
  const avatar = document.getElementById("userAvatar");
  if (avatar) {
    const initials = avatar.querySelector(".header__user-initials");
    if (initials) initials.textContent = "SM";
    else avatar.textContent = "SM";
  }

  setupUserMenu();

  // Aktiviere den richtigen Menu-Button
  if (typeof setActiveMenuBtnOnLoad === "function") {
    setActiveMenuBtnOnLoad();
  }
  // Setup Menu Navigation
  if (typeof setupMenuNavigation === "function") {
    setupMenuNavigation();
  }
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
