import { Card, CardContent } from "@/components/ui/card";

const FAQS = [
  { q: "How does a scan work?", a: "Accewa launches a real headless browser against the URL you provide, crawls linked pages on the same site, and runs axe-core against each rendered page." },
  { q: "What counts against my scan limit?", a: "Each call to start a scan (from a website or ad hoc) counts once, regardless of how many pages it crawls." },
  { q: "Can I cancel anytime?", a: "Yes — cancelling schedules the downgrade for the end of your current billing period, so you keep access until then." },
  { q: "How do I generate a PDF report?", a: "Open any completed scan and choose \"Generate PDF report\" when you want a PDF. It will download only when you request it." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">Help Center</h1>
      <div className="mt-10 space-y-4">
        {FAQS.map((faq) => (
          <Card key={faq.q}>
            <CardContent className="p-5">
              <p className="font-medium text-ink">{faq.q}</p>
              <p className="mt-1 text-sm text-ink-muted">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

