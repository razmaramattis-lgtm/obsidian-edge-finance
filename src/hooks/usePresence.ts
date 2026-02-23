import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Tracks which users are currently on the Workspace page
 * using Supabase Realtime Presence.
 * Also persists last_seen_at to profiles for offline email notifications.
 */
export const usePresence = (profileId: string | undefined) => {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!profileId) return;

    // Update last_seen_at on mount and periodically
    const updateLastSeen = () => {
      supabase.from("profiles").update({ last_seen_at: new Date().toISOString() } as any).eq("id", profileId).then(() => {});
    };
    updateLastSeen();
    const interval = setInterval(updateLastSeen, 60_000); // every 60s

    const channel = supabase.channel("workspace-presence", {
      config: { presence: { key: profileId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const ids = new Set<string>(Object.keys(state));
        setOnlineIds(ids);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ profile_id: profileId, online_at: new Date().toISOString() });
        }
      });

    channelRef.current = channel;

    return () => {
      clearInterval(interval);
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [profileId]);

  const isOnline = (id: string) => onlineIds.has(id);

  return { onlineIds, isOnline };
};
