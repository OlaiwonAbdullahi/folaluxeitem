"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/lib/products";
import { useCart } from "./CartContext";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBagAddIcon } from "@hugeicons/core-free-icons";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export default function ProductCard({
  product,
  className = "",
}: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const defaultSize = product.sizes[0];
  const defaultColor = product.colors[0];

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, defaultSize, defaultColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // Map product images to gradient fallbacks
  const gradientMap: Record<string, string> = {
    bags: "linear-gradient(135deg, #f8ecef 0%, #fadde5 50%, #f0d0da 100%)",
    clothing: "linear-gradient(135deg, #f5eaf0 0%, #f9dde8 50%, #edd5e3 100%)",
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] overflow-hidden flex-shrink-0"
        style={{ background: gradientMap[product.category] }}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-white text-[var(--brand-rose)] shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Quick Add Icon */}
        <button
          id={`quick-add-${product.id}`}
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to bag`}
          className={`
            absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10
            ${
              added
                ? "bg-green-500 text-white scale-110"
                : "bg-white text-[var(--brand-rose)] hover:bg-[var(--brand-rose)] hover:text-white"
            }
          `}
        >
          {added ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <HugeiconsIcon
              icon={ShoppingBagAddIcon}
              size={20}
              strokeWidth={2}
              className="text-[var(--brand-rose)] hover:text-white"
            />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="px-4 py-3.5 flex flex-col gap-0.5">
        <p className="text-[10px] tracking-widest uppercase text-[var(--brand-muted)] font-medium">
          {product.category === "bags" ? "Bags" : "Clothing"}
        </p>
        <h3 className="font-heading font-semibold text-[var(--brand-dark)] text-base leading-snug group-hover:text-[var(--brand-rose)] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-[var(--brand-rose)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[var(--brand-muted)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {/* Color dots */}
        <div className="flex gap-1.5 mt-2">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color}
              title={color}
              className="text-[9px] text-[var(--brand-muted)] border border-[var(--border)] rounded-full px-2 py-0.5"
            >
              {color}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
