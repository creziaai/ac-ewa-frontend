"use client";

import { useState } from "react";
import { Building2, DollarSign, Globe, ScanSearch, Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/shared/data-table";
import { RoleGuard } from "@/components/shared/role-guard";
import { canAccessAdmin } from "@/lib/auth/roles";
import {
  useAdminDashboard,
  useAdminJobs,
  useAdminLogs,
  useAdminOrganizations,
  useAdminPayments,
  useAdminReports,
  useAdminScans,
  useAdminUsers,
  useSetUserActive,
} from "@/lib/hooks/use-admin";
import { formatDateTime, formatMoney } from "@/lib/utils";
import { ScanStatusBadge } from "@/components/shared/impact-badge";
import type { AdminOrganizationRow, AdminReportRow, AdminUserRow } from "@/lib/api/endpoints/admin";
import type { AuditLog, Payment, WebsiteScan } from "@/types/models";

export default function AdminPage() {
  return (
    <RoleGuard allow={canAccessAdmin}>
      <AdminDashboardContent />
    </RoleGuard>
  );
}

function AdminDashboardContent() {
  const { data: metrics, isLoading } = useAdminDashboard();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Admin</h1>
        <p className="text-sm text-ink-muted">Platform-wide metrics and management.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Metric icon={Building2} label="Organizations" value={metrics?.organizations} loading={isLoading} />
        <Metric icon={Users2} label="Users" value={metrics?.users} loading={isLoading} />
        <Metric icon={Globe} label="Websites" value={metrics?.websites} loading={isLoading} />
        <Metric icon={ScanSearch} label="Scans" value={metrics?.scans} loading={isLoading} />
        <Metric
          icon={DollarSign}
          label="Revenue"
          value={metrics ? formatMoney(metrics.revenueCents) : undefined}
          loading={isLoading}
        />
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="scans">Scans</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="logs">Audit logs</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
        <TabsContent value="organizations">
          <OrganizationsTable />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsTable />
        </TabsContent>
        <TabsContent value="scans">
          <ScansTable />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsTable />
        </TabsContent>
        <TabsContent value="logs">
          <LogsTable />
        </TabsContent>
        <TabsContent value="jobs">
          <JobsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | undefined;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <Icon className="h-5 w-5 text-brand" />
        {loading ? <Skeleton className="mt-2 h-6 w-16" /> : <p className="mt-2 font-display text-xl font-semibold">{value}</p>}
        <p className="text-xs text-ink-muted">{label}</p>
      </CardContent>
    </Card>
  );
}

function UsersTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page);
  const setActive = useSetUserActive();

  const columns: Column<AdminUserRow>[] = [
    { header: "Email", cell: (r) => r.email },
    { header: "Organization", cell: (r) => r.organization?.name ?? "—" },
    { header: "Role", cell: (r) => <span className="capitalize">{r.role.toLowerCase()}</span> },
    { header: "Joined", cell: (r) => formatDateTime(r.createdAt) },
    {
      header: "Active",
      cell: (r) => <Switch checked={r.isActive} onCheckedChange={(checked) => setActive.mutate({ id: r.id, active: checked })} />,
    },
  ];

  return <DataTable columns={columns} rows={data?.data} isLoading={isLoading} page={page} pageSize={25} total={data?.total ?? 0} onPageChange={setPage} />;
}

function OrganizationsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrganizations(page);

  const columns: Column<AdminOrganizationRow>[] = [
    { header: "Name", cell: (r) => r.name },
    { header: "Slug", cell: (r) => r.slug },
    { header: "Users", cell: (r) => r._count.users },
    { header: "Websites", cell: (r) => r._count.websites },
    { header: "Plan", cell: (r) => r.subscriptions[0]?.plan?.name ?? "—" },
    { header: "Type", cell: (r) => (r.isAgency ? <Badge>Agency</Badge> : <Badge variant="outline">Standard</Badge>) },
  ];

  return <DataTable columns={columns} rows={data?.data} isLoading={isLoading} page={page} pageSize={25} total={data?.total ?? 0} onPageChange={setPage} />;
}

function PaymentsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminPayments(page);

  const columns: Column<Payment>[] = [
    { header: "Amount", cell: (r) => formatMoney(r.amountCents, r.currency) },
    { header: "Status", cell: (r) => <Badge variant={r.status === "SUCCEEDED" ? "success" : r.status === "FAILED" ? "critical" : "outline"}>{r.status}</Badge> },
    { header: "Retries", cell: (r) => r.retryCount },
    { header: "Date", cell: (r) => formatDateTime(r.createdAt) },
  ];

  return <DataTable columns={columns} rows={data?.data} isLoading={isLoading} page={page} pageSize={25} total={data?.total ?? 0} onPageChange={setPage} />;
}

function ScansTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminScans(page);

  const columns: Column<WebsiteScan>[] = [
    { header: "Target URL", cell: (r) => <span className="max-w-xs truncate block">{r.targetUrl}</span> },
    { header: "Status", cell: (r) => <ScanStatusBadge status={r.status} /> },
    { header: "Score", cell: (r) => r.score ?? "—" },
    { header: "Issues", cell: (r) => r.issueCount },
    { header: "Date", cell: (r) => formatDateTime(r.createdAt) },
  ];

  return <DataTable columns={columns} rows={data?.data} isLoading={isLoading} page={page} pageSize={25} total={data?.total ?? 0} onPageChange={setPage} />;
}

function ReportsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminReports(page);

  const columns: Column<AdminReportRow>[] = [
    { header: "Scan ID", cell: (r) => <span className="font-mono text-xs">{r.scanId.slice(0, 8)}</span> },
    { header: "Format", cell: (r) => <Badge variant="outline">{r.format}</Badge> },
    { header: "Generated", cell: (r) => formatDateTime(r.createdAt) },
    {
      header: "File",
      cell: (r) =>
        r.storageUrl ? (
          <a href={r.storageUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">
            Download
          </a>
        ) : (
          "—"
        ),
    },
  ];

  return <DataTable columns={columns} rows={data?.data} isLoading={isLoading} page={page} pageSize={25} total={data?.total ?? 0} onPageChange={setPage} />;
}

function LogsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminLogs(page, 50);

  const columns: Column<AuditLog>[] = [
    { header: "Action", cell: (r) => <span className="font-mono text-xs">{r.action}</span> },
    { header: "Entity", cell: (r) => `${r.entityType}${r.entityId ? ` #${r.entityId.slice(0, 8)}` : ""}` },
    { header: "IP", cell: (r) => r.ipAddress ?? "—" },
    { header: "Date", cell: (r) => formatDateTime(r.createdAt) },
  ];

  return <DataTable columns={columns} rows={data?.data} isLoading={isLoading} page={page} pageSize={50} total={data?.total ?? 0} onPageChange={setPage} />;
}

function JobsTable() {
  const { data, isLoading } = useAdminJobs();

  const columns: Column<{ id: string; status: string; targetUrl: string; createdAt: string; completedAt: string | null; error: string | null }>[] = [
    { header: "Target URL", cell: (r) => <span className="max-w-xs truncate block">{r.targetUrl}</span> },
    { header: "Status", cell: (r) => <ScanStatusBadge status={r.status} /> },
    { header: "Created", cell: (r) => formatDateTime(r.createdAt) },
    { header: "Completed", cell: (r) => formatDateTime(r.completedAt) },
    { header: "Error", cell: (r) => <span className="max-w-xs truncate block text-critical">{r.error ?? "—"}</span> },
  ];

  return <DataTable columns={columns} rows={data} isLoading={isLoading} page={1} pageSize={20} total={data?.length ?? 0} onPageChange={() => {}} />;
}

