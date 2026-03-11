import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Video, Plus, Trash2, Clock, CheckCircle2, XCircle, Film,
  Sparkles, Send, Clapperboard, AlertCircle, RefreshCw, Play, Download, Image as ImageIcon, Maximize2,
  Upload, FileVideo,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

const useElapsedTimer = (active: boolean) => {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(0);
  useEffect(() => {
    if (!active) { setElapsed(0); return; }
    startRef.current = Date.now();
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [active]);
  return elapsed;
};

const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
};

interface VideoRequest {
  id: string;
  title: string;
  prompt: string;
  platform: string;
  aspect_ratio: string;
  duration: number;
  status: string;
  requested_by: string | null;
  admin_note: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Venter på behandling", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  approved: { label: "Godkjent", color: "bg-blue-500/10 text-blue-600", icon: CheckCircle2 },
  processing: { label: "Genererer...", color: "bg-blue-500/10 text-blue-600", icon: RefreshCw },
  completed: { label: "Ferdig", color: "bg-green-500/10 text-green-600", icon: Film },
  uploaded: { label: "Opplastet", color: "bg-emerald-500/10 text-emerald-600", icon: Upload },
  rejected: { label: "Avslått", color: "bg-red-500/10 text-red-600", icon: XCircle },
};

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram",
  tiktok: "TikTok", google_ads: "Google Ads", meta_ads: "Meta Ads",
};

const PROMPT_TEMPLATES = [
  {
    label: "Merkevare-intro",
    prompt: "A sleek, cinematic brand introduction video for Avargo, a premium Norwegian accounting and advisory firm. Dark teal and gold color palette. Smooth camera movement through a modern minimalist office with glass walls, warm ambient lighting, and subtle digital data visualizations floating in the air. Professional, innovative, trustworthy atmosphere. No text overlays.",
  },
  {
    label: "Tjenestepresentasjon",
    prompt: "A professional corporate video showcasing modern accounting and financial advisory services. Clean, futuristic office environment with holographic charts and graphs. A confident business professional reviewing data on a transparent display. Color scheme: deep teal, warm gold accents, white. Cinematic lighting with lens flares. No text.",
  },
  {
    label: "Kundehistorie",
    prompt: "A warm, inspiring video of a small business owner experiencing growth and success. Transition from a startup workspace to a thriving modern office. Happy team collaboration scenes. Warm golden hour lighting. Norwegian business aesthetic – clean, minimal, professional. Subtle Avargo brand colors (teal and gold). No text.",
  },
  {
    label: "SoMe-teaser",
    prompt: "A fast-paced, attention-grabbing social media teaser for a premium accounting firm. Dynamic transitions between financial dashboards, happy business owners, and modern office scenes. Bold visual style with teal gradients and gold highlights. Energetic but professional. Vertical format friendly. No text.",
  },
  {
    label: "Rekruttering",
    prompt: "An aspirational recruitment video for a cutting-edge Norwegian accounting and advisory firm. Young, diverse professionals collaborating in a beautiful modern workspace. Coffee breaks, brainstorming sessions, celebrations. Warm, inviting atmosphere with teal and natural wood tones. Shows work-life balance and innovation. No text.",
  },
  {
    label: "AI & Teknologi",
    prompt: "A futuristic technology showcase video for an innovative accounting firm. Abstract visualizations of AI processing financial data – flowing data streams, neural network patterns, and holographic interfaces. Deep teal background with glowing gold accent lines. Cinematic, awe-inspiring. No text.",
  },
];

