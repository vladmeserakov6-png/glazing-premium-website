import { concepts } from "./concepts.mjs";

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const lines = (value) => value.split("\n").map(escape).join("<br>");
const image = (name) => `../assets/media/${name}.webp`;
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg>';
const cross =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const check =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const windowMark =
  '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M3 3h34v34H3zM15 3v34M15 15h22M26 15v22M3 3l12 12" stroke="currentColor" stroke-width="1.6"/></svg>';
const icon = (type) => {
  const paths = {
    light:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    frame: '<path d="M3 3h18v18H3zM11 3v18M11 10h10M16 10v11"/>',
    layers: '<path d="m2 8 10-5 10 5-10 5L2 8Zm0 4 10 5 10-5M2 16l10 5 10-5"/>',
    quiet: '<path d="M5 8v8m4-12v16m4-14v12m4-16v20m4-14v8"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${paths[type]}</svg>`;
};
const photo = (name, alt, className = "", eager = false) =>
  `<img class="${className}" src="${image(name)}" alt="${escape(alt)}" width="1600" height="1067" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const briefButton = (label = "Обсудить проект", className = "") =>
  `<button class="btn ${className}" type="button" data-open-brief>${escape(label)}${arrow}</button>`;
const heading = (number, eyebrow, title, description = "") =>
  `<div class="section-heading"><div><p class="kicker"><span>${number}</span>${eyebrow}</p><h2>${lines(title)}</h2></div>${description ? `<p class="section-intro">${description}</p>` : ""}</div>`;

function labBar(c) {
  const index = concepts.findIndex((item) => item.id === c.id);
  const prev = concepts[(index + 9) % 10];
  const next = concepts[(index + 1) % 10];
  return `<div class="lab-bar"><a href="../index.html">${windowMark}<span>Все 10 вариантов</span></a><span class="lab-current">${c.id} / ${c.name}</span><div><button class="lab-favorite" type="button" data-favorite="${c.id}" aria-pressed="false" aria-label="Выбрать концепцию ${c.id} для сравнения">♡ <span>Нравится</span></button><a href="../${prev.id}/index.html" aria-label="Предыдущая концепция">←</a><a href="../${next.id}/index.html" aria-label="Следующая концепция">→</a></div></div>`;
}

function header() {
  return `<header class="concept-header wrap"><a class="brand" href="#top" aria-label="ПРОСВЕТ — начало страницы">${windowMark}<span>ПРОСВЕТ<small>АРХИТЕКТУРА ОСТЕКЛЕНИЯ</small></span></a><nav id="site-navigation" class="site-navigation" aria-label="Навигация по странице"><a href="#solutions">Решения</a><a href="#approach">Подход</a><a href="#references">Вдохновение</a><a href="#questions">Вопросы</a></nav>${briefButton("Обсудить проект", "header-action")}<button class="menu-button" type="button" aria-label="Открыть меню" aria-controls="site-navigation" aria-expanded="false"><span></span><span></span></button></header>`;
}

function diagram() {
  return `<svg class="window-diagram" viewBox="0 0 520 460" fill="none" aria-label="Схематичное изображение элементов оконной конструкции" role="img"><g stroke="currentColor"><path d="M85 115 320 40v290L85 405V115Z" stroke-width="2"/><path d="m150 130 235-75v290l-235 75V130Z" stroke-width="1"/><path d="m215 145 235-75v290l-235 75V145Z" stroke-width="2"/><path d="m100 130 205-65v250l-205 65V130Z"/><path d="m165 145 205-65v250l-205 65V145Z"/><path d="m230 160 205-65v250l-205 65V160Z"/><path d="m85 260 235-75M150 275l235-75M215 290l235-75"/><path d="M320 40h135M450 70h45M85 405H25M215 435h235" stroke-dasharray="4 4" opacity=".5"/><circle cx="320" cy="40" r="4"/><circle cx="450" cy="70" r="4"/><circle cx="85" cy="405" r="4"/></g><g fill="currentColor" font-family="Arial,sans-serif" font-size="11"><text x="365" y="28">ПРОФИЛЬ</text><text x="352" y="448">СТЕКЛОПАКЕТ</text><text x="12" y="428">ПРИМЫКАНИЕ</text></g></svg>`;
}

function hero(c) {
  const copy = `<p class="kicker hero-kicker">${c.eyebrow}</p><h1>${lines(c.headline)}</h1><p class="hero-intro">${c.intro}</p><div class="hero-actions">${briefButton("Подобрать остекление")}<a class="link-arrow" href="#solutions">Изучить решения ${arrow}</a></div>`;
  const visual = photo(
    c.hero,
    "Архитектурная визуализация пространства с современным остеклением",
    "hero-photo",
    true,
  );
  const caption = '<span class="photo-label">Архитектурная визуализация</span>';
  const variants = {
    nordic: `<section class="hero hero-nordic wrap"><div class="hero-copy">${copy}<div class="hero-footnote"><span class="tiny-window">${windowMark}</span>Окна · Балконы · Дома · Террасы</div></div><div class="hero-visual">${visual}${caption}<div class="floating-note"><span>НОВЫЙ ВЗГЛЯД</span>На привычное пространство ${arrow}</div></div></section>`,
    nocturne: `<section class="hero hero-nocturne">${visual}<div class="hero-shade"></div><div class="hero-copy wrap">${copy}</div><div class="hero-bottom wrap"><p>Свет внутри.<br>Свобода снаружи.</p><a href="#references">Исследовать архитектуру ${arrow}</a></div>${caption}</section>`,
    atelier: `<section class="hero hero-atelier wrap"><div class="hero-copy">${copy}</div><div class="editorial-visual">${visual}<span class="editorial-side">СВЕТ / ПРОПОРЦИИ / ДЕТАЛИ</span>${caption}</div><div class="editorial-foot"><p>01 — АРХИТЕКТУРА ПОВСЕДНЕВНОСТИ</p><p>Окно, которое поддерживает<br>характер вашего пространства.</p></div></section>`,
    swiss: `<section class="hero hero-swiss wrap"><div class="swiss-title"><p class="kicker">${c.eyebrow}</p><h1>${lines(c.headline)}</h1><span class="swiss-plus" aria-hidden="true">+</span></div><div class="swiss-right"><div class="swiss-photo">${visual}${caption}</div><div class="swiss-summary"><p>${c.intro}</p>${briefButton("Найти свое решение")}</div></div></section>`,
    botanic: `<section class="hero hero-botanic wrap"><div class="hero-visual">${visual}${caption}<span class="botanic-stamp" aria-hidden="true">БЛИЖЕ<br>К ПРИРОДЕ</span></div><div class="hero-copy">${copy}<p class="natural-note">Для домов, террас и ваших любимых видов.</p></div></section>`,
    urban: `<section class="hero hero-urban wrap"><div class="hero-copy">${copy}</div><div class="urban-visual">${visual}<div class="urban-inset">${photo(c.secondary, "Идея остекления светлого балкона")}</div><span class="urban-note">ОКНО В ВАШ<br>СОБСТВЕННЫЙ МИР ${arrow}</span>${caption}</div></section>`,
    gallery: `<section class="hero hero-gallery">${visual}<div class="hero-shade"></div><div class="hero-gallery-top wrap"><p>${c.eyebrow}</p><span>01 / СВЕТ</span></div><div class="hero-copy wrap">${copy}</div><a class="gallery-scroll" href="#references">Смотреть дальше ↓</a>${caption}</section>`,
    engineering: `<section class="hero hero-engineering wrap"><div class="hero-copy">${copy}<div class="engineering-points"><span>${icon("frame")}Профиль</span><span>${icon("layers")}Стеклопакет</span><span>${icon("quiet")}Комфорт</span></div></div><div class="engineering-visual"><div class="engineering-grid">${diagram()}<span class="technical-label">СХЕМА / ПРИНЦИП КОНСТРУКЦИИ</span></div><div class="engineering-photo">${visual}${caption}</div></div></section>`,
    warm: `<section class="hero hero-warm wrap"><div class="hero-copy">${copy}</div><div class="warm-visual">${visual}${caption}<span class="warm-note">У каждого дома —<br>свой теплый сценарий.</span></div></section>`,
    statement: `<section class="hero hero-statement wrap"><div class="statement-top"><p class="kicker">${c.eyebrow}</p><span class="statement-cross" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M20 2v36M2 20h36M7 7l26 26M7 33 33 7" stroke="currentColor" stroke-width="2"/></svg></span></div><div class="statement-composition"><h1>${lines(c.headline)}</h1><div class="statement-photo">${visual}${caption}</div><span class="statement-index" aria-hidden="true">10</span></div><div class="statement-bottom"><p>${c.intro}</p>${briefButton("Выйти за привычные рамки")}</div></section>`,
  };
  return variants[c.theme];
}

