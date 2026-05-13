import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, MousePointerClick, Globe, Calendar } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Submission {
  id: string;
  source: string | null;
  referrer: string | null;
  section: string | null;
  created_at: string;
  package: string | null;
}

const normalizeSource = (s: string | null) => {
  if (!s) return "Ukjent";
  const path = s.split("?")[0];
  if (path === "/" || path === "") return "Forside (Hub)";
  if (path.includes("/priser")) return "Pris-side";
  if (path.includes("/kontakt")) return "Kontakt-side";
  if (path.includes("/regnskapsforer-i/")) return "Lokal SEO-side";
  if (path.includes("/tjenester/")) return "Tjenestesider";
  if (path.includes("/bransjer/")) return "Bransjesider";
  if (path.includes("/bibliotek")) return "Bibliotek/blogg";
  if (path.includes("/faq")) return "FAQ";
  return path;
};

const normalizeReferrer = (r: string | null) => {
  if (!r) return "Direkte/ukjent";
  try {
    const u = new URL(r);
    const h = u.hostname.replace(/^www\./, "");
    if (h.includes("google")) return "Google";
    if (h.includes("bing")) return "Bing";
    if (h.includes("facebook") || h.includes("fb.com")) return "Facebook";
    if (h.includes("linkedin")) return "LinkedIn";
    if (h.includes("instagram")) return "Instagram";
    if (h.includes("avargo")) return "Intern";
    return h;
  } catch {
    return "Direkte/ukjent";
  }
};

const ConversionInsightsPanel = () => {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("contact_submissions")
      .select("id, source, referrer, section, created_at, package")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data: rows }) => {
        setData((rows as Submission[]) || []);
        setLoading(false);
      });
  }, []);

  const last30 = data.filter((d) => new Date(d.created_at) > new Date(Date.now() - 30 * 86400000));

  const bySource = Object.entries(
    last30.reduce<Record<string, number>>((acc, d) => {
      const k = normalizeSource(d.source);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byReferrer = Object.entries(
    last30.reduce<Record<string, number>>((acc, d) => {
      const k = normalizeReferrer(d.referrer);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const bySection = Object.entries(
    last30.reduce<Record<string, number>>((acc, d) => {
      const k = d.section || "Ukjent";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  if (loading) return <div className="p-6 text-foreground/50">Laster…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl md:text-3xl mb-1">Konvertering & kilder</h2>
        <p className="text-sm text-foreground/55 font-light">Hvor kommer henvendelsene fra? Siste 30 dager.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl glass border border-border/20 p-4">
          <div className="flex items-center gap-2 mb-1.5"><TrendingUp size={13} className="text-primary" /><p className="text-[10px] uppercase tracking-wider text-foreground/55">Siste 30d</p></div>
          <p className="font-heading text-3xl">{last30.length}</p>
        </div>
        <div className="rounded-2xl glass border border-border/20 p-4">
          <div className="flex items-center gap-2 mb-1.5"><Calendar size={13} className="text-primary" /><p className="text-[10px] uppercase tracking-wider text-foreground/55">Totalt</p></div>
          <p className="font-heading text-3xl">{data.length}</p>
        </div>
        <div className="rounded-2xl glass border border-border/20 p-4">
          <div className="flex items-center gap-2 mb-1.5"><MousePointerClick size={13} className="text-primary" /><p className="text-[10px] uppercase tracking-wider text-foreground/55">Toppkilde</p></div>
          <p className="font-heading text-lg leading-tight truncate">{bySource[0]?.name || "—"}</p>
        </div>
        <div className="rounded-2xl glass border border-border/20 p-4">
          <div className="flex items-center gap-2 mb-1.5"><Globe size={13} className="text-primary" /><p className="text-[10px] uppercase tracking-wider text-foreground/55">Topp referrer</p></div>
          <p className="font-heading text-lg leading-tight truncate">{byReferrer[0]?.name || "—"}</p>
        </div>
      </div>

      <div className="rounded-2xl glass border border-border/20 p-5">
        <h3 className="font-heading text-lg mb-4">Henvendelser per side</h3>
        {bySource.length === 0 ? (
          <p className="text-sm text-foreground/50">Ingen data ennå. Kommer etter første henvendelse.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySource} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl glass border border-border/20 p-5">
          <h3 className="font-heading text-lg mb-4">Per trafikk-kilde</h3>
          {byReferrer.length === 0 ? (
            <p className="text-sm text-foreground/50">Ingen data.</p>
          ) : (
            <ul className="space-y-2">
              {byReferrer.slice(0, 8).map((r) => (
                <li key={r.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/75 truncate">{r.name}</span>
                  <span className="font-medium text-primary">{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl glass border border-border/20 p-5">
          <h3 className="font-heading text-lg mb-4">Per avdeling</h3>
          {bySection.length === 0 ? (
            <p className="text-sm text-foreground/50">Ingen data.</p>
          ) : (
            <ul className="space-y-2">
              {bySection.map((r) => (
                <li key={r.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/75 capitalize">{r.name}</span>
                  <span className="font-medium text-primary">{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversionInsightsPanel;
