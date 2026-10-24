"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number | null;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

/**
 * The product's one recurring visual signature: an accessibility score ring.
 * Rather than a plain progress circle, the ring's color scales across the same
 * four-step severity scale (critical/serious/moderate/minor) used everywhere
 * else in the product — issue badges, plan limits, PDF reports — so a glance
 * at the ring tells you which "band" a site is in.
 */
export function ScoreRing({ score, size = 96, strokeWidth = 8, label, className }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = score === null ? 0 : Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="fill-none stroke-border" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={score === null ? circumference : offset}
          style={{ transition: "stroke-dashoffset 700ms ease-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold tabular-nums" style={{ color }}>
          {score === null ? "—" : Math.round(score)}
        </span>
        {label && <span className="text-[10px] uppercase tracking-wide text-ink-faint">{label}</span>}
      </div>
    </div>
  );
}

export function scoreColor(score: number | null): string {
  if (score === null) return "var(--ink-faint)";
  if (score >= 90) return "var(--minor)";
  if (score >= 75) return "var(--moderate)";
  if (score >= 50) return "var(--serious)";
  return "var(--critical)";
}

export function scoreBadgeVariant(score: number | null): "minor" | "moderate" | "serious" | "critical" | "neutral" {
  if (score === null) return "neutral";
  if (score >= 90) return "minor";
  if (score >= 75) return "moderate";
  if (score >= 50) return "serious";
  return "critical";
}