function benefits(c) {
  return `<section class="benefit-strip wrap" aria-label="Возможности остекления"><div>${icon("light")}<span>Естественный свет</span><p>Больше возможностей для вашего интерьера.</p></div><div>${icon("quiet")}<span>Продуманный комфорт</span><p>Характеристики подбирают под ваш объект.</p></div><div>${icon("frame")}<span>Архитектурная целостность</span><p>Цвет, пропорции и геометрия в одном решении.</p></div><p class="strip-signature">${c.id} / ПРОСВЕТ</p></section>`;
}

const servicePhotos = {
  "panoramic-glazing": "interior",
  "balcony-glazing": "balcony",
  "cottage-glazing": "forest",
  "terrace-glazing": "terrace",
  "plastic-windows": "urban",
  "aluminum-windows": "architecture",
  "loggia-glazing": "balcony",
  "veranda-glazing": "quiet",
};

function servicesSection(c, services) {
  return `<section class="section solutions-section wrap" id="solutions">${heading("01", "КАТАЛОГ РЕШЕНИЙ", c.solutionTitle, "От отдельного окна до стеклянного фасада. Выберите задачу — изучите особенности решения.")}<div class="filter-row" role="group" aria-label="Фильтр по типу объекта"><button type="button" data-filter="all" aria-pressed="true">Все решения <sup>08</sup></button><button type="button" data-filter="apartment" aria-pressed="false">Квартира</button><button type="button" data-filter="house" aria-pressed="false">Дом</button><button type="button" data-filter="outdoor" aria-pressed="false">Терраса</button></div><p class="sr-only" data-filter-status role="status"></p><div class="service-grid">${services.map((s, index) => `<article class="service-card" data-category="${s.category}" ${index >= 4 ? "hidden" : ""}><button type="button" class="service-open" data-service="${s.id}" aria-label="Подробнее: ${escape(s.title)}"><div class="service-image">${photo(servicePhotos[s.id], s.imageAlt)}<span class="service-number">0${index + 1}</span><span class="service-arrow">${arrow}</span></div><div class="service-copy"><span class="service-index">0${index + 1}</span><div><p class="service-tag">${s.tag}</p><h3>${escape(s.title)}</h3><p class="service-description">${escape(s.description)}</p></div><span class="service-inline-arrow">${arrow}</span></div></button></article>`).join("")}</div><div class="services-bottom"><p>Конфигурация зависит от особенностей вашего объекта.</p><button type="button" class="text-button" data-show-all aria-expanded="false">Показать все 8 решений <span>↓</span></button></div></section>`;
}

