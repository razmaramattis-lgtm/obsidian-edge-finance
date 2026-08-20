// Finds missing contact info (e-mail) for CRM leads by crawling the company website
// and, when no website is registered, by looking the company up on the open web.
import { createClient } from "npm:@supabase/supabase-js@2";
import { isServiceRoleToken } from "../_shared/crm-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const UA = "Mozilla/5.0 (compatible; AvargoCRM/1.0; +https://avargo.no)";
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const BAD_EMAIL = /(sentry|wixpress|example\.|\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg|domain\.com|email\.com|yourdomain)/i;
const PATHS = ["", "/kontakt", "/kontakt-oss", "/contact", "/om-oss", "/about"];

function normalizeUrl(raw: string) {
  const u = raw.trim().replace(/\s+/g, "");
  if (!u) return null;
  return u.startsWith("http") ? u : `https://${u}`;
}

async function grab(url: string, ms = 8000): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" }, signal: ctrl.signal, redirect: "follow" });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("text/plain")) return null;
    return (await res.text()).slice(0, 400_000);
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function pickEmails(html: string, domain?: string | null): string[] {
  const decoded = html.replace(/&#64;|\(at\)|\[at\]|\s+at\s+/gi, "@").replace(/&amp;/g, "&");
  const found = new Set<string>();
  for (const m of decoded.match(EMAIL_RE) || []) {
    const e = m.toLowerCase().replace(/\.$/, "");
    if (BAD_EMAIL.test(e)) continue;
    if (e.length > 90) continue;
    found.add(e);
  }
  const list = Array.from(found);
  const score = (e: string) => {
    let s = 0;
    if (domain && e.endsWith(`@${domain}`)) s += 10;
    if (/^(post|kontakt|hei|info|firmapost|mail)@/.test(e)) s += 5;
    if (/^(noreply|no-reply|support|webmaster|abuse|privacy)@/.test(e)) s -= 5;
    return s;
  };
  return list.sort((a, b) => score(b) - score(a));
}

async function findWebsiteViaSearch(name: string, orgnr: string): Promise<string | null> {
  const html = await grab(`https://duckduckgo.com/html/?q=${encodeURIComponent(`${name} ${orgnr} kontakt e-post`)}`);
  if (!html) return null;
  const m = html.match(/uddg=([^"&]+)/);
  if (!m) return null;
  try {
    const url = decodeURIComponent(m[1]);
    if (/duckduckgo|brreg|proff\.no|purehelp|1881|gulesider|facebook|linkedin/i.test(url)) return null;
    return url;
  } catch {
    return null;
  }
}

async function enrichOne(lead: { id: string; name: string; orgnr: string; website: string | null }) {
  let website = lead.website ? normalizeUrl(lead.website) : null;
  let discovered = false;
  if (!website) {
    website = await findWebsiteViaSearch(lead.name, lead.orgnr);
    discovered = !!website;
  }
  if (!website) return { email: null, website: null, status: "ingen_nettside", discovered };

  let host = "";
  try { host = new URL(website).hostname.replace(/^www\./, ""); } catch { return { email: null, website: null, status: "ugyldig_nettside", discovered }; }

  const base = website.replace(/\/+$/, "");
  for (const p of PATHS) {
    const html = await grab(base + p);
    if (!html) continue;
    const emails = pickEmails(html, host);
    if (emails.length) return { email: emails[0], website: base, status: "funnet", discovered };
  }
  return { email: null, website: base, status: "ikke_funnet", discovered };
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
  if (!isServiceRoleToken(token, serviceKey)) {
    if (!token) return json({ error: "Unauthorized" }, 401);
    const anon = createClient(url, anonKey);
    const { data: userData, error } = await anon.auth.getUser(token);
    if (error || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const { data: isStaff } = await admin.rpc("is_employee_or_admin", { uid: userData.user.id });
    if (!isStaff) return json({ error: "Forbidden" }, 403);
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* ignore */ }

  const limit = Math.min(Number(body.limit) || 25, 60);
  const leadIds = (body.leadIds as string[]) || [];

  let q = admin.from("crm_leads").select("id, name, orgnr, website").is("email", null).limit(limit);
  if (leadIds.length) q = admin.from("crm_leads").select("id, name, orgnr, website").in("id", leadIds).limit(limit);
  else q = q.is("enriched_at", null);

  const { data: leads, error } = await q;
  if (error) return json({ error: error.message }, 500);
  if (!leads?.length) return json({ processed: 0, found: 0, message: "Ingen leads å berike" });

  let found = 0;
  await mapLimit(leads, 4, async (l: any) => {
    const r = await enrichOne(l);
    if (r.email) found++;
    await admin.from("crm_leads").update({
      ...(r.email ? { email: r.email, email_source: "web", email_verified: false } : {}),
      ...(r.discovered && r.website ? { website: r.website } : {}),
      enriched_at: new Date().toISOString(),
      enrich_status: r.status,
    }).eq("id", l.id);
  });

  return json({ processed: leads.length, found });
});
