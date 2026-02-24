import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const VAPID_PUBLIC_KEY =
  "BBUKXfXjSMdBtRPb8sxn8mfG2WMqWtIb_lZaH5axl1yynHWjSOafHGYiVF13caeUCXUnURUIHbla53WLksQBNgs";

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

      const reg = registration as any;
      let subscription = await reg.pushManager.getSubscription();

      // If existing subscription uses a different applicationServerKey, unsubscribe first
      if (subscription) {
        try {
          // Try to detect stale subscription by re-subscribing
          // If keys mismatch, unsubscribe old one
          await subscription.unsubscribe();
          console.log("Unsubscribed old push subscription to re-register with new VAPID key");
          subscription = null;
        } catch (e) {
          console.warn("Could not unsubscribe old push:", e);
        }
      }

      if (!subscription) {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Push permission not granted:", permission);
          return;
        }

        // Subscribe with current VAPID key
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        console.log("New push subscription created");
      }

      const subJson = subscription.toJSON();
      if (!subJson.endpoint || !subJson.keys) {
        console.error("Push subscription missing endpoint or keys");
        return;
      }

      // Upsert to database
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          profile_id: profileId,
          endpoint: subJson.endpoint,
          p256dh: subJson.keys.p256dh!,
          auth: subJson.keys.auth!,
        },
        { onConflict: "profile_id,endpoint" }
      );

      if (error) {
        console.error("Failed to save push subscription:", error);
      } else {
        console.log("Push subscription saved successfully for", profileId);
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
