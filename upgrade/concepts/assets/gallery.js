(() => {
  "use strict";
  let favorites = [];
  let onlyFavorites = false;
  try {
    const stored = JSON.parse(localStorage.getItem("prosvet-concepts") || "[]");
    if (Array.isArray(stored))
      favorites = stored.filter((id) => typeof id === "string");
  } catch {
    /* Use session-only choices when storage is unavailable. */
  }
  const cards = [...document.querySelectorAll(".concept-preview")];
  const toggle = document.querySelector("[data-favorites-only]");
  function render() {
    let visible = 0;
    cards.forEach((card) => {
      const selected = favorites.includes(card.dataset.id);
      card
        .querySelector("[data-favorite]")
        .setAttribute("aria-pressed", String(selected));
      card.hidden = onlyFavorites && !selected;
      if (!card.hidden) visible++;
    });
    document.querySelector("[data-favorite-count]").textContent = String(
      cards.filter((card) => favorites.includes(card.dataset.id)).length,
    );
    document.querySelector(".gallery-empty").hidden = visible > 0;
    toggle.setAttribute("aria-pressed", String(onlyFavorites));
  }
  document.querySelectorAll("[data-favorite]").forEach((button) =>
    button.addEventListener("click", () => {
      const id = button.dataset.favorite;
      const selected = !favorites.includes(id);
      favorites = selected
        ? [...favorites, id]
        : favorites.filter((item) => item !== id);
      try {
        localStorage.setItem("prosvet-concepts", JSON.stringify(favorites));
      } catch {
        /* Keep session-only selection. */
      }
      document.querySelector(".gallery-status").textContent = selected
        ? `Вариант ${id} добавлен в избранное`
        : `Вариант ${id} убран из избранного`;
      render();
    }),
  );
  toggle.addEventListener("click", () => {
    onlyFavorites = !onlyFavorites;
    render();
  });
  window.addEventListener("pageshow", () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("prosvet-concepts") || "[]",
      );
      if (Array.isArray(stored)) favorites = stored;
    } catch {
      /* Retain the current page selection. */
    }
    render();
  });
  render();
})();
