import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Hash, Send, Plus, Trash2, Users, MessageSquare, Newspaper,
  PanelLeftClose, PanelLeft, MessageCircle, Pin, Eye, EyeOff,
  ArrowLeft, Image, Lock, Globe, Search, Bell, Settings, Sparkles,
  Phone, Video,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import UserAvatar from "@/components/workspace/UserAvatar";
import ChatInput from "@/components/workspace/ChatInput";
import MessageBubble from "@/components/workspace/MessageBubble";
import PostReactions from "@/components/workspace/PostReactions";
import EmojiPicker from "@/components/workspace/EmojiPicker";
import VideoCall from "@/components/workspace/VideoCall";

// ─── Types ───
interface Profile { id: string; name: string; role: string; avatar_url?: string | null; email?: string }
interface Channel { id: string; name: string; description: string; color: string }
interface ChatMsg { id: string; content: string; created_at: string; sender_id: string; profiles?: Profile }
interface Post { id: string; title?: string; content: string; pinned: boolean; created_at: string; author_id: string; profiles?: Profile }
interface PostComment { id: string; content: string; created_at: string; author_id: string; profiles?: Profile }
interface Group { id: string; name: string; description?: string; color: string; is_private: boolean; created_by: string }
interface GroupMsg { id: string; content: string; created_at: string; sender_id: string; profiles?: Profile }
interface DmConv { id: string; participant_1: string; participant_2: string; other?: Profile }
interface DmMsg { id: string; content: string; created_at: string; sender_id: string }

type View = "feed" | "channels" | "groups" | "dms";

