"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { type Order } from "@/lib/api";
import { STATUS_CONFIG, type OrderStatus } from "./types";

const PAYMENT_BADGE: Record<string, { label: string; cls: string }> = {
  paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Unpaid", cls: "bg-amber-50 text-amber-700" },
  failed: { label: "Failed", cls: "bg-red-50 text-red-600" },
  refunded: { label: "Refunded", cls: "bg-zinc-100 text-zinc-600" },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  paystack: "Paystack",
  cash: "Cash on delivery",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
        {label}
      </p>
      <p className="text-sm text-zinc-800 mt-0.5 break-words">{value || "—"}</p>
    </div>
  );
}

interface OrderDetailsDialogProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailsDialog({
  order,
  onClose,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  const cfg = STATUS_CONFIG[order.orderStatus as OrderStatus];
  const pay = PAYMENT_BADGE[order.paymentStatus] ?? PAYMENT_BADGE.pending;
  const { customerInfo, shippingAddress } = order;
  const fullAddress = [
    shippingAddress.street,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Order {order.orderNumber}
            <span
              className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg?.bg ?? "bg-zinc-100"} ${cfg?.text ?? "text-zinc-600"}`}
            >
              {cfg?.label ?? order.orderStatus}
            </span>
          </DialogTitle>
          <p className="text-xs text-zinc-500">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </DialogHeader>

        <div className="grid gap-6 py-1 max-h-[70vh] overflow-y-auto px-1">
          {/* Customer */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Customer
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field
                label="Name"
                value={`${customerInfo.firstName} ${customerInfo.lastName}`}
              />
              <Field label="Phone" value={customerInfo.phoneNumber} />
              <Field label="Email" value={customerInfo.email} />
            </div>
          </section>

          {/* Shipping */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Shipping Address
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Street" value={shippingAddress.street} />
              <Field label="City" value={shippingAddress.city} />
              <Field label="State" value={shippingAddress.state} />
              <Field label="Postal Code" value={shippingAddress.postalCode} />
            </div>
            {fullAddress && (
              <p className="text-xs text-zinc-500">{fullAddress}</p>
            )}
          </section>

          {/* Items */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
            <div className="rounded-lg border border-zinc-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50/80 text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                    <th className="text-left px-3 py-2">Product</th>
                    <th className="text-left px-3 py-2">Color</th>
                    <th className="text-left px-3 py-2">Size</th>
                    <th className="text-right px-3 py-2">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {order.items.map((item, i) => (
                    <tr key={`${item.productId}-${i}`}>
                      <td className="px-3 py-2 font-mono text-[11px] text-zinc-500">
                        {item.productId}
                      </td>
                      <td className="px-3 py-2 text-zinc-700">
                        {item.selectedColor || "—"}
                      </td>
                      <td className="px-3 py-2 text-zinc-700">
                        {item.selectedSize || "—"}
                      </td>
                      <td className="px-3 py-2 text-right text-zinc-700">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Payment */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Payment
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                  Status
                </p>
                <span
                  className={`inline-block mt-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${pay.cls}`}
                >
                  {pay.label}
                </span>
              </div>
              <Field
                label="Method"
                value={
                  PAYMENT_METHOD_LABEL[order.paymentMethod] ??
                  order.paymentMethod
                }
              />
            </div>
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-sm font-medium text-zinc-600">Total</span>
              <span className="text-lg font-semibold text-zinc-900">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
