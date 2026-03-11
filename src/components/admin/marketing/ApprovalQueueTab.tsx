import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  CheckSquare, Check, X, Eye, Sparkles, Image as ImageIcon,
  Pencil, Linkedin, Facebook, Instagram, Megaphone, RefreshCw,
  ArrowUp, ArrowDown, GripVertical, Type, Hash, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import PostPreviewDialog from "./PostPreviewDialog";

interface Post {
  id: string;
  title: string;
  platform: string;
  content: string;
  hashtags: string[] | null;
  status: string;
  created_at: string;
  ai_generated: boolean | null;
  image_url: string | null;
  image_prompt: string | null;
  scheduled_at: string | null;
}

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram",
  google_ads: "Google Ads", meta_ads: "Meta Ads", tiktok: "TikTok",
};

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin, facebook: Facebook, instagram: Instagram,
  google_ads: Megaphone, meta_ads: Megaphone, tiktok: Megaphone,
};

const ApprovalQueueTab = () => {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", hashtags: "" });
  const [regeneratingImage, setRegeneratingImage] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_posts")
      .select("*")
      .eq("status", "pending_approval")
      .order("created_at", { ascending: true });
    setPosts((data as Post[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleApprove = async (id: string) => {
    await supabase.from("marketing_posts").update({
      status: "approved",
      approved_by: profile?.id,
    }).eq("id", id);
    toast.success("Godkjent!");
    fetchPosts();
  };

  const handleReject = async (id: string) => {
    await supabase.from("marketing_posts").update({
      status: "rejected",
      rejected_reason: rejectReason || null,
    }).eq("id", id);
    toast.success("Avslått");
    setRejectingId(null);
    setRejectReason("");
    fetchPosts();
  };

  const startEditing = (p: Post) => {
    setEditingId(p.id);
    setEditForm({
      title: p.title,
      content: p.content,
      hashtags: p.hashtags?.join(", ") || "",
    });
  };

  const handleSaveEdit = async (id: string) => {
    await supabase.from("marketing_posts").update({
      title: editForm.title,
      content: editForm.content,
      hashtags: editForm.hashtags ? editForm.hashtags.split(",").map(h => h.trim()).filter(Boolean) : [],
    }).eq("id", id);
    toast.success("Endringer lagret");
    setEditingId(null);
    fetchPosts();
  };

  const handleRegenerateImage = async (post: Post) => {
    if (!post.image_prompt) { toast.error("Ingen bilde-prompt tilgjengelig"); return; }
    setRegeneratingImage(post.id);
    try {
      const { data, error } = await supabase.functions.invoke("marketing-generate-content", {
        body: {
          platform: post.platform,
          topic: post.title,
          tone: "Profesjonell",
          include_image: true,
          custom_instructions: `Behold teksten som den er, men generer et nytt bilde basert på: ${post.image_prompt}`,
        },
      });
      if (error) throw error;
      if (data?.post?.image_url) {
        await supabase.from("marketing_posts").update({ image_url: data.post.image_url }).eq("id", post.id);
        toast.success("Nytt bilde generert!");
        fetchPosts();
      }
    } catch (e: any) {
      toast.error("Feil ved bildegenerering");
    } finally {
      setRegeneratingImage(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            Gjennomgå, rediger og godkjenn innlegg før publisering. Forhåndsvis hvordan de vil se ut på hver plattform.
          </p>
        </div>
        <Badge variant="outline" className="text-xs">{posts.length} venter</Badge>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckSquare size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen innlegg venter på godkjenning.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => {
            const PlatformIcon = PLATFORM_ICONS[p.platform] || Megaphone;
            const isEditing = editingId === p.id;

            return (
              <Card key={p.id} className="overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b bg-muted/20">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <PlatformIcon size={16} className="text-primary" />
                      <span className="text-sm font-heading">{p.title}</span>
                      <Badge variant="outline" className="text-[10px]">{PLATFORM_LABELS[p.platform]}</Badge>
                      {p.ai_generated && (
                        <Badge className="bg-primary/10 text-primary text-[10px] border-primary/20">
                          <Sparkles size={8} className="mr-1" /> AI
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(p.created_at), "d. MMM yyyy HH:mm", { locale: nb })}
                    </span>
                  </div>
                </div>

                {/* Content area */}
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Image section */}
                    <div className="shrink-0">
                      {p.image_url ? (
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted">
                            <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                              onClick={() => handleRegenerateImage(p)}
                              disabled={regeneratingImage === p.id}
                            >
                              {regeneratingImage === p.id ? <RefreshCw size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-xl bg-muted/30 flex items-center justify-center">
                          <ImageIcon size={20} className="text-muted-foreground/30" />
                        </div>
                      )}
                      {p.image_prompt && (
                        <p className="text-[9px] text-muted-foreground/50 mt-1 w-32 line-clamp-2">{p.image_prompt}</p>
                      )}
                    </div>

                    {/* Text section */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] text-muted-foreground mb-1 block flex items-center gap-1">
                              <Type size={10} /> Tittel
                            </label>
                            <Input
                              value={editForm.title}
                              onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground mb-1 block flex items-center gap-1">
                              <MessageSquare size={10} /> Innhold
                            </label>
                            <Textarea
                              value={editForm.content}
                              onChange={(e) => setEditForm(f => ({ ...f, content: e.target.value }))}
                              rows={6}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground mb-1 block flex items-center gap-1">
                              <Hash size={10} /> Hashtags (kommaseparert)
                            </label>
                            <Input
                              value={editForm.hashtags}
                              onChange={(e) => setEditForm(f => ({ ...f, hashtags: e.target.value }))}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSaveEdit(p.id)} className="gap-1">
                              <Check size={12} /> Lagre endringer
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Avbryt</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm whitespace-pre-line mb-3">{p.content}</p>
                          {p.hashtags && p.hashtags.length > 0 && (
                            <div className="flex gap-1 flex-wrap mb-3">
                              {p.hashtags.map((h) => (
                                <Badge key={h} variant="secondary" className="text-[10px]">#{h}</Badge>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!isEditing && (
                  <div className="p-4 pt-0">
                    {rejectingId === p.id ? (
                      <div className="space-y-2 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                        <Textarea
                          placeholder="Begrunnelse for avslag (valgfritt)"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => handleReject(p.id)}>Bekreft avslag</Button>
                          <Button size="sm" variant="ghost" onClick={() => { setRejectingId(null); setRejectReason(""); }}>Avbryt</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button size="sm" onClick={() => handleApprove(p.id)} className="gap-1.5">
                          <Check size={14} /> Godkjenn
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setPreviewPost(p)} className="gap-1.5">
                          <Eye size={14} /> Forhåndsvis
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => startEditing(p)} className="gap-1.5">
                          <Pencil size={14} /> Rediger
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRegenerateImage(p)} disabled={regeneratingImage === p.id} className="gap-1.5">
                          {regeneratingImage === p.id ? <RefreshCw size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                          Nytt bilde
                        </Button>
                        <div className="flex-1" />
                        <Button size="sm" variant="ghost" onClick={() => setRejectingId(p.id)} className="gap-1.5 text-destructive hover:text-destructive">
                          <X size={14} /> Avslå
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <PostPreviewDialog post={previewPost} open={!!previewPost} onOpenChange={(o) => !o && setPreviewPost(null)} />
    </div>
  );
};

export default ApprovalQueueTab;
