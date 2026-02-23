import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  UserPlus, UserMinus, UserCheck, Users, Search, Bell, X, Check,
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
  const [tab, setTab] = useState<"friends" | "requests" | "find">("friends");

  const fetchFriends = async () => {
    const { data } = await supabase.from("workspace_friends").select("*, requester:profiles!workspace_friends_requester_id_fkey(id, name, role, avatar_url), receiver:profiles!workspace_friends_receiver_id_fkey(id, name, role, avatar_url)");
    const all = (data as any[]) || [];
    setFriends(all.filter(f => f.status === "accepted"));
    setPendingReceived(all.filter(f => f.status === "pending" && f.receiver_id === profile.id));
    setPendingSent(all.filter(f => f.status === "pending" && f.requester_id === profile.id));
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("id, name, role, avatar_url").neq("id", profile.id).order("name");
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

  const searchResults = allProfiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !friendIds.has(p.id) && p.id !== profile.id
  );

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
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Søk etter ansatte, kunder…" className="h-11 flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40" autoFocus />
            </div>
            <div className="space-y-1">
              {searchResults.slice(0, 20).map(p => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/30 transition-all">
                  <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{roleLabel(p.role)}</p>
                  </div>
                  <button onClick={() => sendRequest(p.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                    <UserPlus size={13} /> Legg til
                  </button>
                </div>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-8">Ingen treff for "{searchQuery}"</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsView;
