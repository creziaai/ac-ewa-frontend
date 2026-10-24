"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  ScanSearch,
  FileText,
  Sparkles,
  CreditCard,
  Settings,
  
  Building2,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { canAccessAdmin, canAccessAgency } from "@/lib/auth/roles";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/websites", label: "Websites", icon: Globe },
  { href: "/scans", label: "Scans", icon: ScanSearch },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center px-6">
  <Link href="/" className="flex items-center">
    <img
      src="/accewa-icon.png"
      alt="Accewa"
      className="h-9 w-auto object-contain"
    />
  </Link>
</div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-brand-tint text-brand-ink" : "text-ink-muted hover:bg-surface-raised hover:text-ink"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {canAccessAgency(user?.role) && (
          <>
            <div className="mt-4 mb-1 px-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Agency</div>
            <Link
              href="/agency"
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/agency") ? "bg-brand-tint text-brand-ink" : "text-ink-muted hover:bg-surface-raised hover:text-ink"
              )}
            >
              <Building2 className="h-4 w-4" />
              Clients &amp; white-label
            </Link>
          </>
        )}

        {canAccessAdmin(user?.role) && (
          <>
            <div className="mt-4 mb-1 px-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Platform</div>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin") ? "bg-brand-tint text-brand-ink" : "text-ink-muted hover:bg-surface-raised hover:text-ink"
              )}
            >
              <Users2 className="h-4 w-4" />
              Admin
            </Link>
          </>
        )}
      </nav>
      <div className="border-t border-border p-4 text-xs text-ink-faint">Accewa · WCAG 2.2 AA</div>
    </aside>
  );
}

