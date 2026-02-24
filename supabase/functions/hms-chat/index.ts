import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-zæøå0-9\s]/g, "").trim();
}

function scoreMatch(query: string, title: string, content: string): number {
  const q = normalize(query);
  const words = q.split(/\s+/).filter(w => w.length > 1);
  const t = normalize(title);
  const c = normalize(content);
  let score = 0;

  // Exact phrase match in title = highest
  if (t.includes(q)) score += 100;
  // Exact phrase match in content
  if (c.includes(q)) score += 50;

  for (const word of words) {
    if (t.includes(word)) score += 20;
    if (c.includes(word)) score += 5;
  }
  return score;
}

function extractSnippet(content: string, query: string, maxLen = 600): string {
  const q = normalize(query);
  const words = q.split(/\s+/).filter(w => w.length > 1);
  // Strip HTML
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const lower = plain.toLowerCase();

  // Find best position
  let bestIdx = 0;
  let bestScore = 0;
  for (const word of words) {
    const idx = lower.indexOf(word);
    if (idx >= 0 && idx < lower.length) {
      // Count surrounding word matches
      const start = Math.max(0, idx - 200);
      const end = Math.min(plain.length, idx + 400);
      const region = lower.slice(start, end);
      let s = 0;
      for (const w of words) if (region.includes(w)) s++;
      if (s > bestScore) { bestScore = s; bestIdx = Math.max(0, idx - 100); }
    }
  }

  const snippet = plain.slice(bestIdx, bestIdx + maxLen);
  return snippet + (bestIdx + maxLen < plain.length ? "…" : "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const lastMessage = messages?.filter((m: any) => m.role === "user").pop()?.content || "";

    if (!lastMessage.trim()) {
      return respondJson({ answer: "Vennligst skriv et spørsmål om HMS-håndboken." });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);
    const { data: hmsDocs } = await sb.from("hms_documents").select("title, content, sort_order").order("sort_order");

    if (!hmsDocs || hmsDocs.length === 0) {
      return respondStream("Jeg finner ingen HMS-dokumenter i databasen akkurat nå. Kontakt administrator.");
    }

    // Score and rank
    const scored = hmsDocs.map(doc => ({
      ...doc,
      score: scoreMatch(lastMessage, doc.title, doc.content || ""),
    })).filter(d => d.score > 0).sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      return respondStream(`Jeg fant dessverre ingen relevante kapitler i HMS-håndboken for «${lastMessage}». Prøv å søke med andre ord, eller bla gjennom kapitlene direkte.`);
    }

    // Take top results (max 3)
    const topResults = scored.slice(0, 3);

    let answer = `**Funn i HMS-håndboken for «${lastMessage}»:**\n\n`;
    for (const doc of topResults) {
      const snippet = extractSnippet(doc.content || "", lastMessage);
      answer += `### 📄 ${doc.title}\n`;
      answer += `${snippet}\n\n`;
    }

    if (scored.length > 3) {
      answer += `\n*Ytterligere ${scored.length - 3} kapitler hadde treff. Prøv å presisere søket for mer spesifikke resultater.*`;
    }

    return respondStream(answer);
  } catch (e) {
    console.error("hms-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Ukjent feil" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function respondJson(data: any) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function respondStream(text: string) {
  // Simulate SSE stream format for compatibility with frontend
  const chunks = text.match(/.{1,20}/gs) || [text];
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
