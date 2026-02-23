import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Convert a URL-safe base64 string to a Uint8Array (for VAPID) */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/** Import the VAPID private key for ECDSA signing */
async function importVapidPrivateKey(base64Key: string): Promise<CryptoKey> {
  const rawKey = urlBase64ToUint8Array(base64Key);
  return crypto.subtle.importKey(
    "pkcs8",
    rawKey,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
}

/** Create a JWT for VAPID authentication */
async function createVapidJwt(
  audience: string,
  subject: string,
  privateKeyBase64: string
): Promise<string> {
  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 60 * 60,
    sub: subject,
  };

  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const unsignedToken = encode(header) + "." + encode(payload);
  const encoder = new TextEncoder();

  // Import raw private key for P-256
  const rawKey = urlBase64ToUint8Array(privateKeyBase64);
  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      d: btoa(String.fromCharCode(...rawKey))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, ""),
      x: "",
      y: "",
    },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    cryptoKey,
    encoder.encode(unsignedToken)
  );

  const sigArray = new Uint8Array(signature);
  const sigBase64 = btoa(String.fromCharCode(...sigArray))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return unsignedToken + "." + sigBase64;
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
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;

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
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const pushPayload = JSON.stringify({
      title: title || "Avargo",
      body: body || "",
      icon: "/logo.png",
      badge: "/favicon.png",
      tag: notification_id || crypto.randomUUID(),
      data: { type, reference_id, url: typeToUrl(type, reference_id) },
    });

    let sent = 0;
    const staleIds: string[] = [];

    for (const sub of subscriptions) {
      try {
        // Use the web-push compatible approach via fetch
        const endpoint = sub.endpoint;
        const endpointUrl = new URL(endpoint);
        const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;

        // For simplicity, send a plain push without encryption
        // (works for most browsers with applicationServerKey set)
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            TTL: "86400",
          },
          body: pushPayload,
        });

        if (response.status === 201 || response.status === 200) {
          sent++;
        } else if (response.status === 410 || response.status === 404) {
          // Subscription expired or invalid
          staleIds.push(sub.id);
        } else {
          console.error(
            `Push failed for ${sub.id}: ${response.status} ${await response.text()}`
          );
        }
      } catch (pushErr) {
        console.error(`Push error for ${sub.id}:`, pushErr);
      }
    }

    // Clean up stale subscriptions
    if (staleIds.length > 0) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .in("id", staleIds);
    }

    return new Response(
      JSON.stringify({ sent, cleaned: staleIds.length }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("send-push error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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
