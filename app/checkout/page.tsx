"use client";

import { useState } from "react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import { useCart } from "../_components/CartContext";
import { formatPrice } from "@/lib/format";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldKeyIcon, Loading03Icon } from "@hugeicons/core-free-icons";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
};

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River",
  "Delta","Ebonyi","Edo","Ekiti","Enugu","FCT (Abuja)","Gombe","Imo","Jigawa","Kaduna",
  "Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo",
  "Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const total = totalPrice;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const orderRes = await api.createOrder({
        customerInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phone,
        },
        shippingAddress: {
          street: form.address,
          city: form.city,
          state: form.state,
          postalCode: "",
        },
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
        })),
        paymentMethod: "questpay",
        notes: form.notes || undefined,
      });

      const payRes = await api.initializePayment(orderRes.data._id);
      // Hand off to QuestPay's hosted checkout.
      window.location.href = payRes.data.authorizationUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start checkout";
      toast.error(message);
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex flex-col flex-1 min-h-screen items-center justify-center px-4 py-24 text-center">
          <h1 className="font-heading text-3xl text-[var(--brand-dark)] mb-3">
            Your bag is empty
          </h1>
          <p className="text-[var(--brand-muted)] mb-6">
            Add items to your bag before checking out.
          </p>
          <Link
            href="/shop"
            className="px-7 py-3.5 bg-[var(--brand-rose)] text-white rounded-lg font-medium"
          >
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
              <Link href="/cart" className="hover:text-[var(--brand-rose)]">
                Bag
              </Link>
              <span>/</span>
              <span className="text-[var(--brand-dark)] font-medium">Checkout</span>
            </nav>
            <h1 className="font-heading text-4xl sm:text-5xl text-[var(--brand-dark)] font-medium">
              Checkout
            </h1>
          </div>
        </div>

        <div className="section-padding max-w-7xl mx-auto w-full py-10">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <fieldset className="bg-white border border-[var(--border)] rounded-xl p-6 space-y-5">
                <legend className="font-heading text-lg font-semibold text-[var(--brand-dark)] px-1">
                  Contact Information
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Adaeze" />
                  <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Okonkwo" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                  <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="0801 234 5678" />
                </div>
              </fieldset>

              {/* Shipping Address */}
              <fieldset className="bg-white border border-[var(--border)] rounded-xl p-6 space-y-5">
                <legend className="font-heading text-lg font-semibold text-[var(--brand-dark)] px-1">
                  Delivery Address
                </legend>
                <Field label="Street Address" name="address" value={form.address} onChange={handleChange} placeholder="14 Adeola Hopewell Street" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="Victoria Island" />
                  <div>
                    <label htmlFor="state" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors bg-white cursor-pointer text-[var(--brand-dark)]"
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Notes */}
              <div className="bg-white border border-[var(--border)] rounded-xl p-6">
                <label htmlFor="notes" className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions, delivery preferences, etc."
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Right: Order Review */}
            <div className="lg:sticky lg:top-28 self-start space-y-4">
              <div className="bg-white border border-[var(--border)] rounded-xl p-6 space-y-5">
                <h2 className="font-heading text-xl font-semibold text-[var(--brand-dark)]">
                  Order Review
                </h2>

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
                        <p className="text-sm font-medium text-[var(--brand-dark)] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[var(--brand-muted)]">
                          {item.selectedColor}
                          {item.selectedSize !== "One Size" && ` · ${item.selectedSize}`}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[var(--brand-dark)] whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-[var(--border)]" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[var(--brand-muted)]">
                    <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--brand-muted)]">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <hr className="border-[var(--border)]" />
                  <div className="flex justify-between font-semibold text-base text-[var(--brand-dark)]">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  id="place-order-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[var(--brand-rose)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--brand-pink)] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
                      Redirecting to QuestPay…
                    </>
                  ) : (
                    <>Pay {formatPrice(total)}</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-[var(--brand-muted)]">
                  <HugeiconsIcon icon={ShieldKeyIcon} size={14} />
                  <span>Secure bank transfer via QuestPay</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold text-[var(--brand-dark)] mb-1.5 tracking-wide uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors"
      />
    </div>
  );
}
