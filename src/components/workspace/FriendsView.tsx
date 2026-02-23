import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  UserPlus, UserMinus, UserCheck, Users, Search, Bell, X, Check, Tag, Calculator, Star, Heart, Building, Shield,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import type { Profile, Friend } from "./types";
import { roleLabel } from "./helpers";

const FriendsView = ({ profile }: { profile: Profile }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingReceived, setPendingReceived] = useState<Friend[]>([]);
  const [pendingSent, setPendingSent] = useState<Friend[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tab, setTab] = useState<"friends" | "requests" | "find">("friends");

  const fetchFriends = async () => {
    const { data } = await supabase.from("workspace_friends").select("*, requester:profiles!workspace_friends_requester_id_fkey(id, name, role, avatar_url), receiver:profiles!workspace_friends_receiver_id_fkey(id, name, role, avatar_url)");
    const all = (data as any[]) || [];
    setFriends(all.filter(f => f.status === "accepted"));
    setPendingReceived(all.filter(f => f.status === "pending" && f.receiver_id === profile.id));
    setPendingSent(all.filter(f => f.status === "pending" && f.requester_id === profile.id));
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("id, name, role, avatar_url, specialty, interests, preferred_accounting_systems, title, department, bio").neq("id", profile.id).order("name");
    setAllProfiles((data as Profile[]) || []);
  };

  useEffect(() => {
    fetchFriends();
    fetchProfiles();
    const ch = supabase.channel("ws-friends").on("postgres_changes", { event: "*", schema: "public", table: "workspace_friends" }, () => fetchFriends()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const sendRequest = async (receiverId: string) => {
    await supabase.from("workspace_friends").insert([{ requester_id: profile.id, receiver_id: receiverId }]);
    fetchFriends();
  };

  const acceptRequest = async (id: string) => {
    await supabase.from("workspace_friends").update({ status: "accepted" }).eq("id", id);
    fetchFriends();
  };

  const rejectRequest = async (id: string) => {
    await supabase.from("workspace_friends").delete().eq("id", id);
    fetchFriends();
  };

  const removeFriend = async (id: string) => {
    if (!confirm("Fjern denne vennen?")) return;
    await supabase.from("workspace_friends").delete().eq("id", id);
    fetchFriends();
  };

  const getFriendProfile = (f: Friend): Profile => {
    return f.requester_id === profile.id ? (f as any).receiver : (f as any).requester;
  };

  const friendIds = new Set([
    ...friends.map(f => f.requester_id === profile.id ? f.receiver_id : f.requester_id),
    ...pendingSent.map(f => f.receiver_id),
    ...pendingReceived.map(f => f.requester_id),
  ]);

  // Collect all unique tags across profiles for quick-filter
  const allTags = (() => {
    const tags = new Map<string, { label: string; type: "specialty" | "interest" | "system" | "department" | "role" }>();
    allProfiles.forEach(p => {
      if (p.specialty) p.specialty.split(",").map(s => s.trim()).filter(Boolean).forEach(t => tags.set(t.toLowerCase(), { label: t, type: "specialty" }));
      (p.interests || []).forEach(t => tags.set(t.toLowerCase(), { label: t, type: "interest" }));
      (p.preferred_accounting_systems || []).forEach(t => tags.set(t.toLowerCase(), { label: t, type: "system" }));
      if (p.department) tags.set(p.department.toLowerCase(), { label: p.department, type: "department" });
      if (p.role) tags.set(p.role.toLowerCase(), { label: roleLabel(p.role), type: "role" });
    });
    return Array.from(tags.values());
  })();

  const profileMatchesTag = (p: Profile, tag: string) => {
    const t = tag.toLowerCase();
    if (p.specialty && p.specialty.toLowerCase().includes(t)) return true;
    if ((p.interests || []).some(i => i.toLowerCase() === t)) return true;
    if ((p.preferred_accounting_systems || []).some(s => s.toLowerCase() === t)) return true;
    if (p.department && p.department.toLowerCase() === t) return true;
    if (p.role && roleLabel(p.role).toLowerCase() === t) return true;
    return false;
  };

  const searchResults = allProfiles.filter(p => {
    if (p.id === profile.id) return false;
    const q = searchQuery.toLowerCase();
    const nameMatch = !q || p.name.toLowerCase().includes(q)
      || (p.title || "").toLowerCase().includes(q)
      || (p.specialty || "").toLowerCase().includes(q)
      || (p.interests || []).some(i => i.toLowerCase().includes(q))
      || (p.preferred_accounting_systems || []).some(s => s.toLowerCase().includes(q))
      || (p.department || "").toLowerCase().includes(q)
      || roleLabel(p.role).toLowerCase().includes(q)
      || (p.bio || "").toLowerCase().includes(q);
    const tagMatch = !activeTag || profileMatchesTag(p, activeTag);
    return nameMatch && tagMatch;
  });

  const isFriend = (id: string) => friends.some(f => (f.requester_id === id || f.receiver_id === id) && f.requester_id !== profile.id ? f.requester_id === id : f.receiver_id === id);
  const isPendingSent = (id: string) => pendingSent.some(f => f.receiver_id === id);
  const isPendingReceived = (id: string) => pendingReceived.some(f => f.requester_id === id);

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-5 border-b border-border/10 bg-card/20">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Venner</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Administrer venner og kontakter</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4">
        {([
          { id: "friends" as const, label: "Venner", icon: Users, count: friends.length },
          { id: "requests" as const, label: "Forespørsler", icon: Bell, count: pendingReceived.length },
          { id: "find" as const, label: "Finn personer", icon: Search, count: 0 },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/40"}`}>
            <t.icon size={14} /> {t.label}
            {t.count > 0 && <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] text-center">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === "friends" && (
          <div className="max-w-lg mx-auto space-y-2">
            {friends.length === 0 && (
              <div className="text-center py-12">
                <Users size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Ingen venner ennå</p>
                <button onClick={() => setTab("find")} className="text-primary text-xs hover:underline mt-2">Finn personer å legge til</button>
              </div>
            )}
            {friends.map(f => {
              const fp = getFriendProfile(f);
              return (
                <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/30 transition-all group">
                  <UserAvatar name={fp?.name} avatarUrl={fp?.avatar_url} size="md" online />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fp?.name || "Ukjent"}</p>
                    <p className="text-[10px] text-muted-foreground">{roleLabel(fp?.role || "")}</p>
                  </div>
                  <button onClick={() => removeFriend(f.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all" title="Fjern venn"><UserMinus size={14} /></button>
                </div>
              );
            })}
          </div>
        )}

        {tab === "requests" && (
          <div className="max-w-lg mx-auto space-y-4">
            {/* Received */}
            {pendingReceived.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Mottatte forespørsler</h3>
                <div className="space-y-2">
                  {pendingReceived.map(f => {
                    const fp = (f as any).requester;
                    return (
                      <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/50 border border-border/15">
                        <UserAvatar name={fp?.name} avatarUrl={fp?.avatar_url} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{fp?.name}</p>
                          <p className="text-[10px] text-muted-foreground">{roleLabel(fp?.role || "")}</p>
                        </div>
                        <button onClick={() => acceptRequest(f.id)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all" title="Godta"><Check size={16} /></button>
                        <button onClick={() => rejectRequest(f.id)} className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all" title="Avslå"><X size={16} /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sent */}
            {pendingSent.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sendte forespørsler</h3>
                <div className="space-y-2">
                  {pendingSent.map(f => {
                    const fp = (f as any).receiver;
                    return (
                      <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/20">
                        <UserAvatar name={fp?.name} avatarUrl={fp?.avatar_url} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{fp?.name}</p>
                          <p className="text-[10px] text-muted-foreground">Venter på svar…</p>
                        </div>
                        <button onClick={() => rejectRequest(f.id)} className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all" title="Kanseller"><X size={14} /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pendingReceived.length === 0 && pendingSent.length === 0 && (
              <div className="text-center py-12">
                <Bell size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Ingen ventende forespørsler</p>
              </div>
            )}
          </div>
        )}

        {tab === "find" && (
          <div className="max-w-lg mx-auto space-y-4">
            <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-4 border border-border/15">
              <Search size={14} className="text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Søk på navn, rolle, system, spesialisering…" className="h-11 flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40" autoFocus />
              {(searchQuery || activeTag) && (
                <button onClick={() => { setSearchQuery(""); setActiveTag(null); }} className="p-1 rounded-lg hover:bg-muted/40 text-muted-foreground"><X size={14} /></button>
              )}
            </div>

            {/* Tag quick-filters */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Tag size={9} /> Filtrer på tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.slice(0, 30).map(t => {
                    const isActive = activeTag?.toLowerCase() === t.label.toLowerCase();
                    const colorMap = { specialty: "primary", interest: "accent", system: "secondary", department: "primary", role: "secondary" } as const;
                    const c = colorMap[t.type];
                    return (
                      <button
                        key={t.label}
                        onClick={() => setActiveTag(isActive ? null : t.label)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                          isActive
                            ? `bg-${c}/20 text-${c} border-${c}/40 shadow-sm`
                            : "bg-muted/20 text-muted-foreground border-border/15 hover:bg-muted/40"
                        }`}
                      >
                        {t.type === "system" && <Calculator size={9} className="inline mr-1" />}
                        {t.type === "specialty" && <Star size={9} className="inline mr-1" />}
                        {t.type === "interest" && <Heart size={9} className="inline mr-1" />}
                        {t.type === "department" && <Building size={9} className="inline mr-1" />}
                        {t.type === "role" && <Shield size={9} className="inline mr-1" />}
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTag && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Filtrerer på: <strong className="text-foreground">{activeTag}</strong></span>
                <button onClick={() => setActiveTag(null)} className="text-primary hover:underline">Fjern filter</button>
              </div>
            )}

            <div className="space-y-1">
              {searchResults.slice(0, 30).map(p => {
                const specTags = p.specialty ? p.specialty.split(",").map(s => s.trim()).filter(Boolean) : [];
                const sysTags = p.preferred_accounting_systems || [];
                const intTags = p.interests || [];
                return (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/30 transition-all">
                    <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.title ? `${p.title} · ` : ""}{roleLabel(p.role)}</p>
                      {(specTags.length > 0 || sysTags.length > 0 || intTags.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {specTags.map(t => (
                            <button key={`s-${t}`} onClick={() => setActiveTag(t)} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium hover:bg-primary/20 transition-all">{t}</button>
                          ))}
                          {sysTags.map(t => (
                            <button key={`sys-${t}`} onClick={() => setActiveTag(t)} className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-medium hover:bg-secondary/25 transition-all">{t}</button>
                          ))}
                          {intTags.slice(0, 3).map(t => (
                            <button key={`i-${t}`} onClick={() => setActiveTag(t)} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-medium hover:bg-accent/20 transition-all">{t}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    {friendIds.has(p.id) ? (
                      <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/30 text-muted-foreground text-xs font-medium">
                        <UserCheck size={13} /> Venn
                      </span>
                    ) : isPendingSent(p.id) ? (
                      <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/20 text-muted-foreground text-xs font-medium">
                        Sendt
                      </span>
                    ) : (
                      <button onClick={() => sendRequest(p.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                        <UserPlus size={13} /> Legg til
                      </button>
                    )}
                  </div>
                );
              })}
              {(searchQuery || activeTag) && searchResults.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-8">Ingen treff{searchQuery ? ` for "${searchQuery}"` : ""}{activeTag ? ` med tag "${activeTag}"` : ""}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsView;
