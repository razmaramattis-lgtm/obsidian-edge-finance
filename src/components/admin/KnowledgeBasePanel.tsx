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
    style={{ width: size, height: size * 140 / 120 }}
    animate={speaking ? { y: [0, -2, 0] } : { y: [0, -3, 0] }}
    transition={{ duration: speaking ? 1 : 3, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 120 140" width={size} height={size * 140 / 120}>
      {/* Ambient glow */}
      <motion.circle
        cx="60" cy="65" r="55"
        fill="hsl(var(--primary))"
        opacity="0.06"
        animate={{ r: [50, 55, 50], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Body */}
      <motion.path
        d="M40 88 Q40 78 50 75 L70 75 Q80 78 80 88 L82 110 Q82 118 60 120 Q38 118 38 110 Z"
        fill="hsl(var(--primary))" opacity="0.2"
        animate={speaking ? { d: [
          "M40 88 Q40 78 50 75 L70 75 Q80 78 80 88 L82 110 Q82 118 60 120 Q38 118 38 110 Z",
          "M39 87 Q39 77 50 74 L70 74 Q81 77 81 87 L83 110 Q83 119 60 121 Q37 119 37 110 Z",
          "M40 88 Q40 78 50 75 L70 75 Q80 78 80 88 L82 110 Q82 118 60 120 Q38 118 38 110 Z",
        ]} : {}}
        transition={speaking ? { duration: 2, repeat: Infinity } : {}}
      />
      <path d="M48 76 L60 82 L72 76" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>

      {/* Arms */}
      <motion.path
        d="M40 82 Q30 88 28 100 Q27 106 32 108"
        fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.2"
        animate={speaking ? { d: [
          "M40 82 Q30 88 28 100 Q27 106 32 108",
          "M40 82 Q28 85 24 96 Q22 102 27 106",
          "M40 82 Q30 88 28 100 Q27 106 32 108",
        ]} : {}}
        transition={speaking ? { duration: 1.8, repeat: Infinity } : {}}
      />
      <motion.path
        d="M80 82 Q90 88 92 100 Q93 106 88 108"
        fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.2"
        animate={speaking ? { d: [
          "M80 82 Q90 88 92 100 Q93 106 88 108",
          "M80 82 Q92 85 96 96 Q98 102 93 106",
          "M80 82 Q90 88 92 100 Q93 106 88 108",
        ]} : {}}
        transition={speaking ? { duration: 1.8, repeat: Infinity, delay: 0.3 } : {}}
      />

      {/* Neck */}
      <rect x="54" y="66" width="12" height="10" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.3"/>

      {/* Head */}
      <circle cx="60" cy="44" r="26" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2.5" />

      {/* Hair */}
      <path d="M34 40 Q34 18 60 16 Q86 18 86 40 Q86 32 78 26 Q68 20 60 20 Q52 20 42 26 Q34 32 34 40" fill="hsl(var(--primary))" opacity="0.25" />
      <motion.path
        d="M52 18 Q54 10 58 14" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" opacity="0.3"
        animate={{ d: ["M52 18 Q54 10 58 14", "M52 18 Q56 8 59 13", "M52 18 Q54 10 58 14"] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Eyes */}
      <motion.ellipse cx="50" cy="42" rx="3.5" ry="4" fill="hsl(var(--primary))"
        animate={speaking ? { ry: [4, 4.5, 4, 0.8, 4] } : { ry: [4, 4, 0.8, 4] }}
        transition={{ duration: speaking ? 2.5 : 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="48" cy="40" r="1.2" fill="hsl(var(--background))" opacity="0.8" />
      <motion.ellipse cx="70" cy="42" rx="3.5" ry="4" fill="hsl(var(--primary))"
        animate={speaking ? { ry: [4, 4.5, 4, 0.8, 4] } : { ry: [4, 4, 0.8, 4] }}
        transition={{ duration: speaking ? 2.5 : 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      />
      <circle cx="68" cy="40" r="1.2" fill="hsl(var(--background))" opacity="0.8" />

      {/* Eyebrows */}
      <motion.path d="M45 35 Q50 33 55 35" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"
        animate={speaking ? { d: ["M45 35 Q50 33 55 35", "M45 33 Q50 31 55 33", "M45 35 Q50 33 55 35"] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path d="M65 35 Q70 33 75 35" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"
        animate={speaking ? { d: ["M65 35 Q70 33 75 35", "M65 33 Q70 31 75 33", "M65 35 Q70 33 75 35"] } : {}}
        transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
      />

      {/* Nose */}
      <path d="M59 47 Q60 49 61 47" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.2" strokeLinecap="round"/>

      {/* Mouth */}
      <motion.path
        d={speaking ? "M51 54 Q60 62 69 54" : "M53 53 Q60 58 67 53"}
        fill={speaking ? "hsl(var(--primary))" : "none"}
        fillOpacity={speaking ? 0.1 : 0}
        stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"
        animate={speaking ? { d: [
          "M51 54 Q60 62 69 54", "M52 54 Q60 59 68 54", "M51 54 Q60 62 69 54", "M53 54 Q60 57 67 54", "M51 54 Q60 62 69 54",
        ]} : {}}
        transition={speaking ? { duration: 1.2, repeat: Infinity } : {}}
      />

      {/* Blush */}
      <circle cx="40" cy="48" r="4" fill="hsl(var(--primary))" opacity="0.08" />
      <circle cx="80" cy="48" r="4" fill="hsl(var(--primary))" opacity="0.08" />

      {/* Floating sparkles */}
      <motion.path d="M92 22 L94 18 L96 22 L94 26 Z" fill="hsl(var(--primary))" opacity="0.5"
        animate={{ rotate: [0, 180, 360], scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "94px 22px" }}
      />
      <motion.path d="M24 30 L26 27 L28 30 L26 33 Z" fill="hsl(var(--primary))" opacity="0.4"
        animate={{ rotate: [0, -180, -360], scale: [0.6, 1, 0.6], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        style={{ transformOrigin: "26px 30px" }}
      />
      <motion.circle cx="18" cy="60" r="1.5" fill="hsl(var(--primary))"
        animate={{ cy: [60, 55, 60], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle cx="102" cy="55" r="1.5" fill="hsl(var(--primary))"
        animate={{ cy: [55, 50, 55], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
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
