import { useState, useRef, useCallback } from "react";
import UserAvatar from "./UserAvatar";
import MessageReactions from "./MessageReactions";
import { Paperclip, Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  content: string;
  senderName?: string;
  senderAvatar?: string | null;
  time: string;
  isOwn: boolean;
  showAvatar?: boolean;
  messageId?: string;
  profileId?: string;
  reactionTable?: "dm_message_reactions" | "group_message_reactions";
  fileUrl?: string | null;
  fileName?: string | null;
  readAt?: string | null;
  onNameClick?: () => void;
}

const isGif = (content: string) => /^https?:\/\/.*\.(gif|giphy)/i.test(content);
const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(url);

const LONG_PRESS_EMOJIS = ["👍", "❤️", "🔥", "😂", "😮", "🎉"];

const LongPressReactionOverlay = ({ onSelect, onClose }: { onSelect: (emoji: string) => void; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[3px]" onClick={onClose}>
    <div className="bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/40 px-3 py-2 flex gap-1 animate-in fade-in zoom-in-90 duration-200" onClick={e => e.stopPropagation()}>
      {LONG_PRESS_EMOJIS.map(emoji => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="w-12 h-12 flex items-center justify-center text-2xl rounded-xl hover:bg-muted/60 active:scale-75 transition-all"
        >
          {emoji}
        </button>
      ))}
    </div>
  </div>
);

const MessageBubble = ({ content, senderName, senderAvatar, time, isOwn, showAvatar = true, messageId, profileId, reactionTable, fileUrl, fileName, readAt, onNameClick }: MessageBubbleProps) => {
  const gif = isGif(content);
  const [longPressOpen, setLongPressOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>();

  const hasMedia = gif || (fileUrl && isImage(fileUrl));
  const canLongPress = hasMedia && messageId && profileId && reactionTable;

  const handleTouchStart = useCallback(() => {
    if (!canLongPress) return;
    longPressTimer.current = setTimeout(() => {
      setLongPressOpen(true);
    }, 500);
  }, [canLongPress]);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  const handleLongPressSelect = async (emoji: string) => {
    if (!messageId || !profileId || !reactionTable) return;
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.from(reactionTable).select("id").match({ message_id: messageId, profile_id: profileId, emoji });
    if (data && data.length > 0) {
      await supabase.from(reactionTable).delete().match({ message_id: messageId, profile_id: profileId, emoji });
    } else {
      await supabase.from(reactionTable).insert([{ message_id: messageId, profile_id: profileId, emoji }]);
    }
    setLongPressOpen(false);
  };

  return (
    <>
    <div className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""} group`}>
      {showAvatar ? (
        <UserAvatar name={senderName} avatarUrl={senderAvatar} size="sm" />
      ) : (
        <div className="w-8 shrink-0" />
      )}
      <div className={`max-w-[85%] sm:max-w-[65%] min-w-0 flex flex-col ${isOwn ? "items-end" : ""}`}>
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-xs font-semibold ${onNameClick ? "cursor-pointer hover:underline hover:text-primary transition-colors" : ""}`} onClick={onNameClick}>{senderName || "Ukjent"}</span>
            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{time}</span>
          </div>
        )}
        <div
          className="relative"
          onTouchStart={canLongPress ? handleTouchStart : undefined}
          onTouchEnd={canLongPress ? handleTouchEnd : undefined}
          onTouchCancel={canLongPress ? handleTouchEnd : undefined}
          onContextMenu={canLongPress ? (e) => e.preventDefault() : undefined}
        >
          {gif ? (
            <div className="rounded-2xl overflow-hidden max-w-[240px]">
              <img src={content} alt="GIF" className="w-full rounded-2xl select-none" loading="lazy" draggable={false} />
            </div>
          ) : (
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words overflow-hidden ${
              isOwn
                ? "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-br-md"
                : "bg-muted/50 text-foreground rounded-bl-md"
            }`}>
              {content}
            </div>
          )}
          {/* Reactions centered on bubble */}
          {messageId && profileId && reactionTable && (
            <div className={`absolute top-1/2 -translate-y-1/2 ${isOwn ? "-left-2 -translate-x-full" : "-right-2 translate-x-full"}`}>
              <MessageReactions messageId={messageId} profileId={profileId} table={reactionTable} />
            </div>
          )}
        </div>
        {fileUrl && (
          <div
            className="mt-1"
            onTouchStart={canLongPress ? handleTouchStart : undefined}
            onTouchEnd={canLongPress ? handleTouchEnd : undefined}
            onTouchCancel={canLongPress ? handleTouchEnd : undefined}
            onContextMenu={canLongPress ? (e) => e.preventDefault() : undefined}
          >
            {isImage(fileUrl) ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block max-w-[240px] rounded-xl overflow-hidden border border-border/20 hover:border-primary/30 transition-all">
                <img src={fileUrl} alt={fileName || "Bilde"} className="w-full rounded-xl select-none" loading="lazy" draggable={false} />
              </a>
            ) : (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-medium hover:bg-primary/20 transition-all">
                <Paperclip size={10} /> {fileName || "Vedlegg"}
              </a>
            )}
          </div>
        )}
        {isOwn && (
          <div className="flex items-center gap-1 mt-0.5 justify-end">
            {readAt ? (
              <CheckCheck size={12} className="text-blue-400" />
            ) : (
              <Check size={12} className="text-muted-foreground/50" />
            )}
            <span className="text-[9px] text-muted-foreground/60">{readAt ? "Lest" : "Sendt"}</span>
          </div>
        )}
        {!showAvatar && !isOwn && (
          <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">{time}</span>
        )}
      </div>
    </div>
    {longPressOpen && (
      <LongPressReactionOverlay
        onSelect={handleLongPressSelect}
        onClose={() => setLongPressOpen(false)}
      />
    )}
    </>
  );
};

export default MessageBubble;
