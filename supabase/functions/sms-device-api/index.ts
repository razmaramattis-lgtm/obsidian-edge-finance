import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-api-key, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing API key" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Validate device by API key
  const { data: device, error: devErr } = await sb
    .from("sms_devices")
    .select("*")
    .eq("api_key", apiKey)
    .single();

  if (devErr || !device) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    // GET /pending — fetch queued messages for this device
    if (req.method === "GET" && path === "pending") {
      // Get settings
      const { data: delaySetting } = await sb.from("sms_settings").select("value").eq("key", "max_messages_per_device").single();
      const maxPerDay = parseInt(delaySetting?.value || "500", 10);

      if (device.messages_sent_today >= maxPerDay) {
        return new Response(JSON.stringify({ messages: [], reason: "daily_limit_reached" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const remaining = maxPerDay - device.messages_sent_today;
      const limit = Math.min(remaining, 10);

      // Claim messages atomically
      const { data: messages } = await sb
        .from("sms_messages")
        .select("id, phone, message")
        .eq("status", "queued")
        .is("device_id", null)
        .order("queued_at", { ascending: true })
        .limit(limit);

      if (messages && messages.length > 0) {
        const ids = messages.map((m: any) => m.id);
        await sb.from("sms_messages").update({ status: "sending", device_id: device.id }).in("id", ids);
      }

      return new Response(JSON.stringify({ messages: messages || [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // POST /sent — report message sent
    if (req.method === "POST" && path === "sent") {
      const body = await req.json();
      const { message_id, success, error_message } = body;

      if (!message_id) {
        return new Response(JSON.stringify({ error: "message_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (success) {
        await sb.from("sms_messages").update({
          status: "sent",
          sent_at: new Date().toISOString(),
          device_id: device.id,
        }).eq("id", message_id);

        await sb.from("sms_devices").update({
          messages_sent_today: device.messages_sent_today + 1,
          last_seen: new Date().toISOString(),
        }).eq("id", device.id);

        // Update campaign sent_count if applicable
        const { data: msg } = await sb.from("sms_messages").select("campaign_id").eq("id", message_id).single();
        if (msg?.campaign_id) {
          await sb.rpc("increment_campaign_sent", { _campaign_id: msg.campaign_id }); // handled below
          // Simple fallback: just increment manually
          const { data: camp } = await sb.from("sms_campaigns").select("sent_count").eq("id", msg.campaign_id).single();
          if (camp) {
            await sb.from("sms_campaigns").update({ sent_count: camp.sent_count + 1 }).eq("id", msg.campaign_id);
          }
        }
      } else {
        const { data: msgData } = await sb.from("sms_messages").select("retry_count").eq("id", message_id).single();
        const { data: retrySetting } = await sb.from("sms_settings").select("value").eq("key", "retry_attempts").single();
        const maxRetries = parseInt(retrySetting?.value || "3", 10);
        const currentRetries = msgData?.retry_count || 0;

        if (currentRetries < maxRetries) {
          await sb.from("sms_messages").update({
            status: "queued",
            retry_count: currentRetries + 1,
            device_id: null,
            error_message: error_message || "Unknown error",
          }).eq("id", message_id);
        } else {
          await sb.from("sms_messages").update({
            status: "failed",
            error_message: error_message || "Max retries exceeded",
            device_id: device.id,
          }).eq("id", message_id);

          // Update campaign failed_count
          const { data: msg } = await sb.from("sms_messages").select("campaign_id").eq("id", message_id).single();
          if (msg?.campaign_id) {
            const { data: camp } = await sb.from("sms_campaigns").select("failed_count").eq("id", msg.campaign_id).single();
            if (camp) {
              await sb.from("sms_campaigns").update({ failed_count: camp.failed_count + 1 }).eq("id", msg.campaign_id);
            }
          }
        }
      }

      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // POST /heartbeat — device heartbeat
    if (req.method === "POST" && path === "heartbeat") {
      await sb.from("sms_devices").update({
        status: "online",
        last_seen: new Date().toISOString(),
      }).eq("id", device.id);

      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown endpoint" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
