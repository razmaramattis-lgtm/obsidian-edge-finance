import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { platform, topic, tone, include_image, custom_instructions, strategy_plan_id } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ikke konfigurert");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch scanned content as context
    const { data: analyses } = await supabase
      .from("marketing_content_analyses")
      .select("title, content_summary, keywords, themes, tone")
      .order("crawled_at", { ascending: false })
      .limit(20);

    const brandContext = (analyses || [])
      .map((a: any) => `Tittel: ${a.title}\nSammendrag: ${a.content_summary}\nNøkkelord: ${(a.keywords || []).join(", ")}\nTemaer: ${(a.themes || []).join(", ")}`)
      .join("\n---\n")
      .slice(0, 8000);

    // Fetch existing insights
    const { data: insights } = await supabase
      .from("marketing_ai_insights")
      .select("recommendation, insight_type, platform")
      .eq("active", true)
      .limit(10);

    const insightsContext = (insights || [])
      .map((i: any) => `[${i.insight_type}${i.platform ? ` - ${i.platform}` : ""}]: ${i.recommendation}`)
      .join("\n");

    const platformSpecs: Record<string, string> = {
      linkedin: "LinkedIn: Profesjonelt, max 3000 tegn, bruk relevante hashtags (3-5), start med en sterk hook, inkluder CTA",
      facebook: "Facebook: Engasjerende, max 2000 tegn, bruk emojis moderat, still spørsmål for engasjement, inkluder CTA",
      instagram: "Instagram: Visuelt fokus, max 2200 tegn, 20-30 relevante hashtags, engasjerende caption, emojis OK",
      google_ads: "Google Ads: Kort headline (max 30 tegn x3), beskrivelse (max 90 tegn x2), CTA-fokusert, bruk søkeord",
      meta_ads: "Meta Ads: Primærtekst (max 125 tegn), headline (max 40 tegn), visuelt tilpasset, konverteringsfokus",
      tiktok: "TikTok: Kort, catchy, trendbasert, max 300 tegn, bruk trending hashtags, visuelt og underholdende",
    };

    const platformGuide = platformSpecs[platform] || platformSpecs.linkedin;

    // Generate content
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `Du er en elite markedsføringsekspert for Avargo – Norges mest innovative regnskapsbyrå. Du lager innhold som dominerer markedet.

MERKEVARESTEMME:
- Avargo er ikke bare et regnskapsbyrå – vi er en strategisk partner for vekst
- Vi kombinerer tradisjonelt regnskap med AI, teknologi og rådgivning
- Tonen er: Selvsikker, kunnskapsrik, fremtidsrettet, aldri arrogant
- Vi posisjonerer oss som bransjestandarden andre måles mot
- Unngå å nevne konkurrenter ved navn

PLATTFORMKRAV:
${platformGuide}

KJENTE INNSIKTER FRA AI BRAIN:
${insightsContext || "Ingen innsikter enda."}

INNHOLD FRA AVARGO.NO:
${brandContext}

${custom_instructions ? `TILLEGGSINSTRUKSER: ${custom_instructions}` : ""}

Returner JSON:
{
  "title": "intern tittel for innlegget",
  "content": "det ferdige innlegget klar for publisering",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "cta": "call to action tekst",
  "image_prompt": "beskrivelse for AI-bildegenerering som passer innholdet (profesjonell, moderne estetikk for regnskapsbyrå)",
  "best_posting_time": "anbefalt tidspunkt for publisering",
  "engagement_prediction": "lav/middels/høy"
}
Returner KUN gyldig JSON.`,
          },
          {
            role: "user",
            content: `Lag et ${platform}-innlegg om: ${topic || "Avargos tjenester generelt"}\nØnsket tone: ${tone || "Profesjonell og engasjerende"}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "For mange forespørsler. Prøv igjen om litt." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "Kreditter oppbrukt. Legg til flere i innstillinger." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI-feil: " + aiRes.status);
    }

    const aiData = await aiRes.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Klarte ikke parse AI-svar");

    const generated = JSON.parse(jsonMatch[0]);

    // Generate image if requested
    let imageUrl: string | null = null;
    if (include_image && generated.image_prompt) {
      try {
        const imgRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
          },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image-preview",
            messages: [
              {
                role: "user",
                content: `Create a professional, modern marketing image for a Norwegian accounting and advisory firm called Avargo. Style: Clean, corporate yet innovative, dark teal and gold accents. ${generated.image_prompt}. No text in the image. 16:9 aspect ratio.`,
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const base64 = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (base64) {
            // Upload to storage
            const imageBytes = Uint8Array.from(atob(base64.split(",")[1] || base64), c => c.charCodeAt(0));
            const fileName = `marketing/${Date.now()}-${platform}.png`;
            const { error: uploadError } = await supabase.storage
              .from("workspace-uploads")
              .upload(fileName, imageBytes, { contentType: "image/png" });

            if (!uploadError) {
              const { data: urlData } = supabase.storage.from("workspace-uploads").getPublicUrl(fileName);
              imageUrl = urlData.publicUrl;
            }
          }
        }
      } catch (imgErr) {
        console.error("Image generation error:", imgErr);
        // Continue without image
      }
    }

    // Save to database
    const authHeader = req.headers.get("Authorization");
    let createdBy: string | null = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();
        createdBy = profile?.id || null;
      }
    }

    const { data: post, error: insertError } = await supabase
      .from("marketing_posts")
      .insert({
        title: generated.title || topic || "AI-generert innlegg",
        platform,
        content: generated.content,
        hashtags: generated.hashtags || [],
        status: "pending_approval",
        ai_generated: true,
        image_url: imageUrl,
        image_prompt: generated.image_prompt,
        created_by: createdBy,
        strategy_plan_id: strategy_plan_id || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        success: true,
        post,
        meta: {
          best_posting_time: generated.best_posting_time,
          engagement_prediction: generated.engagement_prediction,
          cta: generated.cta,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Content generation error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