function approachSection(c) {
  const items = [
    [
      "01",
      "От вашего сценария",
      "Как вы используете помещение, что хотите видеть за окном и какой комфорт для вас важен.",
    ],
    [
      "02",
      "К подходящей системе",
      "Материал профиля, стеклопакет и открывание подбираются вместе с учетом условий объекта.",
    ],
    [
      "03",
      "Через внимание к деталям",
      "Примыкания, вентиляция и монтаж обсуждаются до окончательного выбора конструкции.",
    ],
  ];
  return `<section class="section approach-section" id="approach"><div class="wrap"><div class="approach-layout"><div class="approach-visual">${photo(c.secondary, "Визуальный референс интерьера и оконной конструкции")}<span class="photo-label">Архитектурный референс</span><span class="approach-caption">${escape(c.quote)}</span></div><div class="approach-copy">${heading("02", "ПОДХОД К ПРОЕКТУ", c.approachTitle)}<p class="approach-lead">Остекление — часть жизни дома. Выбор начинается с понимания пространства, а технические решения поддерживают вашу идею.</p><div class="approach-list">${items.map(([number, title, text]) => `<div class="approach-item"><span>${number}</span><div><h3>${title}</h3><p>${text}</p></div></div>`).join("")}</div>${briefButton("Начать со своей идеи", "btn-secondary")}</div></div><div class="approach-quote"><span aria-hidden="true">«</span><p>${escape(c.quote)}</p><span>ПРОСВЕТ / ФИЛОСОФИЯ ПРОСТРАНСТВА</span></div></div></section>`;
}

