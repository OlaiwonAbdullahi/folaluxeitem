"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/products";
import { MOCK_ORDERS, STATUS_CONFIG } from "./types";

export default function CustomersSection() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2
            className="text-sm font-semibold text-zinc-800"
            style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}
          >
            Customer Directory
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            All customers who have placed an order
          </p>
        </div>

        <div className="divide-y divide-zinc-50">
          {MOCK_ORDERS.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status];
            const avatarUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(order.customer)}`;
            return (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50/60 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-100 flex-shrink-0 relative">
                  <img
                    src={avatarUrl}
                    alt={order.customer}
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800">
                    {order.customer}
                  </p>
                  <p className="text-xs text-zinc-400">{order.email}</p>
                </div>

                {/* Last order amount */}
                <div className="text-right hidden sm:block flex-shrink-0">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wide">
                    Last order
                  </p>
                  <p className="text-sm font-semibold text-zinc-800">
                    {formatPrice(order.amount)}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text}`}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
