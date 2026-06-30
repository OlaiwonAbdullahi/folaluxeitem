"use client";

import { useState, useEffect } from "react";
import { api, AnalyticsData, Order, Product } from "@/lib/api";
import type { OrderStatus } from "./types";
import { STATUS_CONFIG } from "./types";
import StatCard from "./StatCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dollar01Icon,
  PackageIcon,
  ShoppingBasket01Icon,
  UserGroupIcon,
  ShoppingBag01Icon,
  TShirtIcon,
} from "@hugeicons/core-free-icons";

// Helper to format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function OverviewSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [analyticsRes, ordersRes, productsRes] = await Promise.all([
          api.adminGetAnalytics(),
          api.adminGetOrders({ limit: 10 }),
          api.getProducts({ limit: 5, sort: "newest" }),
        ]);

        setAnalytics(analyticsRes.data);
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
        setTopProducts(productsRes.data.products.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <Skeleton className="lg:col-span-3 h-80 rounded-2xl" />
          <Skeleton className="lg:col-span-2 h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const totalRevenue = analytics?.totalRevenue || 0;
  const totalOrders = analytics?.totalOrders || 0;
  const totalProducts = topProducts.length;
  const totalCustomers = analytics?.totalUsers || 0;

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          sub="Excl. cancelled orders"
          trend={{ val: "12.4%", up: true }}
          iconColors="bg-zinc-900 text-white"
          icon={<HugeiconsIcon icon={Dollar01Icon} size={20} />}
        />
        <StatCard
          label="Total Orders"
          value={`${totalOrders}`}
          sub="All orders"
          trend={{ val: "8.1%", up: true }}
          iconColors="bg-violet-50 text-violet-600"
          icon={<HugeiconsIcon icon={PackageIcon} size={20} />}
        />
        <StatCard
          label="Products"
          value={`${totalProducts}`}
          sub="Latest products"
          iconColors="bg-emerald-50 text-emerald-600"
          icon={<HugeiconsIcon icon={ShoppingBasket01Icon} size={20} />}
        />
        <StatCard
          label="Customers"
          value={`${totalCustomers}`}
          sub="Registered users"
          trend={{ val: "3.2%", up: false }}
          iconColors="bg-amber-50 text-amber-600"
          icon={<HugeiconsIcon icon={UserGroupIcon} size={20} />}
        />
      </div>

      {/* ── Two-column lower ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <h2
              className="text-sm font-semibold text-zinc-800"
              style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}
            >
              Recent Orders
            </h2>
            <button
              onClick={() => router.push("/admin/orders")}
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--brand-pink)" }}
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-zinc-50">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const cfg = STATUS_CONFIG[order.orderStatus as OrderStatus];
                const avatarUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(order.customerInfo.email)}`;
                return (
                  <div
                    key={order._id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-50/70 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-100 flex-shrink-0 relative">
                      <img
                        src={avatarUrl}
                        alt={order.customerInfo.firstName}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {order.customerInfo.firstName}{" "}
                        {order.customerInfo.lastName}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-zinc-800">
                        {formatPrice(order.totalPrice)}
                      </p>
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${cfg?.bg || "bg-zinc-100"} ${cfg?.text || "text-zinc-600"}`}
                      >
                        {cfg?.label || order.orderStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                  <HugeiconsIcon
                    icon={PackageIcon}
                    size={32}
                    className="text-zinc-400"
                  />
                </div>
                <p className="text-sm font-medium text-zinc-800 mb-1">
                  No orders yet
                </p>
                <p className="text-xs text-zinc-400">
                  Orders will appear here when customers place them
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <h2
              className="text-sm font-semibold text-zinc-800"
              style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}
            >
              Latest Products
            </h2>
            <button
              onClick={() => router.push("/admin/products")}
              className="text-xs font-medium"
              style={{ color: "var(--brand-pink)" }}
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-zinc-50">
            {topProducts.length > 0 ? (
              topProducts.map((p, i) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50/70 transition-colors"
                >
                  <span className="text-xs font-bold text-zinc-300 w-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg"
                    style={{
                      background:
                        p.category === "bags"
                          ? "linear-gradient(135deg, #fdf2f5, #fce4ec)"
                          : "linear-gradient(135deg, #faf0f4, #fce4ec)",
                    }}
                  >
                    <HugeiconsIcon
                      icon={
                        p.category === "bags" ? ShoppingBag01Icon : TShirtIcon
                      }
                      size={20}
                      className="text-zinc-600"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      {p.category}
                    </p>
                  </div>
                  <p
                    className="text-xs font-bold flex-shrink-0"
                    style={{ color: "var(--brand-rose)" }}
                  >
                    {formatPrice(p.salePrice || p.price)}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                  <HugeiconsIcon
                    icon={ShoppingBasket01Icon}
                    size={32}
                    className="text-zinc-400"
                  />
                </div>
                <p className="text-sm font-medium text-zinc-800 mb-1">
                  No products yet
                </p>
                <p className="text-xs text-zinc-400">
                  Add your first product to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Status breakdown ── */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5">
        <h2
          className="text-sm font-semibold text-zinc-800 mb-4"
          style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}
        >
          Order Status Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((status) => {
            const count = recentOrders.filter(
              (o) => o.orderStatus === status,
            ).length;
            const cfg = STATUS_CONFIG[status];
            return (
              <div
                key={status}
                className={`rounded-xl px-4 py-3 text-center ${cfg.bg}`}
              >
                <p
                  className={`text-2xl font-bold ${cfg.text}`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {count}
                </p>
                <p className={`text-xs font-medium mt-0.5 ${cfg.text}`}>
                  {cfg.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
