"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { reportsApi } from "@/lib/api/endpoints/reports";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

interface ReportSummaryItem {
  id?: string;
  format?: string;
  storageUrl?: string | null;
  createdAt?: string;
}

interface ReportSummary {
  reports?: ReportSummaryItem[];
}

function getReports(
  data: unknown,
): ReportSummaryItem[] {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return [];
  }

  const value =
    data as Record<string, unknown>;

  if (!Array.isArray(value.reports)) {
    return [];
  }

  return value.reports.filter(
    (report): report is ReportSummaryItem =>
      Boolean(
        report &&
          typeof report === "object",
      ),
  );
}

function hasPdfReport(
  data: unknown,
): boolean {
  return getReports(data).some(
    (report) =>
      typeof report.format ===
        "string" &&
      report.format.toUpperCase() ===
        "PDF",
  );
}

export function useReportSummary(
  scanId: string | undefined,
) {
  return useQuery({
    queryKey: [
      "reports",
      scanId,
    ],

    queryFn: async () => {
      if (!scanId) {
        throw new Error(
          "Scan ID is required.",
        );
      }

      const data =
        await reportsApi.summary(
          scanId,
        );

      return data as unknown as ReportSummary;
    },

    enabled: Boolean(scanId),

    refetchInterval: (query) => {
      if (
        hasPdfReport(
          query.state.data,
        )
      ) {
        return false;
      }

      return 2000;
    },
  });
}

export function useGeneratePdfReport() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      scanId: string,
    ) => {
      /*
       * STEP 1
       * Ask the backend to generate the PDF.
       */
      await reportsApi.generatePdf(
        scanId,
      );

      /*
       * STEP 2
       * Wait until the PDF worker has
       * actually finished generating it.
       */
      const maxAttempts = 60;
      const intervalMs = 2000;

      for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
      ) {
        const summary =
          await reportsApi.summary(
            scanId,
          );

        const reports =
          getReports(summary);

        const pdf = reports.find(
          (report) =>
            typeof report.format ===
              "string" &&
            report.format.toUpperCase() ===
              "PDF",
        );

        if (pdf) {
          /*
           * STEP 3
           * PDF is ready.
           */
          const blob =
            await reportsApi.downloadPdf(
              scanId,
            );

          if (!(blob instanceof Blob)) {
            throw new Error(
              "The server did not return a valid PDF.",
            );
          }

          if (blob.size === 0) {
            throw new Error(
              "The generated PDF is empty.",
            );
          }

          return blob;
        }

        /*
         * Wait before checking again.
         */
        await new Promise<void>(
          (resolve) =>
            window.setTimeout(
              resolve,
              intervalMs,
            ),
        );
      }

      throw new Error(
        "PDF generation timed out. Please try again.",
      );
    },

    onSuccess: async (
      blob,
      scanId,
    ) => {
      /*
       * Create browser download.
       */
      const url =
        window.URL.createObjectURL(
          blob,
        );

      const anchor =
        document.createElement("a");

      anchor.href = url;

      anchor.download =
        `accewa-${scanId}.pdf`;

      anchor.style.display = "none";

      document.body.appendChild(
        anchor,
      );

      anchor.click();

      anchor.remove();

      /*
       * Give the browser time to start
       * the download before releasing
       * the object URL.
       */
      window.setTimeout(() => {
        window.URL.revokeObjectURL(
          url,
        );
      }, 1000);

      await queryClient.invalidateQueries(
        {
          queryKey: [
            "reports",
            scanId,
          ],
        },
      );

      toast.success(
        "PDF report downloaded successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Couldn't generate the PDF report.",
        ),
      );
    },
  });
}