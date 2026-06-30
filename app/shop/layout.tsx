import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full FolaLuxe collection — luxury clothing, designer bags and accessories, handpicked for the modern wardrobe.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop — FolaLuxe",
    description:
      "Browse the full FolaLuxe collection — luxury clothing, designer bags and accessories.",
    url: "/shop",
    type: "website",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
