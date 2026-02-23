import { useState, useEffect, useRef } from "react";
import { SmilePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "🎉", "🔥", "💯", "🤔"];

interface MessageReactionsProps {
  messageId: string;
  profileId: string;
  table: "dm_message_reactions" | "group_message_reactions";
  size?: "sm" | "md";
}

const MessageReactions = ({ messageId, profileId, table, size = "sm" }: MessageReactionsProps) => {
  const [reactions, setReactions] = useState<{ emoji: string; count: number; mine: boolean }[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchReactions = async () => {
    const { data } = await supabase.from(table).select("emoji, profile_id").eq("message_id", messageId);
    const map: Record<string, { count: number; mine: boolean }> = {};
    (data || []).forEach((r: any) => {
      if (!map[r.emoji]) map[r.emoji] = { count: 0, mine: false };
      map[r.emoji].count++;
      if (r.profile_id === profileId) map[r.emoji].mine = true;
    });
    setReactions(Object.entries(map).map(([emoji, d]) => ({ emoji, ...d })).sort((a, b) => b.count - a.count));
  };

  useEffect(() => { fetchReactions(); }, [messageId]);

  const toggle = async (emoji: string) => {
    const existing = reactions.find(r => r.emoji === emoji);
    if (existing?.mine) {
      await supabase.from(table).delete().match({ message_id: messageId, profile_id: profileId, emoji });
    } else {
      await supabase.from(table).insert([{ message_id: messageId, profile_id: profileId, emoji }]);
    }
    fetchReactions();
    setShowPicker(false);
  };

  const isSm = size === "sm";

  return (
    <div ref={ref} className="flex items-center gap-0.5 flex-wrap justify-start">
      {reactions.map(r => (
        <button
          key={r.emoji}
          onClick={() => toggle(r.emoji)}
          className={`flex items-center gap-0.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95 ${
            isSm ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
          } ${r.mine ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-muted/40 text-foreground hover:bg-muted/60"}`}
        >
          <span className={isSm ? "text-xs" : "text-sm"}>{r.emoji}</span>
          <span>{r.count}</span>
        </button>
      ))}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`flex items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all ${
            isSm ? "p-1" : "p-1.5"
          }`}
        >
          <SmilePlus size={isSm ? 12 : 14} />
        </button>
        {showPicker && (
          <div className="absolute bottom-7 left-0 right-auto bg-card border border-border/30 rounded-xl shadow-2xl shadow-black/40 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex gap-0.5">
              {REACTION_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => toggle(emoji)} className="w-7 h-7 flex items-center justify-center text-sm rounded-lg hover:bg-muted/60 hover:scale-125 transition-all">{emoji}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageReactions;
