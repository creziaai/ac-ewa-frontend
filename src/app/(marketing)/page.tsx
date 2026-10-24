import Link from "next/link";
<<<<<<< HEAD
import { ArrowRight, Bot, FileText, Gauge, ShieldCheck, Users, Smartphone } from "lucide-react";
=======
import { ArrowRight, Bot, FileText, Gauge, ShieldCheck, Users, Webhook } from "lucide-react";
>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreRing } from "@/components/shared/score-ring";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Gauge,
    title: "Real WCAG 2.2 scans",
    description: "Playwright-driven crawls run axe-core against every page, scored 0–100 with full findings per rule.",
  },
  {
    icon: Bot,
    title: "AI-assisted remediation",
    description: "Every finding comes with a chat-based assistant that explains the fix in your codebase's language.",
  },
  {
    icon: FileText,
    title: "Client-ready reports",
    description: "Export a branded PDF the moment a scan completes — no formatting work on your end.",
  },
  {
    icon: Users,
    title: "Built for agencies",
    description: "Onboard clients, white-label reports with your logo and domain, and manage it all from one dashboard.",
  },
  {
<<<<<<< HEAD
    icon: Smartphone,
    title: "Mobile-friendly",
    description: "Review accessibility findings and reports with a responsive experience designed for phones, tablets, and desktops.",
=======
    icon: Webhook,
    title: "API-first",
    description: "Every scan, finding, and report is available over a documented REST API with scoped keys.",
>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
  },
  {
    icon: ShieldCheck,
    title: "Compliance you can show",
    description: "Track your score over time and hand auditors a clean paper trail, not a spreadsheet.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-20 pt-20 text-center sm:pt-28">
        <Badge variant="outline" className="gap-1.5">
          <ShieldCheck className="h-3 w-3" /> WCAG 2.2 AA scanning, built for engineering teams
        </Badge>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Ship accessible software without the audit-week scramble
        </h1>
        <p className="max-w-xl text-lg text-ink-muted">
          Accewa scans your sites against WCAG, scores every page, and hands your team AI-assisted fixes — so compliance
          stops being a fire drill.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/register">
              Start scanning free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>

        <Card className="mt-10 w-full max-w-3xl overflow-hidden text-left">
          <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <ScoreRing score={82} size={88} label="score" />
              <div>
                <p className="font-mono text-xs text-ink-faint">https://example.com</p>
                <p className="font-display text-lg font-semibold text-ink">14 pages scanned</p>
                <p className="text-sm text-ink-muted">6 critical · 11 serious · 22 moderate · 9 minor</p>
              </div>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/register">Run this on your site</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section id="features" className="border-t border-border bg-surface-raised/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-xl">
            <h2 className="font-display text-3xl font-semibold text-ink">Everything from first scan to signed-off audit</h2>
            <p className="mt-3 text-ink-muted">One platform for engineers fixing issues and agencies reporting on them.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6">
                  <feature.icon className="h-6 w-6 text-brand" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-ink">Start with your free plan</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">1 website, 5 scans a month, no credit card. Upgrade whenever you need more.</p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/register">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </>
  );
}

