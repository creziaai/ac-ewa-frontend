"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agencyApi } from "@/lib/api/endpoints/agency";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { BrandSettingsInput, CreateClientInput } from "@/lib/validation/agency";

export function useAgencyClients() {
  return useQuery({ queryKey: ["agency", "clients"], queryFn: agencyApi.clients });
}
export function useAgencyClientReports(clientId: string | undefined) {
  return useQuery({
    queryKey: ["agency", "clients", clientId, "reports"],
    queryFn: () => agencyApi.clientReports(clientId as string),
    enabled: Boolean(clientId),
  });
}
export function useCreateAgencyClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClientInput) => agencyApi.createClient(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "clients"] });
      toast.success("Client onboarded. They'll receive an email to set their password.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't onboard that client.")),
  });
}
export function useAgencyBrandSettings() {
  return useQuery({ queryKey: ["agency", "brand-settings"], queryFn: agencyApi.brandSettings });
}
export function useUpdateBrandSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BrandSettingsInput) => agencyApi.updateBrandSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "brand-settings"] });
      toast.success("Brand settings saved.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
export function useAgencyApiKeys() {
  return useQuery({ queryKey: ["agency", "api-keys"], queryFn: agencyApi.apiKeys });
}
export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => agencyApi.createApiKey(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "api-keys"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => agencyApi.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "api-keys"] });
      toast.success("API key revoked.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

