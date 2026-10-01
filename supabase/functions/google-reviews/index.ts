const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_business_profile";
const REVIEWS_PATH = "/my_business/v4/accounts/113133551902719815664/locations/2410930484907563980/reviews";
const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const TTL_MS = 30 * 60 * 1000;

let cache: { at: number; payload: unknown } | null = null;

function clean(comment = "") {
  // Keep the original-language text, drop Google's auto-translation
  const orig = comment.indexOf("(Original)");
  if (orig >= 0) return comment.slice(orig + "(Original)".length).replace(/\(Translated by Google\)[\s\S]*$/, "").trim();
  const idx = comment.indexOf("(Translated by Google)");
  return (idx >= 0 ? comment.slice(0, idx) : comment).trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    if (cache && Date.now() - cache.at < TTL_MS) {
      return new Response(JSON.stringify(cache.payload), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GBP_KEY = Deno.env.get("GOOGLE_BUSINESS_PROFILE_API_KEY");
    if (!LOVABLE_API_KEY || !GBP_KEY) throw new Error("Missing connector credentials");

    const all: any[] = [];
    let pageToken = "";
    let averageRating = 0;
    let totalReviewCount = 0;
    for (let i = 0; i < 10; i++) {
      const url = `${GATEWAY_URL}${REVIEWS_PATH}?pageSize=50${pageToken ? `&pageToken=${pageToken}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": GBP_KEY },
      });
      if (!res.ok) {
        const body = await res.text();
        console.error(`Gateway failed [${res.status}]: ${body}`);
        return new Response(JSON.stringify({ error: "Provider request failed", status: res.status, details: body }), {
          status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const data = await res.json();
      averageRating = data.averageRating ?? averageRating;
      totalReviewCount = data.totalReviewCount ?? totalReviewCount;
      all.push(...(data.reviews ?? []));
      if (!data.nextPageToken) break;
      pageToken = encodeURIComponent(data.nextPageToken);
    }

    const reviews = all
      .map((r) => ({
        id: r.reviewId,
        name: r.reviewer?.displayName ?? "Google-bruker",
        photo: r.reviewer?.profilePhotoUrl ?? null,
        rating: STARS[r.starRating] ?? 0,
        text: clean(r.comment),
        date: r.createTime,
      }))
      .filter((r) => r.rating >= 4 && r.text.length > 0);

    const payload = { averageRating, totalReviewCount, reviews };
    cache = { at: Date.now(), payload };
    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
