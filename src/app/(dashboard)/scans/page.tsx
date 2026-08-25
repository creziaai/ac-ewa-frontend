"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Clock3, Loader2, ScanSearch, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScanStatusBadge } from "@/components/shared/impact-badge";

import { startScanSchema, type StartScanInput } from "@/lib/validation/websites";
import { useScans, useStartScan } from "@/lib/hooks/use-scans";
import { formatDateTime } from "@/lib/utils";

export default function ScansPage() {
  const startScan = useStartScan();
  const { data: scans, isLoading, isError } = useScans();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StartScanInput>({ resolver: zodResolver(startScanSchema) });

  const handleStartScan = (values: StartScanInput) => {
    startScan.mutate(values.url.trim(), { onSuccess: () => reset() });
  };

  const activeScan = scans?.find(
    (scan) => scan.status === "QUEUED" || scan.status === "RUNNING",
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Scans</h1>
        <p className="text-sm text-ink-muted">
          Run a real Playwright + axe-core accessibility scan against any public URL.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start a scan</CardTitle>
          <CardDescription>
            We&apos;ll crawl the page, run WCAG checks, and score it out of 100.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-start"
            onSubmit={handleSubmit(handleStartScan)}
            noValidate
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="url" className="sr-only">URL to scan</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                disabled={startScan.isPending}
                {...register("url")}
              />
              {errors.url && (
                <p className="text-sm text-critical">{errors.url.message}</p>
              )}
            </div>
            <Button type="submit" disabled={startScan.isPending}>
              {startScan.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ScanSearch className="h-4 w-4" />
              )}
              {startScan.isPending ? "Starting..." : "Start scan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {activeScan && (
        <Card className="border-brand/30 bg-brand-tint/30">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
              <Loader2 className="h-5 w-5 animate-spin text-brand" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold text-ink">Accessibility scan is running</h2>
                <ScanStatusBadge status={activeScan.status} />
              </div>
              <p className="mt-1 break-all text-sm text-ink-muted">{activeScan.targetUrl}</p>
              <div className="mt-3 flex flex-col gap-1 text-xs text-ink-faint">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Scan request received
                </span>
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Crawling website and running accessibility checks
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" /> Results update automatically
                </span>
              </div>
              <Link href={`/scans/${activeScan.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                View live scan <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {startScan.isError && (
        <Card className="border-critical/30">
          <CardContent className="flex items-start gap-3 p-5">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-critical" />
            <div>
              <p className="text-sm font-semibold text-ink">Unable to start the scan</p>
              <p className="mt-1 text-sm text-ink-muted">
                {startScan.error instanceof Error ? startScan.error.message : "Something went wrong while starting the scan."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink-muted">Recent scans</h2>
          {activeScan && (
            <span className="flex items-center gap-1.5 text-xs text-brand">
              <Loader2 className="h-3 w-3 animate-spin" /> Updating...
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-critical">
              Unable to load scans. Please refresh and try again.
            </CardContent>
          </Card>
        ) : !scans || scans.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-ink-muted">
              No scans yet. Start one above, or trigger one from a specific website.
            </CardContent>
          </Card>
        ) : (
          <Card className="divide-y divide-border overflow-hidden p-0">
            {scans.map((scan) => (
              <Link
                key={scan.id}
                href={`/scans/${scan.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-raised"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <ScanStatusBadge status={scan.status} />
                    <p className="truncate text-sm font-medium text-ink">{scan.targetUrl}</p>
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">
                    {scan.pagesScanned} page{scan.pagesScanned === 1 ? "" : "s"} · {scan.issueCount} issue{scan.issueCount === 1 ? "" : "s"}
                    {scan.score !== null ? ` · Score ${scan.score}/100` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-ink-faint">
                  {formatDateTime(scan.createdAt)}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

