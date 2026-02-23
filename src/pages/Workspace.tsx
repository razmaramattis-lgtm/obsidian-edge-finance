import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Hash, Send, Plus, Trash2, Users, MessageSquare, Newspaper,
  ChevronDown, PanelLeftClose, PanelLeft, ThumbsUp, Heart,
  MessageCircle, Pin, UserPlus, LogOut, ArrowLeft, Eye, EyeOff,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// ─── Types ───
interface Profile { id: string; name: string; role: string; avatar_url?: string | null }
interface Channel { id: string; name: string; description: string; color: string }
interface ChatMsg { id: string; content: string; created_at: string; sender_id: string; profiles?: Profile }
interface Post { id: string; title?: string; content: string; pinned: boolean; created_at: string; author_id: string; profiles?: Profile; reaction_count?: number; comment_count?: number }
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
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}t`;
  return `${Math.floor(hrs / 24)}d`;
};
const avatar = (name?: string) => (name || "?").charAt(0).toUpperCase();

// ─── Main ───
const Workspace = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("feed");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [headerHidden, setHeaderHidden] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/admin/logg-inn");
  }, [user]);

  if (!user || !profile) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Laster…</div>;

  return (
    <div className={`flex flex-col ${headerHidden ? "h-screen" : "min-h-screen"}`}>
      {/* Mini header */}
      {!headerHidden && (
        <header className="h-12 border-b border-border/15 bg-card/80 backdrop-blur-xl flex items-center px-4 gap-3 shrink-0 z-30">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={16} /></button>
          <span className="font-heading text-lg text-primary">Avargo</span>
          <span className="text-xs text-muted-foreground">Workspace</span>
          <div className="flex-1" />
          <button onClick={() => setHeaderHidden(true)} title="Skjul header" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted/50">
            <EyeOff size={14} />
          </button>
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">
            {avatar(profile.name)}
          </div>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-56" : "w-12"} shrink-0 border-r border-border/10 bg-card/50 flex flex-col transition-all duration-200`}>
          {/* Toggle */}
          <div className="h-11 flex items-center justify-between px-2 border-b border-border/10">
            {sidebarOpen && <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 pl-1">Workspace</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg">
              {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
            </button>
          </div>

          {/* Show header button when hidden */}
          {headerHidden && (
            <button onClick={() => setHeaderHidden(false)} className="mx-2 mt-2 mb-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Eye size={12} />
              {sidebarOpen && <span>Vis header</span>}
            </button>
          )}

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {([
              { id: "feed" as View, icon: Newspaper, label: "Feed" },
              { id: "channels" as View, icon: Hash, label: "Kanaler" },
              { id: "groups" as View, icon: Users, label: "Grupper" },
              { id: "dms" as View, icon: MessageSquare, label: "Meldinger" },
            ]).map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all ${
                  view === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <item.icon size={15} strokeWidth={1.5} />
                {sidebarOpen && <span className="font-light">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-2 border-t border-border/10">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-medium">{avatar(profile.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] truncate">{profile.name}</p>
                  <p className="text-[9px] text-muted-foreground capitalize">{profile.role}</p>
                </div>
              </div>
            ) : (
              <div className="w-7 h-7 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-medium">{avatar(profile.name)}</div>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
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
      <div className="px-6 py-4 border-b border-border/10">
        <h2 className="text-lg font-medium">Feed</h2>
        <p className="text-xs text-muted-foreground">Kunngjøringer og oppdateringer</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* New post form */}
        <form onSubmit={submitPost} className="rounded-2xl border border-border/20 bg-card/50 p-4">
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Del noe med teamet…"
            rows={3}
            className="w-full resize-none bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/50"
          />
          <div className="flex justify-end mt-2">
            <button type="submit" disabled={!newPost.trim() || sending} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50 hover:opacity-90 transition-all">
              Publiser
            </button>
          </div>
        </form>

        {/* Posts */}
        {posts.map(post => (
          <article key={post.id} className={`rounded-2xl border ${post.pinned ? "border-primary/30 bg-primary/5" : "border-border/15 bg-card/30"} p-5`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium shrink-0">
                {avatar((post.profiles as any)?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{(post.profiles as any)?.name || "Ukjent"}</span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</span>
                  {post.pinned && <Pin size={10} className="text-primary" />}
                </div>
                <div className="mt-2 text-sm text-foreground/80 prose prose-sm max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <PostReactions postId={post.id} profileId={profile.id} />
                  <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle size={12} /> Kommentarer
                  </button>
                  {(post.author_id === profile.id || profile.role === "admin") && (
                    <>
                      <button onClick={() => togglePin(post)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        {post.pinned ? "Løsne" : "Fest"}
                      </button>
                      <button onClick={() => deletePost(post.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                        Slett
                      </button>
                    </>
                  )}
                </div>
                {expandedPost === post.id && <PostComments postId={post.id} profileId={profile.id} />}
              </div>
            </div>
          </article>
        ))}
        {posts.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Ingen innlegg ennå. Vær den første!</p>}
      </div>
    </div>
  );
};

// ─── Post Reactions ───
const PostReactions = ({ postId, profileId }: { postId: string; profileId: string }) => {
  const [reactions, setReactions] = useState<{ emoji: string; count: number; mine: boolean }[]>([]);
  const emojis = ["👍", "❤️", "🎉", "🔥"];

  const fetch = async () => {
    const { data } = await supabase.from("workspace_post_reactions").select("emoji, profile_id").eq("post_id", postId);
    const map: Record<string, { count: number; mine: boolean }> = {};
    (data || []).forEach((r: any) => {
      if (!map[r.emoji]) map[r.emoji] = { count: 0, mine: false };
      map[r.emoji].count++;
      if (r.profile_id === profileId) map[r.emoji].mine = true;
    });
    setReactions(emojis.map(e => ({ emoji: e, count: map[e]?.count || 0, mine: map[e]?.mine || false })));
  };

  useEffect(() => { fetch(); }, [postId]);

  const toggle = async (emoji: string, mine: boolean) => {
    if (mine) {
      await supabase.from("workspace_post_reactions").delete().match({ post_id: postId, profile_id: profileId, emoji });
    } else {
      await supabase.from("workspace_post_reactions").insert([{ post_id: postId, profile_id: profileId, emoji }]);
    }
    fetch();
  };

  return (
    <div className="flex items-center gap-1">
      {reactions.map(r => (
        <button key={r.emoji} onClick={() => toggle(r.emoji, r.mine)}
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs transition-all ${r.mine ? "bg-primary/15 text-primary" : "hover:bg-muted/50 text-muted-foreground"}`}>
          {r.emoji}{r.count > 0 && <span className="text-[10px]">{r.count}</span>}
        </button>
      ))}
    </div>
  );
};

// ─── Post Comments ───
const PostComments = ({ postId, profileId }: { postId: string; profileId: string }) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [text, setText] = useState("");

  const fetch = async () => {
    const { data } = await supabase.from("workspace_post_comments").select("*, profiles(id, name, role)").eq("post_id", postId).order("created_at");
    setComments((data as any[]) || []);
  };

  useEffect(() => { fetch(); }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await supabase.from("workspace_post_comments").insert([{ post_id: postId, author_id: profileId, content: text.trim() }]);
    setText("");
    fetch();
  };

  return (
    <div className="mt-3 pt-3 border-t border-border/10 space-y-2">
      {comments.map(c => (
        <div key={c.id} className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-[9px] font-medium shrink-0">{avatar((c.profiles as any)?.name)}</div>
          <div>
            <span className="text-[11px] font-medium">{(c.profiles as any)?.name}</span>
            <span className="text-[10px] text-muted-foreground ml-1.5">{timeAgo(c.created_at)}</span>
            <p className="text-xs text-foreground/80">{c.content}</p>
          </div>
        </div>
      ))}
      <form onSubmit={submit} className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Skriv en kommentar…" className="flex-1 h-8 rounded-lg border border-border/20 bg-muted/20 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30" />
        <button type="submit" disabled={!text.trim()} className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-xs font-medium disabled:opacity-50">Send</button>
      </form>
    </div>
  );
};

// ─── Channels View (existing chat) ───
const ChannelsView = ({ profile }: { profile: Profile }) => {
  const [categories, setCategories] = useState<Channel[]>([]);
  const [active, setActive] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
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
    const { data } = await supabase.from("chat_messages").select("*, profiles(id, name, role)").eq("category_id", id).order("created_at");
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

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !active) return;
    setSending(true);
    await supabase.from("chat_messages").insert([{ category_id: active.id, sender_id: profile.id, content: newMsg.trim() }]);
    setNewMsg("");
    setSending(false);
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
      <div className="w-48 shrink-0 border-r border-border/10 flex flex-col">
        <div className="p-3 border-b border-border/10 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">Kanaler</span>
          {isAdmin && <button onClick={() => setShowNew(!showNew)} className="text-muted-foreground hover:text-primary"><Plus size={13} /></button>}
        </div>
        {showNew && isAdmin && (
          <form onSubmit={addCat} className="p-2 border-b border-border/10 space-y-1.5">
            <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="Kanalnavn" required className="w-full h-7 rounded-lg border border-border/20 bg-muted/20 px-2 text-xs focus:outline-none" />
            <div className="flex gap-1.5">
              <input type="color" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} className="h-7 w-7 rounded border-0 bg-transparent cursor-pointer" />
              <button type="submit" className="flex-1 h-7 bg-primary text-primary-foreground rounded-lg text-xs">Opprett</button>
            </div>
          </form>
        )}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {categories.map(cat => (
            <div key={cat.id} className="group flex items-center">
              <button onClick={() => setActive(cat)} className={`flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${active?.id === cat.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
                <Hash size={11} style={{ color: cat.color }} /><span className="truncate">{cat.name}</span>
              </button>
              {isAdmin && <button onClick={() => delCat(cat.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1"><Trash2 size={10} /></button>}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-border/10 flex items-center gap-2">
            <Hash size={14} style={{ color: active.color }} />
            <span className="font-medium text-sm">{active.name}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === profile.id;
              const showDateSep = i === 0 || formatDate(msg.created_at) !== formatDate(messages[i - 1].created_at);
              return (
                <div key={msg.id}>
                  {showDateSep && (
                    <div className="flex items-center gap-2 my-3">
                      <div className="flex-1 h-px bg-border/15" />
                      <span className="text-[9px] text-muted-foreground">{formatDate(msg.created_at)}</span>
                      <div className="flex-1 h-px bg-border/15" />
                    </div>
                  )}
                  <div className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-medium shrink-0">{avatar((msg.profiles as any)?.name)}</div>
                    <div className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : ""}`}>
                      <div className="flex items-baseline gap-1.5 mb-0.5">
                        <span className="text-[10px] font-medium">{(msg.profiles as any)?.name || "Ukjent"}</span>
                        <span className="text-[9px] text-muted-foreground">{formatTime(msg.created_at)}</span>
                      </div>
                      <div className={`px-3 py-1.5 rounded-2xl text-sm ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted/40"}`}>{msg.content}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="p-3 border-t border-border/10 flex gap-2">
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder={`Melding i #${active.name}…`} className="flex-1 h-9 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
            <button type="submit" disabled={!newMsg.trim() || sending} className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"><Send size={13} /></button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Velg en kanal</div>
      )}
    </div>
  );
};

// ─── Groups View ───
const GroupsView = ({ profile }: { profile: Profile }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [active, setActive] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#6366f1", is_private: false });
  const endRef = useRef<HTMLDivElement>(null);

  const fetchGroups = async () => {
    const { data } = await supabase.from("workspace_groups").select("*").order("created_at");
    setGroups((data as Group[]) || []);
  };

  const fetchMsgs = async (id: string) => {
    const { data } = await supabase.from("workspace_group_messages").select("*, profiles(id, name, role)").eq("group_id", id).order("created_at");
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
    await supabase.from("workspace_groups").insert([{ ...form, created_by: profile.id }]);
    setForm({ name: "", description: "", color: "#6366f1", is_private: false });
    setShowNew(false);
    fetchGroups();
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !active) return;
    await supabase.from("workspace_group_messages").insert([{ group_id: active.id, sender_id: profile.id, content: newMsg.trim() }]);
    setNewMsg("");
  };

  const joinGroup = async (groupId: string) => {
    await supabase.from("workspace_group_members").insert([{ group_id: groupId, profile_id: profile.id }]);
  };

  return (
    <div className="h-full flex">
      <div className="w-52 shrink-0 border-r border-border/10 flex flex-col">
        <div className="p-3 border-b border-border/10 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">Grupper</span>
          <button onClick={() => setShowNew(!showNew)} className="text-muted-foreground hover:text-primary"><Plus size={13} /></button>
        </div>
        {showNew && (
          <form onSubmit={createGroup} className="p-2 border-b border-border/10 space-y-1.5">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Gruppenavn" required className="w-full h-7 rounded-lg border border-border/20 bg-muted/20 px-2 text-xs focus:outline-none" />
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse" className="w-full h-7 rounded-lg border border-border/20 bg-muted/20 px-2 text-xs focus:outline-none" />
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input type="checkbox" checked={form.is_private} onChange={e => setForm({ ...form, is_private: e.target.checked })} className="rounded" />
              Privat
            </label>
            <button type="submit" className="w-full h-7 bg-primary text-primary-foreground rounded-lg text-xs">Opprett</button>
          </form>
        )}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {groups.map(g => (
            <button key={g.id} onClick={() => { setActive(g); joinGroup(g.id); }}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${active?.id === g.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
              <Users size={11} style={{ color: g.color }} />
              <span className="truncate">{g.name}</span>
              {g.is_private && <span className="text-[8px] text-muted-foreground/50 ml-auto">🔒</span>}
            </button>
          ))}
          {groups.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Ingen grupper</p>}
        </div>
      </div>

      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-border/10">
            <div className="flex items-center gap-2">
              <Users size={14} style={{ color: active.color }} />
              <span className="font-medium text-sm">{active.name}</span>
              {active.is_private && <span className="text-[9px] text-muted-foreground">Privat</span>}
            </div>
            {active.description && <p className="text-xs text-muted-foreground mt-0.5">{active.description}</p>}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender_id === profile.id ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-medium shrink-0">{avatar((msg.profiles as any)?.name)}</div>
                <div className={`max-w-[70%] flex flex-col ${msg.sender_id === profile.id ? "items-end" : ""}`}>
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="text-[10px] font-medium">{(msg.profiles as any)?.name || "Ukjent"}</span>
                    <span className="text-[9px] text-muted-foreground">{formatTime(msg.created_at)}</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-2xl text-sm ${msg.sender_id === profile.id ? "bg-primary text-primary-foreground" : "bg-muted/40"}`}>{msg.content}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="p-3 border-t border-border/10 flex gap-2">
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder={`Melding i ${active.name}…`} className="flex-1 h-9 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
            <button type="submit" disabled={!newMsg.trim()} className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"><Send size={13} /></button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Velg eller opprett en gruppe</div>
      )}
    </div>
  );
};

// ─── DMs View ───
const DmsView = ({ profile }: { profile: Profile }) => {
  const [conversations, setConversations] = useState<DmConv[]>([]);
  const [active, setActive] = useState<DmConv | null>(null);
  const [messages, setMessages] = useState<DmMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [showNew, setShowNew] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchConvs = async () => {
    const { data } = await supabase.from("dm_conversations").select("*").order("updated_at", { ascending: false });
    if (!data) return;
    // Fetch profile names for participants
    const profileIds = new Set<string>();
    data.forEach((c: any) => { profileIds.add(c.participant_1); profileIds.add(c.participant_2); });
    const { data: profiles } = await supabase.from("profiles").select("id, name, role, avatar_url").in("id", [...profileIds]);
    const pMap = new Map((profiles || []).map((p: any) => [p.id, p]));
    const convs = data.map((c: any) => ({
      ...c,
      other: pMap.get(c.participant_1 === profile.id ? c.participant_2 : c.participant_1),
    }));
    setConversations(convs);
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
  useEffect(() => {
    if (!active) return;
    fetchMsgs(active.id);
    const ch = supabase.channel(`ws-dm-${active.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "dm_messages", filter: `conversation_id=eq.${active.id}` }, () => fetchMsgs(active.id)).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active?.id]);

  const startDm = async (otherId: string) => {
    // Check if conversation exists
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

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !active) return;
    await supabase.from("dm_messages").insert([{ conversation_id: active.id, sender_id: profile.id, content: newMsg.trim() }]);
    setNewMsg("");
  };

  return (
    <div className="h-full flex">
      <div className="w-52 shrink-0 border-r border-border/10 flex flex-col">
        <div className="p-3 border-b border-border/10 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">Meldinger</span>
          <button onClick={() => setShowNew(!showNew)} className="text-muted-foreground hover:text-primary"><Plus size={13} /></button>
        </div>
        {showNew && (
          <div className="p-2 border-b border-border/10 max-h-48 overflow-y-auto space-y-0.5">
            <p className="text-[9px] text-muted-foreground mb-1">Ny samtale</p>
            {allProfiles.map(p => (
              <button key={p.id} onClick={() => startDm(p.id)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[9px] font-medium">{avatar(p.name)}</div>
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => setActive(conv)}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all ${active?.id === conv.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-medium shrink-0">{avatar(conv.other?.name)}</div>
              <span className="truncate">{conv.other?.name || "Ukjent"}</span>
            </button>
          ))}
          {conversations.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Ingen samtaler</p>}
        </div>
      </div>

      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-border/10 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-medium">{avatar(active.other?.name)}</div>
            <span className="font-medium text-sm">{active.other?.name || "Ukjent"}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {messages.map(msg => {
              const isOwn = msg.sender_id === profile.id;
              return (
                <div key={msg.id} className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                  <div className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : ""}`}>
                    <span className="text-[9px] text-muted-foreground mb-0.5">{formatTime(msg.created_at)}</span>
                    <div className={`px-3 py-1.5 rounded-2xl text-sm ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted/40"}`}>{msg.content}</div>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="p-3 border-t border-border/10 flex gap-2">
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Skriv en melding…" className="flex-1 h-9 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
            <button type="submit" disabled={!newMsg.trim()} className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"><Send size={13} /></button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Velg en samtale eller start en ny</div>
      )}
    </div>
  );
};

export default Workspace;