function referencesSection(c) {
  const references = [
    [
      c.hero,
      "Свет как часть архитектуры",
      "Идея для вашего будущего пространства",
    ],
    [
      c.third,
      "Открытый взгляд на привычное",
      "Прозрачная граница между домом и миром",
    ],
    [
      c.secondary,
      "Жизнь вокруг любимого вида",
      "Детали, которые задают настроение",
    ],
  ];
  return `<section class="section references-section wrap" id="references">${heading("03", "АРХИТЕКТУРНОЕ ВДОХНОВЕНИЕ", "Увидеть возможности.\nПредставить свое.", "Архитектурные визуализации для поиска идеи. Эти изображения не являются выполненными работами компании.")}<div class="reference-grid">${references.map(([src, title, subtitle], index) => `<figure class="reference-card"><div>${photo(src, `Архитектурная визуализация: ${title}`)}<span class="reference-label">Визуальный референс</span></div><figcaption><span>0${index + 1} / ИДЕЯ</span><h3>${title}</h3><p>${subtitle}</p></figcaption></figure>`).join("")}</div></section>`;
}

function pickerSection(c) {
  return `<section class="section picker-section" id="selector"><div class="wrap picker-layout"><div class="picker-copy"><p class="kicker"><span>04</span>НАЧНИТЕ С ВАШЕЙ ЗАДАЧИ</p><h2>Какое решение<br>подойдет вам?</h2><p>Выберите объект и главный приоритет. Получите ориентир для дальнейшего обсуждения со специалистом.</p><div class="picker-graphic" aria-hidden="true">${c.theme === "engineering" || c.theme === "swiss" ? diagram() : windowMark}</div></div><form class="picker-form"><fieldset><legend><span>01</span>Ваш объект</legend><div class="choice-grid"><label><input type="radio" name="object" value="apartment" checked><span>Квартира</span></label><label><input type="radio" name="object" value="house"><span>Частный дом</span></label><label><input type="radio" name="object" value="balcony"><span>Балкон / лоджия</span></label><label><input type="radio" name="object" value="terrace"><span>Терраса / веранда</span></label></div></fieldset><fieldset><legend><span>02</span>Что для вас важнее?</legend><div class="choice-grid priorities"><label><input type="radio" name="priority" value="comfort" checked><span>Тепло и тишина</span></label><label><input type="radio" name="priority" value="light"><span>Свет и открытый вид</span></label><label><input type="radio" name="priority" value="opening"><span>Удобное открывание</span></label></div></fieldset><button class="btn" type="submit">Подобрать направление ${arrow}</button><div class="picker-result" hidden role="status"><p class="kicker">ВАШ ОРИЕНТИР</p><h3 data-recommendation-title></h3><p data-recommendation-copy></p><button class="text-button" type="button" data-recommendation-brief>Подготовить задание ${arrow}</button></div><p class="picker-note">Подбор — предварительный ориентир, не инженерное заключение и не расчет стоимости.</p></form></div></section>`;
}

function faqSection(c, faqs) {
  return `<section class="section faq-section wrap" id="questions">${heading("05", "ПОЛЕЗНО ЗНАТЬ", c.theme === "warm" ? "Поговорим\nо важном" : "Вопросы, с которых\nстоит начать", "Несколько ориентиров, которые помогают сделать осознанный выбор.")}<div class="faq-list">${faqs.map((faq, index) => `<details name="concept-faq"><summary><span class="faq-number">0${index + 1}</span><span>${escape(faq.question)}</span><span class="faq-toggle" aria-hidden="true">+</span></summary><p>${escape(faq.answer)}</p></details>`).join("")}</div></section>`;
}

