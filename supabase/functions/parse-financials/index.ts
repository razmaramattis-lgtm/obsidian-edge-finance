import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify caller is admin
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const { data: isAdmin } = await supabase.rpc("is_admin", { uid: user.id });
    if (!isAdmin) throw new Error("Admin only");

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const companyId = formData.get("company_id") as string;
    const period = formData.get("period") as string;

    if (!file || !companyId || !period) {
      throw new Error("Missing file, company_id, or period");
    }

    // Read file content
    const bytes = await file.arrayBuffer();
    const text = new TextDecoder().decode(bytes);

    // Use Lovable AI to parse the financial data
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("Missing LOVABLE_API_KEY");

    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Du er en regnskapsekspert. Analyser vedlagt fil og ekstraher følgende tall:
- revenue (total inntekter / omsetning)
- costs (total kostnader / driftskostnader)
- result (resultat / overskudd/underskudd)
- equity (egenkapital)
- assets (eiendeler / sum eiendeler)
- liabilities (gjeld / sum gjeld)

Svar BARE med JSON i dette formatet, ingen annen tekst:
{"revenue": 0, "costs": 0, "result": 0, "equity": 0, "assets": 0, "liabilities": 0}

Dersom du ikke finner et tall, bruk 0. Tall skal være i norske kroner uten desimaler.
Husk at resultat = inntekter - kostnader. Eiendeler = egenkapital + gjeld.`
          },
          {
            role: "user",
            content: `Her er innholdet fra filen "${file.name}" for perioden ${period}:\n\n${text.substring(0, 15000)}`
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", errText);
      throw new Error("Kunne ikke analysere filen med AI");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Extract JSON from the AI response
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error("Kunne ikke lese tall fra filen. Prøv et annet format.");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Store the original file
    const filePath = `customer-docs/${companyId}/${Date.now()}-${file.name}`;
    await supabase.storage.from("internal-docs").upload(filePath, bytes, {
      contentType: file.type,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          revenue: Number(parsed.revenue) || 0,
          costs: Number(parsed.costs) || 0,
          result: Number(parsed.result) || 0,
          equity: Number(parsed.equity) || 0,
          assets: Number(parsed.assets) || 0,
          liabilities: Number(parsed.liabilities) || 0,
        },
        file_path: filePath,
        file_name: file.name,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("parse-financials error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
