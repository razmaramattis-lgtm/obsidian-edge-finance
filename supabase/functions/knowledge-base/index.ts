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

function extractSnippet(content: string, query: string, maxLen = 600): string {
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

function limitWords(text: string, max = 200): string {
  const words = text.split(/\s+/);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ") + "…";
}

// Category keys map to database sources
const CATEGORY_SOURCES: Record<string, string[]> = {
  kontoplan: ["account_entries"],
  regnskapsord: ["glossary_terms"],
  dokumentmaler: ["document_templates", "archive_files"],
  arkiv: ["archive_files", "internal_resources"],
  datasenter: ["knowledge_materials"],
  hms: ["hms_documents"],
  personalhandbok: ["hr_handbook"],
  samarbeidsavtaler: ["collaboration_agreements"],
  alt: ["account_entries", "glossary_terms", "document_templates", "archive_files", "internal_resources", "knowledge_materials", "hms_documents", "hr_handbook", "collaboration_agreements"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { messages, category, action, search_term, preferred_account, document_override } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Handle account override action
    if (action === "set_override" && search_term && preferred_account) {
      const { error } = await sb.from("ava_account_overrides").upsert(
        { search_term: normalize(search_term), preferred_account_number: preferred_account },
        { onConflict: "search_term" }
      );
      if (error) throw error;
      return respondStream(`✅ Lagret! Neste gang du søker på «${search_term}» viser jeg konto **${preferred_account}** først.`);
    }

    // Handle document override action
    if (action === "set_document_override" && search_term && document_override) {
      const { error } = await sb.from("ava_document_overrides").upsert(
        {
          search_term: normalize(search_term),
          document_title: document_override.title,
          document_url: document_override.url || null,
          file_name: document_override.file_name || null,
          source_table: document_override.source || null,
        },
        { onConflict: "search_term" }
      );
      if (error) throw error;
      return respondStream(`✅ Lagret! Neste gang noen søker på «${search_term}» viser jeg dokumentet **${document_override.title}** med nedlasting.`);
    }

    // Handle listing available documents for linking
    if (action === "list_documents") {
      const [archRes, intRes, tmplRes, glossRes] = await Promise.all([
        sb.from("archive_files").select("name, file_url, file_name, category").order("name"),
        sb.from("internal_resources").select("title, file_url, file_name, category").order("title"),
        sb.from("document_templates").select("title, category").eq("active", true).order("title"),
        sb.from("glossary_terms").select("term, description, slug").eq("active", true).order("term"),
      ]);
      const docs: { title: string; url?: string; file_name?: string; source: string; category?: string; description?: string }[] = [];
      for (const d of archRes.data || []) docs.push({ title: d.name, url: d.file_url, file_name: d.file_name, source: "archive_files", category: d.category });
      for (const d of intRes.data || []) docs.push({ title: d.title, url: d.file_url, file_name: d.file_name, source: "internal_resources", category: d.category });
      for (const d of tmplRes.data || []) docs.push({ title: d.title, source: "document_templates", category: d.category });
      for (const d of glossRes.data || []) docs.push({ title: d.term, source: "glossary_terms", category: "Regnskapsord", description: (d.description || "").slice(0, 100) });
      return new Response(JSON.stringify({ documents: docs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lastMessage = messages?.filter((m: any) => m.role === "user").pop()?.content || "";

    if (!lastMessage.trim()) {
      return respondStream("Hei! Jeg er Ava. Velg en kategori og still meg et spørsmål — jeg finner frem det du trenger. 📚");
    }

    const cat = category || "alt";
    const sources = CATEGORY_SOURCES[cat] || CATEGORY_SOURCES["alt"];

    // Build parallel queries based on selected sources
    const queries: Record<string, Promise<any>> = {};
    if (sources.includes("hms_documents")) queries.hms = sb.from("hms_documents").select("title, content");
    if (sources.includes("internal_resources")) queries.internal = sb.from("internal_resources").select("title, description, category, file_name, file_url");
    if (sources.includes("archive_files")) queries.archive = sb.from("archive_files").select("name, description, category, file_name, file_url, file_size");
    if (sources.includes("knowledge_materials")) queries.knowledge = sb.from("knowledge_materials").select("title, content, category").eq("active", true);
    if (sources.includes("hr_handbook")) queries.hr = sb.from("hr_handbook").select("title, content, sort_order").order("sort_order");
    if (sources.includes("collaboration_agreements")) queries.collab = sb.from("collaboration_agreements").select("title, company, contact_name, offering, description");
    if (sources.includes("glossary_terms")) queries.glossary = sb.from("glossary_terms").select("term, description, slug").eq("active", true);
    if (sources.includes("document_templates")) queries.templates = sb.from("document_templates").select("title, description, category, content").eq("active", true);
    if (sources.includes("account_entries")) queries.accounts = sb.from("account_entries").select("account_number, name, description, category_group, examples, mva_status, tags").eq("active", true);

    const keys = Object.keys(queries);
    const responses = await Promise.all(Object.values(queries));
    const dataMap: Record<string, any[]> = {};
    keys.forEach((k, i) => { dataMap[k] = responses[i].data || []; });

    const results: ScoredResult[] = [];

    // HMS
    for (const doc of dataMap.hms || []) {
      const s = scoreText(lastMessage, doc.title, doc.content);
      if (s > 0) results.push({ source: "HMS-håndbok", title: doc.title, score: s, snippet: extractSnippet(doc.content || "", lastMessage) });
    }
    // Internal resources
    for (const doc of dataMap.internal || []) {
      const s = scoreText(lastMessage, doc.title, doc.description, doc.category);
      if (s > 0) results.push({ source: "Intern ressurs", title: doc.title, score: s, snippet: doc.description || doc.category || "", downloadUrl: doc.file_url || undefined, fileName: doc.file_name || undefined });
    }
    // Archive — primary match on document name (the name set when saving)
    for (const doc of dataMap.archive || []) {
      const nameScore = scoreText(lastMessage, doc.name) * 3; // Triple weight on name
      const otherScore = scoreText(lastMessage, doc.description, doc.category, doc.file_name);
      const s = nameScore + otherScore;
      if (s > 0) results.push({ source: "Arkiv & Skjemaer", title: doc.name, score: s, snippet: doc.description || doc.category || "", downloadUrl: doc.file_url || undefined, fileName: doc.file_name || doc.name || undefined });
    }
    // Knowledge
    for (const doc of dataMap.knowledge || []) {
      const s = scoreText(lastMessage, doc.title, doc.content, doc.category);
      if (s > 0) results.push({ source: `Datasenter (${doc.category || "Generelt"})`, title: doc.title, score: s, snippet: extractSnippet(doc.content || "", lastMessage) });
    }
    // HR handbook
    for (const doc of dataMap.hr || []) {
      const s = scoreText(lastMessage, doc.title, doc.content);
      if (s > 0) results.push({ source: "Personalhåndbok", title: doc.title, score: s, snippet: extractSnippet(doc.content || "", lastMessage) });
    }
    // Collaboration
    for (const doc of dataMap.collab || []) {
      const s = scoreText(lastMessage, doc.title, doc.company, doc.offering, doc.description);
      if (s > 0) results.push({ source: "Samarbeidsavtale", title: doc.title, score: s, snippet: [doc.company, doc.offering, doc.description].filter(Boolean).join(" — ") });
    }
    // Glossary — show full description for richer results
    for (const doc of dataMap.glossary || []) {
      const s = scoreText(lastMessage, doc.term, doc.description);
      if (s > 0) {
        const fullDesc = (doc.description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        results.push({
          source: "Regnskapsord",
          title: doc.term,
          score: s,
          snippet: fullDesc || "(Ingen beskrivelse)",
          downloadUrl: doc.slug ? `/regnskapsord/${doc.slug}` : undefined,
          fileName: doc.slug ? `Les mer om ${doc.term}` : undefined,
        });
      }
    }
    // Document templates
    for (const doc of dataMap.templates || []) {
      const s = scoreText(lastMessage, doc.title, doc.description, doc.category, doc.content);
      if (s > 0) results.push({ source: "Dokumentmal", title: doc.title, score: s, snippet: doc.description || extractSnippet(doc.content || "", lastMessage, 200) });
    }
    // Account entries — check for override first
    const getAccountNum = (title: string) => parseInt(title.split("–")[0]?.trim() || "0", 10);

    // Fetch any saved override for this search term
    let overrideAccount: string | null = null;
    if (sources.includes("account_entries")) {
      const { data: ov } = await sb.from("ava_account_overrides")
        .select("preferred_account_number")
        .eq("search_term", normalize(lastMessage))
        .maybeSingle();
      if (ov) overrideAccount = ov.preferred_account_number;
    }

    for (const doc of dataMap.accounts || []) {
      const examplesStr = (doc.examples || []).join(", ");
      const tagsStr = (doc.tags || []).join(", ");
      let s = scoreText(lastMessage, doc.name, doc.account_number, doc.description, doc.category_group, examplesStr, tagsStr);
      if (s <= 0) continue;

      // If this account matches the override, boost it massively
      if (overrideAccount && doc.account_number === overrideAccount) {
        s += 10000;
      }

      // Prioritize 3000-9999 over 1000-2999
      const num = parseInt(doc.account_number, 10);
      if (num >= 3000 && num <= 9999) s += 20;
      if (num >= 1000 && num <= 2999) s -= 10;

      results.push({ source: "Kontohjelp", title: `${doc.account_number} – ${doc.name}`, score: s, snippet: doc.description || `Konto ${doc.account_number}: ${doc.name}. MVA: ${doc.mva_status}. ${examplesStr ? "Eksempler: " + examplesStr : ""}` });
    }

    // Check for document override
    const { data: docOverride } = await sb.from("ava_document_overrides")
      .select("document_title, document_url, file_name, source_table")
      .eq("search_term", normalize(lastMessage))
      .maybeSingle();

    if (docOverride) {
      const overrideResult: ScoredResult = {
        source: docOverride.source_table === "glossary_terms" ? "Regnskapsord (koblet)" : "Koblet dokument",
        title: docOverride.document_title,
        score: 99999,
        snippet: `Dette ${docOverride.source_table === "glossary_terms" ? "regnskapsordet" : "dokumentet"} er koblet til søkeordet «${lastMessage}».`,
      };
      if (docOverride.document_url) {
        overrideResult.downloadUrl = docOverride.document_url;
        overrideResult.fileName = docOverride.file_name || docOverride.document_title;
      }
      results.unshift(overrideResult);
    }

    results.sort((a, b) => b.score - a.score);

    if (results.length === 0) {
      const isDocSearchEmpty = ["dokumentmaler", "arkiv", "datasenter", "regnskapsord", "alt"].includes(cat);
      let noHitMsg = `Jeg fant dessverre ingen treff for «${lastMessage}» i ${cat === "alt" ? "oppslagsverket" : "denne kategorien"}. Prøv å formulere spørsmålet annerledes.`;
      if (isDocSearchEmpty) {
        noHitMsg += `\n[AVA_DOC_SEARCH:${lastMessage}]`;
      }
      return respondStream(noHitMsg);
    }

    // Always show best result explanation
    const best = results[0];
    const isGlossaryResult = best.source === "Regnskapsord";
    let answer = `### 📄 ${best.title}\n`;
    answer += `*Kilde: ${best.source}*\n\n`;
    answer += `${limitWords(best.snippet, isGlossaryResult ? 500 : 200)}\n`;
    if (best.downloadUrl && !isGlossaryResult) {
      answer += `\n[📥 Last ned ${best.fileName || "fil"}](${best.downloadUrl})\n`;
    }

    // For non-glossary results: show other matching results as tags
    if (!isGlossaryResult) {
      const otherResults = results.filter(r => r !== best).slice(0, 5);
      if (otherResults.length > 0) {
        answer += `\n---\n**Se også:**\n\n`;
        for (const r of otherResults) {
          answer += `- **${r.title}** *(${r.source})* — ${limitWords(r.snippet, 30)}\n`;
        }
      }
    }

    // If there are additional downloadable files (skip for glossary results)
    if (!isGlossaryResult) {
      const topResults = results.slice(0, 5);
      const downloadable = topResults.filter(r => r.downloadUrl && r !== best);
      if (downloadable.length > 0) {
        answer += `\n---\n**Andre nedlastbare dokumenter:**\n`;
        for (const r of downloadable) {
          answer += `\n[📥 Last ned ${r.fileName || r.title}](${r.downloadUrl})\n`;
        }
      }
    }

    // For account searches: include alternatives with 1000-2999 last
    const isAccountSearch = cat === "kontoplan" || (cat === "alt" && best.source === "Kontohjelp");
    const accountResults = results.filter(r => r.source === "Kontohjelp" && r !== best);
    if (isAccountSearch && accountResults.length > 0) {
      accountResults.sort((a, b) => {
        const aNum = getAccountNum(a.title);
        const bNum = getAccountNum(b.title);
        const aIsBalance = aNum >= 1000 && aNum <= 2999;
        const bIsBalance = bNum >= 1000 && bNum <= 2999;
        if (aIsBalance && !bIsBalance) return 1;
        if (!aIsBalance && bIsBalance) return -1;
        return b.score - a.score;
      });
      const alts = accountResults.slice(0, 8);
      answer += `\n[FLERE_KONTOER]\n`;
      answer += `**Andre kontoalternativer:**\n\n`;
      for (const r of alts) {
        answer += `- **${r.title}** — ${limitWords(r.snippet, 30)}\n`;
      }
    }

    // Add search term marker for override features
    if (isAccountSearch) {
      answer += `\n[AVA_SEARCH_TERM:${lastMessage}]`;
    }
    // Add doc search term marker for document categories
    const isDocSearch = ["dokumentmaler", "arkiv", "datasenter", "regnskapsord", "alt"].includes(cat);
    if (isDocSearch && !isAccountSearch) {
      answer += `\n[AVA_DOC_SEARCH:${lastMessage}]`;
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
