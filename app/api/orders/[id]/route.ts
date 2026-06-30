import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/apiResponse";
import { serializeOrder } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OBJECT_ID = /^[a-f\d]{24}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const order = OBJECT_ID.test(id)
      ? await prisma.order.findUnique({ where: { id } })
      : await prisma.order.findUnique({ where: { orderNumber: id } });
    if (!order) return fail(404, "Order not found");
    return ok(serializeOrder(order));
  } catch (error) {
    return handleError(error);
  }
}
