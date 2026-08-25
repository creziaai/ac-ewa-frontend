import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAuthSnapshot, useAuthStore } from "@/lib/store/auth-store";
import type { ApiErrorPayload } from "@/types/models";

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// Accept both Render forms:
//   https://api.example.com
//   https://api.example.com/api/v1
// without ever producing /api/v1/api/v1.
const API_URL = configuredApiUrl
  .replace(/\/+$/, "")
  .replace(/\/api\/v1$/i, "");

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// A bare client (no auth, no interceptors) for the refresh call itself,
// to avoid recursively triggering the response interceptor below.
const refreshClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = getAuthSnapshot();

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

// Ensures concurrent 401s trigger exactly one /auth/refresh call.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getAuthSnapshot();

  if (!refreshToken) return null;

  try {
    // POST /auth/refresh reads the identity off the bearer token itself.
    // The refresh token is sent as the Authorization header.
    const { data } = await refreshClient.post<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh", undefined, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    useAuthStore.getState().setTokens(data);

    return data.accessToken;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh");

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !isAuthEndpoint
    ) {
      originalRequest._retried = true;

      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );

        return apiClient(originalRequest);
      }

      useAuthStore.getState().clear();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Extracts a human-readable message from the backend's error envelope,
 * whatever shape it takes:
 *
 * - plain string
 * - class-validator ValidationPipe object
 * - nested error object
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    const inner = payload?.error;

    if (typeof inner === "string") {
      return inner;
    }

    if (inner && typeof inner === "object") {
      if (Array.isArray(inner.message)) {
        return inner.message.join(" ");
      }

      if (typeof inner.message === "string") {
        return inner.message;
      }
    }

    if (error.message === "Network Error") {
      return "Can't reach the server. Check your connection and try again.";
    }
  }

  return fallback;
}

export type { AxiosRequestConfig };