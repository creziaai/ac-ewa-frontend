import { normalizeRole } from "@/lib/auth/jwt";

/**
 * Both /admin and /agency backend routes accept the org-level "admin" role
 * (RolesGuard just checks the JWT role string against @Roles(...) lists — see
 * AdminController @Roles('admin') and AgencyController @Roles('agency','admin')).
 * There is no distinct platform-super-admin role in the schema, so "admin" is
 * used for both. We additionally gate the Agency section in the UI on nothing
 * else, since the backend itself doesn't check `organization.isAgency` — any
 * admin-role user of any org can technically call agency endpoints.
 */
export function canAccessAdmin(role: string | undefined | null) {
  return normalizeRole(role) === "admin";
}

export function canAccessAgency(role: string | undefined | null) {
  const r = normalizeRole(role);
  return r === "admin" || r === "agency";
}

export function isOwnerOrAdmin(role: string | undefined | null) {
  const r = normalizeRole(role);
  return r === "owner" || r === "admin";
}

