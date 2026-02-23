import { useState, useRef, useEffect } from "react";
import { Image } from "lucide-react";

// Using a curated set of popular reaction GIFs (Tenor/Giphy free URLs)
const POPULAR_GIFS = [
  { url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", alt: "thumbs up" },
  { url: "https://media.giphy.com/media/3o7TKF1fSIs1R19B8k/giphy.gif", alt: "celebrating" },
  { url: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif", alt: "applause" },
  { url: "https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif", alt: "laughing" },
  { url: "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif", alt: "wow" },
  { url: "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif", alt: "thinking" },
  { url: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif", alt: "love" },
  { url: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif", alt: "fire" },
  { url: "https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif", alt: "party" },
  { url: "https://media.giphy.com/media/3oKIPf3C7HqqYBVcCk/giphy.gif", alt: "ok" },
  { url: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", alt: "wave" },
  { url: "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif", alt: "mind blown" },
];

interface GifPickerProps {
  onSelect: (url: string) => void;
}

const GifPicker = ({ onSelect }: GifPickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        <div className="absolute bottom-12 left-0 w-80 bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2.5 border-b border-border/20">
            <span className="text-xs font-medium text-muted-foreground">Populære GIF-er</span>
          </div>
          <div className="p-2 h-64 overflow-y-auto">
            <div className="grid grid-cols-3 gap-1.5">
              {POPULAR_GIFS.map((gif) => (
                <button
                  key={gif.url}
                  onClick={() => {
                    onSelect(gif.url);
                    setOpen(false);
                  }}
                  className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all hover:scale-[1.03]"
                >
                  <img src={gif.url} alt={gif.alt} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GifPicker;
