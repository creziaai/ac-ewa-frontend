import { apiClient } from "@/lib/api/client";
import type { Invoice, Payment } from "@/types/models";

export interface CreateOrderResponse { orderId: string; amount: number; currency: string; keyId: string; paymentId: string; planCode: string }
export interface RetryPaymentResponse { orderId: string; amount: number; currency: string; keyId: string; retryCount: number }
<<<<<<< HEAD
export interface VerifyPaymentResponse {
  verified: boolean;
  paymentId: string;
  razorpayStatus: string;
  /** True when the server already activated the plan (new backend). */
  activated?: boolean;
}

export interface PaypalOrderResponse { orderId: string; approvalUrl: string; amount: number; currency: "USD"; planCode: string }

export const paymentsApi = {
  createPaypalOrder: (input: { planCode: string }) => apiClient.post<PaypalOrderResponse>("/payments/paypal/create-order", { ...input, currency: "USD" }).then((r) => r.data),
  capturePaypalOrder: (orderId: string) => apiClient.post<VerifyPaymentResponse>("/payments/paypal/capture", { orderId }).then((r) => r.data),
  // The server looks the price up from planCode + currency. Never send an amount.
  createOrder: (input: { planCode: string; currency: "INR" | "USD" }) =>
    apiClient
      .post<CreateOrderResponse>(
        "/payments/create-order",
        // INR requests keep the original body ({ planCode } only) so they work
        // with every backend version. `currency` is sent only for USD, which the
        // updated backend accepts.
        input.currency === "USD" ? input : { planCode: input.planCode },
      )
      .then((r) => r.data),
=======
export interface VerifyPaymentResponse { verified: boolean; paymentId: string; razorpayStatus: string }

export const paymentsApi = {
  createOrder: (planCode: string) => apiClient.post<CreateOrderResponse>("/payments/create-order", { planCode }).then((r) => r.data),
>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
  verify: (input: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    apiClient.post<VerifyPaymentResponse>("/payments/verify", input).then((r) => r.data),
  retry: (paymentId: string) => apiClient.post<RetryPaymentResponse>(`/payments/${paymentId}/retry`).then((r) => r.data),
  history: () => apiClient.get<{ data: Payment[] }>("/payments/history").then((r) => r.data.data),
  invoices: () => apiClient.get<{ data: Invoice[] }>("/payments/invoices").then((r) => r.data.data),
<<<<<<< HEAD
};
=======
};

>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
