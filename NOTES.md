# Integration notes

Things discovered while reading the actual backend (`accewa-backend.zip`) that shaped frontend decisions, plus what's still open for the next slice.

## Backend quirks the frontend had to work around

- **`/auth/login` and `/auth/refresh` return only `{ accessToken, refreshToken }`** — no user object (only `/auth/register` returns one). The frontend decodes the JWT payload client-side (`src/lib/auth/jwt.ts`) to recover `{ id, email, role }`. This is display-only; the backend independently verifies every request.
- **Role casing is inconsistent.** `register` keeps the Prisma enum casing (`"OWNER"`); `login` lowercases it (`"owner"`). `RolesGuard` on the backend lowercases before comparing, so the frontend does the same everywhere via `normalizeRole()` (`src/lib/auth/roles.ts`).
- **No distinct "platform admin" role.** `AdminController` and `AgencyController` both accept the org-level `ADMIN` role — there's no separate super-admin flag in the schema. The sidebar shows both Admin and Agency sections to any admin-role user; this mirrors the backend's actual behavior rather than inventing a stricter model.
- **No "list all scans/reports for my org" endpoint** exists for regular org users (only `GET /admin/scans` and `GET /admin/reports`, which are admin-only and platform-wide). The `/scans` and `/reports` pages instead surface `SCAN_COMPLETED` / `SCAN_FAILED` notifications as a real, backend-sourced activity feed, linking into `/scans/[id]` for full detail. If a real list-scans endpoint gets added, swap that in.
- **`/billing/plans` requires auth** (no `@Public()`), so the public marketing `/pricing` page can't call it. It shows static figures that mirror `prisma/seed.ts` exactly. The in-app Billing → Plans tab always calls the live endpoint.
- **Report generation doesn't emit a notification** (only an email, per `worker.ts`) — only scan completion does. The scan detail page reads `scan.reports[0].storageUrl` directly instead.
- **Payment → plan activation is two calls**, not one: `POST /payments/verify` (confirms the Razorpay signature) then `POST /billing/subscription/upgrade` (actually swaps the plan) — the controller comment says as much. The billing page's checkout handler chains both.
- **Error envelope** from `HttpExceptionFilter` wraps everything in `{ statusCode, error, requestId, timestamp }`, where `error` is sometimes a plain string and sometimes `{ statusCode, message, error }` from `ValidationPipe` (with `message` possibly an array). `getApiErrorMessage()` in `src/lib/api/client.ts` normalizes all of that into one string for toasts.

## Gaps to close in the next slice

- **Organization/team settings**: there's no `GET /organizations/me`, team member list, or invite endpoint in the backend, so Settings is read-only (just the signed-in user's email/role). If those endpoints get added, build out Team Members here.
- **Profile editing**: no `PATCH /users/me` exists yet, so there's no way to change email/password/name from the UI.
- **Website deactivation/deletion**: `Website.isActive` exists in the schema but there's no corresponding PATCH/DELETE route — the Websites page only reads it.
- **Client-scoped report browsing** (`GET /agency/clients/:id/reports`) is wired up in `src/lib/api/endpoints/agency.ts` and `use-agency.ts` but doesn't have a page yet — worth a client detail view under `/agency`.
- **Real-time score/usage charts** (Recharts is installed but unused) — the dashboard currently shows point-in-time cards; a trend chart needs either a new analytics endpoint or client-side aggregation from scan history.
- **Webhook-driven live updates** — scan status currently polls every 3s while `QUEUED`/`RUNNING`; swapping to SSE/WebSockets would need a corresponding backend endpoint.

## Auth/session mechanics

- Tokens live in a Zustand store persisted to `localStorage` (`src/lib/store/auth-store.ts`). A separate, non-sensitive cookie (`accewa_session`) is set alongside it purely so `middleware.ts` — which runs on the edge before any client JS — can gate `/dashboard/*` routes without waiting for hydration.
- Axios attaches the access token on every request and, on a 401, does a single-flight `/auth/refresh` (concurrent 401s share one refresh call) before retrying the original request.
