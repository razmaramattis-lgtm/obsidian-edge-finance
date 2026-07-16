import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, FileText, Check } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const LeadMagnetDialog = ({ open, onOpenChange }: Props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      toast.error("Navn og e-post er påkrevd");
      return;
    }
    setLoading(true);
    try {
      await supabase.functions.invoke("contact-submit", {
        body: {
          contact_person: name,
          email,
          message: "Lastet ned prisliste/prisguide (lead magnet)",
          source: typeof window !== "undefined" ? window.location.pathname : null,
          referrer: typeof document !== "undefined" ? document.referrer : null,
          tag: "lead-magnet-prisguide",
        },
      });
      setDone(true);
      // Auto-open the printable price guide in new tab
      setTimeout(() => {
        window.open("/prisguide", "_blank");
      }, 600);
    } catch (err: any) {
      toast.error(err?.message || "Kunne ikke sende — prøv igjen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDone(false); setEmail(""); setName(""); } }}>
      <DialogContent className="max-w-md glass border-border/30">
        {done ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Check className="text-primary" size={24} />
            </div>
            <DialogTitle className="font-heading text-2xl">Klar!</DialogTitle>
            <p className="text-sm text-foreground/60 font-light">
              Prisguiden åpnes i ny fane. Du kan også bruke knappen under hvis den ikke åpnet seg automatisk.
            </p>
            <a
              href="/prisguide"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium glow-rose"
            >
              <Download size={14} /> Åpne prisguide
            </a>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                <FileText size={20} className="text-primary" />
              </div>
              <DialogTitle className="font-heading text-2xl text-center">Last ned prisguide</DialogTitle>
              <DialogDescription className="font-light text-center">
                Komplett oversikt over alle pakker, hva som er inkludert og hvilke tilleggstjenester vi tilbyr.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-3 mt-2">
              <Input placeholder="Navn *" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
              <Input type="email" placeholder="E-post *" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
              <Button type="submit" disabled={loading} className="w-full glow-rose">
                {loading ? "Henter..." : (<><Download size={14} className="mr-2" /> Send meg prisguiden</>)}
              </Button>
              <p className="text-[11px] text-foreground/50 text-center pt-1 font-light">
                Vi sender ikke spam. Du kan melde deg av når som helst.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadMagnetDialog;
