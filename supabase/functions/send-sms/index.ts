import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// This function is a queue status reporter for the device-gateway SMS system.
// Messages are sent by Android phones running the /gateway page.
// No external SMS API is needed.

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Count queued messages
    const { count: queuedCount } = await sb
      .from("sms_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "queued");

    const { count: sendingCount } = await sb
      .from("sms_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "sending");

    // Check online devices
    const { data: devices } = await sb
      .from("sms_devices")
      .select("id, device_name, status, last_seen")
      .eq("status", "online");

    const onlineDevices = devices?.length || 0;

    return new Response(
      JSON.stringify({
        queued: queuedCount || 0,
        sending: sendingCount || 0,
        online_devices: onlineDevices,
        devices: devices || [],
        message: onlineDevices > 0
          ? `${queuedCount || 0} meldinger i kø, ${onlineDevices} enhet(er) online — sendes automatisk`
          : "Ingen gateway-enheter online. Åpne /gateway på en Android-telefon for å begynne sending.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
