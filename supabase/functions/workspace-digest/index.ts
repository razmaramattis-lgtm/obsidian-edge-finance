import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    if (!smtpUser || !smtpPass) throw new Error("SMTP not configured");

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Get all profiles with unread notifications from last 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: unreadNotifs } = await supabase
      .from("workspace_notifications")
      .select("recipient_id, type, title, body, actor_id, created_at")
      .eq("read", false)
      .gte("created_at", since);

    if (!unreadNotifs || unreadNotifs.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Group by recipient
    const byRecipient = new Map<string, typeof unreadNotifs>();
    for (const n of unreadNotifs) {
      if (!byRecipient.has(n.recipient_id)) byRecipient.set(n.recipient_id, []);
      byRecipient.get(n.recipient_id)!.push(n);
    }

    // Get recipient emails
    const recipientIds = [...byRecipient.keys()];
    const { data: profiles } = await supabase.from("profiles").select("id, email, name").in("id", recipientIds);
    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

    let sent = 0;
    for (const [recipientId, notifs] of byRecipient) {
      const p = profileMap.get(recipientId);
      if (!p?.email) continue;

      const feedCount = notifs.filter(n => ["feed_post", "feed_comment", "feed_reaction"].includes(n.type)).length;
      const dmCount = notifs.filter(n => n.type === "dm_message").length;
      const groupCount = notifs.filter(n => n.type === "group_message").length;

      const items = [];
      if (feedCount > 0) items.push(`📰 ${feedCount} nye aktiviteter i feeden`);
      if (dmCount > 0) items.push(`💬 ${dmCount} uleste direktemeldinger`);
      if (groupCount > 0) items.push(`👥 ${groupCount} nye gruppemeldinger`);

      const html = `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">🔔 Daglig oppsummering — Workspace</h1>
          <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Hei ${p.name}, her er hva du har gått glipp av</p>
        </div>
        <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
          ${items.map(i => `<div style="padding:12px 16px;background:#f8fafc;border-radius:8px;margin-bottom:8px;font-size:14px;">${i}</div>`).join("")}
          <div style="margin-top:20px;text-align:center;">
            <a href="https://obsidian-edge-finance.lovable.app/workspace" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">Åpne Workspace</a>
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="font-size:12px;color:#94a3b8;margin:0;">Sendt fra <strong>Avargo</strong></p>
          </div>
        </div>
      </div>`;

      try {
        const conn = await Deno.connectTls({ hostname: "smtp.domeneshop.no", port: 465 });
        const enc = new TextEncoder();
        const dec = new TextDecoder();
        const read = async () => { const b = new Uint8Array(4096); const n = await conn.read(b); return n ? dec.decode(b.subarray(0, n)) : ""; };
        const cmd = async (s: string) => { await conn.write(enc.encode(s + "\r\n")); return await read(); };
        await read();
        await cmd("EHLO localhost");
        await cmd("AUTH LOGIN");
        await cmd(btoa(smtpUser));
        await cmd(btoa(smtpPass));
        await cmd(`MAIL FROM:<kontakt@avargo.no>`);
        await cmd(`RCPT TO:<${p.email}>`);
        await cmd("DATA");
        await cmd([
          `From: Avargo <kontakt@avargo.no>`,
          `To: ${p.email}`,
          `Subject: 🔔 Daglig oppsummering — Avargo Workspace`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          ``,
          html,
          `.`,
        ].join("\r\n"));
        await cmd("QUIT");
        try { conn.close(); } catch {}
        sent++;
      } catch (e) {
        console.error("Email failed for", p.email, e);
      }
    }

    return new Response(JSON.stringify({ sent }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
