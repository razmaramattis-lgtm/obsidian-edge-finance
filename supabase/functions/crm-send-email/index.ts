// Sends CRM emails to Brreg leads – manually from the admin panel or automatically (autopilot).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_NAME = "Avargo";
const SENDER_DOMAIN = "avargo.no";
const FROM_ADDRESS = `${SITE_NAME} <kontakt@avargo.no>`;
const REPLY_TO = "kontakt@avargo.no";
const SITE_URL = "https://avargo.no";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(tpl: string, lead: Record<string, any>) {
  const vars: Record<string, string> = {
    firma: esc(lead.name),
    navn: esc(lead.contact_name || lead.name),
    kontaktperson: esc(lead.contact_name || ""),
    orgnr: esc(lead.orgnr),
    kommune: esc(lead.municipality || ""),
    bransje: esc(lead.industry_text || ""),
    regnskapsforer: esc(lead.accountant_name || ""),
    registrert: esc(lead.registered_at || ""),
    poststed: esc(lead.postal_area || lead.municipality || ""),
    selskapsform: esc(lead.org_form_text || lead.org_form || "selskap"),
    ansatte: esc(lead.employees ?? ""),
  };
  return tpl.replace(/\{\{\s*([a-zA-ZæøåÆØÅ_]+)\s*\}\}/g, (m, key) => vars[key.toLowerCase()] ?? m);
}

function wrap(bodyHtml: string, reason: string, unsubscribeUrl: string, preheader = "") {
  return `<!DOCTYPE html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#232d2a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <img src="https://avargo.no/logo.png" alt="Avargo Regnskap AS" width="150" style="display:block;border:0;margin-bottom:24px;" />
    <div style="font-size:15px;line-height:1.7;">${bodyHtml}</div>
    <p style="font-size:15px;line-height:1.7;margin:28px 0 0;color:#232d2a;">Hilsen<br><strong>Avargo Regnskap AS</strong><br>tlf. 98 64 23 91<br><a href="mailto:kontakt@avargo.no" style="color:#1b5e4b;text-decoration:none;">kontakt@avargo.no</a></p>
    <p style="font-size:12px;color:#6b7a75;margin:14px 0 0;">Du kan svare direkte på denne e-posten – den går rett til kontakt@avargo.no.</p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #dff5ef;font-size:12px;line-height:1.6;color:#6b7a75;">
      <p style="margin:0 0 8px;"><strong>Hvorfor får du denne e-posten?</strong><br>${esc(reason)}</p>
      <p style="margin:0 0 8px;">Avargo Regnskap AS · Org.nr 938 076 669 · tlf. 98 64 23 91 · <a href="mailto:kontakt@avargo.no" style="color:#1b5e4b;">kontakt@avargo.no</a></p>
      <p style="margin:0;"><a href="${unsubscribeUrl}" style="color:#6b7a75;">Meld av videre henvendelser</a> · <a href="${SITE_URL}" style="color:#6b7a75;">avargo.no</a></p>
    </div>
  </div>
</body></html>`;
}

const DEFAULT_REASON =
  "Du får denne e-posten fordi selskapet ditt er registrert i Brønnøysundregistrene med offentlig tilgjengelig kontaktinformasjon, og vi tror regnskapstjenestene våre kan være relevante for dere.";

