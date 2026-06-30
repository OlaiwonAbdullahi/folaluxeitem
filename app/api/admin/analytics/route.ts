import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, handleError } from "@/lib/apiResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);

    const [totalUsers, totalOrders, revenueAgg, ordersByStatusRaw, paidOrders] =
      await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          where: { paymentStatus: "paid" },
          _sum: { totalPrice: true },
        }),
        prisma.order.groupBy({
          by: ["orderStatus"],
          _count: { _all: true },
        }),
        prisma.order.findMany({
          where: { paymentStatus: "paid" },
          select: { items: true, totalPrice: true, createdAt: true },
        }),
      ]);

    // Top products by quantity sold across paid orders.
    const tally = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const order of paidOrders) {
      for (const item of order.items) {
        const entry =
          tally.get(item.productId) ??
          { name: item.name, quantity: 0, revenue: 0 };
        entry.quantity += item.quantity;
        entry.revenue += item.price * item.quantity;
        tally.set(item.productId, entry);
      }
    }
    const topProducts = [...tally.entries()]
      .map(([productId, v]) => ({ productId, ...v }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Revenue per day for the last 7 days.
    const days: { date: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ date: d.toISOString().slice(0, 10), revenue: 0 });
    }
    const byDate = new Map(days.map((d) => [d.date, d]));
    for (const order of paidOrders) {
      const key = order.createdAt.toISOString().slice(0, 10);
      const bucket = byDate.get(key);
      if (bucket) bucket.revenue += order.totalPrice;
    }

    return ok({
      totalUsers,
      totalOrders,
      totalRevenue: revenueAgg._sum.totalPrice ?? 0,
      ordersByStatus: ordersByStatusRaw.map((o) => ({
        status: o.orderStatus,
        count: o._count._all,
      })),
      topProducts,
      revenueByDate: days,
    });
  } catch (error) {
    return handleError(error);
  }
}
