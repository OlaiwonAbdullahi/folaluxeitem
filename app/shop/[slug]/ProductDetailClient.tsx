"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MinusSignIcon,
  PlusSignIcon,
  WhatsappIcon,
  DeliveryTruck01Icon,
  CreditCardIcon,
  ReloadIcon,
  Tick01Icon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import ProductCard from "@/app/_components/ProductCard";
import Footer from "@/app/_components/Footer";
import {
  formatPrice,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { useCart } from "@/app/_components/CartContext";
import Navbar from "@/app/_components/Navbar";

export default function ProductDetailClient({ slug }: { slug: string }) {
  const product = getProductBySlug(slug)!;

  const related = getRelatedProducts(product, 4);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  // Gradient bg per category
  const heroBg =
    product.category === "bags"
      ? "linear-gradient(135deg, #fce8ef 0%, #fadde5 60%, #f0d0da 100%)"
      : "linear-gradient(135deg, #f5eaf0 0%, #f9dde8 60%, #eecfdf 100%)";

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 min-h-screen text-(--brand-dark) px-6 md:px-0">
        {/* Breadcrumb */}
        <div className="pt-24 pb-4 section-padding max-w-7xl mx-auto w-full">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-(--brand-muted)"
          >
            <Link
              href="/"
              className="hover:text-(--brand-rose) transition-colors"
            >
              Home
            </Link>
            <HugeiconsIcon icon={ArrowRight01Icon} size={10} />
            <Link
              href="/shop"
              className="hover:text-(--brand-rose) transition-colors"
            >
              Shop
            </Link>
            <HugeiconsIcon icon={ArrowRight01Icon} size={10} />
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-(--brand-rose) transition-colors"
            >
              {product.category}
            </Link>
            <HugeiconsIcon icon={ArrowRight01Icon} size={10} />
            <span className="font-semibold text-(--brand-rose) truncate">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Main Product Section */}
        <section className="section-padding max-w-7xl mx-auto w-full pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Image Panel */}
            <div
              className="relative aspect-3/4 rounded-3xl overflow-hidden"
              style={{ background: heroBg }}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {product.badge && (
                <span className="absolute top-5 left-5 px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-white text-[var(--brand-rose)] shadow-sm">
                  {product.badge}
                </span>
              )}
              {/* Decorative corner arc */}
              <div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border-2 opacity-20"
                style={{ borderColor: "var(--brand-pink)" }}
              />
            </div>

            {/* Info Panel */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-(--brand-muted) mb-2 font-medium">
                  FolaLuxe · {product.category === "bags" ? "Bags" : "Clothing"}
                </p>
                <h1
                  className="text-4xl sm:text-5xl text-(--brand-dark) leading-[1.1]"
                  style={{
                    fontFamily: "var(--font-heading), Georgia, serif",
                    fontWeight: 500,
                  }}
                >
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-3xl font-semibold text-(--brand-rose)">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-(--brand-muted) line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-2.5 py-1 bg-[var(--brand-blush)] text-[var(--brand-rose)] text-[10px] tracking-widest uppercase rounded-full font-bold">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[var(--brand-muted)] leading-relaxed text-sm">
                {product.description}
              </p>

              <hr className="border-[var(--border)]" />

              {/* Colour Selector */}
              <div>
                <p className="text-sm font-medium text-[var(--brand-dark)] mb-3">
                  Colour:{" "}
                  <span className="text-[var(--brand-rose)]">
                    {selectedColor}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      id={`color-${color.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select colour ${color}`}
                      className={`px-4 py-2 rounded-full text-xs border transition-all duration-150 ${
                        selectedColor === color
                          ? "bg-[var(--brand-rose)] text-white border-[var(--brand-rose)] shadow"
                          : "border-[var(--border)] text-[var(--brand-text)] hover:border-[var(--brand-rose)]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              {product.sizes.length > 1 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-[var(--brand-dark)]">
                      Size:{" "}
                      <span className="text-[var(--brand-rose)]">
                        {selectedSize}
                      </span>
                    </p>
                    <button className="text-xs text-[var(--brand-muted)] underline underline-offset-2 hover:text-[var(--brand-rose)] transition-colors">
                      Size guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        id={`size-${size}`}
                        onClick={() => setSelectedSize(size)}
                        aria-label={`Select size ${size}`}
                        className={`w-12 h-11 rounded-xl border text-sm font-medium transition-all duration-150 ${
                          selectedSize === size
                            ? "bg-[var(--brand-rose)] text-white border-[var(--brand-rose)] shadow"
                            : "border-[var(--border)] text-[var(--brand-text)] hover:border-[var(--brand-rose)]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex gap-3 flex-wrap">
                {/* Qty */}
                <div className="flex items-center border border-[var(--border)] rounded-full overflow-hidden text-[var(--brand-dark)]">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-12 flex items-center justify-center hover:bg-[var(--brand-blush)] transition-colors"
                  >
                    <HugeiconsIcon
                      icon={MinusSignIcon}
                      size={18}
                      strokeWidth={2}
                    />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-11 h-12 flex items-center justify-center hover:bg-[var(--brand-blush)] transition-colors"
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      size={18}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="add-to-cart"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 min-w-[180px] py-3.5 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    added
                      ? "bg-green-500 text-white"
                      : product.inStock
                        ? "bg-[var(--brand-rose)] text-white hover:bg-[var(--brand-pink)] hover:shadow-lg hover:shadow-pink-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {added ? (
                    <>
                      <HugeiconsIcon icon={Tick01Icon} size={18} />
                      Added to Bag!
                    </>
                  ) : product.inStock ? (
                    <>
                      <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
                      Add to Bag
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </button>
              </div>

              {/* Order via WhatsApp */}
              <a
                href={`https://wa.me/2348000000000?text=Hi%2C%20I'd%20like%20to%20order%20${encodeURIComponent(product.name)}%20in%20${encodeURIComponent(selectedColor)}${selectedSize !== "One Size" ? `%20(Size%20${encodeURIComponent(selectedSize)})` : ""}%20x${quantity}`}
                target="_blank"
                rel="noopener noreferrer"
                id="order-whatsapp"
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-full border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 transition-colors"
              >
                <HugeiconsIcon icon={WhatsappIcon} size={20} />
                Order via WhatsApp
              </a>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: DeliveryTruck01Icon, text: "Nationwide delivery" },
                  { icon: CreditCardIcon, text: "Pay on delivery" },
                  { icon: ReloadIcon, text: "Easy returns" },
                  { icon: Tick01Icon, text: "Authentic product" },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-2 text-[10px] sm:text-xs text-[var(--brand-muted)] font-medium"
                  >
                    <HugeiconsIcon
                      icon={badge.icon}
                      size={16}
                      strokeWidth={1.5}
                      className="text-[var(--brand-rose)]"
                    />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      {related.length > 0 && (
        <section className="section-padding py-20 bg-(--brand-blush)/40 w-full px-6 md:px-0">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl text-(--brand-dark) mb-10"
              style={{
                fontFamily: "var(--font-heading), Georgia, serif",
                fontWeight: 500,
              }}
            >
              You might also love
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
