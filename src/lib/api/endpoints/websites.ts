import { apiClient } from "@/lib/api/client";
import type { Website } from "@/types/models";

export const websitesApi = {
  list: () => apiClient.get<{ data: Website[] }>("/websites").then((r) => r.data.data),
  create: (input: { url: string; name: string }) => apiClient.post<Website>("/websites", input).then((r) => r.data),
  startScan: (websiteId: string, url: string) =>
    apiClient.post<{ id: string; status: "queued" }>(`/websites/${websiteId}/scans`, { url }).then((r) => r.data),
};

