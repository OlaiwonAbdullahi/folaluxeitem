"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../_components/Navbar";
import Footer from "../../_components/Footer";
import { useCart } from "../../_components/CartContext";
import { api } from "@/lib/api";
import type { Order } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Loading03Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";

type Status = "verifying" | "success" | "failed";

function orderIdFromRef(ref: string | null): string | null {
  if (!ref) return null;
  const parts = ref.split("-");
  // QuestPay uppercases the reference; the Mongo order id is lowercase hex.
  return parts.length >= 3 ? parts[1].toLowerCase() : null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function CallbackInner() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<Status>("verifying");
  const [order, setOrder] = useState<Order | null>(null);
  const ran = useRef(false);

  // QuestPay's redirect param names aren't guaranteed — accept the common
  // variants so a confirmed payment isn't dropped just because the key differs.
  const ref = params.get("ref") || params.get("reference");
  const checkoutStatus = params.get("checkout_status") || params.get("status");

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function confirm() {
      if (checkoutStatus === "failed") {
        setStatus("failed");
        return;
      }
      const orderId = orderIdFromRef(ref);
      if (!orderId || !ref) {
        setStatus("failed");
        return;
      }

      // The webhook is the source of truth but may land a moment after the
      // shopper is redirected back. Poll verify a few times so a slightly
      // delayed webhook still resolves to a confirmed state.
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const res = await api.verifyPayment(orderId, ref);
          setOrder(res.data);
          if (res.data.paymentStatus === "paid") {
            clearCart();
            setStatus("success");
            return;
          }
        } catch {
          // Transient (e.g. webhook not processed yet) — retry below.
        }
        if (attempt < 4) await sleep(2000);
      }

      // Not confirmed after retries. Trust QuestPay's success redirect for UX;
      // the webhook will still settle the order server-side if it arrives late.
      if (checkoutStatus === "success") {
        clearCart();
        setStatus("success");
      } else {
        setStatus("failed");
      }
    }
    confirm();
  }, [ref, checkoutStatus, clearCart]);

  // Build a real PDF receipt and download it. jsPDF is imported on demand so it
  // stays out of the initial page bundle.
  async function downloadReceipt() {
    if (!order) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    // jsPDF's built-in fonts have no ₦ glyph, so format money as "NGN 1,234".
    const money = (n: number) =>
      `NGN ${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 0 }).format(n)}`;

    const left = 18;
    const right = 192; // page width 210 - 18 margin
    const colQty = 132;
    const colPrice = 162;
    let y = 22;

    // Header
    doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(190, 18, 60);
    doc.text("FolaLuxe", left, y);
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(107, 114, 128);
    doc.text("Payment Receipt", left, y + 6);
    doc.setFont("helvetica", "bold").setTextColor(5, 150, 105);
    doc.text("PAID", left, y + 12);

    const date = new Date(order.createdAt).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(31, 41, 55);
    doc.text(`Order #${order.orderNumber}`, right, y, { align: "right" });
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(107, 114, 128);
    doc.text(date, right, y + 5, { align: "right" });
    if (order.paymentReference) {
      doc.text(`Ref: ${order.paymentReference}`, right, y + 10, { align: "right" });
    }

    y += 22;
    doc.setDrawColor(225, 226, 230).setLineWidth(0.4).line(left, y, right, y);
    y += 9;

    // Billed to / Ship to
    const c = order.customerInfo;
    const a = order.shippingAddress;
    const colHead = (label: string, x: number) => {
      doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(156, 163, 175);
      doc.text(label.toUpperCase(), x, y);
    };
    colHead("Billed to", left);
    colHead("Ship to", 110);
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(31, 41, 55);
    const billed = [`${c.firstName} ${c.lastName}`, c.email, c.phoneNumber];
    const shipped = [
      a.street,
      [a.city, a.state].filter(Boolean).join(", "),
      a.postalCode,
    ].filter(Boolean);
    billed.forEach((line, i) => doc.text(String(line), left, y + 6 + i * 5));
    shipped.forEach((line, i) => doc.text(String(line), 110, y + 6 + i * 5));
    y += 6 + Math.max(billed.length, shipped.length) * 5 + 8;

    // Items table header
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(156, 163, 175);
    doc.text("ITEM", left, y);
    doc.text("QTY", colQty, y, { align: "right" });
    doc.text("PRICE", colPrice, y, { align: "right" });
    doc.text("AMOUNT", right, y, { align: "right" });
    y += 3;
    doc.setDrawColor(229, 231, 235).line(left, y, right, y);
    y += 6;

    // Items
    doc.setTextColor(31, 41, 55);
    for (const item of order.items) {
      if (y > 265) {
        doc.addPage();
        y = 22;
      }
      const variant = [item.selectedColor, item.selectedSize]
        .filter(Boolean)
        .join(" · ");
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(31, 41, 55);
      const nameLines = doc.splitTextToSize(item.name, colQty - left - 6);
      doc.text(nameLines, left, y);
      doc.text(String(item.quantity), colQty, y, { align: "right" });
      doc.text(money(item.price), colPrice, y, { align: "right" });
      doc.text(money(item.price * item.quantity), right, y, { align: "right" });
      let rowH = nameLines.length * 4.5;
      if (variant) {
        doc.setFontSize(8).setTextColor(156, 163, 175);
        doc.text(variant, left, y + rowH);
        rowH += 4;
      }
      y += rowH + 4;
      doc.setDrawColor(243, 244, 246).line(left, y - 2, right, y - 2);
    }

    // Totals
    const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
    y += 4;
    const totalRow = (label: string, value: string, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(bold ? 12 : 10);
      doc.setTextColor(bold ? 31 : 107, bold ? 41 : 114, bold ? 55 : 128);
      doc.text(label, colPrice, y, { align: "right" });
      doc.text(value, right, y, { align: "right" });
      y += bold ? 8 : 6;
    };
    totalRow("Subtotal", money(subtotal));
    if (typeof order.shippingFee === "number") {
      totalRow("Shipping", money(order.shippingFee));
    }
    doc.setDrawColor(225, 226, 230).line(colPrice - 30, y - 2, right, y - 2);
    y += 2;
    totalRow("Total", money(order.totalPrice), true);

    // Footer
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(156, 163, 175);
    doc.text(
      "Thank you for shopping with FolaLuxe.",
      105,
      288,
      { align: "center" },
    );

    doc.save(`FolaLuxe-Receipt-${order.orderNumber}.pdf`);
  }

  return (
    <main className="flex flex-col flex-1 min-h-screen items-center justify-center px-4 py-24">
      <div className="text-center max-w-lg mx-auto w-full">
        {status === "verifying" && (
          <>
            <HugeiconsIcon
              icon={Loading03Icon}
              size={44}
              className="animate-spin mx-auto mb-6 text-[var(--brand-rose)]"
            />
            <h1 className="font-heading text-3xl text-[var(--brand-dark)] mb-2 font-medium">
              Confirming your payment…
            </h1>
            <p className="text-[var(--brand-muted)] text-sm">
              This only takes a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={40}
                className="text-emerald-600"
              />
            </div>
            <h1 className="font-heading text-4xl text-[var(--brand-dark)] mb-3 font-medium">
              Payment confirmed
            </h1>
            <p className="text-[var(--brand-muted)] leading-relaxed mb-2">
              Thank you! Your order{" "}
              {order?.orderNumber && (
                <strong className="text-[var(--brand-dark)]">
                  #{order.orderNumber}
                </strong>
              )}{" "}
              has been received and is now being processed.
            </p>
            <p className="text-sm text-[var(--brand-muted)] mb-8">
              You&apos;ll receive delivery updates via email and phone.
            </p>

            {order && order.items.length > 0 && (
              <div className="text-left border border-[var(--border)] rounded-xl p-5 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg text-[var(--brand-dark)]">
                    Order summary
                  </h2>
                  <button
                    type="button"
                    onClick={downloadReceipt}
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--brand-rose)] hover:text-[var(--brand-pink)] transition-colors font-medium"
                  >
                    <HugeiconsIcon icon={Download01Icon} size={16} />
                    Receipt
                  </button>
                </div>

                <ul className="space-y-3">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-md object-cover border border-[var(--border)] shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[var(--brand-dark)] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--brand-muted)]">
                          {[item.selectedColor, item.selectedSize]
                            .filter(Boolean)
                            .join(" · ")}
                          {item.selectedColor || item.selectedSize ? " · " : ""}
                          Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm text-[var(--brand-dark)] whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-[var(--border)] mt-4 pt-4 space-y-1.5 text-sm">
                  {typeof order.shippingFee === "number" && (
                    <div className="flex justify-between text-[var(--brand-muted)]">
                      <span>Shipping</span>
                      <span>{formatPrice(order.shippingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-[var(--brand-dark)]">
                    <span>Total</span>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {order && (
                <button
                  type="button"
                  onClick={downloadReceipt}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[var(--brand-rose)] text-white rounded-lg font-medium hover:bg-[var(--brand-pink)] transition-colors"
                >
                  <HugeiconsIcon icon={Download01Icon} size={18} />
                  Download Receipt
                </button>
              )}
              <Link
                href="/shop"
                className="px-7 py-3.5 border border-[var(--border)] text-[var(--brand-dark)] rounded-lg text-sm hover:bg-[var(--brand-blush)] transition-colors flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <HugeiconsIcon icon={Cancel01Icon} size={36} className="text-red-500" />
            </div>
            <h1 className="font-heading text-4xl text-[var(--brand-dark)] mb-3 font-medium">
              Payment not completed
            </h1>
            <p className="text-[var(--brand-muted)] leading-relaxed mb-8">
              Your payment wasn&apos;t confirmed. Your bag is still saved — you can
              try checking out again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cart"
                className="px-7 py-3.5 bg-[var(--brand-rose)] text-white rounded-lg font-medium hover:bg-[var(--brand-pink)] transition-colors"
              >
                Return to Bag
              </Link>
              <Link
                href="/shop"
                className="px-7 py-3.5 border border-[var(--border)] text-[var(--brand-dark)] rounded-lg text-sm hover:bg-[var(--brand-blush)] transition-colors"
              >
                Keep Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="flex flex-1 min-h-screen items-center justify-center">
            <HugeiconsIcon
              icon={Loading03Icon}
              size={40}
              className="animate-spin text-[var(--brand-rose)]"
            />
          </main>
        }
      >
        <CallbackInner />
      </Suspense>
      <Footer />
    </>
  );
}
