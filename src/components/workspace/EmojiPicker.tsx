import { useState, useRef, useEffect, useMemo } from "react";
import { Smile, Search, X } from "lucide-react";

const EMOJI_CATEGORIES = [
  { name: "Smileys", emojis: ["😀","😂","🤣","😊","😍","🥰","😘","😜","🤪","😎","🤩","🥳","😇","🤔","🤗","🫡","😏","😬","🙄","😴","🤮","🤯","🥶","🥵","😈","👻","💀","🤡","👽","🤖","💩","🫠"] },
  { name: "Hender", emojis: ["👍","👎","👏","🙌","🤝","✌️","🤞","🤟","🤘","👊","✊","🫶","❤️‍🔥","💪","🫵","👋","🖐️","✋","🤚","👌","🤌","🫰","✍️","🙏"] },
  { name: "Hjerter", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💝","💘","❤️‍🔥","❤️‍🩹"] },
  { name: "Feiring", emojis: ["🎉","🎊","🎈","🎁","🏆","🥇","🎯","🎪","🎭","🎬","🎤","🎵","🎶","🔥","⭐","✨","💫","🌟","⚡","🚀","💎","🍾","🥂","🍻"] },
  { name: "Natur", emojis: ["🌸","🌺","🌻","🌹","🌷","🌼","🍀","🌴","🌈","☀️","🌙","⭐","🌊","🍂","❄️","🦋","🐶","🐱","🐻","🦊","🐼","🐨","🦄","🐬"] },
  { name: "Mat", emojis: ["🍕","🍔","🍟","🌮","🍣","🍩","🎂","🍰","🧁","🍪","🍫","☕","🍺","🍷","🥤","🧃","🍜","🥗","🍝","🌯"] },
];

const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap(c => c.emojis);

// Simple name mapping for search
const EMOJI_NAMES: Record<string, string[]> = {
  "😀": ["smile","glad","happy"], "😂": ["latter","cry","laughing"], "🤣": ["lol","rolling"], "😊": ["blush","smil"],
  "😍": ["heart eyes","elsker"], "🥰": ["kjærlighet","love"], "😘": ["kyss","kiss"], "😜": ["tunge","wink"],
  "😎": ["cool","solbriller"], "🤩": ["star","stjerne"], "🥳": ["party","fest"], "🤔": ["tenker","thinking"],
  "👍": ["tommel","thumbs up","bra"], "👎": ["tommel ned","thumbs down"], "👏": ["klapp","clap"], "❤️": ["hjerte","heart","love"],
  "🔥": ["brann","fire","hot"], "🎉": ["feiring","party","celebration"], "🚀": ["rakett","rocket"],
  "💪": ["sterk","strong","muscle"], "🙏": ["takk","thanks","pray"], "😈": ["devil","djevel"],
  "☕": ["kaffe","coffee"], "🍕": ["pizza"], "🍔": ["burger","hamburger"],
};

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return ALL_EMOJIS.filter(e => {
      const names = EMOJI_NAMES[e];
      if (names && names.some(n => n.includes(q))) return true;
      return e.includes(q);
    });
  }, [search]);

  const displayEmojis = filteredEmojis ?? EMOJI_CATEGORIES[activeTab].emojis;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
      >
        <Smile size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
        <div className="w-full sm:w-80 max-h-[75vh] sm:max-h-none bg-card border border-border/30 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          {/* Drag handle on mobile */}
          <div className="sm:hidden flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Search field */}
          <div className="px-3 pt-2 pb-2 border-b border-border/20">
            <div className="flex items-center gap-2 bg-muted/30 rounded-xl border border-border/20 px-3">
              <Search size={14} className="text-muted-foreground shrink-0" />
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Søk etter emojis…"
                className="w-full h-10 sm:h-8 bg-transparent text-sm sm:text-xs focus:outline-none placeholder:text-muted-foreground/40"
              />
              {search && (
                <button onClick={() => setSearch("")} className="p-1 rounded-lg hover:bg-muted/40 text-muted-foreground shrink-0"><X size={14} /></button>
              )}
            </div>
          </div>

          {/* Category tabs — hidden when searching */}
          {!search && (
            <div className="flex gap-1 px-2 py-2 border-b border-border/20 overflow-x-auto">
              {EMOJI_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs sm:text-[10px] font-medium whitespace-nowrap transition-all ${
                    activeTab === i
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {cat.emojis[0]} {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Emoji grid */}
          <div className="p-3 sm:p-2 h-64 sm:h-52 overflow-y-auto">
            {displayEmojis.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                Ingen emojis funnet
              </div>
            ) : (
              <div className="grid grid-cols-8 gap-1 sm:gap-0.5">
                {displayEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onSelect(emoji);
                      setOpen(false);
                    }}
                    className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-xl sm:text-lg rounded-lg hover:bg-muted/60 active:scale-90 hover:scale-110 transition-all"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
