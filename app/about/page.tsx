import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FolaLuxe — Our Story",
  description:
    "Learn about FolaLuxe, a premium fashion boutique born from a love of quality clothing and luxury bags. Shop our curated collection and follow us on TikTok @folaluxeitems.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1">
        {/* Hero */}
        <section
          className="pt-36 pb-24 section-padding relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #fce8ef 0%, #f9d8e6 40%, #f5cce1 100%)" }}
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--brand-rose)]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[var(--brand-pink)]/10 blur-3xl" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--brand-rose)] mb-4 font-semibold">Our Story</p>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl text-[var(--brand-dark)] leading-tight"
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
            >
              Dressing you is our
              <br />
              <em className="italic" style={{ color: "var(--brand-rose)" }}>whole thing.</em>
            </h1>
            <p className="text-[var(--brand-muted)] text-lg mt-6 leading-relaxed max-w-xl mx-auto">
              FolaLuxe started as a love letter to quality, style, and the Nigerian woman who
              refuses to settle for less.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding py-20 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {/* Text */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--brand-muted)] mb-4 font-semibold">How it started</p>
              <h2
                className="text-4xl text-[var(--brand-dark)] mb-6 leading-snug"
                style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
              >
                Born from a love of<br />beautiful things.
              </h2>
              <div className="text-[var(--brand-muted)] space-y-4 text-sm leading-relaxed">
                <p>
                  FolaLuxe started when our founder realised that luxury shouldn&apos;t be a compromise.
                  Shopping in Nigeria meant either settling for average quality or paying international
                  prices for shipping and import fees. We decided there was a better way.
                </p>
                <p>
                  We source every bag, every dress, every set with intention. Not just because it looks
                  good in product photos, but because it actually looks good on a real person, in real
                  Lagos light, at real Lagos temperatures.
                </p>
                <p>
                  What started on TikTok as a small personal page blew up because people recognised
                  something real — a genuine love for beautiful things, shared honestly. That energy
                  is in every piece we stock.
                </p>
              </div>
            </div>

            {/* Decorative block */}
            <div className="relative">
              <div
                className="aspect-[4/5] rounded-3xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #fce8ef 0%, #f0cad8 100%)" }}
              >
                <div className="text-center px-8">
                  <p
                    className="text-7xl text-[var(--brand-rose)] mb-4"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 300 }}
                  >
                    &#8220;
                  </p>
                  <p
                    className="text-2xl text-[var(--brand-dark)] leading-snug italic"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 400 }}
                  >
                    Dress like you mean it.
                  </p>
                  <p className="text-sm text-[var(--brand-muted)] mt-4">— FolaLuxe</p>
                </div>
              </div>
              {/* Decorative offset */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl border-2 border-[var(--brand-rose)]/20" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding py-20 bg-[var(--brand-blush)]/40 w-full">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--brand-muted)] mb-3 font-semibold">What we stand for</p>
              <h2
                className="text-4xl sm:text-5xl text-[var(--brand-dark)]"
                style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
              >
                Our Values
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  num: "01",
                  title: "Intentional Curation",
                  text: "We don't stock everything — just the things that will actually make you feel something when you put them on.",
                },
                {
                  num: "02",
                  title: "Honest Quality",
                  text: "Premium doesn't always mean expensive. We chase real quality in materials, construction, and longevity.",
                },
                {
                  num: "03",
                  title: "Real Connection",
                  text: "We're not a faceless corporation. DM us, ask questions, send us fit pics. We actually care.",
                },
              ].map((v) => (
                <div key={v.num} className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-[var(--border)]">
                  <span
                    className="text-5xl font-light text-[var(--brand-rose)]/30"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    {v.num}
                  </span>
                  <h3
                    className="text-xl text-[var(--brand-dark)]"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-sm text-[var(--brand-muted)] leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section-padding py-20 max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--brand-muted)] mb-3 font-semibold">Got questions?</p>
            <h2
              className="text-4xl text-[var(--brand-dark)]"
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
            >
              Frequently Asked
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "How do I place an order?",
                a: "Browse the shop, add items to your bag, and go to checkout. You'll fill in your details and confirm your order via WhatsApp — we'll sort the rest.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept Bank Transfer and Pay on Delivery. Details will be sent via WhatsApp once your order is confirmed.",
              },
              {
                q: "How long does delivery take?",
                a: "Lagos: 1-3 business days. Other states: 3-7 business days depending on location. We always keep you updated.",
              },
              {
                q: "Can I return or exchange an item?",
                a: "Yes — if an item arrives damaged or is significantly different from what was described, contact us within 24 hours of delivery and we'll sort it out for you.",
              },
              {
                q: "Do you do custom orders or wholesale?",
                a: "Yes! Reach out to us directly on TikTok or WhatsApp and we'll discuss.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="bg-white border border-[var(--border)] rounded-xl group cursor-pointer"
              >
                <summary className="px-6 py-4 font-medium text-[var(--brand-dark)] text-sm list-none flex items-center justify-between select-none">
                  {item.q}
                  <span className="text-[var(--brand-rose)] text-lg transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="px-6 pb-5 text-sm text-[var(--brand-muted)] leading-relaxed border-t border-[var(--border)] pt-4">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact / Shipping */}
        <section id="shipping" className="section-padding py-20 bg-[var(--brand-blush)]/40 w-full">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-[var(--border)] p-8">
              <h3
                className="text-2xl text-[var(--brand-dark)] mb-4"
                style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
              >
                Shipping Info
              </h3>
              <div className="text-sm text-[var(--brand-muted)] space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--brand-rose)] mt-1.5 flex-shrink-0" />
                  <p>Lagos: ₦3,500 flat fee · 1–3 business days</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--brand-rose)] mt-1.5 flex-shrink-0" />
                  <p>Other states: ₦3,500 · 3–7 business days</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <p>Free shipping on orders above ₦50,000</p>
                </div>
              </div>
            </div>

            <div id="contact" className="bg-white rounded-2xl border border-[var(--border)] p-8">
              <h3
                className="text-2xl text-[var(--brand-dark)] mb-4"
                style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
              >
                Get in Touch
              </h3>
              <div className="text-sm text-[var(--brand-muted)] space-y-4">
                <a
                  href="https://www.tiktok.com/@folaluxeitems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-[var(--brand-rose)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--brand-blush)] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--brand-rose)">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.18 8.18 0 004.78 1.52V7a4.85 4.85 0 01-1.02-.31z"/>
                    </svg>
                  </div>
                  @folaluxeitems on TikTok
                </a>
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-green-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--brand-rose)">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0020.464 3.49"/>
                    </svg>
                  </div>
                  WhatsApp (fastest response)
                </a>
                <a
                  href="mailto:folaluxeitems@gmail.com"
                  className="flex items-center gap-3 hover:text-[var(--brand-rose)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--brand-blush)] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-rose)" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <polyline points="2,4 12,13 22,4"/>
                    </svg>
                  </div>
                  folaluxeitems@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding py-20 max-w-5xl mx-auto w-full text-center">
          <h2
            className="text-4xl sm:text-5xl text-[var(--brand-dark)] mb-6"
            style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
          >
            Ready to find your next
            <br />
            <em className="italic" style={{ color: "var(--brand-rose)" }}>favourite piece?</em>
          </h2>
          <Link
            href="/shop"
            id="about-shop-cta"
            className="inline-block px-10 py-4 bg-[var(--brand-rose)] text-white rounded-full font-medium text-base hover:bg-[var(--brand-pink)] transition-colors hover:shadow-lg hover:shadow-pink-200"
          >
            Shop the Collection
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
