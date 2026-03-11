import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { request_id, prompt, aspect_ratio, duration } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ikke konfigurert");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Use Lovable AI to generate a detailed video script/storyboard
    // Then use image generation as video thumbnail
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Create a professional, cinematic thumbnail image for a marketing video with this concept: ${prompt}. 
The image should be photorealistic, high quality, suitable as a video thumbnail. Aspect ratio: ${aspect_ratio}. 
Style: Premium corporate, dark teal and gold color palette, cinematic lighting.`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "For mange forespørsler, prøv igjen senere." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "Kreditter oppbrukt." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI-feil: " + aiRes.status);
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Extract image URL if present (inline_data or URL)
    let thumbnailUrl: string | null = null;
    const parts = aiData.choices?.[0]?.message?.parts || [];
    for (const part of parts) {
      if (part?.inline_data?.mime_type?.startsWith("image/")) {
        // Base64 image - store it
        const base64 = part.inline_data.data;
        const mimeType = part.inline_data.mime_type;
        const ext = mimeType.includes("png") ? "png" : "jpg";
        const fileName = `video-thumb-${request_id}.${ext}`;

        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const { error: uploadError } = await supabase.storage
          .from("workspace-uploads")
          .upload(`marketing/video-thumbnails/${fileName}`, bytes, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("workspace-uploads")
            .getPublicUrl(`marketing/video-thumbnails/${fileName}`);
          thumbnailUrl = urlData.publicUrl;
        }
      }
    }

    // Update the request with thumbnail and mark as completed
    await supabase
      .from("marketing_video_requests")
      .update({
        status: "completed",
        thumbnail_url: thumbnailUrl,
        admin_note: `AI-generert thumbnail klar. Full videoproduksjon krever ekstern videotjeneste.`,
      })
      .eq("id", request_id);

    return new Response(
      JSON.stringify({ success: true, thumbnail_url: thumbnailUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Video generation error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
