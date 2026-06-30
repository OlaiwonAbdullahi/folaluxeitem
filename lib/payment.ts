import { prisma } from "./prisma";
import type { Order } from "@prisma/client";

// Idempotently mark an order paid. Uses a guarded updateMany as an atomic
// compare-and-set: only the first call (paymentStatus != paid) flips the order
// and decrements stock, so duplicate webhook deliveries are safe.
//
// `amountPaid` is the gross amount QuestPay reports as received. When provided
// it MUST cover the order total — an underpaid (or partially-matched) transfer
// never flips the order to paid, so we cannot be tricked into fulfilling an
// order that was not paid in full.
export async function markOrderPaid(
  orderId: string,
  reference: string,
  event: string,
  amountPaid?: number | null,
): Promise<Order | null> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return null;

  // Already settled — return as-is (covers duplicate deliveries cheaply).
  if (order.paymentStatus === "paid") return order;

  // Amount guard: refuse to mark paid if the gross paid is short of the total.
  if (typeof amountPaid === "number" && amountPaid < order.totalPrice) {
    console.warn("[questpay] underpayment — not marking paid", {
      orderId,
      reference,
      expected: order.totalPrice,
      amountPaid,
    });
    await prisma.processedWebhook
      .create({ data: { reference, event: `${event}:underpaid` } })
      .catch(() => {});
    return order;
  }

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
