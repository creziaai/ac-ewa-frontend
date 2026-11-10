
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">
        About Accewa
      </h1>

      <p className="mt-4 text-ink-muted">
        Accewa is a website accessibility testing platform
        built for developers, engineering teams, digital
        agencies, and businesses. It helps identify
        accessibility issues across websites through
        automated browser-based testing, WCAG-related
        checks, and AI-assisted remediation suggestions.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-ink">
        What Does Accewa Do?
      </h2>

      <p className="mt-4 text-ink-muted">
        Accewa makes website accessibility testing
        simpler, clearer, and more actionable. Teams can
        scan websites, discover accessibility issues,
        understand their severity, and prioritize fixes.
      </p>

      <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-muted">
        <li>Automated website accessibility scanning</li>
        <li>Multi-page website crawling within supported scope</li>
        <li>WCAG-related accessibility issue detection</li>
        <li>Identification of affected pages and HTML elements</li>
        <li>Issue severity and WCAG references</li>
        <li>AI-assisted remediation suggestions</li>
        <li>Accessibility reports</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-ink">
        How Does Accewa Work?
      </h2>

      <p className="mt-4 text-ink-muted">
        Accewa uses Playwright to load web pages in a real
        browser and axe-core to detect common automated
        accessibility issues. Its reports help teams
        understand findings and decide what to fix.
      </p>

      <p className="mt-4 text-ink-muted">
        Automated testing has limitations and does not
        replace manual accessibility reviews, keyboard
        testing, or assistive technology testing.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-ink">
        Who Is Accewa For?
      </h2>

      <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-muted">
        <li>Web development agencies</li>
        <li>Software engineering teams</li>
        <li>SaaS companies</li>
        <li>Freelance developers</li>
        <li>Businesses managing websites</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-ink">
        Our Mission
      </h2>

      <p className="mt-4 text-ink-muted">
        We believe website accessibility testing should
        be part of everyday development, not just a
        once-a-year audit. Our mission is to make
        accessibility findings easier to understand,
        prioritize, and address.
      </p>

      <p className="mt-8 font-semibold text-ink">
        Accewa — Make Web Accessibility Testing Simpler.
      </p>
    </main>
  );
}
