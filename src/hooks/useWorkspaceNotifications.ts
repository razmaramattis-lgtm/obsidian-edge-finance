import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WsNotification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: string;
  reference_id: string | null;
  reference_type: string | null;
  title: string | null;
  body: string | null;
  image_url: string | null;
  read: boolean;
  created_at: string;
  actor?: { name: string; avatar_url: string | null };
}

export const useWorkspaceNotifications = (profileId: string | undefined) => {
  const [notifications, setNotifications] = useState<WsNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadDmCount, setUnreadDmCount] = useState(0);
  const [unreadFeedCount, setUnreadFeedCount] = useState(0);
  const [unreadGroupCount, setUnreadGroupCount] = useState(0);

  const fetch = useCallback(async () => {
    if (!profileId) return;
    const { data } = await supabase
      .from("workspace_notifications")
      .select("*")
      .eq("recipient_id", profileId)
      .order("created_at", { ascending: false })
      .limit(50);

    const notifs = (data || []) as WsNotification[];

    // Fetch actor profiles
    const actorIds = [...new Set(notifs.map(n => n.actor_id))];
    if (actorIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", actorIds);
      const pMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      notifs.forEach(n => {
        n.actor = pMap.get(n.actor_id) || { name: "Ukjent", avatar_url: null };
      });
    }

    setNotifications(notifs);
    const unread = notifs.filter(n => !n.read);
    setUnreadCount(unread.length);
    setUnreadDmCount(unread.filter(n => n.type === "dm_message").length);
    setUnreadFeedCount(unread.filter(n => ["feed_post", "feed_comment", "feed_reaction"].includes(n.type)).length);
    setUnreadGroupCount(unread.filter(n => n.type === "group_message").length);
  }, [profileId]);

  useEffect(() => {
    fetch();
    if (!profileId) return;
    const ch = supabase
      .channel("ws-notifs-" + profileId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "workspace_notifications", filter: `recipient_id=eq.${profileId}` }, () => fetch())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "workspace_notifications", filter: `recipient_id=eq.${profileId}` }, () => fetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [profileId, fetch]);

  const markRead = async (id: string) => {
    await supabase.from("workspace_notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markTypeRead = async (type: string | string[]) => {
    const types = Array.isArray(type) ? type : [type];
    const toMark = notifications.filter(n => !n.read && types.includes(n.type));
    if (toMark.length === 0) return;
    const ids = toMark.map(n => n.id);
    await supabase.from("workspace_notifications").update({ read: true }).in("id", ids);
    fetch();
  };

  const markAllRead = async () => {
    if (!profileId) return;
    await supabase.from("workspace_notifications").update({ read: true }).eq("recipient_id", profileId).eq("read", false);
    fetch();
  };

  const deleteNotifications = async (ids: string[]) => {
    if (!ids.length) return;
    await supabase.from("workspace_notifications").delete().in("id", ids);
    setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
    setUnreadCount(prev => Math.max(0, prev - notifications.filter(n => ids.includes(n.id) && !n.read).length));
  };

  const deleteAllNotifications = async () => {
    if (!profileId) return;
    await supabase.from("workspace_notifications").delete().eq("recipient_id", profileId);
    setNotifications([]);
    setUnreadCount(0);
    setUnreadDmCount(0);
    setUnreadFeedCount(0);
    setUnreadGroupCount(0);
  };

  const markDmConvRead = async (conversationId: string) => {
    const toMark = notifications.filter(n => !n.read && n.type === "dm_message" && n.reference_id === conversationId);
    if (toMark.length === 0) return;
    await supabase.from("workspace_notifications").update({ read: true }).in("id", toMark.map(n => n.id));
    fetch();
  };

  return {
    notifications,
    unreadCount,
    unreadDmCount,
    unreadFeedCount,
    unreadGroupCount,
    markRead,
    markTypeRead,
    markAllRead,
    markDmConvRead,
    deleteNotifications,
    deleteAllNotifications,
    refetch: fetch,
  };
};

// Helper to create a notification (called from components after actions)
export const createNotification = async (opts: {
  recipientId: string;
  actorId: string;
  type: string;
  referenceId?: string;
  referenceType?: string;
  title?: string;
  body?: string;
  imageUrl?: string;
}) => {
  if (opts.recipientId === opts.actorId) return; // Don't notify yourself
  await supabase.from("workspace_notifications").insert([{
    recipient_id: opts.recipientId,
    actor_id: opts.actorId,
    type: opts.type,
    reference_id: opts.referenceId || null,
    reference_type: opts.referenceType || null,
    title: opts.title || null,
    body: opts.body || null,
    image_url: opts.imageUrl || null,
  }]);
};
