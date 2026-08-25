/**
 * Types mirroring the Accewa backend's Prisma schema (prisma/schema.prisma).
 * Keep these in sync with the backend. Dates are ISO strings as received over JSON.
 */

export type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type ScanStatus = "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";

export type ScanImpact = "CRITICAL" | "SERIOUS" | "MODERATE" | "MINOR" | "UNKNOWN";

export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "UNPAID";

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export type ReportFormat = "JSON" | "PDF";

export type NotificationType = "SCAN_COMPLETED" | "SCAN_FAILED" | "BILLING" | "SYSTEM";

export type UsageMetric = "WEBSITES" | "SCANS" | "AI_REQUESTS" | "REPORTS";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  isAgency: boolean;
  parentOrganizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyBrandSettings {
  id: string;
  organizationId: string;
  brandName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  supportEmail: string | null;
  customDomain: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string; // lowercased in JWT payload on login; see lib/api/client.ts normalizeRole
}

export interface Website {
  id: string;
  organizationId: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteScan {
  id: string;
  websiteId: string | null;
  requestedById: string;
  targetUrl: string;
  status: ScanStatus;
  score: number | null;
  progress: number;
  progressStep: string | null;
  pagesScanned: number;
  issueCount: number;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
  report: ScanReportPayload | null;
  createdAt: string;
  reports?: AccessibilityReport[];
  _count?: { results: number; issues: number };
}

export interface ScanReportPayload {
  generatedAt: string;
  score: number;
  totals: Record<string, number>;
  pages: Array<{ url: string; title: string; score: number; issueCount: number }>;
}

export interface AccessibilityIssue {
  id: string;
  scanId: string;
  scanResultId: string;
  ruleId: string | null;
  axeRuleId: string;
  impact: ScanImpact;
  help: string;
  description: string;
  html: string;
  target: string[];
  failureSummary: string | null;
  wcagCriteria: string[];
  createdAt: string;
  scanResult?: { url: string };
  rule?: { axeRuleId: string; helpUrl: string | null };
}

export interface AccessibilityReport {
  id: string;
  scanId: string;
  format: ReportFormat;
  storageUrl: string | null;
  storageKey: string | null;
  payload: ScanReportPayload | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  subject: string;
  body: string;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface Plan {
  id: string;
  organizationId: string | null;
  name: string;
  code: string;
  amountCents: number;
  currency: string;
  interval: string;
  websiteLimit: number;
  scanLimit: number;
  aiRequestLimit: number;
  reportLimit: number;
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
}

export interface Payment {
  id: string;
  subscriptionId: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  retryCount: number;
  paidAt: string | null;
  createdAt: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  razorpayInvoiceId: string | null;
  amountDueCents: number;
  amountPaidCents: number;
  status: PaymentStatus;
  hostedUrl: string | null;
  issuedAt: string;
}

export interface UsageSummaryItem {
  metric: UsageMetric;
  used: number;
  limit: number; // -1 means unlimited
}

export interface UsageSummary {
  plan: { name: string; code: string } | null;
  usage: UsageSummaryItem[];
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messages: AIMessage[];
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: string;
}

/** Generic paginated list shape returned by admin list endpoints. */
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Shape produced by HttpExceptionFilter on the backend. `error` is either a plain
 * string (e.g. thrown as `new UnauthorizedException('message')`) or the object
 * returned by class-validator's ValidationPipe: { statusCode, message, error }.
 */
export interface ApiErrorPayload {
  statusCode: number;
  error: string | { statusCode: number; message: string | string[]; error: string };
  requestId: string;
  timestamp: string;
}

