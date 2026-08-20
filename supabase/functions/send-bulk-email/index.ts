import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_NAME = "Avargo";
const SENDER_DOMAIN = "avargo.no";
const FROM_DOMAIN = "avargo.no";
const FROM_ADDRESS = `${SITE_NAME} <kontakt@${FROM_DOMAIN}>`;
const REPLY_TO = "kontakt@avargo.no";

// Utsendingstempo: 5-10 minutter mellom hver e-post ved masseutsending
const DEFAULT_MIN_DELAY_SECONDS = 300;
const DEFAULT_MAX_DELAY_SECONDS = 600;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const sb = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsErr } = await sb.auth.getClaims(token);
  if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

  const adminSb = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: profile } = await adminSb.from("profiles").select("role").eq("user_id", claimsData.claims.sub).single();
  if (!profile || !["admin", "employee"].includes(profile.role)) {
    return json({ error: "Forbidden" }, 403);
  }

  let reqBody: Record<string, any> = {};
  try { reqBody = await req.json(); } catch { /* no body */ }
  const asSeconds = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.round(v * 60) : null;
  const minOverride = asSeconds(reqBody.minDelayMinutes);
  const maxOverride = asSeconds(reqBody.maxDelayMinutes);

  const { data: sendState } = await adminSb
    .from("email_send_state")
    .select("bulk_min_delay_seconds, bulk_max_delay_seconds")
    .maybeSingle();
  const minDelay = Math.max(
    0,
    minOverride ?? maxOverride ?? sendState?.bulk_min_delay_seconds ?? DEFAULT_MIN_DELAY_SECONDS,
  );
  const maxDelay = Math.max(
    minDelay,
    maxOverride ?? (minOverride !== null ? minDelay : (sendState?.bulk_max_delay_seconds ?? DEFAULT_MAX_DELAY_SECONDS)),
  );
  const nextGap = () => minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1));

  // Første e-post går ut med én gang, deretter spres resten 5-10 min fra hverandre.
  let delaySeconds = 0;

  const batchId = crypto.randomUUID();
  const startedAt = Date.now();
  const MAX_MS = 50_000; // stay under edge function timeout
  let totalProcessed = 0;
  let totalQueued = 0;
  let totalFailed = 0;

  try {
    while (Date.now() - startedAt < MAX_MS) {
      const { data: emails } = await adminSb
        .from("email_messages")
        .select("*")
        .eq("status", "queued")
        .order("created_at", { ascending: true })
        .limit(200);

      if (!emails || emails.length === 0) break;

      const ids = emails.map((e: any) => e.id);
      await adminSb.from("email_messages").update({ status: "sending" }).in("id", ids);

      for (const email of emails) {
        try {
          const messageId = crypto.randomUUID();
          const subject = email.subject;
          const html = wrapInTemplate(email.body, subject);
          const text = email.body.replace(/<[^>]*>/g, "");

          // Get or create unsubscribe token for this recipient
          const normalizedEmail = email.recipient_email.toLowerCase();
          let unsubscribeToken: string;
          const { data: existingToken } = await adminSb
            .from("email_unsubscribe_tokens")
            .select("token")
            .eq("email", normalizedEmail)
            .maybeSingle();
          if (existingToken?.token) {
            unsubscribeToken = existingToken.token;
          } else {
            const bytes = new Uint8Array(32);
            crypto.getRandomValues(bytes);
            unsubscribeToken = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
            await adminSb
              .from("email_unsubscribe_tokens")
              .upsert({ token: unsubscribeToken, email: normalizedEmail }, { onConflict: "email", ignoreDuplicates: true });
            const { data: stored } = await adminSb
              .from("email_unsubscribe_tokens")
              .select("token")
              .eq("email", normalizedEmail)
              .maybeSingle();
            if (stored?.token) unsubscribeToken = stored.token;
          }

          const scheduledAt = new Date(Date.now() + delaySeconds * 1000).toISOString();
          const { error } = await adminSb.rpc("enqueue_email_delayed", {
            queue_name: "transactional_emails",
            delay_seconds: delaySeconds,
            payload: {
              message_id: messageId,
              to: email.recipient_email,
              from: FROM_ADDRESS,
              reply_to: REPLY_TO,
              sender_domain: SENDER_DOMAIN,
              subject,
              html,
              text,
              purpose: "transactional",
              label: "bulk-broadcast",
              idempotency_key: `bulk-${email.id}-${messageId}`,
              unsubscribe_token: unsubscribeToken,
              // TTL regnes fra planlagt sendetidspunkt
              queued_at: scheduledAt,
              scheduled_at: scheduledAt,
            },
          });

          if (error) throw error;
          delaySeconds += nextGap();

          await adminSb.from("email_send_log").insert({
            message_id: messageId,
            template_name: "bulk-broadcast",
            recipient_email: email.recipient_email,
            status: "pending",
            batch_id: batchId,
            batch_label: "Masseutsending",
            scheduled_at: scheduledAt,
          });

          await adminSb.from("email_messages").update({
            status: "sent",
            sent_at: new Date().toISOString(),
          }).eq("id", email.id);

          if (email.campaign_id) {
            const { data: camp } = await adminSb.from("email_campaigns").select("sent_count").eq("id", email.campaign_id).single();
            if (camp) await adminSb.from("email_campaigns").update({ sent_count: (camp.sent_count || 0) + 1 }).eq("id", email.campaign_id);
          }
          totalQueued++;
        } catch (err) {
          totalFailed++;
          await adminSb.from("email_messages").update({
            status: "failed",
            error_message: String(err),
          }).eq("id", email.id);
          if (email.campaign_id) {
            const { data: camp } = await adminSb.from("email_campaigns").select("failed_count").eq("id", email.campaign_id).single();
            if (camp) await adminSb.from("email_campaigns").update({ failed_count: (camp.failed_count || 0) + 1 }).eq("id", email.campaign_id);
          }
        }
        totalProcessed++;
      }
    }

    // Check if more remain so caller can invoke again
    const { count: remaining } = await adminSb
      .from("email_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "queued");

    return json({
      processed: totalProcessed,
      queued: totalQueued,
      failed: totalFailed,
      remaining: remaining ?? 0,
      pacing: { min_seconds: minDelay, max_seconds: maxDelay },
      spread_minutes: Math.round(delaySeconds / 60),
    });
  } catch (e) {
    return json({ error: String(e), processed: totalProcessed }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function wrapInTemplate(body: string, subject: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f1e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e8;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
<tr><td style="padding:28px 40px 20px;border-bottom:1px solid #e4e4e7">
<img src="https://avargo.no/logo.png" alt="Avargo Regnskap AS" width="150" style="display:block;border:0" />
</td></tr>
<tr><td style="padding:32px 40px">
<h1 style="margin:0 0 16px;font-size:18px;color:#232d2a">${escapeHtml(subject)}</h1>
<div style="font-size:14px;line-height:1.7;color:#3f3f46">${body}</div>
<p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#232d2a">Hilsen<br><strong>Avargo Regnskap AS</strong><br>tlf. 98 64 23 91<br><a href="mailto:kontakt@avargo.no" style="color:#1b5e4b;text-decoration:none">kontakt@avargo.no</a></p>
<p style="margin:14px 0 0;font-size:12px;color:#6b7a75">Du kan svare direkte på denne e-posten – den går rett til kontakt@avargo.no.</p>
</td></tr>
<tr><td style="padding:20px 40px;background:#f6f1e8;border-top:1px solid #e4e4e7">
<p style="margin:0;font-size:11px;color:#94a3b8;text-align:center">Avargo Regnskap AS · Org.nr 938 076 669 · tlf. 98 64 23 91 · kontakt@avargo.no</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
