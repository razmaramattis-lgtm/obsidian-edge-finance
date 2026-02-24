import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// --- Helpers for base64url ---
function b64urlEncode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

// --- VAPID JWT ---
async function createVapidJwt(
  privateJwk: JsonWebKey,
  audience: string,
  subject: string,
  expSeconds: number = 86400
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "jwk",
    privateJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud: audience, exp: now + expSeconds, sub: subject };

  const enc = new TextEncoder();
  const headerB64 = b64urlEncode(enc.encode(JSON.stringify(header)).buffer as ArrayBuffer);
  const payloadB64 = b64urlEncode(enc.encode(JSON.stringify(payload)).buffer as ArrayBuffer);
  const unsigned = `${headerB64}.${payloadB64}`;

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    enc.encode(unsigned)
  );

  // Convert DER signature to raw r||s (64 bytes)
  const sigBytes = new Uint8Array(signature);
  let r: Uint8Array, s: Uint8Array;
  if (sigBytes.length === 64) {
    r = sigBytes.slice(0, 32);
    s = sigBytes.slice(32);
  } else {
    // DER encoded
    r = sigBytes.slice(0, 32);
    s = sigBytes.slice(32, 64);
  }

  return `${unsigned}.${b64urlEncode(new Uint8Array([...r, ...s]).buffer as ArrayBuffer)}`;
}

// --- Web Push Encryption (aes128gcm) ---
async function encryptPayload(
  payload: string,
  p256dhKey: string,
  authSecret: string
): Promise<{ body: Uint8Array; salt: Uint8Array; localPublicKey: Uint8Array }> {
  // Generate local ECDH key pair
  const localKeys = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );

  const localPublicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", localKeys.publicKey));

  // Import subscriber's p256dh key
  const subscriberKey = await crypto.subtle.importKey(
    "raw",
    b64urlDecode(p256dhKey),
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // ECDH shared secret
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "ECDH", public: subscriberKey },
      localKeys.privateKey,
      256
    )
  );

  const auth = b64urlDecode(authSecret);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const enc = new TextEncoder();

  // IKM = HKDF(auth, sharedSecret, "WebPush: info\0" || subscriberPubKey || localPubKey)
  const ikmInfo = new Uint8Array([
    ...enc.encode("WebPush: info\0"),
    ...b64urlDecode(p256dhKey),
    ...localPublicRaw,
  ]);

  const ikmKey = await crypto.subtle.importKey("raw", auth, { name: "HKDF" }, false, [
    "deriveBits",
  ]);
  const ikm = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "HKDF", hash: "SHA-256", salt: sharedSecret, info: ikmInfo },
      ikmKey,
      256
    )
  );

  // PRK from HKDF-Extract(salt, IKM)
  const prkKey = await crypto.subtle.importKey("raw", ikm, { name: "HKDF" }, false, [
    "deriveBits",
  ]);

  // CEK = HKDF(salt, IKM, "Content-Encoding: aes128gcm\0", 16)
  const cekInfo = enc.encode("Content-Encoding: aes128gcm\0");
  const cek = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info: cekInfo },
    prkKey,
    128
  );

  // Nonce = HKDF(salt, IKM, "Content-Encoding: nonce\0", 12)
  const nonceInfo = enc.encode("Content-Encoding: nonce\0");
  const nonce = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "HKDF", hash: "SHA-256", salt, info: nonceInfo },
      prkKey,
      96
    )
  );

  // Encrypt with AES-128-GCM
  const aesKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, [
    "encrypt",
  ]);

  const payloadBytes = enc.encode(payload);
  // Add padding delimiter (0x02) then pad
  const paddedPayload = new Uint8Array([...payloadBytes, 2]);

  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, paddedPayload)
  );

  // Build aes128gcm payload: salt(16) || rs(4) || idlen(1) || keyid(65) || ciphertext
  const rs = 4096;
  const rsBytes = new Uint8Array(4);
  new DataView(rsBytes.buffer).setUint32(0, rs);

  const body = new Uint8Array([
    ...salt,
    ...rsBytes,
    localPublicRaw.length,
    ...localPublicRaw,
    ...ciphertext,
  ]);

  return { body, salt, localPublicKey: localPublicRaw };
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
    const vapidPrivateJwk: JsonWebKey = JSON.parse(Deno.env.get("VAPID_PRIVATE_JWK")!);
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

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

    const notificationData = {
      title: title || "Avargo",
      body: body || "",
      icon: "/logo.png",
      badge: "/favicon.png",
      tag: notification_id || crypto.randomUUID(),
      data: { type, reference_id, url: typeToUrl(type, reference_id) },
    };

    const payloadStr = JSON.stringify(notificationData);

    let sent = 0;
    const staleIds: string[] = [];

    for (const sub of subscriptions) {
      try {
        // Get audience from endpoint URL
        const endpointUrl = new URL(sub.endpoint);
        const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;

        // Create VAPID JWT
        const jwt = await createVapidJwt(vapidPrivateJwk, audience, "mailto:kontakt@avargo.no");

        // Encrypt payload
        const encrypted = await encryptPayload(payloadStr, sub.p256dh, sub.auth);

        // Send push
        const response = await fetch(sub.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Encoding": "aes128gcm",
            TTL: "86400",
            Authorization: `vapid t=${jwt}, k=${vapidPublicKey}`,
          },
          body: encrypted.body,
        });

        if (response.status === 201 || response.status === 200) {
          sent++;
          console.log(`Push sent to ${sub.id}`);
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
