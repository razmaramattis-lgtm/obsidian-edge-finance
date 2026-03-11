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

    // Generate thumbnail image using Lovable AI image model
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
            content: `Generate a professional, cinematic thumbnail image for a marketing video with this concept: ${prompt}. 
The image should be photorealistic, high quality, suitable as a video thumbnail. Aspect ratio: ${aspect_ratio}. 
Style: Premium corporate, dark teal and gold color palette, cinematic lighting. Only output the image, no text.`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI response error:", aiRes.status, errText);
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
      throw new Error("AI-feil: " + aiRes.status + " " + errText);
    }

    const aiData = await aiRes.json();
    console.log("AI response structure keys:", JSON.stringify(Object.keys(aiData)));
    const message = aiData.choices?.[0]?.message;
    console.log("Message keys:", message ? JSON.stringify(Object.keys(message)) : "null");
    console.log("Content type:", typeof message?.content);
    if (Array.isArray(message?.content)) {
      console.log("Content array length:", message.content.length);
      for (let i = 0; i < Math.min(message.content.length, 3); i++) {
        const part = message.content[i];
        console.log(`Content[${i}] type:`, part?.type, "keys:", JSON.stringify(Object.keys(part || {})));
      }
    }

    let thumbnailUrl: string | null = null;

    // Strategy 1: content is array of parts (OpenAI multimodal format)
    if (Array.isArray(message?.content)) {
      for (const part of message.content) {
        // Check for inline_data (Google native format passed through)
        if (part?.inline_data?.mime_type?.startsWith("image/")) {
          thumbnailUrl = await uploadBase64Image(supabase, request_id, part.inline_data.data, part.inline_data.mime_type);
          if (thumbnailUrl) break;
        }
        // Check for image_url with data URI
        if (part?.type === "image_url" && part?.image_url?.url) {
          const dataMatch = part.image_url.url.match(/^data:(image\/\w+);base64,(.+)$/);
          if (dataMatch) {
            thumbnailUrl = await uploadBase64Image(supabase, request_id, dataMatch[2], dataMatch[1]);
            if (thumbnailUrl) break;
          }
        }
        // Check for image type with data
        if (part?.type === "image" && part?.data) {
          thumbnailUrl = await uploadBase64Image(supabase, request_id, part.data, part.mime_type || "image/png");
          if (thumbnailUrl) break;
        }
      }
    }

    // Strategy 2: content is a string - check for embedded base64 data URI
    if (!thumbnailUrl && typeof message?.content === "string") {
      const dataUriMatch = message.content.match(/data:(image\/\w+);base64,([A-Za-z0-9+/=]+)/);
      if (dataUriMatch) {
        thumbnailUrl = await uploadBase64Image(supabase, request_id, dataUriMatch[2], dataUriMatch[1]);
      }
    }

    // Strategy 3: Check 'parts' field (Google native format)
    if (!thumbnailUrl) {
      const parts = message?.parts || aiData.choices?.[0]?.message?.parts || [];
      for (const part of parts) {
        if (part?.inline_data?.mime_type?.startsWith("image/")) {
          thumbnailUrl = await uploadBase64Image(supabase, request_id, part.inline_data.data, part.inline_data.mime_type);
          if (thumbnailUrl) break;
        }
      }
    }

    console.log("Final thumbnail URL:", thumbnailUrl);

    // Update the request with thumbnail
    await supabase
      .from("marketing_video_requests")
      .update({
        status: "completed",
        thumbnail_url: thumbnailUrl,
        admin_note: thumbnailUrl
          ? "AI-generert thumbnail klar."
          : "Thumbnail kunne ikke genereres. Prøv igjen eller last opp egen video.",
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

async function uploadBase64Image(
  supabase: any,
  requestId: string,
  base64Data: string,
  mimeType: string
): Promise<string | null> {
  try {
    const ext = mimeType.includes("png") ? "png" : "jpg";
    const fileName = `video-thumb-${requestId}-${Date.now()}.${ext}`;
    const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    
    console.log(`Uploading image: ${fileName}, size: ${bytes.length} bytes, mime: ${mimeType}`);

    const { error: uploadError } = await supabase.storage
      .from("workspace-uploads")
      .upload(`marketing/video-thumbnails/${fileName}`, bytes, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("workspace-uploads")
      .getPublicUrl(`marketing/video-thumbnails/${fileName}`);

    console.log("Uploaded successfully, URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (e) {
    console.error("Upload failed:", e);
    return null;
  }
}
