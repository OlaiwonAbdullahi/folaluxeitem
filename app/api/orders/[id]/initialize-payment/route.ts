import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/apiResponse";
import { initializeCheckout } from "@/lib/questpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return fail(404, "Order not found");
    if (order.paymentStatus === "paid") {
      return fail(400, "Order has already been paid");
    }

    const reference = `FL-${order.id}-${Date.now()}`;
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const checkout = await initializeCheckout({
      reference,
      email: order.customerInfo.email,
      amount: order.totalPrice,
      description: `FolaLuxe order ${order.orderNumber}`,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      return_url: `${appUrl}/checkout/callback`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentReference: reference },
    });

    // Shape mirrors the existing `PaymentInitialization` type in lib/api.ts.
    return ok({
      authorizationUrl: checkout.checkout_url,
      accessCode: "",
      reference,
    });
  } catch (error) {
    return handleError(error);
  }
}
