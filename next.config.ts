import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 85] },
};

export default nextConfig;
