// Fetches roles (daglig leder / innehaver / styreleder / regnskapsfører) from Brønnøysundregistrene
// for CRM leads that are missing a contact name.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRREG = "https://data.brreg.no/enhetsregisteret/api/enheter";
const TIME_BUDGET_MS = 55_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function fetchRoles(orgnr: string) {
  try {
    const res = await fetch(`${BRREG}/${orgnr}/roller`, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    const groups = data?.rollegrupper || [];
    const roles: { type: string; name: string }[] = [];
    let accountant: string | null = null;
    let hasAuditor = false;
    let leader: string | null = null;
    let owner: string | null = null;
    let chair: string | null = null;

    for (const g of groups) {
      const gType = g?.type?.kode || "";
      for (const r of g?.roller || []) {
        if (r?.fratraadt) continue;
        const name = r?.person
          ? [r.person?.navn?.fornavn, r.person?.navn?.mellomnavn, r.person?.navn?.etternavn].filter(Boolean).join(" ")
          : r?.enhet?.navn || "";
        if (!name) continue;
        const kode = r?.type?.kode || gType;
        roles.push({ type: kode, name });
        if (kode === "REGN" && !accountant) accountant = name;
        if (kode === "REVI") hasAuditor = true;
        if (kode === "DAGL" && !leader) leader = name;
        if (kode === "INNH" && !owner) owner = name;
        if (kode === "LEDE" && !chair) chair = name;
      }
    }
    return { roles, accountant, hasAuditor, contact: leader || owner || chair };
  } catch {
    return null;
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(url, serviceKey);

  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();
  if (token !== serviceKey) {
    if (!token) return json({ error: "Unauthorized" }, 401);
    const anon = createClient(url, anonKey);
    const { data: userData, error } = await anon.auth.getUser(token);
    if (error || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const { data: isStaff } = await admin.rpc("is_employee_or_admin", { uid: userData.user.id });
    if (!isStaff) return json({ error: "Forbidden" }, 403);
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty */ }

  const leadIds = Array.isArray(body.leadIds) ? (body.leadIds as string[]) : null;
  const limit = Math.min(Number(body.limit) || 100, 300);

  let q = admin.from("crm_leads").select("id, orgnr, contact_name, manual_lock");
  if (leadIds?.length) q = q.in("id", leadIds);
  else q = q.is("contact_name", null).order("registered_at", { ascending: false, nullsFirst: false }).limit(limit);

  const { data: leads, error: leadErr } = await q;
  if (leadErr) return json({ error: leadErr.message }, 500);

  const targets = (leads || []).filter((l) => !!l.orgnr);
  const startedAt = Date.now();
  let processed = 0;
  let found = 0;

  const updates = await mapLimit(targets, 5, async (lead) => {
    if (Date.now() - startedAt > TIME_BUDGET_MS) return null;
    processed++;
    const info = await fetchRoles(lead.orgnr as string);
    if (!info) return null;
    if (info.contact) found++;
    return {
      id: lead.id as string,
      patch: {
        contact_name: info.contact ?? (lead.contact_name as string | null),
        accountant_name: info.accountant,
        has_accountant: !!info.accountant,
        has_auditor: info.hasAuditor,
        roles: info.roles,
        synced_at: new Date().toISOString(),
      },
    };
  });

  for (const u of updates) {
    if (!u) continue;
    await admin.from("crm_leads").update(u.patch).eq("id", u.id);
  }

  return json({ success: true, processed, found });
});
