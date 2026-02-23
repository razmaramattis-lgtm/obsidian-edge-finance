import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Newspaper, Globe, MessageCircle, Image, X, Pin, Trash2,
  MoreHorizontal, Pencil, SmilePlus,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import UserAvatar from "./UserAvatar";
import EmojiPicker from "./EmojiPicker";
import GifPicker from "./GifPicker";
import PostReactions from "./PostReactions";
import type { Profile, Post, PostComment } from "./types";
import { timeAgo, isGifContent, extractGifUrl } from "./helpers";
import { createNotification } from "@/hooks/useWorkspaceNotifications";

// ─── Comment Reactions ───
const COMMENT_EMOJIS = ["👍", "❤️", "😂", "😮", "🎉", "🔥", "💯", "🤔"];

const CommentReactions = ({ commentId, profileId }: { commentId: string; profileId: string }) => {
  const [reactions, setReactions] = useState<{ emoji: string; count: number; mine: boolean }[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchReactions = async () => {
    const { data } = await supabase.from("workspace_comment_likes").select("emoji, profile_id").eq("comment_id", commentId);
    const map: Record<string, { count: number; mine: boolean }> = {};
    (data || []).forEach((r: any) => {
      if (!map[r.emoji]) map[r.emoji] = { count: 0, mine: false };
      map[r.emoji].count++;
      if (r.profile_id === profileId) map[r.emoji].mine = true;
    });
    setReactions(Object.entries(map).map(([emoji, d]) => ({ emoji, ...d })).sort((a, b) => b.count - a.count));
  };

  useEffect(() => { fetchReactions(); }, [commentId]);

  const toggle = async (emoji: string) => {
    const existing = reactions.find(r => r.emoji === emoji);
    if (existing?.mine) {
      await supabase.from("workspace_comment_likes").delete().match({ comment_id: commentId, profile_id: profileId, emoji });
    } else {
      await supabase.from("workspace_comment_likes").insert([{ comment_id: commentId, profile_id: profileId, emoji }]);
    }
    fetchReactions();
    setShowPicker(false);
  };

  return (
    <div ref={ref} className="flex items-center gap-1 flex-wrap">
      {reactions.map(r => (
        <button key={r.emoji} onClick={() => toggle(r.emoji)} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium transition-all hover:scale-105 active:scale-95 ${r.mine ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-muted/40 text-foreground hover:bg-muted/60"}`}>
          <span className="text-xs">{r.emoji}</span><span>{r.count}</span>
        </button>
      ))}
      <div className="relative">
        <button onClick={() => setShowPicker(!showPicker)} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
          <SmilePlus size={12} />
        </button>
        {showPicker && (
          <div className="absolute bottom-7 left-0 bg-card border border-border/30 rounded-xl shadow-2xl shadow-black/40 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex gap-0.5">
              {COMMENT_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => toggle(emoji)} className="w-7 h-7 flex items-center justify-center text-sm rounded-lg hover:bg-muted/60 hover:scale-125 transition-all">{emoji}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Comment Replies ───
const CommentReplies = ({ commentId, profileId, profileData }: { commentId: string; profileId: string; profileData: Profile }) => {
  const [replies, setReplies] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [showInput, setShowInput] = useState(false);

  const fetchReplies = async () => {
    const { data } = await supabase.from("workspace_comment_replies").select("*, profiles(id, name, role, avatar_url, active)").eq("comment_id", commentId).order("created_at");
    setReplies((data as any[]) || []);
  };

  useEffect(() => { fetchReplies(); }, [commentId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await supabase.from("workspace_comment_replies").insert([{ comment_id: commentId, author_id: profileId, content: text.trim() }]);
    setText("");
    fetchReplies();
  };

  const deleteReply = async (id: string) => {
    await supabase.from("workspace_comment_replies").delete().eq("id", id);
    fetchReplies();
  };

  return (
    <div className="ml-6 mt-1.5">
      {replies.length > 0 && (
        <div className="space-y-2 mb-1.5">
          {replies.map(r => {
            const rp = r.profiles as any;
            const isOwn = r.author_id === profileId;
            return (
              <div key={r.id} className="flex gap-2 group/reply">
                <UserAvatar name={rp?.name} avatarUrl={rp?.avatar_url} size="xs" isActive={rp?.active !== false} />
                <div className="flex-1">
                  <div className="bg-muted/30 rounded-2xl rounded-tl-md px-3 py-1.5 relative">
                    <span className="text-[10px] font-semibold">{rp?.name}</span>
                    {isGifContent(r.content) ? (
                      <img src={extractGifUrl(r.content)} alt="GIF" className="mt-1 max-h-32 rounded-lg" loading="lazy" />
                    ) : (
                      <p className="text-[11px] text-foreground/80 mt-0.5">{r.content}</p>
                    )}
                    {isOwn && (
                      <button onClick={() => deleteReply(r.id)} className="absolute top-1 right-1 opacity-0 group-hover/reply:opacity-100 p-0.5 rounded-lg text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={9} /></button>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground ml-2">{timeAgo(r.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!showInput ? (
        <button onClick={() => setShowInput(true)} className="text-[10px] text-muted-foreground hover:text-primary transition-colors ml-1">
          Svar{replies.length > 0 ? ` · ${replies.length} svar` : ""}
        </button>
      ) : (
        <form onSubmit={submit} className="flex items-center gap-2 mt-1">
          <UserAvatar name={profileData.name} avatarUrl={profileData.avatar_url} size="xs" />
          <div className="flex-1 flex items-center bg-muted/20 rounded-2xl border border-border/15 pr-1">
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Skriv et svar…" autoFocus className="flex-1 h-8 bg-transparent px-3 text-[11px] focus:outline-none placeholder:text-muted-foreground/40" />
            <button type="submit" disabled={!text.trim()} className="h-6 px-2.5 rounded-lg bg-primary/10 text-primary text-[9px] font-semibold disabled:opacity-30 transition-all">Send</button>
          </div>
          <button type="button" onClick={() => setShowInput(false)} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>
        </form>
      )}
    </div>
  );
};

// ─── Post Comments ───
const PostComments = ({ postId, profileId, profileData }: { postId: string; profileId: string; profileData: Profile }) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});

  const fetchComments = async () => {
    const { data } = await supabase.from("workspace_post_comments").select("*, profiles(id, name, role, avatar_url, active)").eq("post_id", postId).order("created_at");
    const cs = (data as any[]) || [];
    setComments(cs);
    const counts: Record<string, number> = {};
    for (const c of cs) {
      const { count } = await supabase.from("workspace_comment_replies").select("*", { count: "exact", head: true }).eq("comment_id", c.id);
      counts[c.id] = count || 0;
    }
    setReplyCounts(counts);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await supabase.from("workspace_post_comments").insert([{ post_id: postId, author_id: profileId, content: text.trim() }]);
    // Notify the post author about the comment
    const { data: post } = await supabase.from("workspace_posts").select("author_id").eq("id", postId).single();
    if (post && post.author_id !== profileId) {
      createNotification({
        recipientId: post.author_id,
        actorId: profileId,
        type: "feed_comment",
        referenceId: postId,
        referenceType: "post",
        title: text.trim().slice(0, 80),
        body: profileData.name + " kommenterte innlegget ditt",
        imageUrl: profileData.avatar_url || undefined,
      });
    }
    setText("");
    fetchComments();
  };

  const submitGif = async (url: string) => {
    await supabase.from("workspace_post_comments").insert([{ post_id: postId, author_id: profileId, content: `![gif](${url})` }]);
    const { data: post } = await supabase.from("workspace_posts").select("author_id").eq("id", postId).single();
    if (post && post.author_id !== profileId) {
      createNotification({
        recipientId: post.author_id,
        actorId: profileId,
        type: "feed_comment",
        referenceId: postId,
        referenceType: "post",
        body: "Reagerte med en GIF på innlegget ditt",
      });
    }
    fetchComments();
  };

  const deleteComment = async (id: string) => {
    await supabase.from("workspace_post_comments").delete().eq("id", id);
    fetchComments();
  };

  const startEdit = (c: PostComment) => {
    setEditingId(c.id);
    setEditText(c.content);
  };

  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return;
    await supabase.from("workspace_post_comments").update({ content: editText.trim(), edited_at: new Date().toISOString() }).eq("id", editingId);
    setEditingId(null);
    setEditText("");
    fetchComments();
  };

  return (
    <div className="border-t border-border/10 bg-muted/10">
      <div className="px-5 py-3 space-y-3 max-h-[400px] overflow-y-auto">
        {comments.map(c => {
          const cp = c.profiles as any;
          const isOwn = c.author_id === profileId;
          return (
            <div key={c.id}>
              <div className="flex gap-2.5 group/comment">
                <UserAvatar name={cp?.name} avatarUrl={cp?.avatar_url} size="xs" isActive={cp?.active !== false} />
                <div className="flex-1">
                  {editingId === c.id ? (
                    <div className="space-y-2">
                      <textarea value={editText} onChange={e => setEditText(e.target.value)} className="w-full resize-none bg-muted/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border/20" rows={2} autoFocus />
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium">Lagre</button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded-lg bg-muted/50 text-muted-foreground text-[10px]">Avbryt</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-muted/40 rounded-2xl rounded-tl-md px-3 py-2 relative">
                        <span className="text-[11px] font-semibold">{cp?.name || "Ukjent"}</span>
                        {isGifContent(c.content) ? (
                          <img src={extractGifUrl(c.content)} alt="GIF" className="mt-1 max-h-40 rounded-lg" loading="lazy" />
                        ) : (
                          <p className="text-xs text-foreground/80 mt-0.5">{c.content}</p>
                        )}
                        {isOwn && (
                          <div className="absolute top-1 right-1 opacity-0 group-hover/comment:opacity-100 flex gap-0.5 transition-all">
                            <button onClick={() => startEdit(c)} className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Pencil size={10} /></button>
                            <button onClick={() => deleteComment(c.id)} className="p-1 rounded-lg text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={10} /></button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</span>
                        {(c as any).edited_at && <span className="text-[9px] text-muted-foreground/60 italic">redigert</span>}
                        <CommentReactions commentId={c.id} profileId={profileId} />
                        {replyCounts[c.id] > 0 && (
                          <span className="text-[10px] text-muted-foreground font-medium">{replyCounts[c.id]} svar</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <CommentReplies commentId={c.id} profileId={profileId} profileData={profileData} />
            </div>
          );
        })}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2.5 px-5 py-3 border-t border-border/10">
        <UserAvatar name={profileData.name} avatarUrl={profileData.avatar_url} size="xs" />
        <div className="flex-1 flex items-center bg-muted/30 rounded-2xl border border-border/15 pr-1 gap-0.5">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Skriv en kommentar…" className="flex-1 h-9 bg-transparent px-3 text-xs focus:outline-none placeholder:text-muted-foreground/40" />
          <EmojiPicker onSelect={e => setText(prev => prev + e)} />
          <GifPicker onSelect={submitGif} />
          <button type="submit" disabled={!text.trim()} className="h-7 px-3 rounded-xl bg-primary/10 text-primary text-[10px] font-semibold disabled:opacity-30 transition-all">Send</button>
        </div>
      </form>
    </div>
  );
};

// ─── Feed View ───
const FeedView = ({ profile }: { profile: Profile }) => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    const { data } = await supabase.from("workspace_posts").select("*, profiles(id, name, role, avatar_url, active)").order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(50);
    const ps = (data as any[]) || [];
    setPosts(ps);
    // Fetch comment counts
    const counts: Record<string, number> = {};
    for (const p of ps) {
      const { count } = await supabase.from("workspace_post_comments").select("*", { count: "exact", head: true }).eq("post_id", p.id);
      counts[p.id] = count || 0;
    }
    setCommentCounts(counts);
  };

  useEffect(() => {
    fetchPosts();
    const ch = supabase.channel("ws-posts").on("postgres_changes", { event: "*", schema: "public", table: "workspace_posts" }, () => fetchPosts()).subscribe();
    const ch2 = supabase.channel("ws-comments-count").on("postgres_changes", { event: "*", schema: "public", table: "workspace_post_comments" }, () => fetchPosts()).subscribe();
    return () => { supabase.removeChannel(ch); supabase.removeChannel(ch2); };
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("workspace-uploads").upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("workspace-uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && !imageFile) return;
    setSending(true);
    let image_url: string | null = null;
    if (imageFile) image_url = await uploadImage(imageFile);
    const { data: inserted } = await supabase.from("workspace_posts").insert([{ author_id: profile.id, content: newPost.trim(), ...(image_url ? { image_url } : {}) }]).select("id").single();
    // Notify all other profiles about new feed post
    if (inserted) {
      const { data: allProfiles } = await supabase.from("profiles").select("id").neq("id", profile.id);
      (allProfiles || []).forEach(p => {
        createNotification({
          recipientId: p.id,
          actorId: profile.id,
          type: "feed_post",
          referenceId: inserted.id,
          referenceType: "post",
          title: newPost.trim().slice(0, 80) || "Nytt innlegg",
          body: profile.name + " publiserte et innlegg",
          imageUrl: image_url || profile.avatar_url || undefined,
        });
      });
    }
    setNewPost(""); setImageFile(null); setImagePreview(null); setSending(false);
  };

  const submitGif = async (url: string) => {
    await supabase.from("workspace_posts").insert([{ author_id: profile.id, content: "", image_url: url }]);
  };

  const togglePin = async (post: Post) => {
    await supabase.from("workspace_posts").update({ pinned: !post.pinned }).eq("id", post.id);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Slett innlegget?")) return;
    await supabase.from("workspace_posts").delete().eq("id", id);
  };

  const startEditPost = (post: Post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
    setMenuOpen(null);
  };

  const saveEditPost = async (id: string) => {
    await supabase.from("workspace_posts").update({ content: editContent.trim(), edited_at: new Date().toISOString() }).eq("id", id);
    setEditingPost(null);
    setEditContent("");
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
                <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder={`Hva tenker du på, ${profile.name.split(" ")[0]}?`} rows={3} className="w-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none placeholder:text-muted-foreground/40" />
                {imagePreview && (
                  <div className="relative mt-2 rounded-xl overflow-hidden border border-border/20 max-h-64">
                    <img src={imagePreview} alt="preview" className="w-full max-h-64 object-cover" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"><X size={14} /></button>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/10 mt-2">
                  <div className="flex gap-1">
                    <EmojiPicker onSelect={e => setNewPost(prev => prev + e)} />
                    <GifPicker onSelect={submitGif} />
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
                    <button type="button" onClick={() => imageInputRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"><Image size={18} /></button>
                  </div>
                  <button type="submit" disabled={(!newPost.trim() && !imageFile) || sending} className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold disabled:opacity-30 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Publiser</button>
                </div>
              </form>
            </div>
          </div>

          {/* Posts */}
          {posts.map(post => {
            const ap = post.profiles as any;
            const isOwn = post.author_id === profile.id;
            const canManage = isOwn || isAdmin;
            return (
              <article key={post.id} className="rounded-2xl border border-border/15 bg-card/50 hover:border-border/25 transition-all hover:shadow-md overflow-hidden">
                <div className="flex items-start gap-3 p-5 pb-0">
                  <UserAvatar name={ap?.name} avatarUrl={ap?.avatar_url} size="md" isActive={ap?.active !== false} />
                  <div className="flex-1">
                    <span className="text-sm font-semibold">{ap?.name}</span>
                    <p className="text-[11px] text-muted-foreground">
                      {timeAgo(post.created_at)}
                      {(post as any).edited_at && <span className="ml-1 italic">· redigert</span>}
                      {" · "}<Globe size={9} className="inline" /> Alle
                    </p>
                  </div>
                  {post.pinned && <Pin size={13} className="text-primary shrink-0" />}
                  {canManage && (
                    <div className="relative">
                      <button onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"><MoreHorizontal size={16} /></button>
                      {menuOpen === post.id && (
                        <div className="absolute right-0 top-9 bg-card border border-border/30 rounded-xl shadow-2xl z-50 min-w-[140px] py-1 animate-in fade-in zoom-in-95 duration-100">
                          {isOwn && <button onClick={() => startEditPost(post)} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/40 transition-all"><Pencil size={12} /> Rediger</button>}
                          {isAdmin && <button onClick={() => { togglePin(post); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/40 transition-all"><Pin size={12} /> {post.pinned ? "Løsne" : "Fest"}</button>}
                          <button onClick={() => { deletePost(post.id); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={12} /> Slett</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingPost === post.id ? (
                  <div className="px-5 pt-3 pb-3 space-y-2">
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full resize-none bg-muted/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/15" rows={4} autoFocus />
                    <div className="flex gap-2">
                      <button onClick={() => saveEditPost(post.id)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">Lagre</button>
                      <button onClick={() => setEditingPost(null)} className="px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground text-xs">Avbryt</button>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
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
          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4"><Newspaper size={28} className="text-muted-foreground/40" /></div>
              <p className="text-muted-foreground text-sm">Ingen innlegg ennå</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedView;
export { PostComments };
