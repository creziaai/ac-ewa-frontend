"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, useLogout } from "@/lib/hooks/use-auth";
import { initials } from "@/lib/utils";
import { normalizeRole } from "@/lib/auth/jwt";

export default function SettingsPage() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-ink-muted">Your account details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Profile editing isn&apos;t available yet — this reflects what&apos;s on your account today.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-sm">{user ? initials(user.email) : "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-ink">{user?.email}</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {normalizeRole(user?.role) || "member"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => logout()}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

