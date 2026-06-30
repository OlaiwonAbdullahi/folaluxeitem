import type { Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";

const OBJECT_ID = /^[a-f\d]{24}$/i;

// Server-side product lookup shared by generateMetadata, the product page and
// the dynamic OG image route. Mirrors the resolution in app/api/products/[id].
async function findProduct(idOrSlug: string): Promise<Product | null> {
  if (OBJECT_ID.test(idOrSlug)) {
    const byId = await prisma.product.findUnique({ where: { id: idOrSlug } });
    if (byId) return byId;
  }
  return prisma.product.findUnique({ where: { slug: idOrSlug } });
}

export async function getProduct(idOrSlug: string) {
  const product = await findProduct(idOrSlug);
  return product ? serializeProduct(product) : null;
}

// Lightweight list for the sitemap: just the fields we need to build URLs.
export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return products.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
}
