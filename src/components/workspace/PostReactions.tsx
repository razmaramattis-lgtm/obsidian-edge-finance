import { useState, useEffect, useRef } from "react";
import { SmilePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "🎉", "🔥", "💯", "🙌", "🤔", "👏"];

interface PostReactionsProps {
  postId: string;
  profileId: string;
}

const PostReactions = ({ postId, profileId }: PostReactionsProps) => {
  const [reactions, setReactions] = useState<{ emoji: string; count: number; mine: boolean; profiles: string[] }[]>([]);
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
    const { data } = await supabase.from("workspace_post_reactions").select("emoji, profile_id, profiles(name)").eq("post_id", postId);
    const map: Record<string, { count: number; mine: boolean; profiles: string[] }> = {};
    (data || []).forEach((r: any) => {
      if (!map[r.emoji]) map[r.emoji] = { count: 0, mine: false, profiles: [] };
      map[r.emoji].count++;
      map[r.emoji].profiles.push(r.profiles?.name || "Ukjent");
      if (r.profile_id === profileId) map[r.emoji].mine = true;
    });
    setReactions(
      Object.entries(map)
        .map(([emoji, data]) => ({ emoji, ...data }))
        .sort((a, b) => b.count - a.count)
    );
  };

  useEffect(() => { fetchReactions(); }, [postId]);

  const toggle = async (emoji: string) => {
    const existing = reactions.find(r => r.emoji === emoji);
    if (existing?.mine) {
      await supabase.from("workspace_post_reactions").delete().match({ post_id: postId, profile_id: profileId, emoji });
    } else {
      await supabase.from("workspace_post_reactions").insert([{ post_id: postId, profile_id: profileId, emoji }]);
    }
    fetchReactions();
    setShowPicker(false);
  };

  return (
    <div ref={ref} className="flex items-center gap-1.5 flex-wrap">
      {reactions.map(r => (
        <button
          key={r.emoji}
          onClick={() => toggle(r.emoji)}
          title={r.profiles.join(", ")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 ${
            r.mine
              ? "bg-primary/15 text-primary ring-1 ring-primary/30"
              : "bg-muted/40 text-foreground hover:bg-muted/60"
          }`}
        >
          <span className="text-sm">{r.emoji}</span>
          <span>{r.count}</span>
        </button>
      ))}

      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
        >
          <SmilePlus size={14} />
        </button>
        {showPicker && (
          <>
            {/* Mobile: fixed bottom sheet */}
            <div className="sm:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-[2px]" onClick={() => setShowPicker(false)}>
              <div className="w-full bg-card border-t border-border/30 rounded-t-2xl shadow-2xl p-3 animate-in slide-in-from-bottom-5 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-center mb-2"><div className="w-10 h-1 rounded-full bg-muted-foreground/30" /></div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {REACTION_EMOJIS.map(emoji => (
                    <button key={emoji} onClick={() => toggle(emoji)} className="w-11 h-11 flex items-center justify-center text-xl rounded-xl hover:bg-muted/60 active:scale-90 transition-all">{emoji}</button>
                  ))}
                </div>
              </div>
            </div>
            {/* Desktop: absolute popover */}
            <div className="hidden sm:block absolute bottom-8 left-0 bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/40 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex gap-1">
                {REACTION_EMOJIS.map(emoji => (
                  <button key={emoji} onClick={() => toggle(emoji)} className="w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-muted/60 hover:scale-125 transition-all">{emoji}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostReactions;
