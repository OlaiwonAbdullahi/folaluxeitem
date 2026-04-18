import NewsletterForm from "./NewsletterForm";

export default function NewsletterSection() {
  return (
    <section className="section-padding py-20 max-w-7xl mx-auto w-full">
      <div
        className="rounded-3xl px-8 py-14 sm:px-14 text-center"
        style={{ background: "linear-gradient(135deg, #fce8ef 0%, #f9d8e6 50%, #f4c4d8 100%)" }}
      >
        <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--brand-rose)] mb-3 font-semibold">Stay ahead</p>
        <h2
          className="text-4xl sm:text-5xl text-[var(--brand-dark)] mb-4"
          style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500 }}
        >
          First access to new drops
        </h2>
        <p className="text-[var(--brand-muted)] text-base max-w-md mx-auto mb-8 leading-relaxed">
          Subscribe and get 10% off your first order. Plus exclusive early access before they sell out.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}
