import { useState, useEffect, useCallback, useRef } from "react";
import { Smartphone, Wifi, WifiOff, Send, CheckCircle, XCircle, Loader2, Signal, RefreshCw, Power, PowerOff, Zap, Settings } from "lucide-react";

const POLL_INTERVAL = 3000;
const HEARTBEAT_INTERVAL = 25000;

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
  const [sendDelay, setSendDelay] = useState(() => parseInt(localStorage.getItem("gateway_delay") || "2000", 10));
  const [showSettings, setShowSettings] = useState(false);
  const [autoMarkSent, setAutoMarkSent] = useState(() => localStorage.getItem("gateway_auto_mark") !== "false");
  const [log, setLog] = useState<string[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<any>(null);
  const processingRef = useRef(false);
  const activeRef = useRef(active);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const pendingRef = useRef<PendingMessage[]>([]);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { pendingRef.current = pending; }, [pending]);

  const addLog = useCallback((msg: string) => {
    setLog(prev => [`${new Date().toLocaleTimeString("nb-NO")} — ${msg}`, ...prev.slice(0, 99)]);
  }, []);

  // Config from URL params or localStorage
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
      if (params.has("key")) window.history.replaceState({}, "", "/gateway");
    }
  }, []);

  // Persist settings
  useEffect(() => { localStorage.setItem("gateway_active", active ? "true" : "false"); }, [active]);
  useEffect(() => { localStorage.setItem("gateway_delay", String(sendDelay)); }, [sendDelay]);
  useEffect(() => { localStorage.setItem("gateway_auto_mark", autoMarkSent ? "true" : "false"); }, [autoMarkSent]);

  // Wake Lock
  useEffect(() => {
    const requestWakeLock = async () => {
      if (active && "wakeLock" in navigator) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
          addLog("Wake Lock aktiv");
        } catch { /* silent */ }
      }
    };
    requestWakeLock();
    const handleVis = () => { if (document.visibilityState === "visible" && active) requestWakeLock(); };
    document.addEventListener("visibilitychange", handleVis);
    return () => {
      document.removeEventListener("visibilitychange", handleVis);
      if (wakeLockRef.current) { wakeLockRef.current.release(); wakeLockRef.current = null; }
    };
  }, [active, addLog]);

  const apiCall = useCallback(async (endpoint: string, method: string = "GET", body?: any) => {
    if (!apiKey || !gatewayUrl) return null;
    try {
      const res = await fetch(`${gatewayUrl}/${endpoint}`, {
        method,
        headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e: any) { setError(e.message); return null; }
  }, [apiKey, gatewayUrl]);

  // Heartbeat
  useEffect(() => {
    if (!apiKey || !gatewayUrl) return;
    const sendHeartbeat = async () => {
      const result = await apiCall("heartbeat", "POST");
      if (result?.ok) { setConnected(true); setError(null); } else { setConnected(false); }
    };
    sendHeartbeat();
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current); };
  }, [apiKey, gatewayUrl, apiCall]);

  // Poll
  const pollMessages = useCallback(async () => {
    const result = await apiCall("pending");
    if (result?.messages) {
      setPending(prev => {
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

  // Fire SMS intent via hidden iframe (avoids navigating away from page)
  const fireSmsIntent = useCallback((phone: string, message: string) => {
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
    
    // Try iframe approach first (keeps gateway page in foreground)
    if (iframeRef.current) {
      iframeRef.current.src = smsUrl;
    } else {
      // Fallback: use link click
      const link = document.createElement("a");
      link.href = smsUrl;
      link.click();
    }
  }, []);

  // Send a single SMS
  const sendSms = useCallback(async (msg: PendingMessage): Promise<boolean> => {
    setSending(msg.id);
    addLog(`📤 Sender til ${msg.phone}...`);

    // Fire the SMS intent
    fireSmsIntent(msg.phone, msg.message);

    // Wait for the SMS app to process
    await new Promise(resolve => setTimeout(resolve, sendDelay));

    if (autoMarkSent) {
      // Auto-report as sent to backend
      const result = await apiCall("sent", "POST", { message_id: msg.id, success: true });
      if (result?.ok) {
        setStats(s => ({ ...s, sent: s.sent + 1 }));
        setPending(p => p.filter(m => m.id !== msg.id));
        addLog(`✅ Sendt til ${msg.phone}`);
      } else {
        addLog(`⚠️ Rapporteringsfeil for ${msg.phone}`);
      }
    } else {
      // Remove from local queue but don't report
      setPending(p => p.filter(m => m.id !== msg.id));
      addLog(`📨 Intent sendt til ${msg.phone} (manuell bekreftelse)`);
    }

    setSending(null);
    return true;
  }, [apiCall, addLog, sendDelay, autoMarkSent, fireSmsIntent]);

  // Auto-process queue
  useEffect(() => {
    if (!active || pending.length === 0 || processingRef.current) return;
    const processQueue = async () => {
      processingRef.current = true;
      while (activeRef.current && pending.length > 0) {
        const msg = pending[0];
        if (!msg) break;
        await sendSms(msg);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      processingRef.current = false;
    };
    processQueue();
  }, [active, pending, sendSms]);

  const handleDeactivate = () => { setActive(false); processingRef.current = false; addLog("⏸ Gateway deaktivert"); };
  const handleActivate = () => { setActive(true); addLog("▶ Gateway aktivert — sender automatisk"); };

  const handleDisconnect = () => {
    localStorage.removeItem("gateway_api_key");
    localStorage.removeItem("gateway_url");
    localStorage.removeItem("gateway_device_name");
    localStorage.removeItem("gateway_active");
    setApiKey(null); setConnected(false); setPending([]); setActive(false);
  };

  // Not configured
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
              try { const url = new URL(text); if (url.searchParams.get("key")) window.location.href = text; } catch { /* */ }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-safe">
      {/* Hidden iframe for SMS intents (keeps page in foreground) */}
      <iframe ref={iframeRef} className="hidden" style={{ display: "none" }} />

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
            <button onClick={() => setShowSettings(!showSettings)} className="w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-zinc-800">
              <Settings size={14} className="text-zinc-400" />
            </button>
            {active ? (
              <button onClick={handleDeactivate} className="flex items-center gap-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg px-3 py-2 hover:bg-red-500/20">
                <PowerOff size={14} /> Stopp
              </button>
            ) : (
              <button onClick={handleActivate} className="flex items-center gap-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg px-3 py-2 hover:bg-emerald-500/20">
                <Power size={14} /> Start
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mx-4 mt-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
          <p className="text-xs font-semibold text-zinc-300">Innstillinger</p>
          
          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-500">Forsinkelse mellom meldinger</label>
            <div className="flex items-center gap-2">
              {[1000, 2000, 3000, 5000].map(ms => (
                <button
                  key={ms}
                  onClick={() => setSendDelay(ms)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    sendDelay === ms
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {ms / 1000}s
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-500">Auto-bekreft sending</label>
            <button
              onClick={() => setAutoMarkSent(!autoMarkSent)}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                autoMarkSent
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}
            >
              {autoMarkSent ? "✓ Meldinger markeres automatisk som sendt" : "✗ Manuell bekreftelse kreves"}
            </button>
            <p className="text-[10px] text-zinc-600">
              Når på: Gateway markerer melding som sendt etter at SMS-intensjonen er fyrt. Når av: Meldinger fjernes fra lokal kø men status endres ikke.
            </p>
          </div>
        </div>
      )}

      {/* Active banner */}
      {active && (
        <div className="mx-4 mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
          <Zap size={14} className="text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-emerald-300 font-medium">
              Gateway aktiv — prosesserer automatisk
            </p>
            <p className="text-[10px] text-emerald-400/60">
              {sending ? "Sender melding..." : `${sendDelay / 1000}s mellom meldinger • ${pending.length} i kø`}
            </p>
          </div>
          {sending && <Loader2 size={14} className="text-emerald-400 animate-spin" />}
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
            {lastPoll && <p className="text-[10px] text-zinc-600 mt-1">Sist sjekket: {lastPoll.toLocaleTimeString("nb-NO")}</p>}
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {pending.slice(0, 5).map(msg => (
              <div key={msg.id} className={`bg-zinc-900 border rounded-xl p-3 ${sending === msg.id ? "border-emerald-500/40 bg-emerald-500/5" : "border-zinc-800"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-mono text-zinc-300">{msg.phone}</p>
                  {sending === msg.id ? (
                    <div className="flex items-center gap-1">
                      <Loader2 size={12} className="text-emerald-400 animate-spin" />
                      <span className="text-[10px] text-emerald-400">Sender...</span>
                    </div>
                  ) : (
                    !active && (
                      <button onClick={() => sendSms(msg)} className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                        <Send size={10} /> Send
                      </button>
                    )
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">{msg.message}</p>
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
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-zinc-400">Aktivitetslogg</p>
          {log.length > 0 && (
            <button onClick={() => setLog([])} className="text-[10px] text-zinc-600 hover:text-zinc-400">Tøm</button>
          )}
        </div>
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

      {/* Info + disconnect */}
      <div className="p-4 mt-4 text-center space-y-3">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 text-left">
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            💡 <strong className="text-zinc-400">Tips:</strong> SMS-intensjonen åpner meldingsappen med forhåndsutfylt innhold. 
            På de fleste Android-enheter vil meldingen fylles inn automatisk. Aktiver «Auto-bekreft» i innstillinger for å automatisk markere meldinger som sendt.
          </p>
        </div>
        <button onClick={handleDisconnect} className="text-[10px] text-zinc-600 hover:text-zinc-400 underline">
          Koble fra enhet
        </button>
        <p className="text-[10px] text-zinc-700">
          Poller hvert {POLL_INTERVAL / 1000}s • Forsinkelse {sendDelay / 1000}s
        </p>
      </div>
    </div>
  );
};

export default Gateway;
