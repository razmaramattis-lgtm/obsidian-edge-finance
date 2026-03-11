import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const sb = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsErr } = await sb.auth.getClaims(token);
  if (claimsErr || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Verify admin
  const adminSb = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: profile } = await adminSb.from("profiles").select("role").eq("user_id", claimsData.claims.sub).single();
  if (profile?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    // Process queued emails (batch of 10)
    const { data: emails } = await adminSb
      .from("email_messages")
      .select("*")
      .eq("status", "queued")
      .order("created_at", { ascending: true })
      .limit(10);

    if (!emails || emails.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const smtpUser = Deno.env.get("SMTP_USER") || "kontakt@avargo.no";
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpPass) {
      return new Response(JSON.stringify({ error: "SMTP not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      // Mark as sending
      await adminSb.from("email_messages").update({ status: "sending" }).eq("id", email.id);

      try {
        // Build raw MIME message
        const boundary = "----=_Part_" + crypto.randomUUID().replace(/-/g, "");
        const mimeMessage = [
          `From: Avargo <${smtpUser}>`,
          `To: ${email.recipient_name ? `${email.recipient_name} <${email.recipient_email}>` : email.recipient_email}`,
          `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(email.subject)))}?=`,
          `MIME-Version: 1.0`,
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          ``,
          `--${boundary}`,
          `Content-Type: text/plain; charset=UTF-8`,
          `Content-Transfer-Encoding: quoted-printable`,
          ``,
          email.body.replace(/<[^>]*>/g, ""),
          ``,
          `--${boundary}`,
          `Content-Type: text/html; charset=UTF-8`,
          `Content-Transfer-Encoding: quoted-printable`,
          ``,
          wrapInTemplate(email.body, email.subject),
          ``,
          `--${boundary}--`,
        ].join("\r\n");

        // Connect to SMTP
        const conn = await Deno.connectTls({ hostname: "smtp.domeneshop.no", port: 465 });
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const read = async () => {
          const buf = new Uint8Array(4096);
          const n = await conn.read(buf);
          return n ? decoder.decode(buf.subarray(0, n)) : "";
        };

        const write = async (cmd: string) => {
          await conn.write(encoder.encode(cmd + "\r\n"));
          return await read();
        };

        await read(); // greeting
        await write("EHLO avargo.no");
        await write(`AUTH LOGIN`);
        await write(btoa(smtpUser));
        await write(btoa(smtpPass));
        await write(`MAIL FROM:<${smtpUser}>`);
        await write(`RCPT TO:<${email.recipient_email}>`);
        await write("DATA");
        await conn.write(encoder.encode(mimeMessage + "\r\n.\r\n"));
        await read();
        await write("QUIT");

        try { conn.close(); } catch {}

        await adminSb.from("email_messages").update({
          status: "sent",
          sent_at: new Date().toISOString(),
        }).eq("id", email.id);

        // Update campaign counts
        if (email.campaign_id) {
          const { data: camp } = await adminSb.from("email_campaigns").select("sent_count").eq("id", email.campaign_id).single();
          if (camp) {
            await adminSb.from("email_campaigns").update({ sent_count: camp.sent_count + 1 }).eq("id", email.campaign_id);
          }
        }

        sent++;
      } catch (err) {
        const maxRetries = 3;
        if (email.retry_count < maxRetries) {
          await adminSb.from("email_messages").update({
            status: "queued",
            retry_count: email.retry_count + 1,
            error_message: String(err),
          }).eq("id", email.id);
        } else {
          await adminSb.from("email_messages").update({
            status: "failed",
            error_message: String(err),
          }).eq("id", email.id);

          if (email.campaign_id) {
            const { data: camp } = await adminSb.from("email_campaigns").select("failed_count").eq("id", email.campaign_id).single();
            if (camp) {
              await adminSb.from("email_campaigns").update({ failed_count: camp.failed_count + 1 }).eq("id", email.campaign_id);
            }
          }
        }
        failed++;
      }

      // Delay between emails
      await new Promise(r => setTimeout(r, 1500));
    }

    return new Response(JSON.stringify({ processed: emails.length, sent, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

function wrapInTemplate(body: string, subject: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
<tr><td style="padding:32px 40px 24px;border-bottom:1px solid #e4e4e7">
<span style="font-size:20px;font-weight:700;color:#18181b">Avargo</span>
</td></tr>
<tr><td style="padding:32px 40px">
<h1 style="margin:0 0 16px;font-size:18px;color:#18181b">${subject}</h1>
<div style="font-size:14px;line-height:1.7;color:#3f3f46">${body}</div>
</td></tr>
<tr><td style="padding:24px 40px;background:#fafafa;border-top:1px solid #e4e4e7">
<p style="margin:0;font-size:11px;color:#a1a1aa;text-align:center">Avargo · Oscars gate 2B, 3714 Skien · kontakt@avargo.no</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
