import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface SeoCheckerProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  slug: string;
  imageUrl: string;
  tags: string[];
}

interface SeoItem {
  label: string;
  status: "ok" | "warn" | "error";
  tip: string;
}

const SeoChecker = ({ title, metaTitle, metaDescription, excerpt, content, slug, imageUrl, tags }: SeoCheckerProps) => {
  const mt = metaTitle || title;
  const md = metaDescription || excerpt;
  const plainContent = content.replace(/<[^>]*>/g, "");

  const checks: SeoItem[] = [
    { label: "Tittel", status: mt.length > 0 && mt.length <= 60 ? "ok" : mt.length > 60 ? "warn" : "error", tip: mt.length === 0 ? "Legg til en tittel" : `${mt.length}/60 tegn` },
    { label: "Meta-beskrivelse", status: md.length >= 50 && md.length <= 160 ? "ok" : md.length > 0 ? "warn" : "error", tip: md.length === 0 ? "Legg til en meta-beskrivelse" : `${md.length}/160 tegn` },
    { label: "Permalink (slug)", status: slug.length > 0 ? "ok" : "error", tip: slug.length === 0 ? "Generer en slug" : `/${slug}` },
    { label: "Fremhevet bilde", status: imageUrl ? "ok" : "warn", tip: imageUrl ? "Bilde er satt ✓" : "Legg til et fremhevet bilde" },
    { label: "Innhold", status: plainContent.length > 300 ? "ok" : plainContent.length > 0 ? "warn" : "error", tip: plainContent.length === 0 ? "Skriv innhold" : `${plainContent.split(/\s+/).length} ord` },
    { label: "Tagger", status: tags.length > 0 ? "ok" : "warn", tip: tags.length === 0 ? "Legg til tagger for søkbarhet" : `${tags.length} tagger` },
  ];

  const score = checks.filter(c => c.status === "ok").length;
  const Icon = { ok: CheckCircle, warn: AlertCircle, error: XCircle };
  const color = { ok: "text-green-500", warn: "text-yellow-500", error: "text-destructive" };

  return (
    <div className="glass rounded-2xl p-4 border border-border/20 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">SEO-sjekk</h4>
        <span className={`text-xs font-medium ${score >= 5 ? "text-green-500" : score >= 3 ? "text-yellow-500" : "text-destructive"}`}>
          {score}/{checks.length} bestått
        </span>
      </div>
      <div className="space-y-1.5">
        {checks.map(c => {
          const I = Icon[c.status];
          return (
            <div key={c.label} className="flex items-center gap-2 text-xs">
              <I size={13} className={color[c.status]} />
              <span className="font-medium">{c.label}</span>
              <span className="text-muted-foreground ml-auto">{c.tip}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeoChecker;
