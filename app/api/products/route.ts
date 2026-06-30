import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, created, handleError } from "@/lib/apiResponse";
import { serializeProduct } from "@/lib/serialize";
import { parseProductForm, uniqueSlug } from "@/lib/productForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = ["bags", "clothing", "accessories"];

function buildOrderBy(
  sort: string | null,
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "newest":
    case "rating": // no rating field — fall back to newest
    default:
      return { createdAt: "desc" };
  }
}

export async function GET(request: Request) {
  try {
    const sp = new URL(request.url).searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const limit = Math.min(60, Math.max(1, Number(sp.get("limit")) || 12));
    const category = sp.get("category");
    const search = sp.get("search");
    const minPrice = sp.get("minPrice");
    const maxPrice = sp.get("maxPrice");

    const where: Prisma.ProductWhereInput = {};
    if (category && CATEGORIES.includes(category)) {
      where.category = category as Prisma.ProductWhereInput["category"];
    }
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (sp.get("featured") === "true") where.isFeatured = true;
    if (sp.get("newArrival") === "true") where.isNewArrival = true;
    if (sp.get("bestseller") === "true") where.isBestseller = true;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: buildOrderBy(sp.get("sort")),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return ok({
      products: items.map(serializeProduct),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const formData = await request.formData();
    const data = await parseProductForm(formData, { isUpdate: false });
    const slug = await uniqueSlug(data.name);

    const product = await prisma.product.create({
      data: { ...data, slug },
    });

    return created(serializeProduct(product), "Product created");
  } catch (error) {
    return handleError(error);
  }
}
