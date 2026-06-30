import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, handleError } from "@/lib/apiResponse";
import { serializeOrder } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const sp = new URL(request.url).searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(sp.get("limit")) || 20));
    const status = sp.get("status");
    const paymentStatus = sp.get("paymentStatus");

    const where: Prisma.OrderWhereInput = {};
    if (status) where.orderStatus = status as Prisma.OrderWhereInput["orderStatus"];
    if (paymentStatus) {
      where.paymentStatus = paymentStatus as Prisma.OrderWhereInput["paymentStatus"];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return ok({
      orders: orders.map(serializeOrder),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleError(error);
  }
}
