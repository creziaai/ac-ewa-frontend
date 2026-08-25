import { Badge } from "@/components/ui/badge";
import type { ScanImpact } from "@/types/models";
import { cn } from "@/lib/utils";

const IMPACT_CONFIG: Record<ScanImpact, { label: string; variant: "critical" | "serious" | "moderate" | "minor" | "neutral" }> = {
  CRITICAL: { label: "Critical", variant: "critical" },
  SERIOUS: { label: "Serious", variant: "serious" },
  MODERATE: { label: "Moderate", variant: "moderate" },
  MINOR: { label: "Minor", variant: "minor" },
  UNKNOWN: { label: "Unknown", variant: "neutral" },
};

export function ImpactBadge({ impact, className }: { impact: ScanImpact; className?: string }) {
  const config = IMPACT_CONFIG[impact] ?? IMPACT_CONFIG.UNKNOWN;
  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}

export function ScanStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "success" | "critical" | "outline" | "neutral" }> = {
    COMPLETED: { label: "Completed", variant: "success" },
    FAILED: { label: "Failed", variant: "critical" },
    RUNNING: { label: "Running", variant: "outline" },
    QUEUED: { label: "Queued", variant: "neutral" },
    CANCELLED: { label: "Cancelled", variant: "neutral" },
  };
  const config = map[status] ?? { label: status, variant: "neutral" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

