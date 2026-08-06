import { supabase } from "@/integrations/supabase/client";

const BUCKET = "workspace-uploads";
const PUBLIC_MARKER = `/storage/v1/object/public/${BUCKET}/`;
const SIGNED_MARKER = `/storage/v1/object/sign/${BUCKET}/`;
const TTL = 60 * 60; // 1 hour

const cache = new Map<string, { url: string; expires: number }>();

/** Extracts the storage path when the URL points at the workspace-uploads bucket. */
export const workspacePath = (url?: string | null): string | null => {
  if (!url) return null;
  const marker = url.includes(PUBLIC_MARKER)
    ? PUBLIC_MARKER
    : url.includes(SIGNED_MARKER)
      ? SIGNED_MARKER
      : null;
  if (!marker) return null;
  const path = url.split(marker)[1]?.split("?")[0];
  return path ? decodeURIComponent(path) : null;
};

/**
 * The bucket is private, so stored URLs must be exchanged for a short-lived
 * signed URL before they can be rendered or downloaded.
 */
export const resolveWorkspaceUrl = async (url?: string | null): Promise<string | null> => {
  if (!url) return null;
  const path = workspacePath(url);
  if (!path) return url;

  const hit = cache.get(path);
  if (hit && hit.expires > Date.now()) return hit.url;

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, TTL);
  if (error || !data?.signedUrl) return null;

  cache.set(path, { url: data.signedUrl, expires: Date.now() + (TTL - 300) * 1000 });
  return data.signedUrl;
};

/** Upload helper that returns a stable path-based reference for the private bucket. */
export const workspacePublicRef = (path: string) => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};
