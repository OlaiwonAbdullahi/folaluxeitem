import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/apiResponse";
import { serializeOrder } from "@/lib/serialize";
import { verifyCheckout, extractGrossAmount } from "@/lib/questpay";
import { markOrderPaid } from "@/lib/payment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fallback confirmation path (the webhook is the primary source of truth). The
// callback page calls this so the shopper sees an up-to-date status.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return fail(404, "Order not found");

    if (order.paymentStatus === "paid") {
      return ok(serializeOrder(order), "Already paid");
    }

    const { reference } = (await request.json().catch(() => ({}))) ?? {};

    // Bind verification to THIS order's reference. We never verify against a
    // client-supplied reference that differs from the one we issued, otherwise
    // a caller could confirm this order using a stranger's successful payment.
    if (reference && order.paymentReference && reference !== order.paymentReference) {
      return fail(400, "Reference does not match this order");
    }
    const ref = order.paymentReference || reference;
    if (!ref) return fail(400, "No payment reference to verify");

    const result = await verifyCheckout(ref);
    const status = (result?.status as string | undefined)?.toLowerCase();

    if (result && status === "success") {
      const updated = await markOrderPaid(
        order.id,
        ref,
        "payment.verify",
        extractGrossAmount(result),
      );
      // markOrderPaid leaves the order pending if the gross paid was short of
      // the total, so trust the persisted status rather than assuming success.
      if (updated?.paymentStatus === "paid") {
        return ok(serializeOrder(updated), "Payment confirmed");
      }
      return ok(
        serializeOrder(updated ?? order),
        "Payment is being confirmed",
      );
    }

    return ok(serializeOrder(order), "Payment not yet confirmed");
  } catch (error) {
    return handleError(error);
  }
}
