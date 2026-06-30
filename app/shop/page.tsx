/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { Product, api } from "@/lib/api";
import ProductCard from "../_components/ProductCard";
import ProductCardSkeleton from "../_components/ProductCardSkeleton";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons";

type SortKey = "newest" | "price_asc" | "price_desc" | "rating";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const filterParam = searchParams.get("filter");

  const [activeCategory, setActiveCategory] = useState<"all" | string>(
    categoryParam ?? "all",
  );
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        sort: sortBy,
      };

      if (activeCategory !== "all") {
        params.category = activeCategory;
      }

      if (filterParam === "new") {
        params.newArrival = true;
      } else if (filterParam === "sale") {
        // Note: API doesn't have a sale filter yet, we can handle locally
      }

      const response = await api.getProducts(params);
      setProducts(response.data.products);
      setTotalCount(response.data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, sortBy, filterParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories: {
    key: "all" | string;
    label: string;
  }[] = [
    { key: "all", label: "All" },
    { key: "bags", label: "Bags" },
    { key: "clothing", label: "Clothing" },
    { key: "accessories", label: "Accessories" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 min-h-screen">
        {/* Page Header */}
        <div className="pt-28 pb-12 px-6 md:px-0 section-padding bg-[var(--brand-blush)]/50 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--brand-muted)] mb-3">
            Browse
          </p>
          <h1
            className="text-5xl sm:text-6xl text-[var(--brand-dark)]"
            style={{
              fontFamily: "var(--font-heading), Georgia, serif",
              fontWeight: 500,
            }}
          >
            The Collection
          </h1>
          <p className="text-[var(--brand-muted)] mt-4 text-base max-w-md mx-auto">
            Every piece is picked with intention. Quality you can see, style you
            can feel.
          </p>
        </div>

        <div className="section-padding max-w-7xl mx-auto w-full py-10 px-6 md:px-0">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  id={`filter-${cat.key}`}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`md:px-5 md:py-2 px-3 py-1  rounded-full md:text-sm text-xs font-medium transition-all duration-200 ${
                    activeCategory === cat.key
                      ? "bg-(--brand-rose) text-white shadow-md shadow-pink-200"
                      : "bg-white border border-[var(--border)] text-[var(--brand-text)] hover:border-[var(--brand-rose)] hover:text-[var(--brand-rose)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="shop-sort"
                className="text-sm text-(--brand-muted) whitespace-nowrap"
              >
                Sort by:
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="text-sm border border-border rounded-full md:px-4 md:py-2 px-2 py-1 bg-white text-(--brand-dark) focus:outline-none focus:border-(--brand-rose) cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-center py-12 text-red-500">{error}</div>
          )}

          {/* Results count */}
          <p className="text-sm text-(--brand-muted) mb-6">
            Showing {products.length} {products.length === 1 ? "item" : "items"}
          </p>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[var(--brand-blush)] flex items-center justify-center">
                <HugeiconsIcon
                  icon={ShoppingBag01Icon}
                  size={40}
                  className="text-[var(--brand-rose)]"
                />
              </div>
              <div>
                <p className="font-heading text-2xl text-(--brand-dark) mb-2">
                  Nothing here yet
                </p>
                <p className="text-(--brand-muted)">
                  Try a different filter or category.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--brand-rose)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
