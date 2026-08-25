"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

export function RoleGuard({ allow, children }: { allow: (role: string | undefined | null) => boolean; children: React.ReactNode }) {
  const { user, hasHydrated } = useAuth();
  const router = useRouter();
  const allowed = allow(user?.role);

  useEffect(() => {
    // The backend's RolesGuard will 403 these calls regardless; this is purely
    // to avoid flashing an admin/agency UI shell at someone who can't use it.
    if (hasHydrated && user && !allowed) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, user, allowed, router]);

  if (!hasHydrated || !user) return null;

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <ShieldAlert className="h-8 w-8 text-ink-faint" />
        <p className="text-sm text-ink-muted">You don&apos;t have access to this section.</p>
      </div>
    );
  }

  return <>{children}</>;
}

