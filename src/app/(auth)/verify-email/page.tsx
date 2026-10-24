"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  useResendVerificationOtp,
  useVerifyEmail,
} from "@/lib/hooks/use-auth";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");

  const verify = useVerifyEmail();
  const resend = useResendVerificationOtp();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length === 6 && email) {
      verify.mutate({
        email,
        otp,
      });
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      description={`Enter the 6-digit code sent to ${
        email || "your email"
      }.`}
    >
      {verify.isSuccess ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-success-tint bg-success-tint p-4 text-sm text-success">
            <CheckCircle2 className="h-5 w-5 shrink-0" />

            <span>Your email is verified.</span>
          </div>

          <Button
            asChild
            className="w-full"
            size="lg"
          >
            <Link href="/login">
              Continue to sign in
            </Link>
          </Button>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="otp">
              Verification code
            </Label>

            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6),
                )
              }
              placeholder="123456"
              className="text-center text-2xl tracking-[0.5em]"
              aria-describedby="otp-help"
            />

            <p
              id="otp-help"
              className="text-center text-xs text-ink-faint"
            >
              Enter the 6-digit verification code
            </p>
          </div>

          {verify.isError && (
            <p
              className="text-sm text-critical"
              role="alert"
            >
              The code is invalid or expired.
              Please request a new code and try again.
            </p>
          )}

          {resend.isSuccess && (
            <p
              className="text-sm text-success"
              role="status"
            >
              A new verification code has been sent.
            </p>
          )}

          {resend.isError && (
            <p
              className="text-sm text-critical"
              role="alert"
            >
              We couldn&apos;t send a new code. Please try
again.
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={
              !email ||
              otp.length !== 6 ||
              verify.isPending
            }
          >
            {verify.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {verify.isPending
              ? "Verifying…"
              : "Verify email"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={
              !email ||
              resend.isPending
            }
            onClick={() => {
              if (email) {
                resend.mutate(email);
              }
            }}
          >
            {resend.isPending
              ? "Sending…"
              : "Resend code"}
          </Button>

          <p className="text-center text-sm text-ink-muted">
            <Link
              href="/login"
              className="text-brand hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}

function VerifyEmailLoading() {
  return (
    <AuthShell
      title="Verify your email"
      description="Loading verification details…"
    >
      <div className="flex min-h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailForm />
    </Suspense>
  );
}