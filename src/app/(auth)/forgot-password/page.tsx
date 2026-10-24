"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth";
import { useForgotPassword } from "@/lib/hooks/use-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  return (
    <AuthShell
      title="Reset your password"
      description="Enter the email on your account and we'll send a link to reset your password."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {forgotPassword.isSuccess ? (
        <div className="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-surface-raised p-4">
          <MailCheck className="h-5 w-5 text-brand" />
          <p className="text-sm text-ink">
            If an account exists for that email, a reset link is on its way. It expires in 1 hour.
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit((values) => forgotPassword.mutate(values.email))} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-critical" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={forgotPassword.isPending}>
            {forgotPassword.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

