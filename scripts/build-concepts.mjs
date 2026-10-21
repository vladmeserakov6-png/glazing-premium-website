import { mkdir, writeFile, copyFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { createRequire } from "node:module";
import { concepts } from "../design-lab/concepts.mjs";
import { renderConcept, renderGallery } from "../design-lab/render.mjs";
const require = createRequire(import.meta.url);
const { services, faqs } = require("../src/content/site.ts");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "public/concepts");
await mkdir(join(output, "assets/fonts"), { recursive: true });
await mkdir(join(output, "assets/media"), { recursive: true });
await mkdir(join(output, "assets/previews"), { recursive: true });
for (const c of concepts) {
  await mkdir(join(output, c.id), { recursive: true });
  await writeFile(
    join(output, c.id, "index.html"),
    renderConcept(c, services, faqs),
  );
}
await writeFile(join(output, "index.html"), renderGallery());
for (const name of [
  "concepts.css",
  "interaction.js",
  "gallery.css",
  "gallery.js",
]) {
  await copyFile(join(root, "design-lab", name), join(output, "assets", name));
}
for (const file of await readdir(
  join(root, "node_modules/@fontsource-variable/manrope/files"),
)) {
  if (
    [
      "manrope-cyrillic-wght-normal.woff2",
      "manrope-latin-wght-normal.woff2",
    ].includes(file)
  ) {
    await copyFile(
      join(root, "node_modules/@fontsource-variable/manrope/files", file),
      join(output, "assets/fonts", file),
    );
  }
}
await copyFile(
  join(root, "node_modules/@fontsource-variable/manrope/LICENSE"),
  join(output, "assets/fonts/Manrope-LICENSE.txt"),
);
await copyFile(
  join(root, "src/app/icon.svg"),
  join(output, "assets/favicon.svg"),
);
for (const name of ["architecture", "interior", "terrace", "balcony"]) {
  await copyFile(
    join(root, "public/images", `${name}.webp`),
    join(output, "assets/media", `${name}.webp`),
  );
}
console.log(
  `Собрано полных концепций: ${concepts.length}. Галерея: public/concepts/index.html`,
);
