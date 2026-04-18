import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export default function CategoryTiles() {
  return (
    <section className="section-padding py-20 max-w-7xl mx-auto w-full  px-6 md:px-0">
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--brand-muted)] mb-3">
          What we offer
        </p>
        <h2
          className="text-4xl sm:text-5xl text-[var(--brand-dark)]"
          style={{
            fontFamily: "var(--font-heading), Georgia, serif",
            fontWeight: 500,
          }}
        >
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Bags Tile */}
        <Link
          href="/shop?category=bags"
          id="category-bags"
          className="group relative rounded-3xl overflow-hidden aspect-[5/4] sm:aspect-[4/3] lg:aspect-[5/4]"
        >
          <Image
            src="/bags-category.png"
            alt="FolaLuxe bag collection"
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 md:mb-2 mb-0">
              Collection
            </p>
            <h3
              className="text-4xl text-white md:mb-3 mb-0"
              style={{
                fontFamily: "var(--font-heading), Georgia, serif",
                fontWeight: 500,
              }}
            >
              Bags
            </h3>
            <span className="inline-flex items-center gap-2 text-sm text-white/80 group-hover:text-white transition-colors">
              From {formatPrice(18000)}
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
            </span>
          </div>
        </Link>

        {/* Clothing Tile */}
        <Link
          href="/shop?category=clothing"
          id="category-clothing"
          className="group relative rounded-3xl overflow-hidden aspect-[5/4] sm:aspect-[4/3] lg:aspect-[5/4]"
        >
          <Image
            src="/clothing-category.png"
            alt="FolaLuxe clothing collection"
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 md:mb-2 mb-0">
              Collection
            </p>
            <h3
              className="text-4xl text-white md:mb-3 mb-0"
              style={{
                fontFamily: "var(--font-heading), Georgia, serif",
                fontWeight: 500,
              }}
            >
              Clothing
            </h3>
            <span className="inline-flex items-center gap-2 text-sm text-white/80 group-hover:text-white transition-colors">
              From {formatPrice(19000)}
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

