import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Check, Shield } from "lucide-react";
import NextStepsTimeline from "@/components/NextStepsTimeline";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  packageName: string;
}

const PricingQuickForm = ({ open, onOpenChange, packageName }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !company.trim()) {
      toast.error("Navn, selskap og e-post er påkrevd");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("contact-submit", {
        body: {
          contact_person: name,
          company_name: company,
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
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDone(false); setName(""); setEmail(""); setPhone(""); setCompany(""); } }}>
      <DialogContent className="max-w-md glass border-border/30 max-h-[90vh] overflow-y-auto">
        {done ? (
          <div className="py-2 space-y-5">
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Check className="text-primary" size={24} />
              </div>
              <DialogTitle className="font-heading text-2xl">Takk, {name.split(" ")[0] || "vi har deg"}!</DialogTitle>
              <p className="text-sm text-foreground/60 font-light">Vi sender deg et uforpliktende tilbud på <span className="text-foreground">{packageName}</span> innen 24 timer.</p>
            </div>
            <div className="border-t border-border/20 pt-4">
              <NextStepsTimeline variant="compact" />
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">Få tilbud på {packageName}</DialogTitle>
              <DialogDescription className="font-light">
                Tre felt — vi tar kontakt innen 24 timer. Helt uforpliktende.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-3 mt-2">
              <Input placeholder="Navn *" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
              <Input placeholder="Selskap *" value={company} onChange={(e) => setCompany(e.target.value)} required maxLength={150} />
              <Input type="email" placeholder="E-post *" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
              <Input type="tel" placeholder="Telefon (valgfritt)" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
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
