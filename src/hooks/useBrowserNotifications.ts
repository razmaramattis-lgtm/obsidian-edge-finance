import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Maps notification type to a navigation URL for deep linking.
 */
const typeToUrl = (type: string, refId?: string | null): string => {
  switch (type) {
    // Workspace types
    case "dm_message":
      return "/workspace?view=dms";
    case "feed_post":
    case "feed_comment":
    case "feed_reaction":
      return "/workspace?view=feed";
    case "group_message":
      return "/workspace?view=groups";
    case "friend_request":
      return "/workspace?view=friends";
    case "chat_message":
      return "/workspace?view=feed";

    // Admin types
    case "admin_contact":
      return "/admin/dashboard?panel=contact_submissions";
    case "admin_booking":
      return "/admin/dashboard?panel=bookings";
    case "admin_advisor":
      return "/admin/dashboard?panel=advisor_requests";
    case "admin_partner":
      return "/admin/dashboard?panel=partner_requests";
    case "admin_invitation":
      return "/admin/dashboard?panel=employee_invitations";
    case "admin_benefit":
      return "/admin/dashboard?panel=benefit_applications";
    case "admin_feedback":
      return "/admin/dashboard?panel=org_resources&tab=account_feedback";

    default:
      return "/workspace";
  }
};

/**
 * Hook that listens for new workspace_notifications via realtime
 * and shows native browser/phone notifications with deep linking.
 */
export const useBrowserNotifications = (profileId: string | undefined) => {
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!profileId) return;
    requestPermission();

    const channel = supabase
      .channel("browser-push-" + profileId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "workspace_notifications",
          filter: `recipient_id=eq.${profileId}`,
        },
        (payload) => {
          if (Notification.permission !== "granted") return;

          const n = payload.new as any;
          if (!n) return;

          // Build notification content
          const title = n.title || "Avargo";
          const body = n.body || "";
          const url = typeToUrl(n.type, n.reference_id);

          try {
            const opts: NotificationOptions & Record<string, unknown> = {
              body,
              icon: "/logo.png",
              badge: "/favicon.png",
              tag: n.id,
              silent: false,
            };
            (opts as any).renotify = true;
            const notification = new Notification(title, opts);

            notification.onclick = () => {
              window.focus();
              // Navigate to the deep link URL
              if (window.location.pathname + window.location.search !== url) {
                window.location.href = url;
              }
              notification.close();
            };
          } catch {
            // Notification API may fail in some contexts (e.g. insecure context)
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, requestPermission]);

  return { requestPermission };
};
