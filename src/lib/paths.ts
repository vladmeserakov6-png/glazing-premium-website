// Next/Image does not add basePath to public asset URLs automatically.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const assetPath = (path: string) => `${basePath}${path}`;
export const homeAnchor = (hash: string) => `${basePath}/${hash}`;
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://vladmeserakov6-png.github.io/glazing-premium-website";
