import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Fetch all resources for the knowledge base
    const [hmsRes, resourcesRes, archiveRes, internalRes, collabRes, servicesRes, pricingRes, knowledgeRes] = await Promise.all([
      sb.from("hms_documents").select("title, content"),
      sb.from("resources").select("name, description, category, file_name"),
      sb.from("archive_files").select("name, description, category, file_name, file_url"),
      sb.from("internal_resources").select("title, description, category, file_name"),
      sb.from("collaboration_agreements").select("title, company, contact_name, offering, description"),
      sb.from("services").select("title, description, group_name"),
      sb.from("pricing_plans").select("name, description, price, price_suffix, features"),
      sb.from("knowledge_materials").select("title, content, category").eq("active", true),
    ]);

    let context = "# OPPSLAGSVERK — Alt du trenger å vite\n\n";

    context += "## HMS-dokumenter\n";
    (hmsRes.data || []).forEach((d: any) => { context += `### ${d.title}\n${d.content || ""}\n\n`; });

    context += "## Maler & Ressurser\n";
    (resourcesRes.data || []).forEach((d: any) => { context += `- **${d.name}** (${d.category}): ${d.description || ""} — Fil: ${d.file_name || "Ingen"}\n`; });

    context += "\n## Arkivfiler\n";
    (archiveRes.data || []).forEach((d: any) => { context += `- **${d.name}** (${d.category}): ${d.description || ""} — Fil: ${d.file_name || "Ingen"}${d.file_url ? ` — Nedlasting: ${d.file_url}` : ""}\n`; });

    context += "\n## Interne ressurser\n";
    (internalRes.data || []).forEach((d: any) => { context += `- **${d.title}** (${d.category}): ${d.description || ""} — Fil: ${d.file_name || "Ingen"}\n`; });

    context += "\n## Samarbeidsavtaler\n";
    (collabRes.data || []).forEach((d: any) => { context += `- **${d.title}** — Firma: ${d.company || ""}, Kontakt: ${d.contact_name || ""}, Tilbyr: ${d.offering || ""}\n`; });

    context += "\n## Tjenester (fremsiden)\n";
    (servicesRes.data || []).forEach((d: any) => { context += `- **${d.title}** (${d.group_name}): ${d.description || ""}\n`; });

    context += "\n## Prisplaner\n";
    (pricingRes.data || []).forEach((d: any) => {
      const feats = Array.isArray(d.features) ? (d.features as string[]).join(", ") : "";
      context += `- **${d.name}**: ${d.price} kr${d.price_suffix} — ${d.description || ""}. Inkluderer: ${feats}\n`;
    });

    context += "\n## Datasenter (ekstra materiale)\n";
    (knowledgeRes.data || []).forEach((d: any) => {
      context += `### ${d.title} (${d.category || "Generelt"})\n${d.content || ""}\n\n`;
    });

    const systemPrompt = `Du er "Ava", Avargo sin kunnskapsrike rådgiver. Du har en varm, profesjonell og hjelpsom personlighet. Du snakker som en erfaren kollega — ikke som en robot.

Retningslinjer:
- Svar ALLTID på norsk. Bruk et naturlig, muntlig språk uten å være uformelt.
- Når du finner relevant informasjon, analyser den kort og gi et konkret, tydelig svar.
- Henvis ALLTID til kilden: f.eks. "Ifølge kontoplanen (konto 6300)…", "I HMS-håndboken kapittel 3 står det at…", "I samarbeidsavtalen med [firma]…"
- Bruk markdown-formatering: **fet skrift** for viktige begreper, lister for opplistinger, overskrifter for å strukturere lange svar.
- VIKTIG: Når du nevner et skjema eller en fil fra arkivet som har en nedlastingslenke, ALLTID inkluder en nedlastingslenke med denne formateringen: [📥 Last ned FILNAVN](URL)
- Hvis du ikke finner svaret i ressursene, si det ærlig: "Jeg finner dessverre ikke dette i våre ressurser. Du bør sjekke med [relevant person/kilde]."
- Vær analytisk: ikke bare gjengi informasjon — forklar hva det betyr i praksis.
- Hold svarene konsise men grundige. Bruk korte avsnitt.

--- RESSURSOVERSIKT START ---
${context}
--- RESSURSOVERSIKT SLUTT ---`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "For mange forespørsler." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-kreditt brukt opp." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI-feil" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("knowledge-base error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Ukjent feil" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
