import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Corrected Fiken glossary slugs
const ALL_SLUGS = [
  "a-konto","a-og-b-aksjer","a-melding","agio","aida-modellen","aksje","aksjebevis",
  "aksjeeierbok","aksjekapital","aksjesplitt","aksjonaer","aksjonaeravtale",
  "aksjonaermodellen","aksjonaerregisteret","aksjonaerregisteroppgave","aktiva",
  "aktivering","alminnelig-inntekt","amortisering","anleggsmidler",
  "ansattutlegg","ansiennitet","anskaffelseskost","ansvarlig-selskap",
  "arbeidsgiver","arbeidsgiveravgift","arbeidskapital","arbeidskontrakt",
  "avanse","avkastning","avsetning","avskrivning",
  "balanse","bankgaranti","bedriftskonto","bilag","bokforing","bokforingsloven",
  "brutto","bruttofortjeneste","bruttolonn","budsjett",
  "cash-flow","daglig-leder","debet","dekningsbidrag",
  "driftsinntekter","driftskostnader","driftsresultat",
  "efaktura","egenkapital","eiendeler","emisjon","enk","enkeltpersonforetak",
  "feriepenger","firmabil","fond","fordring",
  "foretaksregisteret","forretningsplan","forskuddsskatt","fradrag",
  "fremmedkapital","frikort","fullmakt","fusjon",
  "generalforsamling","gjeld","goodwill",
  "holdingselskap","hovedbok",
  "immaterielle-eiendeler","indirekte-kostnader","inflasjon",
  "inntekt","investering",
  "juridisk-person",
  "kapitalforhoeyelse","kapitalnedsettelse","kassekreditt",
  "konkurs","kostnad","kostpris","kredit","kreditnota","kreditor",
  "kredittvurdering","kurtasje","kvittering",
  "leasing","likviditet","likviditetsbudsjett","lonn",
  "merverdiavgift","moms","morselskap","morarente",
  "mva-melding","mva-registrering",
  "netto","noter",
  "omlopsmidler","omsetning","oppgjor",
  "opptjent-egenkapital","organisasjonsnummer","overkurs","overskudd",
  "periodisering","profitt","prokura","purring",
  "regnskap","regnskapsforer","regnskapskonto","regnskapsloven",
  "rente","representasjon","restskatt","resultat","resultatregnskap",
  "revisjon","revisor","royalty",
  "salg","sammenstillingsprinsippet",
  "selvangivelse","skatt","skattemelding",
  "soliditet","styrehonorar","styreleder","styre",
  "sykepenger","totalkapitalrentabilitet","transaksjon",
  "utbytte","varekostnad","varelager","vederlag","verdipapir","virksomhet",
  "arsregnskap","arsoppgjor","arsresultat","faktura",
  "god-regnskapsskikk","kontantprinsippet","palydende",
  "regnskapsplikt","driftsinntekt","direkte-kostnader"
];

function extractContent(html: string): { title: string; text: string } | null {
  // Check for 404
  if (html.includes("Beklager plunder og heft") || html.includes("fant visst ikke")) return null;

  // Extract og:title or <title>
  const ogT = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const tTag = html.match(/<title>([^<]+)<\/title>/i);
  let title = ogT?.[1] || h1?.[1]?.trim() || tTag?.[1]?.replace(/\s*[-–|].*/, "").trim() || "";
  title = title.replace(/&amp;/g, "&").replace(/&#\d+;/g, "").replace(/ - Fiken.*/, "").trim();

  // Extract og:description or meta description
  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
  const metaDesc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  const description = ogDesc?.[1] || metaDesc?.[1] || "";

  // Try to get structured content from JSON-LD
  const jsonLdMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  let jsonLdText = "";
  if (jsonLdMatch) {
    try {
      const ld = JSON.parse(jsonLdMatch[1]);
      if (ld.articleBody) jsonLdText = ld.articleBody;
      if (ld.description && !description) jsonLdText = ld.description;
    } catch {}
  }

  // Extract main content from HTML
  let c = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "");

  // Find article/main
  const m = c.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
            c.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
            c.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (m) c = m[1];

  // HTML to markdown-like text
  c = c
    .replace(/<h1[^>]*>/gi, "\n# ").replace(/<\/h1>/gi, "\n")
    .replace(/<h2[^>]*>/gi, "\n## ").replace(/<\/h2>/gi, "\n")
    .replace(/<h3[^>]*>/gi, "\n### ").replace(/<\/h3>/gi, "\n")
    .replace(/<h[4-6][^>]*>/gi, "\n#### ").replace(/<\/h[4-6]>/gi, "\n")
    .replace(/<p[^>]*>/gi, "\n").replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ").replace(/<\/li>/gi, "")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, "$2")
    .replace(/<strong[^>]*>([^<]*)<\/strong>/gi, "**$1**")
    .replace(/<b>([^<]*)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>([^<]*)<\/em>/gi, "*$1*")
    .replace(/<i>([^<]*)<\/i>/gi, "*$1*")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#\d+;/g, "")
    .replace(/\n{3,}/g, "\n\n").trim();

  // Remove promo
  for (const p of ["Superenkelt regnskap for", "Prøv Fiken gratis", "Med Fiken er det superenkelt", "Allerede registrert?"]) {
    const idx = c.indexOf(p);
    if (idx > 0) c = c.substring(0, idx).trim();
  }

  // Use best available content
  let finalContent = "";
  if (c.length > 100) {
    finalContent = c;
  } else if (jsonLdText.length > 50) {
    finalContent = jsonLdText;
  } else if (description.length > 30) {
    finalContent = description;
  }

  if (!title || finalContent.length < 30) return null;
  return { title, text: finalContent };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    console.log(`Scraping ${ALL_SLUGS.length} Fiken terms...`);

    const BATCH_SIZE = 5;
    const results: { title: string; content: string }[] = [];
    const errors: string[] = [];

    for (let i = 0; i < ALL_SLUGS.length; i += BATCH_SIZE) {
      const batch = ALL_SLUGS.slice(i, i + BATCH_SIZE);
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} (${results.length} ok)`);

      const fetches = batch.map(async (slug) => {
        try {
          const res = await fetch(`https://fiken.no/forklarer/${slug}`, {
            headers: { "Accept": "text/html" },
          });
          if (!res.ok) { errors.push(slug); return null; }
          const html = await res.text();
          const parsed = extractContent(html);
          if (!parsed) { errors.push(slug); return null; }
          return { title: parsed.title, content: `# ${parsed.title}\n\n${parsed.text}` };
        } catch {
          errors.push(slug);
          return null;
        }
      });

      const batchResults = await Promise.all(fetches);
      results.push(...batchResults.filter(Boolean) as any);

      if (i + BATCH_SIZE < ALL_SLUGS.length) {
        await new Promise(r => setTimeout(r, 400));
      }
    }

    console.log(`Done: ${results.length} ok, ${errors.length} errors`);
    if (errors.length > 0) console.log("Failed slugs:", errors.join(", "));

    // Delete existing and insert fresh
    await sb.from("knowledge_materials").delete().eq("category", "Fiken Ordbok");

    for (let i = 0; i < results.length; i += 50) {
      const batch = results.slice(i, i + 50).map((r, idx) => ({
        title: r.title,
        content: r.content,
        category: "Fiken Ordbok",
        active: true,
        sort_order: i + idx,
      }));
      const { error } = await sb.from("knowledge_materials").insert(batch);
      if (error) console.error("Insert error:", error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: results.length,
        failed: errors.length,
        failed_slugs: errors,
        sample: results.slice(0, 3).map(r => ({ title: r.title, preview: r.content.substring(0, 100) })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
