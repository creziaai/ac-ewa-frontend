"use client";

import Link from "next/link";
import { Globe, ScanSearch, TriangleAlert, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreRing } from "@/components/shared/score-ring";
import { useAnalyticsOverview } from "@/lib/hooks/use-analytics";
import { useWebsites } from "@/lib/hooks/use-websites";
import { useUsageSummary } from "@/lib/hooks/use-billing";
import { useAuth } from "@/lib/hooks/use-auth";
import { Progress } from "@/components/ui/progress";


export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { data: overview, isLoading } = useAnalyticsOverview();
  const { data: websites } = useWebsites();
  const { data: usage } = useUsageSummary();

  const greetingName = user?.email.split("@")[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Welcome back{greetingName ? `, ${greetingName}` : ""}</h1>
          <p className="text-sm text-ink-muted">Here&apos;s how your sites are tracking against WCAG right now.</p>
        </div>
        <Button asChild>
          <Link href="/scans">
            <ScanSearch className="h-4 w-4" /> Run a scan
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-ink-muted">Websites monitored</p>
              {isLoading ? <Skeleton className="mt-1 h-7 w-10" /> : <p className="font-display text-2xl font-semibold">{overview?.websites ?? 0}</p>}
            </div>
            <Globe className="h-8 w-8 text-brand" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-ink-muted">Total scans</p>
              {isLoading ? <Skeleton className="mt-1 h-7 w-10" /> : <p className="font-display text-2xl font-semibold">{overview?.scans ?? 0}</p>}
            </div>
            <ScanSearch className="h-8 w-8 text-brand" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-ink-muted">Open issues</p>
              {isLoading ? <Skeleton className="mt-1 h-7 w-10" /> : <p className="font-display text-2xl font-semibold">{overview?.issues ?? 0}</p>}
            </div>
            <TriangleAlert className="h-8 w-8 text-serious" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <ScoreRing score={overview?.score ?? null} size={56} strokeWidth={6} />
            <div>
              <p className="text-sm text-ink-muted">Average score</p>
              <p className="text-xs text-ink-faint">Last 10 completed scans</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Your websites</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/websites">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {!websites ? (
              <div className="space-y-3 p-6 pt-0">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : websites.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-t border-border px-6 py-12 text-center">
                <Globe className="h-8 w-8 text-ink-faint" />
                <p className="text-sm text-ink-muted">No websites yet. Add one to start scanning for accessibility issues.</p>
                <Button asChild size="sm">
                  <Link href="/websites">Add a website</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-border border-t border-border">
                {websites.slice(0, 6).map((site) => (
                  <li key={site.id} className="flex items-center justify-between px-6 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{site.name}</p>
                      <p className="truncate text-xs text-ink-faint">{site.url}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/websites`}>Manage</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan usage this month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!usage ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : (
              usage.usage.map((item) => {
                const unlimited = item.limit === -1;
                const pct = unlimited ? 0 : item.limit === 0 ? 100 : Math.min(100, (item.used / item.limit) * 100);
                return (
                  <div key={item.metric}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-ink-muted">{metricLabel(item.metric)}</span>
                      <span className="font-mono-tabular text-ink-faint">
                        {item.used} / {unlimited ? "∞" : item.limit}
                      </span>
                    </div>
                    <Progress value={unlimited ? 8 : pct} />
                  </div>
                );
              })
            )}
            <Button variant="secondary" size="sm" className="w-full" asChild>
              <Link href="/billing">Manage plan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function metricLabel(metric: string) {
  return { WEBSITES: "Websites", SCANS: "Scans", AI_REQUESTS: "AI requests", REPORTS: "Reports" }[metric] ?? metric;
}

