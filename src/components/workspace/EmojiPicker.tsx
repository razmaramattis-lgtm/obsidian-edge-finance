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
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Category tabs */}
          <div className="flex gap-1 p-2 border-b border-border/20 overflow-x-auto">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(i)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
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
          <div className="p-2 h-52 overflow-y-auto">
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onSelect(emoji);
                    setOpen(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-muted/60 hover:scale-110 transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
