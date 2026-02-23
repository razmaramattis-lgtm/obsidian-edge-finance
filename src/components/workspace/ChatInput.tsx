import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Image, Film, Plus, X } from "lucide-react";
import GifPicker from "./GifPicker";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputProps {
  placeholder: string;
  onSend: (content: string) => Promise<void>;
  onSendGif?: (url: string) => Promise<void>;
  onSendFile?: (file: File) => Promise<void>;
  disabled?: boolean;
  onComposingChange?: (composing: boolean) => void;
}

const ChatInput = ({ placeholder, onSend, onSendGif, onSendFile, disabled, onComposingChange }: ChatInputProps) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Notify parent when composing on mobile
  useEffect(() => {
    if (!isMobile) return;
    const input = inputRef.current;
    if (!input) return;
    const onFocus = () => onComposingChange?.(true);
    const onBlur = () => {
      // Delay to allow button clicks (send, attach) to register
      setTimeout(() => {
        // If focus moved to another input inside this form, stay composing
        const active = document.activeElement;
        const isStillInForm = input.closest("form")?.contains(active);
        if (!isStillInForm) {
          onComposingChange?.(false);
        }
      }, 200);
    };
    input.addEventListener("focus", onFocus);
    input.addEventListener("blur", onBlur);
    return () => { input.removeEventListener("focus", onFocus); input.removeEventListener("blur", onBlur); };
  }, [isMobile, onComposingChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    await onSend(text.trim());
    setText("");
    setSending(false);
    // Blur input so menu reappears on mobile
    if (isMobile) {
      inputRef.current?.blur();
      onComposingChange?.(false);
    }
  };

  const handleGif = async (url: string) => {
    if (onSendGif) {
      await onSendGif(url);
    } else {
      await onSend(url);
    }
    setAttachOpen(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && onSendFile) onSendFile(f);
    e.target.value = "";
    setAttachOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border/15 bg-card/30 sticky bottom-0 z-20">
      <div className="flex items-center gap-1.5 bg-muted/30 rounded-2xl border border-border/20 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        {/* Mobile: "+" button */}
        {isMobile && (
          <div className="relative pl-1.5">
            <button
              type="button"
              onClick={() => setAttachOpen(!attachOpen)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                attachOpen
                  ? "bg-primary text-primary-foreground rotate-45"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {attachOpen ? <X size={16} /> : <Plus size={18} />}
            </button>

            {/* Mobile attachment menu */}
            {attachOpen && (
              <div className="absolute bottom-12 left-0 bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/30 p-2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 min-w-[180px]">
                <div className="space-y-0.5">
                  <GifPicker onSelect={handleGif} />
                  {onSendFile && (
                    <>
                      <button
                        type="button"
                        onClick={() => imageRef.current?.click()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted/50 transition-all active:scale-[0.98]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                          <Image size={16} />
                        </div>
                        <span className="text-xs font-medium">Bilde / Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted/50 transition-all active:scale-[0.98]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                          <Paperclip size={16} />
                        </div>
                        <span className="text-xs font-medium">Fil / Vedlegg</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 min-w-0 h-12 sm:h-11 bg-transparent pl-3 pr-1 text-sm focus:outline-none placeholder:text-muted-foreground/40"
        />

        <div className="flex items-center shrink-0 pr-1.5">
          {/* Desktop: inline buttons */}
          {!isMobile && (
            <>
              <GifPicker onSelect={handleGif} />
              {onSendFile && (
                <div className="flex items-center">
                  <button type="button" onClick={() => fileRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Vedlegg">
                    <Paperclip size={16} />
                  </button>
                  <button type="button" onClick={() => imageRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all" title="Bilde">
                    <Image size={16} />
                  </button>
                </div>
              )}
            </>
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

      {/* Hidden file inputs */}
      {onSendFile && (
        <>
          <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
          <input ref={imageRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        </>
      )}
    </form>
  );
};

export default ChatInput;
