import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { concepts } from "../design-lab/concepts.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const base = process.env.CONCEPTS_BASE_URL ?? "http://127.0.0.1:3000/concepts/";
const output = join(root, "docs/design-exploration/previews");
const thumbnails = join(root, "public/concepts/assets/previews");
await mkdir(output, { recursive: true });
await mkdir(thumbnails, { recursive: true });

const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const browser = await chromium.launch({ executablePath });
try {
  for (const concept of concepts) {
    for (const [mode, viewport] of [
      ["desktop", { width: 1440, height: 1080 }],
      ["mobile", { width: 390, height: 844 }],
    ]) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const response = await page.goto(
        new URL(`${concept.id}/index.html`, base).href,
      );
      if (!response.ok())
        throw new Error(`Concept ${concept.id}: HTTP ${response.status()}`);
      await page.evaluate(() => document.fonts.ready);
      // Native async decoding can finish after the load event. Wait before capturing thumbnails.
      await page
        .locator(".hero img")
        .evaluateAll((images) =>
          Promise.all(images.map((image) => image.decode())),
        );
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      if (mode === "desktop") {
        await sharp(await page.screenshot())
          .resize(960, 720)
          .webp({ quality: 83 })
          .toFile(join(thumbnails, `${concept.id}.webp`));
      }
      const height = await page.evaluate(() => document.body.scrollHeight);
      for (let position = 0; position < height; position += 800) {
        await page.evaluate((y) => window.scrollTo(0, y), position);
        await page.waitForTimeout(35);
      }
      await page
        .locator("main img:visible")
        .evaluateAll((images) =>
          Promise.all(images.map((image) => image.decode())),
        );
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        return document.fonts.ready;
      });
      await sharp(await page.screenshot({ fullPage: true }))
        .webp({ quality: 82 })
        .toFile(join(output, `${concept.id}-${mode}.webp`));
      console.log(`${concept.id} / ${mode}: complete page captured`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
