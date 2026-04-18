import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  DeliveryTruck01Icon,
  CustomerService01Icon,
} from "@hugeicons/core-free-icons";

export default function BrandPillars() {
  const pillars = [
    {
      icon: (
        <HugeiconsIcon
          icon={StarIcon}
          size={32}
          strokeWidth={1.5}
          className="text-[var(--brand-rose)]"
        />
      ),
      title: "Premium Quality",
      text: "Every piece is selected for quality that you can feel. No compromises, no shortcuts.",
    },
    {
      icon: (
        <HugeiconsIcon
          icon={DeliveryTruck01Icon}
          size={32}
          strokeWidth={1.5}
          className="text-[var(--brand-rose)]"
        />
      ),
      title: "Nationwide Delivery",
      text: "We deliver everywhere in Nigeria. Door-to-door, handled with care.",
    },
    {
      icon: (
        <HugeiconsIcon
          icon={CustomerService01Icon}
          size={32}
          strokeWidth={1.5}
          className="text-[var(--brand-rose)]"
        />
      ),
      title: "Personal Service",
      text: "DM us on TikTok or WhatsApp. Real people, real answers, no bots.",
    },
  ];

  return (
    <section className="section-padding py-16 bg-[var(--brand-blush)]/30 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="flex flex-col items-center gap-4 px-4 py-8"
          >
            <div className="w-14 h-14 rounded-full bg-white border border-[var(--border)] flex items-center justify-center shadow-sm">
              {pillar.icon}
            </div>
            <h3
              className="text-xl text-[var(--brand-dark)]"
              style={{
                fontFamily: "var(--font-heading), Georgia, serif",
                fontWeight: 600,
              }}
            >
              {pillar.title}
            </h3>
            <p className="text-sm text-[var(--brand-muted)] leading-relaxed max-w-xs">
              {pillar.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
