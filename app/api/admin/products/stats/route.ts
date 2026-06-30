import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, handleError } from "@/lib/apiResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const [total, outOfStock, featured, byCategory] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 0 } } }),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.product.groupBy({ by: ["category"], _count: { _all: true } }),
    ]);

    return ok({
      total,
      inStock: total - outOfStock,
      outOfStock,
      featured,
      byCategory: byCategory.map((c) => ({
        category: c.category,
        count: c._count._all,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}
