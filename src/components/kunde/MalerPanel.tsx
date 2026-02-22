import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Download, FileText, FolderOpen } from "lucide-react";

const MalerPanel = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Alle");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    setResources(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDownload = async (res: any) => {
    if (!res.file_url) { toast.error("Ingen fil tilgjengelig"); return; }
    // Try public URL first (archive-files bucket is public)
    const { data } = supabase.storage.from("archive-files").getPublicUrl(res.file_url);
    if (data?.publicUrl) {
      window.open(data.publicUrl, "_blank");
    } else {
      // Fallback to signed URL
      const { data: signed } = await supabase.storage.from("archive-files").createSignedUrl(res.file_url, 3600);
      if (signed?.signedUrl) window.open(signed.signedUrl, "_blank");
      else toast.error("Kunne ikke laste ned filen");
    }
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const categories = ["Alle", ...new Set(resources.map(r => r.category || "Generelt"))];
  const filtered = resources
    .filter(r => activeCategory === "Alle" || (r.category || "Generelt") === activeCategory)
    .filter(r => !search.trim() || r.name.toLowerCase().includes(search.toLowerCase()) || (r.description || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl">Maler og avstemminger</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Last ned maler, sjekklister og avstemmingsverktøy.</p>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk i maler…"
          className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${activeCategory === cat ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} maler</p>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <FolderOpen size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen maler tilgjengelig {search.trim() ? "for dette søket" : "ennå"}.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(res => (
            <div key={res.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{res.name}</p>
                  {res.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{res.description}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    {res.category && <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground">{res.category}</span>}
                    {res.file_name && <span className="text-[10px] text-muted-foreground">{res.file_name}</span>}
                  </div>
                </div>
              </div>
              {res.file_url && (
                <button onClick={() => handleDownload(res)}
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all shrink-0" title="Last ned">
                  <Download size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MalerPanel;
