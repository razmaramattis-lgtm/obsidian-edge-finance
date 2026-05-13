import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const objections = [
  {
    q: "Binder jeg meg til noe ved å ta kontakt?",
    a: "Nei. Henvendelsen er helt uforpliktende. Du får et tilbud og bestemmer selv om du vil gå videre.",
  },
  {
    q: "Hva hvis jeg allerede har regnskapsfører?",
    a: "Vi tar oss av hele byttet for deg — kontakt med tidligere fører, overføring av data og oppsett. Du trenger ikke gjøre noe selv.",
  },
  {
    q: "Hvor lang tid tar det fra kontakt til ferdig oppsett?",
    a: "Vanligvis 1–2 uker. Vi tar en uforpliktende prat innen 24 timer, sender tilbud, og er i gang så snart du gir grønt lys.",
  },
  {
    q: "Hva er den faktiske månedsprisen for min bedrift?",
    a: "Fra 1 590 kr/mnd for små selskaper. Du får en konkret pris basert på antall bilag, ansatte og behov — ingen skjulte tillegg.",
  },
  {
    q: "Kan jeg snakke med en ekte person, ikke en chatbot?",
    a: "Ja. Du får én dedikert rådgiver som kjenner selskapet ditt. Ubegrenset telefon-/e-postsupport er inkludert i alle pakker.",
  },
];

const ContactObjections = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      <h3 className="font-heading text-xl md:text-2xl mb-4 text-center">Lurer du på noe før du tar kontakt?</h3>
      {objections.map((o, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="rounded-2xl glass border border-border/20 overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left hover:bg-primary/5 transition-colors"
            >
              <span className="text-sm md:text-base font-medium text-foreground/85">{o.q}</span>
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                {isOpen ? <Minus size={13} className="text-primary" /> : <Plus size={13} className="text-primary" />}
              </span>
            </button>
            {isOpen && (
              <div className="px-4 md:px-5 pb-4 md:pb-5 -mt-1">
                <p className="text-sm text-foreground/60 font-light leading-relaxed">{o.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContactObjections;
