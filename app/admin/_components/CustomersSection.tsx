"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { api, type Order } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Customer {
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

export default function CustomersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.adminGetOrders({ limit: 100 });
        setOrders(res.data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load customers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Derive unique customers from their orders.
  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();
    for (const o of orders) {
      const email = o.customerInfo.email;
      const existing = map.get(email);
      const isPaid = o.paymentStatus === "paid";
      if (existing) {
        existing.orders += 1;
        if (isPaid) existing.totalSpent += o.totalPrice;
        if (o.createdAt > existing.lastOrder) existing.lastOrder = o.createdAt;
      } else {
        map.set(email, {
          name: `${o.customerInfo.firstName} ${o.customerInfo.lastName}`.trim(),
          email,
          orders: 1,
          totalSpent: isPaid ? o.totalPrice : 0,
          lastOrder: o.createdAt,
        });
      }
    }
    return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-16">{error}</p>;
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="font-heading text-[15px] font-semibold text-zinc-800">
            Customer Directory
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Everyone who has placed an order
          </p>
        </div>

        <div className="divide-y divide-zinc-50">
          {customers.length === 0 ? (
            <div className="py-16 text-center text-sm text-zinc-400">
              No customers yet.
            </div>
          ) : (
            customers.map((c) => {
              const avatarUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(c.email)}`;
              return (
                <div
                  key={c.email}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50/60 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-100 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarUrl} alt={c.name} className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">{c.email}</p>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wide">
                      Spent
                    </p>
                    <p className="text-sm font-semibold text-zinc-800">
                      {formatPrice(c.totalSpent)}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 bg-zinc-100 text-zinc-600">
                    {c.orders} order{c.orders === 1 ? "" : "s"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
