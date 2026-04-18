import type { NavSection } from "./types";
import { MOCK_ORDERS } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ShoppingBag01Icon,
  Tag01Icon,
  UserGroupIcon,
  Settings03Icon,
} from "@hugeicons/core-free-icons";

export type NavItem = {
  id: NavSection;
  label: string;
  href: string;
  badge?: number;
  icon: React.ReactNode;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/admin",
    icon: <HugeiconsIcon icon={DashboardSquare01Icon} size={18} strokeWidth={1.5} />,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/admin/orders",
    badge: MOCK_ORDERS.filter((o) => o.status === "pending" || o.status === "processing").length,
    icon: <HugeiconsIcon icon={ShoppingBag01Icon} size={18} strokeWidth={1.5} />,
  },
  {
    id: "products",
    label: "Products",
    href: "/admin/products",
    icon: <HugeiconsIcon icon={Tag01Icon} size={18} strokeWidth={1.5} />,
  },
  {
    id: "customers",
    label: "Customers",
    href: "/admin/customers",
    icon: <HugeiconsIcon icon={UserGroupIcon} size={18} strokeWidth={1.5} />,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
    icon: <HugeiconsIcon icon={Settings03Icon} size={18} strokeWidth={1.5} />,
  },
];
