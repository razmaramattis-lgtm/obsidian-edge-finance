import { useState, useRef, useEffect } from "react";
import { Send, BookOpen, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

const thinkingPhrases = [
  "La meg sjekke ressursene våre…",
  "Hmm, la meg tenke litt på det…",
  "Et øyeblikk, jeg leter gjennom oppslagsverket…",
  "Jeg undersøker dette for deg…",
  "Bare et sekund, jeg finner frem informasjonen…",
];

const AvaAvatar = ({ speaking = false, size = 36 }: { speaking?: boolean; size?: number }) => (
  <motion.div
    className="relative shrink-0"
    style={{ width: size, height: size }}
    animate={speaking ? { scale: [1, 1.05, 1] } : {}}
    transition={speaking ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
  >
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Head */}
      <circle cx="50" cy="42" r="28" fill="hsl(var(--primary))" opacity="0.15" />
      <circle cx="50" cy="42" r="24" fill="hsl(var(--primary))" opacity="0.25" />
      {/* Face */}
      <circle cx="50" cy="42" r="20" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
      {/* Eyes */}
      <motion.ellipse
        cx="42" cy="39" rx="2.5" ry={speaking ? 3 : 2.5}
        fill="hsl(var(--primary))"
        animate={speaking ? { ry: [2.5, 3, 2.5, 0.5, 2.5] } : { ry: [2.5, 2.5, 0.5, 2.5] }}
        transition={{ duration: speaking ? 2 : 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="58" cy="39" rx="2.5" ry={speaking ? 3 : 2.5}
        fill="hsl(var(--primary))"
        animate={speaking ? { ry: [2.5, 3, 2.5, 0.5, 2.5] } : { ry: [2.5, 2.5, 0.5, 2.5] }}
        transition={{ duration: speaking ? 2 : 4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      />
      {/* Mouth */}
      <motion.path
        d={speaking ? "M43 48 Q50 54 57 48" : "M44 47 Q50 51 56 47"}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={speaking ? { d: ["M43 48 Q50 54 57 48", "M43 48 Q50 52 57 48", "M43 48 Q50 54 57 48"] } : {}}
        transition={speaking ? { duration: 0.8, repeat: Infinity } : {}}
      />
      {/* Blush */}
      <circle cx="36" cy="44" r="3" fill="hsl(var(--primary))" opacity="0.08" />
      <circle cx="64" cy="44" r="3" fill="hsl(var(--primary))" opacity="0.08" />
      {/* Sparkle */}
      <motion.circle
        cx="72" cy="28" r="2"
        fill="hsl(var(--primary))"
        opacity="0.4"
        animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  </motion.div>
);

const ThinkingIndicator = () => {
  const [phrase] = useState(() => thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 items-start"
    >
      <AvaAvatar speaking size={32} />
      <div className="bg-muted/50 border border-border/10 rounded-2xl px-4 py-3 max-w-[80%]">
        <p className="text-sm text-muted-foreground italic font-light">{phrase}</p>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/40"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const KnowledgeBasePanel = () => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

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
      setMessages(prev => [...prev, { role: "assistant", content: "Beklager, noe gikk galt. Prøv igjen om litt! 😊" }]);
    }
    setLoading(false);
  };

  const quickQuestions = [
    "Hvilken konto bruker jeg for kontorutstyr?",
    "Hva dekker HMS-håndboken?",
    "Vis alle samarbeidsavtaler",
    "Hva inkluderer Pro-pakken?",
    "Forklar mva-regler for konto 3000",
    "Hvilke maler har vi?",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AvaAvatar size={42} />
        <div>
          <p className="text-sm font-medium">Ava — Oppslagsverk</p>
          <p className="text-[10px] text-muted-foreground">Din personlige rådgiver for alle bedriftens ressurser</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/20 overflow-hidden">
        {/* Messages */}
        <div className="h-[450px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <AvaAvatar size={56} />
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Hei! Jeg er Ava 👋</p>
                <p className="text-xs text-muted-foreground mb-6 max-w-sm mx-auto">
                  Spør meg om kontoplan, HMS, maler, avtaler, tjenester eller priser — jeg finner frem det du trenger.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                {quickQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="px-3 py-1.5 rounded-full border border-border/20 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && <AvaAvatar speaking={loading && i === messages.length - 1} size={32} />}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 border border-border/10"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none font-light leading-relaxed [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_li]:mb-0.5 [&_strong]:text-foreground">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap font-light leading-relaxed">{msg.content}</p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-muted-foreground">Du</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && !messages.some((m, i) => m.role === "assistant" && i === messages.length - 1) && (
            <ThinkingIndicator />
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/10 p-3 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Spør Ava om hva som helst…"
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
