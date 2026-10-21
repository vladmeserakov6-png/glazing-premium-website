(() => {
  "use strict";
  const data = JSON.parse(document.getElementById("concept-data").textContent);
  const dialog = document.querySelector(".project-dialog");
  const briefForm = document.querySelector(".brief-form");
  const picker = document.querySelector(".picker-form");
  const services = new Map(
    data.services.map((service) => [service.id, service]),
  );
  let lastTrigger = null;
  let previousOverflow = "";
  let recommendation = null;

  function showPanel(panel) {
    document.querySelectorAll("[data-panel]").forEach((element) => {
      element.hidden = element.dataset.panel !== panel;
    });
    dialog.setAttribute("aria-labelledby", `${panel}-dialog-title`);
    if (!dialog.open) {
      lastTrigger = document.activeElement;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    dialog.querySelector(".close-dialog").focus();
  }

  function openBrief(serviceId, object) {
    briefForm.reset();
    briefForm
      .querySelectorAll("[aria-invalid]")
      .forEach((input) => input.removeAttribute("aria-invalid"));
    briefForm.querySelector(".brief-feedback").textContent = "";
    briefForm.elements.service.value = services.has(serviceId)
      ? serviceId
      : "not-sure";
    const objectLabels = {
      apartment: "Квартира",
      house: "Частный дом",
      balcony: "Балкон или лоджия",
      terrace: "Терраса или веранда",
    };
    if (objectLabels[object])
      briefForm.elements.object.value = objectLabels[object];
    showPanel("brief");
  }

  document
    .querySelectorAll("[data-open-brief]")
    .forEach((button) => button.addEventListener("click", () => openBrief()));
  document.querySelectorAll("[data-service]").forEach((button) =>
    button.addEventListener("click", () => {
      const service = services.get(button.dataset.service);
      if (!service) return;
      const img = dialog.querySelector("[data-detail-image]");
      img.src = service.image;
      img.alt = service.imageAlt;
      dialog.querySelector("[data-detail-title]").textContent = service.title;
      dialog.querySelector("[data-detail-copy]").textContent = service.detail;
      const features = dialog.querySelector("[data-detail-features]");
      features.replaceChildren(
        ...service.features.map((feature) => {
          const item = document.createElement("li");
          item.textContent = feature;
          return item;
        }),
      );
      dialog.querySelector("[data-detail-brief]").onclick = () =>
        openBrief(service.id);
      showPanel("service");
    }),
  );

  function closeDialog() {
    dialog.close();
    document.body.style.overflow = previousOverflow;
    lastTrigger?.focus();
  }
  dialog.querySelector(".close-dialog").addEventListener("click", closeDialog);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    if (!dialog.open) document.body.style.overflow = previousOverflow;
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [
      ...dialog.querySelectorAll(
        "button:not([disabled]),input,select,textarea,a[href]",
      ),
    ].filter((element) => element.getClientRects().length > 0);
    const first = focusable[0],
      last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".site-navigation");
  function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    navigation.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Закрыть меню" : "Открыть меню",
    );
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    )
      closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) closeMenu();
  });

  const cards = [...document.querySelectorAll(".service-card")];
  const more = document.querySelector("[data-show-all]");
  let filter = "all",
    expanded = false;
  function filterCards() {
    cards.forEach((card, index) => {
      card.hidden = !(
        (filter === "all" || filter === card.dataset.category) &&
        (filter !== "all" || expanded || index < 4)
      );
    });
    const visible = cards.filter((card) => !card.hidden).length;
    document.querySelector("[data-filter-status]").textContent =
      `Показано решений: ${visible}`;
    more.hidden = filter !== "all";
    more.setAttribute("aria-expanded", String(expanded));
    more.textContent = expanded
      ? "Свернуть каталог ↑"
      : "Показать все 8 решений ↓";
  }
  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      document
        .querySelectorAll("[data-filter]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      filterCards();
    }),
  );
  more.addEventListener("click", () => {
    expanded = !expanded;
    filterCards();
  });
  filterCards();

  const recommendations = {
    apartment: {
      comfort: "plastic-windows",
      light: "panoramic-glazing",
      opening: "plastic-windows",
    },
    house: {
      comfort: "cottage-glazing",
      light: "panoramic-glazing",
      opening: "aluminum-windows",
    },
    balcony: {
      comfort: "balcony-glazing",
      light: "loggia-glazing",
      opening: "balcony-glazing",
    },
    terrace: {
      comfort: "veranda-glazing",
      light: "terrace-glazing",
      opening: "terrace-glazing",
    },
  };
  picker.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(picker);
    const object = values.get("object"),
      priority = values.get("priority");
    const serviceId = recommendations[object]?.[priority];
    const service = services.get(serviceId);
    if (!service) return;
    recommendation = { serviceId, object };
    picker.querySelector("[data-recommendation-title]").textContent =
      service.title;
    picker.querySelector("[data-recommendation-copy]").textContent =
      `${service.features[0]}. Техническую возможность, характеристики и комплектацию нужно проверить по вашему объекту.`;
    const result = picker.querySelector(".picker-result");
    result.hidden = false;
    result.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "nearest",
    });
  });
  picker.addEventListener("change", () => {
    picker.querySelector(".picker-result").hidden = true;
    recommendation = null;
  });
  picker
    .querySelector("[data-recommendation-brief]")
    .addEventListener("click", () => {
      if (recommendation)
        openBrief(recommendation.serviceId, recommendation.object);
    });

  briefForm.noValidate = true;
  briefForm.addEventListener("input", (event) => {
    briefForm.querySelector(".brief-feedback").textContent = "";
    event.target.removeAttribute("aria-invalid");
  });
  briefForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(briefForm);
    const feedback = briefForm.querySelector(".brief-feedback");
    for (const name of ["width", "height"]) {
      const input = briefForm.elements[name];
      const value = String(values.get(name)).trim();
      if (
        input.validity.badInput ||
        (value &&
          (!/^\d+$/.test(value) ||
            Number(value) < 100 ||
            Number(value) > 50000))
      ) {
        input.setAttribute("aria-invalid", "true");
        feedback.textContent =
          "Укажите целые размеры от 100 до 50 000 мм или оставьте поля пустыми.";
        input.focus();
        return;
      }
    }
    const comment = String(values.get("comment")).trim();
    if (comment.length > 1000) {
      briefForm.elements.comment.setAttribute("aria-invalid", "true");
      feedback.textContent = "Сократите описание до 1000 символов.";
      briefForm.elements.comment.focus();
      return;
    }
    const service = services.get(values.get("service"));
    const text = [
      "ЗАДАНИЕ НА РАСЧЕТ ОСТЕКЛЕНИЯ",
      "",
      `Объект: ${values.get("object")}`,
      `Решение: ${service?.title ?? "Нужна помощь с выбором"}`,
      `Ширина проема: ${values.get("width") ? `${values.get("width")} мм` : "требует уточнения"}`,
      `Высота проема: ${values.get("height") ? `${values.get("height")} мм` : "требует уточнения"}`,
      `Пожелания: ${comment || "требуют уточнения"}`,
      "",
      "Размеры предварительные и не заменяют замер.",
      "Стоимость и технические характеристики нужно согласовать по объекту.",
      `Дизайн-концепция ${data.id}: ${data.name}`,
      "Задание создано локально. Заявка не отправлена.",
    ];
    const blob = new Blob(["\uFEFF", text.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Задание-на-остекление-${data.id}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback.textContent =
      "Файл подготовлен. Передайте его специалисту. Заявка не отправлена.";
  });

  const favorite = document.querySelector("[data-favorite]");
  let favorites = [];
  try {
    const stored = JSON.parse(localStorage.getItem("prosvet-concepts") || "[]");
    if (Array.isArray(stored))
      favorites = stored.filter((id) => typeof id === "string");
  } catch {
    /* Favorites remain available for this page session. */
  }
  function syncFavorite() {
    const selected = favorites.includes(data.id);
    favorite.setAttribute("aria-pressed", String(selected));
    favorite.querySelector("span").textContent = selected
      ? "В избранном"
      : "Нравится";
  }
  let toastTimer;
  favorite.addEventListener("click", () => {
    const selected = !favorites.includes(data.id);
    favorites = selected
      ? [...favorites, data.id]
      : favorites.filter((id) => id !== data.id);
    try {
      localStorage.setItem("prosvet-concepts", JSON.stringify(favorites));
    } catch {
      /* No persistence if storage is disabled. */
    }
    syncFavorite();
    const toast = document.querySelector(".selection-toast");
    toast.textContent = selected
      ? `Концепция ${data.id} добавлена в избранное этой галереи`
      : `Концепция ${data.id} убрана из избранного`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.textContent = "";
    }, 3500);
  });
  syncFavorite();
})();
