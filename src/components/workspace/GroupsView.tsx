import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, Plus, Lock, Globe, ArrowLeft, Video, Trash2,
  Search, Paperclip,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import VideoCall from "./VideoCall";
import type { Profile, Group, GroupMsg } from "./types";
import { formatTime, getGroupGradient, uploadFile } from "./helpers";
import { createNotification } from "@/hooks/useWorkspaceNotifications";

const GroupsView = ({ profile }: { profile: Profile }) => {
  const { isAdmin } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [active, setActive] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMsg[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#6366f1", is_private: false });
  const [conferenceActive, setConferenceActive] = useState(false);
  const [groupMembers, setGroupMembers] = useState<Array<{ id: string; name: string; avatar_url?: string | null }>>([]);
  const [memberCount, setMemberCount] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const fetchGroups = async () => {
    const { data } = await supabase.from("workspace_groups").select("*").order("created_at");
    const gs = (data as Group[]) || [];
    setGroups(gs);
    const counts: Record<string, number> = {};
    for (const g of gs) {
      const { count } = await supabase.from("workspace_group_members").select("*", { count: "exact", head: true }).eq("group_id", g.id);
      counts[g.id] = count || 0;
    }
    setMemberCount(counts);
  };

  const fetchMsgs = async (id: string) => {
    const { data } = await supabase.from("workspace_group_messages").select("*, profiles(id, name, role, avatar_url)").eq("group_id", id).order("created_at");
    setMessages((data as GroupMsg[]) || []);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const fetchMembers = async (id: string) => {
    const { data } = await supabase.from("workspace_group_members").select("profile_id, profiles(id, name, avatar_url)").eq("group_id", id);
    setGroupMembers((data || []).map((m: any) => m.profiles).filter(Boolean));
  };

  useEffect(() => { fetchGroups(); }, []);
  useEffect(() => {
    if (!active) return;
    fetchMsgs(active.id);
    fetchMembers(active.id);
    const ch = supabase.channel(`ws-grp-${active.id}`).on("postgres_changes", { event: "*", schema: "public", table: "workspace_group_messages", filter: `group_id=eq.${active.id}` }, () => fetchMsgs(active.id)).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active?.id]);

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from("workspace_groups").insert([{ ...form, created_by: profile.id }]).select().single();
    if (data) await supabase.from("workspace_group_members").insert([{ group_id: data.id, profile_id: profile.id }]);
    setForm({ name: "", description: "", color: "#6366f1", is_private: false });
    setShowNew(false);
    fetchGroups();
  };

  const send = async (content: string) => {
    if (!active) return;
    await supabase.from("workspace_group_messages").insert([{ group_id: active.id, sender_id: profile.id, content }]);
    // Notify group members
    const { data: members } = await supabase.from("workspace_group_members").select("profile_id").eq("group_id", active.id).neq("profile_id", profile.id);
    (members || []).forEach((m: any) => {
      createNotification({
        recipientId: m.profile_id,
        actorId: profile.id,
        type: "group_message",
        referenceId: active.id,
        referenceType: "group",
        title: active.name,
        body: profile.name + ": " + content.slice(0, 60),
        imageUrl: profile.avatar_url || undefined,
      });
    });
  };

  const sendFile = async (file: File) => {
    if (!active) return;
    const result = await uploadFile(supabase, "workspace-uploads", "groups", file);
    if (result) {
      await supabase.from("workspace_group_messages").insert([{ group_id: active.id, sender_id: profile.id, content: `📎 ${result.name}`, file_url: result.url, file_name: result.name }]);
    }
  };

  const joinGroup = async (groupId: string) => {
    try { await supabase.from("workspace_group_members").insert([{ group_id: groupId, profile_id: profile.id }]); } catch { }
  };

  const deleteGroup = async (id: string) => {
    if (!confirm("Slett denne gruppen og alle meldinger?")) return;
    await supabase.from("workspace_groups").delete().eq("id", id);
    setActive(null);
    fetchGroups();
  };

  const deleteMsg = async (id: string) => {
    await supabase.from("workspace_group_messages").delete().eq("id", id);
    if (active) fetchMsgs(active.id);
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCustomer = profile.role === "customer";
  const visibleGroups = isCustomer ? filteredGroups.filter(g => !g.is_private) : filteredGroups;

  return (
    <div className="h-full flex flex-col">
      {!active ? (
        <>
          <div className="px-6 py-5 border-b border-border/10 bg-card/20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Grupper</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Teams og spesialiserte grupper</p>
            </div>
            {!isCustomer && (
              <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                <Plus size={14} /> Ny gruppe
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-4 border border-border/15 mb-6 max-w-md">
              <Search size={14} className="text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Søk etter grupper…" className="h-11 flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40" />
            </div>

            {showNew && (
              <form onSubmit={createGroup} className="max-w-md mx-auto mb-8 rounded-2xl border border-border/20 bg-card/60 p-5 space-y-3">
                <h3 className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Opprett ny gruppe</h3>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Gruppenavn" required className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse (valgfritt)" className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={form.is_private} onChange={e => setForm({ ...form, is_private: e.target.checked })} className="rounded" />
                  <Lock size={13} /> Privat gruppe
                </label>
                <button type="submit" className="w-full h-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl text-sm font-semibold">Opprett</button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleGroups.map(g => {
                const gradient = getGroupGradient(g.color, g.name);
                const canDelete = g.created_by === profile.id || isAdmin;
                return (
                  <div key={g.id} className="group/card rounded-2xl border border-border/15 bg-card/50 overflow-hidden hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative">
                    <div className={`h-28 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                        <div className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                          <Users size={10} /> {memberCount[g.id] || 0} medlemmer
                        </div>
                        {g.is_private && (
                          <div className="px-2 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] flex items-center gap-1">
                            <Lock size={9} /> Privat
                          </div>
                        )}
                      </div>
                      {canDelete && (
                        <button onClick={(e) => { e.stopPropagation(); deleteGroup(g.id); }} className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-destructive/80 transition-all" title="Slett gruppe">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <button onClick={() => { setActive(g); joinGroup(g.id); }} className="w-full text-left p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg -mt-8 border-2 border-background relative z-10`}>
                          {g.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h3 className="font-semibold text-sm group-hover/card:text-primary transition-colors truncate">{g.name}</h3>
                          {g.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{g.description}</p>}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {visibleGroups.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4"><Users size={28} className="text-muted-foreground/40" /></div>
                <p className="text-muted-foreground text-sm">Ingen grupper funnet</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-3.5 border-b border-border/10 bg-card/20 flex items-center gap-3">
            <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={16} /></button>
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getGroupGradient(active.color, active.name)} flex items-center justify-center`}>
              <Users size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{active.name}</span>
                {active.is_private && <Lock size={11} className="text-muted-foreground" />}
              </div>
              {active.description && <p className="text-[10px] text-muted-foreground">{active.description}</p>}
            </div>
            <button onClick={() => setConferenceActive(true)} className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-primary/15 text-muted-foreground hover:text-primary flex items-center justify-center transition-all" title="Videokonferanse"><Video size={16} /></button>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users size={10} /> {memberCount[active.id] || 0}</span>
            {(active.created_by === profile.id || isAdmin) && (
              <button onClick={() => deleteGroup(active.id)} className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all" title="Slett gruppe"><Trash2 size={14} /></button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === profile.id;
              const mp = msg.profiles as any;
              const showAv = i === 0 || messages[i - 1].sender_id !== msg.sender_id;
              return (
                <div key={msg.id} className="group/msg relative">
                  <MessageBubble
                    content={msg.content}
                    senderName={mp?.name}
                    senderAvatar={mp?.avatar_url}
                    time={formatTime(msg.created_at)}
                    isOwn={isOwn}
                    showAvatar={showAv}
                    messageId={msg.id}
                    profileId={profile.id}
                    reactionTable="group_message_reactions"
                    fileUrl={msg.file_url}
                    fileName={msg.file_name}
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
            placeholder={`Skriv i ${active.name}…`}
            onSend={send}
            onSendFile={sendFile}
          />
        </div>
      )}

      {conferenceActive && active && (
        <VideoCall conversationId={active.id} profileId={profile.id} profileName={profile.name} profileAvatar={profile.avatar_url} isConference conferenceId={active.id} participants={groupMembers} onClose={() => setConferenceActive(false)} />
      )}
    </div>
  );
};

export default GroupsView;
