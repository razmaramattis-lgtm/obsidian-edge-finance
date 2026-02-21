import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Extract article content from HTML between the h1 and "Populære ord"
function extractArticle(html: string): { title: string; content: string } | null {
  // Get title from <h1>
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  if (!h1Match) return null;
  const title = h1Match[1].replace(/<[^>]+>/g, "").trim();

  // Find article/main content area
  // Content starts after the first h1 and ends before "Populære ord"
  const h1Pos = html.indexOf(h1Match[0]);
  const popPos = html.indexOf("Populære ord");
  const endPos = popPos > h1Pos ? popPos : html.length;
  
  let contentHtml = html.substring(h1Pos + h1Match[0].length, endPos);
  
  // Also try to cut before "Komplett regnskapsprogram" or "Prøv Conta" CTA
  const ctaPatterns = ["Komplett regnskapsprogram", "Bokfør med Conta", "Prøv Conta gratis", "Prøv gratis"];
  for (const p of ctaPatterns) {
    const ctaPos = contentHtml.lastIndexOf(p);
    if (ctaPos > 100) {
      // Find the start of the containing element
      const beforeCta = contentHtml.substring(0, ctaPos);
      const lastTagStart = Math.max(
        beforeCta.lastIndexOf("<h"),
        beforeCta.lastIndexOf("<p"),
        beforeCta.lastIndexOf("<div"),
        beforeCta.lastIndexOf("<a")
      );
      if (lastTagStart > 0) {
        contentHtml = contentHtml.substring(0, lastTagStart);
      }
    }
  }
  
  // Convert HTML to clean text
  let text = contentHtml
    // Replace headers with markdown
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis, (_, t) => `\n## ${t.replace(/<[^>]+>/g, "").trim()}\n`)
    // Replace lists
    .replace(/<li[^>]*>(.*?)<\/li>/gis, (_, t) => `- ${t.replace(/<[^>]+>/g, "").trim()}\n`)
    // Replace links with text
    .replace(/<a[^>]*>(.*?)<\/a>/gis, (_, t) => t.replace(/<[^>]+>/g, "").trim())
    // Replace strong/b
    .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gis, (_, _t, t2) => `**${t2.replace(/<[^>]+>/g, "").trim()}**`)
    // Replace em/i
    .replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gis, (_, _t, t2) => `_${t2.replace(/<[^>]+>/g, "").trim()}_`)
    // Replace br and p with newlines
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    // Remove remaining tags
    .replace(/<[^>]+>/g, "")
    // Clean up entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Clean up whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Remove the duplicate intro paragraph (conta.no repeats it)
  const lines = text.split("\n\n");
  if (lines.length > 1 && lines[0].trim() === lines[1].trim()) {
    lines.splice(0, 1);
    text = lines.join("\n\n");
  }

  if (!text || text.length < 20) return null;
  return { title, content: text };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));
    const batchStart = body.batchStart || 0;
    const batchSize = body.batchSize || 20;

    // Step 1: Fetch the index page to get all URLs
    console.log("Fetching index page...");
    const indexRes = await fetch("https://conta.no/regnskapsordbok/");
    const indexHtml = await indexRes.text();

    // Extract all dictionary URLs
    const urlRegex = /href="(https:\/\/conta\.no\/regnskapsordbok\/[^"]+)"/g;
    const allUrls = new Set<string>();
    let match;
    while ((match = urlRegex.exec(indexHtml)) !== null) {
      const url = match[1];
      if (url !== "https://conta.no/regnskapsordbok/" && !url.includes("#")) {
        allUrls.add(url);
      }
    }
    const urls = [...allUrls];
    console.log(`Found ${urls.length} dictionary URLs total`);

    // Get batch
    const batch = urls.slice(batchStart, batchStart + batchSize);
    if (batch.length === 0) {
      return new Response(JSON.stringify({ 
        done: true, 
        total: urls.length,
        message: "All batches processed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing batch ${batchStart}-${batchStart + batch.length} of ${urls.length}`);

    // Step 2: Fetch and process each URL in the batch
    const results: { title: string; status: string }[] = [];
    const toInsert: { title: string; content: string; category: string; active: boolean; sort_order: number }[] = [];

    // Fetch in parallel with concurrency limit
    const fetchPromises = batch.map(async (url, i) => {
      try {
        await new Promise(r => setTimeout(r, i * 200)); // small stagger
        const res = await fetch(url, { 
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AvargoBot/1.0)" }
        });
        if (!res.ok) {
          results.push({ title: url, status: `HTTP ${res.status}` });
          return;
        }
        const html = await res.text();
        const article = extractArticle(html);
        if (!article) {
          results.push({ title: url, status: "no content extracted" });
          return;
        }
        toInsert.push({
          title: article.title,
          content: article.content,
          category: "Regnskapsordbok",
          active: true,
          sort_order: 200 + batchStart + i,
        });
        results.push({ title: article.title, status: "ok" });
      } catch (e) {
        results.push({ title: url, status: `error: ${e instanceof Error ? e.message : "unknown"}` });
      }
    });

    await Promise.all(fetchPromises);

    // Step 3: Insert into knowledge_materials (upsert by title)
    if (toInsert.length > 0) {
      // First check which titles already exist
      const titles = toInsert.map(i => i.title);
      const { data: existing } = await sb
        .from("knowledge_materials")
        .select("title")
        .in("title", titles);
      
      const existingTitles = new Set((existing || []).map((e: any) => e.title));
      const newItems = toInsert.filter(i => !existingTitles.has(i.title));
      const updateItems = toInsert.filter(i => existingTitles.has(i.title));

      if (newItems.length > 0) {
        const { error } = await sb.from("knowledge_materials").insert(newItems as any);
        if (error) console.error("Insert error:", error);
      }

      for (const item of updateItems) {
        await sb.from("knowledge_materials")
          .update({ content: item.content, category: item.category } as any)
          .eq("title", item.title);
      }

      console.log(`Inserted ${newItems.length}, updated ${updateItems.length}`);
    }

    return new Response(JSON.stringify({
      done: batchStart + batch.length >= urls.length,
      processed: batch.length,
      inserted: toInsert.length,
      nextBatchStart: batchStart + batchSize,
      total: urls.length,
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("import-dictionary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
