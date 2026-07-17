import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register PWA service worker — but never inside Lovable preview / dev / iframe.
// The SW caches index.html and can serve stale builds inside the editor preview.
if ("serviceWorker" in navigator) {
  const host = window.location.hostname;
  const inIframe = window.self !== window.top;
  const isLovablePreview =
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host.endsWith(".lovableproject.com") ||
    host.endsWith(".lovableproject-dev.com") ||
    host.endsWith(".beta.lovable.dev");
  const killSwitch = new URLSearchParams(window.location.search).get("sw") === "off";
  const shouldRegister =
    import.meta.env.PROD && !inIframe && !isLovablePreview && !killSwitch;

  if (shouldRegister) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  } else {
    // Clean up any previously-registered SW so the preview stops serving cached HTML.
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister().catch(() => {}));
    }).catch(() => {});
    if ("caches" in window) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
    }
  }
}

// Request notification permission on first interaction
const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
  document.removeEventListener("click", requestNotificationPermission);
};
document.addEventListener("click", requestNotificationPermission, { once: true });

createRoot(document.getElementById("root")!).render(<App />);
