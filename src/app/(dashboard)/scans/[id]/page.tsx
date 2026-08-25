"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreRing } from "@/components/shared/score-ring";
import {
  ImpactBadge,
  ScanStatusBadge,
} from "@/components/shared/impact-badge";

import {
  useScan,
  useScanFindings,
  useCancelScan,
} from "@/lib/hooks/use-scans";

import {
  useGeneratePdfReport,
} from "@/lib/hooks/use-reports";

import { reportsApi } from "@/lib/api/endpoints/reports";
import { useAiRemediate } from "@/lib/hooks/use-ai";
import { formatDateTime } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { AccessibilityIssue } from "@/types/models";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Report types
 *
 * Explicit report types keep the page fully type-safe.
 */
interface ReportSummaryItem {
  id?: string;
  format?: string;
  storageUrl?: string | null;
  createdAt?: string;
}

interface ReportSummaryResponse {
  reports?: ReportSummaryItem[];
}

function isReportSummaryResponse(
  value: unknown,
): value is ReportSummaryResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  if (data.reports === undefined) {
    return true;
  }

  if (!Array.isArray(data.reports)) {
    return false;
  }

  return data.reports.every(
    (report) =>
      report !== null &&
      typeof report === "object",
  );
}

export default function ScanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: scan, isLoading } = useScan(id);

  const { data: findings } = useScanFindings(
    id,
    scan?.status,
  );

  const generatePdf = useGeneratePdfReport();

  

  const cancelScan = useCancelScan();

  const [elapsed, setElapsed] = useState(0);

  /**
   * Live elapsed timer while scan is running.
   */
  useEffect(() => {
    if (
      !scan?.startedAt ||
      !["QUEUED", "RUNNING"].includes(
        scan.status,
      )
    ) {
      return;
    }

    const tick = () => {
      setElapsed(
        Math.max(
          0,
          Math.floor(
            (Date.now() -
              new Date(
                scan.startedAt!,
              ).getTime()) /
              1000,
          ),
        ),
      );
    };

    tick();

    const timer = window.setInterval(
      tick,
      1000,
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [scan?.startedAt, scan?.status]);

  
  const elapsedText = `${Math.floor(
    elapsed / 60,
  )}m ${String(elapsed % 60).padStart(
    2,
    "0",
  )}s`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-3 py-4 sm:px-4 md:px-6">
      <Link
        href="/scans"
        className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to scans
      </Link>

      {isLoading || !scan ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <Card>
          <CardContent className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex shrink-0 flex-col items-center">
                <ScoreRing
                  score={scan.score}
                  label="score"
                />

                <span className="mt-1 text-lg font-bold text-ink">
                  {scan.score ?? 0}%
                </span>

                <span className="text-[11px] text-ink-faint">
                  Accessibility
                </span>
              </div>

              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <ScanStatusBadge
                    status={scan.status}
                  />

                  {scan.status ===
                    "RUNNING" && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-faint" />
                  )}
                </div>

                {(scan.status ===
                  "QUEUED" ||
                  scan.status ===
                    "RUNNING") && (
                  <div className="mt-3 w-full sm:w-80">
                    <div className="mb-1 flex justify-between gap-3 text-xs text-ink-muted">
                      <span className="min-w-0 truncate">
                        {scan.progressStep ??
                          "Preparing scan…"}
                      </span>

                      <span className="shrink-0">
                        {scan.progress ??
                          0}
                        %
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-surface-raised">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              scan.progress ??
                                0,
                            ),
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-ink-faint">
                      Elapsed{" "}
                      {elapsedText}
                    </p>
                  </div>
                )}

                <a
                  href={scan.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex min-w-0 items-center gap-1 font-medium text-ink hover:text-brand"
                >
                  <span className="truncate">
                    {scan.targetUrl}
                  </span>

                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>

                <p className="text-xs text-ink-faint">
                  {scan.pagesScanned} page
                  {scan.pagesScanned === 1
                    ? ""
                    : "s"}{" "}
                  · {scan.issueCount} issue
                  {scan.issueCount === 1
                    ? ""
                    : "s"}{" "}
                  · started{" "}
                  {formatDateTime(
                    scan.startedAt ??
                      scan.createdAt,
                  )}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 lg:w-auto lg:items-end">
              {(scan.status ===
                "QUEUED" ||
                scan.status ===
                  "RUNNING") && (
                <Button
                  variant="outline"
                  disabled={
                    cancelScan.isPending
                  }
                  onClick={() =>
                    cancelScan.mutate(
                      scan.id,
                    )
                  }
                  className="w-full lg:w-auto"
                >
                  <XCircle className="h-4 w-4" />

                  {cancelScan.isPending
                    ? "Cancelling…"
                    : "Cancel scan"}
                </Button>
              )}

              <Button
                variant="secondary"
                disabled={
                  scan.status !==
                    "COMPLETED" ||
                  generatePdf.isPending
                }
                onClick={() =>
                  generatePdf.mutate(
                    scan.id,
                  )
                }
                className="w-full lg:w-auto"
              >
                {generatePdf.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}

                {generatePdf.isPending
                  ? "Generating…"
                  : "Generate / download PDF"}
              </Button>

              {scan.reports?.[0]
                ?.storageUrl && (
                <a
                  href={
                    scan.reports[0]
                      .storageUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand hover:underline"
                >
                  Download latest report
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Findings
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {!findings ? (
            <div className="space-y-2 p-6 pt-0">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : findings.data.length ===
            0 ? (
            <p className="border-t border-border px-6 py-10 text-center text-sm text-ink-muted">
              {scan?.status ===
              "COMPLETED"
                ? "No issues found — nice work."
                : "Findings will appear here once the scan completes."}
            </p>
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {findings.data.map(
                (issue) => (
                  <FindingRow
                    key={issue.id}
                    issue={issue}
                  />
                ),
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FindingRow({
  issue,
}: {
  issue: AccessibilityIssue;
}) {
  const [open, setOpen] =
    useState(false);

  const remediate =
    useAiRemediate();

  const handleGetFix = () => {
    setOpen(true);

    if (!remediate.data) {
      remediate.mutate({
        issue: issue.help,
        html: issue.html,
      });
    }
  };

  return (
    <li className="flex flex-col gap-2 px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <ImpactBadge
          impact={issue.impact}
        />

        <span className="text-sm font-medium text-ink">
          {issue.help}
        </span>
      </div>

      <p className="text-sm text-ink-muted">
        {issue.description}
      </p>

      {issue.scanResult?.url && (
        <p className="break-all text-xs text-ink-faint">
          On {issue.scanResult.url}
        </p>
      )}

      {issue.html && (
        <pre className="max-w-full overflow-x-auto rounded-[var(--radius-sm)] bg-surface-raised p-3 font-mono text-xs text-ink-muted">
          {issue.html}
        </pre>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGetFix}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Suggest a fix
        </Button>

        {issue.rule?.helpUrl && (
          <a
            href={issue.rule.helpUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-brand hover:underline"
          >
            WCAG reference
          </a>
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              AI remediation suggestion
            </DialogTitle>
          </DialogHeader>

          {remediate.isPending ? (
            <div className="flex min-h-[120px] items-center justify-center gap-2 text-sm text-ink-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                Thinking through a fix…
              </span>
            </div>
          ) : remediate.data ? (
            <div className="max-h-[60vh] overflow-y-auto rounded-[var(--radius-sm)] border border-border bg-surface-raised p-4">
              <div className="overflow-x-auto text-left">
                <ReactMarkdown
                  remarkPlugins={[
                    remarkGfm,
                  ]}
                  components={{
                    h1: ({
                      children,
                    }) => (
                      <h1 className="mb-4 text-lg font-semibold text-ink">
                        {children}
                      </h1>
                    ),

                    h2: ({
                      children,
                    }) => (
                      <h2 className="mb-3 mt-5 text-base font-semibold text-ink">
                        {children}
                      </h2>
                    ),

                    h3: ({
                      children,
                    }) => (
                      <h3 className="mb-2 mt-4 text-sm font-semibold text-ink">
                        {children}
                      </h3>
                    ),

                    p: ({
                      children,
                    }) => (
                      <p className="mb-3 text-sm leading-6 text-ink-muted">
                        {children}
                      </p>
                    ),

                    ul: ({
                      children,
                    }) => (
                      <ul className="mb-4 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-muted">
                        {children}
                      </ul>
                    ),

                    ol: ({
                      children,
                    }) => (
                      <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-ink-muted">
                        {children}
                      </ol>
                    ),

                    li: ({
                      children,
                    }) => (
                      <li className="pl-1">
                        {children}
                      </li>
                    ),

                    strong: ({
                      children,
                    }) => (
                      <strong className="font-semibold text-ink">
                        {children}
                      </strong>
                    ),

                    code: ({
                      children,
                    }) => (
                      <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-brand">
                        {children}
                      </code>
                    ),

                    pre: ({
                      children,
                    }) => (
                      <pre className="mb-4 overflow-x-auto rounded-lg bg-surface p-4 font-mono text-xs leading-5 text-ink">
                        {children}
                      </pre>
                    ),

                    table: ({
                      children,
                    }) => (
                      <div className="mb-5 w-full overflow-x-auto rounded-lg border border-border">
                        <table className="w-full min-w-[600px] border-collapse text-sm">
                          {children}
                        </table>
                      </div>
                    ),

                    thead: ({
                      children,
                    }) => (
                      <thead className="bg-surface-raised">
                        {children}
                      </thead>
                    ),

                    th: ({
                      children,
                    }) => (
                      <th className="border-b border-border px-4 py-3 text-left font-semibold text-ink">
                        {children}
                      </th>
                    ),

                    td: ({
                      children,
                    }) => (
                      <td className="border-b border-border px-4 py-3 align-top leading-5 text-ink-muted">
                        {children}
                      </td>
                    ),

                    blockquote: ({
                      children,
                    }) => (
                      <blockquote className="mb-4 border-l-4 border-brand pl-4 text-sm italic text-ink-muted">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {remediate.data
                    .configured
                    ? remediate.data
                        .response
                    : remediate.data
                        .recommendation}
                </ReactMarkdown>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </li>
  );
}