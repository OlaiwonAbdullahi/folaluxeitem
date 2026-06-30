"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { api, type Order } from "@/lib/api";
import { STATUS_CONFIG } from "./types";
import type { OrderStatus } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/ui/skeleton";
import OrderDetailsDialog from "./OrderDetailsDialog";

const PAYMENT_BADGE: Record<string, { label: string; cls: string }> = {
  paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Unpaid", cls: "bg-amber-50 text-amber-700" },
  failed: { label: "Failed", cls: "bg-red-50 text-red-600" },
  refunded: { label: "Refunded", cls: "bg-zinc-100 text-zinc-600" },
};

export default function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.adminGetOrders({ limit: 100 });
        setOrders(res.data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const name =
        `${o.customerInfo.firstName} ${o.customerInfo.lastName}`.toLowerCase();
      const matchSearch =
        name.includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerInfo.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.orderStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-16">{error}</p>;
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <HugeiconsIcon icon={Search01Icon} size={18} />
          </div>
          <input
            id="admin-order-search"
            type="text"
            placeholder="Search by customer, order number or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </div>
        <select
          id="admin-order-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          className="px-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Items</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-center px-4 py-3">Payment</th>
                <th className="text-center px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-zinc-400 text-sm">
                    {orders.length === 0
                      ? "No orders yet."
                      : "No orders match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const cfg = STATUS_CONFIG[order.orderStatus as OrderStatus];
                  const pay = PAYMENT_BADGE[order.paymentStatus] ?? PAYMENT_BADGE.pending;
                  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                  return (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-zinc-50/60 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 font-mono text-[11px] text-zinc-400">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-zinc-800 leading-none">
                          {order.customerInfo.firstName} {order.customerInfo.lastName}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {order.customerInfo.email}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-zinc-600 hidden md:table-cell">
                        {itemCount} item{itemCount === 1 ? "" : "s"}
                      </td>
                      <td className="px-4 py-4 text-zinc-400 text-xs hidden sm:table-cell">
                        {new Date(order.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-zinc-800">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full ${pay.cls}`}>
                          {pay.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg?.bg ?? "bg-zinc-100"} ${cfg?.text ?? "text-zinc-600"}`}>
                          {cfg?.label ?? order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-zinc-50 bg-zinc-50/40 text-xs text-zinc-400">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdated={(updated) => {
          setOrders((prev) =>
            prev.map((o) => (o._id === updated._id ? updated : o)),
          );
          setSelectedOrder(updated);
        }}
      />
    </div>
  );
}
