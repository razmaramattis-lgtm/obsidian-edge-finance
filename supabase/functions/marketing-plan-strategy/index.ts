import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { duration_months, platforms, goals, custom_instructions } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ikke konfigurert");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Gather all context
    const [analysesRes, insightsRes, postsRes] = await Promise.all([
      supabase.from("marketing_content_analyses").select("title, content_summary, keywords, themes").limit(30),
      supabase.from("marketing_ai_insights").select("*").eq("active", true).limit(20),
      supabase.from("marketing_posts").select("platform, status, content, hashtags").eq("status", "published").limit(20),
    ]);

    const brandContext = (analysesRes.data || [])
      .map((a: any) => `${a.title}: ${a.content_summary} [${(a.keywords || []).join(", ")}]`)
      .join("\n")
      .slice(0, 6000);

    const pastPerformance = (postsRes.data || [])
      .map((p: any) => `[${p.platform}] ${p.content?.slice(0, 100)}`)
      .join("\n")
      .slice(0, 3000);

    const months = duration_months || 3;
    const selectedPlatforms = platforms || ["linkedin", "facebook", "instagram", "google_ads", "meta_ads"];
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + months);

    const totalWeeks = Math.ceil(months * 4.3);

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
            content: `Du er en strategisk markedsføringsplanlegger for Avargo, Norges ledende regnskapsbyrå med AI-drevne tjenester. 

Lag en detaljert ${months}-måneders markedsføringsstrategi.

AVARGO KONTEKST:
${brandContext}

TIDLIGERE INNLEGG:
${pastPerformance}

PLATTFORMER: ${selectedPlatforms.join(", ")}
MÅL: ${goals || "Øke synlighet, generere leads, etablere Avargo som markedsleder"}

${custom_instructions ? `TILLEGG: ${custom_instructions}` : ""}

Returner JSON:
{
  "title": "Strateginavn",
  "description": "Overordnet strategibeskrivelse (200 ord)",
  "key_themes": ["tema1", "tema2", ...],
  "content_pillars": [
    { "pillar": "navn", "description": "beskrivelse", "platforms": ["linkedin", ...], "frequency": "2x per uke" }
  ],
  "weekly_plan": [
    {
      "week": 1,
      "theme": "uketema",
      "posts": [
        {
          "day": "mandag",
          "platform": "linkedin",
          "topic": "emne",
          "content_type": "artikkel/bilde/video/reel",
          "tone": "profesjonell/inspirerende/edukativ",
          "brief": "kort brief for innholdet"
        }
      ],
      "campaign": null
    }
  ],
  "campaigns": [
    {
      "name": "kampanjenavn",
      "platform": "google_ads",
      "week_start": 2,
      "week_end": 6,
      "budget_suggestion": "5000 NOK/mnd",
      "objective": "leads/awareness/traffic",
      "target_audience": "målgruppe"
    }
  ],
  "kpi_targets": {
    "monthly_posts": 20,
    "engagement_rate_target": "3%",
    "lead_target": 50,
    "follower_growth": "10%"
  }
}
Returner KUN gyldig JSON. Lag plan for ${totalWeeks} uker.`,
          },
          {
            role: "user",
            content: `Lag en ${months}-måneders markedsføringsstrategi for Avargo som dominerer markedet for regnskapstjenester i Norge. Fokus: ${goals || "Totalmarkedsdominans"}`,
          },
        ],
        temperature: 0.6,
        max_tokens: 8000,
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "For mange forespørsler." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "Kreditter oppbrukt." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI-feil: " + aiRes.status);
    }

    const aiData = await aiRes.json();
    const raw = aiData.choices?.[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Klarte ikke parse AI-svar");

    const strategy = JSON.parse(jsonMatch[0]);

    // Save to database
    const { data: plan, error: insertError } = await supabase
      .from("marketing_strategy_plans")
      .insert({
        title: strategy.title || `${months}-mnd strategi`,
        description: strategy.description,
        start_date: today.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        platforms: selectedPlatforms,
        goals: {
          custom: goals,
          kpi_targets: strategy.kpi_targets,
          content_pillars: strategy.content_pillars,
          key_themes: strategy.key_themes,
        },
        weekly_posts: strategy.weekly_plan || [],
        weekly_campaigns: strategy.campaigns || [],
        status: "draft",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, plan, strategy }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Strategy planning error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
