"use client";

import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { NAV_ITEMS } from "./navItems";

type Props = {
  onMenuOpen: () => void;
};

export default function AdminHeader({ onMenuOpen }: Props) {
  const pathname = usePathname();
  const currentItem = NAV_ITEMS.find((item) => item.href === pathname);
  const currentLabel = currentItem?.label ?? "Admin";

  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-zinc-100 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          id="admin-sidebar-toggle"
          onClick={onMenuOpen}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-zinc-100 text-zinc-600 transition-colors"
          aria-label="Open sidebar"
        >
          <HugeiconsIcon icon={Menu01Icon} size={20} />
        </button>

        <div>
          <h1
            className="text-lg font-semibold text-zinc-900"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.02em" }}
          >
            {currentLabel}
          </h1>
          <p className="text-xs text-zinc-400 hidden sm:block">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right — Live badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-zinc-500 bg-zinc-50 border border-zinc-100">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>
    </header>
  );
}
