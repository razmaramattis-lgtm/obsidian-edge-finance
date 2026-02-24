import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, User, Mail, Phone, MapPin, Linkedin, Globe, Calendar, Briefcase, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CvUpload from "@/components/CvUpload";

const CATEGORIES = ["Regnskap", "Personal", "Marked", "IT", "Annet"];

interface OpenApplicationDialogProps {
  trigger: React.ReactNode;
}

const OpenApplicationDialog = ({ trigger }: OpenApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "",
    date_of_birth: "",
    address: "", city: "", postal_code: "",
    linkedin_url: "", portfolio_url: "",
    preferred_category: "", available_from: "",
    message: "",
  });

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const submit = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.date_of_birth || !form.message.trim()) {
      toast.error("Fyll ut alle obligatoriske felt (navn, e-post, telefon, fødselsdato og søknadstekst).");
      return;
    }
    if (!cvUrl) {
      toast.error("Last opp CV før du sender søknaden.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("open_applications").insert([{
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      date_of_birth: form.date_of_birth || null,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      postal_code: form.postal_code.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      portfolio_url: form.portfolio_url.trim() || null,
      preferred_category: form.preferred_category || null,
      available_from: form.available_from.trim() || null,
      message: form.message.trim() || null,
      cv_url: cvUrl,
      cv_file_name: cvFileName,
    }]);
    if (error) {
      toast.error("Noe gikk galt. Prøv igjen.");
    } else {
      setSubmitted(true);
      toast.success("Åpen søknad sendt!");
    }
    setSubmitting(false);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) { setStep(0); setSubmitted(false); setCvUrl(null); setCvFileName(null); setForm({ full_name: "", email: "", phone: "", date_of_birth: "", address: "", city: "", postal_code: "", linkedin_url: "", portfolio_url: "", preferred_category: "", available_from: "", message: "" }); }
  };

  const inputClass = "w-full h-11 pl-10 pr-3 rounded-xl border border-border/20 bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
  const labelClass = "text-xs text-muted-foreground mb-1 block";

  const steps = [
    {
      title: "Hvem er du?",
      subtitle: "Fortell oss litt om deg selv",
      content: (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Fullt navn *</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input value={form.full_name} onChange={e => set("full_name", e.target.value)} required placeholder="Ditt fulle navn" maxLength={100} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>E-post *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} required placeholder="din@epost.no" maxLength={255} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Telefon *</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} required placeholder="Telefonnummer" maxLength={20} className={inputClass} />
              </div>
           </div>
          </div>
          <div>
            <label className={labelClass}>Fødselsdato *</label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input type="date" value={form.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} required className={inputClass} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Hvor bor du?",
      subtitle: "Adresse og sted",
      content: (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Adresse *</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input value={form.address} onChange={e => set("address", e.target.value)} required placeholder="Gate og husnummer" maxLength={200} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Postnummer *</label>
              <input value={form.postal_code} onChange={e => set("postal_code", e.target.value)} required placeholder="0000" maxLength={10}
                className="w-full h-11 px-3 rounded-xl border border-border/20 bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className={labelClass}>Sted *</label>
              <input value={form.city} onChange={e => set("city", e.target.value)} required placeholder="By / sted" maxLength={100}
                className="w-full h-11 px-3 rounded-xl border border-border/20 bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Profiler & preferanser",
      subtitle: "Del lenker og velg fagområde",
      content: (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>LinkedIn-profil</label>
            <div className="relative">
              <Linkedin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input value={form.linkedin_url} onChange={e => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." maxLength={500} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Portefølje / nettside</label>
            <div className="relative">
              <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input value={form.portfolio_url} onChange={e => set("portfolio_url", e.target.value)} placeholder="https://dinside.no" maxLength={500} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Ønsket fagområde</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => set("preferred_category", form.preferred_category === cat ? "" : cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.preferred_category === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  }`}>{cat}</button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Hvorfor Avargo?",
      subtitle: "Fortell oss hva som driver deg",
      content: (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Last opp CV *</label>
            <CvUpload
              cvUrl={cvUrl}
              cvFileName={cvFileName}
              onUploaded={(url, name) => { setCvUrl(url); setCvFileName(name); }}
              onRemove={() => { setCvUrl(null); setCvFileName(null); }}
            />
          </div>
          <div>
            <label className={labelClass}>Tilgjengelig fra</label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input type="date" value={form.available_from} onChange={e => set("available_from", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Søknadstekst - Fortell oss om deg selv og hvorfor du vil jobbe hos Avargo *</label>
            <textarea value={form.message} onChange={e => set("message", e.target.value)}
              required
              placeholder="Hva motiverer deg? Hvilken erfaring har du? Hva kan du bidra med?"
              rows={5} maxLength={3000}
              className="w-full rounded-xl border border-border/20 bg-muted/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border/20">
        {submitted ? (
          <div className="text-center py-16 px-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Sparkles size={32} className="text-primary" />
              </div>
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2">Søknad mottatt!</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">Takk for din interesse! Vi gjennomgår søknaden din og tar kontakt om vi har en passende stilling.</p>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-1 mb-4">
                {steps.map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= step ? "bg-primary" : "bg-muted/40"}`} />
                ))}
              </div>
              <DialogHeader>
                <DialogTitle className="text-lg">{steps[step].title}</DialogTitle>
                <p className="text-xs text-muted-foreground">{steps[step].subtitle}</p>
              </DialogHeader>
            </div>

            {/* Step content */}
            <div className="px-6 pb-2">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  {steps[step].content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="h-11 px-5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
                  Tilbake
                </button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <button type="button" onClick={() => setStep(s => s + 1)}
                  className="h-11 px-6 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
                  Neste
                </button>
              ) : (
                <button type="button" onClick={submit} disabled={submitting}
                  className="h-11 px-6 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
                  {submitting ? "Sender…" : <><Send size={14} /> Send søknad</>}
                </button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OpenApplicationDialog;
