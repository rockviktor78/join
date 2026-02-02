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
  if (avatar) avatar.innerText = "SM";

  // Aktiviere den richtigen Menu-Button
  if (typeof setActiveMenuBtnOnLoad === "function") {
    setActiveMenuBtnOnLoad();
  }
  // Setup Menu Navigation
  if (typeof setupMenuNavigation === "function") {
    setupMenuNavigation();
  }
}
