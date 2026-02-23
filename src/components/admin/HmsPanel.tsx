import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, Trash2, Edit2, Upload, FileText, Shield, ChevronRight,
  Search, MessageSquare, Send, Bot, User, Loader2, BookOpen
} from "lucide-react";
import DOMPurify from "dompurify";

interface HmsDoc {
  id: string;
  title: string;
  content: string;
  file_url: string;
  file_name: string;
  sort_order: number;
}

const HmsPanel = () => {
  const { isAdmin } = useAuth();
  const [docs, setDocs] = useState<HmsDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HmsDoc | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchDocs = async () => {
    const { data } = await supabase.from("hms_documents").select("*").order("sort_order").order("created_at");
    setDocs((data as HmsDoc[]) || []);
    setLoading(false);
    if (data && data.length > 0 && !activeDoc) setActiveDoc(data[0].id);
  };

  useEffect(() => { fetchDocs(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileData: { file_url?: string; file_name?: string } = {};
    if (selectedFile) {
      const path = `hms/${Date.now()}-${selectedFile.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (ud) fileData = { file_url: path, file_name: selectedFile.name };
    }
    if (editing) {
      await supabase.from("hms_documents").update({ ...form, ...fileData }).eq("id", editing.id);
    } else {
      await supabase.from("hms_documents").insert([{ ...form, ...fileData }]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null);
    setForm({ title: "", content: "" });
    fetchDocs();
    setUploading(false);
  };

  const del = async (doc: HmsDoc) => {
    if (!confirm("Slett HMS-dokument?")) return;
    await supabase.from("hms_documents").delete().eq("id", doc.id);
    fetchDocs();
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user" as const, content: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hms-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      if (!resp.ok || !resp.body) {
        throw new Error("Feil ved chat");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch { /* partial json */ }
        }
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Beklager, noe gikk galt. Prøv igjen." }]);
    }
    setChatLoading(false);
  };

  const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  const currentDoc = docs.find(d => d.id === activeDoc);

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-primary" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium">HMS-håndbok</p>
            <p className="text-[10px] text-muted-foreground">{docs.length} kapitler</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${showChat ? "bg-primary text-primary-foreground" : "border border-border/20 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}
          >
            <Bot size={14} /> HMS-assistent
          </button>
          {isAdmin && (
            <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", content: "" }); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
              <Plus size={14} /> Nytt kapittel
            </button>
          )}
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="glass rounded-2xl border border-primary/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/10 bg-primary/5">
            <Bot size={16} className="text-primary" />
            <p className="text-sm font-medium">HMS-assistent</p>
            <span className="text-[9px] tracking-widest uppercase text-muted-foreground ml-auto">AI-drevet</span>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <Bot size={28} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Still et spørsmål om HMS-boken</p>
                <p className="text-[10px] text-muted-foreground/50 mt-1">Jeg kan svare på alt som står i håndboken</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && <Bot size={14} className="text-primary mt-1 shrink-0" />}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 border border-border/10"
                }`}>
                  <p className="whitespace-pre-wrap font-light leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === "user" && <User size={14} className="text-muted-foreground mt-1 shrink-0" />}
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-2">
                <Bot size={14} className="text-primary mt-1 shrink-0" />
                <div className="bg-muted/50 border border-border/10 rounded-2xl px-4 py-2.5">
                  <Loader2 size={14} className="animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-border/10 p-3 flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Spør om HMS…"
              className="flex-1 h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger" : "Nytt HMS-kapittel"}</h3>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel" required className={inputCls} />
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Innhold…" rows={8}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <p className="text-xs text-muted-foreground">{selectedFile ? selectedFile.name : "Vedlegg (valgfritt)"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {uploading ? "Lagrer…" : "Lagre"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      {/* Content area */}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
        {/* Sidebar */}
        <div className="glass rounded-2xl border border-border/20 p-3 space-y-2">
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Søk i kapitler…"
              className="w-full h-9 rounded-lg border border-border/20 bg-muted/20 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
            {filteredDocs.map((doc, i) => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                  activeDoc === doc.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <span className="w-5 h-5 rounded-lg bg-muted/50 flex items-center justify-center text-[9px] font-medium shrink-0">
                  {i + 1}
                </span>
                <span className="truncate font-light">{doc.title}</span>
                {activeDoc === doc.id && <ChevronRight size={11} className="ml-auto shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="glass rounded-2xl border border-border/20 p-6 md:p-8 min-h-[300px]">
          {currentDoc ? (
            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-primary/60 mb-1">
                    Kapittel {docs.findIndex(d => d.id === currentDoc.id) + 1}
                  </p>
                  <h2 className="font-heading text-xl md:text-2xl">{currentDoc.title}</h2>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setEditing(currentDoc); setForm({ title: currentDoc.title, content: currentDoc.content || "" }); setShowForm(true); }}
                      className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                    <button onClick={() => del(currentDoc)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
              <div className="line-accent mb-6" />
              {currentDoc.content ? (
                <div className="bg-white dark:bg-white/95 text-black rounded-xl shadow-md border border-border/10 p-8 md:p-12 max-w-[210mm] mx-auto font-serif text-[13px] leading-[1.8] space-y-4 whitespace-pre-wrap">
                  {currentDoc.content}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Ingen innhold lagt til ennå.</p>
              )}
              {currentDoc.file_name && (
                <button onClick={async () => {
                  const { data } = await supabase.storage.from("internal-docs").createSignedUrl(currentDoc.file_url, 3600);
                  if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                }}
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl border border-border/20 text-xs text-primary hover:bg-primary/5 transition-colors">
                  <FileText size={12} /> {currentDoc.file_name}
                </button>
              )}

              {/* Prev/Next nav */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/10">
                {docs.findIndex(d => d.id === currentDoc.id) > 0 ? (
                  <button
                    onClick={() => setActiveDoc(docs[docs.findIndex(d => d.id === currentDoc.id) - 1].id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← {docs[docs.findIndex(d => d.id === currentDoc.id) - 1].title}
                  </button>
                ) : <div />}
                {docs.findIndex(d => d.id === currentDoc.id) < docs.length - 1 ? (
                  <button
                    onClick={() => setActiveDoc(docs[docs.findIndex(d => d.id === currentDoc.id) + 1].id)}
                    className="text-xs text-primary hover:underline transition-colors"
                  >
                    {docs[docs.findIndex(d => d.id === currentDoc.id) + 1].title} →
                  </button>
                ) : <div />}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen size={28} className="mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">Velg et kapittel fra listen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HmsPanel;
