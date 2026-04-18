"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { NAV_ITEMS } from "./navItems";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const adminAvatar = `https://api.dicebear.com/9.x/glass/svg?seed=Admin`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-white border-r border-zinc-100
          transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
          md:translate-x-0 md:static md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-100">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
            <Image src="/logo.png" alt="Logo" width={150} height={150} />
          </div>
          <div className="leading-none">
            <p
              className="text-[15px] font-semibold text-zinc-800"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.04em",
              }}
            >
              Fola<span style={{ color: "var(--brand-pink)" }}>Luxeitem</span>
            </p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.22em] text-zinc-400 font-semibold">
            Main Menu
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    id={`admin-nav-${item.id}`}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-150 text-left group
                      ${
                        isActive
                          ? "bg-zinc-900 text-white shadow-sm"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      }
                    `}
                  >
                    <span
                      className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-600"}`}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item &&
                      typeof item.badge === "number" &&
                      item.badge > 0 && (
                        <span
                          className="ml-auto text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isActive
                              ? "var(--brand-pink)"
                              : "var(--brand-rose)",
                            color: "white",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Storefront link */}
          <div className="mt-5 pt-5 border-t border-zinc-100">
            <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.22em] text-zinc-400 font-semibold">
              Storefront
            </p>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-all duration-150"
            >
              <HugeiconsIcon
                icon={Link01Icon}
                size={17}
                className="text-zinc-400 flex-shrink-0"
              />
              View Store
            </Link>
          </div>
        </nav>

        {/* User badge */}
        <div className="px-4 py-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-50">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-100 flex-shrink-0 relative">
              <Image
                src={adminAvatar}
                alt="Admin"
                fill
                className="object-cover"
              />
            </div>
            <div className="leading-none min-w-0">
              <p className="text-xs font-semibold text-zinc-800 truncate">
                Admin
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                admin@folaluxe.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
