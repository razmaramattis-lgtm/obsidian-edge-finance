import { CheckCircle2, Mail, Calendar, Sparkles } from "lucide-react";

interface Props {
  variant?: "default" | "compact";
}

const NextStepsTimeline = ({ variant = "default" }: Props) => {
  const steps = [
    { icon: CheckCircle2, title: "Mottatt", desc: "Vi har registrert henvendelsen din. Du får bekreftelse på e-post.", time: "Nå" },
    { icon: Mail, title: "Personlig svar", desc: "En dedikert rådgiver leser gjennom og kontakter deg direkte — ikke et automatisk svar.", time: "Innen 24 timer" },
    { icon: Calendar, title: "Uforpliktende prat", desc: "Vi avtaler en kort prat (Teams eller telefon) der vi blir kjent med behovet ditt.", time: "Når det passer deg" },
    { icon: Sparkles, title: "Skreddersydd tilbud", desc: "Du får et konkret forslag med fast pris — ingen overraskelser, ingen skjulte tillegg.", time: "Etter samtalen" },
  ];

  return (
    <div className={`${variant === "compact" ? "py-4" : "py-6"} space-y-4`}>
      {variant === "default" && (
        <div className="text-center mb-6">
          <h3 className="font-heading text-2xl md:text-3xl mb-2">Slik går det videre</h3>
          <p className="text-sm text-foreground/60 font-light">Ingen telefonkjør, ingen pushy salgsteknikker. Bare ærlig rådgivning.</p>
        </div>
      )}
      <ol className="relative space-y-5 md:space-y-6">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" aria-hidden />
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.title} className="relative flex gap-4">
              <div className="relative z-10 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-primary" strokeWidth={2} />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h4 className="font-medium text-foreground/90 text-sm md:text-base">{s.title}</h4>
                  <span className="text-[10px] uppercase tracking-wider text-primary/70 font-medium">{s.time}</span>
                </div>
                <p className="text-xs md:text-sm text-foreground/55 font-light leading-relaxed mt-1">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default NextStepsTimeline;
