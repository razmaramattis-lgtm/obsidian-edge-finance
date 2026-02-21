import { useState, useRef, useEffect } from "react";
import { Search, Send, Bot, User, Loader2, BookOpen, Sparkles } from "lucide-react";

const KnowledgeBasePanel = () => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/knowledge-base`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMsgs }),
        }
      );

      if (!resp.ok || !resp.body) throw new Error("Feil");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              content += delta;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content } : m);
                }
                return [...prev, { role: "assistant", content }];
              });
            }
          } catch { /* partial */ }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Beklager, noe gikk galt. Prøv igjen." }]);
    }
    setLoading(false);
  };

  const quickQuestions = [
    "Hvilke maler har vi tilgjengelig?",
    "Hva dekker HMS-håndboken?",
    "Vis alle samarbeidsavtaler",
    "Hva inkluderer Pro-pakken?",
    "Hvilke tjenester tilbyr vi?",
    "Vis arkivfiler og dokumenter",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Sparkles size={18} className="text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium">Oppslagsverk</p>
          <p className="text-[10px] text-muted-foreground">AI-drevet søk i alle bedriftens ressurser</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/20 overflow-hidden">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <BookOpen size={36} className="mx-auto text-muted-foreground/20 mb-4" />
              <p className="text-sm font-medium mb-1">Velkommen til oppslagsverket</p>
              <p className="text-xs text-muted-foreground mb-6">Søk i HMS-bok, maler, arkiv, avtaler, tjenester og priser</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                {quickQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="px-3 py-1.5 rounded-full border border-border/20 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={13} className="text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 border border-border/10"
              }`}>
                <p className="whitespace-pre-wrap font-light leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={13} className="text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bot size={13} className="text-primary" />
              </div>
              <div className="bg-muted/50 border border-border/10 rounded-2xl px-4 py-3">
                <Loader2 size={14} className="animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/10 p-3 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Søk i alle ressurser…"
            className="flex-1 h-10 rounded-xl border border-border/20 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePanel;
