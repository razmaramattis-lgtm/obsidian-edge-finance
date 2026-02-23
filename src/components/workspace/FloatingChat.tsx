import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, X, Minus, Send, Paperclip } from "lucide-react";
import UserAvatar from "./UserAvatar";
import type { Profile, DmConv, DmMsg } from "./types";
import { formatTime, uploadFile } from "./helpers";

interface FloatingChatProps {
  profile: Profile;
}

interface MiniChat {
  conv: DmConv;
  messages: DmMsg[];
  minimized: boolean;
}

const FloatingChat = ({ profile }: FloatingChatProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [conversations, setConversations] = useState<DmConv[]>([]);
  const [openChats, setOpenChats] = useState<MiniChat[]>([]);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const endRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchConvs = async () => {
    const { data } = await supabase.from("dm_conversations").select("*").order("updated_at", { ascending: false });
    if (!data) return;
    const profileIds = new Set<string>();
    data.forEach((c: any) => { profileIds.add(c.participant_1); profileIds.add(c.participant_2); });
    const { data: profiles } = await supabase.from("profiles").select("id, name, role, avatar_url").in("id", [...profileIds]);
    const pMap = new Map((profiles || []).map((p: any) => [p.id, p]));
    setConversations(data.map((c: any) => ({ ...c, other: pMap.get(c.participant_1 === profile.id ? c.participant_2 : c.participant_1) })));
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("id, name, role, avatar_url").neq("id", profile.id).order("name").limit(50);
    setAllProfiles((data as Profile[]) || []);
  };

  useEffect(() => { fetchConvs(); fetchProfiles(); }, []);

  // Listen for new DMs for unread counts
  useEffect(() => {
    const ch = supabase.channel("floating-dm-notif").on("postgres_changes", { event: "INSERT", schema: "public", table: "dm_messages" }, (payload: any) => {
      const msg = payload.new;
      if (msg.sender_id !== profile.id) {
        // Check if chat is open
        const isOpen = openChats.some(c => c.conv.id === msg.conversation_id && !c.minimized);
        if (!isOpen) {
          setUnread(prev => ({ ...prev, [msg.conversation_id]: (prev[msg.conversation_id] || 0) + 1 }));
        }
        // Update open chat messages
        setOpenChats(prev => prev.map(c => c.conv.id === msg.conversation_id ? { ...c, messages: [...c.messages, msg] } : c));
      }
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [openChats, profile.id]);

  const openChat = async (conv: DmConv) => {
    if (openChats.some(c => c.conv.id === conv.id)) {
      setOpenChats(prev => prev.map(c => c.conv.id === conv.id ? { ...c, minimized: false } : c));
    } else {
      const { data } = await supabase.from("dm_messages").select("*").eq("conversation_id", conv.id).order("created_at").limit(50);
      setOpenChats(prev => [...prev.slice(-2), { conv, messages: (data as DmMsg[]) || [], minimized: false }]);
    }
    setUnread(prev => ({ ...prev, [conv.id]: 0 }));
    setShowPicker(false);
  };

  const startNewChat = async (otherId: string) => {
    const { data: existing } = await supabase.from("dm_conversations").select("*").or(`and(participant_1.eq.${profile.id},participant_2.eq.${otherId}),and(participant_1.eq.${otherId},participant_2.eq.${profile.id})`);
    if (existing && existing.length > 0) {
      const other = allProfiles.find(p => p.id === otherId);
      openChat({ ...existing[0], other } as DmConv);
    } else {
      const { data } = await supabase.from("dm_conversations").insert([{ participant_1: profile.id, participant_2: otherId }]).select().single();
      if (data) {
        const other = allProfiles.find(p => p.id === otherId);
        openChat({ ...data, other } as DmConv);
        fetchConvs();
      }
    }
  };

  const closeChat = (convId: string) => {
    setOpenChats(prev => prev.filter(c => c.conv.id !== convId));
  };

  const sendMsg = async (convId: string, content: string) => {
    if (!content.trim()) return;
    const msg = { conversation_id: convId, sender_id: profile.id, content: content.trim() };
    await supabase.from("dm_messages").insert([msg]);
    // Optimistic update
    setOpenChats(prev => prev.map(c => c.conv.id === convId ? { ...c, messages: [...c.messages, { ...msg, id: crypto.randomUUID(), created_at: new Date().toISOString() } as DmMsg] } : c));
  };

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);
  const filteredProfiles = allProfiles.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed bottom-0 right-0 z-50 flex items-end gap-3 pr-4 pb-4">
      {/* Open mini chats */}
      {openChats.map(chat => (
        <MiniChatWindow
          key={chat.conv.id}
          chat={chat}
          profile={profile}
          onClose={() => closeChat(chat.conv.id)}
          onMinimize={() => setOpenChats(prev => prev.map(c => c.conv.id === chat.conv.id ? { ...c, minimized: !c.minimized } : c))}
          onSend={(content) => sendMsg(chat.conv.id, content)}
          endRefs={endRefs}
        />
      ))}

      {/* Active conversation bubbles */}
      {conversations.slice(0, 4).map(conv => {
        if (openChats.some(c => c.conv.id === conv.id)) return null;
        const count = unread[conv.id] || 0;
        return (
          <button key={conv.id} onClick={() => openChat(conv)} className="relative group" title={conv.other?.name}>
            <div className="w-12 h-12 rounded-full shadow-lg shadow-black/20 ring-2 ring-background hover:ring-primary/30 transition-all hover:scale-110">
              <UserAvatar name={conv.other?.name} avatarUrl={conv.other?.avatar_url} size="md" online />
            </div>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center animate-bounce">{count}</span>
            )}
          </button>
        );
      })}

      {/* Main chat button */}
      <button onClick={() => setShowPicker(!showPicker)} className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all active:scale-95 flex items-center justify-center">
        <MessageCircle size={22} />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-white text-[11px] font-bold flex items-center justify-center">{totalUnread}</span>
        )}
      </button>

      {/* Contact picker */}
      {showPicker && (
        <div className="absolute bottom-20 right-0 w-72 bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="p-3 border-b border-border/10">
            <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 border border-border/15">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Søk etter personer…" className="h-9 flex-1 bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground/40" autoFocus />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
            {/* Recent conversations */}
            {!searchQuery && conversations.slice(0, 5).map(conv => (
              <button key={conv.id} onClick={() => openChat(conv)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-muted/40 transition-all">
                <UserAvatar name={conv.other?.name} avatarUrl={conv.other?.avatar_url} size="sm" online />
                <span className="font-medium flex-1 text-left truncate">{conv.other?.name}</span>
                {unread[conv.id] > 0 && <span className="w-4 h-4 rounded-full bg-destructive text-white text-[9px] flex items-center justify-center">{unread[conv.id]}</span>}
              </button>
            ))}
            {searchQuery && filteredProfiles.map(p => (
              <button key={p.id} onClick={() => startNewChat(p.id)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-muted/40 transition-all">
                <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="sm" />
                <div className="text-left flex-1 min-w-0"><p className="font-medium truncate">{p.name}</p><p className="text-[10px] text-muted-foreground capitalize">{p.role}</p></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Mini Chat Window ───
const MiniChatWindow = ({
  chat, profile, onClose, onMinimize, onSend, endRefs,
}: {
  chat: MiniChat;
  profile: Profile;
  onClose: () => void;
  onMinimize: () => void;
  onSend: (content: string) => void;
  endRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) => {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chat.minimized) {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [chat.messages.length, chat.minimized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  if (chat.minimized) {
    return (
      <button onClick={onMinimize} className="w-12 h-12 rounded-full shadow-lg ring-2 ring-background hover:ring-primary/30 transition-all hover:scale-110">
        <UserAvatar name={chat.conv.other?.name} avatarUrl={chat.conv.other?.avatar_url} size="md" online />
      </button>
    );
  }

  return (
    <div className="w-80 h-96 bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/10 bg-card/80">
        <UserAvatar name={chat.conv.other?.name} avatarUrl={chat.conv.other?.avatar_url} size="sm" online />
        <span className="text-xs font-semibold flex-1 truncate">{chat.conv.other?.name}</span>
        <button onClick={onMinimize} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"><Minus size={14} /></button>
        <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><X size={14} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chat.messages.map(msg => {
          const isOwn = msg.sender_id === profile.id;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${isOwn ? "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-br-md" : "bg-muted/50 text-foreground rounded-bl-md"}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-border/10 flex gap-1.5">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Skriv melding…" className="flex-1 h-8 bg-muted/30 rounded-xl px-3 text-xs focus:outline-none border border-border/15 focus:ring-1 focus:ring-primary/20" />
        <button type="submit" disabled={!text.trim()} className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 transition-all"><Send size={12} /></button>
      </form>
    </div>
  );
};

export default FloatingChat;
