import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/apiResponse";
import { serializeOrder } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const { orderStatus, trackingNumber } = (await request.json()) ?? {};

    if (!STATUSES.includes(orderStatus)) {
      return fail(400, "Invalid order status");
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return fail(404, "Order not found");

    const order = await prisma.order.update({
      where: { id },
      data: {
        orderStatus,
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      },
    });

    return ok(serializeOrder(order), "Order updated");
  } catch (error) {
    return handleError(error);
  }
}
