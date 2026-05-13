import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Check, Shield } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  packageName: string;
}

const PricingQuickForm = ({ open, onOpenChange, packageName }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Navn og e-post er påkrevd");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("contact-submit", {
        body: {
          contact_person: name,
          email,
          phone: phone || null,
          message: `Ønsker tilbud på pakke: ${packageName}`,
          source: typeof window !== "undefined" ? window.location.pathname + `?pakke=${packageName}` : null,
          referrer: typeof document !== "undefined" ? document.referrer : null,
          tag: "pricing-quick-form",
        },
      });
      if (error) throw error;
      setDone(true);
      toast.success("Takk! Vi tar kontakt innen 24 timer.");
    } catch (err: any) {
      toast.error(err?.message || "Kunne ikke sende — prøv igjen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDone(false); setName(""); setEmail(""); setPhone(""); } }}>
      <DialogContent className="max-w-md glass border-border/30">
        {done ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Check className="text-primary" size={24} />
            </div>
            <DialogTitle className="font-heading text-2xl">Takk!</DialogTitle>
            <p className="text-sm text-foreground/60 font-light">Vi sender deg et uforpliktende tilbud på <span className="text-foreground">{packageName}</span> innen 24 timer.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">Få tilbud på {packageName}</DialogTitle>
              <DialogDescription className="font-light">
                Kun navn og e-post — vi tar kontakt innen 24 timer. Helt uforpliktende.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-3 mt-2">
              <Input placeholder="Navn *" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input type="email" placeholder="E-post *" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="tel" placeholder="Telefon (valgfritt)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button type="submit" disabled={loading} className="w-full glow-rose group">
                {loading ? "Sender…" : (<>Send forespørsel <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" /></>)}
              </Button>
              <p className="text-[11px] text-foreground/50 flex items-center gap-1.5 justify-center pt-1">
                <Shield size={11} /> Vi deler aldri info. Ingen forpliktelse.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PricingQuickForm;
