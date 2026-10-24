import Link from "next/link";

const COLUMNS = [
  { title: "Product", links: [{ href: "/#features", label: "Features" }, { href: "/pricing", label: "Pricing" }, { href: "/docs", label: "Documentation" }] },
  { title: "Company", links: [{ href: "/about", label: "About" }, { href: "/blog", label: "Blog" }, { href: "/contact", label: "Contact" }] },
  { title: "Legal", links: [{ href: "/privacy", label: "Privacy Policy" }, { href: "/terms", label: "Terms" }, { href: "/cookies", label: "Cookie Policy" }] },
  { title: "Support", links: [{ href: "/help", label: "Help Center" }] },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-muted hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-6 py-6 text-center text-xs text-ink-faint">© {new Date().getFullYear()} Accewa. All rights reserved.</div>
    </footer>
  );
}

