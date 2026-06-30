// Central place for site-wide SEO constants. `url` is the canonical origin used
// for metadataBase, sitemap, robots and absolute OG image URLs. APP_URL is the
// server-side deployment origin (see .env); NEXT_PUBLIC_SITE_URL is exposed if a
// client ever needs it. Falls back to localhost for local dev.
const rawUrl =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export const siteConfig = {
  name: "FolaLuxe",
  title: "FolaLuxe — Premium Fashion Boutique",
  description:
    "Shop curated luxury clothing and designer bags at FolaLuxe. Elevate your wardrobe with our handpicked collection of premium fashion pieces.",
  // Normalise away any trailing slash so we can safely append paths.
  url: rawUrl.replace(/\/$/, ""),
  ogImageAlt: "FolaLuxe — Premium Fashion Boutique",
  twitter: "@folaluxeitems",
} as const;

export function absoluteUrl(path = ""): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
