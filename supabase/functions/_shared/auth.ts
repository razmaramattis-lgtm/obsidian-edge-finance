import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const authCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function bearer(req: Request): string | null {
  const h = req.headers.get("Authorization") || req.headers.get("authorization");
  if (!h || !h.startsWith("Bearer ")) return null;
  return h.slice(7).trim();
}

/** True when the request is made with the service-role key (internal server-to-server / DB trigger). */
export function isInternalCall(req: Request): boolean {
  const token = bearer(req);
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return !!token && !!serviceKey && token === serviceKey;
}

export interface Caller {
  userId: string;
  profileId: string | null;
  isAdmin: boolean;
  isEmployeeOrAdmin: boolean;
}

function deny(status: number, message: string, cors: Record<string, string>): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

/**
 * Verifies the caller's JWT and resolves their role.
 * Returns a Response when the caller is not authenticated (401).
 */
export async function getCaller(
  req: Request,
  cors: Record<string, string> = authCorsHeaders,
): Promise<{ caller: Caller } | { response: Response }> {
  const token = bearer(req);
  if (!token) return { response: deny(401, "Unauthorized", cors) };

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const anonClient = createClient(url, anonKey);
  const { data, error } = await anonClient.auth.getUser(token);
  if (error || !data?.user) return { response: deny(401, "Unauthorized", cors) };

  const admin = createClient(url, serviceKey);
  const [{ data: isAdmin }, { data: isStaff }, { data: profileId }] = await Promise.all([
    admin.rpc("is_admin", { uid: data.user.id }),
    admin.rpc("is_employee_or_admin", { uid: data.user.id }),
    admin.rpc("current_profile_id", { uid: data.user.id }),
  ]);

  return {
    caller: {
      userId: data.user.id,
      profileId: (profileId as string | null) ?? null,
      isAdmin: !!isAdmin,
      isEmployeeOrAdmin: !!isStaff,
    },
  };
}

/**
 * Requires the caller to be a logged-in employee or admin (admin only when `adminOnly`).
 * Returns a Response (401/403) when the check fails.
 */
export async function requireStaff(
  req: Request,
  opts: { adminOnly?: boolean; cors?: Record<string, string> } = {},
): Promise<{ caller: Caller } | { response: Response }> {
  const cors = opts.cors ?? authCorsHeaders;
  const result = await getCaller(req, cors);
  if ("response" in result) return result;
  const allowed = opts.adminOnly ? result.caller.isAdmin : result.caller.isEmployeeOrAdmin;
  if (!allowed) return { response: deny(403, "Forbidden", cors) };
  return result;
}

/**
 * Confirms the email belongs to an existing applicant record so recruiting
 * emails cannot be aimed at arbitrary third parties.
 */
export async function isKnownApplicant(email: string): Promise<boolean> {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const normalized = email.trim().toLowerCase();
  const [job, open] = await Promise.all([
    admin.from("job_applications").select("id").ilike("email", normalized).limit(1),
    admin.from("open_applications").select("id").ilike("email", normalized).limit(1),
  ]);
  return !!(job.data?.length || open.data?.length);
}
