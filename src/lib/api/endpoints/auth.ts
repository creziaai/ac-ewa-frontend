import { apiClient } from "@/lib/api/client";
import type { OrganizationRole } from "@/types/models";

export interface CredentialsInput { email: string; password: string }
export interface TokenPair { accessToken: string; refreshToken: string }
export interface RegisterResponse { user: { id: string; email: string; role: OrganizationRole; emailVerified: boolean }; verificationRequired: true }

export const authApi = {
  register: (input: CredentialsInput) => apiClient.post<RegisterResponse>("/auth/register", input).then((r) => r.data),
  login: (input: CredentialsInput) => apiClient.post<TokenPair>("/auth/login", input).then((r) => r.data),
  verifyEmail: (input: { email: string; otp: string }) => apiClient.post<{ verified: true }>("/auth/verify-email", input).then((r) => r.data),
  resendVerificationOtp: (email: string) => apiClient.post<{ sent: true }>("/auth/resend-verification-otp", { email }).then((r) => r.data),
  forgotPassword: (email: string) => apiClient.post<{ sent: true }>("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (input: { token: string; password: string }) =>
    apiClient.post<{ reset: true }>("/auth/reset-password", input).then((r) => r.data),
};

