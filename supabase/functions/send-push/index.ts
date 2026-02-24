import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildPushPayload,
  type PushSubscription,
  type PushMessage,
  type VapidKeys,
} from "npm:@block65/webcrypto-web-push@1.0.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Maps notification type to a navigation URL */
function typeToUrl(type: string, refId?: string | null): string {
  switch (type) {
    case "dm_message":
      return "/workspace?view=dms";
    case "feed_post":
    case "feed_comment":
    case "feed_reaction":
      return "/workspace?view=feed";
    case "group_message":
      return "/workspace?view=groups";
    case "friend_request":
      return "/workspace?view=friends";
    case "chat_message":
      return "/workspace?view=feed";
    case "admin_contact":
      return "/admin/dashboard?panel=contact_submissions";
    case "admin_booking":
      return "/admin/dashboard?panel=bookings";
    case "admin_advisor":
      return "/admin/dashboard?panel=advisor_requests";
    case "admin_partner":
      return "/admin/dashboard?panel=partner_requests";
    case "admin_invitation":
      return "/admin/dashboard?panel=employee_invitations";
    case "admin_benefit":
      return "/admin/dashboard?panel=benefit_applications";
    case "admin_feedback":
      return "/admin/dashboard?panel=org_resources&tab=account_feedback";
    default:
      return "/workspace";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notification_id, recipient_id, title, body, type, reference_id } =
      await req.json();

    if (!recipient_id) {
      return new Response(JSON.stringify({ error: "Missing recipient_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    // Normalize keys to proper base64url (no padding, URL-safe chars)
    const normalizeB64 = (s: string) =>
      s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "").trim();

    const vapidPublicKey = normalizeB64(Deno.env.get("VAPID_PUBLIC_KEY")!);
    const vapidPrivateKey = normalizeB64(Deno.env.get("VAPID_PRIVATE_KEY")!);

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all push subscriptions for this recipient
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("profile_id", recipient_id);

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      return new Response(JSON.stringify({ error: "DB error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: "No subscriptions" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const vapid: VapidKeys = {
      subject: "mailto:kontakt@avargo.no",
      publicKey: vapidPublicKey,
      privateKey: vapidPrivateKey,
    };

    const notificationData = {
      title: title || "Avargo",
      body: body || "",
      icon: "/logo.png",
      badge: "/favicon.png",
      tag: notification_id || crypto.randomUUID(),
      data: { type, reference_id, url: typeToUrl(type, reference_id) },
    };

    const pushMessage: PushMessage = {
      data: JSON.stringify(notificationData),
      options: { ttl: 86400 },
    };

    let sent = 0;
    const staleIds: string[] = [];

    for (const sub of subscriptions) {
      try {
        const subscription: PushSubscription = {
          endpoint: sub.endpoint,
          expirationTime: null,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        const payload = await buildPushPayload(pushMessage, subscription, vapid);

        const response = await fetch(payload.endpoint, {
          method: payload.method,
          headers: payload.headers,
          body: payload.body,
        });

        if (response.status === 201 || response.status === 200) {
          sent++;
        } else if (response.status === 410 || response.status === 404) {
          staleIds.push(sub.id);
        } else {
          const text = await response.text();
          console.error(`Push failed for ${sub.id}: ${response.status} ${text}`);
        }
      } catch (pushErr) {
        console.error(`Push error for ${sub.id}:`, pushErr);
      }
    }

    // Clean up stale subscriptions
    if (staleIds.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", staleIds);
    }

    return new Response(
      JSON.stringify({ sent, cleaned: staleIds.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-push error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
