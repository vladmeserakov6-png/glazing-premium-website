import { strict as assert } from "node:assert";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { serveExport } from "./serve-export.mjs";

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/glazing-premium-website";
const server = await serveExport({ basePath });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
});
const report = [];
await mkdir("/tmp/tahion-review", { recursive: true });
try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport,
      hasTouch: viewport.width < 500,
    });
    const page = await context.newPage();
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        failures.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`http://127.0.0.1:4183${basePath}/`);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: /Все услуги/ }).click();
    await page
      .getByRole("button", { name: "Больше архитектурных идей" })
      .click();
    for (const image of await page.locator("main img:visible").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((el) => el.decode());
    }
    assert.equal(await page.locator("main img:visible").count(), 15);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.locator("header").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `/tmp/tahion-review/${viewport.width}.png`,
      fullPage: true,
    });
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    assert.deepEqual(audit.violations, []);
    const labels = await new AxeBuilder({ page })
      .withRules(["label-content-name-mismatch"])
      .analyze();
    assert.deepEqual(labels.violations, []);
    await page
      .locator("#services")
      .getByRole("button", { name: /^Сохранить:/ })
      .first()
      .click();
    await page
      .locator("#services")
      .getByRole("button", { name: /Избранное и сравнение/ })
      .click();
    assert.equal(
      await page
        .getByRole("dialog")
        .getByRole("checkbox", { checked: true })
        .count(),
      1,
    );
    await page.keyboard.press("Escape");
    const finder = page.locator("#finder");
    await finder.getByLabel("Терраса или веранда", { exact: true }).check();
    await finder.getByRole("button", { name: "Продолжить" }).click();
    await finder.getByLabel("В теплое время", { exact: true }).check();
    await finder.getByRole("button", { name: "Продолжить" }).click();
    await finder.getByLabel("Выход в сад", { exact: true }).check();
    await finder.getByRole("button", { name: "Показать решения" }).click();
    await finder
      .getByRole("button", { name: "В задание", exact: true })
      .click();
    assert.equal(
      await page.getByRole("dialog").getByLabel("Ваш объект").inputValue(),
      "Терраса или веранда",
    );
    const download = page.waitForEvent("download");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Скачать задание" })
      .click();
    assert.equal(
      (await download).suggestedFilename(),
      "Задание-на-остекление.txt",
    );
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", {
        name: /Дом, открытый природе.*Открыть изображение/,
      })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Следующее изображение" })
      .click();
    assert.equal(
      await page.getByRole("dialog").getByRole("status").innerText(),
      "2 / 4",
    );
    await page
      .getByRole("dialog")
      .locator("img")
      .evaluate((el) => el.decode());
    await page.keyboard.press("Escape");
    assert.deepEqual(failures, []);
    report.push({
      viewport,
      images: 15,
      errors: failures,
      axeViolations: 0,
      flows: ["catalog", "selection", "quiz", "download", "gallery"],
    });
    await context.close();
  }
  const robots = await (
    await fetch(`http://127.0.0.1:4183${basePath}/robots.txt`)
  ).text();
  assert.match(robots, /Disallow: \//);
  const sitemap = await (
    await fetch(`http://127.0.0.1:4183${basePath}/sitemap.xml`)
  ).text();
  assert.ok(sitemap.includes(`${basePath}/`));
  await writeFile(
    "/tmp/tahion-review/static-check.json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    "Статический экспорт: desktop/mobile, все изображения, пути, axe и основные сценарии — OK.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
