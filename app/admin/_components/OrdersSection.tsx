"use client";

import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/products";
import { MOCK_ORDERS, STATUS_CONFIG } from "./types";
import type { OrderStatus } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

const SearchIcon = () => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
    <HugeiconsIcon icon={Search01Icon} size={18} />
  </div>
);

export default function OrdersSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        o.customer.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon />
          <input
            id="admin-order-search"
            type="text"
            placeholder="Search by customer, order ID or product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </div>
        <select
          id="admin-order-status-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as OrderStatus | "all")
          }
          className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                  Order
                </th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-zinc-400 hidden md:table-cell">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-zinc-400 hidden sm:table-cell">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                  Amount
                </th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-14 text-zinc-400 text-sm"
                  >
                    No orders match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const cfg = STATUS_CONFIG[order.status];
                  const avatarUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(order.customer)}`;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-[11px] text-zinc-400">
                        {order.id}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-100 flex-shrink-0 relative">
                            <img
                              src={avatarUrl}
                              alt={order.customer}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-zinc-800 leading-none">
                              {order.customer}
                            </p>
                            <p className="text-[11px] text-zinc-400 mt-1">
                              {order.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-600 hidden md:table-cell">
                        {order.product}
                      </td>
                      <td className="px-4 py-4 text-zinc-400 text-xs hidden sm:table-cell">
                        {new Date(order.date).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-zinc-800">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
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
          Showing {filtered.length} of {MOCK_ORDERS.length} orders
        </div>
      </div>
    </div>
  );
}
