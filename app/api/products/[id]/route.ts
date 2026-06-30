import type { Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/apiResponse";
import { serializeProduct } from "@/lib/serialize";
import { parseProductForm, uniqueSlug } from "@/lib/productForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OBJECT_ID = /^[a-f\d]{24}$/i;

// Resolve a product by Mongo ObjectId (admin/detail links) or slug (SEO URLs).
async function findProduct(idOrSlug: string): Promise<Product | null> {
  if (OBJECT_ID.test(idOrSlug)) {
    const byId = await prisma.product.findUnique({ where: { id: idOrSlug } });
    if (byId) return byId;
  }
  return prisma.product.findUnique({ where: { slug: idOrSlug } });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await findProduct(id);
    if (!product) return fail(404, "Product not found");
    return ok(serializeProduct(product));
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const existing = await findProduct(id);
    if (!existing) return fail(404, "Product not found");

    const formData = await request.formData();
    const data = await parseProductForm(formData, {
      isUpdate: true,
      currentImages: existing.images,
    });
    const slug =
      data.name !== existing.name
        ? await uniqueSlug(data.name, existing.id)
        : existing.slug;

    const product = await prisma.product.update({
      where: { id: existing.id },
      data: { ...data, slug },
    });

    return ok(serializeProduct(product), "Product updated");
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const existing = await findProduct(id);
    if (!existing) return fail(404, "Product not found");

    await prisma.product.delete({ where: { id: existing.id } });
    return ok(null, "Product deleted");
  } catch (error) {
    return handleError(error);
  }
}
