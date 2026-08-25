/**
 * The backend issues JWTs in the response body (no httpOnly cookies are set by
 * the API), so tokens live in the Zustand auth store (persisted to localStorage).
 * We mirror a lightweight "is there a session" flag into a plain cookie purely so
 * `middleware.ts` (which runs on the edge, before any client JS executes) can
 * decide whether to redirect unauthenticated visitors away from /dashboard/*.
 * The real access token used for API calls never touches this cookie.
 */
const SESSION_FLAG_COOKIE = "Accewa_session";

export function setSessionFlagCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_FLAG_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function clearSessionFlagCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_FLAG_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export const SESSION_FLAG_COOKIE_NAME = SESSION_FLAG_COOKIE;

