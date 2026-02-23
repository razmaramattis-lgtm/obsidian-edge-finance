import { useState, useRef, useEffect, useCallback } from "react";

const GIPHY_API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"; // Giphy public beta key

interface GifResult {
  id: string;
  url: string;
  preview: string;
  alt: string;
}

interface GifPickerProps {
  onSelect: (url: string) => void;
}

const GifPicker = ({ onSelect }: GifPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchGifs = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const endpoint = q.trim()
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(q)}&limit=30&rating=g&lang=no`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=30&rating=g`;
      const res = await fetch(endpoint);
      const json = await res.json();
      setGifs(
        (json.data || []).map((g: any) => ({
          id: g.id,
          url: g.images?.fixed_height?.url || g.images?.original?.url,
          preview: g.images?.fixed_width_small?.url || g.images?.preview_gif?.url || g.images?.fixed_height?.url,
          alt: g.title || "GIF",
        }))
      );
    } catch {
      setGifs([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    fetchGifs("");
  }, [open, fetchGifs]);

  const handleSearch = (val: string) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchGifs(val), 350);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"
        title="GIF"
      >
        <span className="text-xs font-bold">GIF</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
        <div className="w-full sm:w-96 max-h-[75vh] sm:max-h-none bg-card border border-border/30 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          {/* Drag handle on mobile */}
          <div className="sm:hidden flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="p-3 sm:p-2.5 border-b border-border/20">
            <input
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Søk etter GIF-er…"
              autoFocus
              className="w-full h-10 sm:h-8 rounded-xl border border-border/20 bg-muted/30 px-3 text-sm sm:text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40"
            />
          </div>
          <div className="p-2 h-80 sm:h-72 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : gifs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                Ingen GIF-er funnet
              </div>
            ) : (
              <div className="columns-2 gap-1.5 space-y-1.5">
                {gifs.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => {
                      onSelect(gif.url);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="w-full rounded-xl overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all active:scale-[0.97] hover:scale-[1.02] break-inside-avoid block"
                  >
                    <img src={gif.preview} alt={gif.alt} className="w-full object-cover rounded-xl" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="px-3 py-1.5 border-t border-border/10 flex justify-end">
            <span className="text-[9px] text-muted-foreground/40">Powered by GIPHY</span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default GifPicker;