async function unsubscribeToken(admin: any, email: string) {
  const normalized = email.toLowerCase();
  const { data: existing } = await admin.from("email_unsubscribe_tokens").select("token").eq("email", normalized).maybeSingle();
  if (existing?.token) return existing.token as string;
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  await admin.from("email_unsubscribe_tokens").upsert({ token, email: normalized }, { onConflict: "email", ignoreDuplicates: true });
  const { data: stored } = await admin.from("email_unsubscribe_tokens").select("token").eq("email", normalized).maybeSingle();
  return (stored?.token as string) || token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(url, serviceKey);

  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const internal = !!token && token === serviceKey;
  let senderId: string | null = null;

  if (!internal) {
    if (!token) return json({ error: "Unauthorized" }, 401);
    const anon = createClient(url, anonKey);
    const { data: userData, error } = await anon.auth.getUser(token);
    if (error || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const { data: isStaff } = await admin.rpc("is_employee_or_admin", { uid: userData.user.id });
    if (!isStaff) return json({ error: "Forbidden" }, 403);
    const { data: pid } = await admin.rpc("current_profile_id", { uid: userData.user.id });
    senderId = (pid as string) || null;
  }

  let body: Record<string, any> = {};
  try {
    body = await req.json();
  } catch { /* autopilot cron sends empty body */ }

  const mode: "manual" | "autopilot" = body.mode === "manual" ? "manual" : "autopilot";

  const { data: settings } = await admin.from("crm_automation_settings").select("*").eq("id", 1).maybeSingle();

  // ---- Resolve leads ----
  let leads: any[] = [];
  let templateByCategory: Record<string, string> = {};

  if (mode === "manual") {
    const ids: string[] = Array.isArray(body.leadIds) ? body.leadIds.slice(0, 500) : [];
    if (!ids.length) return json({ error: "Ingen mottakere valgt" }, 400);
    if (!body.templateId) return json({ error: "Mangler mal" }, 400);
    const { data } = await admin.from("crm_leads").select("*").in("id", ids);
    leads = data || [];
  } else {
    if (!settings?.autopilot_enabled) return json({ skipped: true, reason: "autopilot_disabled" });
    templateByCategory = (settings.template_map as Record<string, string>) || {};
    const categories: string[] = settings.categories?.length ? settings.categories : ["ny_bedrift"];
    const query = admin
      .from("crm_leads")
      .select("*")
      .in("category", categories)
      .eq("unsubscribed", false)
      .eq("email_count", 0)
      .not("email", "is", null)
      .in("status", ["ny", "kontaktet"])
      .order("registered_at", { ascending: false })
      .limit(Math.max(1, Math.min(settings.daily_limit ?? 25, 200)));
    if (settings.municipality_numbers?.length) query.in("municipality_number", settings.municipality_numbers);
    const { data } = await query;
    leads = data || [];
  }

  // ---- Load templates ----
  const { data: templates } = await admin.from("crm_email_templates").select("*").eq("active", true);
  const tplById = new Map((templates || []).map((t: any) => [t.id, t]));
  const tplDefaultByCategory = new Map<string, any>();
  for (const t of templates || []) {
    if (t.is_default && !tplDefaultByCategory.has(t.category)) tplDefaultByCategory.set(t.category, t);
  }

  const results = { sent: 0, skipped: 0, failed: 0, details: [] as any[] };

  for (const lead of leads) {
    const recipient = (body.testEmail as string) || lead.email;
    if (!recipient) { results.skipped++; continue; }
    if (lead.unsubscribed) { results.skipped++; continue; }

    const { data: suppressed } = await admin
      .from("suppressed_emails")
      .select("email")
      .eq("email", recipient.toLowerCase())
      .maybeSingle();
    if (suppressed) {
      results.skipped++;
      await admin.from("crm_leads").update({ unsubscribed: true }).eq("id", lead.id);
      continue;
    }

    const tpl = mode === "manual"
      ? tplById.get(body.templateId)
      : tplById.get(templateByCategory[lead.category]) || tplDefaultByCategory.get(lead.category);

    if (!tpl) { results.skipped++; results.details.push({ lead: lead.orgnr, reason: "mangler mal" }); continue; }

    try {
      const messageId = crypto.randomUUID();
      const subject = render(tpl.subject, lead);
      const rendered = render(tpl.body_html, lead);
      const unsubToken = await unsubscribeToken(admin, recipient);
      const unsubUrl = `${SITE_URL}/unsubscribe?token=${unsubToken}`;
      const html = wrap(rendered, render(tpl.reason || DEFAULT_REASON, lead), unsubUrl, render(tpl.preheader || "", lead));
      const text = rendered.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

      const { error } = await admin.rpc("enqueue_email", {
        queue_name: "transactional_emails",
        payload: {
          message_id: messageId,
          to: recipient,
          from: FROM_ADDRESS,
          reply_to: REPLY_TO,
          sender_domain: SENDER_DOMAIN,
          subject,
          html,
          text,
          purpose: "transactional",
          label: "crm-outreach",
          idempotency_key: `crm-${lead.id}-${messageId}`,
          unsubscribe_token: unsubToken,
          queued_at: new Date().toISOString(),
        },
      });
      if (error) throw error;

      await admin.from("email_send_log").insert({
        message_id: messageId,
        template_name: `crm:${tpl.name}`,
        recipient_email: recipient,
        status: "pending",
      });

      await admin.from("crm_email_events").insert({
        lead_id: lead.id,
        template_id: tpl.id,
        recipient_email: recipient,
        subject,
        message_id: messageId,
        status: "queued",
        sent_by: senderId,
        automated: mode === "autopilot",
      });

      await admin.from("crm_leads").update({
        last_emailed_at: new Date().toISOString(),
        email_count: (lead.email_count || 0) + 1,
        status: lead.status === "ny" ? "kontaktet" : lead.status,
      }).eq("id", lead.id);

      results.sent++;
    } catch (e) {
      results.failed++;
      const message = e instanceof Error ? e.message : String(e);
      results.details.push({ lead: lead.orgnr, error: message });
      await admin.from("crm_email_events").insert({
        lead_id: lead.id,
        recipient_email: recipient,
        subject: tpl?.subject || "",
        status: "failed",
        error_message: message,
        sent_by: senderId,
        automated: mode === "autopilot",
      });
    }
  }

  if (mode === "autopilot") {
    await admin.from("crm_automation_settings").update({ last_autopilot_at: new Date().toISOString() }).eq("id", 1);
  }

  return json({ success: true, ...results });
});
