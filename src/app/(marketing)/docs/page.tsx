import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const SECTIONS = [
  { title: "Getting started", description: "Create an account, add your first website, and run your first scan." },
  { title: "Authentication", description: "Register, log in, and refresh JWT access tokens against the /auth endpoints." },
  { title: "Scans & findings", description: "Trigger scans and read structured WCAG findings, one issue per axe-core rule." },
  { title: "Reports", description: "Generate JSON and PDF reports for any completed scan." },
  { title: "Billing & webhooks", description: "Manage subscriptions via Razorpay and verify the webhook signature." },
  { title: "Agency API", description: "Onboard clients, white-label reports, and issue scoped API keys." },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">Documentation</h1>
      <p className="mt-4 text-ink-muted">
        Accewa exposes a full REST API under <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-sm">/api/v1</code>. Sign in to
        your dashboard for interactive API key management, or reach out for full OpenAPI docs.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Card key={section.title}>
            <CardContent className="p-5">
              <p className="font-medium text-ink">{section.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-10 text-sm text-ink-muted">
        Need API keys?{" "}
        <Link href="/register" className="text-brand hover:underline">
          Create an account
        </Link>{" "}
        and generate them from your dashboard.
      </p>
    </div>
  );
}

