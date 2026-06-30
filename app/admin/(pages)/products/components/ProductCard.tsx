"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Link01Icon,
  Delete02Icon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons";
import { Product } from "@/lib/api";
import { formatPrice } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-4 hover:shadow-lg transition-all duration-300 group flex flex-col">
      <div className="aspect-square rounded-xl mb-4 relative overflow-hidden bg-zinc-50">
        <img
          src={mainImage?.url || "/logo.png"}
          alt={mainImage?.altText || product.name}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm text-[9px] font-bold px-2 py-1 rounded-lg text-zinc-500 border border-zinc-100 shadow-sm">
            {product._id.toUpperCase().slice(-6)}
          </span>
        </div>
        {product.isBestseller && (
          <div className="absolute top-2 left-2">
            <span className="bg-[var(--brand-rose)] text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-sm">
              Bestseller
            </span>
          </div>
        )}
        {product.isNewArrival && !product.isBestseller && (
          <div className="absolute top-2 left-2">
            <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-sm">
              New
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
            {product.name}
          </h3>
          <Link
            href={`/shop/${product._id}`}
            target="_blank"
            className="text-zinc-300 hover:text-[var(--brand-pink)] transition-colors"
          >
            <HugeiconsIcon icon={Link01Icon} size={15} />
          </Link>
        </div>
        <p className="text-[10px] text-zinc-400 uppercase tracking-[0.1em] font-medium">
          {product.category}
        </p>

        <div className="pt-2 flex items-end justify-between">
          <div>
            <p className="text-base font-bold text-zinc-900">
              {formatPrice(product.salePrice || product.price)}
            </p>
            {product.salePrice && (
              <p className="text-[10px] text-zinc-400 line-through">
                {formatPrice(product.price)}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            {product.colors?.slice(0, 3).map((c) => (
              <div
                key={c.hex}
                className="w-2.5 h-2.5 rounded-full border border-zinc-100 shadow-inner"
                style={{
                  backgroundColor: c.hex,
                }}
                title={c.name}
              />
            ))}
            {product.colors?.length > 3 && (
              <span className="text-[8px] text-zinc-400 font-bold">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2 pt-4 border-t border-zinc-50">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 py-2 rounded-xl bg-zinc-50 text-zinc-600 text-[11px] font-bold hover:bg-zinc-100 hover:text-zinc-900 transition-all flex items-center justify-center gap-1.5"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
          Edit Details
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="w-10 h-9 rounded-xl flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all group-hover:opacity-100"
        >
          <HugeiconsIcon icon={Delete02Icon} size={16} />
        </button>
      </div>
    </div>
  );
}
