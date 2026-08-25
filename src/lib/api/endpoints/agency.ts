import { apiClient } from "@/lib/api/client";
import type { AgencyBrandSettings, ApiKey, Organization, WebsiteScan } from "@/types/models";

export interface AgencyClientRow extends Organization { _count: { websites: number; users: number } }
export interface CreateApiKeyResponse { id: string; name: string; apiKey: string; warning: string }

export const agencyApi = {
  clients: () => apiClient.get<{ data: AgencyClientRow[] }>("/agency/clients").then((r) => r.data.data),
  createClient: (input: { name: string; ownerEmail: string }) =>
    apiClient.post<{ organization: Organization; owner: { id: string; email: string } }>("/agency/clients", input).then((r) => r.data),
  clientReports: (clientId: string) =>
    apiClient
      .get<{ organization: { id: string; name: string }; data: WebsiteScan[] }>(`/agency/clients/${clientId}/reports`)
      .then((r) => r.data),
  brandSettings: () => apiClient.get<AgencyBrandSettings | null>("/agency/brand-settings").then((r) => r.data),
  updateBrandSettings: (input: Partial<Pick<AgencyBrandSettings, "brandName" | "logoUrl" | "primaryColor" | "supportEmail" | "customDomain">>) =>
    apiClient.post<AgencyBrandSettings>("/agency/brand-settings", input).then((r) => r.data),
  apiKeys: () => apiClient.get<{ data: ApiKey[] }>("/agency/api-keys").then((r) => r.data.data),
  createApiKey: (name: string) => apiClient.post<CreateApiKeyResponse>("/agency/api-keys", { name }).then((r) => r.data),
  revokeApiKey: (id: string) => apiClient.post(`/agency/api-keys/${id}/revoke`).then((r) => r.data),
};

