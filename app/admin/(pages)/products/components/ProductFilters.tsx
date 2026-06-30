"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Add01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categories: string[];
  onAddProduct: () => void;
}

export default function ProductFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  onAddProduct,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
          <HugeiconsIcon icon={Search01Icon} size={18} />
        </div>
        <input
          id="admin-product-search"
          type="text"
          placeholder="Search products by name…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all"
        />
      </div>
      <div className="flex gap-2">
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => onCategoryFilterChange("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === "all"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryFilterChange(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                categoryFilter === cat
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <Button
          onClick={onAddProduct}
          className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} className="mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
