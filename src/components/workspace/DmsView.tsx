import { useState, useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, Search, MessageSquare, Phone, Video, ArrowLeft, Trash2,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import VideoCall from "./VideoCall";
import type { Profile, DmConv, DmMsg } from "./types";
import { formatTime, formatDate, uploadFile } from "./helpers";
import { createNotification } from "@/hooks/useWorkspaceNotifications";

const DmsView = ({ profile }: { profile: Profile }) => {
  const { isAdmin } = useAuth();
  const [conversations, setConversations] = useState<DmConv[]>([]);
  const [active, setActive] = useState<DmConv | null>(null);
  const [messages, setMessages] = useState<DmMsg[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ from: string; withVideo: boolean; convId: string } | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [lastMessages, setLastMessages] = useState<Record<string, { content: string; sender_id: string; read_at: string | null }>>({});
  const endRef = useRef<HTMLDivElement>(null);

  const fetchConvs = async () => {
    const { data } = await supabase.from("dm_conversations").select("*").order("updated_at", { ascending: false });
    if (!data) return;
    const profileIds = new Set<string>();
    data.forEach((c: any) => { profileIds.add(c.participant_1); profileIds.add(c.participant_2); });
    const { data: profiles } = await supabase.from("profiles").select("id, name, role, avatar_url, active").in("id", [...profileIds]);
    const pMap = new Map((profiles || []).map((p: any) => [p.id, p]));

    // Fetch last message and unread counts per conversation
    const counts: Record<string, number> = {};
    const lastMsgs: Record<string, { content: string; sender_id: string; read_at: string | null }> = {};
    for (const c of data) {
      const { count } = await supabase.from("dm_messages").select("*", { count: "exact", head: true }).eq("conversation_id", c.id).neq("sender_id", profile.id).is("read_at", null);
      if (count && count > 0) counts[c.id] = count;
      const { data: last } = await supabase.from("dm_messages").select("content, sender_id, read_at").eq("conversation_id", c.id).order("created_at", { ascending: false }).limit(1);
      if (last?.[0]) lastMsgs[c.id] = last[0] as any;
    }
    setUnreadCounts(counts);
    setLastMessages(lastMsgs);

    setConversations(data.map((c: any) => ({ ...c, other: pMap.get(c.participant_1 === profile.id ? c.participant_2 : c.participant_1) })));
  };

  const fetchMsgs = async (id: string) => {
    const { data } = await supabase.from("dm_messages").select("*").eq("conversation_id", id).order("created_at");
    setMessages((data as DmMsg[]) || []);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "instant" }), 50);
    // Mark unread messages as read
    if (data && data.length > 0) {
      const unreadIds = data.filter((m: any) => m.sender_id !== profile.id && !m.read_at).map((m: any) => m.id);
      if (unreadIds.length > 0) {
        await supabase.from("dm_messages").update({ read_at: new Date().toISOString() }).in("id", unreadIds);
      }
    }
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("id, name, role, avatar_url, active").neq("id", profile.id).order("name");
    setAllProfiles((data as Profile[]) || []);
  };

  useEffect(() => { fetchConvs(); fetchProfiles(); }, []);

  useEffect(() => {
    const callChannels: any[] = [];
    conversations.forEach(conv => {
      const chName = `call-${[profile.id, conv.id].sort().join("-")}`;
      const ch = supabase.channel(`listen-${chName}`, { config: { broadcast: { self: false } } });
      ch.on("broadcast", { event: "invite" }, ({ payload }) => {
        if (payload.from !== profile.id) setIncomingCall({ from: payload.from, withVideo: payload.withVideo, convId: conv.id });
      });
      ch.subscribe();
      callChannels.push(ch);
    });
    return () => { callChannels.forEach(ch => supabase.removeChannel(ch)); };
  }, [conversations, profile.id]);

  useEffect(() => {
    if (!active) return;
    fetchMsgs(active.id);
    const ch = supabase.channel(`ws-dm-${active.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "dm_messages", filter: `conversation_id=eq.${active.id}` }, (payload: any) => {
        const msg = payload.new;
        if (msg.sender_id !== profile.id) {
          // Mark as read immediately since chat is open
          supabase.from("dm_messages").update({ read_at: new Date().toISOString() }).eq("id", msg.id).then(() => {});
        }
        fetchMsgs(active.id);
        fetchConvs();
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "dm_messages", filter: `conversation_id=eq.${active.id}` }, () => {
        fetchMsgs(active.id);
        fetchConvs();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "dm_messages", filter: `conversation_id=eq.${active.id}` }, () => {
        // Re-fetch to update read receipts without triggering more updates
        supabase.from("dm_messages").select("*").eq("conversation_id", active.id).order("created_at").then(({ data }) => {
          setMessages((data as DmMsg[]) || []);
        });
        fetchConvs();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active?.id]);

  const startDm = async (otherId: string) => {
    const { data: existing } = await supabase.from("dm_conversations").select("*").or(`and(participant_1.eq.${profile.id},participant_2.eq.${otherId}),and(participant_1.eq.${otherId},participant_2.eq.${profile.id})`);
    if (existing && existing.length > 0) {
      const other = allProfiles.find(p => p.id === otherId);
      setActive({ ...existing[0], other } as DmConv);
    } else {
      const { data } = await supabase.from("dm_conversations").insert([{ participant_1: profile.id, participant_2: otherId }]).select().single();
      if (data) {
        const other = allProfiles.find(p => p.id === otherId);
        setActive({ ...data, other } as DmConv);
        fetchConvs();
      }
    }
    setShowNew(false);
  };

  const send = async (content: string) => {
    if (!active) return;
    const { error } = await supabase.from("dm_messages").insert([{ conversation_id: active.id, sender_id: profile.id, content }]);
    if (error) {
      console.error("DM send error:", error);
      // Conversation may have been deleted — re-verify
      const { data: convCheck } = await supabase.from("dm_conversations").select("id").eq("id", active.id).single();
      if (!convCheck) {
        // Conversation no longer exists, recreate it
        const otherId = active.participant_1 === profile.id ? active.participant_2 : active.participant_1;
        const { data: newConv } = await supabase.from("dm_conversations").insert([{ participant_1: profile.id, participant_2: otherId }]).select().single();
        if (newConv) {
          setActive({ ...newConv, other: active.other } as DmConv);
          await supabase.from("dm_messages").insert([{ conversation_id: newConv.id, sender_id: profile.id, content }]);
          fetchConvs();
        }
      }
      return;
    }
    const recipientId = active.participant_1 === profile.id ? active.participant_2 : active.participant_1;
    createNotification({
      recipientId,
      actorId: profile.id,
      type: "dm_message",
      referenceId: active.id,
      referenceType: "dm_conversation",
      title: content.slice(0, 80),
      body: profile.name + " sendte deg en melding",
      imageUrl: profile.avatar_url || undefined,
    });
    // Send email if recipient is offline
    supabase.functions.invoke("notify-dm-email", {
      body: { recipientId, senderName: profile.name, messagePreview: content.slice(0, 100) },
    }).catch(() => {});
  };

  const sendFile = async (file: File) => {
    if (!active) return;
    const result = await uploadFile(supabase, "workspace-uploads", "dms", file);
    if (result) {
      await supabase.from("dm_messages").insert([{ conversation_id: active.id, sender_id: profile.id, content: `📎 ${result.name}`, file_url: result.url, file_name: result.name }]);
    }
  };

  const deleteMsg = async (id: string) => {
    await supabase.from("dm_messages").delete().eq("id", id);
    if (active) fetchMsgs(active.id);
  };

  const deleteConversation = async (id: string) => {
    if (!confirm("Slett denne samtalen?")) return;
    await supabase.from("dm_conversations").delete().eq("id", id);
    setActive(null);
    fetchConvs();
  };

  const filteredProfiles = allProfiles.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-64 shrink-0 border-r border-border/10 bg-card/20 flex flex-col">
        <div className="p-3 border-b border-border/10 flex items-center justify-between shrink-0 bg-card/80">
          <span className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Meldinger</span>
          <button onClick={() => setShowNew(!showNew)} className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all"><Plus size={14} /></button>
        </div>

        {showNew && (
          <div className="border-b border-border/10">
            <div className="p-2">
              <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 border border-border/15">
                <Search size={13} className="text-muted-foreground" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Søk etter personer…" className="h-9 flex-1 bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground/40" autoFocus />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto p-2 space-y-0.5">
              {filteredProfiles.map(p => (
                <button key={p.id} onClick={() => startDm(p.id)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-muted/40 transition-all">
                  <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="sm" isActive={p.active !== false} />
                  <div className="text-left"><p className="font-medium">{p.name}</p><p className="text-[10px] text-muted-foreground capitalize">{p.role}</p></div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {conversations.map(conv => {
            const unread = unreadCounts[conv.id] || 0;
            return (
            <div key={conv.id} className="group/conv flex items-center">
              <button onClick={() => setActive(conv)} className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active?.id === conv.id ? "bg-primary/10" : "hover:bg-muted/40"}`}>
                <div className="relative">
                  <UserAvatar name={conv.other?.name} avatarUrl={conv.other?.avatar_url} size="md" profileId={conv.other?.id} isActive={conv.other?.active !== false} />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className={`text-sm truncate ${unread > 0 ? "font-semibold" : ""} ${active?.id === conv.id ? "text-primary font-medium" : ""}`}>{conv.other?.name || "Ukjent"}</p>
                  {lastMessages[conv.id] ? (
                    <div className="flex items-center gap-1">
                      {lastMessages[conv.id].sender_id === profile.id && (
                        lastMessages[conv.id].read_at
                          ? <CheckCheck size={10} className="text-blue-400 shrink-0" />
                          : <Check size={10} className="text-muted-foreground/50 shrink-0" />
                      )}
                      <p className={`text-[10px] truncate ${unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {lastMessages[conv.id].sender_id === profile.id ? "Du: " : ""}{lastMessages[conv.id].content.slice(0, 40)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground capitalize">{conv.other?.role || ""}</p>
                  )}
                </div>
              </button>
              <button onClick={() => deleteConversation(conv.id)} className="opacity-0 group-hover/conv:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={11} /></button>
            </div>
            );
          })}
          {conversations.length === 0 && !showNew && (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground">Ingen samtaler</p>
              <button onClick={() => setShowNew(true)} className="text-xs text-primary hover:underline mt-1">Start en ny</button>
            </div>
          )}
        </div>
      </div>

      {active ? (
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/10 bg-card/20 shrink-0 flex items-center gap-3">
            <UserAvatar name={active.other?.name} avatarUrl={active.other?.avatar_url} size="md" profileId={active.other?.id} isActive={active.other?.active !== false} />
            <div className="flex-1">
              <span className="font-semibold text-sm">{active.other?.name || "Ukjent"}</span>
              <p className="text-[10px] text-muted-foreground capitalize">{active.other?.role || ""}</p>
            </div>
            <button onClick={() => setCallActive(true)} className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-green-500/15 text-muted-foreground hover:text-green-500 flex items-center justify-center transition-all"><Phone size={16} /></button>
            <button onClick={() => setCallActive(true)} className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-primary/15 text-muted-foreground hover:text-primary flex items-center justify-center transition-all"><Video size={16} /></button>
            <button onClick={() => deleteConversation(active.id)} className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-destructive/15 text-muted-foreground hover:text-destructive flex items-center justify-center transition-all"><Trash2 size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 pb-8 space-y-1">
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === profile.id;
              const showAv = i === 0 || messages[i - 1].sender_id !== msg.sender_id;
              const showDateSep = i === 0 || formatDate(msg.created_at) !== formatDate(messages[i - 1].created_at);
              return (
                <div key={msg.id} className="group/msg relative">
                  {showDateSep && (
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-border/15" />
                      <span className="text-[10px] text-muted-foreground bg-background px-3 py-1 rounded-full border border-border/15">{formatDate(msg.created_at)}</span>
                      <div className="flex-1 h-px bg-border/15" />
                    </div>
                  )}
                  <MessageBubble
                    content={msg.content}
                    senderName={isOwn ? profile.name : active.other?.name}
                    senderAvatar={isOwn ? profile.avatar_url : active.other?.avatar_url}
                    time={formatTime(msg.created_at)}
                    isOwn={isOwn}
                    showAvatar={showAv}
                    messageId={msg.id}
                    profileId={profile.id}
                    reactionTable="dm_message_reactions"
                    fileUrl={msg.file_url}
                    fileName={msg.file_name}
                    readAt={msg.read_at}
                  />
                  {(isOwn || isAdmin) && (
                    <button onClick={() => deleteMsg(msg.id)} className="absolute top-1 right-1 opacity-0 group-hover/msg:opacity-100 p-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"><Trash2 size={12} /></button>
                  )}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <ChatInput
            placeholder={`Skriv til ${active.other?.name}…`}
            onSend={send}
            onSendFile={sendFile}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare size={32} className="text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Velg en samtale</p>
            <p className="text-muted-foreground/60 text-xs mt-1">eller start en ny</p>
          </div>
        </div>
      )}

      {callActive && active && <VideoCall conversationId={active.id} profileId={profile.id} profileName={profile.name} profileAvatar={profile.avatar_url} otherName={active.other?.name} otherAvatar={active.other?.avatar_url} onClose={() => setCallActive(false)} />}
      {incomingCall && !callActive && <VideoCall conversationId={incomingCall.convId} profileId={profile.id} profileName={profile.name} profileAvatar={profile.avatar_url} otherName={conversations.find(c => c.id === incomingCall.convId)?.other?.name} otherAvatar={conversations.find(c => c.id === incomingCall.convId)?.other?.avatar_url} incoming={incomingCall} onClose={() => setIncomingCall(null)} />}
    </div>
  );
};

export default DmsView;
