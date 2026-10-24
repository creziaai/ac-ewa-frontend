import { apiClient } from "@/lib/api/client";
import type { Plan, Subscription, UsageSummary } from "@/types/models";

<<<<<<< HEAD
export interface BillingRegion {
  /** ISO-3166 alpha-2 country code, or null when it couldn't be detected. */
  country: string | null;
  currency: "INR" | "USD";
  /** False until international (USD) checkout is switched on in the backend. */
  internationalCheckoutEnabled: boolean;
  supportedCurrencies?: Array<"INR" | "USD">;
  usdCheckoutEnabled?: boolean;
}

=======
>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
export const billingApi = {
  subscription: () => apiClient.get<Subscription>("/billing/subscription").then((r) => r.data),
  upgrade: (planCode: string) => apiClient.post<Subscription>("/billing/subscription/upgrade", { planCode }).then((r) => r.data),
  cancel: () => apiClient.post<Subscription>("/billing/subscription/cancel").then((r) => r.data),
  usage: () => apiClient.get<UsageSummary>("/billing/usage").then((r) => r.data),
<<<<<<< HEAD
  plans: (currency?: "INR" | "USD") =>
    apiClient
      .get<{ data: Plan[] }>("/billing/plans", { params: currency ? { currency } : undefined })
      .then((r) => r.data.data),
  region: () => apiClient.get<BillingRegion>("/billing/region").then((r) => r.data),
};
=======
  plans: () => apiClient.get<{ data: Plan[] }>("/billing/plans").then((r) => r.data.data),
};

>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
