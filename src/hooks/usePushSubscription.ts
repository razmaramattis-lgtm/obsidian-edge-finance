import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const VAPID_PUBLIC_KEY =
  "BLLS-j1BvraDN1B3A9WLP_9J0UgSnmykvENTYohjri8bk7p4zZTGBKggXS7sz4syABbh59F9ext1VsEIE4Ty2P4";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushSubscription = (profileId: string | undefined) => {
  const subscribe = useCallback(async () => {
    if (!profileId) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    try {
      // Register the push service worker
      const registration = await navigator.serviceWorker.register("/sw-push.js", {
        scope: "/",
      });

      // Wait for it to be ready
      await navigator.serviceWorker.ready;

      // Check if already subscribed
      const reg = registration as any;
      let subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // Subscribe
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const subJson = subscription.toJSON();
      if (!subJson.endpoint || !subJson.keys) return;

      // Upsert to database
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          profile_id: profileId,
          endpoint: subJson.endpoint,
          p256dh: subJson.keys.p256dh!,
          auth: subJson.keys.auth!,
        },
        { onConflict: "endpoint" }
      );

      if (error) {
        console.error("Failed to save push subscription:", error);
      } else {
        console.log("Push subscription saved successfully");
      }
    } catch (err) {
      console.error("Push subscription error:", err);
    }
  }, [profileId]);

  useEffect(() => {
    subscribe();
  }, [subscribe]);

  return { subscribe };
};
