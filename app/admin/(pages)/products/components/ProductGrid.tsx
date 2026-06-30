"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/lib/api";

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductGrid({ products, onEdit, onDelete }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full py-20 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
        <p className="text-zinc-400 text-sm">
          No products found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
