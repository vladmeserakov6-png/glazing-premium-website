import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("подбор учитывает ответы, возврат и передает результат в задание", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Подобрать решение", exact: true })
    .click();
  await expect(page).toHaveURL(/#finder$/);
  const finder = page.locator("#finder");
  await expect(
    finder.getByRole("button", { name: "Продолжить" }),
  ).toBeDisabled();
  await finder.getByLabel("Частный дом", { exact: true }).check();
  await finder.getByRole("button", { name: "Продолжить" }).click();
  await finder.getByLabel("Круглый год", { exact: true }).check();
  await finder.getByRole("button", { name: "Назад", exact: true }).click();
  await expect(finder.getByLabel("Частный дом", { exact: true })).toBeChecked();
  await page.reload();
  await expect(finder.getByLabel("Частный дом", { exact: true })).toBeChecked();
  await finder.getByRole("button", { name: "Продолжить" }).click();
  await expect(finder.getByLabel("Круглый год", { exact: true })).toBeChecked();
  await finder.getByRole("button", { name: "Продолжить" }).click();
  await finder.getByLabel("Больше света", { exact: true }).check();
  await finder.getByRole("button", { name: "Показать решения" }).click();
  await expect(
    finder.getByRole("heading", { name: "С чего можно начать" }),
  ).toBeFocused();
  await expect(
    finder.getByRole("button", { name: "Панорамное остекление", exact: true }),
  ).toBeVisible();
  await expect(finder.getByText(/утепление всего контура/)).toBeVisible();
  await finder.getByRole("button", { name: "В задание", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Ваш объект")).toHaveValue("Частный дом");
  await expect(dialog.getByLabel("Что для вас важно?")).toHaveValue(
    /Больше света/,
  );
  await page.keyboard.press("Escape");
  await finder
    .getByRole("button", { name: "Удалить ответы и начать заново" })
    .click();
  await expect(
    finder.getByRole("button", { name: "Продолжить" }),
  ).toBeDisabled();
});

test("избранное переживает перезагрузку, сравнение ограничено тремя и попадает в файл", async ({
  page,
}) => {
  await page.goto("/");
  const catalog = page.locator("#services");
  const save = catalog.getByRole("button", { name: /^Сохранить:/ });
  for (let i = 0; i < 4; i++) await save.first().click();
  await page.reload();
  await expect(
    catalog.getByRole("button", { name: /^Сохранено. Убрать из избранного:/ }),
  ).toHaveCount(4);
  await catalog.getByRole("button", { name: /Избранное и сравнение/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("checkbox", { checked: true })).toHaveCount(3);
  await expect(dialog.getByRole("checkbox", { checked: false })).toBeDisabled();
  await dialog.getByRole("checkbox").first().uncheck();
  await expect(dialog.getByRole("checkbox").last()).toBeEnabled();
  await dialog.getByRole("checkbox").last().check();
  await expect(dialog.getByRole("table")).toContainText("Террасы и веранды");
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await dialog
    .getByRole("button", { name: "Включить избранное в задание" })
    .click();
  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Скачать задание" }).click();
  const file = await (await downloadPromise).path();
  expect(await readFile(file!, "utf8")).toContain(
    "Избранные решения: Панорамное остекление; Остекление балконов; Остекление коттеджей; Остекление террас",
  );
  await page.keyboard.press("Escape");
  await catalog.getByRole("button", { name: /Избранное и сравнение/ }).click();
  for (let i = 0; i < 4; i++)
    await dialog
      .getByRole("button", { name: /^Удалить:/ })
      .first()
      .click();
  await expect(dialog.getByText(/Пока здесь пусто/)).toBeVisible();
});

test("галерея листается с клавиатуры и свайпом, возвращает фокус и открывает решение", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: /Дом, открытый природе.*Открыть изображение/,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await page.keyboard.press("ArrowRight");
  await expect(
    dialog.getByRole("heading", { name: "Граница становится невидимой" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Предыдущее изображение" }).click();
  await expect(dialog.getByRole("status")).toHaveText("1 / 4");
  if (isMobile) {
    const image = dialog.locator(".gallery-full-image");
    await image.evaluate((el) => {
      const start = new Touch({
        identifier: 1,
        target: el,
        clientX: 270,
        clientY: 150,
      });
      const end = new Touch({
        identifier: 1,
        target: el,
        clientX: 80,
        clientY: 155,
      });
      el.dispatchEvent(
        new TouchEvent("touchstart", {
          bubbles: true,
          changedTouches: [start],
        }),
      );
      el.dispatchEvent(
        new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }),
      );
    });
    await expect(dialog.getByRole("status")).toHaveText("2 / 4");
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("button", { name: "Изучить похожее решение" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Остекление коттеджей", exact: true }),
  ).toBeVisible();
});

test("черновик восстанавливается, ручное копирование доступно без Clipboard API", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
      configurable: true,
    }),
  );
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Подготовить задание на расчет",
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Ширина проема, мм").fill("2400");
  await dialog.getByLabel("Что для вас важно?").fill("Вид на сад");
  await page.keyboard.press("Escape");
  await page.reload();
  await trigger.click();
  await expect(dialog.getByLabel("Ширина проема, мм")).toHaveValue("2400");
  await expect(dialog.getByLabel("Что для вас важно?")).toHaveValue(
    "Вид на сад",
  );
  await dialog.getByRole("button", { name: "Копировать текст" }).click();
  await expect(dialog.getByRole("status")).toContainText(
    "Копирование недоступно",
  );
  await dialog.getByText("Текст задания", { exact: true }).click();
  await expect(
    dialog.getByLabel("Текст задания для ручного копирования"),
  ).toHaveValue(/Вид на сад/);
  await dialog.getByRole("button", { name: "Очистить черновик" }).click();
  await expect(dialog.getByLabel("Ширина проема, мм")).toHaveValue("");
  await page.reload();
  await trigger.click();
  await expect(dialog.getByLabel("Что для вас важно?")).toHaveValue("");
});

test("блокировка хранилищ и поврежденные данные не ломают подбор и избранное", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("prosvet:saved:v1", '["unknown"]');
    sessionStorage.setItem("prosvet:quiz:v1", "{broken");
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
  });
  await page.goto("/");
  await page
    .locator("#services")
    .getByRole("button", { name: /^Сохранить:/ })
    .first()
    .click();
  await expect(
    page
      .locator("#services")
      .getByRole("button", { name: /^Сохранено. Убрать из избранного:/ }),
  ).toHaveCount(1);
  await page.locator("#finder").getByLabel("Квартира", { exact: true }).check();
  await expect(
    page.locator("#finder").getByRole("button", { name: "Продолжить" }),
  ).toBeEnabled();
});

