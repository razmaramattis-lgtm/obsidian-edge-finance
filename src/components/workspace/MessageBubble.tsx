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

const MessageBubble = ({ content, senderName, senderAvatar, time, isOwn, showAvatar = true, messageId, profileId, reactionTable, fileUrl, fileName, readAt, onNameClick }: MessageBubbleProps) => {
  const gif = isGif(content);

  return (
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
        <div className="relative">
          {gif ? (
            <div className="rounded-2xl overflow-hidden max-w-[240px]">
              <img src={content} alt="GIF" className="w-full rounded-2xl" loading="lazy" />
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
          <div className="mt-1">
            {isImage(fileUrl) ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block max-w-[240px] rounded-xl overflow-hidden border border-border/20 hover:border-primary/30 transition-all">
                <img src={fileUrl} alt={fileName || "Bilde"} className="w-full rounded-xl" loading="lazy" />
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
  );
};

export default MessageBubble;
