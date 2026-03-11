import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// All important Avargo pages to scan
const AVARGO_PAGES = [
  "https://avargo.no/",
  "https://avargo.no/tjenester",
  "https://avargo.no/bransjer",
  "https://avargo.no/priser",
  "https://avargo.no/metoden",
  "https://avargo.no/om-oss",
  "https://avargo.no/kontakt",
  "https://avargo.no/faq",
  "https://avargo.no/nyheter",
  "https://avargo.no/ressurser",
  "https://avargo.no/tjenester/regnskapsforer",
  "https://avargo.no/tjenester/ai-innsikt",
  "https://avargo.no/tjenester/cfo",
  "https://avargo.no/tjenester/hr-og-lonn",
  "https://avargo.no/tjenester/nettsider",
  "https://avargo.no/tjenester/seo",
  "https://avargo.no/tjenester/meta-annonser",
  "https://avargo.no/tjenester/google-ads",
  "https://avargo.no/tjenester/nettbutikk",
  "https://avargo.no/tjenester/ai-automatisering",
  "https://avargo.no/tjenester/1-1-regnskap",
  "https://avargo.no/tjenester/lonn",
  "https://avargo.no/tjenester/arsregnskap",
  "https://avargo.no/tjenester/fakturering",
  "https://avargo.no/tjenester/skatteplanlegging",
  "https://avargo.no/tjenester/ansettelse",
  "https://avargo.no/tjenester/personalhandbok",
  "https://avargo.no/tjenester/arbeidsrett",
  "https://avargo.no/tjenester/chatbot",
  "https://avargo.no/tjenester/internsystemer",
  "https://avargo.no/tjenester/dashboard",
  "https://avargo.no/bransjer/tech-saas",
  "https://avargo.no/bransjer/eiendom",
  "https://avargo.no/bransjer/holding",
  "https://avargo.no/bransjer/consulting",
  "https://avargo.no/bransjer/restaurant",
  "https://avargo.no/bransjer/bygg-anlegg",
  "https://avargo.no/bransjer/nettbutikk",
  "https://avargo.no/bransjer/helse",
  "https://avargo.no/bransjer/transport-logistikk",
  "https://avargo.no/bransjer/handverkere",
  "https://avargo.no/karriere",
];

async function fetchPageContent(url: string): Promise<{ title: string; content: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Avargo-MarketingAI/2.0" },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
    const title = titleMatch ? titleMatch[1].trim() : url;

    const content = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);

    if (content.length < 50) return null;
    return { title, content };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const urls: string[] = body.urls || AVARGO_PAGES;
    const results: any[] = [];
    let scanned = 0;
    let failed = 0;

    // Scan pages in batches of 5
    for (let i = 0; i < urls.length; i += 5) {
      const batch = urls.slice(i, i + 5);
      const pageResults = await Promise.all(batch.map(fetchPageContent));

      for (let j = 0; j < batch.length; j++) {
        const page = pageResults[j];
        if (!page) { failed++; continue; }

        let analysis = {
          title: page.title,
          content_summary: page.content.slice(0, 300),
          keywords: [] as string[],
          themes: [] as string[],
          tone: "Profesjonell",
        };

        // AI Analysis
        if (LOVABLE_API_KEY) {
          try {
            const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash-lite",
                messages: [
                  {
                    role: "system",
                    content: `Du er en markedsføringsanalytiker for Avargo, et norsk regnskapsbyrå. Analyser og returner JSON:
{
  "title": "sidetittel",
  "content_summary": "sammendrag maks 150 ord, fokuser på unike salgsargumenter",
  "keywords": ["nøkkelord1", ...],
  "themes": ["tema1", ...],
  "tone": "tonefallbeskrivelse",
  "unique_selling_points": ["usp1", ...],
  "target_audience": "hvem er målgruppen",
  "emotional_hooks": ["emosjonell krok1", ...]
}
Returner KUN gyldig JSON.`,
                  },
                  { role: "user", content: `Analyser: ${batch[j]}\n\n${page.content}` },
                ],
                temperature: 0.2,
                max_tokens: 800,
              }),
            });

            if (aiRes.ok) {
              const aiData = await aiRes.json();
              const raw = aiData.choices?.[0]?.message?.content || "";
              const jsonMatch = raw.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                analysis = {
                  title: parsed.title || page.title,
                  content_summary: parsed.content_summary || analysis.content_summary,
                  keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
                  themes: Array.isArray(parsed.themes) ? parsed.themes : [],
                  tone: parsed.tone || "Profesjonell",
                };
              }
            }
          } catch (aiErr) {
            console.error("AI error for", batch[j], aiErr);
          }
        }

        // Upsert into DB
        const { error } = await supabase
          .from("marketing_content_analyses")
          .upsert({
            url: batch[j],
            title: analysis.title,
            content_summary: analysis.content_summary,
            keywords: analysis.keywords,
            themes: analysis.themes,
            tone: analysis.tone,
            raw_content: page.content.slice(0, 5000),
            crawled_at: new Date().toISOString(),
          }, { onConflict: "url" });

        if (!error) {
          scanned++;
          results.push({ url: batch[j], title: analysis.title, keywords: analysis.keywords });
        } else {
          // If upsert fails (no unique constraint), try insert
          const { error: insertError } = await supabase
            .from("marketing_content_analyses")
            .insert({
              url: batch[j],
              title: analysis.title,
              content_summary: analysis.content_summary,
              keywords: analysis.keywords,
              themes: analysis.themes,
              tone: analysis.tone,
              raw_content: page.content.slice(0, 5000),
            });
          if (!insertError) scanned++;
          else failed++;
        }
      }

      // Small delay between batches to avoid rate limiting
      if (i + 5 < urls.length) await new Promise(r => setTimeout(r, 500));
    }

    return new Response(
      JSON.stringify({ success: true, scanned, failed, total: urls.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Site scan error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
