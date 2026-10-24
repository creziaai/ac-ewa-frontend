"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { scansApi } from "@/lib/api/endpoints/scans";
import { websitesApi } from "@/lib/api/endpoints/websites";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { ScanStatus } from "@/types/models";

const ACTIVE_STATUSES: ScanStatus[] = ["QUEUED", "RUNNING"];

export function useScans() {
  return useQuery({
    queryKey: ["scans"],
    queryFn: scansApi.list,
    refetchInterval: (query) => {
      const scans = query.state.data ?? [];
      return scans.some((scan) => ACTIVE_STATUSES.includes(scan.status))
        ? 3000
        : false;
    },
    refetchOnWindowFocus: true,
  });
}

export function useScan(scanId: string | undefined) {
  return useQuery({
    queryKey: ["scans", scanId],
    queryFn: () => scansApi.get(scanId as string),
    enabled: Boolean(scanId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ACTIVE_STATUSES.includes(status) ? 2000 : false;
    },
    refetchOnWindowFocus: true,
  });
}

export function useScanFindings(
  scanId: string | undefined,
  scanStatus?: ScanStatus,
) {
  return useQuery({
    queryKey: ["scans", scanId, "findings"],
    queryFn: () => scansApi.findings(scanId as string),
    enabled: Boolean(scanId),
    refetchInterval: scanStatus && ACTIVE_STATUSES.includes(scanStatus) ? 2000 : false,
    refetchOnWindowFocus: true,
  });
}

export function useCancelScan() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: string) => scansApi.cancel(id), onSuccess: (data) => { queryClient.setQueryData(["scans", data.id], data); queryClient.invalidateQueries({ queryKey: ["scans"] }); toast.success("Scan cancelled."); }, onError: (error) => toast.error(getApiErrorMessage(error, "Could not cancel the scan.")) });
}

export function useStartScan() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => scansApi.start(url),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("Scan queued — this usually takes under a minute.");
      router.push(`/scans/${data.id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Couldn't start that scan."));
    },
  });
}

export function useStartWebsiteScan() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ websiteId, url }: { websiteId: string; url: string }) =>
      websitesApi.startScan(websiteId, url),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("Scan queued.");
      if (data?.id) router.push(`/scans/${data.id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Couldn't start that scan."));
    },
  });
}

