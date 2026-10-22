import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/glazing-premium-website/upgrade";
if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath)) {
  throw new Error(
    "NEXT_PUBLIC_BASE_PATH: нужен путь без завершающего слеша, например /glazing-premium-website/upgrade",
  );
}
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  `https://vladmeserakov6-png.github.io${basePath}`;
mkdirSync("public/images/responsive", { recursive: true });
await Promise.all(
  ["architecture", "interior", "balcony", "terrace"].flatMap((name) =>
    [480, 768, 1200, 1920].map((width) =>
      sharp(`public/images/${name}.webp`)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(`public/images/responsive/${name}-${width}.webp`),
    ),
  ),
);
const result = spawnSync(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "1",
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_PUBLIC_SITE_URL: siteUrl,
    },
  },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync("out/.nojekyll", "");
console.log(
  `Статический предпросмотр готов: out${basePath ? ` → ${basePath}/` : "/"}`,
);
