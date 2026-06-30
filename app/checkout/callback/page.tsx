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

  // Build a self-contained HTML receipt and download it. No dependencies — the
  // file opens in any browser and can be printed to PDF.
  function downloadReceipt() {
    if (!order) return;
    const esc = (s: unknown) =>
      String(s ?? "").replace(
        /[&<>"]/g,
        (c) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] || c,
      );
    const subtotal = order.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const date = new Date(order.createdAt).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const rows = order.items
      .map((i) => {
        const variant = [i.selectedColor, i.selectedSize]
          .filter(Boolean)
          .join(" · ");
        return `<tr>
          <td>${esc(i.name)}${variant ? `<div class="variant">${esc(variant)}</div>` : ""}</td>
          <td class="num">${i.quantity}</td>
          <td class="num">${esc(formatPrice(i.price))}</td>
          <td class="num">${esc(formatPrice(i.price * i.quantity))}</td>
        </tr>`;
      })
      .join("");
    const c = order.customerInfo;
    const a = order.shippingAddress;
    const html = `<!doctype html><html><head><meta charset="utf-8">
<title>FolaLuxe Receipt ${esc(order.orderNumber)}</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1f2937;max-width:720px;margin:40px auto;padding:0 24px}
  h1{font-size:24px;margin:0}
  .brand{color:#be123c;font-weight:700;letter-spacing:.5px}
  .muted{color:#6b7280;font-size:13px}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #f1f1f3;padding-bottom:16px;margin-bottom:24px}
  .grid{display:flex;gap:40px;margin-bottom:24px;font-size:13px}
  .grid h3{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#9ca3af;margin:0 0 6px}
  table{width:100%;border-collapse:collapse;font-size:14px}
  th{text-align:left;border-bottom:1px solid #e5e7eb;padding:8px 0;font-size:11px;text-transform:uppercase;color:#9ca3af;letter-spacing:.5px}
  td{padding:10px 0;border-bottom:1px solid #f3f4f6;vertical-align:top}
  .num{text-align:right;white-space:nowrap}
  .variant{color:#9ca3af;font-size:12px;margin-top:2px}
  .totals{margin-top:16px;margin-left:auto;width:240px;font-size:14px}
  .totals div{display:flex;justify-content:space-between;padding:4px 0}
  .totals .grand{border-top:2px solid #f1f1f3;margin-top:6px;padding-top:10px;font-weight:700;font-size:16px}
  .paid{display:inline-block;background:#ecfdf5;color:#059669;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;margin-top:8px}
  footer{margin-top:40px;text-align:center;color:#9ca3af;font-size:12px}
</style></head><body>
  <div class="head">
    <div>
      <h1 class="brand">FolaLuxe</h1>
      <div class="muted">Payment Receipt</div>
      <div class="paid">PAID</div>
    </div>
    <div class="muted" style="text-align:right">
      <div><strong>Order #${esc(order.orderNumber)}</strong></div>
      <div>${esc(date)}</div>
      ${order.paymentReference ? `<div>Ref: ${esc(order.paymentReference)}</div>` : ""}
    </div>
  </div>
  <div class="grid">
    <div>
      <h3>Billed to</h3>
      <div>${esc(c.firstName)} ${esc(c.lastName)}</div>
      <div>${esc(c.email)}</div>
      <div>${esc(c.phoneNumber)}</div>
    </div>
    <div>
      <h3>Ship to</h3>
      <div>${esc(a.street)}</div>
      <div>${esc(a.city)}${a.state ? `, ${esc(a.state)}` : ""}</div>
      ${a.postalCode ? `<div>${esc(a.postalCode)}</div>` : ""}
    </div>
  </div>
  <table>
    <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div><span>Subtotal</span><span>${esc(formatPrice(subtotal))}</span></div>
    ${typeof order.shippingFee === "number" ? `<div><span>Shipping</span><span>${esc(formatPrice(order.shippingFee))}</span></div>` : ""}
    <div class="grand"><span>Total</span><span>${esc(formatPrice(order.totalPrice))}</span></div>
  </div>
  <footer>Thank you for shopping with FolaLuxe — questions? Reply to your order confirmation email.</footer>
</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FolaLuxe-Receipt-${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
