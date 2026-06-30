import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products-data";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${siteConfig.url}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProductSlugs();
    productRoutes = products
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${siteConfig.url}/shop/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch {
    // If the DB is unreachable at request time, still serve the static routes.
  }

  return [...staticRoutes, ...productRoutes];
}
