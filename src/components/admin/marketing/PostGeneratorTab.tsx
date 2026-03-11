import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  PenTool, Plus, Trash2, Linkedin, Facebook, Instagram, Megaphone,
  Sparkles, Wand2, Image, RefreshCw, Eye, CheckCircle2, Clock, Zap,
} from "lucide-react";
import { toast } from "sonner";
import PostPreviewDialog from "./PostPreviewDialog";

interface Post {
  id: string;
  title: string;
  platform: string;
  content: string;
  hashtags: string[] | null;
  status: string;
  scheduled_at: string | null;
  created_at: string;
  ai_generated: boolean | null;
  image_url: string | null;
  image_prompt: string | null;
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin, facebook: Facebook, instagram: Instagram,
  google_ads: Megaphone, meta_ads: Megaphone, tiktok: Megaphone,
};

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram",
  google_ads: "Google Ads", meta_ads: "Meta Ads", tiktok: "TikTok",
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
  const [useAi, setUseAi] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [includeImage, setIncludeImage] = useState(true);

  // Manual form
  const [form, setForm] = useState({ title: "", platform: "linkedin", content: "", hashtags: "" });
  // AI form
  const [aiForm, setAiForm] = useState({ platform: "linkedin", topic: "", tone: "Profesjonell og engasjerende", instructions: "" });

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

  const handleManualCreate = async () => {
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
      ai_generated: false,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Innlegg opprettet");
    setForm({ title: "", platform: "linkedin", content: "", hashtags: "" });
    setShowForm(false);
    fetchPosts();
  };

  const handleAiGenerate = async () => {
    if (!aiForm.topic.trim()) {
      toast.error("Skriv inn et emne for AI-generering");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("marketing-generate-content", {
        body: {
          platform: aiForm.platform,
          topic: aiForm.topic,
          tone: aiForm.tone,
          include_image: includeImage,
          custom_instructions: aiForm.instructions,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("AI-innlegg generert og sendt til godkjenning!");
      if (data?.meta) {
        const meta = data.meta;
        if (meta.best_posting_time) toast.info(`Anbefalt tidspunkt: ${meta.best_posting_time}`);
        if (meta.engagement_prediction) toast.info(`Forventet engasjement: ${meta.engagement_prediction}`);
      }
      setAiForm({ platform: "linkedin", topic: "", tone: "Profesjonell og engasjerende", instructions: "" });
      setShowForm(false);
      fetchPosts();
    } catch (e: any) {
      toast.error(e.message || "Feil ved AI-generering");
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkGenerate = async () => {
    const platforms = ["linkedin", "facebook", "instagram"];
    if (!aiForm.topic.trim()) {
      toast.error("Skriv inn et emne");
      return;
    }
    setGenerating(true);
    let success = 0;
    for (const platform of platforms) {
      try {
        const { data, error } = await supabase.functions.invoke("marketing-generate-content", {
          body: {
            platform,
            topic: aiForm.topic,
            tone: aiForm.tone,
            include_image: includeImage && platform !== "google_ads",
            custom_instructions: aiForm.instructions,
          },
        });
        if (!error && !data?.error) success++;
      } catch { /* continue */ }
    }
    toast.success(`${success} av ${platforms.length} innlegg generert!`);
    setGenerating(false);
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
      {/* AI Generation Card */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-primary" />
          <h3 className="font-heading text-sm">AI Content Engine</h3>
          <Badge className="bg-primary/10 text-primary text-[10px]">Nano Banana 2</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          Genererer skreddersydde innlegg basert på skannet innhold fra avargo.no, med AI-genererte bilder.
        </p>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">Lag innlegg for sosiale medier og annonser.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus size={14} className="mr-2" /> Nytt innlegg
        </Button>
      </div>

      {showForm && (
        <Card className="p-5 space-y-4">
          {/* Mode toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {useAi ? <Wand2 size={16} className="text-primary" /> : <PenTool size={16} />}
              <span className="text-sm font-medium">{useAi ? "AI-generert" : "Manuelt"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">AI</span>
              <Switch checked={useAi} onCheckedChange={setUseAi} />
            </div>
          </div>

          {useAi ? (
            <>
              <Select value={aiForm.platform} onValueChange={(v) => setAiForm(f => ({ ...f, platform: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Emne/tema (f.eks. 'Hvorfor velge fast regnskapsfører')"
                value={aiForm.topic}
                onChange={(e) => setAiForm(f => ({ ...f, topic: e.target.value }))}
              />
              <Select value={aiForm.tone} onValueChange={(v) => setAiForm(f => ({ ...f, tone: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Profesjonell og engasjerende">Profesjonell</SelectItem>
                  <SelectItem value="Edukativ og informativ">Edukativ</SelectItem>
                  <SelectItem value="Inspirerende og motiverende">Inspirerende</SelectItem>
                  <SelectItem value="Uformell og personlig">Uformell</SelectItem>
                  <SelectItem value="Autoritativ og ekspert">Autoritativ</SelectItem>
                  <SelectItem value="Humoristisk men faglig">Humoristisk</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Ekstra instrukser til AI (valgfritt)..."
                rows={2}
                value={aiForm.instructions}
                onChange={(e) => setAiForm(f => ({ ...f, instructions: e.target.value }))}
              />
              <div className="flex items-center gap-2">
                <Switch checked={includeImage} onCheckedChange={setIncludeImage} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Image size={12} /> Generer bilde med Nano Banana 2
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleAiGenerate} disabled={generating} className="gap-2">
                  {generating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {generating ? "Genererer..." : "Generer innlegg"}
                </Button>
                <Button onClick={handleBulkGenerate} disabled={generating} variant="outline" className="gap-2">
                  <Zap size={14} />
                  {generating ? "Genererer..." : "Generer for alle kanaler"}
                </Button>
                <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">Avbryt</Button>
              </div>
            </>
          ) : (
            <>
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
                <Button onClick={handleManualCreate} size="sm">Opprett</Button>
                <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">Avbryt</Button>
              </div>
            </>
          )}
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center">
          <PenTool size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen innlegg enda. Bruk AI for å generere innhold!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const PlatformIcon = PLATFORM_ICONS[p.platform] || Megaphone;
            return (
              <Card key={p.id} className="p-4">
                <div className="flex items-start gap-3">
                  {/* Image preview */}
                  {p.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <PlatformIcon size={14} className="text-primary shrink-0" />
                      <span className="text-sm font-medium">{p.title}</span>
                      <Badge className={`text-[10px] ${STATUS_COLORS[p.status] || ""}`}>{p.status}</Badge>
                      {p.ai_generated && (
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                          <Sparkles size={8} className="mr-1" /> AI
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.content}</p>
                    {p.hashtags && p.hashtags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {p.hashtags.slice(0, 5).map((h) => (
                          <Badge key={h} variant="outline" className="text-[10px]">#{h}</Badge>
                        ))}
                        {p.hashtags.length > 5 && (
                          <Badge variant="secondary" className="text-[10px]">+{p.hashtags.length - 5}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.status === "draft" && (
                      <Button variant="outline" size="sm" onClick={() => handleSubmitForApproval(p.id)} className="text-xs gap-1">
                        <CheckCircle2 size={12} /> Godkjenn
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
