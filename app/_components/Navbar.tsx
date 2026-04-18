"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import { useState, useEffect } from "react";
import CartDrawer from "./CartDrawer";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  Menu01Icon,
  Cancel01Icon,
  Menu11Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

export default function Navbar() {
  const { totalItems, openDrawer } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    // { href: "/shop?category=bags", label: "Bags" },
    //{ href: "/shop?category=clothing", label: "Clothing" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
              : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-col leading-none group"
              aria-label="FolaLuxe Home"
            >
              <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-sm tracking-wide transition-colors duration-200 relative
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-(--brand-pink) after:scale-x-0 after:transition-transform after:duration-200
                    hover:text-(--brand-rose) hover:after:scale-x-100
                    ${
                      isActive(link.href)
                        ? "text-(--brand-rose) font-medium after:scale-x-100"
                        : scrolled
                          ? "text-black"
                          : "text-black"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <button
                id="cart-button"
                onClick={openDrawer}
                aria-label={`Open cart — ${totalItems} items`}
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-(--brand-blush) transition-colors duration-200 text-(--brand-dark)"
              >
                <HugeiconsIcon
                  icon={ShoppingBag01Icon}
                  size={22}
                  strokeWidth={1.5}
                />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-(--brand-rose) text-white text-[10px] font-semibold animate-scale-in">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button
                id="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-(--brand-blush) transition-colors `}
              >
                <HugeiconsIcon
                  icon={menuOpen ? Cancel01Icon : Menu11Icon}
                  size={24}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t border-[var(--border)] overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-base py-1 border-b border-[var(--border)] last:border-0 transition-colors ${
                  isActive(link.href)
                    ? "text-[var(--brand-rose)] font-medium"
                    : "text-[var(--brand-text)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <CartDrawer />
    </>
  );
}