const VideoStudioTab = () => {
  const { profile, isAdmin } = useAuth();
  const [requests, setRequests] = useState<VideoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [previewRequest, setPreviewRequest] = useState<VideoRequest | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", platform: "linkedin", admin_note: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoElapsed = useElapsedTimer(!!generatingId);
  const [form, setForm] = useState({
    title: "",
    platform: "linkedin",
    aspect_ratio: "16:9",
    duration: "5",
    prompt: "",
    admin_note: "",
  });

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_video_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setRequests((data as VideoRequest[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSelectTemplate = (template: typeof PROMPT_TEMPLATES[0]) => {
    setForm(f => ({ ...f, prompt: template.prompt, title: f.title || template.label }));
    toast.info(`Mal «${template.label}» lastet inn`);
  };

  const generateVideo = async (requestId: string, prompt: string, aspectRatio: string, duration: number) => {
    setGeneratingId(requestId);
    toast.info("🎬 Klargjør video...", { duration: 6000 });
    try {
      const { data, error } = await supabase.functions.invoke("generate-marketing-video", {
        body: { request_id: requestId, prompt, aspect_ratio: aspectRatio, duration },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.video_url) {
        toast.success("✅ Video klar!");
      } else {
        toast.warning("Videoklipp ble ikke laget automatisk. Last opp video manuelt.");
      }

      fetchRequests();
    } catch (e: any) {
      toast.error(e.message || "Feil ved videogenerering");
    } finally {
      setGeneratingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error("Tittel er påkrevd"); return; }
    if (!form.prompt.trim()) { toast.error("Velg en mal eller skriv en beskrivelse"); return; }

    // Admin → auto-approve and generate immediately
    const status = isAdmin ? "approved" : "pending";

    const { data: inserted, error } = await supabase.from("marketing_video_requests").insert({
      title: form.title.trim(),
      prompt: form.prompt.trim(),
      platform: form.platform,
      aspect_ratio: form.aspect_ratio,
      duration: parseInt(form.duration),
      status,
      requested_by: profile?.id,
      admin_note: form.admin_note || null,
    }).select().single();

    if (error) { toast.error(error.message); return; }

    const resetForm = () => {
      setForm({ title: "", platform: "linkedin", aspect_ratio: "16:9", duration: "5", prompt: "", admin_note: "" });
      setShowForm(false);
    };

    if (isAdmin && inserted) {
      toast.success("Godkjent! Videogenerering starter...");
      resetForm();
      fetchRequests();
      // Start generation in background
      generateVideo(inserted.id, inserted.prompt, inserted.aspect_ratio, inserted.duration);
    } else {
      toast.success("Videoforespørsel sendt inn!");
      resetForm();
      fetchRequests();
    }
  };

  const handleApproveAndGenerate = async (r: VideoRequest) => {
    await supabase.from("marketing_video_requests").update({ status: "approved" }).eq("id", r.id);
    fetchRequests();
    generateVideo(r.id, r.prompt, r.aspect_ratio, r.duration);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("marketing_video_requests").delete().eq("id", id);
    toast.success("Slettet");
    fetchRequests();
  };

  const handleAttachVideo = async (requestId: string, file: File) => {
    try {
      const ext = file.name.split(".").pop() || "mp4";
      const fileName = `video-${requestId}-${Date.now()}.${ext}`;
      const path = `marketing/videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("workspace-uploads")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("workspace-uploads")
        .getPublicUrl(path);

      await supabase.from("marketing_video_requests").update({
        video_url: urlData.publicUrl,
        status: "completed",
        admin_note: "Video lastet opp og klar.",
      }).eq("id", requestId);

      toast.success("Video lagt til!");
      fetchRequests();
    } catch (e: any) {
      toast.error(e.message || "Feil ved opplasting");
    }
  };

  const handleUploadVideo = async (file: File) => {
    if (!uploadForm.title.trim()) { toast.error("Tittel er påkrevd"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "mp4";
      const fileName = `uploaded-${Date.now()}.${ext}`;
      const path = `marketing/videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("workspace-uploads")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("workspace-uploads")
        .getPublicUrl(path);

      const { error: insertError } = await supabase.from("marketing_video_requests").insert({
        title: uploadForm.title.trim(),
        prompt: `Opplastet video: ${file.name}`,
        platform: uploadForm.platform,
        aspect_ratio: "16:9",
        duration: 0,
        status: "uploaded",
        requested_by: profile?.id,
        admin_note: uploadForm.admin_note || null,
        video_url: urlData.publicUrl,
      });
      if (insertError) throw insertError;

      toast.success("Video lastet opp!");
      setShowUpload(false);
      setUploadForm({ title: "", platform: "linkedin", admin_note: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchRequests();
    } catch (e: any) {
      toast.error(e.message || "Feil ved opplasting");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info card */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Clapperboard size={16} className="text-primary" />
          <h3 className="font-heading text-sm">AI Video Studio</h3>
          <Badge className="bg-primary/10 text-primary text-[10px]">Profesjonell</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Send inn forespørsler om AI-genererte markedsføringsvideoer for Avargo. Velg fra ferdige profesjonelle maler
          eller skriv din egen beskrivelse. Alle forespørsler behandles og genereres av systemet.
        </p>
      </Card>

      {!isAdmin && (
        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle size={14} />
            <span>Videoforespørsler må godkjennes av en administrator før generering.</span>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">Send inn videoforespørsler eller last opp egne videoer.</p>
        <div className="flex gap-2">
          <Button onClick={() => { setShowUpload(!showUpload); setShowForm(false); }} size="sm" variant="outline" className="gap-1.5">
            <Upload size={14} /> Last opp video
          </Button>
          <Button onClick={() => { setShowForm(!showForm); setShowUpload(false); }} size="sm">
            <Plus size={14} className="mr-2" /> Ny videoforespørsel
          </Button>
        </div>
      </div>

      {/* Upload form */}
      {showUpload && (
        <Card className="p-5 space-y-4 border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <FileVideo size={16} className="text-primary" />
            <span className="text-sm font-medium">Last opp egen video</span>
          </div>

          <Input
            placeholder="Video-tittel"
            value={uploadForm.title}
            onChange={(e) => setUploadForm(f => ({ ...f, title: e.target.value }))}
          />

          <Select value={uploadForm.platform} onValueChange={(v) => setUploadForm(f => ({ ...f, platform: v }))}>
            <SelectTrigger className="text-xs"><SelectValue placeholder="Plattform" /></SelectTrigger>
            <SelectContent>
              {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Intern merknad (valgfritt)"
            value={uploadForm.admin_note}
            onChange={(e) => setUploadForm(f => ({ ...f, admin_note: e.target.value }))}
          />

          <div className="border-2 border-dashed border-border/60 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadVideo(file);
              }}
            />
            <FileVideo size={28} className="mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground mb-2">Dra og slipp, eller klikk for å velge videofil</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !uploadForm.title.trim()}
              className="gap-1.5"
            >
              {uploading ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
              {uploading ? "Laster opp..." : "Velg videofil"}
            </Button>
            <p className="text-[10px] text-muted-foreground mt-2">MP4, MOV, WebM – maks 50 MB</p>
          </div>

          <Button onClick={() => setShowUpload(false)} variant="ghost" size="sm">Avbryt</Button>
        </Card>
      )}

      {showForm && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Video size={16} className="text-primary" />
            <span className="text-sm font-medium">Ny videoforespørsel</span>
          </div>

          <Input
            placeholder="Video-tittel (f.eks. 'Avargo merkevare-intro 2026')"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
          />

          {/* Template picker */}
          <div>
            <p className="text-xs font-medium mb-2">Velg en profesjonell mal:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROMPT_TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => handleSelectTemplate(t)}
                  className="text-left p-3 rounded-lg border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={10} className="text-primary" />
                    <span className="text-xs font-medium">{t.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{t.prompt.slice(0, 80)}...</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select value={form.platform} onValueChange={(v) => setForm(f => ({ ...f, platform: v }))}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Plattform" /></SelectTrigger>
              <SelectContent>
                {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={form.aspect_ratio} onValueChange={(v) => setForm(f => ({ ...f, aspect_ratio: v }))}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Format" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                <SelectItem value="9:16">9:16 (Vertikal/Story)</SelectItem>
                <SelectItem value="1:1">1:1 (Kvadrat)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={form.duration} onValueChange={(v) => setForm(f => ({ ...f, duration: v }))}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Varighet" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 sekunder</SelectItem>
                <SelectItem value="10">10 sekunder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Beskrivelse av videoen (prompt)... Velg en mal ovenfor eller skriv din egen."
            rows={4}
            value={form.prompt}
            onChange={(e) => setForm(f => ({ ...f, prompt: e.target.value }))}
          />

          <Textarea
            placeholder="Intern merknad (valgfritt, f.eks. bruksområde eller kampanje-kobling)..."
            rows={2}
            value={form.admin_note}
            onChange={(e) => setForm(f => ({ ...f, admin_note: e.target.value }))}
          />

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="gap-2">
              <Send size={14} /> {isAdmin ? "Generer video" : "Send inn forespørsel"}
            </Button>
            <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">Avbryt</Button>
          </div>
        </Card>
      )}

      {/* Requests list */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : requests.length === 0 ? (
        <Card className="p-8 text-center">
          <Video size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen videoforespørsler enda.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const statusInfo = STATUS_MAP[r.status] || STATUS_MAP.pending;
            const StatusIcon = statusInfo.icon;
            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-start gap-3">
                  {/* Clickable thumbnail/video preview */}
                  {r.video_url || r.thumbnail_url ? (
                    <button
                      onClick={() => setPreviewRequest(r)}
                      className="w-24 h-14 rounded-lg overflow-hidden shrink-0 bg-muted relative group cursor-pointer"
                    >
                      {r.video_url ? (
                        <video src={r.video_url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={r.thumbnail_url!} alt={r.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={20} className="text-white" />
                      </div>
                    </button>
                  ) : (
                    <div className="w-24 h-14 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <Film size={20} className="text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium">{r.title}</span>
                      <Badge className={`text-[10px] ${statusInfo.color}`}>
                        <StatusIcon size={10} className="mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{PLATFORM_LABELS[r.platform]}</Badge>
                      <Badge variant="outline" className="text-[10px]">{r.aspect_ratio} · {r.duration}s</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{r.prompt}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(r.created_at), "d. MMM yyyy HH:mm", { locale: nb })}
                    </p>
                    {r.admin_note && (
                      <p className="text-[10px] text-muted-foreground mt-1 italic">Merknad: {r.admin_note}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {r.status === "pending" && isAdmin && (
                      <Button variant="default" size="sm" className="text-xs gap-1" onClick={() => handleApproveAndGenerate(r)} disabled={generatingId === r.id}>
                        {generatingId === r.id ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        Generer
                      </Button>
                    )}
                    {/* Upload video to existing request */}
                    {!r.video_url && (r.status === "completed" || r.status === "approved") && isAdmin && (
                      <>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          id={`attach-video-${r.id}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAttachVideo(r.id, file);
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => document.getElementById(`attach-video-${r.id}`)?.click()}
                        >
                          <Upload size={12} /> Last opp video
                        </Button>
                      </>
                    )}
                    {generatingId === r.id && (
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-primary/10 text-primary text-[10px] animate-pulse flex items-center gap-1">
                          <Clock size={10} /> {formatTimer(videoElapsed)}
                        </Badge>
                        <div className="w-24">
                          <Progress value={Math.min(95, (videoElapsed / 120) * 100)} className="h-1" />
                        </div>
                        <span className="text-[9px] text-muted-foreground">~{Math.max(1, Math.ceil((120 - videoElapsed) / 60))} min igjen</span>
                      </div>
                    )}
                    {(r.video_url || r.thumbnail_url) && (r.status === "completed" || r.status === "uploaded") && (
                      <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => setPreviewRequest(r)}>
                        <Play size={12} /> Åpne
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Video/Media Preview Dialog */}
      <Dialog open={!!previewRequest} onOpenChange={(o) => !o && setPreviewRequest(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{previewRequest?.title || "Forhåndsvisning av video"}</DialogTitle>
          <DialogDescription className="sr-only">
            Forhåndsvisning av generert medieinnhold i Video Studio.
          </DialogDescription>
          {previewRequest && (
            <div className="flex flex-col">
              {/* Media player area */}
              <div className="bg-black flex items-center justify-center min-h-[300px] max-h-[70vh]">
                {previewRequest.video_url ? (
                  <video
                    src={previewRequest.video_url}
                    controls
                    autoPlay
                    className="w-full h-full max-h-[70vh] object-contain"
                  />
                ) : previewRequest.thumbnail_url ? (
                  <img
                    src={previewRequest.thumbnail_url}
                    alt={previewRequest.title}
                    className="w-full h-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center gap-2 p-12">
                    <Film size={48} className="opacity-30" />
                    <p className="text-sm">Ingen media tilgjengelig</p>
                  </div>
                )}
              </div>

              {/* Info bar */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-sm">{previewRequest.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">{PLATFORM_LABELS[previewRequest.platform]}</Badge>
                      <Badge variant="outline" className="text-[10px]">{previewRequest.aspect_ratio} · {previewRequest.duration}s</Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(previewRequest.created_at), "d. MMM yyyy HH:mm", { locale: nb })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {previewRequest.video_url && (
                      <Button size="sm" variant="outline" className="gap-1.5" asChild>
                        <a href={previewRequest.video_url} download target="_blank" rel="noopener noreferrer">
                          <Download size={12} /> Last ned video
                        </a>
                      </Button>
                    )}
                    {previewRequest.thumbnail_url && !previewRequest.video_url && (
                      <Button size="sm" variant="outline" className="gap-1.5" asChild>
                        <a href={previewRequest.thumbnail_url} download target="_blank" rel="noopener noreferrer">
                          <Download size={12} /> Last ned bilde
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">{previewRequest.prompt}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoStudioTab;
