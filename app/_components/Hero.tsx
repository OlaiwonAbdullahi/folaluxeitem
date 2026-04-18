import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-banner.png"
          alt="FolaLuxe fashion editorial — woman in blush pink dress with luxury bag"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 section-padding max-w-7xl mx-auto w-full pt-32 pb-20 px-6 md:px-0">
        <div className="max-w-xl">
          <p className="text-[11px] tracking-[0.35em] uppercase text-white/70 mb-4 animate-fade-in">
            New Collection — {new Date().getFullYear()}
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-white mb-6 animate-slide-up"
            style={{
              fontFamily: "var(--font-heading), Georgia, serif",
              fontWeight: 500,
            }}
          >
            Style like
            <br />
            <em className="italic" style={{ color: "#f4aac7" }}>
              you mean it.
            </em>
          </h1>
          <p className="text-white/75 text-md sm:text-xl leading-relaxed mb-8 max-w-md animate-slide-up-delay-1">
            Premium bags and clothing for women who move with intention. As seen
            on <span className="text-white font-medium">@folaluxeitems</span>.
          </p>
          <div className="flex flex-wrap gap-3 animate-slide-up-delay-2">
            <Link
              href="/shop"
              id="hero-shop-now"
              className="md:px-8 px-4 md:py-3.5 py-2 text-sm md:text-lg flex items-center bg-[var(--brand-rose)] text-white rounded-full font-medium tracking-wide hover:bg-[#c9617f] transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/20"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?category=bags"
              className="md:px-8 px-4 md:py-3.5 py-2 text-sm md:text-lg flex items-center bg-white/15 backdrop-blur-sm text-white border border-white/30 rounded-full font-medium hover:bg-white/25 transition-colors"
            >
              Explore Bags
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-[10px] tracking-widest uppercase animate-fade-in">
        <span>Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
