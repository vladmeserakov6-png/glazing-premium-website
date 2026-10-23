import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

export function serveExport({
  port = 4183,
  basePath = "/glazing-premium-website",
  root = resolve("out"),
} = {}) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml",
  };
  const server = createServer(async (request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405).end();
      return;
    }
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      if (basePath && pathname === "/") {
        response.writeHead(302, { Location: `${basePath}/` }).end();
        return;
      }
      if (
        basePath &&
        pathname !== basePath &&
        !pathname.startsWith(`${basePath}/`)
      ) {
        response.writeHead(404).end();
        return;
      }
      let file = resolve(root, `.${pathname.slice(basePath.length) || "/"}`);
      if (file !== root && !file.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      try {
        if ((await stat(file)).isDirectory())
          file = resolve(file, "index.html");
      } catch {
        response
          .writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
          .end(await readFile(resolve(root, "404.html")));
        return;
      }
      let content = await readFile(file);
      const compress =
        /\bgzip\b/.test(request.headers["accept-encoding"] ?? "") &&
        /\.(html|js|css|json|svg|xml|txt)$/.test(file);
      if (compress) content = gzipSync(content);
      response.writeHead(200, {
        "Content-Type": types[extname(file)] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Content-Length": content.length,
        Vary: "Accept-Encoding",
        ...(compress ? { "Content-Encoding": "gzip" } : {}),
        "X-Content-Type-Options": "nosniff",
      });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch {
      response.writeHead(400).end();
    }
  });
  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolveServer(server));
  });
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const basePath =
    process.env.NEXT_PUBLIC_BASE_PATH ?? "/glazing-premium-website";
  const port = Number(process.env.PREVIEW_PORT ?? 4183);
  await serveExport({ basePath, port });
  console.log(`Статический предпросмотр: http://127.0.0.1:${port}${basePath}/`);
}