function cta(c) {
  return `<section class="final-cta"><div class="wrap cta-layout"><div><p class="kicker">ОТ ВАШЕЙ ИДЕИ — К ВЫБОРУ РЕШЕНИЯ</p><h2>${lines(c.cta)}</h2><p>Опишите объект и пожелания.<br>Подготовьте задание для обсуждения со специалистом.</p>${briefButton("Подготовить задание на расчет")}</div><div class="cta-art" aria-hidden="true">${c.theme === "statement" ? arrow : windowMark}</div></div></section>`;
}

function footer(c) {
  return `<footer class="concept-footer wrap"><div class="footer-top"><a class="brand" href="#top">${windowMark}<span>ПРОСВЕТ<small>АРХИТЕКТУРА ОСТЕКЛЕНИЯ</small></span></a><p>Больше пространства<br>для вашего взгляда.</p><nav aria-label="Навигация в подвале"><a href="#solutions">Решения</a><a href="#references">Вдохновение</a><a href="#questions">Вопросы</a><a href="#selector">Подобрать решение</a></nav><a class="back-top" href="#top">Наверх ↑</a></div><div class="footer-bottom"><p>ПРОСВЕТ — рабочее название дизайн-концепции.</p><p>Изображения — архитектурные AI-визуализации.</p><span>Вариант ${c.id} / ${escape(c.name)}</span></div></footer>`;
}

function dialogs(c, services) {
  return `<dialog class="project-dialog" aria-labelledby="dialog-title"><div class="dialog-inner"><button type="button" class="close-dialog" aria-label="Закрыть окно">${cross}</button><div class="dialog-service" data-panel="service" hidden><div class="dialog-image"><img data-detail-image src="${image(c.hero)}" alt="" width="1000" height="600"><span class="reference-label">Архитектурный референс</span></div><div class="dialog-body"><p class="kicker">РЕШЕНИЕ ДЛЯ ВАШЕГО ОБЪЕКТА</p><h2 id="service-dialog-title" data-detail-title></h2><p data-detail-copy></p><ul data-detail-features></ul><button type="button" class="btn" data-detail-brief>Подготовить задание ${arrow}</button></div></div><div class="dialog-brief" data-panel="brief"><p class="kicker">НАЧАЛО ВАШЕГО ПРОЕКТА</p><h2 id="brief-dialog-title">Расскажите о<br>вашем пространстве</h2><p>Составьте краткое задание, скачайте его и передайте выбранному специалисту.</p><form class="brief-form"><div class="form-grid"><label for="brief-object">Ваш объект<select id="brief-object" name="object"><option>Квартира</option><option>Частный дом</option><option>Балкон или лоджия</option><option>Терраса или веранда</option></select></label><label for="brief-service">Решение<select id="brief-service" name="service"><option value="not-sure">Нужна помощь с выбором</option>${services.map((s) => `<option value="${s.id}">${escape(s.title)}</option>`).join("")}</select></label><label for="brief-width">Ширина проема, мм<input id="brief-width" name="width" type="number" inputmode="numeric" min="100" max="50000" step="1" placeholder="Необязательно" aria-describedby="measurement-note"></label><label for="brief-height">Высота проема, мм<input id="brief-height" name="height" type="number" inputmode="numeric" min="100" max="50000" step="1" placeholder="Необязательно" aria-describedby="measurement-note"></label></div><p class="form-note" id="measurement-note">Примерные размеры не заменяют профессиональный замер.</p><label class="comment-label" for="brief-comment">Ваши пожелания<textarea id="brief-comment" name="comment" rows="3" maxlength="1000" placeholder="Что для вас особенно важно?" aria-describedby="privacy-note"></textarea></label><p class="form-note" id="privacy-note">Не указывайте персональные данные. Задание создается только в вашем браузере и никуда не отправляется.</p><button type="submit" class="btn">Скачать задание ${arrow}</button><p class="brief-feedback" role="status"></p></form></div></div></dialog><div class="selection-toast" role="status" aria-live="polite"></div>`;
}

