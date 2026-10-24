"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/endpoints/analytics";

export function useAnalyticsOverview() {
  return useQuery({ queryKey: ["analytics", "overview"], queryFn: analyticsApi.overview });
}

export function useAuditLogs() {
  return useQuery({ queryKey: ["analytics", "logs"], queryFn: analyticsApi.logs });
}

