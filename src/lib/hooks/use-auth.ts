"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi, type CredentialsInput } from "@/lib/api/endpoints/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { decodeAccessToken } from "@/lib/auth/jwt";
import { toast } from "sonner";

export function useAuth() {
  const { user, accessToken, hasHydrated, clear } = useAuthStore();
  return { user, isAuthenticated: Boolean(accessToken), hasHydrated, logout: clear };
}

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: CredentialsInput) => authApi.login(input),
    onSuccess: (tokens) => {
      const user = decodeAccessToken(tokens.accessToken);
      if (!user) {
        toast.error("Signed in, but the session token couldn't be read. Please try again.");
        return;
      }
      setSession({ ...tokens, user });
      toast.success("Welcome back.");
      router.push("/dashboard");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "We couldn't sign you in. Check your email and password.")),
  });
}

export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: CredentialsInput) => authApi.register(input),
    onSuccess: (_data, variables) => {
      toast.success("Account created. Check your email for the 6-digit verification code.");
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "We couldn't create your account.")),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => toast.success("If that email exists, a reset link is on its way."),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: (input: { token: string; password: string }) => authApi.resetPassword(input),
    onSuccess: () => {
      toast.success("Password reset. Sign in with your new password.");
      router.push("/login");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "This reset link is invalid or has expired.")),
  });
}

export function useResendVerificationOtp() {
  return useMutation({ mutationFn: (email: string) => authApi.resendVerificationOtp(email), onSuccess: () => toast.success("A new verification code was sent."), onError: (error) => toast.error(getApiErrorMessage(error, "Could not send a new code.")) });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (input: { email: string; otp: string }) => authApi.verifyEmail(input),
    onError: (error) => toast.error(getApiErrorMessage(error, "This verification link is invalid or has expired.")),
  });
}

export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  return () => {
    clear();
    queryClient.clear();
    router.push("/login");
  };
}