export function renderConcept(c, services, faqs) {
  const sections = {
    services: servicesSection(c, services),
    approach: approachSection(c),
    references: referencesSection(c),
    picker: pickerSection(c),
    faq: faqSection(c, faqs),
  };
  const data = {
    id: c.id,
    name: c.name,
    services: services.map((s) => ({
      ...s,
      image: image(servicePhotos[s.id]),
    })),
    check,
  };
  return `<!doctype html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${escape(c.description)}"><meta name="theme-color" content="${c.background}"><title>${c.id}. ${escape(c.name)} — ПРОСВЕТ</title><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../assets/concepts.css"><script src="../assets/interaction.js" defer></script></head><body class="theme-${c.theme}" data-concept="${c.id}" id="top" style="--accent:${c.accent};--bg:${c.background};--ink:${c.ink}"><a href="#main" class="skip-link">Перейти к содержимому</a>${labBar(c)}${header(c)}<main id="main">${hero(c)}${benefits(c)}${c.order.map((key) => sections[key]).join("")}${cta(c)}</main>${footer(c)}${dialogs(c, services)}<script type="application/json" id="concept-data">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script></body></html>`;
}

export function renderGallery() {
  return `<!doctype html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#f5f4f0"><title>10 взглядов на остекление — галерея концепций</title><link rel="icon" href="assets/favicon.svg"><link rel="stylesheet" href="assets/gallery.css"><script src="assets/gallery.js" defer></script></head><body><a href="#main" class="skip-link">Перейти к вариантам</a><header class="gallery-header"><a class="gallery-brand" href="index.html">${windowMark}<span>ПРОСВЕТ / ДИЗАЙН-ЛАБОРАТОРИЯ</span></a><a href="../">Исходный сайт ${arrow}</a></header><main id="main"><section class="gallery-hero"><p class="gallery-kicker">ДЕСЯТЬ САМОСТОЯТЕЛЬНЫХ ДИЗАЙН-НАПРАВЛЕНИЙ</p><div><h1>Одна тема.<br><span>Десять разных взглядов.</span></h1><p>От спокойной архитектуры до смелой студийной подачи. Откройте каждый вариант, прокрутите страницу целиком и попробуйте ее на телефоне.</p></div><div class="gallery-controls"><span>10 полных адаптивных страниц</span><button type="button" data-favorites-only aria-pressed="false">♡ Только понравившиеся <span data-favorite-count>0</span></button></div></section><section class="concepts-grid" aria-label="Все концепции">${concepts.map((c) => `<article class="concept-preview" data-id="${c.id}" style="--preview-bg:${c.background};--preview-accent:${c.accent};--preview-ink:${c.ink}"><a href="${c.id}/index.html" class="concept-thumbnail" aria-label="Открыть вариант ${c.id}: ${escape(c.name)}"><img src="assets/previews/${c.id}.webp" width="960" height="720" alt="Первый экран концепции ${escape(c.name)}" loading="lazy"><span class="preview-number">${c.id}</span><span class="preview-open">Открыть страницу ${arrow}</span></a><div class="concept-description"><div><p>${escape(c.category)}</p><h2><a href="${c.id}/index.html">${escape(c.name)}</a></h2></div><button class="favorite-button" type="button" data-favorite="${c.id}" aria-pressed="false" aria-label="Выбрать концепцию ${c.id} для сравнения">♡</button></div><p class="concept-summary">${escape(c.description)}</p><div class="concept-palette" aria-label="Цвета концепции"><span style="background:${c.background}"></span><span style="background:${c.ink}"></span><span style="background:${c.accent}"></span><a href="${c.id}/index.html">Посмотреть целиком →</a></div></article>`).join("")}</section><p class="gallery-empty" hidden>Пока ничего не выбрано. Вернитесь ко всем вариантам и нажмите ♡ на понравившихся.</p><section class="gallery-note"><span>КАК ВЫБИРАТЬ</span><p>Сравните композицию, атмосферу и удобство. Можно выбрать несколько вариантов — например, первый экран одного и каталог другого. Напишите их номера в чат Codex, чтобы продолжить работу над основным сайтом.</p><p>♡ сохраняет выбор только в этом браузере. Все изображения — AI-референсы. Это дизайн-концепции: цены и сведения о компании не выдумывались, заявки никуда не отправляются.</p></section></main><footer class="gallery-footer"><span>ПРОСВЕТ — рабочее название концепции</span><a href="../">Вернуться к исходному сайту ↗</a></footer><div class="gallery-status" role="status" aria-live="polite"></div></body></html>`;
}
