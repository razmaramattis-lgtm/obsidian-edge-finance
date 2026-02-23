import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register PWA service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
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
