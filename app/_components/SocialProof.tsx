import { HugeiconsIcon } from "@hugeicons/react";
import { TiktokIcon } from "@hugeicons/core-free-icons";

export default function SocialProof() {
  return (
    <section className="section-padding py-20 max-w-7xl mx-auto w-full">
      <div className="rounded-2xl overflow-hidden bg-[var(--brand-dark)] px-8 py-14 sm:px-16 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-6">
          <HugeiconsIcon icon={TiktokIcon} size={14} className="text-white opacity-80" />
          <span className="text-white/80 text-xs tracking-widest uppercase font-medium">As seen on TikTok</span>
        </div>

        <h2
          className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4"
          style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
        >
          New styles, TikTok first
        </h2>
        <p className="text-white/55 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
          We drop new pieces on TikTok before anywhere else. Follow <strong className="text-white">@folaluxeitems</strong> so you never miss one.
        </p>
        <a
          href="https://www.tiktok.com/@folaluxeitems"
          target="_blank"
          rel="noopener noreferrer"
          id="tiktok-follow-cta"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[var(--brand-dark)] rounded-lg font-semibold text-sm hover:bg-[var(--brand-blush)] transition-colors"
        >
          <HugeiconsIcon icon={TiktokIcon} size={16} />
          @folaluxeitems
        </a>
      </div>
    </section>
  );
}

