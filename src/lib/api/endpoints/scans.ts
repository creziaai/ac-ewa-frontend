import { apiClient } from "@/lib/api/client";
import type { AccessibilityIssue, WebsiteScan } from "@/types/models";

export const scansApi = {
  list: () =>
    apiClient.get<WebsiteScan[]>("/scans").then((response) => response.data),

  start: (url: string) =>
    apiClient
      .post<{ id: string; status: "queued" }>("/scans", { url })
      .then((response) => response.data),

  get: (id: string) =>
    apiClient
      .get<WebsiteScan>(`/scans/${id}`)
      .then((response) => response.data),

  cancel: (id: string) => apiClient.post<WebsiteScan>(`/scans/${id}/cancel`).then((r) => r.data),

  findings: (id: string) =>
    apiClient
      .get<{ scanId: string; data: AccessibilityIssue[] }>(
        `/scans/${id}/findings`,
      )
      .then((response) => response.data),
};

