import { useState, useRef } from "react";
import { Send, Paperclip, Image } from "lucide-react";
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
      <div className="flex items-center gap-1.5 bg-muted/30 rounded-2xl border border-border/20 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 min-w-0 h-12 sm:h-11 bg-transparent pl-3 pr-1 text-sm focus:outline-none placeholder:text-muted-foreground/40"
        />
        <div className="flex items-center shrink-0 pr-1.5">
          <div className="hidden md:block"><GifPicker onSelect={handleGif} /></div>
          {onSendFile && (
            <div className="hidden md:flex items-center">
              <button type="button" onClick={() => fileRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Vedlegg">
                <Paperclip size={16} />
              </button>
              <button type="button" onClick={() => imageRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all" title="Bilde">
                <Image size={16} />
              </button>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
              <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          )}
          <button
            type="submit"
            disabled={!text.trim() || sending || disabled}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 shrink-0 ml-0.5"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
