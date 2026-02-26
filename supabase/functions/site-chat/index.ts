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

    // Fetch contextual data from DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Fetch FAQ, glossary, account entries, services info in parallel
    const [faqRes, glossaryRes, accountsRes, coursesRes, blogRes] = await Promise.all([
      sb.from("blog_posts").select("title, excerpt, slug").eq("published", true).limit(30),
      sb.from("glossary_terms").select("term, description").eq("active", true).limit(100),
      sb.from("account_entries").select("account_number, name, description, category_group").eq("active", true).limit(200),
      sb.from("courses").select("name, description, category").eq("active", true).limit(50),
      sb.from("blog_posts").select("title, excerpt, category").eq("published", true).limit(20),
    ]);

    const glossaryContext = (glossaryRes.data || []).map(t => `${t.term}: ${t.description?.slice(0, 120)}`).join("\n");
    const accountsContext = (accountsRes.data || []).map(a => `Konto ${a.account_number} ${a.name}: ${a.description?.slice(0, 80)} (${a.category_group || ""})`).join("\n");
    const coursesContext = (coursesRes.data || []).map(c => `${c.name} (${c.category}): ${c.description?.slice(0, 80)}`).join("\n");
    const blogContext = (blogRes.data || []).map(b => `${b.title}: ${b.excerpt?.slice(0, 80)}`).join("\n");

    const systemPrompt = `Du er Ava, Avargos AI-assistent. Du hjelper besøkende med spørsmål om Avargo og alle tjenestene vi tilbyr.

VIKTIG: Svar ALLTID på norsk. Vær vennlig, profesjonell og konsis. Bruk maks 150 ord per svar med mindre brukeren ber om mer detalj.

OM AVARGO:
Avargo er et norsk selskap som tilbyr tjenester innen fire hovedområder:
1. **Regnskap & Økonomi** – Dedikert regnskapsfører, lønnskjøring, årsregnskap, skattemelding, CFO-as-a-Service, fakturering, skatteplanlegging, dashboard
2. **HR & Personal** – Lønn & HR-administrasjon, ansettelse & rekruttering, personalhåndbok, arbeidsrett & HMS
3. **Markedsføring & Vekst** – SEO, Meta-annonser, Google Ads, nettbutikk & e-handel
4. **IT & Utvikling** – Skreddersydde nettsider, AI-chatbot, interne systemer, AI & automatisering

PRISER: Starter fra 1 499 kr/mnd for nyoppstartede selskaper. Alt inkludert i fastpris.

BRANSJER: Tech & SaaS, Eiendom, Holding, Consulting, Landbruk, Bygg & Anlegg, Nettbutikk, Helse, Restaurant, Frisør, Håndverkere, og mange flere.

KURS: Avargo tilbyr 130+ kurs innen regnskap, HR, AI og ledelse.

KARRIERE: Avargo rekrutterer aktivt innen regnskap, personal, marked og IT. Vi tilbyr «Avargo Fri» – fleksibel arbeidshverdag.

KONTOHJELP (Norsk Standard Kontoplan NS 4102):
${accountsContext.slice(0, 3000)}

REGNSKAPSORD:
${glossaryContext.slice(0, 2000)}

KURS:
${coursesContext.slice(0, 1500)}

BLOGG/NYHETER:
${blogContext.slice(0, 1000)}

FAQ-SVAR:
- Regnskapsfører koster fra 1 499 kr/mnd
- Bytte av regnskapsfører tar 2-4 uker
- MVA-plikt inntreffer ved 50 000 kr omsetning over 12 mnd
- Aksjekapital minimum 30 000 kr for AS
- OTP er pålagt for alle bedrifter med ansatte
- Skattemelding frist: 31. mai (AS), 30. april (ENK)

Hvis du ikke vet svaret, si det ærlig og foreslå at brukeren tar kontakt via kontaktskjemaet på avargo.no/kontakt.
Referer gjerne til relevante sider som /ressurser/kontohjelp, /faq, /kurs, /karriere etc.`;

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
        return new Response(JSON.stringify({ error: "For mange forespørsler. Prøv igjen om litt." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-tjenesten er midlertidig utilgjengelig." }), {
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
    console.error("site-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Ukjent feil" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
