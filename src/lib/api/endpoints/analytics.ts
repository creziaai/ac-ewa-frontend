import { apiClient } from "@/lib/api/client";
import type { AuditLog } from "@/types/models";

export interface AnalyticsOverview { websites: number; scans: number; issues: number; score: number | null }

export const analyticsApi = {
  overview: () => apiClient.get<AnalyticsOverview>("/analytics/overview").then((r) => r.data),
  logs: () => apiClient.get<{ data: AuditLog[] }>("/analytics/logs").then((r) => r.data.data),
};

