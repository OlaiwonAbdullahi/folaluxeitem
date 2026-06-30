/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Image from "next/image";
import { Product as ApiProduct } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useCart } from "./CartContext";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBagAddIcon } from "@hugeicons/core-free-icons";

// Adapter function to convert API Product to Cart-compatible product
function adaptProductForCart(product: ApiProduct) {
  return {
    id: product._id,
    slug: product._id, // Using _id as slug temporarily, adjust as needed
    name: product.name,
    price: product.salePrice || product.price,
    originalPrice: product.salePrice ? product.price : undefined,
    category: product.category,
    images: product.images.map((img) => img.url),
    sizes: product.sizes,
    colors: product.colors.map((c) => c.name),
    description: product.description,
    featured: product.isFeatured,
    inStock: product.stock > 0,
    badge: product.isBestseller
      ? "Bestseller"
      : product.isNewArrival
        ? "New In"
        : undefined,
  };
}

type ProductCardProps = {
  product: ApiProduct;
  className?: string;
};

export default function ProductCard({
  product,
  className = "",
}: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const defaultSize = product.sizes[0];
  const defaultColor = product.colors[0]?.name;
  const adaptedProduct = adaptProductForCart(product);

  function handleQuickAdd(e: React.MouseEvent) {
    if (!defaultSize || !defaultColor) return;
    e.preventDefault();
    e.stopPropagation();
    addItem(adaptedProduct, 1, defaultSize, defaultColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];

  return (
    <Link
      href={`/shop/${product._id}`}
      className={`group flex flex-col bg-white rounded-lg overflow-hidden border border-[var(--border)] hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-auto overflow-hidden shrink-0 bg-[var(--brand-blush)]">
        {mainImage && (
          <img
            src={mainImage.url}
            alt={mainImage.altText || product.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {adaptedProduct.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-white text-(--brand-rose) shadow-sm">
            {adaptedProduct.badge}
          </span>
        )}

        {/* Quick Add Icon */}
        <button
          id={`quick-add-${product._id}`}
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to bag`}
          className={`
            absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10
            ${
              added
                ? "bg-green-500 text-white scale-110"
                : "bg-white text-(--brand-rose) hover:bg-(--brand-rose) hover:text-white"
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
              className="text-(--brand-rose) hover:text-white"
            />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="px-4 py-3.5 flex flex-col gap-0.5 ">
        <p className="text-[10px] tracking-widest uppercase text-(--brand-muted) font-medium">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </p>
        <h3 className="font-heading font-semibold text-(--brand-dark) text-base leading-snug group-hover:text-(--brand-rose) transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-(--brand-rose)">
            {formatPrice(adaptedProduct.price)}
          </span>
          {adaptedProduct.originalPrice && (
            <span className="text-xs text-(--brand-muted) line-through">
              {formatPrice(adaptedProduct.originalPrice)}
            </span>
          )}
        </div>
        {/* Color dots */}
        <div className="flex gap-1.5 mt-2">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="text-[9px] text-(--brand-muted) border border-border rounded-full px-2 py-0.5"
            >
              {color.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
