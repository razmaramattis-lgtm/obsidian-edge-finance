import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageCircle, X, Minus, Send, Trash2, Pencil, Phone, Video,
  Paperclip, Image, XCircle, Check, CheckCheck, EyeOff,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import EmojiPicker from "./EmojiPicker";
import GifPicker from "./GifPicker";
import MessageReactions from "./MessageReactions";
import VideoCall from "./VideoCall";
import type { Profile, DmConv, DmMsg } from "./types";
import { formatTime, uploadFile, isGifUrl } from "./helpers";
import { createNotification } from "@/hooks/useWorkspaceNotifications";

interface FloatingChatProps {
  profile: Profile;
  onViewProfile?: (p: Profile) => void;
}

interface MiniChat {
  conv: DmConv;
  messages: DmMsg[];
  minimized: boolean;
}

const FloatingChat = ({ profile, onViewProfile }: FloatingChatProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [conversations, setConversations] = useState<DmConv[]>([]);
  const [openChats, setOpenChats] = useState<MiniChat[]>([]);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActive, setIsActive] = useState(() => {
    const stored = localStorage.getItem("floatingChatActive");
    return stored !== null ? stored === "true" : true;
  });

  const fetchConvs = async () => {
    const { data } = await supabase.from("dm_conversations").select("*").order("updated_at", { ascending: false });
    if (!data) return;
    const profileIds = new Set<string>();
    data.forEach((c: any) => { profileIds.add(c.participant_1); profileIds.add(c.participant_2); });
    const { data: profiles } = await supabase.from("profiles").select("id, name, role, avatar_url, active").in("id", [...profileIds]);
    const pMap = new Map((profiles || []).map((p: any) => [p.id, p]));
    setConversations(data.map((c: any) => ({ ...c, other: pMap.get(c.participant_1 === profile.id ? c.participant_2 : c.participant_1) })));
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("id, name, role, avatar_url, active").neq("id", profile.id).order("name").limit(50);
    setAllProfiles((data as Profile[]) || []);
  };

  useEffect(() => { fetchConvs(); fetchProfiles(); }, []);

  useEffect(() => {
    const ch = supabase.channel("floating-dm-notif").on("postgres_changes", { event: "INSERT", schema: "public", table: "dm_messages" }, (payload: any) => {
      const msg = payload.new;
      if (msg.sender_id !== profile.id) {
        const isOpen = openChats.some(c => c.conv.id === msg.conversation_id && !c.minimized);
        if (!isOpen) {
          setUnread(prev => ({ ...prev, [msg.conversation_id]: (prev[msg.conversation_id] || 0) + 1 }));
        } else {
          // Chat is open and visible — mark as read immediately
          supabase.from("dm_messages").update({ read_at: new Date().toISOString() }).eq("id", msg.id).then(() => {});
        }
        setOpenChats(prev => prev.map(c => c.conv.id === msg.conversation_id ? { ...c, messages: [...c.messages, msg] } : c));
      }
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [openChats, profile.id]);

  const markAsRead = async (convId: string, messages: DmMsg[]) => {
    const unreadIds = messages.filter(m => m.sender_id !== profile.id && !m.read_at).map(m => m.id);
    if (unreadIds.length > 0) {
      await supabase.from("dm_messages").update({ read_at: new Date().toISOString() }).in("id", unreadIds);
      // Update local state so read receipts show immediately
      setOpenChats(prev => prev.map(c => c.conv.id === convId ? { ...c, messages: c.messages.map(m => unreadIds.includes(m.id) ? { ...m, read_at: new Date().toISOString() } : m) } : c));
    }
  };

  const openChat = async (conv: DmConv) => {
    if (openChats.some(c => c.conv.id === conv.id)) {
      setOpenChats(prev => prev.map(c => c.conv.id === conv.id ? { ...c, minimized: false } : c));
      // Mark unread when restoring minimized chat
      const chat = openChats.find(c => c.conv.id === conv.id);
      if (chat) markAsRead(conv.id, chat.messages);
    } else {
      const { data } = await supabase.from("dm_messages").select("*").eq("conversation_id", conv.id).order("created_at").limit(50);
      const msgs = (data as DmMsg[]) || [];
      setOpenChats(prev => [...prev.slice(-2), { conv, messages: msgs, minimized: false }]);
      markAsRead(conv.id, msgs);
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

  const closeAll = () => setOpenChats([]);

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);
  const filteredProfiles = allProfiles.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleActive = () => {
    const next = !isActive;
    setIsActive(next);
    localStorage.setItem("floatingChatActive", String(next));
    if (!next) { setOpenChats([]); setShowPicker(false); }
  };

  if (!isActive) {
    return (
      <div className="fixed bottom-0 right-0 z-50 pr-4 pb-24 hidden md:block">
        <button onClick={toggleActive} className="w-14 h-14 rounded-full bg-muted/60 text-muted-foreground border border-border/30 shadow-lg hover:bg-muted hover:text-foreground transition-all flex items-center justify-center" title="Aktiver chat">
          <MessageCircle size={22} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 flex-col items-end pr-4 pb-24 gap-3 max-h-screen hidden md:flex">
      {/* Open mini chats - vertical stack */}
      <div className="flex flex-col items-end gap-2 overflow-y-auto max-h-[calc(100vh-120px)]" style={{ scrollbarWidth: "none" }}>
        {openChats.map(chat => (
          <MiniChatWindow
            key={chat.conv.id}
            chat={chat}
            profile={profile}
            onClose={() => closeChat(chat.conv.id)}
            onMinimize={() => setOpenChats(prev => prev.map(c => c.conv.id === chat.conv.id ? { ...c, minimized: !c.minimized } : c))}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>

      {/* Bottom bar: bubbles + main button */}
      <div className="flex items-end gap-2">
        {/* Conversation bubbles - only show if unread */}
        {conversations.filter(conv => !openChats.some(c => c.conv.id === conv.id) && (unread[conv.id] || 0) > 0).slice(0, 4).map(conv => (
          <button key={conv.id} onClick={() => openChat(conv)} className="relative group" title={conv.other?.name}>
            <div className="w-12 h-12 rounded-full shadow-lg shadow-black/20 ring-2 ring-background hover:ring-primary/30 transition-all hover:scale-110">
              <UserAvatar name={conv.other?.name} avatarUrl={conv.other?.avatar_url} size="md" profileId={conv.other?.id} isActive={conv.other?.active !== false} />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center animate-bounce">{unread[conv.id]}</span>
          </button>
        ))}

        {/* Close all button */}
        {openChats.length > 0 && (
          <button onClick={closeAll} className="w-10 h-10 rounded-full bg-muted/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-all shadow-lg" title="Lukk alle">
            <XCircle size={18} />
          </button>
        )}

        {/* Toggle active / Main chat button */}
        <div className="flex items-center gap-1.5">
          <button onClick={toggleActive} className="w-8 h-8 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center justify-center shadow-md" title="Deaktiver chat-boble">
            <EyeOff size={13} />
          </button>
          <button onClick={() => setShowPicker(!showPicker)} className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all active:scale-95 flex items-center justify-center">
            <MessageCircle size={22} />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-white text-[11px] font-bold flex items-center justify-center">{totalUnread}</span>
            )}
          </button>
        </div>
      </div>

      {/* Contact picker */}
      {showPicker && (
        <div className="absolute bottom-20 right-0 w-72 sm:w-72 bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="p-3 border-b border-border/10">
            <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 border border-border/15">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Søk etter personer…" className="h-9 flex-1 bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground/40" autoFocus />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
            {!searchQuery && conversations.slice(0, 5).map(conv => (
              <button key={conv.id} onClick={() => openChat(conv)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-muted/40 transition-all">
                <UserAvatar name={conv.other?.name} avatarUrl={conv.other?.avatar_url} size="sm" profileId={conv.other?.id} isActive={conv.other?.active !== false} />
                <span className="font-medium flex-1 text-left truncate">{conv.other?.name}</span>
                {unread[conv.id] > 0 && <span className="w-4 h-4 rounded-full bg-destructive text-white text-[9px] flex items-center justify-center">{unread[conv.id]}</span>}
              </button>
            ))}
            {searchQuery && filteredProfiles.map(p => (
              <button key={p.id} onClick={() => startNewChat(p.id)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-muted/40 transition-all">
                <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="sm" isActive={p.active !== false} />
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
  chat, profile, onClose, onMinimize, onViewProfile,
}: {
  chat: MiniChat;
  profile: Profile;
  onClose: () => void;
  onMinimize: () => void;
  onViewProfile?: (p: Profile) => void;
}) => {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [messages, setMessages] = useState<DmMsg[]>(chat.messages);
  const [callActive, setCallActive] = useState(false);
  const [callWithVideo, setCallWithVideo] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMessages(chat.messages); }, [chat.messages]);

  useEffect(() => {
    if (!chat.minimized) {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [messages.length, chat.minimized]);

  // Realtime
  useEffect(() => {
    const ch = supabase.channel(`mini-chat-${chat.conv.id}`).on("postgres_changes", { event: "*", schema: "public", table: "dm_messages", filter: `conversation_id=eq.${chat.conv.id}` }, async () => {
      const { data } = await supabase.from("dm_messages").select("*").eq("conversation_id", chat.conv.id).order("created_at").limit(50);
      setMessages((data as DmMsg[]) || []);
      // Auto-mark as read if chat is open
      if (!chat.minimized && data) {
        const unreadIds = data.filter((m: any) => m.sender_id !== profile.id && !m.read_at).map((m: any) => m.id);
        if (unreadIds.length > 0) {
          await supabase.from("dm_messages").update({ read_at: new Date().toISOString() }).in("id", unreadIds);
        }
      }
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [chat.conv.id, chat.minimized, profile.id]);

  const send = async (content: string) => {
    if (!content.trim()) return;
    const { error } = await supabase.from("dm_messages").insert([{ conversation_id: chat.conv.id, sender_id: profile.id, content: content.trim() }]);
    if (error) {
      console.error("FloatingChat send error:", error);
      return;
    }
    const recipientId = chat.conv.participant_1 === profile.id ? chat.conv.participant_2 : chat.conv.participant_1;
    createNotification({
      recipientId,
      actorId: profile.id,
      type: "dm_message",
      referenceId: chat.conv.id,
      referenceType: "dm_conversation",
      title: content.trim().slice(0, 80),
      body: profile.name + " sendte deg en melding",
      imageUrl: profile.avatar_url || undefined,
    });
    // Send email if recipient is offline
    supabase.functions.invoke("notify-dm-email", {
      body: { recipientId, senderName: profile.name, messagePreview: content.trim().slice(0, 100) },
    }).then(res => {
      if (res.error) console.warn("notify-dm-email error:", res.error);
    }).catch(err => console.warn("notify-dm-email failed:", err));
  };

  const sendFile = async (file: File) => {
    const result = await uploadFile(supabase, "workspace-uploads", "dms", file);
    if (result) {
      await supabase.from("dm_messages").insert([{ conversation_id: chat.conv.id, sender_id: profile.id, content: `📎 ${result.name}`, file_url: result.url, file_name: result.name }]);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) sendFile(f);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    send(text.trim());
    setText("");
  };

  const deleteMsg = async (id: string) => {
    await supabase.from("dm_messages").delete().eq("id", id);
  };

  const startEdit = (msg: DmMsg) => {
    setEditingId(msg.id);
    setEditText(msg.content);
  };

  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return;
    // DM messages don't have an update policy by default, so we delete and re-insert
    // Actually let's just show edit UI but note dm_messages can't be updated per RLS
    // We'll skip edit for DMs that lack UPDATE policy - just allow delete
    setEditingId(null);
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(url);

  if (chat.minimized) {
    return (
      <button onClick={onMinimize} className="w-12 h-12 rounded-full shadow-lg ring-2 ring-background hover:ring-primary/30 transition-all hover:scale-110">
        <UserAvatar name={chat.conv.other?.name} avatarUrl={chat.conv.other?.avatar_url} size="md" profileId={chat.conv.other?.id} isActive={chat.conv.other?.active !== false} />
      </button>
    );
  }

  return (
    <>
      <div className="w-[calc(100vw-2rem)] sm:w-80 h-[70vh] sm:h-[420px] bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/10 bg-card/80 shrink-0">
          <UserAvatar name={chat.conv.other?.name} avatarUrl={chat.conv.other?.avatar_url} size="sm" profileId={chat.conv.other?.id} isActive={chat.conv.other?.active !== false} />
          <span className="text-xs font-semibold flex-1 truncate cursor-pointer hover:underline hover:text-primary transition-colors" onClick={() => chat.conv.other && onViewProfile?.(chat.conv.other)}>{chat.conv.other?.name}</span>
          <button onClick={() => { setCallWithVideo(false); setCallActive(true); }} className="p-1 rounded-lg text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all" title="Ring"><Phone size={13} /></button>
          <button onClick={() => { setCallWithVideo(true); setCallActive(true); }} className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Videosamtale"><Video size={13} /></button>
          <button onClick={onMinimize} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"><Minus size={14} /></button>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><X size={14} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {messages.map(msg => {
            const isOwn = msg.sender_id === profile.id;
            const gif = isGifUrl(msg.content);
            return (
              <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"} group/msg relative`}>
                <div className="max-w-[80%]">
                  {gif ? (
                    <img src={msg.content} alt="GIF" className="max-h-32 rounded-xl" loading="lazy" />
                  ) : (
                    <div className={`px-3 py-2 rounded-2xl text-xs ${isOwn ? "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-br-md" : "bg-muted/50 text-foreground rounded-bl-md"}`}>
                      {msg.content}
                    </div>
                  )}
                  {msg.file_url && (
                    <div className="mt-1">
                      {isImage(msg.file_url) ? (
                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer"><img src={msg.file_url} alt="" className="max-h-32 rounded-xl" loading="lazy" /></a>
                      ) : (
                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-[9px]">📎 {msg.file_name || "Fil"}</a>
                      )}
                    </div>
                  )}
                  {/* Read receipt */}
                  {isOwn && (
                    <div className="flex items-center gap-0.5 mt-0.5 justify-end">
                      {msg.read_at ? <CheckCheck size={10} className="text-blue-400" /> : <Check size={10} className="text-muted-foreground/50" />}
                    </div>
                  )}
                  {/* Reactions - always left/center aligned */}
                  <div className="mt-0.5 flex justify-start">
                    <MessageReactions messageId={msg.id} profileId={profile.id} table="dm_message_reactions" size="sm" />
                  </div>
                  {/* Actions */}
                  {isOwn && (
                    <div className="absolute top-0 right-0 opacity-0 group-hover/msg:opacity-100 flex gap-0.5 transition-all">
                      <button onClick={() => deleteMsg(msg.id)} className="p-0.5 rounded text-destructive/60 hover:text-destructive"><Trash2 size={10} /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-2 border-t border-border/10 shrink-0">
          <div className="flex items-center gap-0.5 bg-muted/30 rounded-2xl border border-border/15 pr-1">
            <div className="flex items-center pl-0.5">
              <EmojiPicker onSelect={e => setText(prev => prev + e)} />
              <GifPicker onSelect={url => send(url)} />
              <button type="button" onClick={() => fileRef.current?.click()} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Paperclip size={13} /></button>
              <button type="button" onClick={() => imageRef.current?.click()} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"><Image size={13} /></button>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
              <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Skriv melding…" className="flex-1 h-9 bg-transparent px-1.5 text-xs focus:outline-none placeholder:text-muted-foreground/40" />
            <button type="submit" disabled={!text.trim()} className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 transition-all"><Send size={11} /></button>
          </div>
        </form>
      </div>

      {callActive && (
        <VideoCall
          conversationId={chat.conv.id}
          profileId={profile.id}
          profileName={profile.name}
          profileAvatar={profile.avatar_url}
          otherName={chat.conv.other?.name}
          otherAvatar={chat.conv.other?.avatar_url}
          onClose={() => setCallActive(false)}
        />
      )}
    </>
  );
};

export default FloatingChat;
