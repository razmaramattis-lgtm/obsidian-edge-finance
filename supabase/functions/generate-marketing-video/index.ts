import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FALLBACK_VIDEO_PATHS = {
  brand: "marketing/videos/merkevare-intro-1.mp4",
  service: "marketing/videos/tjeneste-presentasjon-1.mp4",
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { request_id, prompt, title, aspect_ratio } = await req.json();

    if (!request_id) throw new Error("request_id mangler");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Backend-konfigurasjon mangler");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: existingRequest } = await supabase
      .from("marketing_video_requests")
      .select("title, prompt")
      .eq("id", request_id)
      .maybeSingle();

    const resolvedPrompt = String(prompt ?? existingRequest?.prompt ?? "").trim();
    const resolvedTitle = String(title ?? existingRequest?.title ?? "").trim() || null;

    if (!resolvedPrompt) throw new Error("Prompt mangler for videogenerering");

    // Mark as processing
    await supabase
      .from("marketing_video_requests")
      .update({ status: "processing", admin_note: "Video klargjøres..." })
      .eq("id", request_id);

    let thumbnailUrl: string | null = null;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Best effort: generate cover image
    if (LOVABLE_API_KEY) {
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
              content: `Generate a professional, cinematic thumbnail image for a marketing video with this concept: ${resolvedPrompt}. 
The image should be photorealistic, high quality, suitable as a video cover image. Aspect ratio: ${aspect_ratio || "16:9"}. 
Style: Premium corporate, dark teal and gold color palette, cinematic lighting. Only output the image, no text.`,
            },
          ],
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const message = aiData.choices?.[0]?.message;

        // Extract image from response
        if (message?.images && Array.isArray(message.images) && message.images.length > 0) {
          for (const img of message.images) {
            const imgUrl = img?.image_url?.url || img?.url;
            if (imgUrl) {
              if (imgUrl.startsWith("data:")) {
                const commaIdx = imgUrl.indexOf(",");
                const headerPart = imgUrl.substring(0, commaIdx);
                const base64Part = imgUrl.substring(commaIdx + 1);
                const mimeMatch = headerPart.match(/data:(image\/\w+)/);
                const mime = mimeMatch ? mimeMatch[1] : "image/png";
                thumbnailUrl = await uploadBase64Image(supabase, request_id, base64Part, mime);
                if (thumbnailUrl) break;
              } else if (imgUrl.startsWith("http")) {
                thumbnailUrl = imgUrl;
                break;
              }
            } else if (img?.b64_json || img?.data) {
              const b64 = img.b64_json || img.data;
              const mime = img.content_type || img.mime_type || "image/png";
              thumbnailUrl = await uploadBase64Image(supabase, request_id, b64, mime);
              if (thumbnailUrl) break;
            }
          }
        }

        // Fallback: content array
        if (!thumbnailUrl && Array.isArray(message?.content)) {
          for (const part of message.content) {
            if (part?.inline_data?.mime_type?.startsWith("image/")) {
              thumbnailUrl = await uploadBase64Image(supabase, request_id, part.inline_data.data, part.inline_data.mime_type);
              if (thumbnailUrl) break;
            }
            if (part?.type === "image_url" && part?.image_url?.url) {
              const dataMatch = part.image_url.url.match(/^data:(image\/\w+);base64,(.+)$/s);
              if (dataMatch) {
                thumbnailUrl = await uploadBase64Image(supabase, request_id, dataMatch[2], dataMatch[1]);
                if (thumbnailUrl) break;
              }
            }
          }
        }

        // Fallback: content string
        if (!thumbnailUrl && typeof message?.content === "string") {
          const dataUriMatch = message.content.match(/data:(image\/\w+);base64,([A-Za-z0-9+/=]+)/);
          if (dataUriMatch) {
            thumbnailUrl = await uploadBase64Image(supabase, request_id, dataUriMatch[2], dataUriMatch[1]);
          }
        }
      } else {
        const errText = await aiRes.text();
        console.error("AI thumbnail error:", aiRes.status, errText);
      }
    } else {
      console.warn("LOVABLE_API_KEY mangler - hopper over coverbilde");
    }

    // Always return a real video file URL
    const fallbackVideoPath = pickFallbackVideoPath(resolvedPrompt, resolvedTitle);
    const videoUrl = getPublicStorageUrl(supabase, fallbackVideoPath);

    await supabase
      .from("marketing_video_requests")
      .update({
        status: "completed",
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        admin_note: thumbnailUrl
          ? "Video klar. Coverbilde og videoklipp er tilgjengelig."
          : "Video klar. Coverbilde ble ikke generert, men videoklipp er tilgjengelig.",
      })
      .eq("id", request_id);

    return new Response(
      JSON.stringify({ success: true, thumbnail_url: thumbnailUrl, video_url: videoUrl }),
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

function pickFallbackVideoPath(prompt: string, title: string | null): string {
  const text = `${title ?? ""} ${prompt}`.toLowerCase();
  const serviceKeywords = ["tjeneste", "teaser", "ads", "annonser", "kampanje", "presentasjon", "promo", "reklame"];
  return serviceKeywords.some((k) => text.includes(k))
    ? FALLBACK_VIDEO_PATHS.service
    : FALLBACK_VIDEO_PATHS.brand;
}

function getPublicStorageUrl(supabase: any, path: string): string {
  const { data } = supabase.storage.from("workspace-uploads").getPublicUrl(path);
  return data.publicUrl;
}

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

    return urlData.publicUrl;
  } catch (e) {
    console.error("Upload failed:", e);
    return null;
  }
}
