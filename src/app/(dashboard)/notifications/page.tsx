"use client";

import { Bell, BellOff, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useMarkNotificationRead, useNotifications } from "@/lib/hooks/use-notifications";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  SCAN_COMPLETED: "Scan",
  SCAN_FAILED: "Scan failed",
  BILLING: "Billing",
  SYSTEM: "System",
};

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Notifications</h1>
          <p className="text-sm text-ink-muted">{data?.unreadCount ?? 0} unread</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !data || data.data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <BellOff className="h-10 w-10 text-ink-faint" />
            <p className="text-sm text-ink-muted">You&apos;re all caught up. Notifications about scans and billing will show up here.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="divide-y divide-border overflow-hidden p-0">
          {data.data.map((notification) => (
            <div
              key={notification.id}
              className={cn("flex items-start justify-between gap-3 px-5 py-4", !notification.readAt && "bg-brand-tint/40")}
            >
              <div className="flex min-w-0 items-start gap-3">
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline">{TYPE_LABEL[notification.type] ?? notification.type}</Badge>
                    <span className="text-xs text-ink-faint">{formatDateTime(notification.createdAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-ink">{notification.subject}</p>
                  <p className="text-sm text-ink-muted">{notification.body}</p>
                </div>
              </div>
              {!notification.readAt && (
                <Button variant="ghost" size="icon" aria-label="Mark as read" onClick={() => markRead.mutate(notification.id)}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

