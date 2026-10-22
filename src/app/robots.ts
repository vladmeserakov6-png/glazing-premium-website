import type { MetadataRoute } from "next";
export const dynamic = "force-static";

// The design concept stays out of search until company data and a production domain are approved.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
