import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-zæøå0-9\s]/g, "").trim();
}

interface ScoredResult {
  source: string;
  title: string;
  snippet: string;
  score: number;
  downloadUrl?: string;
  fileName?: string;
}

function scoreText(query: string, ...fields: (string | null | undefined)[]): number {
  const q = normalize(query);
  const words = q.split(/\s+/).filter(w => w.length > 1);
  let score = 0;
  for (const field of fields) {
    if (!field) continue;
    const f = normalize(field);
    if (f.includes(q)) score += 50;
    for (const word of words) {
      if (f.includes(word)) score += 5;
    }
  }
  return score;
}

function extractSnippet(content: string, query: string, maxLen = 400): string {
  const plain = (content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return "(Ingen innhold)";
  const q = normalize(query);
  const words = q.split(/\s+/).filter(w => w.length > 1);
  const lower = plain.toLowerCase();

  let bestIdx = 0;
  let bestScore = 0;
  for (const word of words) {
    const idx = lower.indexOf(word);
    if (idx >= 0) {
      const start = Math.max(0, idx - 150);
      const end = Math.min(plain.length, idx + 300);
      const region = lower.slice(start, end);
      let s = 0;
      for (const w of words) if (region.includes(w)) s++;
      if (s > bestScore) { bestScore = s; bestIdx = Math.max(0, idx - 80); }
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
      return respondStream("Hei! Jeg er Ava. Still meg et spørsmål, så søker jeg gjennom hele oppslagsverket for deg. 📚");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Fetch all sources in parallel
    const [hmsRes, internalRes, archiveRes, knowledgeRes, hrHandbookRes, collabRes] = await Promise.all([
      sb.from("hms_documents").select("title, content"),
      sb.from("internal_resources").select("title, description, category, file_name, file_url"),
      sb.from("archive_files").select("name, description, category, file_name, file_url").eq("active", true),
      sb.from("knowledge_materials").select("title, content, category").eq("active", true),
      sb.from("hr_handbook").select("title, content, sort_order").order("sort_order"),
      sb.from("collaboration_agreements").select("title, company, contact_name, offering, description"),
    ]);

    const results: ScoredResult[] = [];

    // HMS documents
    for (const doc of hmsRes.data || []) {
      const s = scoreText(lastMessage, doc.title, doc.content);
      if (s > 0) results.push({
        source: "HMS-håndbok", title: doc.title, score: s,
        snippet: extractSnippet(doc.content || "", lastMessage),
      });
    }

    // Internal resources
    for (const doc of internalRes.data || []) {
      const s = scoreText(lastMessage, doc.title, doc.description, doc.category);
      if (s > 0) results.push({
        source: "Intern ressurs", title: doc.title, score: s,
        snippet: doc.description || doc.category || "",
        fileName: doc.file_name || undefined,
      });
    }

    // Archive files
    for (const doc of archiveRes.data || []) {
      const s = scoreText(lastMessage, doc.name, doc.description, doc.category);
      if (s > 0) results.push({
        source: "Arkiv", title: doc.name, score: s,
        snippet: doc.description || doc.category || "",
        downloadUrl: doc.file_url || undefined,
        fileName: doc.file_name || undefined,
      });
    }

    // Knowledge materials
    for (const doc of knowledgeRes.data || []) {
      const s = scoreText(lastMessage, doc.title, doc.content, doc.category);
      if (s > 0) results.push({
        source: `Datasenter (${doc.category || "Generelt"})`, title: doc.title, score: s,
        snippet: extractSnippet(doc.content || "", lastMessage),
      });
    }

    // HR handbook
    for (const doc of hrHandbookRes.data || []) {
      const s = scoreText(lastMessage, doc.title, doc.content);
      if (s > 0) results.push({
        source: "Personalhåndbok", title: doc.title, score: s,
        snippet: extractSnippet(doc.content || "", lastMessage),
      });
    }

    // Collaboration agreements
    for (const doc of collabRes.data || []) {
      const s = scoreText(lastMessage, doc.title, doc.company, doc.offering, doc.description);
      if (s > 0) results.push({
        source: "Samarbeidsavtale", title: doc.title, score: s,
        snippet: [doc.company, doc.offering, doc.description].filter(Boolean).join(" — "),
      });
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    if (results.length === 0) {
      return respondStream(`Jeg fant dessverre ingen treff for «${lastMessage}» i oppslagsverket. Prøv å formulere spørsmålet annerledes, eller kontakt en kollega for hjelp.`);
    }

    // Build response
    const topResults = results.slice(0, 5);
    let answer = `**Søkeresultater for «${lastMessage}»:**\n\n`;

    for (const r of topResults) {
      answer += `### 📄 ${r.title}\n`;
      answer += `*Kilde: ${r.source}*\n\n`;
      answer += `${r.snippet}\n`;
      if (r.downloadUrl) {
        answer += `\n[📥 Last ned ${r.fileName || "fil"}](${r.downloadUrl})\n`;
      }
      answer += "\n---\n\n";
    }

    if (results.length > 5) {
      answer += `*${results.length - 5} flere treff ble funnet. Prøv å presisere søket for mer spesifikke resultater.*`;
    }

    return respondStream(answer);
  } catch (e) {
    console.error("knowledge-base error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Ukjent feil" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function respondStream(text: string) {
  const chunks = text.match(/.{1,25}/gs) || [text];
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
