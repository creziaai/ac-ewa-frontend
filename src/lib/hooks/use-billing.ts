"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "@/lib/api/endpoints/billing";
import { paymentsApi } from "@/lib/api/endpoints/payments";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function usePlans() {
  return useQuery({ queryKey: ["billing", "plans"], queryFn: billingApi.plans });
}

export function useSubscription() {
  return useQuery({ queryKey: ["billing", "subscription"], queryFn: billingApi.subscription, retry: false });
}

export function useUsageSummary() {
  return useQuery({ queryKey: ["billing", "usage"], queryFn: billingApi.usage });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billingApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
      toast.success("Your subscription will end at the close of the current billing period.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function usePaymentHistory() {
  return useQuery({ queryKey: ["payments", "history"], queryFn: paymentsApi.history });
}

export function useInvoices() {
  return useQuery({ queryKey: ["payments", "invoices"], queryFn: paymentsApi.invoices });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (planCode: string) => paymentsApi.createOrder(planCode),
    onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't start checkout for that plan.")),
  });
}

export function useRetryPayment() {
  return useMutation({
    mutationFn: (paymentId: string) => paymentsApi.retry(paymentId),
    onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't retry that payment.")),
  });
}

