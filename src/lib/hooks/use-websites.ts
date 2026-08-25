"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { websitesApi } from "@/lib/api/endpoints/websites";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { CreateWebsiteInput } from "@/lib/validation/websites";

export function useWebsites() {
  return useQuery({ queryKey: ["websites"], queryFn: websitesApi.list });
}

export function useCreateWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateWebsiteInput) => websitesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      toast.success("Website added.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't add that website.")),
  });
}

export function useStartWebsiteScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ websiteId, url }: { websiteId: string; url: string }) => websitesApi.startScan(websiteId, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("Scan queued.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't start that scan.")),
  });
}

