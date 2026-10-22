import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("главная загружается без ошибок, все якоря ведут в существующие разделы", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/ПРОСВЕТ/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Современноеостекление длявашего комфорта.",
  );
  const missingAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute("href")!.slice(1))
        .filter((id) => !document.getElementById(id)),
    );
  expect(missingAnchors).toEqual([]);
  await expect(page.locator(".service-card")).toHaveCount(4);
  expect(errors).toEqual([]);
});

test("каталог раскрывается, фильтруется и открывает выбранное решение", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Все решения по остеклению/ }).click();
  await expect(page.locator(".service-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Для квартиры", exact: true }).click();
  await expect(page.locator(".service-card")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "Для квартиры", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const card = page.getByRole("button", {
    name: "Подробнее: Пластиковые окна",
    exact: true,
  });
  await card.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Пластиковые окна" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Подготовить задание" }).click();
  await expect(dialog.getByLabel("Интересующее решение")).toHaveValue(
    "plastic-windows",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(card).toBeFocused();
});

test("задание проверяет размеры и скачивает выбранные параметры без отправки на сервер", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Подготовить задание на расчет" })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Ваш объект").selectOption("Квартира");
  await dialog
    .getByLabel("Интересующее решение")
    .selectOption("loggia-glazing");
  await dialog.getByLabel("Ширина проема, мм").fill("99");
  await dialog.getByRole("button", { name: "Скачать задание" }).click();
  await expect(
    dialog.getByText(
      "Укажите целое число от 100 до 50 000 мм или оставьте поле пустым",
    ),
  ).toBeVisible();
  await dialog.getByLabel("Ширина проема, мм").fill("2400");
  await dialog.getByLabel("Высота проема, мм").fill("2700");
  await dialog.getByLabel("Что для вас важно?").fill("Сохранить вид на парк");
  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Скачать задание" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Задание-на-остекление.txt");
  const file = await download.path();
  expect(file).toBeTruthy();
  const content = await readFile(file!, "utf8");
  expect(content).toContain("Остекление лоджий");
  expect(content).toContain("2400 мм");
  expect(content).toContain("2700 мм");
  expect(content).toContain("Сохранить вид на парк");
  expect(content).toContain("Заявка не отправлена");
  await expect(dialog.getByRole("status")).toContainText(
    "Заявка не отправлена",
  );
  expect(posts).toEqual([]);
});

test("FAQ раскрывается с клавиатуры", async ({ page }) => {
  await page.goto("/");
  const question = page.locator(".faq-item summary").first();
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".faq-item").first()).toHaveAttribute("open", "");
  await expect(page.locator(".faq-item").first().locator("p")).toBeVisible();
});

test("меню адаптируется к ширине экрана и закрывается после перехода", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    const toggle = page.getByRole("button", { name: "Открыть меню" });
    await toggle.click();
    const navigation = page.getByRole("navigation", {
      name: "Мобильная навигация",
    });
    await expect(navigation).toBeVisible();
    await navigation.getByRole("link", { name: "Наш подход" }).click();
    await expect(navigation).not.toBeVisible();
    await expect(page).toHaveURL(/#approach$/);
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(navigation).not.toBeVisible();
    await expect(toggle).toBeFocused();
  } else {
    await expect(
      page.getByRole("navigation", { name: "Основная навигация" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Открыть меню" }),
    ).not.toBeVisible();
  }
});

test("диалог удерживает фокус, закрывается по Escape и возвращает фокус", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Подготовить задание на расчет",
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("нет горизонтального скролла: reflow от 320 до 1440 CSS-пикселей", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `ширина ${width}`,
    ).toBe(true);
  }
  // A 320 CSS-pixel viewport also represents 400% browser zoom on a 1280px display.
  // CSS `body { zoom: 2 }` is not browser zoom: it leaves media queries unchanged.
});

test("доступность главной и формы: WCAG 2.2 AA", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator("header").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const home = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(home.violations).toEqual([]);
  await page
    .getByRole("button", { name: "Подготовить задание на расчет" })
    .click();
  const form = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(form.violations).toEqual([]);
});

test("локальные изображения отдаются, черновик закрыт от индексации", async ({
  request,
}) => {
  for (const name of ["architecture", "interior", "balcony", "terrace"]) {
    const response = await request.get(`/images/${name}.webp`);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
  }
  const optimizedHero = await request.get(
    "/_next/image?url=%2Fimages%2Farchitecture.webp&w=1920&q=85",
  );
  expect(optimizedHero.ok()).toBe(true);
  expect(optimizedHero.headers()["content-type"]).toMatch(/^image\//);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
  const missing = await request.get("/does-not-exist");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("На главную");
});

test("навигация на странице 404 возвращает к разделам главной", async ({
  page,
}) => {
  await page.goto("/does-not-exist");
  await page
    .locator("footer")
    .getByRole("link", { name: "Решения", exact: true })
    .click();
  await expect(page).toHaveURL(/\/#services$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
