import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Plus, Hash, Trash2 } from "lucide-react";
import { createNotification } from "@/hooks/useWorkspaceNotifications";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles?: { name: string; role: string };
}

const ChatPanel = () => {
  const { profile, isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", description: "", color: "#6366f1" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    const { data } = await supabase.from("chat_categories").select("*").order("sort_order").order("created_at");
    const cats = (data as Category[]) || [];
    setCategories(cats);
    if (cats.length > 0 && !activeCategory) setActiveCategory(cats[0]);
  };

  const fetchMessages = async (catId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*, profiles(name, role)")
      .eq("category_id", catId)
      .order("created_at");
    setMessages((data as Message[]) || []);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (!activeCategory) return;
    fetchMessages(activeCategory.id);

    const channel = supabase
      .channel(`chat-${activeCategory.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `category_id=eq.${activeCategory.id}` },
        () => fetchMessages(activeCategory.id))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeCategory?.id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeCategory || !profile) return;
    setSending(true);
    const content = newMessage.trim();
    await supabase.from("chat_messages").insert([{
      category_id: activeCategory.id,
      sender_id: profile.id,
      content,
    }]);
    // Notify all other employees/admins in this channel
    const { data: allProfiles } = await supabase.from("profiles").select("id").neq("id", profile.id);
    (allProfiles || []).forEach((p: any) => {
      createNotification({
        recipientId: p.id,
        actorId: profile.id,
        type: "chat_message",
        referenceId: activeCategory.id,
        referenceType: "chat_category",
        title: `#${activeCategory.name}`,
        body: `${profile.name}: ${content.slice(0, 80)}`,
      });
    });
    // Send email to offline users
    (allProfiles || []).forEach((p: any) => {
      supabase.functions.invoke("notify-dm-email", {
        body: { recipientId: p.id, senderName: profile.name, messagePreview: `[#${activeCategory.name}] ${content.slice(0, 100)}` },
      }).catch(() => {});
    });
    setNewMessage("");
    setSending(false);
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("chat_categories").insert([catForm]);
    setCatForm({ name: "", description: "", color: "#6366f1" });
    setShowNewCat(false);
    fetchCategories();
  };

  const delCategory = async (id: string) => {
    if (!confirm("Slett kategori og alle meldinger?")) return;
    await supabase.from("chat_categories").delete().eq("id", id);
    setActiveCategory(null);
    fetchCategories();
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border border-border/20 glass">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-border/10 flex flex-col">
        <div className="p-3 border-b border-border/10 flex items-center justify-between">
          <span className="text-xs tracking-widest uppercase text-muted-foreground">Kanaler</span>
          {isAdmin && (
            <button onClick={() => setShowNewCat(!showNewCat)} className="text-muted-foreground hover:text-primary transition-colors">
              <Plus size={14} />
            </button>
          )}
        </div>

        {showNewCat && isAdmin && (
          <form onSubmit={addCategory} className="p-3 border-b border-border/10 space-y-2">
            <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="Kanalnavn" required
              className="w-full h-8 rounded-lg border border-border/30 bg-muted/30 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
            <input value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} placeholder="Beskrivelse"
              className="w-full h-8 rounded-lg border border-border/30 bg-muted/30 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
            <div className="flex gap-2">
              <input type="color" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent" />
              <button type="submit" className="flex-1 h-8 bg-primary text-primary-foreground rounded-lg text-xs hover:opacity-90">Opprett</button>
            </div>
          </form>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {categories.map(cat => (
            <div key={cat.id} className="group flex items-center gap-1">
              <button
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs transition-all ${
                  activeCategory?.id === cat.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Hash size={11} style={{ color: cat.color }} className="shrink-0" />
                <span className="truncate">{cat.name}</span>
              </button>
              {isAdmin && (
                <button onClick={() => delCategory(cat.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1">
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">Ingen kanaler ennå</p>
          )}
        </div>
      </div>

      {/* Chat area */}
      {activeCategory ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-border/10 flex items-center gap-2">
            <Hash size={14} style={{ color: activeCategory.color }} />
            <span className="font-medium text-sm">{activeCategory.name}</span>
            {activeCategory.description && <span className="text-xs text-muted-foreground">{activeCategory.description}</span>}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === profile?.id;
              const showDate = i === 0 || formatDate(msg.created_at) !== formatDate(messages[i - 1].created_at);

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center gap-2 my-3">
                      <div className="flex-1 h-px bg-border/20" />
                      <span className="text-[10px] text-muted-foreground">{formatDate(msg.created_at)}</span>
                      <div className="flex-1 h-px bg-border/20" />
                    </div>
                  )}
                  <div className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}>
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium shrink-0">
                      {(msg.profiles as any)?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-[11px] font-medium">{(msg.profiles as any)?.name || "Ukjent"}</span>
                        <span className="text-[10px] text-muted-foreground">{formatTime(msg.created_at)}</span>
                      </div>
                      <div className={`px-3 py-2 rounded-2xl text-sm ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-border/10 flex gap-2">
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={`Melding i #${activeCategory.name}…`}
              className="flex-1 h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button type="submit" disabled={!newMessage.trim() || sending}
              className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all">
              <Send size={14} />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Velg en kanal for å starte chatten
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
