import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Complete list of Fiken glossary slugs (extracted from fiken.no/forklarer)
const ALL_SLUGS = [
  "a-konto","a-og-b-aksjer","a-melding","agio","aida-modellen","aksje","aksjebevis",
  "aksjeeierbok","aksjekapital","aksjesplitt","aksjonaer","aksjonaeravtale",
  "aksjonaermodellen","aksjonaerregisteret","aksjonaerregisteroppgave","aktiva",
  "aktivering","aksjonaerlaan","aksjonaerutbytte","alminnelig-inntekt",
  "amortisering","anbud","andre-driftsinntekter","andre-driftskostnader",
  "anleggsmidler","annuitetslaan","ansattutlegg","ansiennitet","anskaffelseskost",
  "ansvarlig-selskap","arbeidsgiver","arbeidsgiveravgift","arbeidskapital",
  "arbeidskontrakt","arbeidstaker","avanse","avdrag","avgift","avkastning",
  "avskriving","avsetning","avvikling","balanse","bankgaranti","bedriftskonto",
  "betalingsbetingelser","betalingsforpliktelse","bilag","bokforing",
  "bokforingsloven","bokfort-verdi","bransje","brutto","bruttofortjeneste",
  "bruttolonn","bruttoomsetning","budsjett","bytte","cash-flow",
  "daglig-leder","debet","dekningsbidrag","delingsmodellen","delvis-mva-fradrag",
  "depositum","differensiert-arbeidsgiveravgift","direkte-kostnader","disponering",
  "dividende","driftsinntekter","driftskostnader","driftsmargin","driftsresultat",
  "ebitda","efaktura","egenkapital","eiendeler","ekstraordinaere-poster",
  "emisjon","emisjonskurs","enk","enkeltpersonforetak","epostfaktura",
  "etterbetaling","ettergivelse",
  "feriepenger","ferietillegg","fifo","finansiell-leasing","finansinntekter",
  "finanskostnader","firmabil","fisjon","fond","fordring","foretak",
  "foretaksregisteret","forfall","forhandlingsplikt","forlik","forretningsplan",
  "forsikring","forskuddsbetaling","forskuddsskatt","fortrinnsrett","fradrag",
  "fremmedkapital","fri-egenkapital","frikort","frivillig-mva-registrering",
  "fullmakt","fusjon","fysisk-inventar",
  "garanti","generalforsamling","gjeld","gjeldsbrev","goodwill","grunnkapital",
  "gjeldsgrad",
  "halvaarlig-mva","handelsregister","holdingselskap","hovedbok","husleie",
  "immaterielle-eiendeler","indirekte-kostnader","inflasjon","innberetning",
  "innkjopspris","innovasjon-norge","inntekt","inntektsskatt","insolvent",
  "investering","ipo",
  "journal","juridisk-person",
  "kalkulasjon","kapitalforhoeyelse","kapitalnedsettelse","kassekreditt",
  "kjopesumsvurdering","klientmidler","kommandittselskap","kompensasjon",
  "kongruensprinsippet","konkurs","konto","kontoplan","kontroll","konvertibelt-laan",
  "kostnad","kostpris","kredit","kreditnota","kreditor","kredittvurdering","kurs",
  "kurtasje","kvittering",
  "leasing","levering","leverandoer","leverandoergjeld","lifo","likviditet",
  "likviditetsbudsjett","loennsinnberetning","loennstrekk","lonn","lonnslipp",
  "loepende-kostnader",
  "merverdiavgift","minoritetsinteresser","moms","morselskap","morarente",
  "mva-kompensasjon","mva-melding","mva-pliktig","mva-registrering","mva-satser",
  "nedskriving","netto","nettolonn","nettoomsetning","nominell-verdi","noter",
  "nullmva",
  "obligasjon","omlopsmidler","omsetning","operasjonell-leasing","oppgjor",
  "opptjent-egenkapital","opsjoner","ordinaert-resultat","organisasjonsnummer",
  "overkurs","overskudd",
  "paalydende","panterett","passiva","periodisering","person","personalkostnader",
  "portefolje","premie","primaerdokumentasjon","produktivitet","profitt",
  "proforma","prokura","prosent","purring",
  "regnskap","regnskapsforer","regnskapskonto","regnskapsloven","regnskapspliktig",
  "regnskapsprinsipp","regnskapsstandard","regnskapsar","reklamasjon",
  "rekvisisjon","rentabilitet","rente","renteinntekt","rentekostnad",
  "representasjon","restskatt","resultat","resultatregnskap","revisjon","revisor",
  "risiko","royalty",
  "saldoavskriving","saldoblanse","salg","salgsinntekt","sammenstillingsprinsippet",
  "selskap","selvangivelse","skatt","skattemelding","skatteoppgjor","sktattepliktig",
  "sluttavregning","soliditet","solvensvurdering","sperrekonto","spesifikasjon",
  "standardkost","startkapital","stiftelsesdokument","styre","styrehonorar",
  "styreleder","stoenad","stiftelse","subsidier","sum","sykepenger",
  "tapsavsetning","terminoppgjor","tilbakebetaling","tilbakefoering",
  "tilleggsavgift","tilleggsskatt","tilskudd","totalkapitalrentabilitet",
  "transaksjon","trekkplikt",
  "underskudd","utbytte","utdeling","utestaaende-fordringer","utlegg",
  "varebeholdning","varekostnad","varelager","vederlag","veksel",
  "verdipapir","verdsettelse","virksomhet","vurderingsprinsipp",
  "aarsoppgjor","aarsregnskap","aarsresultat","faktura","inngaaende-balanse",
  "utgaaende-balanse","bilagsfoering","dagbok","kontantprinsippet",
  "opptjeningsprinsippet","transaksjonsprinsippet","forsiktighetsprinsippet",
  "god-regnskapsskikk","bokforingsforskriften"
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    console.log(`Scraping ${ALL_SLUGS.length} Fiken glossary terms...`);

    const BATCH_SIZE = 10;
    const results: { title: string; content: string; slug: string }[] = [];
    const errors: string[] = [];

    for (let i = 0; i < ALL_SLUGS.length; i += BATCH_SIZE) {
      const batch = ALL_SLUGS.slice(i, i + BATCH_SIZE);
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ALL_SLUGS.length / BATCH_SIZE)} (${results.length} ok, ${errors.length} errors)`);

      const fetches = batch.map(async (slug) => {
        try {
          const res = await fetch(`https://fiken.no/forklarer/${slug}`, {
            headers: { "User-Agent": "Mozilla/5.0" },
          });
          if (!res.ok) { errors.push(slug); return null; }
          const html = await res.text();

          // Check for 404 / not found
          if (html.includes("Beklager plunder og heft") || html.includes("fant visst ikke")) {
            errors.push(slug);
            return null;
          }

          // Extract title
          const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
          const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
          let title = h1Match?.[1]?.trim() || titleMatch?.[1]?.replace(/\s*[-–|].*/, "").trim() || slug;
          title = title.replace(/&amp;/g, "&").replace(/&#\d+;/g, "").trim();

          // Remove non-content elements
          let content = html
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/<nav[\s\S]*?<\/nav>/gi, "")
            .replace(/<header[\s\S]*?<\/header>/gi, "")
            .replace(/<footer[\s\S]*?<\/footer>/gi, "");

          const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                              content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
          if (articleMatch) content = articleMatch[1];

          // Convert HTML to text
          content = content
            .replace(/<h[1-6][^>]*>/gi, "\n## ")
            .replace(/<\/h[1-6]>/gi, "\n")
            .replace(/<p[^>]*>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<li[^>]*>/gi, "\n- ")
            .replace(/<\/li>/gi, "")
            .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, "$2")
            .replace(/<strong[^>]*>([^<]*)<\/strong>/gi, "**$1**")
            .replace(/<em[^>]*>([^<]*)<\/em>/gi, "*$1*")
            .replace(/<[^>]+>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&nbsp;/g, " ")
            .replace(/&#\d+;/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

          // Remove Fiken promo
          for (const promo of ["Superenkelt regnskap for små bedrifter", "Prøv Fiken gratis", "Med Fiken er det superenkelt"]) {
            const idx = content.indexOf(promo);
            if (idx > 0) content = content.substring(0, idx).trim();
          }

          if (content.length > 50) {
            return { title, content: `# ${title}\n\n${content}`, slug };
          }
          errors.push(slug);
          return null;
        } catch {
          errors.push(slug);
          return null;
        }
      });

      const batchResults = await Promise.all(fetches);
      results.push(...batchResults.filter(Boolean) as any);

      if (i + BATCH_SIZE < ALL_SLUGS.length) {
        await new Promise(r => setTimeout(r, 300));
      }
    }

    console.log(`Done: ${results.length} ok, ${errors.length} errors`);

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
        sample: results.slice(0, 5).map(r => r.title),
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
