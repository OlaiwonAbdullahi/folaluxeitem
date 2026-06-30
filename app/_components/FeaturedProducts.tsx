"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Product, api } from "@/lib/api";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.getFeaturedProducts();
        setProducts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

        {error && (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            !error && (
              <div className="col-span-4 text-center py-12 text-[var(--brand-muted)]">
                No featured products found
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
