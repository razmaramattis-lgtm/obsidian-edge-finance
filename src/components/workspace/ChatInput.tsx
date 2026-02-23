import { useState, useRef } from "react";
import { Send, Paperclip, Image } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import GifPicker from "./GifPicker";

interface ChatInputProps {
  placeholder: string;
  onSend: (content: string) => Promise<void>;
  onSendGif?: (url: string) => Promise<void>;
  onSendFile?: (file: File) => Promise<void>;
  disabled?: boolean;
}

const ChatInput = ({ placeholder, onSend, onSendGif, onSendFile, disabled }: ChatInputProps) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && onSendFile) onSendFile(f);
    e.target.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border/15 bg-card/30">
      <div className="flex items-center gap-1.5 sm:gap-1 bg-muted/30 rounded-2xl border border-border/20 pr-2 sm:pr-1.5 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <div className="flex items-center pl-1.5 sm:pl-1">
          <EmojiPicker onSelect={handleEmoji} />
          <GifPicker onSelect={handleGif} />
          {onSendFile && (
            <>
              <button type="button" onClick={() => fileRef.current?.click()} className="p-2.5 sm:p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Vedlegg">
                <Paperclip size={18} className="sm:w-4 sm:h-4" />
              </button>
              <button type="button" onClick={() => imageRef.current?.click()} className="p-2.5 sm:p-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all" title="Bilde">
                <Image size={18} className="sm:w-4 sm:h-4" />
              </button>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
              <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </>
          )}
        </div>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-12 sm:h-11 bg-transparent px-2 text-sm focus:outline-none placeholder:text-muted-foreground/40"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending || disabled}
          className="h-10 w-10 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 shrink-0"
        >
          <Send size={16} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
