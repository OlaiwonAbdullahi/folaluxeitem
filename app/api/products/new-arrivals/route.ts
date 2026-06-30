import { prisma } from "@/lib/prisma";
import { ok, handleError } from "@/lib/apiResponse";
import { serializeProduct } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isNewArrival: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return ok(products.map(serializeProduct));
  } catch (error) {
    return handleError(error);
  }
}
