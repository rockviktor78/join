document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector(".back-btn");
  const helpBtn = document.querySelector(".header__help-btn");

  if (backBtn && helpBtn) {
    backBtn.addEventListener("click", () => {
      helpBtn.classList.toggle("header__help-btn--hidden");
    });
  }
});
