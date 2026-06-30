export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type NavSection = "overview" | "orders" | "products" | "customers" | "settings";

export const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending:    { label: "Pending",    bg: "bg-amber-50",  text: "text-amber-700" },
  processing: { label: "Processing", bg: "bg-sky-50",    text: "text-sky-700" },
  shipped:    { label: "Shipped",    bg: "bg-violet-50", text: "text-violet-700" },
  delivered:  { label: "Delivered",  bg: "bg-emerald-50", text: "text-emerald-700" },
  cancelled:  { label: "Cancelled",  bg: "bg-red-50",    text: "text-red-600" },
};
