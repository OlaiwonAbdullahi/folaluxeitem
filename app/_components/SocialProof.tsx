import { HugeiconsIcon } from "@hugeicons/react";
import { TiktokIcon } from "@hugeicons/core-free-icons";

export default function SocialProof() {
  return (
    <section className="section-padding py-20 max-w-7xl mx-auto w-full">
      <div className="rounded-3xl overflow-hidden bg-[var(--brand-dark)] px-8 py-14 sm:px-16 sm:py-20 text-center relative">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[var(--brand-rose)]/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[var(--brand-pink)]/10 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-6">
            <HugeiconsIcon icon={TiktokIcon} size={14} className="text-white opacity-80" />
            <span className="text-white/80 text-xs tracking-widest uppercase font-medium">As seen on TikTok</span>
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4"
            style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
          >
            Follow <em className="italic" style={{ color: "#f4aac7" }}>the drop</em>
          </h2>
          <p className="text-white/55 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            New styles drop on TikTok first. Follow <strong className="text-white">@folaluxeitems</strong> to stay ahead and never miss a piece.
          </p>
          <a
            href="https://www.tiktok.com/@folaluxeitems"
            target="_blank"
            rel="noopener noreferrer"
            id="tiktok-follow-cta"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[var(--brand-dark)] rounded-full font-semibold text-sm hover:bg-[var(--brand-blush)] transition-colors"
          >
            <HugeiconsIcon icon={TiktokIcon} size={16} />
            @folaluxeitems
          </a>
        </div>
      </div>
    </section>
  );
}