test("слои окна и мобильные действия доступны, reduced motion отключает движение", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator("#details");
  await section.getByRole("button", { name: "Посмотреть по слоям" }).click();
  await expect(
    section.getByRole("button", { name: "Собрать конструкцию" }),
  ).toHaveAttribute("aria-pressed", "true");
  await section.getByRole("button", { name: /Примыкание/ }).click();
  await expect(
    section.getByRole("heading", { name: "Связь с архитектурой" }),
  ).toBeVisible();
  expect(
    await section
      .locator(".layer-frame")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  if (isMobile) {
    await page
      .getByRole("navigation", { name: "Быстрые действия" })
      .getByRole("link", { name: "Подобрать остекление" })
      .click();
    await expect(page).toHaveURL(/#finder$/);
  }
});

test("переполненное хранилище и поврежденный черновик обрабатываются безопасно", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("prosvet:saved:v1", '["balcony-glazing"]');
    sessionStorage.setItem("prosvet:brief:v1", "{broken");
    sessionStorage.setItem(
      "prosvet:quiz:v1",
      '{"object":"unknown","season":"","priority":""}',
    );
    Storage.prototype.setItem = () => {
      throw new DOMException("quota", "QuotaExceededError");
    };
  });
  await page.goto("/");
  await page
    .locator("#services")
    .getByRole("button", {
      name: "Сохранить: Панорамное остекление",
      exact: true,
    })
    .click();
  await expect(
    page
      .locator("#services")
      .getByRole("button", { name: /^Сохранено. Убрать из избранного:/ }),
  ).toHaveCount(2);
  await page.locator("#finder").getByLabel("Квартира", { exact: true }).check();
  await expect(
    page.locator("#finder").getByRole("button", { name: "Продолжить" }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Подготовить задание на расчет" })
    .click();
  await expect(page.getByRole("dialog").getByLabel("Ваш объект")).toHaveValue(
    "Частный дом",
  );
});
