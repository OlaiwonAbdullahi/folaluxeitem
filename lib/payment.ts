import { prisma } from "./prisma";
import type { Order } from "@prisma/client";

// Idempotently mark an order paid. Uses a guarded updateMany as an atomic
// compare-and-set: only the first call (paymentStatus != paid) flips the order
// and decrements stock, so duplicate webhook deliveries are safe.
export async function markOrderPaid(
  orderId: string,
  reference: string,
  event: string,
): Promise<Order | null> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return null;

  const result = await prisma.order.updateMany({
    where: { id: orderId, paymentStatus: { not: "paid" } },
    data: {
      paymentStatus: "paid",
      orderStatus: "processing",
      paymentReference: reference,
    },
  });

  // Audit log (best effort) — does not gate processing.
  await prisma.processedWebhook
    .create({ data: { reference, event } })
    .catch(() => {});

  if (result.count === 0) {
    // Already paid — nothing further to do.
    return prisma.order.findUnique({ where: { id: orderId } });
  }

  // First time paid → decrement stock for each line item.
  for (const item of order.items) {
    await prisma.product
      .update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
      .catch(() => {
        // Product may have been deleted since the order was placed.
      });
  }

  return prisma.order.findUnique({ where: { id: orderId } });
}

// Mark a still-pending order failed/cancelled. Never touches an already-paid
// order, so a late-matched payment can still succeed afterwards.
export async function markOrderFailed(
  orderId: string,
  reference: string,
): Promise<Order | null> {
  await prisma.order.updateMany({
    where: { id: orderId, paymentStatus: "pending" },
    data: {
      paymentStatus: "failed",
      orderStatus: "cancelled",
      paymentReference: reference,
    },
  });
  return prisma.order.findUnique({ where: { id: orderId } });
}
