import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-brand-tint text-brand-ink",
      outline: "border border-border-strong text-ink-muted",
      success: "bg-success-tint text-success",
      critical: "bg-critical-tint text-critical",
      serious: "bg-serious-tint text-serious",
      moderate: "bg-moderate-tint text-moderate",
      minor: "bg-minor-tint text-minor",
      neutral: "bg-surface-raised text-ink-muted border border-border",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

