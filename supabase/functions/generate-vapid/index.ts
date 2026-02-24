// Temporary function to generate VAPID keys in JWK format
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Generate ECDSA P-256 key pair
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  // Export as JWK
  const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  // Export raw public key for client-side applicationServerKey
  const rawPublic = await crypto.subtle.exportKey("raw", keyPair.publicKey);
  const rawPublicB64 = btoa(String.fromCharCode(...new Uint8Array(rawPublic)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return new Response(
    JSON.stringify({
      publicKey_b64url: rawPublicB64,
      privateJwk: JSON.stringify(privateJwk),
      publicJwk: JSON.stringify(publicJwk),
      instruction: "Set VAPID_PRIVATE_JWK secret to the privateJwk value, and update VAPID_PUBLIC_KEY to publicKey_b64url",
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
