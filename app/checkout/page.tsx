"use client";

import { useState } from "react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import { useCart } from "../_components/CartContext";
import { formatPrice } from "@/lib/products";
import Link from "next/link";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  paymentMethod: "bank-transfer" | "pay-on-delivery";
  notes: string;
};

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River",
  "Delta","Ebonyi","Edo","Ekiti","Enugu","FCT (Abuja)","Gombe","Imo","Jigawa","Kaduna",
  "Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo",
  "Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    paymentMethod: "pay-on-delivery",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const shipping = totalPrice >= 50000 ? 0 : 3500;
  const total = totalPrice + shipping;

  function generateRef() {
    return "FL" + Date.now().toString().slice(-7).toUpperCase();
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = generateRef();
    setOrderRef(ref);
    setSubmitted(true);

    // WhatsApp message
    const itemsList = items
      .map((i) => `• ${i.product.name} (${i.selectedColor}${i.selectedSize !== "One Size" ? `, ${i.selectedSize}` : ""}) x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`)
      .join("\n");

    const message = `
Hello FolaLuxe! I'd like to place an order 🛍️

Order Ref: ${ref}
Name: ${form.firstName} ${form.lastName}
Phone: ${form.phone}
Email: ${form.email}
Address: ${form.address}, ${form.city}, ${form.state}
Payment: ${form.paymentMethod === "bank-transfer" ? "Bank Transfer" : "Pay on Delivery"}

Items:
${itemsList}

Subtotal: ${formatPrice(totalPrice)}
Shipping: ${shipping === 0 ? "Free" : formatPrice(shipping)}
Total: ${formatPrice(total)}

${form.notes ? `Notes: ${form.notes}` : ""}
    `.trim();

    const wa = `https://wa.me/2348000000000?text=${encodeURIComponent(message)}`;
    window.open(wa, "_blank");
    clearCart();
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex flex-col flex-1 min-h-screen items-center justify-center px-4 py-24">
          <div className="text-center max-w-md mx-auto animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-[var(--brand-blush)] flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--brand-rose)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1
              className="text-4xl text-[var(--brand-dark)] mb-3"
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
            >
              Order Received!
            </h1>
            <p className="text-[var(--brand-muted)] text-base leading-relaxed mb-2">
              Your order <strong className="text-[var(--brand-dark)]">#{orderRef}</strong> has been submitted. We&apos;ve opened WhatsApp for you to confirm — please send the message to complete your order.
            </p>
            <p className="text-sm text-[var(--brand-muted)] mb-8">
              We&apos;ll contact you at <strong>{form.phone}</strong> to confirm delivery details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="px-7 py-3.5 bg-[var(--brand-rose)] text-white rounded-full font-medium hover:bg-[var(--brand-pink)] transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="px-7 py-3.5 border border-[var(--border)] text-[var(--brand-dark)] rounded-full text-sm hover:bg-[var(--brand-blush)] transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex flex-col flex-1 min-h-screen items-center justify-center px-4 py-24 text-center">
          <h1 className="font-heading text-3xl text-[var(--brand-dark)] mb-3">Your bag is empty</h1>
          <p className="text-[var(--brand-muted)] mb-6">Add items to your bag before checking out.</p>
          <Link href="/shop" className="px-7 py-3.5 bg-[var(--brand-rose)] text-white rounded-full font-medium">
            Browse Products
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <div className="pt-28 pb-10 section-padding bg-[var(--brand-blush)]/40">
          <div className="max-w-7xl mx-auto">
            <nav className="text-xs text-[var(--brand-muted)] flex items-center gap-1.5 mb-4">
              <Link href="/cart" className="hover:text-[var(--brand-rose)]">Bag</Link>
              <span>/</span>
              <span className="text-[var(--brand-dark)] font-medium">Checkout</span>
            </nav>
            <h1
              className="text-5xl text-[var(--brand-dark)]"
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
            >
              Checkout
            </h1>
          </div>
        </div>

        <div className="section-padding max-w-7xl mx-auto w-full py-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <fieldset className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-5">
                <legend
                  className="text-xl text-[var(--brand-dark)] px-1"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                >
                  Contact Information
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Adaeze"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Okonkwo"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0801 234 5678"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Shipping Address */}
              <fieldset className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-5">
                <legend
                  className="text-xl text-[var(--brand-dark)] px-1"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                >
                  Delivery Address
                </legend>
                <div>
                  <label htmlFor="address" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={handleChange}
                    placeholder="14 Adeola Hopewell Street"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                      City *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Victoria Island"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors bg-white cursor-pointer text-[var(--brand-dark)]"
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Payment Method */}
              <fieldset className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
                <legend
                  className="text-xl text-[var(--brand-dark)] px-1"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                >
                  Payment Method
                </legend>
                {[
                  {
                    value: "pay-on-delivery",
                    label: "Pay on Delivery",
                    desc: "Pay cash when your order arrives at your door.",
                    icon: "💵",
                  },
                  {
                    value: "bank-transfer",
                    label: "Bank Transfer",
                    desc: "We'll send you our account details via WhatsApp after you place your order.",
                    icon: "🏦",
                  },
                ].map((method) => (
                  <label
                    key={method.value}
                    htmlFor={`payment-${method.value}`}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === method.value
                        ? "border-[var(--brand-rose)] bg-[var(--brand-blush)]/60"
                        : "border-[var(--border)] hover:border-[var(--brand-rose)]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      id={`payment-${method.value}`}
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={handleChange}
                      className="mt-1 accent-[var(--brand-rose)]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{method.icon}</span>
                        <span className="font-semibold text-sm text-[var(--brand-dark)]">{method.label}</span>
                      </div>
                      <p className="text-xs text-[var(--brand-muted)] mt-1 leading-relaxed">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </fieldset>

              {/* Notes */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
                <label
                  htmlFor="notes"
                  className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase"
                >
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions, delivery preferences, etc."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Right: Order Review */}
            <div className="lg:sticky lg:top-28 self-start space-y-4">
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-5">
                <h2
                  className="text-2xl text-[var(--brand-dark)]"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                >
                  Order Review
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex items-center gap-3"
                    >
                      <span className="w-6 h-6 bg-[var(--brand-blush)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--brand-rose)] flex-shrink-0">
                        {item.quantity}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--brand-dark)] truncate">{item.product.name}</p>
                        <p className="text-xs text-[var(--brand-muted)]">{item.selectedColor}{item.selectedSize !== "One Size" && ` · ${item.selectedSize}`}</p>
                      </div>
                      <span className="text-sm font-semibold text-[var(--brand-rose)] whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-[var(--border)]" />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[var(--brand-muted)]">
                    <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--brand-muted)]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(shipping)}</span>
                  </div>
                  <hr className="border-[var(--border)]" />
                  <div className="flex justify-between font-semibold text-base text-[var(--brand-dark)]">
                    <span>Total</span>
                    <span className="text-[var(--brand-rose)]">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  id="place-order-btn"
                  type="submit"
                  className="w-full py-4 bg-[var(--brand-rose)] text-white rounded-full font-semibold text-sm hover:bg-[var(--brand-pink)] transition-colors hover:shadow-lg hover:shadow-pink-200 flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0020.464 3.49"/>
                  </svg>
                  Place Order via WhatsApp
                </button>

                <p className="text-xs text-[var(--brand-muted)] text-center leading-relaxed">
                  Clicking will open WhatsApp with your order summary. Send the message to confirm.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
