import { useState, useRef, useEffect } from "react";
import { Send, BookOpen, Sparkles, Download, Calculator, FileText, Archive, Database, Shield, Users, Handshake, RotateCcw, Search, ChevronDown, ChevronUp, Link2, X } from "lucide-react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
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
    style={{ width: size, height: size * 150 / 120 }}
    animate={speaking ? { y: [0, -2, 0] } : { y: [0, -3, 0] }}
    transition={{ duration: speaking ? 1 : 3, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 120 150" width={size} height={size * 150 / 120}>
      <defs>
        {/* Skin gradient */}
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fddcca" />
          <stop offset="70%" stopColor="#f5c4a8" />
          <stop offset="100%" stopColor="#e8a882" />
        </radialGradient>
        {/* Hair gradient - rich dark auburn */}
        <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d1a0e" />
          <stop offset="40%" stopColor="#6b2f1a" />
          <stop offset="100%" stopColor="#8b3a20" />
        </linearGradient>
        {/* Lip gradient */}
        <linearGradient id="lipGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e85670" />
          <stop offset="100%" stopColor="#c93d58" />
        </linearGradient>
        {/* Dress gradient - deep teal to rosegold */}
        <linearGradient id="dressGrad" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#1a6b6a" />
          <stop offset="50%" stopColor="#1f8584" />
          <stop offset="100%" stopColor="#c08b6e" />
        </linearGradient>
        {/* Eye iris */}
        <radialGradient id="irisGrad" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#5ab0a0" />
          <stop offset="60%" stopColor="#2d7d6e" />
          <stop offset="100%" stopColor="#1a5248" />
        </radialGradient>
        {/* Ambient glow */}
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e85670" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#1f8584" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        {/* Sparkle filter */}
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ambient background glow */}
      <motion.circle
        cx="60" cy="70" r="58"
        fill="url(#glowGrad)"
        animate={{ r: [55, 60, 55], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Body / Dress - elegant off-shoulder */}
      <motion.path
        d="M38 92 Q32 88 30 96 L26 130 Q26 145 60 148 Q94 145 94 130 L90 96 Q88 88 82 92 Q76 82 60 80 Q44 82 38 92 Z"
        fill="url(#dressGrad)"
        animate={speaking ? {
          d: [
            "M38 92 Q32 88 30 96 L26 130 Q26 145 60 148 Q94 145 94 130 L90 96 Q88 88 82 92 Q76 82 60 80 Q44 82 38 92 Z",
            "M37 91 Q31 87 29 95 L25 130 Q25 146 60 149 Q95 146 95 130 L91 95 Q89 87 83 91 Q77 81 60 79 Q43 81 37 91 Z",
            "M38 92 Q32 88 30 96 L26 130 Q26 145 60 148 Q94 145 94 130 L90 96 Q88 88 82 92 Q76 82 60 80 Q44 82 38 92 Z",
          ]
        } : {}}
        transition={speaking ? { duration: 2.5, repeat: Infinity } : {}}
      />
      {/* Décolletage highlight */}
      <path d="M46 88 Q60 96 74 88" fill="none" stroke="#f5c4a8" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      {/* Collarbone detail */}
      <path d="M40 86 Q48 84 54 86" fill="none" stroke="url(#skinGrad)" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <path d="M66 86 Q72 84 80 86" fill="none" stroke="url(#skinGrad)" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      {/* Dress shimmer */}
      <motion.path
        d="M45 100 Q60 104 75 100"
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Neck */}
      <path d="M52 75 L52 85 Q52 90 60 90 Q68 90 68 85 L68 75" fill="url(#skinGrad)" />
      {/* Neck shadow */}
      <ellipse cx="60" cy="85" rx="8" ry="3" fill="#d4956e" opacity="0.15" />

      {/* Head */}
      <ellipse cx="60" cy="48" rx="27" ry="30" fill="url(#skinGrad)" />

      {/* Ears */}
      <ellipse cx="33" cy="48" rx="4" ry="6" fill="#f0b896" />
      <ellipse cx="87" cy="48" rx="4" ry="6" fill="#f0b896" />
      {/* Earrings - small gold drops */}
      <motion.circle cx="33" cy="56" r="2" fill="#d4a040" filter="url(#softGlow)"
        animate={{ cy: [56, 57, 56] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx="87" cy="56" r="2" fill="#d4a040" filter="url(#softGlow)"
        animate={{ cy: [56, 57, 56] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      />

      {/* Hair - voluminous and flowing */}
      <path d="M33 45 Q30 20 42 12 Q52 6 60 8 Q68 6 78 12 Q90 20 87 45 Q88 35 82 24 Q72 14 60 14 Q48 14 38 24 Q32 35 33 45" fill="url(#hairGrad)" />
      {/* Hair volume top */}
      <path d="M36 38 Q34 18 48 10 Q56 5 64 10 Q78 6 84 18 Q88 28 86 38 Q84 26 76 18 Q66 10 56 12 Q44 10 38 22 Q36 30 36 38" fill="#4a1e10" opacity="0.6" />
      {/* Flowing hair strands */}
      <motion.path
        d="M34 42 Q28 55 26 72 Q25 80 28 85"
        fill="none" stroke="url(#hairGrad)" strokeWidth="8" strokeLinecap="round"
        animate={{ d: [
          "M34 42 Q28 55 26 72 Q25 80 28 85",
          "M34 42 Q26 56 24 73 Q23 82 27 87",
          "M34 42 Q28 55 26 72 Q25 80 28 85",
        ] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M86 42 Q92 55 94 72 Q95 80 92 85"
        fill="none" stroke="url(#hairGrad)" strokeWidth="7" strokeLinecap="round"
        animate={{ d: [
          "M86 42 Q92 55 94 72 Q95 80 92 85",
          "M86 42 Q94 56 96 73 Q97 82 93 87",
          "M86 42 Q92 55 94 72 Q95 80 92 85",
        ] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Hair highlight strands */}
      <path d="M50 12 Q54 8 58 12" fill="none" stroke="#8b5e3c" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <path d="M62 10 Q66 7 70 12" fill="none" stroke="#8b5e3c" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

      {/* Eyebrows - defined arches */}
      <motion.path d="M43 33 Q48 29 56 32" fill="none" stroke="#5a2a14" strokeWidth="1.8" strokeLinecap="round"
        animate={speaking ? { d: ["M43 33 Q48 29 56 32", "M43 31 Q48 27 56 30", "M43 33 Q48 29 56 32"] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path d="M64 32 Q72 29 77 33" fill="none" stroke="#5a2a14" strokeWidth="1.8" strokeLinecap="round"
        animate={speaking ? { d: ["M64 32 Q72 29 77 33", "M64 30 Q72 27 77 31", "M64 32 Q72 29 77 33"] } : {}}
        transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
      />

      {/* Eyes - detailed with lashes */}
      {/* Left eye */}
      <ellipse cx="50" cy="42" rx="7" ry="5" fill="white" />
      <motion.ellipse cx="50" cy="42" rx="4" ry="4" fill="url(#irisGrad)"
        animate={speaking ? { ry: [4, 4.5, 4, 0.5, 4] } : { ry: [4, 4, 0.5, 4] }}
        transition={{ duration: speaking ? 2.5 : 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="50" cy="42" r="2" fill="#0e2e28" />
      <circle cx="48" cy="40" r="1.5" fill="white" opacity="0.9" />
      <circle cx="52" cy="41" r="0.7" fill="white" opacity="0.5" />
      {/* Left eyeliner + lashes */}
      <path d="M43 40 Q46 37 50 37 Q54 37 57 40" fill="none" stroke="#2a1208" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M43 40 L40 38" fill="none" stroke="#2a1208" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M44 39 L42 36" fill="none" stroke="#2a1208" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M46 38 L45 35" fill="none" stroke="#2a1208" strokeWidth="0.5" strokeLinecap="round" />

      {/* Right eye */}
      <ellipse cx="70" cy="42" rx="7" ry="5" fill="white" />
      <motion.ellipse cx="70" cy="42" rx="4" ry="4" fill="url(#irisGrad)"
        animate={speaking ? { ry: [4, 4.5, 4, 0.5, 4] } : { ry: [4, 4, 0.5, 4] }}
        transition={{ duration: speaking ? 2.5 : 5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      />
      <circle cx="70" cy="42" r="2" fill="#0e2e28" />
      <circle cx="68" cy="40" r="1.5" fill="white" opacity="0.9" />
      <circle cx="72" cy="41" r="0.7" fill="white" opacity="0.5" />
      {/* Right eyeliner + lashes */}
      <path d="M63 40 Q66 37 70 37 Q74 37 77 40" fill="none" stroke="#2a1208" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M77 40 L80 38" fill="none" stroke="#2a1208" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M76 39 L78 36" fill="none" stroke="#2a1208" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M74 38 L75 35" fill="none" stroke="#2a1208" strokeWidth="0.5" strokeLinecap="round" />

      {/* Nose */}
      <path d="M58 48 Q60 52 62 48" fill="none" stroke="#d09070" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <circle cx="57" cy="50" r="1" fill="#d09070" opacity="0.15" />
      <circle cx="63" cy="50" r="1" fill="#d09070" opacity="0.15" />

      {/* Lips - full and colorful */}
      <motion.path
        d={speaking ? "M49 56 Q54 53 60 55 Q66 53 71 56 Q66 63 60 64 Q54 63 49 56 Z" : "M50 56 Q55 53 60 55 Q65 53 70 56 Q65 61 60 62 Q55 61 50 56 Z"}
        fill="url(#lipGrad)"
        animate={speaking ? { d: [
          "M49 56 Q54 53 60 55 Q66 53 71 56 Q66 63 60 64 Q54 63 49 56 Z",
          "M50 56 Q55 54 60 55 Q65 54 70 56 Q65 60 60 61 Q55 60 50 56 Z",
          "M49 56 Q54 53 60 55 Q66 53 71 56 Q66 63 60 64 Q54 63 49 56 Z",
          "M49 55 Q54 52 60 54 Q66 52 71 55 Q66 64 60 65 Q54 64 49 55 Z",
          "M49 56 Q54 53 60 55 Q66 53 71 56 Q66 63 60 64 Q54 63 49 56 Z",
        ]} : {}}
        transition={speaking ? { duration: 1.2, repeat: Infinity } : {}}
      />
      {/* Lip highlight */}
      <path d="M54 55 Q58 53 62 55" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeLinecap="round" />
      {/* Upper lip line */}
      <path d="M50 56 Q55 53 60 55 Q65 53 70 56" fill="none" stroke="#a8304a" strokeWidth="0.6" strokeLinecap="round" />

      {/* Blush - rosy cheeks */}
      <motion.ellipse cx="40" cy="50" rx="6" ry="4" fill="#e85670" opacity="0.1"
        animate={{ opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.ellipse cx="80" cy="50" rx="6" ry="4" fill="#e85670" opacity="0.1"
        animate={{ opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />

      {/* Necklace - delicate gold chain */}
      <path d="M44 78 Q52 82 60 80 Q68 82 76 78" fill="none" stroke="#d4a040" strokeWidth="0.8" opacity="0.6" />
      <motion.circle cx="60" cy="81" r="2.5" fill="#d4a040" opacity="0.7" filter="url(#softGlow)"
        animate={{ cy: [81, 82, 81] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Floating sparkles - colorful */}
      <motion.path d="M96 18 L98 14 L100 18 L98 22 Z" fill="#e85670" opacity="0.6" filter="url(#softGlow)"
        animate={{ rotate: [0, 180, 360], scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "98px 18px" }}
      />
      <motion.path d="M20 26 L22 23 L24 26 L22 29 Z" fill="#1f8584" opacity="0.5" filter="url(#softGlow)"
        animate={{ rotate: [0, -180, -360], scale: [0.6, 1.1, 0.6], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        style={{ transformOrigin: "22px 26px" }}
      />
      <motion.circle cx="14" cy="60" r="2" fill="#d4a040"
        animate={{ cy: [60, 54, 60], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle cx="106" cy="50" r="1.8" fill="#e85670"
        animate={{ cy: [50, 44, 50], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
      />
      <motion.path d="M108 70 L110 67 L112 70 L110 73 Z" fill="#d4a040" opacity="0.4"
        animate={{ rotate: [0, 90, 180], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
        style={{ transformOrigin: "110px 70px" }}
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

const AVA_CATEGORIES = [
  { key: "kontoplan", label: "Kontoplan", icon: Calculator, color: "text-blue-500" },
  { key: "regnskapsord", label: "Regnskapsord", icon: BookOpen, color: "text-emerald-500" },
  { key: "dokumentmaler", label: "Dokumentmaler", icon: FileText, color: "text-violet-500" },
  { key: "arkiv", label: "Arkiv & Maler", icon: Archive, color: "text-amber-500" },
  { key: "datasenter", label: "Datasenter", icon: Database, color: "text-cyan-500" },
  { key: "hms", label: "HMS-håndbok", icon: Shield, color: "text-red-500" },
  { key: "personalhandbok", label: "Personalhåndbok", icon: Users, color: "text-pink-500" },
  { key: "samarbeidsavtaler", label: "Samarbeidsavtaler", icon: Handshake, color: "text-orange-500" },
  { key: "alt", label: "Søk i alt", icon: Search, color: "text-primary" },
];

interface OrgDoc {
  title: string;
  url?: string;
  file_name?: string;
  source: string;
  category?: string;
}

const KnowledgeBasePanel = () => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedAlts, setExpandedAlts] = useState<Set<number>>(new Set());
  const [overrideInput, setOverrideInput] = useState<{ msgIdx: number; searchTerm: string } | null>(null);
  const [overrideValue, setOverrideValue] = useState("");
  const [overrideSaving, setOverrideSaving] = useState(false);
  // Document linking state
  const [docPicker, setDocPicker] = useState<{ msgIdx: number; searchTerm: string } | null>(null);
  const [docList, setDocList] = useState<OrgDoc[]>([]);
  const [docListLoading, setDocListLoading] = useState(false);
  const [docFilter, setDocFilter] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error("Ikke innlogget");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const headers = await getAuthHeaders();
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/knowledge-base`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ messages: newMsgs, category: selectedCategory || "alt" }),
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

  const resetChat = () => {
    setMessages([]);
    setSelectedCategory(null);
    setInput("");
    setExpandedAlts(new Set());
  };

  const saveOverride = async (searchTerm: string, accountNum: string) => {
    setOverrideSaving(true);
    try {
      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/knowledge-base`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: "set_override", search_term: searchTerm, preferred_account: accountNum }),
        }
      );
      setOverrideInput(null);
      setOverrideValue("");
      setMessages(prev => [...prev, { role: "assistant", content: `✅ Lagret! Neste gang noen søker på «${searchTerm}» viser jeg konto **${accountNum}** først.` }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Beklager, kunne ikke lagre endringen. Prøv igjen." }]);
    }
    setOverrideSaving(false);
  };

  const openDocPicker = async (msgIdx: number, searchTerm: string) => {
    setDocPicker({ msgIdx, searchTerm });
    setDocFilter("");
    setDocListLoading(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/knowledge-base`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({ action: "list_documents" }),
        }
      );
      const data = await resp.json();
      setDocList(data.documents || []);
    } catch {
      setDocList([]);
    }
    setDocListLoading(false);
  };

  const linkDocument = async (searchTerm: string, doc: OrgDoc) => {
    setOverrideSaving(true);
    try {
      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/knowledge-base`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({
            action: "set_document_override",
            search_term: searchTerm,
            document_override: { title: doc.title, url: doc.url, file_name: doc.file_name, source: doc.source },
          }),
        }
      );
      setDocPicker(null);
      setMessages(prev => [...prev, { role: "assistant", content: `✅ Lagret! Neste gang noen søker på «${searchTerm}» viser jeg **${doc.title}** med nedlasting.` }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Beklager, kunne ikke lagre koblingen. Prøv igjen." }]);
    }
    setOverrideSaving(false);
  };

  const activeCat = AVA_CATEGORIES.find(c => c.key === selectedCategory);

  const mdComponents: Components = {
    a: ({ href, children }) => {
      const text = String(children);
      const isDownload = text.includes("📥") || (href && href.includes("/storage/"));
      if (isDownload && href) {
        const handleForceDownload = async (e: React.MouseEvent) => {
          e.preventDefault();
          try {
            const res = await fetch(href);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = text.replace("📥 ", "").replace("Last ned ", "") || "fil";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } catch {
            window.location.href = href;
          }
        };
        return (
          <button onClick={handleForceDownload}
            className="no-underline inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium mt-1 mb-1 cursor-pointer border-0">
            <Download size={13} />
            {text.replace("📥 ", "")}
          </button>
        );
      }
      return <a href={href} target="_blank" rel="noreferrer" className="text-primary hover:underline">{children}</a>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AvaAvatar size={42} />
        <div className="flex-1">
          <p className="text-sm font-medium">Ava — Oppslagsverk</p>
          <p className="text-[10px] text-muted-foreground">
            {selectedCategory ? `Søker i: ${activeCat?.label}` : "Velg en kategori for å starte"}
          </p>
        </div>
        {selectedCategory && (
          <button onClick={resetChat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-foreground border border-border/20 hover:border-primary/20 hover:bg-primary/5 transition-all">
            <RotateCcw size={11} /> Nullstill
          </button>
        )}
      </div>

      <div className="glass rounded-2xl border border-border/20 overflow-hidden">
        <div className="h-[450px] overflow-y-auto p-4 space-y-4">
          {/* Category selection (opening screen) */}
          {!selectedCategory && messages.length === 0 && (
            <div className="text-center py-6">
              <AvaAvatar size={56} />
              <div className="mt-4 mb-6">
                <p className="text-sm font-medium mb-1">Hei! Jeg er Ava 👋</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Hva leter du etter? Velg en kategori, så søker jeg kun der — eller velg «Søk i alt» for å lete overalt.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
                {AVA_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/15 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-muted/30 group-hover:bg-primary/10 transition-colors ${cat.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat ready state after category selected */}
          {selectedCategory && messages.length === 0 && (
            <div className="text-center py-10">
              <AvaAvatar size={48} />
              <div className="mt-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium mb-3">
                  {activeCat && <activeCat.icon size={12} />}
                  {activeCat?.label}
                </div>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Skriv inn det du leter etter, så finner jeg det for deg.
                </p>
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
                    (() => {
                      // Extract markers
                      const searchTermMatch = msg.content.match(/\[AVA_SEARCH_TERM:(.+?)\]/);
                      const docSearchMatch = msg.content.match(/\[AVA_DOC_SEARCH:(.+?)\]/);
                      const searchTerm = searchTermMatch?.[1] || null;
                      const docSearchTerm = docSearchMatch?.[1] || null;
                      const cleanContent = msg.content
                        .replace(/\[AVA_SEARCH_TERM:.+?\]/g, "")
                        .replace(/\[AVA_DOC_SEARCH:.+?\]/g, "")
                        .trim();

                      const hasAlts = cleanContent.includes("[FLERE_KONTOER]");
                      const [mainContent, altContent] = hasAlts
                        ? cleanContent.split("[FLERE_KONTOER]")
                        : [cleanContent, ""];
                      const isExpanded = expandedAlts.has(i);
                      const showingOverride = overrideInput?.msgIdx === i;
                      const showingDocPicker = docPicker?.msgIdx === i;
                      const filteredDocs = docList.filter(d =>
                        !docFilter || d.title.toLowerCase().includes(docFilter.toLowerCase()) || (d.category || "").toLowerCase().includes(docFilter.toLowerCase())
                      );
                      return (
                        <div className="prose prose-sm dark:prose-invert max-w-none font-light leading-relaxed [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_li]:mb-0.5 [&_strong]:text-foreground">
                          <ReactMarkdown components={mdComponents}>{mainContent}</ReactMarkdown>

                          {/* Override button for account results */}
                          {searchTerm && !loading && (
                            <div className="mt-2 not-prose">
                              {!showingOverride ? (
                                <button
                                  onClick={() => { setOverrideInput({ msgIdx: i, searchTerm }); setOverrideValue(""); }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] text-muted-foreground hover:text-foreground border border-border/20 hover:border-primary/20 hover:bg-primary/5 transition-all"
                                >
                                  ✏️ Feil konto? Lær Ava riktig
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    value={overrideValue}
                                    onChange={e => setOverrideValue(e.target.value)}
                                    placeholder="Kontonummer (f.eks. 6900)"
                                    className="h-7 w-32 rounded-md border border-border/30 bg-muted/20 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                                    onKeyDown={e => e.key === "Enter" && overrideValue.trim() && saveOverride(searchTerm, overrideValue.trim())}
                                  />
                                  <button
                                    onClick={() => overrideValue.trim() && saveOverride(searchTerm, overrideValue.trim())}
                                    disabled={!overrideValue.trim() || overrideSaving}
                                    className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-medium disabled:opacity-50 hover:opacity-90 transition-all"
                                  >
                                    {overrideSaving ? "Lagrer…" : "Lagre"}
                                  </button>
                                  <button
                                    onClick={() => setOverrideInput(null)}
                                    className="px-2 py-1 rounded-md text-[10px] text-muted-foreground hover:text-foreground transition-all"
                                  >
                                    Avbryt
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Document linking button for doc searches */}
                          {docSearchTerm && !loading && (
                            <div className="mt-2 not-prose">
                              {!showingDocPicker ? (
                                <button
                                  onClick={() => openDocPicker(i, docSearchTerm)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] text-muted-foreground hover:text-foreground border border-border/20 hover:border-primary/20 hover:bg-primary/5 transition-all"
                                >
                                   <Link2 size={11} /> Koble en ressurs til dette søkeordet
                                </button>
                              ) : (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="border border-border/30 rounded-xl p-3 bg-background/80 mt-1"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-[11px] font-medium text-foreground">Velg ressurs fra organisasjonsressursene:</p>
                                    <button onClick={() => setDocPicker(null)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                                  </div>
                                  <input
                                    value={docFilter}
                                    onChange={e => setDocFilter(e.target.value)}
                                    placeholder="Filtrer ressurser…"
                                    className="w-full h-7 rounded-md border border-border/30 bg-muted/20 px-2 text-xs mb-2 focus:outline-none focus:ring-1 focus:ring-primary/40"
                                  />
                                  {docListLoading ? (
                                    <p className="text-[10px] text-muted-foreground py-2">Henter dokumenter…</p>
                                  ) : (
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                      {filteredDocs.length === 0 && <p className="text-[10px] text-muted-foreground py-2">Ingen dokumenter funnet.</p>}
                                      {filteredDocs.map((doc, di) => (
                                        <button
                                          key={di}
                                          onClick={() => linkDocument(docSearchTerm, doc)}
                                          disabled={overrideSaving}
                                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all flex items-center gap-2 group"
                                        >
                                          <FileText size={12} className="text-muted-foreground group-hover:text-primary shrink-0" />
                                          <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-medium truncate text-foreground">{doc.title}</p>
                                            <p className="text-[9px] text-muted-foreground">{doc.category || doc.source}{doc.url ? " • Nedlastbar" : ""}</p>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          )}

                          {hasAlts && altContent && (
                            <div className="mt-2">
                              <button
                                onClick={() => setExpandedAlts(prev => {
                                  const next = new Set(prev);
                                  if (next.has(i)) next.delete(i); else next.add(i);
                                  return next;
                                })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/60 hover:bg-accent text-foreground text-xs font-medium transition-colors border border-border/20"
                              >
                                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                {isExpanded ? "Skjul alternativer" : "Vis flere alternativer"}
                              </button>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-2"
                                >
                                  <ReactMarkdown components={mdComponents}>{altContent}</ReactMarkdown>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()
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

        {/* Input — only show after category is selected */}
        {selectedCategory && (
          <div className="border-t border-border/10 p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={`Søk i ${activeCat?.label || "alt"}…`}
              className="flex-1 h-10 rounded-xl border border-border/20 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all">
              <Send size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePanel;
