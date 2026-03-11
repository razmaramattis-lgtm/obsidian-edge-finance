import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url) throw new Error("URL is required");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ─── Step 1: Fetch the page HTML ───
    let pageContent = "";
    let pageTitle = "";

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Avargo-ContentAnalyzer/1.0" },
      });
      const html = await res.text();

      // Extract title
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
      pageTitle = titleMatch ? titleMatch[1].trim() : url;

      // Extract text content (strip tags, scripts, styles)
      pageContent = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<nav[\s\S]*?<\/nav>/gi, "")
        .replace(/<footer[\s\S]*?<\/footer>/gi, "")
        .replace(/<header[\s\S]*?<\/header>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 8000);
    } catch (fetchErr) {
      console.error("Fetch error:", fetchErr);
      throw new Error(`Kunne ikke hente innholdet fra ${url}`);
    }

    if (!pageContent || pageContent.length < 50) {
      throw new Error("Ikke nok innhold funnet på siden.");
    }

    // ─── Step 2: AI Analysis ───
    let analysis = {
      title: pageTitle,
      content_summary: pageContent.slice(0, 300) + "...",
      keywords: [] as string[],
      themes: [] as string[],
      tone: "Profesjonell",
    };

    if (LOVABLE_API_KEY) {
      try {
        const aiRes = await fetch("https://ai-gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `Du er en innholdsanalytiker for markedsføring. Analyser innholdet og returner JSON med disse feltene:
{
  "title": "sidetittel",
  "content_summary": "kort sammendrag av hovedinnholdet (maks 200 ord)",
  "keywords": ["nøkkelord1", "nøkkelord2", ...],
  "themes": ["tema1", "tema2", ...],
  "tone": "beskrivelse av tonefall (f.eks. Profesjonell, Uformell, Autoritativ)"
}
Returner KUN gyldig JSON, ingen annen tekst.`,
              },
              {
                role: "user",
                content: `Analyser dette innholdet fra ${url}:\n\n${pageContent}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const raw = aiData.choices?.[0]?.message?.content || "";
          // Extract JSON from the response
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            analysis = {
              title: parsed.title || pageTitle,
              content_summary: parsed.content_summary || analysis.content_summary,
              keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
              themes: Array.isArray(parsed.themes) ? parsed.themes : [],
              tone: parsed.tone || "Profesjonell",
            };
          }
        }
      } catch (aiErr) {
        console.error("AI analysis error:", aiErr);
        // Fall back to basic analysis
      }
    }

    // ─── Step 3: Save to database ───
    const { data, error } = await supabase
      .from("marketing_content_analyses")
      .insert({
        url,
        title: analysis.title,
        content_summary: analysis.content_summary,
        keywords: analysis.keywords,
        themes: analysis.themes,
        tone: analysis.tone,
        raw_content: pageContent.slice(0, 5000),
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Content analyzer error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
