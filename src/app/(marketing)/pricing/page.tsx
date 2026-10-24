import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";

<<<<<<< HEAD
// Public pricing is intentionally USD-only. Authenticated billing obtains
// currency-specific prices from the backend.
const PLANS = [
  { code: "FREE", name: "Free", amountCents: 0, websiteLimit: 1, scanLimit: 5, aiRequestLimit: 5, reportLimit: 2, highlight: false },
  { code: "STARTER", name: "Starter", amountCents: 2_500, websiteLimit: 5, scanLimit: 100, aiRequestLimit: 100, reportLimit: 25, highlight: true },
  { code: "GROWTH", name: "Growth", amountCents: 8_500, websiteLimit: 20, scanLimit: 500, aiRequestLimit: 500, reportLimit: 100, highlight: false },
  { code: "AGENCY", name: "Agency", amountCents: 21_000, websiteLimit: -1, scanLimit: -1, aiRequestLimit: -1, reportLimit: -1, highlight: false },
=======
// Mirrors prisma/seed.ts on the backend. The /billing/plans endpoint requires
// authentication, so this public pricing page can't call it directly — these
// figures match what's actually seeded, and the in-app Billing → Plans tab
// always reflects the live values from the API for signed-in users.
const PLANS = [
  { code: "FREE", name: "Free", amountCents: 0, websiteLimit: 1, scanLimit: 5, aiRequestLimit: 5, reportLimit: 2, highlight: false },
  { code: "STARTER", name: "Starter", amountCents: 249_900, websiteLimit: 5, scanLimit: 100, aiRequestLimit: 100, reportLimit: 25, highlight: true },
  { code: "GROWTH", name: "Growth", amountCents: 749_900, websiteLimit: 20, scanLimit: 500, aiRequestLimit: 500, reportLimit: 100, highlight: false },
  { code: "AGENCY", name: "Agency", amountCents: 1_999_900, websiteLimit: -1, scanLimit: -1, aiRequestLimit: -1, reportLimit: -1, highlight: false },
>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-4xl font-semibold text-ink">Simple, usage-based pricing</h1>
        <p className="mt-3 text-ink-muted">Start free. Upgrade when you outgrow your limits — cancel anytime.</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <Card key={plan.code} className={plan.highlight ? "border-brand shadow-sm" : undefined}>
            <CardHeader>
              {plan.highlight && <span className="mb-2 w-fit rounded-full bg-brand-tint px-2 py-0.5 text-xs font-medium text-brand-ink">Most popular</span>}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="font-display text-2xl font-semibold text-ink">
<<<<<<< HEAD
                  {plan.amountCents === 0 ? "Free" : formatMoney(plan.amountCents, "USD")}
=======
                  {plan.amountCents === 0 ? "Free" : formatMoney(plan.amountCents)}
>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
                </span>
                {plan.amountCents > 0 && " / month"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-ink-muted">
                <Feature value={plan.websiteLimit} label="websites" />
                <Feature value={plan.scanLimit} label="scans / mo" />
                <Feature value={plan.aiRequestLimit} label="AI requests / mo" />
                <Feature value={plan.reportLimit} label="reports / mo" />
              </ul>
              <Button className="w-full" variant={plan.highlight ? "default" : "outline"} asChild>
                <Link href="/register">{plan.amountCents === 0 ? "Start free" : "Get started"}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Feature({ value, label }: { value: number; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-3.5 w-3.5 shrink-0 text-minor" />
      {value === -1 ? "Unlimited" : value} {label}
    </li>
  );
}

