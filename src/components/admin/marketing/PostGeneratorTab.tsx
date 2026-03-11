import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenTool, Plus, Trash2, Linkedin, Facebook, Instagram, Megaphone } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  platform: string;
  content: string;
  hashtags: string[] | null;
  status: string;
  scheduled_at: string | null;
  created_at: string;
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  google_ads: Megaphone,
  meta_ads: Megaphone,
};

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending_approval: "bg-amber-500/10 text-amber-600",
  approved: "bg-blue-500/10 text-blue-600",
  scheduled: "bg-violet-500/10 text-violet-600",
  published: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
};

const PostGeneratorTab = () => {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", platform: "linkedin", content: "", hashtags: "" });

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setPosts((data as Post[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Tittel og innhold er påkrevd");
      return;
    }
    const { error } = await supabase.from("marketing_posts").insert({
      title: form.title.trim(),
      platform: form.platform,
      content: form.content.trim(),
      hashtags: form.hashtags ? form.hashtags.split(",").map(h => h.trim()).filter(Boolean) : [],
      status: "draft",
      created_by: profile?.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Innlegg opprettet");
    setForm({ title: "", platform: "linkedin", content: "", hashtags: "" });
    setShowForm(false);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("marketing_posts").delete().eq("id", id);
    toast.success("Slettet");
    fetchPosts();
  };

  const handleSubmitForApproval = async (id: string) => {
    await supabase.from("marketing_posts").update({ status: "pending_approval" }).eq("id", id);
    toast.success("Sendt til godkjenning");
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Lag innlegg for sosiale medier og annonser. Bruk AI til å generere innhold basert på crawlet data.</p>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus size={14} className="mr-2" /> Nytt innlegg
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 space-y-3">
          <Input placeholder="Tittel" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
          <Select value={form.platform} onValueChange={(v) => setForm(f => ({ ...f, platform: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea placeholder="Innhold..." rows={5} value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} />
          <Input placeholder="Hashtags (kommaseparert)" value={form.hashtags} onChange={(e) => setForm(f => ({ ...f, hashtags: e.target.value }))} />
          <div className="flex gap-2">
            <Button onClick={handleCreate} size="sm">Opprett</Button>
            <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">Avbryt</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center">
          <PenTool size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen innlegg enda.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const PlatformIcon = PLATFORM_ICONS[p.platform] || Megaphone;
            return (
              <Card key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <PlatformIcon size={14} className="text-primary shrink-0" />
                      <span className="text-sm font-medium">{p.title}</span>
                      <Badge className={`text-[10px] ${STATUS_COLORS[p.status] || ""}`}>{p.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.content}</p>
                    {p.hashtags && p.hashtags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {p.hashtags.map((h) => (
                          <Badge key={h} variant="outline" className="text-[10px]">#{h}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.status === "draft" && (
                      <Button variant="outline" size="sm" onClick={() => handleSubmitForApproval(p.id)} className="text-xs">
                        Send til godkjenning
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostGeneratorTab;
