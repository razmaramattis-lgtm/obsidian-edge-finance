// Shared auth helper for CRM edge functions.
// Accepts both the exact service-role key and any valid service_role JWT
// (the scheduler may carry a legacy/rotated key that still decodes to service_role).
export function isServiceRoleToken(token: string, serviceKey: string): boolean {
  if (!token) return false;
  if (token === serviceKey) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.role === "service_role" && (!payload.exp || payload.exp * 1000 > Date.now());
  } catch {
    return false;
  }
}
