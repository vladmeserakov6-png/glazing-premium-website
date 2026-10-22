import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.STATIC_EXPORT === "1"
    ? { output: "export", trailingSlash: true }
    : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    ...(process.env.STATIC_EXPORT === "1"
      ? {
          loader: "custom" as const,
          loaderFile: "./src/lib/static-image-loader.ts",
        }
      : {}),
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
};

export default nextConfig;
