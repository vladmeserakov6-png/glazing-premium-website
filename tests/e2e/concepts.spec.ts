import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.use({
  baseURL: process.env.CONCEPTS_TEST_BASE_URL ?? "http://127.0.0.1:3000",
});

const ids = Array.from({ length: 10 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

for (const id of ids) {
  test(`концепция ${id}: полная страница, каталог, подбор, задание и клавиатура`, async ({
    page,
    isMobile,
  }) => {
    const errors: string[] = [];
    const posts: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });
    const response = await page.goto(`/concepts/${id}/index.html`);
    expect(response?.ok()).toBe(true);
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("footer")).toContainText("рабочее название");
    const missing = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href")!.slice(1))
          .filter((target) => !document.getElementById(target)),
      );
    expect(missing).toEqual([]);
    await expect(page.locator(".service-card:visible")).toHaveCount(4);
    await page.getByRole("button", { name: /Показать все 8 решений/ }).click();
    await expect(page.locator(".service-card:visible")).toHaveCount(8);
    await page.getByRole("button", { name: "Квартира", exact: true }).click();
    await expect(page.locator(".service-card:visible")).toHaveCount(3);
    const trigger = page.getByRole("button", {
      name: "Подробнее: Пластиковые окна",
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "Пластиковые окна", exact: true }),
    ).toBeVisible();
    await dialog
      .getByRole("button", { name: "Подготовить задание", exact: true })
      .click();
    await expect(
      dialog.getByRole("combobox", { name: "Решение", exact: true }),
    ).toHaveValue("plastic-windows");
    await dialog.getByLabel("Ширина проема, мм").fill("99");
    await dialog
      .getByRole("button", { name: "Скачать задание", exact: true })
      .click();
    await expect(dialog.getByRole("status")).toContainText("от 100 до 50 000");
    await dialog.getByLabel("Ширина проема, мм").fill("2400");
    await dialog.getByLabel("Высота проема, мм").fill("2600");
    await dialog.getByLabel("Ваши пожелания").fill("Вид на сад");
    const downloadPromise = page.waitForEvent("download");
    await dialog
      .getByRole("button", { name: "Скачать задание", exact: true })
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(
      `Задание-на-остекление-${id}.txt`,
    );
    const content = await readFile((await download.path())!, "utf8");
    expect(content).toContain("2400 мм");
    expect(content).toContain("Вид на сад");
    expect(content).toContain("Пластиковые окна");
    expect(content).toContain("Заявка не отправлена");
    await dialog.getByRole("button", { name: "Закрыть окно" }).focus();
    await page.keyboard.press("Shift+Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();

    const picker = page.locator(".picker-form");
    await picker.getByLabel("Частный дом", { exact: true }).check();
    await picker.getByLabel("Свет и открытый вид", { exact: true }).check();
    await picker.getByRole("button", { name: "Подобрать направление" }).click();
    await expect(picker.getByRole("status")).toContainText(
      "Панорамное остекление",
    );
    await picker
      .getByRole("button", { name: "Подготовить задание", exact: true })
      .click();
    await expect(
      dialog.getByRole("combobox", { name: "Решение", exact: true }),
    ).toHaveValue("panoramic-glazing");
    await expect(
      dialog.getByRole("combobox", { name: "Ваш объект", exact: true }),
    ).toHaveValue("Частный дом");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    const summary = page.locator(".faq-list summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq-list details").first()).toHaveAttribute(
      "open",
      "",
    );
    if (isMobile) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page
        .getByRole("button", { name: "Открыть меню", exact: true })
        .click();
      const navigation = page.getByRole("navigation", {
        name: "Навигация по странице",
      });
      await expect(navigation).toBeVisible();
      await navigation
        .getByRole("link", { name: "Подход", exact: true })
        .click();
      await expect(navigation).not.toBeVisible();
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const favorite = page.locator(".lab-favorite");
    await favorite.click();
    await expect(favorite).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(favorite).toHaveAttribute("aria-pressed", "true");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    expect(posts).toEqual([]);
  });

  test(`концепция ${id}: изображения, reflow и аудит WCAG AA`, async ({
    page,
  }) => {
    await page.goto(`/concepts/${id}/index.html`);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("button", { name: /Показать все 8 решений/ }).click();
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 800) {
      await page.evaluate((position) => window.scrollTo(0, position), y);
      await page.waitForTimeout(30);
    }
    await expect
      .poll(() =>
        page
          .locator("main img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    const home = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      home.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `концепция ${id}, ширина ${width}`,
      ).toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page
      .getByRole("button", {
        name: "Подготовить задание на расчет",
        exact: true,
      })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const form = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      form.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
  });
}

test("галерея: десять страниц, изображения, избранное и переходы", async ({
  page,
}) => {
  await page.goto("/concepts/index.html");
  await expect(page.locator(".concept-preview")).toHaveCount(10);
  const galleryHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < galleryHeight; y += 800) {
    await page.evaluate((position) => window.scrollTo(0, position), y);
    await page.waitForTimeout(30);
  }
  await expect
    .poll(() =>
      page
        .locator(".concept-thumbnail img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    accessibility.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
  await page.locator('[data-favorite="03"]').click();
  await page.locator('[data-favorite="09"]').click();
  await page.getByRole("button", { name: /Только понравившиеся/ }).click();
  await expect(page.locator(".concept-preview:visible")).toHaveCount(2);
  await page.locator('[data-id="03"] .concept-palette a').click();
  await expect(page).toHaveURL(/\/concepts\/03\/index.html$/);
  await expect(page.locator(".lab-favorite")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("link", { name: "Все 10 вариантов" }).click();
  await expect(page.locator(".concept-preview")).toHaveCount(10);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
