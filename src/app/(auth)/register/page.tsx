"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validation/auth";
import { useRegister } from "@/lib/hooks/use-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const registerAccount = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit((values) => {
    // Prevent duplicate submissions using the mutation state.
    // The submit button is also disabled while the request is pending.
    if (registerAccount.isPending) return;

    registerAccount.mutate(values);
  });

  return (
    <AuthShell
      title="Create your account"
      description="Start on the Free plan — 1 website, 5 scans a month, no card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Work email
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            {...register("email")}
          />

          {errors.email && (
            <p
              className="text-sm text-critical"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">
            Password
          </Label>

          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 12 characters"
            {...register("password")}
          />

          {errors.password && (
            <p
              className="text-sm text-critical"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={registerAccount.isPending}
        >
          {registerAccount.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          Create account
        </Button>

        <p className="text-xs text-ink-faint">
          By creating an account you agree to Accewa&apos;s{" "}
          <Link
            href="/terms"
            className="underline hover:text-ink-muted"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-ink-muted"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}