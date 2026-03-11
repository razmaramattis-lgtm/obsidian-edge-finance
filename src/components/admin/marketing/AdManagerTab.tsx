import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Megaphone, Plus, Trash2, TrendingUp, MousePointer, DollarSign,
  AlertTriangle, Sparkles, Wand2, Image, RefreshCw, Eye,
  FileText, Phone, Mail, MapPin, Users, Globe, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import PostPreviewDialog from "./PostPreviewDialog";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number | null;
  headline: string | null;
  description: string | null;
  cta: string | null;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  start_date: string | null;
  end_date: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-green-500/10 text-green-600",
  paused: "bg-amber-500/10 text-amber-600",
  completed: "bg-blue-500/10 text-blue-600",
};

const AD_EXTENSIONS = [
  { id: "contact_form", label: "Kontaktskjema", icon: FileText, desc: "Lead-innsamling med navn, e-post, telefon" },
  { id: "call_button", label: "Ring-knapp", icon: Phone, desc: "Direkte anrop fra annonsen" },
  { id: "email_link", label: "E-post-lenke", icon: Mail, desc: "Åpne e-postklient med forhåndsfylt emne" },
  { id: "location", label: "Stedsinformasjon", icon: MapPin, desc: "Vis kontoradresse og kart" },
  { id: "audience_targeting", label: "Målgruppestyring", icon: Users, desc: "Definer demografi og interesser" },
  { id: "landing_page", label: "Landingsside", icon: Globe, desc: "Link til dedikert landingsside" },
  { id: "site_links", label: "Nettstedlenker", icon: ExternalLink, desc: "Ekstra lenker under annonsen" },
];

