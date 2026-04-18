export default function Marquee() {
  return (
    <div className="bg-[var(--brand-rose)] py-3 overflow-hidden">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 20s linear infinite" }}>
        {Array(8).fill(null).map((_, i) => (
          <span key={i} className="mx-6 text-white/90 text-xs tracking-[0.25em] uppercase font-medium flex-shrink-0">
            Premium Bags &nbsp;·&nbsp; Luxury Clothing &nbsp;·&nbsp; Boutique Quality &nbsp;·&nbsp; Fast Delivery &nbsp;·&nbsp;
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
