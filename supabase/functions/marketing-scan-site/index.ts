import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ikke konfigurert");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Pull ALL real content from the database - complete Avargo knowledge
    const [blogRes, industriesRes, coursesRes, glossaryRes, collabRes, jobsRes, hmsRes, hrRes, pricingRes, accountRes] = await Promise.all([
      supabase.from("blog_posts").select("title, excerpt, content, category, tags, slug").eq("published", true).limit(50),
      supabase.from("industries").select("title, description, tagline, intro, body, deliverables, slug").eq("active", true).limit(50),
      supabase.from("courses").select("name, description, category, target_audience, slug, duration, highlights").eq("active", true).limit(50),
      supabase.from("glossary_terms").select("term, description, slug").eq("active", true).limit(200),
      supabase.from("collaboration_agreements").select("title, description, offering, target_audience, partner").limit(30),
      supabase.from("job_listings").select("title, category, location, description, qualifications, we_offer, slug").eq("active", true).limit(20),
      supabase.from("hms_documents").select("title, content").limit(10),
      supabase.from("hr_handbook").select("title, content").limit(20),
      supabase.from("contact_submissions").select("section, package, industry, message").limit(100),
      supabase.from("account_entries").select("account_number, name, description, category_group, mva_status").eq("active", true).limit(50),
    ]);

    // Build content pages from database content
    const contentPages: { url: string; title: string; content: string; category: string }[] = [];

    // Blog posts
    for (const post of blogRes.data || []) {
      contentPages.push({
        url: `/nyheter/${post.slug}`,
        title: post.title,
        content: `${post.excerpt || ""} ${(post.content || "").replace(/<[^>]+>/g, " ").slice(0, 2000)}`,
        category: "blogg",
      });
    }

    // Industries
    for (const ind of industriesRes.data || []) {
      contentPages.push({
        url: `/bransjer/${ind.slug}`,
        title: ind.title,
        content: `${ind.tagline || ""} ${ind.description || ""} ${ind.intro || ""} ${(ind.body || "").replace(/<[^>]+>/g, " ").slice(0, 1500)} Leveranser: ${(ind.deliverables || []).join(", ")}`,
        category: "bransje",
      });
    }

    // Courses
    for (const c of coursesRes.data || []) {
      contentPages.push({
        url: `/kurs/${c.slug}`,
        title: c.name,
        content: `${c.description || ""} Kategori: ${c.category} Målgruppe: ${c.target_audience || ""} Varighet: ${c.duration || ""} Høydepunkter: ${JSON.stringify(c.highlights || [])}`,
        category: "kurs",
      });
    }

    // Glossary terms (batch them together)
    const glossaryContent = (glossaryRes.data || []).map((g: any) => `${g.term}: ${(g.description || "").slice(0, 100)}`).join("\n");
    if (glossaryContent) {
      contentPages.push({
        url: "/regnskapsord",
        title: "Regnskapsordbok – Avargo",
        content: `Avargos komplette regnskapsordbok med ${(glossaryRes.data || []).length} fagbegreper:\n${glossaryContent}`,
        category: "ordbok",
      });
    }

    // Collaboration agreements / partnerships
    for (const c of collabRes.data || []) {
      contentPages.push({
        url: `/samarbeid/${c.title.toLowerCase().replace(/\s+/g, "-")}`,
        title: `Samarbeid: ${c.title}`,
        content: `Partner: ${c.partner || ""} ${c.description || ""} Tilbud: ${c.offering || ""} Målgruppe: ${c.target_audience || ""}`,
        category: "samarbeid",
      });
    }

    // Job listings
    for (const j of jobsRes.data || []) {
      contentPages.push({
        url: `/karriere/${j.slug}`,
        title: `Stilling: ${j.title}`,
        content: `${j.title} (${j.category}, ${j.location}) ${(j.description || "").replace(/<[^>]+>/g, " ").slice(0, 800)} Kvalifikasjoner: ${(j.qualifications || "").replace(/<[^>]+>/g, " ").slice(0, 400)} Vi tilbyr: ${(j.we_offer || "").replace(/<[^>]+>/g, " ").slice(0, 400)}`,
        category: "karriere",
      });
    }

    // HMS documents
    for (const h of hmsRes.data || []) {
      contentPages.push({
        url: `/hms/${h.title.toLowerCase().replace(/\s+/g, "-")}`,
        title: `HMS: ${h.title}`,
        content: (h.content || "").replace(/<[^>]+>/g, " ").slice(0, 1500),
        category: "hms",
      });
    }

    // HR Handbook chapters
    for (const h of hrRes.data || []) {
      contentPages.push({
        url: `/hr/${h.title.toLowerCase().replace(/\s+/g, "-")}`,
        title: `Personalhåndbok: ${h.title}`,
        content: (h.content || "").replace(/<[^>]+>/g, " ").slice(0, 1500),
        category: "hr",
      });
    }

    // Popular inquiry analysis
    const sectionCounts: Record<string, number> = {};
    for (const s of pricingRes.data || []) {
      const key = s.section || s.package || "generell";
      sectionCounts[key] = (sectionCounts[key] || 0) + 1;
    }
    const topInquiries = Object.entries(sectionCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    if (topInquiries.length > 0) {
      contentPages.push({
        url: "/innsikt/henvendelser",
        title: "Populære henvendelser",
        content: `Analyse av ${(pricingRes.data || []).length} kundehenvendelser. Mest populære: ${topInquiries.map(([k, v]) => `${k} (${v} stk)`).join(", ")}. Bransjer som tar kontakt: ${[...new Set((pricingRes.data || []).map((s: any) => s.industry).filter(Boolean))].join(", ")}`,
        category: "innsikt",
      });
    }

    // Account entries (accounting knowledge)
    if ((accountRes.data || []).length > 0) {
      const accountContent = (accountRes.data || []).map((a: any) => `Konto ${a.account_number} ${a.name}: ${(a.description || "").slice(0, 80)} [${a.category_group || ""}, MVA: ${a.mva_status}]`).join("\n");
      contentPages.push({
        url: "/kontohjelp",
        title: "Kontoplan og kontohjelp",
        content: `Avargos kontoplanveiledning med ${(accountRes.data || []).length} kontoer:\n${accountContent}`,
        category: "kontohjelp",
      });
    }

    // Static pages context - expanded with detailed service descriptions
    const staticPages = [
      { url: "/", title: "Avargo – Forsiden", content: "Avargo er Norges ledende AI-drevne regnskapsbyrå. Vi tilbyr regnskap, lønn, HR, CFO-tjenester, AI-automatisering, nettsider, SEO, Google Ads, Meta-annonser, nettbutikk, fakturering, skatteplanlegging, arbeidsrett og personalhåndbok. Alt samlet i én plattform med personlig rådgiver. Grunnlagt for å revolusjonere regnskapsbransjen.", category: "hovedside" },
      { url: "/tjenester", title: "Tjenester", content: "Regnskapsførertjenester med autoriserte regnskapsførere. AI-innsikt og automatisering for smartere drift. CFO-tjenester og strategisk rådgivning. HR og lønn med komplett personaladministrasjon. Nettsider med konverteringsoptimalisering. SEO for synlighet i søkemotorer. Google Ads og Meta-annonser for målrettet annonsering. Nettbutikk-løsninger. Fakturering og betalingsoppfølging. Skatteplanlegging og -optimalisering. Ansettelse og arbeidsrett. Personalhåndbok og HMS. AI-chatbot for kundeservice. Internsystemer og dashboard.", category: "tjenester" },
      { url: "/priser", title: "Priser", content: "Transparente priser tilpasset bedriftens størrelse. Pakker fra enkeltpersonforetak til større selskaper. Inkluderer regnskapsfører, lønn, HR og digitale tjenester. Ingen skjulte kostnader. Skalerbare løsninger som vokser med bedriften.", category: "priser" },
      { url: "/metoden", title: "Avargo-metoden", content: "Avargo-metoden kombinerer AI-teknologi med personlig rådgivning i tre faser: 1) Kartlegging – grundig analyse av bedriftens behov og systemer. 2) Implementering – skreddersydde løsninger med dedikert rådgiver. 3) Løpende optimalisering – kontinuerlig forbedring med AI-drevet innsikt.", category: "metoden" },
      { url: "/om-oss", title: "Om Avargo", content: "Norges mest innovative regnskapsbyrå. Et team av autoriserte regnskapsførere, HR-rådgivere, teknologieksperter og markedsførere. Vi tror på at teknologi og menneskelig ekspertise sammen skaper de beste resultatene for norske bedrifter.", category: "om-oss" },
      { url: "/karriere", title: "Karriere hos Avargo", content: "Jobb hos Norges mest innovative regnskapsbyrå. Stillinger innen regnskap, HR, IT, marked og kundeservice. Moderne arbeidsmiljø med fokus på innovasjon, faglig utvikling og work-life balance. Konkurransedyktige betingelser.", category: "karriere" },
      { url: "/ressurser", title: "Ressurser", content: "Gratis maler, sjekklister og verktøy for norske bedrifter. Sjekkliste for årsoppgjøret, mal for balanseavstemming, skattekalender og mer.", category: "ressurser" },
      { url: "/faq", title: "FAQ", content: "Vanlige spørsmål om regnskap, MVA, lønn, skatteplanlegging og Avargos tjenester. Svar på alt fra 'Hva koster en regnskapsfører?' til 'Hvordan fungerer AI-automatisering?'", category: "faq" },
      { url: "/skattekalender", title: "Skattekalender", content: "Oversikt over alle viktige frister for norske bedrifter: MVA-terminforfall, A-melding, skattemelding, årsregnskap, generalforsamling og mer.", category: "verktøy" },
    ];
    contentPages.push(...staticPages);

    // Now analyze all content with AI in batches
    let scanned = 0;
    const totalPages = contentPages.length;

    // Process in batches of 5 pages per AI call to reduce requests
    for (let i = 0; i < contentPages.length; i += 5) {
      const batch = contentPages.slice(i, i + 5);
      const batchContent = batch.map((p, idx) => `--- SIDE ${idx + 1}: ${p.title} (${p.url}) ---\n${p.content}`).join("\n\n");

      try {
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
                content: `Du er en markedsføringsanalytiker for Avargo, et norsk AI-drevet regnskapsbyrå. 
Analyser sidene og returner et JSON-array med ett objekt per side:
[
  {
    "index": 0,
    "title": "sidetittel",
    "content_summary": "sammendrag maks 80 ord med fokus på unike salgsargumenter og verdiforslag",
    "keywords": ["nøkkelord1", "nøkkelord2", ...],
    "themes": ["tema1", "tema2", ...],
    "tone": "tonefallbeskrivelse",
    "target_audience": "hvem er målgruppen"
  }
]
Returner KUN gyldig JSON-array.`,
              },
              { role: "user", content: `Analyser disse ${batch.length} sider:\n\n${batchContent}` },
            ],
            temperature: 0.2,
            max_tokens: 2000,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const raw = aiData.choices?.[0]?.message?.content || "";
          const jsonMatch = raw.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const analyses = JSON.parse(jsonMatch[0]);
            for (const analysis of analyses) {
              const page = batch[analysis.index ?? analyses.indexOf(analysis)];
              if (!page) continue;

              await supabase.from("marketing_content_analyses").upsert({
                url: page.url,
                title: analysis.title || page.title,
                content_summary: analysis.content_summary || page.content.slice(0, 300),
                keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
                themes: Array.isArray(analysis.themes) ? analysis.themes : [],
                tone: analysis.tone || "Profesjonell",
                raw_content: page.content.slice(0, 5000),
                crawled_at: new Date().toISOString(),
              }, { onConflict: "url" }).then(({ error }) => {
                if (error) {
                  // Fallback: insert without upsert
                  supabase.from("marketing_content_analyses").insert({
                    url: page.url,
                    title: analysis.title || page.title,
                    content_summary: analysis.content_summary || page.content.slice(0, 300),
                    keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
                    themes: Array.isArray(analysis.themes) ? analysis.themes : [],
                    tone: analysis.tone || "Profesjonell",
                    raw_content: page.content.slice(0, 5000),
                  });
                }
              });
              scanned++;
            }
          }
        } else if (aiRes.status === 429) {
          // Rate limited - wait and retry
          await new Promise(r => setTimeout(r, 5000));
          i -= 5; // retry this batch
          continue;
        } else if (aiRes.status === 402) {
          return new Response(JSON.stringify({ error: "AI-kreditter oppbrukt. Legg til flere kreditter." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch (aiErr) {
        console.error("AI batch error:", aiErr);
        // Still save raw content without AI analysis
        for (const page of batch) {
          await supabase.from("marketing_content_analyses").upsert({
            url: page.url,
            title: page.title,
            content_summary: page.content.slice(0, 300),
            keywords: [],
            themes: [page.category],
            tone: "Profesjonell",
            raw_content: page.content.slice(0, 5000),
            crawled_at: new Date().toISOString(),
          }, { onConflict: "url" });
          scanned++;
        }
      }

      // Delay between batches
      if (i + 5 < contentPages.length) await new Promise(r => setTimeout(r, 800));
    }

    // Also generate AI insights from the combined data
    const allKeywords = contentPages.flatMap(p => []).join(", "); // will be populated from DB
    const insightPrompt = `Basert på Avargo sine ${totalPages} sider med innhold om regnskap, AI, HR, kurs og bransjeløsninger, gi 5 strategiske markedsføringsinnsikter som JSON-array:
[{"insight_type": "tone|cta|hashtag|timing|budget|audience", "platform": "linkedin|facebook|instagram|tiktok|null", "recommendation": "konkret anbefaling", "confidence": 0.85, "based_on_posts": ${totalPages}}]`;

    try {
      const insightRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "Du er en strategisk markedsføringsrådgiver for Avargo. Returner KUN gyldig JSON-array." },
            { role: "user", content: insightPrompt },
          ],
          temperature: 0.4,
          max_tokens: 1500,
        }),
      });

      if (insightRes.ok) {
        const insightData = await insightRes.json();
        const raw = insightData.choices?.[0]?.message?.content || "";
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const newInsights = JSON.parse(jsonMatch[0]);
          for (const insight of newInsights) {
            await supabase.from("marketing_ai_insights").insert({
              insight_type: insight.insight_type || "tone",
              platform: insight.platform || null,
              recommendation: insight.recommendation,
              confidence: insight.confidence || 0.7,
              based_on_posts: insight.based_on_posts || totalPages,
              active: true,
            });
          }
        }
      }
    } catch (e) {
      console.error("Insight generation error:", e);
    }

    return new Response(
      JSON.stringify({ success: true, scanned, total: totalPages }),
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
