import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SVG_TEMPLATE = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="20%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#0a0a12"/>
    </radialGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4a854" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#d4a854" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4a854" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#d4a854" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <!-- Bokeh circles -->
  <circle cx="180" cy="120" r="60" fill="url(#glow1)"/>
  <circle cx="950" cy="100" r="45" fill="url(#glow2)"/>
  <circle cx="1050" cy="400" r="70" fill="url(#glow1)"/>
  <circle cx="100" cy="450" r="35" fill="url(#glow2)"/>
  <circle cx="700" cy="80" r="25" fill="url(#glow2)"/>
  <circle cx="350" cy="500" r="40" fill="url(#glow1)"/>
  <!-- Title -->
  <text x="600" y="280" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="96" font-weight="400" fill="#d4a854" letter-spacing="4">Avargo</text>
  <!-- Subtitle with correct Norwegian characters -->
  <text x="600" y="350" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="300" fill="#c4985a" letter-spacing="3" opacity="0.85">Regnskapsfører og Rådgiver</text>
  <!-- Subtle line -->
  <rect x="520" y="380" width="160" height="1" fill="#d4a854" opacity="0.2" rx="1"/>
</svg>`;

Deno.serve(async () => {
  const headers = {
    "Content-Type": "image/svg+xml",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Access-Control-Allow-Origin": "*",
  };

  return new Response(SVG_TEMPLATE, { status: 200, headers });
});
