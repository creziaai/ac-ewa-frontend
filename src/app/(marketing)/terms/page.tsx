export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">Terms of Service</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: January 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted">
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink">Using Accewa</h2>
          <p>
            You may only submit URLs for scanning that you own or have explicit permission to test. You&apos;re responsible
            for keeping your account credentials and API keys secure.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink">Plans and billing</h2>
          <p>
            Paid plans renew monthly and are billed through Razorpay. Cancelling a subscription takes effect at the end
            of the current billing period; you retain access until then.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink">Acceptable use</h2>
          <p>Automated scanning may not be used to test sites you don&apos;t have authorization to assess.</p>
        </section>
      </div>
    </div>
  );
}

