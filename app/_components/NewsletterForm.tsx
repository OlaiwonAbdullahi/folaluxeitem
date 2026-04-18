"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      aria-label="Newsletter subscription"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="flex-1 px-5 py-3.5 rounded-full border border-[var(--brand-rose)]/30 bg-white/80 text-sm focus:outline-none focus:border-[var(--brand-rose)] transition-colors"
      />
      <button
        type="submit"
        disabled={subscribed}
        className={`px-7 py-3.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
          subscribed
            ? "bg-green-500 text-white"
            : "bg-[var(--brand-rose)] text-white hover:bg-[var(--brand-pink)]"
        }`}
      >
        {subscribed ? "Subscribed!" : "Get 10% Off"}
      </button>
    </form>
  );
}
