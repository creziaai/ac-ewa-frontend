import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Accewa
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-ink-muted">{footer}</div>}
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-14">
          <div className="font-mono-tabular text-xs uppercase tracking-widest text-white/40">WCAG 2.2 AA · Real Playwright scans</div>
          <div>
            <p className="font-display text-3xl font-medium leading-tight text-white">
              &ldquo;Fixed 41 critical issues before our audit deadline — Accewa caught what our manual review missed.&rdquo;
            </p>
            <p className="mt-6 text-sm text-white/50">Head of Engineering, mid-market SaaS company</p>
          </div>
          <div className="flex gap-8 text-white/70">
            <div>
              <div className="font-display text-2xl font-semibold text-white">12,400+</div>
              <div className="text-xs text-white/40">pages scanned monthly</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-white">98%</div>
              <div className="text-xs text-white/40">issue detection accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

