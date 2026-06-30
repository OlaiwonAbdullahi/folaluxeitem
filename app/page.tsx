import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import Marquee from "./_components/Marquee";
import CategoryTiles from "./_components/CategoryTiles";
import FeaturedProducts from "./_components/FeaturedProducts";
import SocialProof from "./_components/SocialProof";
import BrandPillars from "./_components/BrandPillars";
import NewsletterSection from "./_components/NewsletterSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FolaLuxe — Premium Fashion Boutique",
  description:
    "Shop curated luxury clothing and bags at FolaLuxe. Elevate your wardrobe with our handpicked premium fashion pieces.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1">
        <Hero />
        <Marquee />
        <CategoryTiles />
        <FeaturedProducts />
        <SocialProof />
        <BrandPillars />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