// ─── Helpers ───
const formatTime = (ts: string) => new Date(ts).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
const formatDate = (ts: string) => new Date(ts).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
const timeAgo = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "nå";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}t`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return formatDate(ts);
};

const groupColors = [
  "from-violet-600 to-purple-500",
  "from-blue-600 to-cyan-500",
  "from-emerald-600 to-teal-500",
  "from-rose-600 to-pink-500",
  "from-amber-600 to-orange-500",
  "from-indigo-600 to-blue-500",
  "from-fuchsia-600 to-pink-500",
];

const getGroupGradient = (color: string, name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return groupColors[Math.abs(hash) % groupColors.length];
};

// ─── Main ───
const Workspace = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("feed");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    if (!user) navigate("/admin/logg-inn");
  }, [user]);

  if (!user || !profile) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
        <span className="text-muted-foreground text-sm">Laster workspace…</span>
      </div>
    </div>
  );

  const navItems = [
    { id: "feed" as View, icon: Newspaper, label: "Feed", badge: null },
    { id: "channels" as View, icon: Hash, label: "Kanaler", badge: null },
    { id: "groups" as View, icon: Users, label: "Grupper", badge: null },
    { id: "dms" as View, icon: MessageSquare, label: "Meldinger", badge: null },
  ];

  return (
    <div className={`flex flex-col ${headerHidden ? "h-screen" : "min-h-screen"}`}>
      {/* Header */}
      {!headerHidden && (
        <header className="h-14 border-b border-border/15 bg-card/80 backdrop-blur-xl flex items-center px-5 gap-4 shrink-0 z-30">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>Avargo Workspace</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Samhandling & kommunikasjon</p>
            </div>
          </div>
          <div className="flex-1" />
          <button onClick={() => setHeaderHidden(true)} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted/40">
            <EyeOff size={15} />
          </button>
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
              <Eye size={13} />
              {sidebarOpen && <span>Vis header</span>}
            </button>
          )}

          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  view === item.id
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <item.icon size={17} strokeWidth={view === item.id ? 2 : 1.5} />
                {sidebarOpen && <span className={view === item.id ? "font-medium" : "font-light"}>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Profile card */}
          <div className="p-3 border-t border-border/10">
            <div className={`flex items-center gap-2.5 ${sidebarOpen ? "" : "justify-center"}`}>
              <UserAvatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" online />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{profile.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{profile.role === "admin" ? "Administrator" : profile.role === "employee" ? "Ansatt" : "Kunde"}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-hidden bg-background">
          {view === "feed" && <FeedView profile={profile} />}
          {view === "channels" && <ChannelsView profile={profile} />}
          {view === "groups" && <GroupsView profile={profile} />}
          {view === "dms" && <DmsView profile={profile} />}
        </main>
      </div>
    </div>
  );
};

// ─── Feed View ───
const FeedView = ({ profile }: { profile: Profile }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("workspace_posts")
      .select("*, profiles(id, name, role, avatar_url)")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);
    setPosts((data as any[]) || []);
  };

  useEffect(() => {
    fetchPosts();
    const ch = supabase.channel("ws-posts").on("postgres_changes", { event: "*", schema: "public", table: "workspace_posts" }, () => fetchPosts()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setSending(true);
    await supabase.from("workspace_posts").insert([{ author_id: profile.id, content: newPost.trim() }]);
    setNewPost("");
    setSending(false);
  };

  const togglePin = async (post: Post) => {
    await supabase.from("workspace_posts").update({ pinned: !post.pinned }).eq("id", post.id);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Slett innlegget?")) return;
    await supabase.from("workspace_posts").delete().eq("id", id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-5 border-b border-border/10 bg-card/20">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Feed</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Kunngjøringer, oppdateringer og alt som skjer</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-5">
          {/* Composer */}
          <div className="rounded-2xl border border-border/20 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
            <div className="flex items-start gap-3 p-4">
              <UserAvatar name={profile.name} avatarUrl={profile.avatar_url} size="md" online />
              <form onSubmit={submitPost} className="flex-1">
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder={`Hva tenker du på, ${profile.name.split(" ")[0]}?`}
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none placeholder:text-muted-foreground/40"
                />
                <div className="flex items-center justify-between pt-2 border-t border-border/10 mt-2">
                  <div className="flex gap-1">
                    <EmojiPicker onSelect={(e) => setNewPost(prev => prev + e)} />
                    <button type="button" className="p-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all">
                      <Image size={18} />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newPost.trim() || sending}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold disabled:opacity-30 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                  >
                    Publiser
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Posts */}
          {posts.map(post => {
            const authorProfile = post.profiles as any;
            return (
              <article
                key={post.id}
                className={`rounded-2xl border overflow-hidden transition-all hover:shadow-md ${
                  post.pinned
                    ? "border-primary/25 bg-gradient-to-br from-primary/5 to-transparent shadow-sm"
                    : "border-border/15 bg-card/50 hover:border-border/25"
                }`}
              >
                {/* Author header */}
                <div className="flex items-start gap-3 p-5 pb-0">
                  <UserAvatar name={authorProfile?.name} avatarUrl={authorProfile?.avatar_url} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{authorProfile?.name || "Ukjent"}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground capitalize">
                        {authorProfile?.role === "admin" ? "Admin" : authorProfile?.role === "employee" ? "Ansatt" : "Kunde"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">{timeAgo(post.created_at)}</span>
                      {post.pinned && (
                        <span className="flex items-center gap-1 text-[10px] text-primary">
                          <Pin size={9} /> Festet
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground">· <Globe size={9} className="inline" /> Alle</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 pt-3 pb-4">
                  <div className="text-sm text-foreground/85 leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                </div>

                {/* Reactions */}
                <div className="px-5 pb-3">
                  <PostReactions postId={post.id} profileId={profile.id} />
                </div>

                {/* Action bar */}
                <div className="flex items-center gap-1 px-3 py-2 border-t border-border/10">
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                  >
                    <MessageCircle size={15} /> Kommenter
                  </button>
                  {(post.author_id === profile.id || profile.role === "admin") && (
                    <>
                      <button onClick={() => togglePin(post)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                        <Pin size={15} /> {post.pinned ? "Løsne" : "Fest"}
                      </button>
                      <button onClick={() => deletePost(post.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                        <Trash2 size={15} /> Slett
                      </button>
                    </>
                  )}
                </div>

                {/* Comments */}
                {expandedPost === post.id && (
                  <PostComments postId={post.id} profileId={profile.id} profileData={profile} />
                )}
              </article>
            );
          })}
          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                <Newspaper size={28} className="text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground text-sm">Ingen innlegg ennå</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Vær den første til å dele noe!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Post Comments ───
const PostComments = ({ postId, profileId, profileData }: { postId: string; profileId: string; profileData: Profile }) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const { data } = await supabase.from("workspace_post_comments").select("*, profiles(id, name, role, avatar_url)").eq("post_id", postId).order("created_at");
    setComments((data as any[]) || []);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await supabase.from("workspace_post_comments").insert([{ post_id: postId, author_id: profileId, content: text.trim() }]);
    setText("");
    fetchComments();
  };

  return (
    <div className="border-t border-border/10 bg-muted/10">
      <div className="px-5 py-3 space-y-3 max-h-64 overflow-y-auto">
        {comments.map(c => {
          const cp = c.profiles as any;
          return (
            <div key={c.id} className="flex gap-2.5">
              <UserAvatar name={cp?.name} avatarUrl={cp?.avatar_url} size="xs" />
              <div className="flex-1">
                <div className="bg-muted/40 rounded-2xl rounded-tl-md px-3 py-2">
                  <span className="text-[11px] font-semibold">{cp?.name || "Ukjent"}</span>
                  <p className="text-xs text-foreground/80 mt-0.5">{c.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground ml-2">{timeAgo(c.created_at)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2.5 px-5 py-3 border-t border-border/10">
        <UserAvatar name={profileData.name} avatarUrl={profileData.avatar_url} size="xs" />
        <div className="flex-1 flex items-center bg-muted/30 rounded-2xl border border-border/15 pr-1">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Skriv en kommentar…"
            className="flex-1 h-9 bg-transparent px-3 text-xs focus:outline-none placeholder:text-muted-foreground/40"
          />
          <button type="submit" disabled={!text.trim()} className="h-7 px-3 rounded-xl bg-primary/10 text-primary text-[10px] font-semibold disabled:opacity-30 transition-all">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Channels View ───
const ChannelsView = ({ profile }: { profile: Profile }) => {
  const [categories, setCategories] = useState<Channel[]>([]);
  const [active, setActive] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", description: "", color: "#6366f1" });
  const endRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAuth();

  const fetchCats = async () => {
    const { data } = await supabase.from("chat_categories").select("*").order("sort_order").order("created_at");
    const cats = (data as Channel[]) || [];
    setCategories(cats);
    if (cats.length > 0 && !active) setActive(cats[0]);
  };

  const fetchMsgs = async (id: string) => {
    const { data } = await supabase.from("chat_messages").select("*, profiles(id, name, role, avatar_url)").eq("category_id", id).order("created_at");
    setMessages((data as ChatMsg[]) || []);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => { fetchCats(); }, []);
  useEffect(() => {
    if (!active) return;
    fetchMsgs(active.id);
    const ch = supabase.channel(`ws-chat-${active.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `category_id=eq.${active.id}` }, () => fetchMsgs(active.id)).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active?.id]);

  const send = async (content: string) => {
    if (!active) return;
    await supabase.from("chat_messages").insert([{ category_id: active.id, sender_id: profile.id, content }]);
  };

  const addCat = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("chat_categories").insert([catForm]);
    setCatForm({ name: "", description: "", color: "#6366f1" });
    setShowNew(false);
    fetchCats();
  };

  const delCat = async (id: string) => {
    if (!confirm("Slett kanal og alle meldinger?")) return;
    await supabase.from("chat_categories").delete().eq("id", id);
    setActive(null);
    fetchCats();
  };

  return (
    <div className="h-full flex">
      {/* Channel list */}
      <div className="w-52 shrink-0 border-r border-border/10 bg-card/20 flex flex-col">
        <div className="p-3 border-b border-border/10 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-medium">Kanaler</span>
          {isAdmin && <button onClick={() => setShowNew(!showNew)} className="text-muted-foreground hover:text-primary transition-colors"><Plus size={14} /></button>}
        </div>
        {showNew && isAdmin && (
          <form onSubmit={addCat} className="p-3 border-b border-border/10 space-y-2">
            <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="Kanalnavn" required className="w-full h-8 rounded-xl border border-border/20 bg-muted/20 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20" />
            <div className="flex gap-2">
              <input type="color" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} className="h-8 w-8 rounded-lg border-0 bg-transparent cursor-pointer" />
              <button type="submit" className="flex-1 h-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl text-xs font-medium">Opprett</button>
            </div>
          </form>
        )}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {categories.map(cat => (
            <div key={cat.id} className="group flex items-center">
              <button onClick={() => setActive(cat)} className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${active?.id === cat.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + "20" }}>
                  <Hash size={11} style={{ color: cat.color }} />
                </div>
                <span className="truncate">{cat.name}</span>
              </button>
              {isAdmin && <button onClick={() => delCat(cat.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1 transition-all"><Trash2 size={11} /></button>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-3.5 border-b border-border/10 bg-card/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: active.color + "20" }}>
              <Hash size={15} style={{ color: active.color }} />
            </div>
            <div>
              <span className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{active.name}</span>
              {active.description && <p className="text-[10px] text-muted-foreground">{active.description}</p>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === profile.id;
              const mp = msg.profiles as any;
              const showDateSep = i === 0 || formatDate(msg.created_at) !== formatDate(messages[i - 1].created_at);
              const showAv = i === 0 || messages[i - 1].sender_id !== msg.sender_id;
              return (
                <div key={msg.id}>
                  {showDateSep && (
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-border/15" />
                      <span className="text-[10px] text-muted-foreground bg-background px-3 py-1 rounded-full border border-border/15">{formatDate(msg.created_at)}</span>
                      <div className="flex-1 h-px bg-border/15" />
                    </div>
                  )}
                  <MessageBubble
                    content={msg.content}
                    senderName={mp?.name}
                    senderAvatar={mp?.avatar_url}
                    time={formatTime(msg.created_at)}
                    isOwn={isOwn}
                    showAvatar={showAv}
                  />
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <ChatInput placeholder={`Skriv i #${active.name}…`} onSend={send} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Hash size={32} className="text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Velg en kanal for å starte</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Groups View ───
const GroupsView = ({ profile }: { profile: Profile }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [active, setActive] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMsg[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#6366f1", is_private: false });
  const [memberCount, setMemberCount] = useState<Record<string, number>>({});
  const endRef = useRef<HTMLDivElement>(null);

  const fetchGroups = async () => {
    const { data } = await supabase.from("workspace_groups").select("*").order("created_at");
    const gs = (data as Group[]) || [];
    setGroups(gs);
    // Fetch member counts
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

  useEffect(() => { fetchGroups(); }, []);
  useEffect(() => {
    if (!active) return;
    fetchMsgs(active.id);
    const ch = supabase.channel(`ws-grp-${active.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "workspace_group_messages", filter: `group_id=eq.${active.id}` }, () => fetchMsgs(active.id)).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active?.id]);

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from("workspace_groups").insert([{ ...form, created_by: profile.id }]).select().single();
    if (data) {
      await supabase.from("workspace_group_members").insert([{ group_id: data.id, profile_id: profile.id }]);
    }
    setForm({ name: "", description: "", color: "#6366f1", is_private: false });
    setShowNew(false);
    fetchGroups();
  };

  const send = async (content: string) => {
    if (!active) return;
    await supabase.from("workspace_group_messages").insert([{ group_id: active.id, sender_id: profile.id, content }]);
  };

  const joinGroup = async (groupId: string) => {
    try { await supabase.from("workspace_group_members").insert([{ group_id: groupId, profile_id: profile.id }]); } catch {}
  };

  return (
    <div className="h-full flex flex-col">
      {!active ? (
        /* Groups grid */
        <>
          <div className="px-6 py-5 border-b border-border/10 bg-card/20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Grupper</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Teams og spesialiserte grupper</p>
            </div>
            <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              <Plus size={14} /> Ny gruppe
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map(g => {
                const gradient = getGroupGradient(g.color, g.name);
                return (
                  <button
                    key={g.id}
                    onClick={() => { setActive(g); joinGroup(g.id); }}
                    className="group text-left rounded-2xl border border-border/15 bg-card/50 overflow-hidden hover:border-border/30 hover:shadow-lg transition-all"
                  >
                    {/* Cover */}
                    <div className={`h-20 bg-gradient-to-br ${gradient} relative`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px]">
                        <Users size={10} /> {memberCount[g.id] || 0}
                      </div>
                      {g.is_private && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px] flex items-center gap-1">
                          <Lock size={9} /> Privat
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{g.name}</h3>
                      {g.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{g.description}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
            {groups.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground text-sm">Ingen grupper ennå</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Opprett den første gruppen!</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Group chat */
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-3.5 border-b border-border/10 bg-card/20 flex items-center gap-3">
            <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
            </button>
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getGroupGradient(active.color, active.name)} flex items-center justify-center`}>
              <Users size={14} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{active.name}</span>
                {active.is_private && <Lock size={11} className="text-muted-foreground" />}
              </div>
              {active.description && <p className="text-[10px] text-muted-foreground">{active.description}</p>}
            </div>
            <div className="flex-1" />
            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users size={10} /> {memberCount[active.id] || 0} medlemmer</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === profile.id;
              const mp = msg.profiles as any;
              const showAv = i === 0 || messages[i - 1].sender_id !== msg.sender_id;
              return (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  senderName={mp?.name}
                  senderAvatar={mp?.avatar_url}
                  time={formatTime(msg.created_at)}
                  isOwn={isOwn}
                  showAvatar={showAv}
                />
              );
            })}
            <div ref={endRef} />
          </div>
          <ChatInput placeholder={`Skriv i ${active.name}…`} onSend={send} />
        </div>
      )}
    </div>
  );
};

// ─── DMs View ───
const DmsView = ({ profile }: { profile: Profile }) => {
  const [conversations, setConversations] = useState<DmConv[]>([]);
  const [active, setActive] = useState<DmConv | null>(null);
  const [messages, setMessages] = useState<DmMsg[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ from: string; withVideo: boolean; convId: string } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchConvs = async () => {
    const { data } = await supabase.from("dm_conversations").select("*").order("updated_at", { ascending: false });
    if (!data) return;
    const profileIds = new Set<string>();
    data.forEach((c: any) => { profileIds.add(c.participant_1); profileIds.add(c.participant_2); });
    const { data: profiles } = await supabase.from("profiles").select("id, name, role, avatar_url").in("id", [...profileIds]);
    const pMap = new Map((profiles || []).map((p: any) => [p.id, p]));
    setConversations(data.map((c: any) => ({
      ...c,
      other: pMap.get(c.participant_1 === profile.id ? c.participant_2 : c.participant_1),
    })));
  };

  const fetchMsgs = async (id: string) => {
    const { data } = await supabase.from("dm_messages").select("*").eq("conversation_id", id).order("created_at");
    setMessages((data as DmMsg[]) || []);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("id, name, role, avatar_url").neq("id", profile.id).order("name");
    setAllProfiles((data as Profile[]) || []);
  };

  useEffect(() => { fetchConvs(); fetchProfiles(); }, []);

  // Listen for incoming calls across all conversations
  useEffect(() => {
    const callChannels: any[] = [];
    conversations.forEach(conv => {
      const chName = `call-${[profile.id, conv.id].sort().join("-")}`;
      const ch = supabase.channel(`listen-${chName}`, { config: { broadcast: { self: false } } });
      ch.on("broadcast", { event: "invite" }, ({ payload }) => {
        if (payload.from !== profile.id) {
          setIncomingCall({ from: payload.from, withVideo: payload.withVideo, convId: conv.id });
        }
      });
      ch.subscribe();
      callChannels.push(ch);
    });
    return () => { callChannels.forEach(ch => supabase.removeChannel(ch)); };
  }, [conversations, profile.id]);

  useEffect(() => {
    if (!active) return;
    fetchMsgs(active.id);
    const ch = supabase.channel(`ws-dm-${active.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "dm_messages", filter: `conversation_id=eq.${active.id}` }, () => fetchMsgs(active.id)).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active?.id]);

  const startDm = async (otherId: string) => {
    const { data: existing } = await supabase.from("dm_conversations").select("*")
      .or(`and(participant_1.eq.${profile.id},participant_2.eq.${otherId}),and(participant_1.eq.${otherId},participant_2.eq.${profile.id})`);
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
    await supabase.from("dm_messages").insert([{ conversation_id: active.id, sender_id: profile.id, content }]);
  };

  const filteredProfiles = allProfiles.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex">
      {/* Conversations list */}
      <div className="w-64 shrink-0 border-r border-border/10 bg-card/20 flex flex-col">
        <div className="p-3 border-b border-border/10 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Meldinger</span>
          <button onClick={() => setShowNew(!showNew)} className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
            <Plus size={14} />
          </button>
        </div>

        {showNew && (
          <div className="border-b border-border/10">
            <div className="p-2">
              <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 border border-border/15">
                <Search size={13} className="text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Søk etter personer…"
                  className="h-9 flex-1 bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground/40"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto p-2 space-y-0.5">
              {filteredProfiles.map(p => (
                <button key={p.id} onClick={() => startDm(p.id)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs hover:bg-muted/40 transition-all">
                  <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="sm" />
                  <div className="text-left">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{p.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActive(conv)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                active?.id === conv.id ? "bg-primary/10" : "hover:bg-muted/40"
              }`}
            >
              <UserAvatar name={conv.other?.name} avatarUrl={conv.other?.avatar_url} size="md" online />
              <div className="text-left flex-1 min-w-0">
                <p className={`text-sm truncate ${active?.id === conv.id ? "text-primary font-medium" : ""}`}>{conv.other?.name || "Ukjent"}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{conv.other?.role || ""}</p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && !showNew && (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground">Ingen samtaler</p>
              <button onClick={() => setShowNew(true)} className="text-xs text-primary hover:underline mt-1">Start en ny</button>
            </div>
          )}
        </div>
      </div>

      {/* Chat */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-3.5 border-b border-border/10 bg-card/20 flex items-center gap-3">
            <UserAvatar name={active.other?.name} avatarUrl={active.other?.avatar_url} size="md" online />
            <div className="flex-1">
              <span className="font-semibold text-sm">{active.other?.name || "Ukjent"}</span>
              <p className="text-[10px] text-muted-foreground capitalize">{active.other?.role || ""}</p>
            </div>
            <button
              onClick={() => { setCallActive(true); }}
              className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-green-500/15 text-muted-foreground hover:text-green-500 flex items-center justify-center transition-all"
              title="Lydsamtale"
            >
              <Phone size={16} />
            </button>
            <button
              onClick={() => { setCallActive(true); }}
              className="w-9 h-9 rounded-xl bg-muted/40 hover:bg-primary/15 text-muted-foreground hover:text-primary flex items-center justify-center transition-all"
              title="Videosamtale"
            >
              <Video size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === profile.id;
              const showAv = i === 0 || messages[i - 1].sender_id !== msg.sender_id;
              return (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  senderName={isOwn ? profile.name : active.other?.name}
                  senderAvatar={isOwn ? profile.avatar_url : active.other?.avatar_url}
                  time={formatTime(msg.created_at)}
                  isOwn={isOwn}
                  showAvatar={showAv}
                />
              );
            })}
            <div ref={endRef} />
          </div>
          <ChatInput placeholder={`Skriv til ${active.other?.name}…`} onSend={send} />
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

      {/* Active call */}
      {callActive && active && (
        <VideoCall
          conversationId={active.id}
          profileId={profile.id}
          profileName={profile.name}
          profileAvatar={profile.avatar_url}
          otherName={active.other?.name}
          otherAvatar={active.other?.avatar_url}
          onClose={() => setCallActive(false)}
        />
      )}

      {/* Incoming call */}
      {incomingCall && !callActive && (
        <VideoCall
          conversationId={incomingCall.convId}
          profileId={profile.id}
          profileName={profile.name}
          profileAvatar={profile.avatar_url}
          otherName={conversations.find(c => c.id === incomingCall.convId)?.other?.name}
          otherAvatar={conversations.find(c => c.id === incomingCall.convId)?.other?.avatar_url}
          incoming={incomingCall}
          onClose={() => setIncomingCall(null)}
        />
      )}
    </div>
  );
};

export default Workspace;
