import type { Metadata } from "next";
import { Figtree, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "./_components/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["luxury fashion", "bags", "clothing", "boutique", "FolaLuxe"],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
    locale: "en_NG",
    type: "website",
    // Default share image for pages without their own (home, about, shop list).
    // Product pages override this via their colocated opengraph-image route.
    images: [
      {
        url: "/ogimage.png",
        width: 1348,
        height: 650,
        alt: siteConfig.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.twitter,
    images: ["/ogimage.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        figtree.variable,
        cormorant.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>{children}</CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
