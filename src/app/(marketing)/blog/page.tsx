import { Card, CardContent } from "@/components/ui/card";

const POSTS = [
  { title: "Why axe-core misses less than you'd think", date: "2026-06-02", excerpt: "A look at how automated scanning compares to manual audits, and where each one earns its keep." },
  { title: "Shipping WCAG 2.2 AA without slowing down your team", date: "2026-05-14", excerpt: "Practical patterns for baking accessibility checks into CI instead of a pre-launch fire drill." },
  { title: "What we learned onboarding 40 agencies", date: "2026-04-22", excerpt: "The reporting workflow agencies actually wanted, and the one they said they wanted but didn't use." },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">Blog</h1>
      <div className="mt-10 space-y-6">
        {POSTS.map((post) => (
          <Card key={post.title}>
            <CardContent className="p-6">
              <p className="text-xs text-ink-faint">{post.date}</p>
              <h2 className="mt-1 font-display text-lg font-semibold text-ink">{post.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

