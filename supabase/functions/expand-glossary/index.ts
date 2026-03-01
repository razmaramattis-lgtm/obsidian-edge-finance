import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const url = new URL(req.url);
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const limit = parseInt(url.searchParams.get("limit") || "5");

  const { data: terms, error } = await supabase
    .from("glossary_terms")
    .select("id, term, slug, description")
    .eq("active", true)
    .order("term", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const shortTerms = (terms || []).filter(t => !t.description || t.description.length < 2000);
  const results: { term: string; status: string; wordCount?: number }[] = [];

  for (const term of shortTerms) {
    try {
      const prompt = `Du er en ekspert på norsk regnskap, økonomi og næringsliv. Skriv en grundig, pedagogisk og SEO-optimalisert forklaring av begrepet "${term.term}" som brukes i norsk regnskap og økonomi.

KRAV:
- Skriv mellom 600 og 1000 ord
- Skriv på norsk bokmål
- Start med en klar definisjon av begrepet (2-3 setninger)
- Forklar begrepet i detalj med praktiske eksempler
- Inkluder relevante lovhenvisninger (bokføringsloven, regnskapsloven, skatteloven etc.) der det passer
- Forklar hvorfor begrepet er viktig for bedriftseiere og regnskapsførere
- Inkluder konkrete eksempler fra daglig drift av en norsk bedrift
- Bruk underoverskrifter med ** for å strukturere teksten
- Avslutt med en kort oppsummering
- Skriv i en profesjonell men tilgjengelig tone som gjør fagstoff forståelig
- IKKE bruk markdown-overskrifter (#), bruk ** for uthevinger og underoverskrifter
- Skriv KUN forklaringen, ingen innledende setninger som "Her er forklaringen"

Eksisterende kort beskrivelse for kontekst: "${term.description || ''}"`;

      // Use Gemini REST API directly via generativelanguage.googleapis.com
      const googleApiKey = Deno.env.get("GOOGLE_API_KEY");
      
      let content = "";
      
      if (googleApiKey) {
        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 4000, temperature: 0.7 },
            }),
          }
        );

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          throw new Error(`Gemini ${aiResponse.status}: ${errText.substring(0, 300)}`);
        }

        const data = await aiResponse.json();
        content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        // Fallback: try Lovable AI
        const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
        const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 4000,
          }),
        });

        if (!aiResponse.ok) throw new Error(`AI ${aiResponse.status}`);
        const data = await aiResponse.json();
        content = data.choices?.[0]?.message?.content || "";
      }

      if (!content) throw new Error("No content generated");

      const wordCount = content.split(/\s+/).length;
      await supabase.from("glossary_terms").update({ description: content }).eq("id", term.id);
      results.push({ term: term.term, status: "ok", wordCount });
    } catch (err) {
      results.push({ term: term.term, status: `error: ${err.message}` });
    }
  }

  return new Response(
    JSON.stringify({ processed: results.length, offset, limit, results }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
