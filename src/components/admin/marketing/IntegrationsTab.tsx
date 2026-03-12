import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plug, Unplug, Shield, CheckCircle2, XCircle, RefreshCw, Eye, EyeOff,
  Video, Image, FileText, BarChart3, ExternalLink, Settings2, Key, BookOpen, Link2,
} from "lucide-react";

import linkedinLogo from "@/assets/platforms/linkedin.png";
import facebookLogo from "@/assets/platforms/facebook.png";
import instagramLogo from "@/assets/platforms/instagram.png";
import googleAdsLogo from "@/assets/platforms/google-ads.png";
import metaAdsLogo from "@/assets/platforms/meta-ads.png";
import tiktokLogo from "@/assets/platforms/tiktok.png";

/* ─── platform registry ─── */
interface PlatformDef {
  id: string;
  label: string;
  logo: string;
  brandColor: string;
  description: string;
  scopes: string[];
  supportsVideo: boolean;
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[];
  links: { label: string; url: string }[];
  guide: string[];
}

const PLATFORMS: PlatformDef[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    logo: linkedinLogo,
    brandColor: "#0A66C2",
    description: "Del innlegg, artikler og video. Hent engasjement og følgerdata.",
    scopes: ["r_liteprofile", "w_member_social", "r_organization_social", "w_organization_social", "rw_organization_admin"],
    supportsVideo: true,
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "Lim inn LinkedIn Access Token", secret: true },
      { key: "org_id", label: "Organization ID", placeholder: "f.eks. 12345678" },
    ],
    links: [
      { label: "Developer Portal", url: "https://developer.linkedin.com/" },
      { label: "Opprett App", url: "https://www.linkedin.com/developers/apps/new" },
      { label: "API-dokumentasjon", url: "https://learn.microsoft.com/en-us/linkedin/" },
      { label: "Token-verktøy", url: "https://www.linkedin.com/developers/tools/oauth" },
    ],
    guide: [
      "Gå til LinkedIn Developer Portal og logg inn med din LinkedIn-konto.",
      "Klikk «Create App» og fyll inn firmanavn, logo og app-navn.",
      "Under «Products», legg til «Share on LinkedIn» og «Marketing Developer Platform».",
      "Gå til «Auth»-fanen → kopier Client ID og Client Secret.",
      "Bruk OAuth 2.0-flyten for å generere en Access Token med de nødvendige scopes.",
      "Finn Organization ID under firmasiden din → Admin → URL-en inneholder org-ID.",
    ],
  },
  {
    id: "facebook",
    label: "Facebook",
    logo: facebookLogo,
    brandColor: "#1877F2",
    description: "Publiser innlegg, stories og video til Pages. Hent innsikt og kommentarer.",
    scopes: ["pages_manage_posts", "pages_read_engagement", "pages_show_list", "publish_video"],
    supportsVideo: true,
    fields: [
      { key: "access_token", label: "Page Access Token", placeholder: "Lim inn Facebook Page Token", secret: true },
      { key: "page_id", label: "Page ID", placeholder: "f.eks. 123456789" },
    ],
    links: [
      { label: "Meta for Developers", url: "https://developers.facebook.com/" },
      { label: "Opprett App", url: "https://developers.facebook.com/apps/create/" },
      { label: "Graph API Explorer", url: "https://developers.facebook.com/tools/explorer/" },
      { label: "Tilgangstoken-feilsøking", url: "https://developers.facebook.com/tools/debug/accesstoken/" },
    ],
    guide: [
      "Gå til Meta for Developers og opprett en ny app (type: Business).",
      "Legg til produktet «Facebook Login» og konfigurer OAuth-innstillingene.",
      "Under «Permissions», aktiver pages_manage_posts, pages_read_engagement og publish_video.",
      "Bruk Graph API Explorer til å generere en Page Access Token.",
      "Velg riktig Page → klikk «Generate Access Token» → kopier tokenet.",
      "Page ID finnes under Sideinnstillinger → Om → helt nederst på siden.",
    ],
  },
  {
    id: "instagram",
    label: "Instagram",
    logo: instagramLogo,
    brandColor: "#E4405F",
    description: "Del bilder, Reels og Stories. Hent likes, kommentarer og reach.",
    scopes: ["instagram_basic", "instagram_content_publish", "instagram_manage_insights"],
    supportsVideo: true,
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "Lim inn Instagram Access Token", secret: true },
      { key: "business_id", label: "Business Account ID", placeholder: "f.eks. 17841400..." },
    ],
    links: [
      { label: "Instagram Graph API", url: "https://developers.facebook.com/docs/instagram-api/" },
      { label: "Graph API Explorer", url: "https://developers.facebook.com/tools/explorer/" },
      { label: "Koble Instagram til Facebook", url: "https://help.instagram.com/176235449218188" },
    ],
    guide: [
      "Instagram API krever en Facebook-app og en koblet Instagram Business/Creator-konto.",
      "Koble Instagram-kontoen til en Facebook-side via Instagram-innstillinger → Konto → Delte kontoer.",
      "I Meta for Developers-appen, legg til «Instagram Graph API» som produkt.",
      "Bruk Graph API Explorer: velg appen → generer token med instagram_basic og instagram_content_publish.",
      "Business Account ID: Kall GET /me/accounts → velg page → GET /{page-id}?fields=instagram_business_account.",
    ],
  },
  {
    id: "google_ads",
    label: "Google Ads",
    logo: googleAdsLogo,
    brandColor: "#4285F4",
    description: "Opprett og optimaliser kampanjer. Hent CTR, CPC og konverteringsdata.",
    scopes: ["adwords"],
    supportsVideo: true,
    fields: [
      { key: "developer_token", label: "Developer Token", placeholder: "Lim inn Developer Token", secret: true },
      { key: "client_id", label: "OAuth Client ID", placeholder: "xxxx.apps.googleusercontent.com" },
      { key: "client_secret", label: "Client Secret", placeholder: "Lim inn Client Secret", secret: true },
      { key: "refresh_token", label: "Refresh Token", placeholder: "Lim inn Refresh Token", secret: true },
      { key: "customer_id", label: "Customer ID", placeholder: "f.eks. 123-456-7890" },
    ],
    links: [
      { label: "Google Ads API", url: "https://developers.google.com/google-ads/api/docs/start" },
      { label: "Google Cloud Console", url: "https://console.cloud.google.com/" },
      { label: "OAuth Playground", url: "https://developers.google.com/oauthplayground/" },
      { label: "Google Ads Dashboard", url: "https://ads.google.com/" },
    ],
    guide: [
      "Logg inn på Google Ads → Verktøy → API Center → søk om Developer Token.",
      "Opprett et prosjekt i Google Cloud Console og aktiver Google Ads API.",
      "Under «Credentials», opprett OAuth 2.0 Client ID (Web Application).",
      "Bruk OAuth Playground til å generere Refresh Token med scope «adwords».",
      "Customer ID finner du øverst i Google Ads-dashbordet (format: 123-456-7890).",
    ],
  },
  {
    id: "meta_ads",
    label: "Meta Ads",
    logo: metaAdsLogo,
    brandColor: "#0668E1",
    description: "Administrer Facebook & Instagram-annonser. Hent ROAS, CPM og konverteringer.",
    scopes: ["ads_management", "ads_read", "business_management"],
    supportsVideo: true,
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "Lim inn Meta Ads Token", secret: true },
      { key: "ad_account_id", label: "Ad Account ID", placeholder: "f.eks. act_123456789" },
    ],
    links: [
      { label: "Meta Business Suite", url: "https://business.facebook.com/" },
      { label: "Meta Ads Manager", url: "https://adsmanager.facebook.com/" },
      { label: "Marketing API Docs", url: "https://developers.facebook.com/docs/marketing-apis/" },
      { label: "Graph API Explorer", url: "https://developers.facebook.com/tools/explorer/" },
    ],
    guide: [
      "Opprett eller bruk en eksisterende Meta for Developers-app.",
      "Legg til «Marketing API» som produkt i app-innstillingene.",
      "Bruk Graph API Explorer → generer token med ads_management og business_management.",
      "Ad Account ID: Gå til Meta Ads Manager → Innstillinger → Konto-ID (starter med act_).",
      "For produksjon: send appen til gjennomgang hos Meta for utvidet tilgang.",
    ],
  },
  {
    id: "tiktok",
    label: "TikTok",
    logo: tiktokLogo,
    brandColor: "#010101",
    description: "Publiser video, hent visninger, likes og følgerstatistikk.",
    scopes: ["video.upload", "video.list", "user.info.basic"],
    supportsVideo: true,
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "Lim inn TikTok Access Token", secret: true },
      { key: "open_id", label: "Open ID", placeholder: "Din TikTok Open ID" },
    ],
    links: [
      { label: "TikTok for Developers", url: "https://developers.tiktok.com/" },
      { label: "Opprett App", url: "https://developers.tiktok.com/apps/" },
      { label: "Content Posting API", url: "https://developers.tiktok.com/doc/content-posting-api-get-started/" },
      { label: "TikTok Business Center", url: "https://business.tiktok.com/" },
    ],
    guide: [
      "Gå til TikTok for Developers og opprett en utviklerkonto.",
      "Klikk «Manage Apps» → «Create App» → velg app-type (f.eks. Content Posting).",
      "Legg til scopes: video.upload, video.list og user.info.basic.",
      "Konfigurer redirect URL og fullfør OAuth-flyten for å få Access Token.",
      "Open ID returneres i OAuth-responsen og identifiserer din TikTok-bruker.",
      "Merk: Appen må godkjennes av TikTok før den kan brukes i produksjon.",
    ],
  },
];

