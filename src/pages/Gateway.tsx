import { useState, useEffect, useCallback, useRef } from "react";
import { Smartphone, Wifi, WifiOff, Send, CheckCircle, XCircle, Loader2, Signal, RefreshCw, Power, PowerOff } from "lucide-react";

const POLL_INTERVAL = 4000;
const HEARTBEAT_INTERVAL = 30000;
const SEND_DELAY = 3000; // delay between each SMS send

interface PendingMessage {
  id: string;
  phone: string;
  message: string;
}

const Gateway = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [gatewayUrl, setGatewayUrl] = useState<string>("");
  const [deviceName, setDeviceName] = useState<string>("SMS Gateway");
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [stats, setStats] = useState({ sent: 0, failed: 0 });
  const [lastPoll, setLastPoll] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(() => localStorage.getItem("gateway_active") === "true");
  const [log, setLog] = useState<string[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<any>(null);
  const processingRef = useRef(false);
  const activeRef = useRef(active);

  // Keep activeRef in sync
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const addLog = useCallback((msg: string) => {
    setLog(prev => [`${new Date().toLocaleTimeString("nb-NO")} — ${msg}`, ...prev.slice(0, 49)]);
  }, []);

  // Read config from URL params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key") || localStorage.getItem("gateway_api_key");
    const url = params.get("url") || localStorage.getItem("gateway_url") || "";
    const name = params.get("name") || localStorage.getItem("gateway_device_name") || "SMS Gateway";

    if (key) {
      setApiKey(key);
      setGatewayUrl(url);
      setDeviceName(name);
      localStorage.setItem("gateway_api_key", key);
      if (url) localStorage.setItem("gateway_url", url);
      if (name) localStorage.setItem("gateway_device_name", name);

      if (params.has("key")) {
        window.history.replaceState({}, "", "/gateway");
      }
    }
  }, []);

  // Wake Lock to keep screen active
  useEffect(() => {
    const requestWakeLock = async () => {
      if (active && "wakeLock" in navigator) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
          addLog("Skjerm holdes aktiv (Wake Lock)");
        } catch {
          // Wake lock can fail silently
        }
      }
    };
    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && active) {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [active, addLog]);

  // Persist active state
  useEffect(() => {
    localStorage.setItem("gateway_active", active ? "true" : "false");
  }, [active]);

  const apiCall = useCallback(async (endpoint: string, method: string = "GET", body?: any) => {
    if (!apiKey || !gatewayUrl) return null;
    try {
      const res = await fetch(`${gatewayUrl}/${endpoint}`, {
        method,
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [apiKey, gatewayUrl]);

  // Heartbeat
  useEffect(() => {
    if (!apiKey || !gatewayUrl) return;

    const sendHeartbeat = async () => {
      const result = await apiCall("heartbeat", "POST");
      if (result?.ok) {
        setConnected(true);
        setError(null);
      } else {
        setConnected(false);
      }
    };

    sendHeartbeat();
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current); };
  }, [apiKey, gatewayUrl, apiCall]);

  // Poll for pending messages
  const pollMessages = useCallback(async () => {
    const result = await apiCall("pending");
    if (result?.messages) {
      setPending(prev => {
        // Merge new messages (avoid duplicates)
        const existingIds = new Set(prev.map(m => m.id));
        const newMsgs = result.messages.filter((m: PendingMessage) => !existingIds.has(m.id));
        return [...prev, ...newMsgs];
      });
      setLastPoll(new Date());
    }
  }, [apiCall]);

  useEffect(() => {
    if (!apiKey || !gatewayUrl) return;
    pollMessages();
    pollRef.current = setInterval(pollMessages, POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [apiKey, gatewayUrl, pollMessages]);

  // Send a single SMS via sms: intent — auto-mark as sent
  const sendSms = useCallback(async (msg: PendingMessage): Promise<boolean> => {
    setSending(msg.id);
    addLog(`Sender til ${msg.phone}...`);

    // Open SMS app with pre-filled content
    const smsUrl = `sms:${msg.phone}?body=${encodeURIComponent(msg.message)}`;
    
    // Use window.location for more reliable intent triggering on Android
    const link = document.createElement("a");
    link.href = smsUrl;
    link.click();

    // Wait for SMS app to open and user to (auto-)send
    await new Promise(resolve => setTimeout(resolve, SEND_DELAY));

    // Report success to backend
    const result = await apiCall("sent", "POST", {
      message_id: msg.id,
      success: true,
    });

    if (result?.ok) {
      setStats(s => ({ ...s, sent: s.sent + 1 }));
      setPending(p => p.filter(m => m.id !== msg.id));
      addLog(`✓ Sendt til ${msg.phone}`);
    } else {
      addLog(`✗ Feil ved rapportering for ${msg.phone}`);
    }

    setSending(null);
    return true;
  }, [apiCall, addLog]);

  // Auto-process queue when active
  useEffect(() => {
    if (!active || pending.length === 0 || processingRef.current) return;

    const processQueue = async () => {
      processingRef.current = true;
      
      while (activeRef.current && pending.length > 0) {
        const msg = pending[0];
        if (!msg) break;
        await sendSms(msg);
        // Small extra pause between messages
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      processingRef.current = false;
    };

    processQueue();
  }, [active, pending, sendSms]);

  const handleDeactivate = () => {
    setActive(false);
    processingRef.current = false;
    addLog("Gateway deaktivert");
  };

  const handleActivate = () => {
    setActive(true);
    addLog("Gateway aktivert — sender automatisk");
  };

  const handleDisconnect = () => {
    localStorage.removeItem("gateway_api_key");
    localStorage.removeItem("gateway_url");
    localStorage.removeItem("gateway_device_name");
    localStorage.removeItem("gateway_active");
    setApiKey(null);
    setConnected(false);
    setPending([]);
    setActive(false);
  };

  // Not configured yet
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
          <Smartphone size={28} className="text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold mb-2">SMS Gateway</h1>
        <p className="text-sm text-zinc-400 mb-8 max-w-xs">
          Skann QR-koden fra admin-panelet for å koble denne enheten som SMS-gateway.
        </p>
        <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left">
          <p className="text-xs text-zinc-500 mb-3">Eller lim inn oppsettslenke:</p>
          <input
            type="text"
            placeholder="Lim inn lenke her..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              try {
                const url = new URL(text);
                const key = url.searchParams.get("key");
                if (key) {
                  window.location.href = text;
                }
              } catch {
                // not a URL
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${connected ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
              {connected ? <Wifi size={16} className="text-emerald-400" /> : <WifiOff size={16} className="text-red-400" />}
            </div>
            <div>
              <p className="text-sm font-semibold">{deviceName}</p>
              <p className="text-[10px] text-zinc-500">{connected ? "Tilkoblet" : "Frakoblet"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {active ? (
              <button
                onClick={handleDeactivate}
                className="flex items-center gap-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg px-3 py-2 hover:bg-red-500/20"
              >
                <PowerOff size={14} />
                Deaktiver
              </button>
            ) : (
              <button
                onClick={handleActivate}
                className="flex items-center gap-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg px-3 py-2 hover:bg-emerald-500/20"
              >
                <Power size={14} />
                Aktiver
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status banner */}
      {active && (
        <div className="mx-4 mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
          <Loader2 size={14} className="text-emerald-400 animate-spin shrink-0" />
          <p className="text-xs text-emerald-300">
            Gateway er aktiv — sender SMS automatisk. {sending && "Sender nå..."}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 p-4">
        {[
          { label: "Ventende", value: pending.length, color: "text-amber-400" },
          { label: "Sendt", value: stats.sent, color: "text-emerald-400" },
          { label: "Feilet", value: stats.failed, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
          <XCircle size={14} className="text-red-400 shrink-0" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Pending messages */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-zinc-400">Meldingskø ({pending.length})</p>
          <button onClick={pollMessages} className="text-zinc-500 hover:text-zinc-300">
            <RefreshCw size={12} />
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <Signal size={24} className="text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Ingen ventende meldinger</p>
            {lastPoll && (
              <p className="text-[10px] text-zinc-600 mt-1">
                Sist sjekket: {lastPoll.toLocaleTimeString("nb-NO")}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {pending.slice(0, 5).map(msg => (
              <div key={msg.id} className={`bg-zinc-900 border rounded-xl p-3 ${sending === msg.id ? "border-emerald-500/40" : "border-zinc-800"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-mono text-zinc-300">{msg.phone}</p>
                  {sending === msg.id && <Loader2 size={12} className="text-emerald-400 animate-spin" />}
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{msg.message}</p>
              </div>
            ))}
            {pending.length > 5 && (
              <p className="text-[10px] text-zinc-600 text-center">+{pending.length - 5} til i kø</p>
            )}
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div className="px-4 mt-4">
        <p className="text-xs font-medium text-zinc-400 mb-2">Aktivitetslogg</p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 max-h-40 overflow-y-auto">
          {log.length === 0 ? (
            <p className="text-[10px] text-zinc-600">Ingen aktivitet ennå</p>
          ) : (
            log.map((entry, i) => (
              <p key={i} className="text-[10px] text-zinc-500 leading-relaxed">{entry}</p>
            ))
          )}
        </div>
      </div>

      {/* Disconnect */}
      <div className="p-4 mt-4 text-center">
        <button onClick={handleDisconnect} className="text-[10px] text-zinc-600 hover:text-zinc-400 underline">
          Koble fra enhet
        </button>
        <p className="text-[10px] text-zinc-700 mt-2">
          Poller hvert {POLL_INTERVAL / 1000}s • Heartbeat hvert {HEARTBEAT_INTERVAL / 1000}s
        </p>
      </div>
    </div>
  );
};

export default Gateway;
