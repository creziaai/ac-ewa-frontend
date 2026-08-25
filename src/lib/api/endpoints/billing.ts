import { apiClient } from "@/lib/api/client";
import type { Plan, Subscription, UsageSummary } from "@/types/models";

export const billingApi = {
  subscription: () => apiClient.get<Subscription>("/billing/subscription").then((r) => r.data),
  upgrade: (planCode: string) => apiClient.post<Subscription>("/billing/subscription/upgrade", { planCode }).then((r) => r.data),
  cancel: () => apiClient.post<Subscription>("/billing/subscription/cancel").then((r) => r.data),
  usage: () => apiClient.get<UsageSummary>("/billing/usage").then((r) => r.data),
  plans: () => apiClient.get<{ data: Plan[] }>("/billing/plans").then((r) => r.data.data),
};