interface Integration {
  id: string;
  platform: string;
  platform_label: string;
  connected: boolean;
  account_id: string | null;
  account_name: string | null;
  scopes: string[] | null;
  metadata: Record<string, string>;
  connected_at: string | null;
  disconnected_at: string | null;
}

const IntegrationsTab = () => {
  const { profile } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, Record<string, string>>>({});
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_integrations")
      .select("*")
      .order("platform");
    setIntegrations((data as Integration[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchIntegrations(); }, []);

  const getIntegration = (platformId: string) =>
    integrations.find((i) => i.platform === platformId);

  const handleConnect = async (platform: PlatformDef) => {
    const values = fieldValues[platform.id] || {};
    const missing = platform.fields.filter((f) => !values[f.key]?.trim());
    if (missing.length > 0) {
      toast.error(`Fyll ut: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    setSaving(platform.id);
    const existing = getIntegration(platform.id);
    const payload = {
      platform: platform.id,
      platform_label: platform.label,
      connected: true,
      access_token: values.access_token || values.developer_token || null,
      refresh_token: values.refresh_token || null,
      account_id: values.page_id || values.business_id || values.customer_id || values.ad_account_id || values.org_id || values.open_id || null,
      account_name: null as string | null,
      scopes: platform.scopes,
      metadata: values,
      connected_by: profile?.id || null,
      connected_at: new Date().toISOString(),
      disconnected_at: null as string | null,
    };
    let error;
    if (existing) {
      ({ error } = await supabase.from("marketing_integrations").update(payload).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("marketing_integrations").insert(payload));
    }
    if (error) toast.error("Kunne ikke koble til: " + error.message);
    else { toast.success(`${platform.label} er nå tilkoblet!`); setExpandedPlatform(null); await fetchIntegrations(); }
    setSaving(null);
  };

  const handleDisconnect = async (platform: PlatformDef) => {
    const existing = getIntegration(platform.id);
    if (!existing) return;
    setSaving(platform.id);
    const { error } = await supabase.from("marketing_integrations").update({
      connected: false, access_token: null, refresh_token: null, token_expires_at: null,
      disconnected_at: new Date().toISOString(), metadata: {},
    }).eq("id", existing.id);
    if (error) toast.error("Feil ved frakobling: " + error.message);
    else { toast.success(`${platform.label} er frakoblet.`); setFieldValues((prev) => ({ ...prev, [platform.id]: {} })); await fetchIntegrations(); }
    setSaving(null);
  };

  const toggleSecret = (key: string) =>
    setVisibleSecrets((prev) => ({ ...prev, [key]: !prev[key] }));

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="space-y-6">
      {/* summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <Plug size={18} className="mx-auto mb-1 text-primary" />
          <p className="font-heading text-2xl">{PLATFORMS.length}</p>
          <p className="text-[10px] text-muted-foreground">Tilgjengelige</p>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle2 size={18} className="mx-auto mb-1 text-green-500" />
          <p className="font-heading text-2xl">{connectedCount}</p>
          <p className="text-[10px] text-muted-foreground">Tilkoblet</p>
        </Card>
        <Card className="p-4 text-center">
          <XCircle size={18} className="mx-auto mb-1 text-muted-foreground" />
          <p className="font-heading text-2xl">{PLATFORMS.length - connectedCount}</p>
          <p className="text-[10px] text-muted-foreground">Ikke tilkoblet</p>
        </Card>
        <Card className="p-4 text-center">
          <Video size={18} className="mx-auto mb-1 text-primary" />
          <p className="font-heading text-2xl">{PLATFORMS.filter((p) => p.supportsVideo).length}</p>
          <p className="text-[10px] text-muted-foreground">Video-støtte</p>
        </Card>
      </div>

      {/* platforms */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Laster integrasjoner…</p>
      ) : (
        <div className="space-y-3">
          {PLATFORMS.map((platform) => {
            const integration = getIntegration(platform.id);
            const isConnected = integration?.connected ?? false;
            const isExpanded = expandedPlatform === platform.id;

            return (
              <Card key={platform.id} className={`overflow-hidden transition-all ${isExpanded ? "ring-1 ring-primary/20" : ""}`}>
                {/* header row */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedPlatform(isExpanded ? null : platform.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-muted/50 shrink-0">
                      <img src={platform.logo} alt={platform.label} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-base">{platform.label}</h3>
                        {isConnected ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-[10px]">
                            <CheckCircle2 size={10} className="mr-1" /> Tilkoblet
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">Ikke tilkoblet</Badge>
                        )}
                        {platform.supportsVideo && (
                          <Badge variant="secondary" className="text-[10px]"><Video size={10} className="mr-1" /> Video</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{platform.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConnected && integration?.connected_at && (
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Koblet til {new Date(integration.connected_at).toLocaleDateString("nb-NO")}
                      </span>
                    )}
                    <Settings2 size={16} className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* expanded panel */}
                {isExpanded && (
                  <div className="border-t bg-muted/10 p-4 space-y-4">
                    <Tabs defaultValue={isConnected ? "dashboard" : "credentials"}>
                      <TabsList className="mb-3">
                        {isConnected && <TabsTrigger value="dashboard">Dashboard</TabsTrigger>}
                        <TabsTrigger value="credentials"><Key size={12} className="mr-1" /> API-nøkler</TabsTrigger>
                        <TabsTrigger value="guide"><BookOpen size={12} className="mr-1" /> Veiledning</TabsTrigger>
                        <TabsTrigger value="permissions"><Shield size={12} className="mr-1" /> Tilganger</TabsTrigger>
                        {platform.supportsVideo && (
                          <TabsTrigger value="media"><Video size={12} className="mr-1" /> Media</TabsTrigger>
                        )}
                      </TabsList>

                      {isConnected && (
                        <TabsContent value="dashboard">
                          <PlatformDashboard platform={platform} integration={integration!} />
                        </TabsContent>
                      )}

                      <TabsContent value="credentials">
                        <div className="space-y-3 max-w-lg">
                          {platform.fields.map((field) => {
                            const fieldKey = `${platform.id}_${field.key}`;
                            const currentVal =
                              fieldValues[platform.id]?.[field.key] ??
                              (isConnected ? (integration?.metadata as Record<string, string>)?.[field.key] ?? "" : "");
                            return (
                              <div key={field.key}>
                                <label className="text-xs font-medium mb-1 block">{field.label}</label>
                                <div className="relative">
                                  <Input
                                    type={field.secret && !visibleSecrets[fieldKey] ? "password" : "text"}
                                    placeholder={field.placeholder}
                                    value={currentVal}
                                    onChange={(e) => setFieldValues((prev) => ({
                                      ...prev, [platform.id]: { ...(prev[platform.id] || {}), [field.key]: e.target.value },
                                    }))}
                                    className="pr-10"
                                  />
                                  {field.secret && (
                                    <button type="button" onClick={() => toggleSecret(fieldKey)}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                      {visibleSecrets[fieldKey] ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <div className="flex gap-2 pt-2">
                            {!isConnected ? (
                              <Button onClick={() => handleConnect(platform)} disabled={saving === platform.id} className="gap-2">
                                <Plug size={14} /> {saving === platform.id ? "Kobler til…" : "Koble til"}
                              </Button>
                            ) : (
                              <>
                                <Button onClick={() => handleConnect(platform)} disabled={saving === platform.id} variant="outline" className="gap-2">
                                  <RefreshCw size={14} /> Oppdater nøkler
                                </Button>
                                <Button onClick={() => handleDisconnect(platform)} disabled={saving === platform.id} variant="destructive" className="gap-2">
                                  <Unplug size={14} /> Koble fra
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="permissions">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground mb-2">Nødvendige API-tilganger for {platform.label}:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {platform.scopes.map((scope) => (
                              <Badge key={scope} variant={isConnected ? "default" : "outline"} className="text-[10px] font-mono">
                                <Shield size={8} className="mr-1" />{scope}
                              </Badge>
                            ))}
                          </div>
                          {isConnected && (
                            <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1">
                              <CheckCircle2 size={10} /> Alle tilganger er aktive
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      {platform.supportsVideo && (
                        <TabsContent value="media">
                          <MediaCapabilities platform={platform} isConnected={isConnected} />
                        </TabsContent>
                      )}
                    </Tabs>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── sub-components ─── */

const PlatformDashboard = ({ platform, integration }: { platform: PlatformDef; integration: Integration }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <MiniStat label="Status" value="Aktiv" icon={<CheckCircle2 size={14} className="text-green-500" />} />
      <MiniStat label="Konto" value={integration.account_id || "—"} icon={<ExternalLink size={14} className="text-primary" />} />
      <MiniStat label="Tilkoblet" value={integration.connected_at ? new Date(integration.connected_at).toLocaleDateString("nb-NO") : "—"} icon={<Plug size={14} className="text-primary" />} />
      <MiniStat label="Scopes" value={`${integration.scopes?.length ?? 0} aktive`} icon={<Shield size={14} className="text-primary" />} />
    </div>
    <Card className="p-4 bg-muted/30">
      <p className="text-xs text-muted-foreground">
        📡 Sanntidsdata vil vises her når API-integrasjonen er fullstendig aktivert. Data som rekkevidde, engasjement, klikkrate og konverteringer hentes automatisk.
      </p>
    </Card>
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" className="text-[10px]"><BarChart3 size={10} className="mr-1" /> Performance</Badge>
      <Badge variant="secondary" className="text-[10px]"><FileText size={10} className="mr-1" /> Innlegg</Badge>
      {platform.supportsVideo && <Badge variant="secondary" className="text-[10px]"><Video size={10} className="mr-1" /> Video</Badge>}
      <Badge variant="secondary" className="text-[10px]"><Image size={10} className="mr-1" /> Bilder</Badge>
    </div>
  </div>
);

const MiniStat = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <Card className="p-3">
    <div className="flex items-center gap-2 mb-1">{icon}<span className="text-[10px] text-muted-foreground">{label}</span></div>
    <p className="font-heading text-sm truncate">{value}</p>
  </Card>
);

const MediaCapabilities = ({ platform, isConnected }: { platform: PlatformDef; isConnected: boolean }) => (
  <div className="space-y-3">
    <p className="text-xs text-muted-foreground">Medieformater som støttes via {platform.label} API:</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {[
        { icon: <Image size={14} />, label: "Bilder", formats: "JPG, PNG, WebP" },
        { icon: <Video size={14} />, label: "Video", formats: "MP4, MOV" },
        { icon: <FileText size={14} />, label: "Tekst", formats: "Innlegg, artikler" },
      ].map((item) => (
        <Card key={item.label} className="p-3">
          <div className="flex items-center gap-2 mb-1 text-primary">{item.icon}<span className="text-xs font-medium">{item.label}</span></div>
          <p className="text-[10px] text-muted-foreground">{item.formats}</p>
        </Card>
      ))}
    </div>
    {!isConnected && (
      <p className="text-[10px] text-amber-600 flex items-center gap-1">⚠️ Koble til {platform.label} for å laste opp og dele media direkte.</p>
    )}
  </div>
);

export default IntegrationsTab;
