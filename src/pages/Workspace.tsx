import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Newspaper, Users, MessageSquare, Video, User, UserPlus, Search,
  PanelLeftClose, PanelLeft, EyeOff, Eye, ArrowLeft, Sparkles,
  Globe, Lock, MapPin, Bell,
} from "lucide-react";
import UserAvatar from "@/components/workspace/UserAvatar";
import FeedView from "@/components/workspace/FeedView";
import GroupsView from "@/components/workspace/GroupsView";
import DmsView from "@/components/workspace/DmsView";
import FriendsView from "@/components/workspace/FriendsView";
import FloatingChat from "@/components/workspace/FloatingChat";
import VideoCall from "@/components/workspace/VideoCall";
import PostReactions from "@/components/workspace/PostReactions";
import type { Profile, Post, Group, View } from "@/components/workspace/types";
import { timeAgo, getGroupGradient, roleLabel } from "@/components/workspace/helpers";
import ReactMarkdown from "react-markdown";

// ─── Main ───
const Workspace = () => {
  const { user, profile, isAdmin, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("feed");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [pendingFriendCount, setPendingFriendCount] = useState(0);

  useEffect(() => {
    if (!user) navigate("/admin/logg-inn");
  }, [user]);

  // Fetch pending friend requests count
  useEffect(() => {
    if (!profile) return;
    const fetchPending = async () => {
      const { count } = await supabase.from("workspace_friends").select("*", { count: "exact", head: true }).eq("receiver_id", profile.id).eq("status", "pending");
      setPendingFriendCount(count || 0);
    };
    fetchPending();
    const ch = supabase.channel("friend-badge").on("postgres_changes", { event: "*", schema: "public", table: "workspace_friends" }, () => fetchPending()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [profile?.id]);

  if (!user || !profile) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
        <span className="text-muted-foreground text-sm">Laster workspace…</span>
      </div>
    </div>
  );

  // Customer can only see: profile, feed (public groups), messages, friends
  const navItems = isCustomer
    ? [
        { id: "profile" as View, icon: User, label: "Profil", badge: 0 },
        { id: "groups" as View, icon: Users, label: "Grupper", badge: 0 },
        { id: "dms" as View, icon: MessageSquare, label: "Meldinger", badge: 0 },
        { id: "friends" as View, icon: UserPlus, label: "Venner", badge: pendingFriendCount },
      ]
    : [
        { id: "profile" as View, icon: User, label: "Profil", badge: 0 },
        { id: "feed" as View, icon: Newspaper, label: "Feed", badge: 0 },
        { id: "groups" as View, icon: Users, label: "Grupper", badge: 0 },
        { id: "dms" as View, icon: MessageSquare, label: "Meldinger", badge: 0 },
        { id: "friends" as View, icon: UserPlus, label: "Venner", badge: pendingFriendCount },
        { id: "conference" as View, icon: Video, label: "Konferanse", badge: 0 },
      ];

  return (
    <div className={`flex flex-col ${headerHidden ? "h-screen" : "min-h-screen"}`}>
      {/* Header */}
      {!headerHidden && (
        <header className="h-14 border-b border-border/15 bg-card/80 backdrop-blur-xl flex items-center px-5 gap-4 shrink-0 z-30">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Sparkles size={16} className="text-white" /></div>
            <div>
              <h1 className="text-sm font-semibold leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>Avargo Workspace</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Samhandling & kommunikasjon</p>
            </div>
          </div>
          <div className="flex-1" />
          <button onClick={() => setHeaderHidden(true)} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted/40"><EyeOff size={15} /></button>
          <UserAvatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" online />
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-60" : "w-14"} shrink-0 border-r border-border/10 bg-card/40 flex flex-col transition-all duration-300`}>
          <div className="h-12 flex items-center justify-between px-3 border-b border-border/10">
            {sidebarOpen && <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50 font-medium">Meny</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted/40">
              {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
            </button>
          </div>
          {headerHidden && (
            <button onClick={() => setHeaderHidden(false)} className="mx-2 mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
              <Eye size={13} />{sidebarOpen && <span>Vis header</span>}
            </button>
          )}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${view === item.id ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
                <item.icon size={17} strokeWidth={view === item.id ? 2 : 1.5} />
                {sidebarOpen && (
                  <span className={`flex-1 text-left ${view === item.id ? "font-medium" : "font-light"}`}>{item.label}</span>
                )}
                {sidebarOpen && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-destructive text-white text-[9px] font-bold min-w-[16px] text-center">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-border/10">
            <div className={`flex items-center gap-2.5 ${sidebarOpen ? "" : "justify-center"}`}>
              <UserAvatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" online />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{profile.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{roleLabel(profile.role)}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-hidden bg-background">
          {view === "profile" && <ProfileView profile={profile} onNavigate={setView} />}
          {view === "feed" && <FeedView profile={profile} />}
          {view === "groups" && <GroupsView profile={profile} />}
          {view === "dms" && <DmsView profile={profile} />}
          {view === "friends" && <FriendsView profile={profile} />}
          {view === "conference" && <ConferenceView profile={profile} />}
        </main>
      </div>

      {/* Floating chat widget */}
      <FloatingChat profile={profile} />
    </div>
  );
};

// ─── Profile View ───
const ProfileView = ({ profile, onNavigate }: { profile: Profile; onNavigate: (v: View) => void }) => {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [myGroupIds, setMyGroupIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"feed" | "groups" | "about">("feed");
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [friendCount, setFriendCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("workspace_posts").select("*, profiles(id, name, role, avatar_url)").eq("author_id", profile.id).order("created_at", { ascending: false }).limit(30);
      setMyPosts((data as any[]) || []);
    })();
    (async () => {
      const { data: gs } = await supabase.from("workspace_groups").select("*").order("created_at");
      setAllGroups((gs as Group[]) || []);
      const { data: memberships } = await supabase.from("workspace_group_members").select("group_id").eq("profile_id", profile.id);
      setMyGroupIds((memberships || []).map((m: any) => m.group_id));
    })();
    (async () => {
      const { data } = await supabase.from("profiles").select("id, name, role, avatar_url").neq("id", profile.id).order("name").limit(20);
      setAllProfiles((data as Profile[]) || []);
    })();
    (async () => {
      const { count } = await supabase.from("workspace_friends").select("*", { count: "exact", head: true }).eq("status", "accepted").or(`requester_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
      setFriendCount(count || 0);
    })();
  }, [profile.id]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/10" />
        <div className="max-w-3xl mx-auto px-6 relative">
          <div className="absolute -top-16">
            <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl bg-card">
              <UserAvatar name={profile.name} avatarUrl={profile.avatar_url} size="lg" />
            </div>
          </div>
          <div className="pt-20 pb-5 flex items-end gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{profile.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{roleLabel(profile.role)}</span>
                {profile.email && <span className="flex items-center gap-1"><MapPin size={12} /> {profile.email}</span>}
              </div>
            </div>
            <button onClick={() => onNavigate("dms")} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
              <MessageSquare size={16} /> Melding
            </button>
          </div>
          <div className="flex items-center gap-8 pb-4 border-b border-border/15">
            <button className="text-center group" onClick={() => setActiveTab("feed")}><p className="text-lg font-bold">{myPosts.length}</p><p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Innlegg</p></button>
            <button className="text-center group" onClick={() => setActiveTab("groups")}><p className="text-lg font-bold">{myGroupIds.length}</p><p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Grupper</p></button>
            <button className="text-center group" onClick={() => onNavigate("friends")}><p className="text-lg font-bold">{friendCount}</p><p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Venner</p></button>
          </div>
          <div className="flex gap-1 mt-2">
            {(["feed", "groups", "about"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`}>
                {tab === "feed" ? "Innlegg" : tab === "groups" ? "Grupper" : "Om meg"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {activeTab === "feed" && (
          <div className="space-y-5">
            {myPosts.map(post => {
              const ap = post.profiles as any;
              return (
                <article key={post.id} className="rounded-2xl border border-border/15 bg-card/50 overflow-hidden">
                  <div className="flex items-start gap-3 p-5 pb-0">
                    <UserAvatar name={ap?.name} avatarUrl={ap?.avatar_url} size="md" />
                    <div><span className="text-sm font-semibold">{ap?.name}</span><p className="text-[11px] text-muted-foreground">{timeAgo(post.created_at)} · <Globe size={9} className="inline" /> Alle</p></div>
                  </div>
                  {post.content && <div className="px-5 pt-3 pb-2 text-sm prose prose-sm max-w-none"><ReactMarkdown>{post.content}</ReactMarkdown></div>}
                  {post.image_url && <div className="px-5 pb-3"><img src={post.image_url} alt="" className="w-full max-h-96 object-cover rounded-xl" loading="lazy" /></div>}
                  <div className="px-5 pb-3"><PostReactions postId={post.id} profileId={profile.id} /></div>
                </article>
              );
            })}
            {myPosts.length === 0 && <div className="text-center py-12"><p className="text-muted-foreground text-sm">Ingen innlegg ennå</p></div>}
          </div>
        )}

        {activeTab === "groups" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allGroups.filter(g => myGroupIds.includes(g.id)).map(g => {
              const grad = getGroupGradient(g.color, g.name);
              return (
                <button key={g.id} onClick={() => onNavigate("groups")} className="text-left rounded-2xl border border-border/15 bg-card/60 overflow-hidden hover:shadow-md transition-all">
                  <div className={`h-20 bg-gradient-to-br ${grad} relative`}><div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /></div>
                  <div className="p-4 -mt-5 relative">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-background`}>{g.name.charAt(0)}</div>
                    <h4 className="text-sm font-semibold mt-2">{g.name}</h4>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">{g.is_private ? <Lock size={9} /> : <Globe size={9} />} {g.is_private ? "Privat" : "Offentlig"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/15 bg-card/60 p-6 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2"><User size={14} className="text-primary" /> Profilinformasjon</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Navn</p><p className="text-sm font-medium">{profile.name}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rolle</p><p className="text-sm font-medium">{roleLabel(profile.role)}</p></div>
                {profile.email && <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">E-post</p><p className="text-sm font-medium">{profile.email}</p></div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Conference View ───
const ConferenceView = ({ profile }: { profile: Profile }) => {
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [conferenceActive, setConferenceActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("id, name, role, avatar_url").neq("id", profile.id).order("name");
      setAllProfiles((data as Profile[]) || []);
    })();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const participants = [
    { id: profile.id, name: profile.name, avatar_url: profile.avatar_url },
    ...selected.map(id => allProfiles.find(p => p.id === id)).filter(Boolean) as Array<{ id: string; name: string; avatar_url?: string | null }>,
  ];

  const filteredProfiles = allProfiles.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const confId = `standalone-${[profile.id, ...selected.sort()].join("-")}`;

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-5 border-b border-border/10 bg-card/20">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Konferanse</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Start en videokonferanse med opptil 4 deltakere</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-4 border border-border/15">
            <Search size={14} className="text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Søk etter deltakere…" className="h-11 flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40" />
          </div>
          {selected.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Valgte ({selected.length}/3):</span>
              {selected.map(id => {
                const p = allProfiles.find(pp => pp.id === id);
                return (
                  <button key={id} onClick={() => toggleSelect(id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-all">
                    <UserAvatar name={p?.name} avatarUrl={p?.avatar_url} size="xs" />{p?.name}<span className="ml-1 opacity-60">✕</span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {filteredProfiles.map(p => (
              <button key={p.id} onClick={() => toggleSelect(p.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selected.includes(p.id) ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/40"}`}>
                <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="md" />
                <div className="text-left flex-1"><p className="text-sm font-medium">{p.name}</p><p className="text-[10px] text-muted-foreground capitalize">{roleLabel(p.role)}</p></div>
                {selected.includes(p.id) && <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">✓</div>}
              </button>
            ))}
          </div>
          <button onClick={() => setConferenceActive(true)} disabled={selected.length === 0} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm disabled:opacity-30 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Video size={18} /> Start konferanse ({participants.length} deltakere)
          </button>
        </div>
      </div>
      {conferenceActive && <VideoCall conversationId={confId} profileId={profile.id} profileName={profile.name} profileAvatar={profile.avatar_url} isConference conferenceId={confId} participants={participants} onClose={() => setConferenceActive(false)} />}
    </div>
  );
};

export default Workspace;
