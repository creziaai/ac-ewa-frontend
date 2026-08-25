"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { formatDateTime } from "@/lib/utils";

export default function ReportsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const completed = notifications?.data.filter((n) => n.type === "SCAN_COMPLETED") ?? [];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Reports</h1>
        <p className="text-sm text-ink-muted">Every completed scan produces a JSON report automatically, plus an optional PDF export.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : completed.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-ink-faint" />
            <p className="text-sm text-ink-muted">No reports yet. Run a scan and its report will show up here once it completes.</p>
            <Link href="/scans" className="text-sm font-medium text-brand hover:underline">
              Go to scans
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="divide-y divide-border overflow-hidden p-0">
          {completed.map((notification) => {
            const scanId = (notification.data as { scanId?: string } | null)?.scanId;
            return (
              <Link
                key={notification.id}
                href={scanId ? `/scans/${scanId}` : "#"}
                className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-raised"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-5 w-5 shrink-0 text-brand" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{notification.subject}</p>
                    <p className="truncate text-xs text-ink-faint">{notification.body}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-ink-faint">
                  {formatDateTime(notification.createdAt)}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </Card>
      )}
    </div>
  );
}

