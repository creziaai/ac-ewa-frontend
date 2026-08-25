import { apiClient } from "@/lib/api/client";
import type { AuditLog, Organization, Paginated, Payment, Plan, Subscription, WebsiteScan } from "@/types/models";

export interface AdminDashboard {
  organizations: number; users: number; websites: number; scans: number; activeSubscriptions: number; revenueCents: number;
}
export interface AdminUserRow { id: string; email: string; role: string; isActive: boolean; createdAt: string; organization: { id: string; name: string } }
export interface AdminOrganizationRow extends Organization { _count: { users: number; websites: number }; subscriptions: (Subscription & { plan: Plan })[] }
export interface AdminReportRow { id: string; scanId: string; format: "JSON" | "PDF"; storageUrl: string | null; createdAt: string }
export interface AdminJobRow { id: string; status: string; targetUrl: string; createdAt: string; completedAt: string | null; error: string | null }

const page = (page = 1, pageSize = 25) => ({ params: { page, pageSize } });

export const adminApi = {
  dashboard: () => apiClient.get<AdminDashboard>("/admin/dashboard").then((r) => r.data),
  users: (p = 1, size = 25) => apiClient.get<Paginated<AdminUserRow>>("/admin/users", page(p, size)).then((r) => r.data),
  activateUser: (id: string) => apiClient.patch(`/admin/users/${id}/activate`).then((r) => r.data),
  deactivateUser: (id: string) => apiClient.patch(`/admin/users/${id}/deactivate`).then((r) => r.data),
  organizations: (p = 1, size = 25) => apiClient.get<Paginated<AdminOrganizationRow>>("/admin/organizations", page(p, size)).then((r) => r.data),
  revenue: () => apiClient.get<{ totalCents: number; byPlan: Record<string, number> }>("/admin/revenue").then((r) => r.data),
  payments: (p = 1, size = 25) => apiClient.get<Paginated<Payment>>("/admin/payments", page(p, size)).then((r) => r.data),
  scans: (p = 1, size = 25) => apiClient.get<Paginated<WebsiteScan>>("/admin/scans", page(p, size)).then((r) => r.data),
  reports: (p = 1, size = 25) => apiClient.get<Paginated<AdminReportRow>>("/admin/reports", page(p, size)).then((r) => r.data),
  logs: (p = 1, size = 50) => apiClient.get<Paginated<AuditLog>>("/admin/logs", page(p, size)).then((r) => r.data),
  jobs: () => apiClient.get<{ data: AdminJobRow[] }>("/admin/jobs").then((r) => r.data.data),
};

