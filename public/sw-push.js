// Service Worker for Web Push notifications
// This runs in the background even when the app is closed

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "Avargo", body: event.data.text() };
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/logo.png",
    badge: data.badge || "/favicon.png",
    tag: data.tag || "avargo-notification",
    renotify: true,
    vibrate: [200, 100, 200],
    data: data.data || {},
  };

  event.waitUntil(self.registration.showNotification(data.title || "Avargo", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/workspace";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window if available
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Open new window
      return clients.openWindow(url);
    })
  );
});
