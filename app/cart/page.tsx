"use client";

import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import { useCart } from "../_components/CartContext";
import { formatPrice } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  const shipping = totalPrice >= 50000 ? 0 : 3500;
  const finalTotal = totalPrice + shipping;

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <div className="pt-28 pb-10 section-padding bg-[var(--brand-blush)]/40">
          <div className="max-w-7xl mx-auto">
            <h1
              className="text-5xl text-[var(--brand-dark)]"
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
            >
              Your Bag
            </h1>
            <p className="text-[var(--brand-muted)] mt-2">
              {totalItems === 0 ? "Empty" : `${totalItems} item${totalItems > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="section-padding max-w-7xl mx-auto w-full py-10">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--brand-blush)] flex items-center justify-center">
                <HugeiconsIcon
                  icon={ShoppingBag01Icon}
                  size={36}
                  strokeWidth={1.2}
                  className="text-[var(--brand-rose)]"
                />
              </div>
              <div>
                <h2 className="font-heading text-3xl text-[var(--brand-dark)] mb-2">Nothing here yet</h2>
                <p className="text-[var(--brand-muted)]">Your bag is empty. Time to fill it up.</p>
              </div>
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[var(--brand-rose)] text-white rounded-full font-medium hover:bg-[var(--brand-pink)] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-5">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-5 p-5 bg-white rounded-2xl border border-[var(--border)] hover:shadow-sm transition-shadow"
                  >
                    {/* Image */}
                    <div
                      className="w-24 h-28 rounded-xl overflow-hidden flex-shrink-0 relative"
                      style={{
                        background: item.product.category === "bags"
                          ? "linear-gradient(135deg,#fce8ef,#fadde5)"
                          : "linear-gradient(135deg,#f5eaf0,#f9dde8)",
                      }}
                    >
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/shop/${item.product.slug}`}
                            className="font-heading font-semibold text-[var(--brand-dark)] text-lg hover:text-[var(--brand-rose)] transition-colors leading-snug block"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-[var(--brand-muted)] mt-1">
                            {item.selectedColor}{item.selectedSize !== "One Size" && ` · ${item.selectedSize}`}
                          </p>
                        </div>
                        <p className="font-semibold text-[var(--brand-rose)] whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Qty */}
                        <div className="flex items-center border border-[var(--border)] rounded-full overflow-hidden text-[var(--brand-dark)]">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-[var(--brand-blush)] transition-colors"
                          >
                            <HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={2} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-[var(--brand-blush)] transition-colors"
                          >
                            <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                          className="text-xs text-[var(--brand-muted)] hover:text-red-500 transition-colors underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-28 self-start space-y-4">
                <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
                  <h2
                    className="text-2xl text-[var(--brand-dark)]"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                  >
                    Order Summary
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-[var(--brand-muted)]">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--brand-muted)]">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600 font-medium">Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-[var(--brand-muted)] bg-[var(--brand-blush)] px-3 py-2 rounded-lg">
                        Spend {formatPrice(50000 - totalPrice)} more for free shipping
                      </p>
                    )}
                    <hr className="border-[var(--border)]" />
                    <div className="flex justify-between text-base font-semibold text-[var(--brand-dark)]">
                      <span>Total</span>
                      <span className="text-[var(--brand-rose)]">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    id="cart-checkout-cta"
                    className="block w-full text-center py-3.5 bg-[var(--brand-rose)] text-white rounded-full font-medium hover:bg-[var(--brand-pink)] transition-colors mt-2"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/shop"
                    className="block w-full text-center text-sm text-[var(--brand-muted)] hover:text-[var(--brand-rose)] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Payment Methods */}
                <div className="bg-[var(--brand-blush)]/60 border border-[var(--border)] rounded-2xl p-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[var(--brand-muted)] mb-3">
                    Payment Methods
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Bank Transfer", "Pay on Delivery", "WhatsApp Order"].map((m) => (
                      <span key={m} className="px-3 py-1.5 bg-white rounded-full text-xs border border-[var(--border)] text-[var(--brand-dark)]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
