import type { Metadata } from "next";
import { Figtree, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "./_components/CartContext";
import { Toaster } from "@/components/ui/sonner";

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
  title: "FolaLuxe — Premium Fashion Boutique",
  description:
    "Shop curated luxury clothing and designer bags at FolaLuxe. Elevate your wardrobe with our handpicked collection of premium fashion pieces.",
  keywords: ["luxury fashion", "bags", "clothing", "boutique", "FolaLuxe"],
  openGraph: {
    title: "FolaLuxe — Premium Fashion Boutique",
    description: "Curated luxury clothing and designer bags.",
    siteName: "FolaLuxe",
    type: "website",
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
