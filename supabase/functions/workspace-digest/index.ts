import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function sendEmail(opts: { from: string; to: string; subject: string; html: string }) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey || !resendKey) throw new Error("Email provider not configured");
  const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "X-Connection-Api-Key": resendKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Avargo Regnskap AS <${opts.from}>`, to: [opts.to], reply_to: "kontakt@avargo.no",
      subject: opts.subject, html: opts.html,
    }),
  });
  if (!res.ok) throw new Error(`Resend failed [${res.status}]: ${await res.text()}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: unreadNotifs } = await supabase
      .from("workspace_notifications")
      .select("recipient_id, type, title, body, actor_id, created_at")
      .eq("read", false)
      .gte("created_at", since);

    if (!unreadNotifs || unreadNotifs.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const byRecipient = new Map<string, typeof unreadNotifs>();
    for (const n of unreadNotifs) {
      if (!byRecipient.has(n.recipient_id)) byRecipient.set(n.recipient_id, []);
      byRecipient.get(n.recipient_id)!.push(n);
    }

    const recipientIds = [...byRecipient.keys()];
    const { data: profiles } = await supabase.from("profiles").select("id, email, name").in("id", recipientIds);
    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

    const emailPromises: Promise<void>[] = [];
    let sent = 0;

    for (const [recipientId, notifs] of byRecipient) {
      const p = profileMap.get(recipientId);
      if (!p?.email) continue;

      const feedCount = notifs.filter(n => ["feed_post", "feed_comment", "feed_reaction"].includes(n.type)).length;
      const dmCount = notifs.filter(n => n.type === "dm_message").length;
      const groupCount = notifs.filter(n => n.type === "group_message").length;
      const friendCount = notifs.filter(n => n.type === "friend_request").length;

      const items = [];
      if (feedCount > 0) items.push(`📰 ${feedCount} nye aktiviteter i feeden`);
      if (dmCount > 0) items.push(`💬 ${dmCount} uleste direktemeldinger`);
      if (groupCount > 0) items.push(`👥 ${groupCount} nye gruppemeldinger`);
      if (friendCount > 0) items.push(`🤝 ${friendCount} venneforespørsler`);

      const html = `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">🔔 Daglig oppsummering — Workspace</h1>
          <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Hei ${p.name}, her er hva du har gått glipp av</p>
        </div>
        <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
          ${items.map(i => `<div style="padding:12px 16px;background:#f8fafc;border-radius:8px;margin-bottom:8px;font-size:14px;">${i}</div>`).join("")}
          <div style="margin-top:20px;text-align:center;">
            <a href="https://avargo.no/workspace" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">Åpne Workspace</a>
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
            <img src="https://avargo.no/logo.png" alt="Avargo Regnskap AS" width="120" style="display:inline-block;border:0;margin-bottom:10px;" /><p style="font-size:12px;color:#94a3b8;margin:0;line-height:1.6;">Avargo Regnskap AS · tlf. 98 64 23 91 · <a href="mailto:kontakt@avargo.no" style="color:#94a3b8;">kontakt@avargo.no</a></p>
          </div>
        </div>
      </div>`;

      emailPromises.push(
        sendEmail({
                    from: "kontakt@avargo.no", to: p.email,
          subject: `🔔 Daglig oppsummering — Avargo Workspace`, html,
        }).then(() => { sent++; }).catch(e => console.error("Email failed for", p.email, e))
      );
    }

    await Promise.allSettled(emailPromises);
    return new Response(JSON.stringify({ sent }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
