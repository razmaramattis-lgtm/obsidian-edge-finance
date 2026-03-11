import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { duration_months, platforms, goals, custom_instructions, budget } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ikke konfigurert");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Gather ALL context from the database - deep knowledge of Avargo
    const [analysesRes, insightsRes, postsRes, industriesRes, blogRes, coursesRes, glossaryRes, collabRes, pricingRes, jobsRes] = await Promise.all([
      supabase.from("marketing_content_analyses").select("title, content_summary, keywords, themes, tone").limit(50),
      supabase.from("marketing_ai_insights").select("insight_type, platform, recommendation, confidence").eq("active", true).limit(20),
      supabase.from("marketing_posts").select("platform, status, content, hashtags, engagement_score").order("created_at", { ascending: false }).limit(30),
      supabase.from("industries").select("title, tagline, description, slug, deliverables").eq("active", true).limit(50),
      supabase.from("blog_posts").select("title, category, tags, excerpt").eq("published", true).limit(30),
      supabase.from("courses").select("name, description, category, target_audience").eq("active", true).limit(20),
      supabase.from("glossary_terms").select("term").eq("active", true).limit(50),
      supabase.from("collaboration_agreements").select("title, description, offering, target_audience").limit(20),
      supabase.from("contact_submissions").select("section, package, industry").limit(50),
      supabase.from("job_listings").select("title, category, location").eq("active", true).limit(10),
    ]);

    const brandContext = (analysesRes.data || [])
      .map((a: any) => `• ${a.title}: ${a.content_summary} [Nøkkelord: ${(a.keywords || []).join(", ")}] [Tone: ${a.tone}]`)
      .join("\n")
      .slice(0, 5000);

    const existingInsights = (insightsRes.data || [])
      .map((i: any) => `[${i.insight_type}/${i.platform || "alle"}] ${i.recommendation} (${Math.round((i.confidence || 0) * 100)}%)`)
      .join("\n")
      .slice(0, 2000);

    const pastPosts = (postsRes.data || [])
      .map((p: any) => `[${p.platform}/${p.status}] ${(p.content || "").slice(0, 80)}`)
      .join("\n")
      .slice(0, 2000);

    const industriesList = (industriesRes.data || []).map((i: any) => i.title).join(", ");
    const blogTopics = (blogRes.data || []).map((b: any) => `${b.title} [${b.category}]`).join(", ").slice(0, 1000);

    const months = duration_months || 3;
    const selectedPlatforms = platforms || ["linkedin", "facebook", "instagram", "google_ads", "meta_ads"];
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + months);
    const totalWeeks = Math.ceil(months * 4.3);

    // Use tool calling for structured output
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Du er en ekspert strategisk markedsføringsplanlegger for Avargo – Norges ledende AI-drevne regnskapsbyrå.

AVARGO MERKEVARE-KONTEKST (fra faktisk innholdsanalyse):
${brandContext}

AI MARKETING INNSIKTER:
${existingInsights}

TIDLIGERE PUBLISERTE INNLEGG:
${pastPosts}

BRANSJER AVARGO DEKKER: ${industriesList}
BLOGG-EMNER: ${blogTopics}

VIKTIGE RETNINGSLINJER:
- Avargo er Norges mest innovative regnskapsbyrå
- Tjenester: Regnskap, AI, HR, lønn, CFO, nettsider, SEO, SoMe, kurs
- Tone: Profesjonell men moderne og tilgjengelig
- Merkefarge: Mørk teal/grønn med gull-aksenter
- Lag innlegg som er SPESIFIKKE og HANDLINGSORIENTERTE, ikke generiske
- Bruk norske helligdager og skatte/regnskapsfrister som strategiske tidspunkter
- Varier mellom edukativt, inspirerende, case-basert og salgsfremmende innhold`,
          },
          {
            role: "user",
            content: `Lag en komplett ${months}-måneders markedsføringsstrategi for Avargo.
Plattformer: ${selectedPlatforms.join(", ")}
Mål: ${goals || "Øke synlighet, generere leads, etablere Avargo som markedsleder innen AI-drevet regnskap"}
${custom_instructions ? `Spesielle instrukser: ${custom_instructions}` : ""}
Lag plan for NØYAKTIG ${totalWeeks} uker med konkrete, detaljerte innlegg.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_strategy",
              description: "Opprett en komplett markedsføringsstrategi med ukeplaner og kampanjer.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Strateginavn" },
                  description: { type: "string", description: "Overordnet strategibeskrivelse, 100-200 ord" },
                  key_themes: { type: "array", items: { type: "string" }, description: "3-6 overordnede temaer" },
                  content_pillars: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        pillar: { type: "string" },
                        description: { type: "string" },
                        platforms: { type: "array", items: { type: "string" } },
                        frequency: { type: "string" },
                      },
                      required: ["pillar", "description", "platforms", "frequency"],
                      additionalProperties: false,
                    },
                  },
                  kpi_targets: {
                    type: "object",
                    properties: {
                      monthly_posts: { type: "number" },
                      engagement_rate_target: { type: "string" },
                      lead_target: { type: "number" },
                      follower_growth: { type: "string" },
                    },
                    required: ["monthly_posts", "engagement_rate_target", "lead_target", "follower_growth"],
                    additionalProperties: false,
                  },
                  weekly_plan: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        week: { type: "number" },
                        theme: { type: "string" },
                        posts: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              day: { type: "string", description: "mandag/tirsdag/onsdag/torsdag/fredag" },
                              platform: { type: "string" },
                              topic: { type: "string", description: "Spesifikt emne for innlegget" },
                              content_type: { type: "string", description: "artikkel/bilde/video/reel/karusell" },
                              tone: { type: "string", description: "profesjonell/inspirerende/edukativ/salgsorientert" },
                              brief: { type: "string", description: "Kort brief 1-2 setninger med nøyaktig hva innlegget skal handle om" },
                            },
                            required: ["day", "platform", "topic", "content_type", "tone", "brief"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["week", "theme", "posts"],
                      additionalProperties: false,
                    },
                  },
                  campaigns: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        platform: { type: "string" },
                        week_start: { type: "number" },
                        week_end: { type: "number" },
                        budget_suggestion: { type: "string" },
                        objective: { type: "string" },
                        target_audience: { type: "string" },
                      },
                      required: ["name", "platform", "week_start", "week_end", "budget_suggestion", "objective", "target_audience"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["title", "description", "key_themes", "content_pillars", "kpi_targets", "weekly_plan", "campaigns"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_strategy" } },
        temperature: 0.5,
        max_tokens: 12000,
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "For mange forespørsler, prøv igjen om litt." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI-kreditter oppbrukt." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiRes.text();
      console.error("AI error:", aiRes.status, errText);
      throw new Error("AI-feil: " + aiRes.status);
    }

    const aiData = await aiRes.json();

    // Extract from tool call response
    let strategy: any;
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      strategy = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } else {
      // Fallback: try to parse from content
      const raw = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Klarte ikke parse AI-svar. Prøv igjen.");
      strategy = JSON.parse(jsonMatch[0]);
    }

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
      JSON.stringify({ success: true, plan, weeks: strategy.weekly_plan?.length || 0 }),
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
