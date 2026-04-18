"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import { products, ProductCategory } from "@/lib/products";
import ProductCard from "../_components/ProductCard";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";

type SortKey = "featured" | "price-asc" | "price-desc" | "a-z";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as ProductCategory | null;
  const filterParam = searchParams.get("filter");

  const [activeCategory, setActiveCategory] = useState<"all" | ProductCategory>(
    categoryParam ?? "all",
  );
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (filterParam === "new") {
      result = result.filter((p) => p.badge === "New In");
    }
    if (filterParam === "sale") {
      result = result.filter((p) => p.originalPrice !== undefined);
    }
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [activeCategory, sortBy, filterParam]);

  const categories: {
    key: "all" | ProductCategory;
    label: string;
    count: number;
  }[] = [
    { key: "all", label: "All", count: products.length },
    {
      key: "bags",
      label: "Bags",
      count: products.filter((p) => p.category === "bags").length,
    },
    {
      key: "clothing",
      label: "Clothing",
      count: products.filter((p) => p.category === "clothing").length,
    },
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
                  <span
                    className={`ml-1.5 text-xs ${activeCategory === cat.key ? "text-white/70" : "text-[var(--brand-muted)]"}`}
                  >
                    ({cat.count})
                  </span>
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
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="a-z">Name: A–Z</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-(--brand-muted) mb-6">
            Showing {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-heading text-2xl text-(--brand-dark) mb-2">
                Nothing here yet
              </p>
              <p className="text-(--brand-muted)">
                Try a different filter or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
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
