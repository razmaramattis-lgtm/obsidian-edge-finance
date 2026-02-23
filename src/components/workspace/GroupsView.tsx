import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, Plus, Lock, Globe, ArrowLeft, Video, Trash2,
  Search, Paperclip, UserPlus, Clock, Check, X as XIcon,
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
  const [myMembership, setMyMembership] = useState<Record<string, string>>({}); // group_id -> status
  const [pendingRequests, setPendingRequests] = useState<Array<{ id: string; profile_id: string; group_id: string; profiles?: any }>>([]);
  const [showMembers, setShowMembers] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchGroups = async () => {
    const { data } = await supabase.from("workspace_groups").select("*").order("created_at");
    const gs = (data as Group[]) || [];
    setGroups(gs);
    const counts: Record<string, number> = {};
    for (const g of gs) {
      const { count } = await supabase.from("workspace_group_members").select("*", { count: "exact", head: true }).eq("group_id", g.id).eq("status", "approved");
      counts[g.id] = count || 0;
    }
    setMemberCount(counts);

    // Fetch my memberships
    const { data: myMembers } = await supabase.from("workspace_group_members").select("group_id, status").eq("profile_id", profile.id);
    const memberMap: Record<string, string> = {};
    (myMembers || []).forEach((m: any) => { memberMap[m.group_id] = m.status; });
    setMyMembership(memberMap);
  };

  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  const fetchMsgs = async (id: string) => {
    const { data } = await supabase.from("workspace_group_messages").select("*, profiles(id, name, role, avatar_url)").eq("group_id", id).order("created_at");
    const msgs = (data as GroupMsg[]) || [];
    setMessages(msgs);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    // Mark unread messages as read
    const otherMsgs = msgs.filter(m => m.sender_id !== profile.id);
    if (otherMsgs.length > 0) {
      const inserts = otherMsgs.map(m => ({ message_id: m.id, profile_id: profile.id }));
      await supabase.from("group_message_reads" as any).upsert(inserts, { onConflict: "message_id,profile_id" });
    }

    // Fetch read status for own messages
    const ownMsgIds = msgs.filter(m => m.sender_id === profile.id).map(m => m.id);
    if (ownMsgIds.length > 0) {
      const { data: reads } = await supabase.from("group_message_reads" as any).select("message_id").in("message_id", ownMsgIds).neq("profile_id", profile.id);
      const readMap: Record<string, boolean> = {};
      (reads || []).forEach((r: any) => { readMap[r.message_id] = true; });
      setReadStatus(readMap);
    }
  };

  const fetchMembers = async (id: string) => {
    const { data } = await supabase.from("workspace_group_members").select("profile_id, status, profiles(id, name, avatar_url)").eq("group_id", id);
    const approved = (data || []).filter((m: any) => m.status === "approved").map((m: any) => m.profiles).filter(Boolean);
    setGroupMembers(approved);
    // Pending requests (for group admin)
    const pending = (data || []).filter((m: any) => m.status === "pending").map((m: any) => ({
      id: m.profile_id,
      profile_id: m.profile_id,
      group_id: id,
      profiles: m.profiles,
    }));
    setPendingRequests(pending);
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
    if (data) await supabase.from("workspace_group_members").insert([{ group_id: data.id, profile_id: profile.id, status: "approved" }]);
    setForm({ name: "", description: "", color: "#6366f1", is_private: false });
    setShowNew(false);
    fetchGroups();
  };

  const requestJoin = async (groupId: string) => {
    try {
      await supabase.from("workspace_group_members").insert([{ group_id: groupId, profile_id: profile.id, status: "pending" }]);
      // Notify group creator
      const group = groups.find(g => g.id === groupId);
      if (group) {
        createNotification({
          recipientId: group.created_by,
          actorId: profile.id,
          type: "group_message",
          referenceId: groupId,
          referenceType: "group",
          title: group.name,
          body: profile.name + " ønsker å bli med i gruppen",
        });
      }
      fetchGroups();
    } catch { }
  };

  const approveRequest = async (groupId: string, profileId: string) => {
    await supabase.from("workspace_group_members").update({ status: "approved" } as any).eq("group_id", groupId).eq("profile_id", profileId);
    createNotification({
      recipientId: profileId,
      actorId: profile.id,
      type: "group_message",
      referenceId: groupId,
      referenceType: "group",
      title: active?.name || "Gruppe",
      body: "Du har blitt godkjent som medlem!",
    });
    fetchMembers(groupId);
    fetchGroups();
  };

  const rejectRequest = async (groupId: string, profileId: string) => {
    await supabase.from("workspace_group_members").delete().eq("group_id", groupId).eq("profile_id", profileId);
    fetchMembers(groupId);
    fetchGroups();
  };

  const inviteMember = async (groupId: string, targetProfileId: string) => {
    try {
      await supabase.from("workspace_group_members").insert([{ group_id: groupId, profile_id: targetProfileId, status: "approved" }]);
      createNotification({
        recipientId: targetProfileId,
        actorId: profile.id,
        type: "group_message",
        referenceId: groupId,
        referenceType: "group",
        title: active?.name || "Gruppe",
        body: profile.name + " la deg til i gruppen",
      });
      fetchMembers(groupId);
      fetchGroups();
    } catch { }
  };

  const send = async (content: string) => {
    if (!active) return;
    await supabase.from("workspace_group_messages").insert([{ group_id: active.id, sender_id: profile.id, content }]);
    const { data: members } = await supabase.from("workspace_group_members").select("profile_id").eq("group_id", active.id).eq("status", "approved").neq("profile_id", profile.id);
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

  // Invite member panel state
  const [showInvite, setShowInvite] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchProfiles = async (query: string) => {
    if (!query.trim()) { setSearchResults([]); return; }
    const { data } = await supabase.from("profiles").select("id, name, avatar_url").ilike("name", `%${query}%`).limit(10);
    const memberIds = new Set(groupMembers.map(m => m.id));
    setSearchResults((data || []).filter(p => !memberIds.has(p.id)));
  };

  useEffect(() => {
    const t = setTimeout(() => searchProfiles(inviteSearch), 300);
    return () => clearTimeout(t);
  }, [inviteSearch]);

  return (
    <div className="h-full flex flex-col">
      {!active ? (
        <>
          <div className="px-6 py-5 border-b border-border/10 bg-card/20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Grupper</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Lukkede miljøer – søk og be om tilgang</p>
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
                const membership = myMembership[g.id];
                const isMember = membership === "approved";
                const isPending = membership === "pending";
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
                    <div className="w-full text-left p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg -mt-8 border-2 border-background relative z-10`}>
                          {g.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h3 className="font-semibold text-sm group-hover/card:text-primary transition-colors truncate">{g.name}</h3>
                          {g.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{g.description}</p>}
                        </div>
                      </div>
                      <div className="mt-3">
                        {isMember ? (
                          <button onClick={() => setActive(g)} className="w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all">
                            Åpne gruppe
                          </button>
                        ) : isPending ? (
                          <div className="w-full py-2 rounded-xl bg-muted/40 text-muted-foreground text-xs font-medium text-center flex items-center justify-center gap-1.5">
                            <Clock size={12} /> Venter på godkjenning
                          </div>
                        ) : (
                          <button onClick={() => requestJoin(g.id)} className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                            Be om tilgang
                          </button>
                        )}
                      </div>
                    </div>
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
            <button onClick={() => { setActive(null); setShowMembers(false); setShowInvite(false); }} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={16} /></button>
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
            {(active.created_by === profile.id || isAdmin) && (
              <button onClick={() => setShowInvite(!showInvite)} className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-primary/15 text-muted-foreground hover:text-primary flex items-center justify-center transition-all" title="Inviter medlem">
                <UserPlus size={16} />
              </button>
            )}
            <button onClick={() => setShowMembers(!showMembers)} className="px-3 py-1.5 rounded-xl bg-muted/40 hover:bg-muted/60 text-[10px] text-muted-foreground flex items-center gap-1 transition-all">
              <Users size={10} /> {memberCount[active.id] || 0}
            </button>
            <button onClick={() => setConferenceActive(true)} className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-primary/15 text-muted-foreground hover:text-primary flex items-center justify-center transition-all" title="Videokonferanse"><Video size={16} /></button>
            {(active.created_by === profile.id || isAdmin) && (
              <button onClick={() => deleteGroup(active.id)} className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all" title="Slett gruppe"><Trash2 size={14} /></button>
            )}
          </div>

          {/* Pending requests panel */}
          {(active.created_by === profile.id || isAdmin) && pendingRequests.length > 0 && (
            <div className="px-5 py-3 border-b border-border/10 bg-accent/5">
              <p className="text-xs font-semibold text-accent mb-2 flex items-center gap-1"><Clock size={12} /> {pendingRequests.length} ventende forespørsler</p>
              <div className="space-y-2">
                {pendingRequests.map(req => (
                  <div key={req.profile_id} className="flex items-center gap-3 bg-card/60 rounded-xl px-3 py-2">
                    <UserAvatar name={req.profiles?.name || "?"} avatarUrl={req.profiles?.avatar_url} size="sm" />
                    <span className="text-xs font-medium flex-1">{req.profiles?.name}</span>
                    <button onClick={() => approveRequest(active.id, req.profile_id)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all" title="Godkjenn"><Check size={14} /></button>
                    <button onClick={() => rejectRequest(active.id, req.profile_id)} className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all" title="Avslå"><XIcon size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invite panel */}
          {showInvite && (
            <div className="px-5 py-3 border-b border-border/10 bg-primary/5">
              <p className="text-xs font-semibold mb-2 flex items-center gap-1"><UserPlus size={12} /> Inviter medlem</p>
              <input value={inviteSearch} onChange={e => setInviteSearch(e.target.value)} placeholder="Søk etter navn…" className="w-full h-9 rounded-xl border border-border/20 bg-muted/20 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 mb-2" />
              {searchResults.map(p => (
                <div key={p.id} className="flex items-center gap-3 py-1.5">
                  <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="sm" />
                  <span className="text-xs flex-1">{p.name}</span>
                  <button onClick={() => { inviteMember(active.id, p.id); setInviteSearch(""); setSearchResults([]); }} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary/20 transition-all">Legg til</button>
                </div>
              ))}
            </div>
          )}

          {/* Members panel */}
          {showMembers && (
            <div className="px-5 py-3 border-b border-border/10 bg-muted/10 max-h-48 overflow-y-auto">
              <p className="text-xs font-semibold mb-2">Medlemmer ({groupMembers.length})</p>
              <div className="space-y-1.5">
                {groupMembers.map(m => (
                  <div key={m.id} className="flex items-center gap-2">
                    <UserAvatar name={m.name} avatarUrl={m.avatar_url} size="sm" />
                    <span className="text-xs">{m.name}</span>
                    {m.id === active.created_by && <span className="text-[9px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full">Admin</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === profile.id;
              const mp = msg.profiles as any;
              const showAv = i === 0 || messages[i - 1].sender_id !== msg.sender_id;
              return (
                <div key={msg.id} className="group/msg">
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
                    readAt={isOwn && readStatus[msg.id] ? "read" : null}
                  />
                  {(isOwn || (isAdmin && !isOwn)) && (
                    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mt-0.5 mb-1`}>
                      <button onClick={() => deleteMsg(msg.id)} className="opacity-0 group-hover/msg:opacity-100 px-2 py-0.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-[10px] flex items-center gap-1"><Trash2 size={10} /> Slett</button>
                    </div>
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
