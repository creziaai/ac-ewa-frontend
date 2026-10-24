"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { canAccessAdmin, canAccessAgency } from "@/lib/auth/roles";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/websites", label: "Websites" },
  { href: "/scans", label: "Scans" },
  { href: "/reports", label: "Reports" },
  { href: "/ai", label: "AI Assistant" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <DialogContent className="top-0 left-0 h-full w-72 max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-r p-4">
        <DialogTitle className="font-display text-base">Accewa</DialogTitle>
        <nav className="mt-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium",
                pathname.startsWith(item.href) ? "bg-brand-tint text-brand-ink" : "text-ink-muted hover:bg-surface-raised"
              )}
            >
              {item.label}
            </Link>
          ))}
          {canAccessAgency(user?.role) && (
            <Link href="/agency" onClick={() => setOpen(false)} className="block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-raised">
              Agency
            </Link>
          )}
          {canAccessAdmin(user?.role) && (
            <Link href="/admin" onClick={() => setOpen(false)} className="block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-raised">
              Admin
            </Link>
          )}
        </nav>
      </DialogContent>
    </Dialog>
  );
}

