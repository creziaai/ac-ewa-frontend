"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/endpoints/admin";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function useAdminDashboard() {
  return useQuery({ queryKey: ["admin", "dashboard"], queryFn: adminApi.dashboard });
}
export function useAdminUsers(page = 1, pageSize = 25) {
  return useQuery({ queryKey: ["admin", "users", page, pageSize], queryFn: () => adminApi.users(page, pageSize) });
}
export function useAdminOrganizations(page = 1, pageSize = 25) {
  return useQuery({ queryKey: ["admin", "organizations", page, pageSize], queryFn: () => adminApi.organizations(page, pageSize) });
}
export function useAdminRevenue() {
  return useQuery({ queryKey: ["admin", "revenue"], queryFn: adminApi.revenue });
}
export function useAdminPayments(page = 1, pageSize = 25) {
  return useQuery({ queryKey: ["admin", "payments", page, pageSize], queryFn: () => adminApi.payments(page, pageSize) });
}
export function useAdminScans(page = 1, pageSize = 25) {
  return useQuery({ queryKey: ["admin", "scans", page, pageSize], queryFn: () => adminApi.scans(page, pageSize) });
}
export function useAdminReports(page = 1, pageSize = 25) {
  return useQuery({ queryKey: ["admin", "reports", page, pageSize], queryFn: () => adminApi.reports(page, pageSize) });
}
export function useAdminLogs(page = 1, pageSize = 50) {
  return useQuery({ queryKey: ["admin", "logs", page, pageSize], queryFn: () => adminApi.logs(page, pageSize) });
}
export function useAdminJobs() {
  return useQuery({ queryKey: ["admin", "jobs"], queryFn: adminApi.jobs, refetchInterval: 15_000 });
}
export function useSetUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => (active ? adminApi.activateUser(id) : adminApi.deactivateUser(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User updated.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

