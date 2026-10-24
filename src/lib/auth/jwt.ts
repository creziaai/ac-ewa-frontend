import type { AuthUser } from "@/types/models";

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * The backend's /auth/login and /auth/refresh responses only contain
 * { accessToken, refreshToken } — no user object (only /auth/register returns
 * one). We decode the JWT payload client-side to recover { id, email, role }.
 * This is display-only; the backend independently verifies the signature on
 * every request, so there's no trust placed in this decoding.
 */
export function decodeAccessToken(accessToken: string): AuthUser | null {
  try {
    const [, payloadSegment] = accessToken.split(".");
    const json = JSON.parse(atob(payloadSegment.replace(/-/g, "+").replace(/_/g, "/")));
    const payload = json as AccessTokenPayload;
    return { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

/** Roles are inconsistently cased by the backend (register keeps enum casing
 * like "OWNER", login lowercases to "owner"). Normalize everywhere we compare. */
export function normalizeRole(role: string | undefined | null): string {
  return (role ?? "").toLowerCase();
}

