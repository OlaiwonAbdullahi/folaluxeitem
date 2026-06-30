"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MinusSignIcon,
  PlusSignIcon,
  DeliveryTruck01Icon,
  ShieldKeyIcon,
  ReloadIcon,
  Tick01Icon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import ProductCard from "@/app/_components/ProductCard";
import ProductCardSkeleton from "@/app/_components/ProductCardSkeleton";
import Footer from "@/app/_components/Footer";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import { Product, api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/app/_components/CartContext";
import Navbar from "@/app/_components/Navbar";

// Adapter for cart
function adaptProductForCart(product: Product) {
  return {
    id: product._id,
    slug: product._id,
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

export default function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const productRes = await api.getProduct(id);
        setProduct(productRes.data);

        const productsRes = await api.getProducts({
          category: productRes.data.category,
          limit: 8,
        });
        setRelatedProducts(
          productsRes.data.products.filter((p) => p._id !== id).slice(0, 4),
        );

        setSelectedSize(productRes.data.sizes[0]);
        setSelectedColor(productRes.data.colors[0]?.name || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    const adapted = adaptProductForCart(product);
    addItem(adapted, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    notFound();
  }

  const adaptedProduct = adaptProductForCart(product);
  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];

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
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[var(--brand-blush)]">
              {mainImage && (
                <img
                  src={mainImage.url}
                  alt={mainImage.altText || product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              {adaptedProduct.badge && (
                <span className="absolute top-5 left-5 px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-white text-[var(--brand-rose)] shadow-sm">
                  {adaptedProduct.badge}
                </span>
              )}
            </div>

            {/* Info Panel */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-(--brand-muted) mb-2 font-medium">
                  FolaLuxe ·{" "}
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
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
                    {formatPrice(adaptedProduct.price)}
                  </span>
                  {adaptedProduct.originalPrice && (
                    <span className="text-sm text-(--brand-muted) line-through">
                      {formatPrice(adaptedProduct.originalPrice)}
                    </span>
                  )}
                  {adaptedProduct.originalPrice && (
                    <span className="px-2.5 py-1 bg-[var(--brand-blush)] text-[var(--brand-rose)] text-[10px] tracking-widest uppercase rounded-full font-bold">
                      Save{" "}
                      {formatPrice(
                        adaptedProduct.originalPrice - adaptedProduct.price,
                      )}
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
                      key={color.name}
                      id={`color-${color.name.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setSelectedColor(color.name)}
                      aria-label={`Select colour ${color.name}`}
                      className={`px-4 py-2 rounded-full text-xs border transition-all duration-150 ${
                        selectedColor === color.name
                          ? "bg-[var(--brand-rose)] text-white border-[var(--brand-rose)] shadow"
                          : "border-[var(--border)] text-[var(--brand-text)] hover:border-[var(--brand-rose)]"
                      }`}
                    >
                      {color.name}
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
                  disabled={!adaptedProduct.inStock}
                  className={`flex-1 min-w-[180px] py-3.5 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    added
                      ? "bg-green-500 text-white"
                      : adaptedProduct.inStock
                        ? "bg-[var(--brand-rose)] text-white hover:bg-[var(--brand-pink)] hover:shadow-lg hover:shadow-pink-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {added ? (
                    <>
                      <HugeiconsIcon icon={Tick01Icon} size={18} />
                      Added to Bag!
                    </>
                  ) : adaptedProduct.inStock ? (
                    <>
                      <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
                      Add to Bag
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: DeliveryTruck01Icon, text: "Nationwide delivery" },
                  { icon: ShieldKeyIcon, text: "Secure checkout" },
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
      {relatedProducts.length > 0 && (
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
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
