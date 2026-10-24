import { apiClient } from "@/lib/api/client";
import type { WebsiteScan } from "@/types/models";

export interface GeneratePdfResponse {
  jobId: string;
  status: "queued";
}

export const reportsApi = {
  summary: (scanId: string) =>
    apiClient
      .get<WebsiteScan>(
        `/reports/scans/${scanId}`,
      )
      .then((response) => response.data),

  generatePdf: (scanId: string) =>
    apiClient
      .post<GeneratePdfResponse>(
        `/reports/scans/${scanId}/pdf`,
      )
      .then((response) => response.data),

  downloadPdf: (scanId: string) =>
    apiClient
      .get<Blob>(
        `/reports/scans/${scanId}/pdf`,
        {
          responseType: "blob",
        },
      )
      .then((response) => response.data),
};