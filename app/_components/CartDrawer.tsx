"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ShoppingBag01Icon,
  PlusSignIcon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/products";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    totalPrice,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[var(--brand-dark)]">
              Your Bag
            </h2>
            <p className="text-xs text-[var(--brand-muted)] mt-0.5">
              {items.length === 0
                ? "Nothing here yet"
                : `${items.length} item${items.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            id="close-cart-drawer"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--brand-blush)] transition-colors text-[var(--brand-dark)]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[var(--brand-blush)] flex items-center justify-center">
                <HugeiconsIcon
                  icon={ShoppingBag01Icon}
                  size={28}
                  strokeWidth={1.5}
                  className="text-[var(--brand-rose)]"
                />
              </div>
              <div>
                <p className="font-heading text-lg text-[var(--brand-dark)]">
                  Your bag is empty
                </p>
                <p className="text-sm text-[var(--brand-muted)] mt-1">
                  Add something beautiful to get started
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="mt-2 px-6 py-2.5 bg-[var(--brand-rose)] text-white text-sm rounded-full hover:bg-[var(--brand-pink)] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 pb-5 border-b border-[var(--border)] last:border-0"
              >
                {/* Product Image */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[var(--brand-blush)] flex-shrink-0 relative">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={ShoppingBag01Icon}
                      size={24}
                      strokeWidth={1}
                      className="text-[var(--brand-rose)] opacity-50"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-medium text-[var(--brand-dark)] text-sm leading-snug truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-[var(--brand-muted)] mt-0.5">
                    {item.selectedSize} · {item.selectedColor}
                  </p>
                  <p className="text-sm font-semibold text-[var(--brand-rose)] mt-1">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center border border-[var(--border)] rounded-full overflow-hidden text-[var(--brand-dark)]">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity - 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--brand-blush)] transition-colors"
                      >
                        <HugeiconsIcon
                          icon={MinusSignIcon}
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                      <span className="w-7 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity + 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--brand-blush)] transition-colors"
                      >
                        <HugeiconsIcon
                          icon={PlusSignIcon}
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      aria-label="Remove item"
                      onClick={() =>
                        removeItem(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor,
                        )
                      }
                      className="text-xs text-[var(--brand-muted)] hover:text-red-500 transition-colors underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[var(--border)] bg-[var(--brand-blush)]/40 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--brand-muted)]">Subtotal</span>
              <span className="font-semibold text-[var(--brand-dark)]">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="text-xs text-[var(--brand-muted)]">
              Shipping calculated at checkout. Payment on delivery available.
            </p>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              id="proceed-to-checkout"
              className="block w-full text-center py-3.5 bg-[var(--brand-rose)] text-white font-medium text-sm rounded-full hover:bg-[var(--brand-pink)] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block w-full text-center py-3 border border-[var(--border)] text-[var(--brand-dark)] text-sm rounded-full hover:bg-white transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
