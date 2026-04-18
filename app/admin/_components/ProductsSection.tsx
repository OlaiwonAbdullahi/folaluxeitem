"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { products, formatPrice } from "@/lib/products";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Link01Icon,
  ShoppingBag01Icon,
  TShirtIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

const SearchIcon = () => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
    <HugeiconsIcon icon={Search01Icon} size={18} />
  </div>
);

export default function ProductsSection() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon />
          <input
            id="admin-product-search"
            type="text"
            placeholder="Search products by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
              categoryFilter === "all"
                ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                categoryFilter === cat
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <p className="text-zinc-400 text-sm">No products found matching your criteria.</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-zinc-100 p-4 hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              <div
                className="aspect-square rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                style={{
                  background:
                    p.category === "bags"
                      ? "linear-gradient(135deg, #fdf2f5, #fce4ec)"
                      : "linear-gradient(135deg, #faf0f4, #fce4ec)",
                }}
              >
                <HugeiconsIcon
                  icon={p.category === "bags" ? ShoppingBag01Icon : TShirtIcon}
                  size={48}
                  className="text-zinc-300 group-hover:scale-110 transition-transform duration-500"
                  strokeWidth={1.2}
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 backdrop-blur-sm text-[9px] font-bold px-2 py-1 rounded-lg text-zinc-500 border border-zinc-100 shadow-sm">
                    {p.id.toUpperCase()}
                  </span>
                </div>
                {p.badge && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-[var(--brand-rose)] text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-sm">
                      {p.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="text-sm font-semibold text-zinc-800 line-clamp-1 leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {p.name}
                  </h3>
                  <Link
                    href={`/shop/${p.slug}`}
                    target="_blank"
                    className="text-zinc-300 hover:text-[var(--brand-pink)] transition-colors"
                  >
                    <HugeiconsIcon icon={Link01Icon} size={15} />
                  </Link>
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-[0.1em] font-medium">
                  {p.category}
                </p>

                <div className="pt-2 flex items-end justify-between">
                  <div>
                    <p className="text-base font-bold text-zinc-900">
                      {formatPrice(p.price)}
                    </p>
                    {p.originalPrice && (
                      <p className="text-[10px] text-zinc-400 line-through">
                        {formatPrice(p.originalPrice)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {p.colors.slice(0, 3).map((c) => (
                      <div
                        key={c}
                        className="w-2.5 h-2.5 rounded-full border border-zinc-100 shadow-inner"
                        style={{ backgroundColor: c.toLowerCase().replace(/ /g, "") }}
                        title={c}
                      />
                    ))}
                    {p.colors.length > 3 && (
                      <span className="text-[8px] text-zinc-400 font-bold">
                        +{p.colors.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2 pt-4 border-t border-zinc-50">
                <button className="flex-1 py-2 rounded-xl bg-zinc-50 text-zinc-600 text-[11px] font-bold hover:bg-zinc-100 hover:text-zinc-900 transition-all">
                  Edit Details
                </button>
                <button className="w-10 h-9 rounded-xl flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all group-hover:opacity-100">
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
