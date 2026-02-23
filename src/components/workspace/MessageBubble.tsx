import UserAvatar from "./UserAvatar";

interface MessageBubbleProps {
  content: string;
  senderName?: string;
  senderAvatar?: string | null;
  time: string;
  isOwn: boolean;
  showAvatar?: boolean;
}

const isGif = (content: string) => /^https?:\/\/.*\.(gif|giphy)/i.test(content);

const MessageBubble = ({ content, senderName, senderAvatar, time, isOwn, showAvatar = true }: MessageBubbleProps) => {
  const gif = isGif(content);

  return (
    <div className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""} group`}>
      {showAvatar ? (
        <UserAvatar name={senderName} avatarUrl={senderAvatar} size="sm" />
      ) : (
        <div className="w-8 shrink-0" />
      )}
      <div className={`max-w-[65%] flex flex-col ${isOwn ? "items-end" : ""}`}>
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs font-semibold">{senderName || "Ukjent"}</span>
            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{time}</span>
          </div>
        )}
        {gif ? (
          <div className="rounded-2xl overflow-hidden max-w-[240px]">
            <img src={content} alt="GIF" className="w-full rounded-2xl" loading="lazy" />
          </div>
        ) : (
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-br-md"
              : "bg-muted/50 text-foreground rounded-bl-md"
          }`}>
            {content}
          </div>
        )}
        {!showAvatar && (
          <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">{time}</span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
