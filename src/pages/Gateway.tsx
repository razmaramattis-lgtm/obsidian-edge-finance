import { useState, useEffect, useCallback, useRef } from "react";
import { Smartphone, Wifi, WifiOff, Send, CheckCircle, XCircle, Loader2, Signal, RefreshCw } from "lucide-react";

const POLL_INTERVAL = 5000;
const HEARTBEAT_INTERVAL = 30000;

interface PendingMessage {
  id: string;
  phone: string;
  message: string;
}

const Gateway = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [gatewayUrl, setGatewayUrl] = useState<string>("");
  const [deviceName, setDeviceName] = useState<string>("Ukjent enhet");
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [stats, setStats] = useState({ sent: 0, failed: 0, total: 0 });
  const [lastPoll, setLastPoll] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

      // Clean URL
      if (params.has("key")) {
        window.history.replaceState({}, "", "/gateway");
      }
    }
  }, []);

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
      setPending(result.messages);
      setLastPoll(new Date());
      setStats(s => ({ ...s, total: s.total + result.messages.length }));
    }
  }, [apiCall]);

  useEffect(() => {
    if (!apiKey || !gatewayUrl) return;
    pollMessages();
    pollRef.current = setInterval(pollMessages, POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [apiKey, gatewayUrl, pollMessages]);

  // Send a single SMS via sms: intent
  const sendSms = useCallback(async (msg: PendingMessage) => {
    setSending(msg.id);

    // Try to open SMS app with pre-filled content
    const smsUrl = `sms:${msg.phone}?body=${encodeURIComponent(msg.message)}`;
    window.open(smsUrl, "_self");

    // After a delay, ask user if it was sent
    setTimeout(() => {
      const success = window.confirm(`Ble SMS til ${msg.phone} sendt?`);
      apiCall("sent", "POST", {
        message_id: msg.id,
        success,
        error_message: success ? undefined : "Bruker avbrøt",
      });
      setStats(s => success
        ? { ...s, sent: s.sent + 1 }
        : { ...s, failed: s.failed + 1 }
      );
      setPending(p => p.filter(m => m.id !== msg.id));
      setSending(null);
    }, 2000);
  }, [apiCall]);

  // Auto-send mode
  useEffect(() => {
    if (!autoMode || pending.length === 0 || sending) return;
    sendSms(pending[0]);
  }, [autoMode, pending, sending, sendSms]);

  const handleDisconnect = () => {
    localStorage.removeItem("gateway_api_key");
    localStorage.removeItem("gateway_url");
    localStorage.removeItem("gateway_device_name");
    setApiKey(null);
    setConnected(false);
    setPending([]);
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
          <button onClick={handleDisconnect} className="text-[10px] text-zinc-500 border border-zinc-800 rounded-lg px-2.5 py-1.5 hover:bg-zinc-900">
            Koble fra
          </button>
        </div>
      </div>

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

      {/* Auto-mode toggle */}
      <div className="px-4 mb-3">
        <button
          onClick={() => setAutoMode(!autoMode)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
            autoMode
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "bg-zinc-900 border border-zinc-800 text-zinc-300"
          }`}
        >
          {autoMode ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {autoMode ? "Sender automatisk..." : "Start automatisk sending"}
        </button>
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
          <p className="text-xs font-medium text-zinc-400">Meldingskø</p>
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
          <div className="space-y-2">
            {pending.map(msg => (
              <div key={msg.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-mono text-zinc-300">{msg.phone}</p>
                  <button
                    onClick={() => sendSms(msg)}
                    disabled={!!sending}
                    className="flex items-center gap-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg px-2.5 py-1 hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    {sending === msg.id ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
                    Send
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="p-4 mt-6 text-center">
        <p className="text-[10px] text-zinc-600">
          Poller hvert {POLL_INTERVAL / 1000}s • Heartbeat hvert {HEARTBEAT_INTERVAL / 1000}s
        </p>
      </div>
    </div>
  );
};

export default Gateway;