const AdManagerTab = () => {
  const { profile } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [useAi, setUseAi] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [includeImage, setIncludeImage] = useState(true);
  const [form, setForm] = useState({ name: "", platform: "google_ads", headline: "", description: "", cta: "", budget: "" });
  const [aiForm, setAiForm] = useState({ platform: "google_ads", topic: "", tone: "Konverteringsoptimalisert", instructions: "" });
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>(["contact_form"]);
  const [contactFormFields, setContactFormFields] = useState({ name: true, email: true, phone: true, company: true, message: false });
  const [previewPost, setPreviewPost] = useState<any>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setCampaigns((data as Campaign[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const toggleExtension = (id: string) => {
    setSelectedExtensions(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error("Navn er påkrevd"); return; }
    const { error } = await supabase.from("marketing_campaigns").insert({
      name: form.name.trim(),
      platform: form.platform,
      headline: form.headline || null,
      description: form.description || null,
      cta: form.cta || null,
      budget: form.budget ? parseFloat(form.budget) : null,
      created_by: profile?.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Kampanje opprettet");
    setForm({ name: "", platform: "google_ads", headline: "", description: "", cta: "", budget: "" });
    setShowForm(false);
    fetchCampaigns();
  };

  const handleAiGenerate = async () => {
    if (!aiForm.topic.trim()) { toast.error("Skriv inn et emne"); return; }
    setGenerating(true);
    toast.info("🚀 AI-kampanje genereres i bakgrunnen...", { duration: 3000 });

    const extensionPrompt = selectedExtensions.length > 0
      ? `\n\nInkluder disse annonse-elementene: ${selectedExtensions.map(id => AD_EXTENSIONS.find(e => e.id === id)?.label).join(", ")}.${
        selectedExtensions.includes("contact_form")
          ? ` Kontaktskjemaet skal inneholde: ${Object.entries(contactFormFields).filter(([,v]) => v).map(([k]) => k === "name" ? "Navn" : k === "email" ? "E-post" : k === "phone" ? "Telefon" : k === "company" ? "Bedrift" : "Melding").join(", ")}.`
          : ""
      }`
      : "";

    try {
      const { data, error } = await supabase.functions.invoke("marketing-generate-content", {
        body: {
          platform: aiForm.platform,
          topic: aiForm.topic,
          tone: aiForm.tone,
          include_image: includeImage,
          custom_instructions: (aiForm.instructions || "") + "\nDette er en betalt annonse-kampanje. Fokuser på konvertering, kort og slagkraftig copy." + extensionPrompt,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const postData = data?.post;
      if (postData) {
        await supabase.from("marketing_campaigns").insert({
          name: postData.title || aiForm.topic,
          platform: aiForm.platform,
          headline: postData.content?.slice(0, 90) || null,
          description: postData.content?.slice(0, 200) || null,
          cta: data?.meta?.cta || null,
          created_by: profile?.id,
        });
      }

      toast.success("✅ AI-kampanje generert!");
      if (data?.meta?.engagement_prediction) toast.info(`Forventet engasjement: ${data.meta.engagement_prediction}`);
      setAiForm({ platform: "google_ads", topic: "", tone: "Konverteringsoptimalisert", instructions: "" });
      setShowForm(false);
      fetchCampaigns();
    } catch (e: any) {
      toast.error(e.message || "Feil ved AI-generering");
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!aiForm.topic.trim()) { toast.error("Skriv inn et emne"); return; }
    setGenerating(true);
    toast.info("🚀 Genererer kampanjer for Google + Meta i bakgrunnen...", { duration: 3000 });
    let success = 0;
    for (const platform of ["google_ads", "meta_ads"]) {
      try {
        const { data, error } = await supabase.functions.invoke("marketing-generate-content", {
          body: {
            platform,
            topic: aiForm.topic,
            tone: aiForm.tone,
            include_image: includeImage,
            custom_instructions: (aiForm.instructions || "") + "\nDette er en betalt annonse. Fokuser på konvertering.",
          },
        });
        if (!error && !data?.error) {
          const postData = data?.post;
          if (postData) {
            await supabase.from("marketing_campaigns").insert({
              name: postData.title || aiForm.topic,
              platform,
              headline: postData.content?.slice(0, 90) || null,
              description: postData.content?.slice(0, 200) || null,
              cta: data?.meta?.cta || null,
              created_by: profile?.id,
            });
          }
          success++;
        }
      } catch { /* continue */ }
    }
    toast.success(`✅ ${success} av 2 annonsekampanjer generert!`);
    setGenerating(false);
    fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("marketing_campaigns").delete().eq("id", id);
    toast.success("Slettet");
    fetchCampaigns();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertTriangle size={14} />
          <span>Google Ads og Meta Ads API er ikke koblet til. Kampanjer kan opprettes og AI-genereres, men ikke publiseres automatisk enda.</span>
        </div>
      </Card>

      {/* AI Ad Engine */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-primary" />
          <h3 className="font-heading text-sm">AI Ad Engine</h3>
          <Badge className="bg-primary/10 text-primary text-[10px]">Nano Banana 2</Badge>
          {generating && <Badge className="bg-primary/10 text-primary text-[10px] animate-pulse">Genererer...</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          Generer konverteringsoptimaliserte annonser med kontaktskjemaer, call-to-action og AI-bilder.
        </p>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Opprett og administrer kampanjer for Google Ads og Meta Ads.</p>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus size={14} className="mr-2" /> Ny kampanje
        </Button>
      </div>

      {showForm && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {useAi ? <Wand2 size={16} className="text-primary" /> : <Megaphone size={16} />}
              <span className="text-sm font-medium">{useAi ? "AI-generert kampanje" : "Manuell kampanje"}</span>
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
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="meta_ads">Meta Ads</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Kampanje-emne (f.eks. 'Regnskapstjenester for startups')"
                value={aiForm.topic}
                onChange={(e) => setAiForm(f => ({ ...f, topic: e.target.value }))}
              />
              <Select value={aiForm.tone} onValueChange={(v) => setAiForm(f => ({ ...f, tone: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Konverteringsoptimalisert">Konverteringsfokus</SelectItem>
                  <SelectItem value="Merkevarebygging">Merkevarebygging</SelectItem>
                  <SelectItem value="Retargeting">Retargeting</SelectItem>
                  <SelectItem value="Lead-generering">Lead-generering</SelectItem>
                </SelectContent>
              </Select>

              {/* Ad Extensions */}
              <div>
                <label className="text-xs font-medium mb-2 block">Annonse-elementer</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AD_EXTENSIONS.map((ext) => {
                    const isSelected = selectedExtensions.includes(ext.id);
                    return (
                      <button
                        key={ext.id}
                        onClick={() => toggleExtension(ext.id)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          isSelected ? "border-primary/40 bg-primary/5" : "border-border/50 hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <ext.icon size={12} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                          <span className="text-xs font-medium">{ext.label}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{ext.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact form config */}
              {selectedExtensions.includes("contact_form") && (
                <Card className="p-3 bg-muted/30">
                  <p className="text-xs font-medium mb-2 flex items-center gap-1.5">
                    <FileText size={12} className="text-primary" /> Kontaktskjema-felter
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "name", label: "Navn" },
                      { id: "email", label: "E-post" },
                      { id: "phone", label: "Telefon" },
                      { id: "company", label: "Bedrift" },
                      { id: "message", label: "Melding" },
                    ].map(f => (
                      <label key={f.id} className="flex items-center gap-2 text-xs">
                        <Checkbox
                          checked={(contactFormFields as any)[f.id]}
                          onCheckedChange={(v) => setContactFormFields(prev => ({ ...prev, [f.id]: !!v }))}
                        />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </Card>
              )}

              <Textarea
                placeholder="Ekstra instrukser (valgfritt)..."
                rows={2}
                value={aiForm.instructions}
                onChange={(e) => setAiForm(f => ({ ...f, instructions: e.target.value }))}
              />
              <div className="flex items-center gap-2">
                <Switch checked={includeImage} onCheckedChange={setIncludeImage} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Image size={12} /> Generer annonsebilde med Nano Banana 2
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleAiGenerate} disabled={generating} className="gap-2">
                  {generating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {generating ? "Genererer..." : "Generer kampanje"}
                </Button>
                <Button onClick={handleBulkGenerate} disabled={generating} variant="outline" className="gap-2">
                  <Megaphone size={14} />
                  {generating ? "Genererer..." : "Generer for Google + Meta"}
                </Button>
                <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">Avbryt</Button>
              </div>
            </>
          ) : (
            <>
              <Input placeholder="Kampanjenavn" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              <Select value={form.platform} onValueChange={(v) => setForm(f => ({ ...f, platform: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="meta_ads">Meta Ads</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Overskrift" value={form.headline} onChange={(e) => setForm(f => ({ ...f, headline: e.target.value }))} />
              <Textarea placeholder="Beskrivelse" rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
              <Input placeholder="CTA" value={form.cta} onChange={(e) => setForm(f => ({ ...f, cta: e.target.value }))} />
              <Input placeholder="Budsjett (NOK)" type="number" value={form.budget} onChange={(e) => setForm(f => ({ ...f, budget: e.target.value }))} />
              <div className="flex gap-2">
                <Button onClick={handleCreate} size="sm">Opprett</Button>
                <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">Avbryt</Button>
              </div>
            </>
          )}
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : campaigns.length === 0 ? (
        <Card className="p-8 text-center">
          <Megaphone size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen kampanjer enda. Bruk AI for å generere annonser!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{c.name}</span>
                    <Badge variant="outline" className="text-[10px]">{c.platform === "google_ads" ? "Google Ads" : "Meta Ads"}</Badge>
                    <Badge className={`text-[10px] ${STATUS_COLORS[c.status] || ""}`}>{c.status}</Badge>
                  </div>
                  {c.headline && <p className="text-xs text-muted-foreground mb-1">{c.headline}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><TrendingUp size={10} /> {c.impressions} visninger</span>
                    <span className="flex items-center gap-1"><MousePointer size={10} /> {c.clicks} klikk</span>
                    <span className="flex items-center gap-1"><DollarSign size={10} /> {c.spend} kr brukt</span>
                    {c.budget && <span>Budsjett: {c.budget} kr</span>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {previewPost && (
        <PostPreviewDialog post={previewPost} open={!!previewPost} onOpenChange={(o) => !o && setPreviewPost(null)} />
      )}
    </div>
  );
};

export default AdManagerTab;
