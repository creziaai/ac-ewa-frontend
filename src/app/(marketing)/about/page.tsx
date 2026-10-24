export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">About Accewa</h1>
      <p className="mt-4 text-ink-muted">
        Accewa is built for the engineering and agency teams who own web accessibility in practice, not just on paper.
        We combine real browser-based scanning with AI-assisted remediation so accessibility work fits into a normal
        sprint instead of a once-a-year audit scramble.
      </p>
      <p className="mt-4 text-ink-muted">
        Every scan runs a real Playwright browser against your pages and checks them with axe-core, the same engine
        used by most enterprise accessibility tooling — so what you see in Accewa is what an auditor would find too.
      </p>
    </div>
  );
}

