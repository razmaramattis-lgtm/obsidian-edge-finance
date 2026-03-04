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
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  const t = normalize(title);
  const c = normalize(content);
  let score = 0;

  if (t.includes(q)) score += 100;
  if (c.includes(q)) score += 50;

  for (const word of words) {
    if (t.includes(word)) score += 20;
    if (c.includes(word)) score += 5;
  }

  return score;
}

function extractSnippet(content: string, query: string, maxLen = 600): string {
  const q = normalize(query);
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const lower = plain.toLowerCase();

  let bestIdx = 0;
  let bestScore = 0;
  for (const word of words) {
    const idx = lower.indexOf(word);
    if (idx >= 0 && idx < lower.length) {
      const start = Math.max(0, idx - 200);
      const end = Math.min(plain.length, idx + 400);
      const region = lower.slice(start, end);
      let score = 0;
      for (const w of words) {
        if (region.includes(w)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestIdx = Math.max(0, idx - 100);
      }
    }
  }

  const snippet = plain.slice(bestIdx, bestIdx + maxLen);
  return snippet + (bestIdx + maxLen < plain.length ? "…" : "");
}

function respondJson(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function respondStream(text: string) {
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

async function requireEmployeeOrAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: respondJson({ error: "Unauthorized" }, 401) };
  }

  const jwt = authHeader.replace("Bearer ", "").trim();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

  if (!publishableKey) {
    return { error: respondJson({ error: "Server misconfiguration" }, 500) };
  }

  const authClient = createClient(supabaseUrl, publishableKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data: userData, error: userError } = await authClient.auth.getUser(jwt);
  if (userError || !userData.user) {
    return { error: respondJson({ error: "Unauthorized" }, 401) };
  }

  const { data: allowed, error: roleError } = await authClient.rpc("is_employee_or_admin");
  if (roleError || !allowed) {
    return { error: respondJson({ error: "Forbidden" }, 403) };
  }

  return { authClient };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireEmployeeOrAdmin(req);
    if (auth.error) return auth.error;

    const { messages } = await req.json();
    const lastMessage = messages?.filter((m: { role?: string; content?: string }) => m.role === "user").pop()?.content || "";

    if (!lastMessage.trim()) {
      return respondJson({ answer: "Vennligst skriv et spørsmål om HMS-håndboken." });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);
    const { data: hmsDocs, error } = await sb
      .from("hms_documents")
      .select("title, content, sort_order")
      .order("sort_order");

    if (error) {
      throw error;
    }

    if (!hmsDocs || hmsDocs.length === 0) {
      return respondStream("Jeg finner ingen HMS-dokumenter i databasen akkurat nå. Kontakt administrator.");
    }

    const scored = hmsDocs
      .map((doc) => ({
        ...doc,
        score: scoreMatch(lastMessage, doc.title, doc.content || ""),
      }))
      .filter((doc) => doc.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      return respondStream(`Jeg fant dessverre ingen relevante kapitler i HMS-håndboken for «${lastMessage}». Prøv å søke med andre ord, eller bla gjennom kapitlene direkte.`);
    }

    const best = scored[0];
    const snippet = extractSnippet(best.content || "", lastMessage);
    return respondStream(`### 📄 ${best.title}\n\n${snippet}`);
  } catch (error) {
    console.error("hms-chat error:", error);
    return respondJson({ error: error instanceof Error ? error.message : "Ukjent feil" }, 500);
  }
});
