import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Newspaper, Users, MessageSquare, Video, User, UserPlus, Search, X,
  PanelLeftClose, PanelLeft, EyeOff, Eye, ArrowLeft, Sparkles, Bell,
  Globe, Lock, MapPin, Briefcase, Building2, Star, Heart, Camera, MessageCircle, Pin,
} from "lucide-react";
import UserAvatar from "@/components/workspace/UserAvatar";
import FeedView, { PostComments } from "@/components/workspace/FeedView";
import GroupsView from "@/components/workspace/GroupsView";
import DmsView from "@/components/workspace/DmsView";
import FriendsView from "@/components/workspace/FriendsView";
import FloatingChat from "@/components/workspace/FloatingChat";
import VideoCall from "@/components/workspace/VideoCall";
import PostReactions from "@/components/workspace/PostReactions";
import ProfileEditView from "@/components/workspace/ProfileEditView";
import NotificationBell from "@/components/workspace/NotificationBell";
import { useWorkspaceNotifications } from "@/hooks/useWorkspaceNotifications";
import { usePresence } from "@/hooks/usePresence";
import { PresenceContext } from "@/contexts/PresenceContext";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const wsNotifs = useWorkspaceNotifications(profile?.id);
  const presence = usePresence(profile?.id);

  useEffect(() => {
    if (!user) navigate("/admin/logg-inn");
  }, [user]);

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

  // Global profile search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setShowSearchResults(false); return; }
    setShowSearchResults(true);
    const timer = setTimeout(async () => {
      const q = searchQuery.trim();
      const qLower = q.toLowerCase();
      const qUpper = q.charAt(0).toUpperCase() + q.slice(1).toLowerCase();
      const { data } = await supabase.from("profiles")
        .select("id, name, role, avatar_url, title, department, specialty, interests, bio, background_url, email, phone, preferred_accounting_systems")
        .or(`name.ilike.%${q}%,title.ilike.%${q}%,specialty.ilike.%${q}%,department.ilike.%${q}%,bio.ilike.%${q}%,interests.cs.{"${q}"},interests.cs.{"${qLower}"},interests.cs.{"${qUpper}"},preferred_accounting_systems.cs.{"${q}"},preferred_accounting_systems.cs.{"${qLower}"},preferred_accounting_systems.cs.{"${qUpper}"}`)
        .limit(10);
      setSearchResults((data as Profile[]) || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const openProfile = (p: Profile) => {
    setViewingProfile(p);
    setView("view-profile");
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Mark feed notifications read when opening feed
  useEffect(() => {
    if (!profile) return;
    if (view === "feed") wsNotifs.markTypeRead(["feed_post", "feed_comment", "feed_reaction"]);
    if (view === "groups") wsNotifs.markTypeRead(["group_message"]);
    if (view === "dms") wsNotifs.markTypeRead(["dm_message"]);
    if (view === "friends") wsNotifs.markTypeRead(["friend_request"]);
  }, [view, profile?.id]);

  if (!user || !profile) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
        <span className="text-muted-foreground text-sm">Laster workspace…</span>
      </div>
    </div>
  );

  const navItems = isCustomer
    ? [
        { id: "profile" as View, icon: User, label: "Profil", badge: 0 },
        { id: "groups" as View, icon: Users, label: "Grupper", badge: wsNotifs.unreadGroupCount },
        { id: "dms" as View, icon: MessageSquare, label: "Meldinger", badge: wsNotifs.unreadDmCount },
        { id: "friends" as View, icon: UserPlus, label: "Venner", badge: pendingFriendCount },
      ]
    : [
        { id: "profile" as View, icon: User, label: "Profil", badge: 0 },
        { id: "feed" as View, icon: Newspaper, label: "Feed", badge: wsNotifs.unreadFeedCount },
        { id: "groups" as View, icon: Users, label: "Grupper", badge: wsNotifs.unreadGroupCount },
        { id: "dms" as View, icon: MessageSquare, label: "Meldinger", badge: wsNotifs.unreadDmCount },
        { id: "friends" as View, icon: UserPlus, label: "Venner", badge: pendingFriendCount },
        { id: "conference" as View, icon: Video, label: "Konferanse", badge: 0 },
      ];

  const handleNotifNavigate = (targetView: View, refId?: string) => {
    setView(targetView);
    setViewingProfile(null);
  };

  return (
    <PresenceContext.Provider value={presence}>
    <div className={`flex flex-col ${headerHidden ? "h-screen" : "min-h-screen"}`}>
      {/* Header with search */}
      {!headerHidden && (
        <header className="h-14 border-b border-border/15 bg-card/80 backdrop-blur-xl flex items-center px-5 gap-4 shrink-0 z-30 sticky top-0">
          <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-foreground transition-colors" title="Tilbake til admin"><ArrowLeft size={18} /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Sparkles size={16} className="text-white" /></div>
            <div>
              <h1 className="text-sm font-semibold leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>Avargo Workspace</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Samhandling & kommunikasjon</p>
            </div>
          </div>
          {/* Search */}
          <div className="flex-1 max-w-md mx-4 relative">
            <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 border border-border/15">
              <Search size={14} className="text-muted-foreground shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                placeholder="Søk etter personer…"
                className="h-9 flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40"
              />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-card border border-border/30 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                {searchResults.map(p => (
                  <button key={p.id} onMouseDown={() => openProfile(p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-all text-left">
                    <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="md" profileId={p.id} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.title || roleLabel(p.role)} {p.department ? `· ${p.department}` : ""}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <NotificationBell
            notifications={wsNotifs.notifications}
            unreadCount={wsNotifs.unreadCount}
            onMarkRead={wsNotifs.markRead}
            onMarkAllRead={wsNotifs.markAllRead}
            onNavigate={handleNotifNavigate}
          />
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
              <button key={item.id} onClick={() => { setView(item.id); setViewingProfile(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${view === item.id ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
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
        <main className="flex-1 overflow-y-auto bg-background">
          {view === "profile" && <ProfileView profile={profile} onNavigate={setView} />}
          {view === "view-profile" && viewingProfile && <ViewProfilePage profile={viewingProfile} myProfile={profile} onBack={() => setView("feed")} onNavigate={setView} />}
          {view === "feed" && <FeedView profile={profile} />}
          {view === "groups" && <GroupsView profile={profile} />}
          {view === "dms" && <DmsView profile={profile} />}
          {view === "friends" && <FriendsView profile={profile} />}
          {view === "conference" && <ConferenceView profile={profile} />}
        </main>
      </div>

      <FloatingChat profile={profile} />
    </div>
    </PresenceContext.Provider>
  );
};

// ─── View Other Profile Page ───
const ViewProfilePage = ({ profile, myProfile, onBack, onNavigate }: { profile: Profile; myProfile: Profile; onBack: () => void; onNavigate: (v: View) => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [friendCount, setFriendCount] = useState(0);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [memberGroupIds, setMemberGroupIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"feed" | "groups" | "about">("feed");
  const [friendStatus, setFriendStatus] = useState<"none" | "pending_sent" | "pending_received" | "accepted">("none");
  const [friendRowId, setFriendRowId] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const fetchFriendStatus = async () => {
    const { data } = await supabase.from("workspace_friends").select("*").or(`and(requester_id.eq.${myProfile.id},receiver_id.eq.${profile.id}),and(requester_id.eq.${profile.id},receiver_id.eq.${myProfile.id})`);
    const row = data?.[0];
    if (!row) { setFriendStatus("none"); setFriendRowId(null); return; }
    setFriendRowId(row.id);
    if (row.status === "accepted") setFriendStatus("accepted");
    else if (row.requester_id === myProfile.id) setFriendStatus("pending_sent");
    else setFriendStatus("pending_received");
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("workspace_posts").select("*, profiles(id, name, role, avatar_url, active)").eq("author_id", profile.id).order("created_at", { ascending: false }).limit(20);
      const ps = (data as any[]) || [];
      setPosts(ps);
      const counts: Record<string, number> = {};
      for (const p of ps) {
        const { count } = await supabase.from("workspace_post_comments").select("*", { count: "exact", head: true }).eq("post_id", p.id);
        counts[p.id] = count || 0;
      }
      setCommentCounts(counts);
    })();
    (async () => {
      const { count } = await supabase.from("workspace_friends").select("*", { count: "exact", head: true }).eq("status", "accepted").or(`requester_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
      setFriendCount(count || 0);
    })();
    (async () => {
      const { data: gs } = await supabase.from("workspace_groups").select("*").order("created_at");
      setAllGroups((gs as Group[]) || []);
      const { data: memberships } = await supabase.from("workspace_group_members").select("group_id").eq("profile_id", profile.id);
      setMemberGroupIds((memberships || []).map((m: any) => m.group_id));
    })();
    fetchFriendStatus();
  }, [profile.id]);

  const sendFriendRequest = async () => {
    await supabase.from("workspace_friends").insert([{ requester_id: myProfile.id, receiver_id: profile.id }]);
    fetchFriendStatus();
  };

  const acceptFriend = async () => {
    if (!friendRowId) return;
    await supabase.from("workspace_friends").update({ status: "accepted" }).eq("id", friendRowId);
    fetchFriendStatus();
  };

  const removeFriend = async () => {
    if (!friendRowId) return;
    await supabase.from("workspace_friends").delete().eq("id", friendRowId);
    fetchFriendStatus();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        <div className="h-48" style={profile.background_url ? { backgroundImage: `url(${profile.background_url})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "linear-gradient(to right, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.1))" }} />
        <div className="max-w-3xl mx-auto px-6 relative">
          <button onClick={onBack} className="absolute top-4 left-6 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm text-white text-xs flex items-center gap-1.5 hover:bg-black/50 transition-all"><ArrowLeft size={12} /> Tilbake</button>
          <div className="absolute -top-16">
            <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl bg-card">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-semibold">{profile.name.charAt(0).toUpperCase()}</div>
              )}
            </div>
          </div>
          <div className="pt-20 pb-5 flex items-end gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{profile.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{profile.title || roleLabel(profile.role)}</span>
                {profile.department && <span className="flex items-center gap-1 text-xs"><Building2 size={11} /> {profile.department}</span>}
                {profile.specialty && <span className="flex items-center gap-1 text-xs"><Star size={11} /> {profile.specialty}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {friendStatus === "none" && (
                <button onClick={sendFriendRequest} className="px-4 py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-all active:scale-95 flex items-center gap-2">
                  <UserPlus size={16} /> Legg til venn
                </button>
              )}
              {friendStatus === "pending_sent" && (
                <button onClick={removeFriend} className="px-4 py-2.5 rounded-xl bg-muted/50 text-muted-foreground text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-all flex items-center gap-2">
                  <X size={16} /> Forespørsel sendt
                </button>
              )}
              {friendStatus === "pending_received" && (
                <button onClick={acceptFriend} className="px-4 py-2.5 rounded-xl bg-green-500/10 text-green-600 text-sm font-semibold hover:bg-green-500/20 transition-all flex items-center gap-2">
                  <UserPlus size={16} /> Godta forespørsel
                </button>
              )}
              {friendStatus === "accepted" && (
                <button onClick={removeFriend} className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-all flex items-center gap-2">
                  <Users size={16} /> Venner ✓
                </button>
              )}
              <button onClick={() => onNavigate("dms")} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                <MessageSquare size={16} /> Melding
              </button>
            </div>
          </div>
          <div className="flex items-center gap-8 pb-4 border-b border-border/15">
            <button className="text-center group" onClick={() => setActiveTab("feed")}><p className="text-lg font-bold">{posts.length}</p><p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Innlegg</p></button>
            <button className="text-center group" onClick={() => setActiveTab("groups")}><p className="text-lg font-bold">{memberGroupIds.length}</p><p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Grupper</p></button>
            <div className="text-center"><p className="text-lg font-bold">{friendCount}</p><p className="text-xs text-muted-foreground">Venner</p></div>
          </div>
          <div className="flex gap-1 mt-2">
            {(["feed", "groups", "about"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`}>
                {tab === "feed" ? "Innlegg" : tab === "groups" ? "Grupper" : "Om"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {activeTab === "feed" && (
          <div className="space-y-5">
            {posts.map(post => {
              const ap = post.profiles as any;
              return (
                <article key={post.id} className="rounded-2xl border border-border/15 bg-card/50 overflow-hidden">
                  <div className="flex items-start gap-3 p-5 pb-0">
                    <UserAvatar name={ap?.name} avatarUrl={ap?.avatar_url} size="md" />
                    <div><span className="text-sm font-semibold">{ap?.name}</span><p className="text-[11px] text-muted-foreground">{timeAgo(post.created_at)} · <Globe size={9} className="inline" /> Alle</p></div>
                  </div>
                  {post.content && <div className="px-5 pt-3 pb-2 text-sm prose prose-sm max-w-none"><ReactMarkdown>{post.content}</ReactMarkdown></div>}
                  {post.image_url && <div className="px-5 pb-3"><img src={post.image_url} alt="" className="w-full max-h-96 object-cover rounded-xl" loading="lazy" /></div>}
                  <div className="px-5 pb-3"><PostReactions postId={post.id} profileId={myProfile.id} /></div>
                  <div className="flex items-center gap-1 px-3 py-2 border-t border-border/10">
                    <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
                      <MessageCircle size={15} /> Kommenter {commentCounts[post.id] > 0 && <span className="px-1.5 py-0.5 rounded-full bg-muted/50 text-[10px] font-medium">{commentCounts[post.id]}</span>}
                    </button>
                  </div>
                  {expandedPost === post.id && <PostComments postId={post.id} profileId={myProfile.id} profileData={myProfile} />}
                </article>
              );
            })}
            {posts.length === 0 && <div className="text-center py-12"><p className="text-muted-foreground text-sm">Ingen innlegg ennå</p></div>}
          </div>
        )}

        {activeTab === "groups" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allGroups.filter(g => memberGroupIds.includes(g.id)).map(g => {
              const grad = getGroupGradient(g.color, g.name);
              return (
                <div key={g.id} className="text-left rounded-2xl border border-border/15 bg-card/60 overflow-hidden">
                  <div className={`h-20 bg-gradient-to-br ${grad} relative`}><div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /></div>
                  <div className="p-4 -mt-5 relative">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-background`}>{g.name.charAt(0)}</div>
                    <h4 className="text-sm font-semibold mt-2">{g.name}</h4>
                    {g.description && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{g.description}</p>}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">{g.is_private ? <Lock size={9} /> : <Globe size={9} />} {g.is_private ? "Privat" : "Offentlig"}</span>
                  </div>
                </div>
              );
            })}
            {memberGroupIds.length === 0 && <div className="sm:col-span-2 text-center py-12"><p className="text-muted-foreground text-sm">Ikke medlem av noen grupper</p></div>}
          </div>
        )}

        {activeTab === "about" && (
          <div className="rounded-2xl border border-border/15 bg-card/60 p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Briefcase size={9} /> Rolle / Tittel</p>
                <p className="text-sm font-medium mt-0.5">{profile.title || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Building2 size={9} /> Avdeling</p>
                <p className="text-sm font-medium mt-0.5">{profile.department || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Star size={9} /> Spesialisering</p>
                <p className="text-sm font-medium mt-0.5">{profile.specialty || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
              </div>
              {profile.email && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><MessageCircle size={9} /> E-post</p>
                  <p className="text-sm font-medium mt-0.5">{profile.email}</p>
                </div>
              )}
              {profile.phone && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><User size={9} /> Telefon</p>
                  <p className="text-sm font-medium mt-0.5">{profile.phone}</p>
                </div>
              )}
              {profile.bio && (
                <div className="sm:col-span-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bio</p>
                  <p className="text-sm mt-0.5 text-foreground/80">{profile.bio}</p>
                </div>
              )}
              <div className="sm:col-span-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Heart size={9} /> Interesser</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(profile.interests && profile.interests.length > 0) ? profile.interests.map((interest, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs">{interest}</span>
                  )) : <span className="text-sm text-muted-foreground/50 italic">Ingen interesser lagt til</span>}
                </div>
              </div>
              {profile.preferred_accounting_systems && profile.preferred_accounting_systems.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Sparkles size={9} /> Foretrukne regnskapssystemer</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {profile.preferred_accounting_systems.map((sys, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">{sys}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Profile View ───
const ProfileView = ({ profile: initialProfile, onNavigate }: { profile: Profile; onNavigate: (v: View) => void }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [myGroupIds, setMyGroupIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"feed" | "groups" | "about">("feed");
  const [friendCount, setFriendCount] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const avatarRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);

  const refetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("id, name, role, avatar_url, active, title, department, specialty, interests, bio, background_url, email, phone, preferred_accounting_systems").eq("id", profile.id).single();
    if (data) setProfile(data as Profile);
  };

  const uploadAvatar = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `avatars/${profile.id}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("workspace-uploads").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("workspace-uploads").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", profile.id);
      await refetchProfile();
    } catch { /* ignore */ }
    setUploadingAvatar(false);
  };

  const uploadBackground = async (file: File) => {
    setUploadingBg(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `backgrounds/${profile.id}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("workspace-uploads").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("workspace-uploads").getPublicUrl(path);
      await supabase.from("profiles").update({ background_url: data.publicUrl }).eq("id", profile.id);
      await refetchProfile();
    } catch { /* ignore */ }
    setUploadingBg(false);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("workspace_posts").select("*, profiles(id, name, role, avatar_url, active)").eq("author_id", profile.id).order("created_at", { ascending: false }).limit(30);
      const ps = (data as any[]) || [];
      setMyPosts(ps);
      const counts: Record<string, number> = {};
      for (const p of ps) {
        const { count } = await supabase.from("workspace_post_comments").select("*", { count: "exact", head: true }).eq("post_id", p.id);
        counts[p.id] = count || 0;
      }
      setCommentCounts(counts);
    })();
    (async () => {
      const { data: gs } = await supabase.from("workspace_groups").select("*").order("created_at");
      setAllGroups((gs as Group[]) || []);
      const { data: memberships } = await supabase.from("workspace_group_members").select("group_id").eq("profile_id", profile.id);
      setMyGroupIds((memberships || []).map((m: any) => m.group_id));
    })();
    (async () => {
      const { count } = await supabase.from("workspace_friends").select("*", { count: "exact", head: true }).eq("status", "accepted").or(`requester_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
      setFriendCount(count || 0);
    })();
  }, [profile.id]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        {/* Background - clickable to change */}
        <div
          className="h-48 relative group cursor-pointer"
          style={profile.background_url ? { backgroundImage: `url(${profile.background_url})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "linear-gradient(to right, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.1))" }}
          onClick={() => bgRef.current?.click()}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-xs font-medium flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm">
              {uploadingBg ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera size={14} />}
              Endre bakgrunnsbilde
            </span>
          </div>
          <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadBackground(f); e.target.value = ""; }} />
        </div>
        <div className="max-w-3xl mx-auto px-6 relative">
          {/* Avatar - clickable to change */}
          <div className="absolute -top-16">
            <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl bg-card relative group cursor-pointer" onClick={() => avatarRef.current?.click()}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-semibold">{profile.name.charAt(0).toUpperCase()}</div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-all text-white">
                  {uploadingAvatar ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera size={22} />}
                </span>
              </div>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); e.target.value = ""; }} />
            </div>
          </div>
          <div className="pt-20 pb-5 flex items-end gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{profile.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{profile.title || roleLabel(profile.role)}</span>
                {profile.department && <span className="flex items-center gap-1 text-xs"><Building2 size={11} /> {profile.department}</span>}
                {profile.specialty && <span className="flex items-center gap-1 text-xs"><Star size={11} /> {profile.specialty}</span>}
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
                <article key={post.id} className="rounded-2xl border border-border/15 bg-card/50 hover:border-border/25 transition-all hover:shadow-md overflow-hidden">
                  <div className="flex items-start gap-3 p-5 pb-0">
                    <UserAvatar name={ap?.name} avatarUrl={ap?.avatar_url} size="md" />
                    <div className="flex-1">
                      <span className="text-sm font-semibold">{ap?.name}</span>
                      <p className="text-[11px] text-muted-foreground">
                        {timeAgo(post.created_at)}
                        {(post as any).edited_at && <span className="ml-1 italic">· redigert</span>}
                        {" · "}<Globe size={9} className="inline" /> Alle
                      </p>
                    </div>
                    {post.pinned && <Pin size={13} className="text-primary shrink-0" />}
                  </div>
                  {post.content && (
                    <div className="px-5 pt-3 pb-2 text-sm text-foreground/85 leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                  )}
                  {post.image_url && (
                    <div className="px-5 pb-3">
                      <img src={post.image_url} alt="Post media" className="w-full max-h-96 object-cover rounded-xl border border-border/10" loading="lazy" />
                    </div>
                  )}
                  <div className="px-5 pb-3">
                    <PostReactions postId={post.id} profileId={profile.id} />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-2 border-t border-border/10">
                    <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
                      <MessageCircle size={15} /> Kommenter {commentCounts[post.id] > 0 && <span className="px-1.5 py-0.5 rounded-full bg-muted/50 text-[10px] font-medium">{commentCounts[post.id]}</span>}
                    </button>
                  </div>
                  {expandedPost === post.id && <PostComments postId={post.id} profileId={profile.id} profileData={profile} />}
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
            <ProfileEditView profile={profile} onUpdated={refetchProfile} />
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
      const { data } = await supabase.from("profiles").select("id, name, role, avatar_url, active").neq("id", profile.id).order("name");
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
