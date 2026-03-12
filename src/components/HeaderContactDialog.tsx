import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

interface HeaderContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HeaderContactDialog = ({ open, onOpenChange }: HeaderContactDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const reset = () => {
    setName(""); setEmail(""); setPhone(""); setMessage("");
    setSending(false); setSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Fyll ut navn og e-post");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Ugyldig e-postadresse");
      return;
    }
    setSending(true);

    const { error } = await supabase.functions.invoke("contact-submit", {
      body: {
        contact_person: name.trim().slice(0, 100),
        email: email.trim().slice(0, 255),
        phone: phone.trim().slice(0, 20) || null,
        message: message.trim().slice(0, 1000) || null,
        section: "header",
      },
    });

    if (error) {
      toast.error("Kunne ikke sende. Prøv igjen.");
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) setTimeout(reset, 300);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md glass border-border/30 rounded-3xl p-0 overflow-hidden">
        {sent ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Takk for henvendelsen!</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Vi tar kontakt innen 24 timer.
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={() => handleOpenChange(false)}
              className="px-6 py-2.5 text-sm bg-primary text-primary-foreground rounded-full hover:scale-[1.02] transition-all"
            >
              Lukk
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 pb-0">
              <DialogHeader>
                <DialogTitle className="font-heading text-lg">Kontakt oss</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Fyll ut skjemaet, så tar vi kontakt innen 24 timer.
                </DialogDescription>
              </DialogHeader>
            </div>
            <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-3">
              <Input
                placeholder="Navn *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="bg-muted/30 border-border/50 h-11 rounded-xl"
                required
              />
              <Input
                type="email"
                placeholder="E-post *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="bg-muted/30 border-border/50 h-11 rounded-xl"
                required
              />
              <Input
                type="tel"
                placeholder="Telefon (valgfritt)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
                className="bg-muted/30 border-border/50 h-11 rounded-xl"
              />
              <Textarea
                placeholder="Hva kan vi hjelpe med?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                className="bg-muted/30 border-border/50 min-h-[80px] resize-none rounded-xl"
              />
              <button
                type="submit"
                disabled={sending || !name.trim() || !email.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/20"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                Send henvendelse
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HeaderContactDialog;
