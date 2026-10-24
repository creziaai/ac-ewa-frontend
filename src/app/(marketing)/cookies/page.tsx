export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">Cookie Policy</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: January 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted">
        <p>
          Accewa&apos;s dashboard uses a single functional cookie to remember that you&apos;re signed in, so protected pages can
          redirect you to sign in without a flash of the wrong page. It stores no personal data itself — your session
          tokens live in your browser&apos;s local storage, not in cookies.
        </p>
        <p>We don&apos;t use tracking or advertising cookies.</p>
      </div>
    </div>
  );
}

