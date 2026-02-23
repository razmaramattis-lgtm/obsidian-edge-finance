import { useState } from "react";
import { Send } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import GifPicker from "./GifPicker";

interface ChatInputProps {
  placeholder: string;
  onSend: (content: string) => Promise<void>;
  onSendGif?: (url: string) => Promise<void>;
  disabled?: boolean;
}

const ChatInput = ({ placeholder, onSend, onSendGif, disabled }: ChatInputProps) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    await onSend(text.trim());
    setText("");
    setSending(false);
  };

  const handleEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
  };

  const handleGif = async (url: string) => {
    if (onSendGif) {
      await onSendGif(url);
    } else {
      await onSend(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border/15 bg-card/30">
      <div className="flex items-center gap-1 bg-muted/30 rounded-2xl border border-border/20 pr-1.5 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <div className="flex items-center pl-1">
          <EmojiPicker onSelect={handleEmoji} />
          <GifPicker onSelect={handleGif} />
        </div>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-11 bg-transparent px-2 text-sm focus:outline-none placeholder:text-muted-foreground/40"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending || disabled}
          className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <Send size={14} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
