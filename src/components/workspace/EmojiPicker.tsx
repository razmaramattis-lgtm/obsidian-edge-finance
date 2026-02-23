import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";

const EMOJI_CATEGORIES = [
  { name: "Smileys", emojis: ["😀","😂","🤣","😊","😍","🥰","😘","😜","🤪","😎","🤩","🥳","😇","🤔","🤗","🫡","😏","😬","🙄","😴","🤮","🤯","🥶","🥵","😈","👻","💀","🤡","👽","🤖","💩","🫠"] },
  { name: "Hender", emojis: ["👍","👎","👏","🙌","🤝","✌️","🤞","🤟","🤘","👊","✊","🫶","❤️‍🔥","💪","🫵","👋","🖐️","✋","🤚","👌","🤌","🫰","✍️","🙏"] },
  { name: "Hjerter", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💝","💘","❤️‍🔥","❤️‍🩹"] },
  { name: "Feiring", emojis: ["🎉","🎊","🎈","🎁","🏆","🥇","🎯","🎪","🎭","🎬","🎤","🎵","🎶","🔥","⭐","✨","💫","🌟","⚡","🚀","💎","🍾","🥂","🍻"] },
  { name: "Natur", emojis: ["🌸","🌺","🌻","🌹","🌷","🌼","🍀","🌴","🌈","☀️","🌙","⭐","🌊","🍂","❄️","🦋","🐶","🐱","🐻","🦊","🐼","🐨","🦄","🐬"] },
  { name: "Mat", emojis: ["🍕","🍔","🍟","🌮","🍣","🍩","🎂","🍰","🧁","🍪","🍫","☕","🍺","🍷","🥤","🧃","🍜","🥗","🍝","🌯"] },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
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
        className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
      >
        <Smile size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
        <div className="w-full sm:w-80 max-h-[70vh] sm:max-h-none bg-card border border-border/30 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          {/* Drag handle on mobile */}
          <div className="sm:hidden flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>
          {/* Category tabs */}
          <div className="flex gap-1 p-2 border-b border-border/20 overflow-x-auto">
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

          {/* Emoji grid */}
          <div className="p-3 sm:p-2 h-64 sm:h-52 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1 sm:gap-0.5">
              {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
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
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
