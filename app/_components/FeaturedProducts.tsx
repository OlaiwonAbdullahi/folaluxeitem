import Link from "next/link";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/products";

type FeaturedProductsProps = {
  products: Product[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section-padding py-20 px-6 md:px-0 bg-[var(--brand-blush)]/60 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--brand-muted)] mb-3">
              Handpicked
            </p>
            <h2
              className="text-4xl sm:text-5xl text-[var(--brand-dark)]"
              style={{
                fontFamily: "var(--font-heading), Georgia, serif",
                fontWeight: 500,
              }}
            >
              Fan Favourites
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm text-[var(--brand-rose)] underline underline-offset-4 hover:text-[var(--brand-pink)] transition-colors whitespace-nowrap"
          >
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
