import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/apiResponse";
import { serializeOrder } from "@/lib/serialize";
import { verifyCheckout } from "@/lib/questpay";
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
    const ref = reference || order.paymentReference;
    if (!ref) return fail(400, "No payment reference to verify");

    const result = await verifyCheckout(ref);
    const status = (result?.status as string | undefined)?.toLowerCase();

    if (result && status === "success") {
      const updated = await markOrderPaid(order.id, ref, "payment.verify");
      return ok(serializeOrder(updated ?? order), "Payment confirmed");
    }

    return ok(serializeOrder(order), "Payment not yet confirmed");
  } catch (error) {
    return handleError(error);
  }
}
