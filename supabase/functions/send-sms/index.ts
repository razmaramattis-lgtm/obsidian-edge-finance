import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const SMS_USER = Deno.env.get("SMS_API_USER");
    const SMS_PASS = Deno.env.get("SMS_API_PASS");
    const SMS_FROM = Deno.env.get("SMS_FROM") || "Avargo";

    if (!SMS_USER || !SMS_PASS) {
      return new Response(
        JSON.stringify({ error: "SMS API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get queued messages (limit 50 per invocation)
    const { data: messages, error: fetchErr } = await sb
      .from("sms_messages")
      .select("id, phone, message, campaign_id")
      .eq("status", "queued")
      .order("queued_at", { ascending: true })
      .limit(50);

    if (fetchErr) throw fetchErr;
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: "No queued messages" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as sending
    const ids = messages.map(m => m.id);
    await sb.from("sms_messages").update({ status: "sending" }).in("id", ids);

    // Send all in parallel (batches of 10)
    const BATCH = 10;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < messages.length; i += BATCH) {
      const batch = messages.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        batch.map(async (msg) => {
          const formData = new URLSearchParams();
          formData.append("from", SMS_FROM);
          formData.append("to", msg.phone);
          formData.append("message", msg.message);

          const res = await fetch("https://api.46elks.com/a1/sms", {
            method: "POST",
            headers: {
              "Authorization": "Basic " + btoa(`${SMS_USER}:${SMS_PASS}`),
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          const body = await res.text();

          if (res.ok) {
            await sb.from("sms_messages").update({
              status: "sent",
              sent_at: new Date().toISOString(),
              error_message: null,
            }).eq("id", msg.id);

            // Update campaign
            if (msg.campaign_id) {
              const { data: camp } = await sb.from("sms_campaigns").select("sent_count").eq("id", msg.campaign_id).single();
              if (camp) {
                await sb.from("sms_campaigns").update({ sent_count: camp.sent_count + 1 }).eq("id", msg.campaign_id);
              }
            }
            return { id: msg.id, success: true };
          } else {
            // Check retry
            const { data: msgData } = await sb.from("sms_messages").select("retry_count").eq("id", msg.id).single();
            const retries = msgData?.retry_count || 0;
            if (retries < 3) {
              await sb.from("sms_messages").update({
                status: "queued",
                retry_count: retries + 1,
                device_id: null,
                error_message: body,
              }).eq("id", msg.id);
            } else {
              await sb.from("sms_messages").update({
                status: "failed",
                error_message: body,
              }).eq("id", msg.id);
            }
            throw new Error(body);
          }
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled") sentCount++;
        else failedCount++;
      }
    }

    return new Response(
      JSON.stringify({ sent: sentCount, failed: failedCount, total: messages.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
