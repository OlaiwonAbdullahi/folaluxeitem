import { prisma } from "./prisma";
import { HttpError } from "./apiResponse";

export interface IncomingItem {
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface BuiltOrder {
  items: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    selectedColor: string;
    selectedSize: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

// Build authoritative line items + totals from the database. Never trusts
// client-supplied prices.
export async function buildOrderFromItems(
  incoming: IncomingItem[],
): Promise<BuiltOrder> {
  if (!Array.isArray(incoming) || incoming.length === 0) {
    throw new HttpError(400, "Order must contain at least one item");
  }

  const ids = [...new Set(incoming.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const items = incoming.map((i) => {
    const product = byId.get(i.productId);
    if (!product) {
      throw new HttpError(400, `Product ${i.productId} no longer exists`);
    }
    const qty = Math.max(1, Math.floor(Number(i.quantity) || 1));
    if (product.stock < qty) {
      throw new HttpError(400, `"${product.name}" is out of stock`);
    }
    const unit = product.salePrice ?? product.price;
    const main = product.images.find((img) => img.isMain) ?? product.images[0];
    return {
      productId: product.id,
      name: product.name,
      image: main?.url ?? "",
      quantity: qty,
      price: unit,
      selectedColor: i.selectedColor ?? "",
      selectedSize: i.selectedSize ?? "",
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // No shipping fee — delivery is free.
  return { items, subtotal, shippingFee: 0, total: subtotal };
}

export async function generateOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate =
      "FL" +
      Date.now().toString(36).toUpperCase().slice(-6) +
      Math.random().toString(36).toUpperCase().slice(2, 5);
    const exists = await prisma.order.findUnique({
      where: { orderNumber: candidate },
    });
    if (!exists) return candidate;
  }
  return "FL" + Date.now().toString(36).toUpperCase();
}
