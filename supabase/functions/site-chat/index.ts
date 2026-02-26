import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-zæøå0-9\s]/g, "").trim();
}

function scoreMatch(query: string, text: string, weight = 1): number {
  const q = normalize(query);
  const words = q.split(/\s+/).filter(w => w.length > 1);
  const t = normalize(text);
  let score = 0;
  if (t.includes(q)) score += 100 * weight;
  for (const word of words) {
    if (t.includes(word)) score += 10 * weight;
  }
  return score;
}

interface SearchResult {
  title: string;
  body: string;
  source: string;
  href?: string;
  score: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const lastMessage = messages?.filter((m: any) => m.role === "user").pop()?.content || "";

    if (!lastMessage.trim()) {
      return respondStream("Hei! 👋 Spør meg om regnskap, HR, kurs, kontohjelp eller noe annet fra Avargo.");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Fetch all data sources in parallel
    const [glossaryRes, accountsRes, coursesRes, blogRes, hmsRes, industriesRes] = await Promise.all([
      sb.from("glossary_terms").select("term, description, slug").eq("active", true),
      sb.from("account_entries").select("account_number, name, description, category_group, slug, examples, tags").eq("active", true),
      sb.from("courses").select("name, description, category, slug").eq("active", true),
      sb.from("blog_posts").select("title, excerpt, content, slug, category").eq("published", true),
      sb.from("hms_documents").select("title, content").order("sort_order"),
      sb.from("industries").select("slug, description, meta_title, intro, href").eq("active", true),
    ]);

    const results: SearchResult[] = [];
    const query = lastMessage;

    // Score glossary terms
    for (const t of glossaryRes.data || []) {
      const s = scoreMatch(query, t.term, 3) + scoreMatch(query, t.description || "", 1);
      if (s > 0) results.push({
        title: t.term,
        body: t.description || "",
        source: "Regnskapsord",
        href: `/ressurser/regnskapsord/${t.slug}`,
        score: s,
      });
    }

    // Score account entries
    for (const a of accountsRes.data || []) {
      const combined = `${a.name} ${a.description || ""} ${(a.tags || []).join(" ")} ${(a.examples || []).join(" ")}`;
      const s = scoreMatch(query, a.name, 3) + scoreMatch(query, combined, 1);
      // Boost results accounts (3000-8999)
      const num = parseInt(a.account_number);
      const boost = num >= 3000 && num <= 8999 ? 20 : 0;
      if (s > 0) results.push({
        title: `Konto ${a.account_number} – ${a.name}`,
        body: a.description || "",
        source: "Kontohjelp",
        href: `/ressurser/kontohjelp/${a.slug}`,
        score: s + boost,
      });
    }

    // Score courses
    for (const c of coursesRes.data || []) {
      const s = scoreMatch(query, c.name, 2) + scoreMatch(query, `${c.description || ""} ${c.category}`, 1);
      if (s > 0) results.push({
        title: c.name,
        body: `${c.category} – ${c.description || ""}`,
        source: "Kurs",
        href: c.slug ? `/kurs/katalog/${c.slug}` : "/kurs/katalog",
        score: s,
      });
    }

    // Score blog posts
    for (const b of blogRes.data || []) {
      const plain = (b.content || "").replace(/<[^>]+>/g, " ").slice(0, 500);
      const s = scoreMatch(query, b.title, 3) + scoreMatch(query, `${b.excerpt || ""} ${plain}`, 1);
      if (s > 0) results.push({
        title: b.title,
        body: b.excerpt || plain.slice(0, 200),
        source: b.category || "Blogg",
        href: b.slug ? `/ressurser/blogg/${b.slug}` : "/ressurser",
        score: s,
      });
    }

    // Score HMS documents
    for (const h of hmsRes.data || []) {
      const plain = (h.content || "").replace(/<[^>]+>/g, " ").slice(0, 500);
      const s = scoreMatch(query, h.title, 2) + scoreMatch(query, plain, 1);
      if (s > 0) results.push({
        title: h.title,
        body: plain.slice(0, 200),
        source: "HMS",
        score: s,
      });
    }

    // Score industries
    for (const ind of industriesRes.data || []) {
      const s = scoreMatch(query, ind.meta_title || "", 2) + scoreMatch(query, `${ind.description || ""} ${ind.intro || ""}`, 1);
      if (s > 0) results.push({
        title: ind.meta_title || ind.slug || "",
        body: ind.description || ind.intro || "",
        source: "Bransje",
        href: ind.href || `/bransjer/${ind.slug}`,
        score: s,
      });
    }

    // Also match against static FAQ content
    const faqItems = getFaqData();
    for (const faq of faqItems) {
      const s = scoreMatch(query, faq.q, 3) + scoreMatch(query, faq.a, 1);
      if (s > 0) results.push({
        title: faq.q,
        body: faq.a,
        source: "FAQ",
        href: "/faq",
        score: s,
      });
    }

    // Sort by score and take top results
    results.sort((a, b) => b.score - a.score);

    if (results.length === 0) {
      return respondStream(`Beklager, jeg fant ingen treff for «${lastMessage}». Prøv med andre ord, eller ta kontakt med oss på [avargo.no/kontakt](/kontakt).`);
    }

    const top = results.slice(0, 3);
    let answer = "";

    for (const r of top) {
      answer += `### ${r.title}\n`;
      answer += `*${r.source}*\n\n`;
      answer += r.body.slice(0, 300) + (r.body.length > 300 ? "…" : "") + "\n\n";
      if (r.href) answer += `[Les mer →](${r.href})\n\n`;
      answer += "---\n\n";
    }

    if (results.length > 3) {
      answer += `*Fant ${results.length} treff totalt. Prøv å spesifisere spørsmålet for mer presise svar.*`;
    }

    return respondStream(answer);
  } catch (e) {
    console.error("site-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Ukjent feil" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function respondStream(text: string) {
  const chunks = text.match(/.{1,30}/gs) || [text];
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        const payload = JSON.stringify({ choices: [{ delta: { content: chunk } }] });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
  });
}

function getFaqData() {
  return [
    { q: "Hva koster en regnskapsfører?", a: "Hos Avargo starter prisene fra 1 499 kr/mnd for nyoppstartede selskaper. Alt er inkludert i fastprisen — bokføring, årsregnskap, skattemelding, MVA-rapportering og rådgivning." },
    { q: "Hvordan bytter jeg regnskapsfører?", a: "Å bytte regnskapsfører tar vanligvis 2-4 uker. Kontakt oss, vi håndterer alt det praktiske inkludert oppsigelsesbrev til din nåværende regnskapsfører." },
    { q: "Hva er A-melding?", a: "A-meldingen er en månedlig rapportering til Skatteetaten, NAV og SSB med opplysninger om lønn, skattetrekk, arbeidsgiveravgift og arbeidsforhold. Frist: 5. i måneden etter utbetaling." },
    { q: "Når er fristen for skattemeldingen?", a: "For AS: 31. mai. For ENK: 30. april. MVA-rapportering har frist annenhver måned (10. i måneden etter termin)." },
    { q: "Hva er forskjellen mellom lønn og utbytte?", a: "Lønn beskattes med inntektsskatt (opptil 47,4%) og arbeidsgiveravgift (14,1%). Utbytte beskattes etter aksjonærmodellen med ca. 37,84% effektiv skattesats." },
    { q: "Hva er MVA-plikt?", a: "Du blir MVA-pliktig når omsetningen overstiger 50 000 kr i løpet av en 12-månedersperiode. Du må da kreve inn 25% MVA og rapportere annenhver måned." },
    { q: "Hva er OTP?", a: "Obligatorisk tjenestepensjon krever at alle bedrifter med minst én ansatt sparer minimum 2% av lønn mellom 1G og 12G til pensjon." },
    { q: "Hvordan stifter jeg et AS?", a: "Du trenger minimum 30 000 kr i aksjekapital, stiftelsesdokument med vedtekter, og registrering i Foretaksregisteret via Altinn. Prosessen tar 1-3 virkedager." },
    { q: "Hva er et holdingselskap?", a: "Et holdingselskap eier aksjer i andre selskaper. Gjennom fritaksmetoden er utbytte og gevinst fra datterselskaper tilnærmet skattefritt." },
    { q: "Hva er CFO-as-a-Service?", a: "CFO-as-a-Service gir tilgang til strategisk finansiell ledelse uten å ansette en CFO på heltid. Inkluderer budsjettering, scenarioanalyse og beslutningsstøtte." },
    { q: "Hva er SkatteFUNN?", a: "SkatteFUNN gir 19% skattefradrag for FoU-kostnader opptil 25 MNOK per år. Gjelder alle norske bedrifter uavhengig av størrelse og bransje." },
    { q: "Hva tilbyr Avargo?", a: "Avargo tilbyr tjenester innen fire områder: Regnskap & Økonomi, HR & Personal, Markedsføring & Vekst, og IT & Utvikling. Vi har også 130+ kurs og en karriereportal." },
    { q: "Hva er Avargo Fri?", a: "Avargo Fri er vår fleksible arbeidsmodell som gir ansatte frihet til å jobbe når og hvor de vil, med fokus på resultater fremfor timer." },
  ];
}
