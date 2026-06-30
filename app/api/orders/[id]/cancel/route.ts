import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/apiResponse";
import { serializeOrder } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return fail(404, "Order not found");
    if (order.paymentStatus === "paid") {
      return fail(400, "Cannot cancel a paid order");
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: "cancelled",
        paymentStatus: order.paymentStatus === "pending" ? "failed" : order.paymentStatus,
      },
    });

    return ok(serializeOrder(updated), "Order cancelled");
  } catch (error) {
    return handleError(error);
  }
}
