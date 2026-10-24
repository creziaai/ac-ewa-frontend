export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: January 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted">
        <p>
          Accewa (&quot;we&quot;, &quot;us&quot;) provides website accessibility scanning and reporting. This policy explains what data we
          collect when you use our dashboard and API, and how we use it.
        </p>
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink">Data we collect</h2>
          <p>
            Account details you provide at registration (email, password hash), the website URLs you submit for
            scanning, the accessibility findings we generate from those scans, and billing information processed by
            our payment provider, Razorpay.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink">How we use it</h2>
          <p>
            To run scans you request, generate reports, enforce plan usage limits, process payments, and send
            transactional emails (scan completion, billing, password resets).
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink">Your rights</h2>
          <p>You can request a copy or deletion of your account data at any time by contacting accewaai@gmail.com.</p>
        </section>
      </div>
    </div>
  );
}

