export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string;
};

export type NavSection = "overview" | "orders" | "products" | "customers" | "settings";

export const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending:    { label: "Pending",    bg: "bg-amber-50",  text: "text-amber-700" },
  processing: { label: "Processing", bg: "bg-sky-50",    text: "text-sky-700" },
  shipped:    { label: "Shipped",    bg: "bg-violet-50", text: "text-violet-700" },
  delivered:  { label: "Delivered",  bg: "bg-emerald-50", text: "text-emerald-700" },
  cancelled:  { label: "Cancelled",  bg: "bg-red-50",    text: "text-red-600" },
};

export const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", customer: "Adaeze Okonkwo",  email: "adaeze@email.com",  product: "The Luxe Tote",          amount: 45000, status: "delivered",  date: "2026-04-15" },
  { id: "ORD-002", customer: "Temi Balogun",    email: "temi@email.com",    product: "Satin Slip Dress",        amount: 38000, status: "shipped",     date: "2026-04-16" },
  { id: "ORD-003", customer: "Chisom Eze",      email: "chisom@email.com",  product: "Linen Coord Set",         amount: 42000, status: "processing",  date: "2026-04-16" },
  { id: "ORD-004", customer: "Funke Adeyemi",   email: "funke@email.com",   product: "Mini Crossbody Bag",      amount: 28000, status: "pending",     date: "2026-04-17" },
  { id: "ORD-005", customer: "Ngozi Obi",       email: "ngozi@email.com",   product: "Blazer Dress",            amount: 55000, status: "delivered",   date: "2026-04-14" },
  { id: "ORD-006", customer: "Amaka Nwosu",     email: "amaka@email.com",   product: "Evening Clutch",          amount: 18000, status: "cancelled",   date: "2026-04-13" },
  { id: "ORD-007", customer: "Kemi Adeleke",    email: "kemi@email.com",    product: "Wrap Blouse",             amount: 22000, status: "delivered",   date: "2026-04-12" },
  { id: "ORD-008", customer: "Blessing Ojo",    email: "blessing@email.com",product: "Structured Shoulder Bag", amount: 52000, status: "shipped",     date: "2026-04-17" },
];
