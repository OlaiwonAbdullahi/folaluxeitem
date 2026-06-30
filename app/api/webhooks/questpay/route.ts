import { verifyWebhookSignature } from "@/lib/questpay";
import { markOrderPaid, markOrderFailed } from "@/lib/payment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Extract our order id from metadata, or parse it out of the reference we
// generated (`FL-<orderId>-<timestamp>`).
function resolveOrderId(data: Record<string, unknown>): string | null {
  const metadata = data?.metadata as Record<string, unknown> | undefined;
  if (metadata?.orderId) return String(metadata.orderId);
  const reference = String(data?.reference ?? "");
  const parts = reference.split("-");
  if (parts.length >= 3 && /^[a-f\d]{24}$/i.test(parts[1])) return parts[1];
  return null;
}

export async function POST(request: Request) {
  // 1. Capture the raw body BEFORE parsing — Questpay signs the exact bytes.
  const rawBody = await request.text();
  const signature = request.headers.get("x-questpay-signature");
  const event = request.headers.get("x-questpay-event");

  // 2 & 3. Verify the HMAC signature (timing-safe). Reject if invalid.
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn("[questpay] webhook rejected: invalid signature", { event });
    return new Response("Invalid signature", { status: 400 });
  }

  let payload: { event?: string; data?: Record<string, unknown> };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const eventName = payload.event || event || "";
  const data = (payload.data ?? {}) as Record<string, unknown>;
  const reference = String(data.reference ?? "");

  try {
    if (eventName === "payment.received" && data.status === "success") {
      // Only act when QuestPay linked the payment to one of our checkouts.
      if (!data.metadata && !data.checkout) {
        console.warn(
          "[questpay] payment.received with no checkout/metadata link — logging only",
          { reference },
        );
        return new Response("OK (unlinked)", { status: 200 });
      }
      const orderId = resolveOrderId(data);
      if (!orderId) {
        console.warn("[questpay] could not resolve order id", { reference });
        return new Response("OK (no order)", { status: 200 });
      }
      await markOrderPaid(orderId, reference, eventName);
    } else if (eventName === "checkout.failed") {
      const orderId = resolveOrderId(data);
      if (orderId) await markOrderFailed(orderId, reference);
    }
  } catch (error) {
    // Log but still 200 so QuestPay does not hammer retries on a transient
    // error; reconciliation can be done via verify.
    console.error("[questpay] webhook processing error:", error);
  }

  return new Response("OK", { status: 200 });
}
