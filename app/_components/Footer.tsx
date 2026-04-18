"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  TiktokIcon,
  WhatsappIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[var(--brand-dark)] text-white/80"
      style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
    >
      {/* Top band */}
      <div className="border-b border-white/10 py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="block mb-4">
              <span
                className="text-3xl tracking-widest uppercase text-white"
                style={{
                  fontFamily: "var(--font-heading), Georgia, serif",
                  fontWeight: 600,
                }}
              >
                Fola<span style={{ color: "var(--brand-pink)" }}>Luxe</span>
              </span>
            </Link>
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Curated luxury fashion — clothing and bags for women who know what
              they want. Boutique quality, delivered to you.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.tiktok.com/@folaluxeitems"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow FolaLuxe on TikTok"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--brand-rose)] flex items-center justify-center transition-colors duration-200"
              >
                <HugeiconsIcon icon={TiktokIcon} size={16} />
              </a>
              <a
                href="https://wa.me/2348000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp FolaLuxe"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors duration-200"
              >
                <HugeiconsIcon icon={WhatsappIcon} size={16} />
              </a>
              <a
                href="mailto:folaluxeitems@gmail.com"
                aria-label="Email FolaLuxe"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--brand-rose)] flex items-center justify-center transition-colors duration-200"
              >
                <HugeiconsIcon icon={Mail01Icon} size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-white/55">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=bags", label: "Bags" },
                { href: "/shop?category=clothing", label: "Clothing" },
                { href: "/shop?filter=new", label: "New Arrivals" },
                { href: "/shop?filter=sale", label: "Sale" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[var(--brand-pink)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Help
            </h4>
            <ul className="space-y-3 text-sm text-white/55">
              {[
                { href: "/about", label: "About Us" },
                { href: "/about#contact", label: "Contact" },
                { href: "/about#faq", label: "FAQ" },
                { href: "/about#shipping", label: "Shipping Info" },
                { href: "/about#returns", label: "Returns Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[var(--brand-pink)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Stay in the loop
            </h4>
            <p className="text-sm text-white/55 mb-4 leading-relaxed">
              New drops, exclusive deals, style inspo — straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                id="footer-newsletter-email"
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 rounded-full bg-white/10 text-white placeholder-white/30 text-sm border border-white/15 focus:outline-none focus:border-[var(--brand-pink)] transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[var(--brand-rose)] text-white text-sm font-medium hover:bg-[var(--brand-pink)] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
        <p>© {year} FolaLuxe. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span>Payments:</span>
          <span className="px-2 py-1 rounded bg-white/10 text-white/60 font-medium">
            Bank Transfer
          </span>
          <span className="px-2 py-1 rounded bg-white/10 text-white/60 font-medium">
            Pay on Delivery
          </span>
        </div>
      </div>
    </footer>
  );
}
