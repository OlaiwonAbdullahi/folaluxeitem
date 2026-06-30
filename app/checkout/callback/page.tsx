"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../_components/Navbar";
import Footer from "../../_components/Footer";
import { useCart } from "../../_components/CartContext";
import { api } from "@/lib/api";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Loading03Icon,
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
  const [orderNumber, setOrderNumber] = useState<string>("");
  const ran = useRef(false);

  const ref = params.get("ref");
  const checkoutStatus = params.get("checkout_status");

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
          setOrderNumber(res.data.orderNumber);
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

  return (
    <main className="flex flex-col flex-1 min-h-screen items-center justify-center px-4 py-24">
      <div className="text-center max-w-md mx-auto">
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
              {orderNumber && (
                <strong className="text-[var(--brand-dark)]">#{orderNumber}</strong>
              )}{" "}
              has been received and is now being processed.
            </p>
            <p className="text-sm text-[var(--brand-muted)] mb-8">
              You&apos;ll receive delivery updates via email and phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="px-7 py-3.5 bg-[var(--brand-rose)] text-white rounded-lg font-medium hover:bg-[var(--brand-pink)] transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="px-7 py-3.5 border border-[var(--border)] text-[var(--brand-dark)] rounded-lg text-sm hover:bg-[var(--brand-blush)] transition-colors"
              >
                Back to Home
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
