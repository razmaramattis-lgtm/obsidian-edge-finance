import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Receipt, Scale, FileText, Calculator,
  Building2, BarChart3, CheckCircle2, GraduationCap,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import heroImg from "@/assets/kurs-hero.jpg";

const categories = [
  { icon: BookOpen, label: "Bokføring", count: 17, desc: "Grunnleggende og avansert bokføring, bilagshåndtering og kontoplan." },
  { icon: Receipt, label: "MVA", count: 15, desc: "Mva-regler, fradrag, omsetningsoppgave og spesielle ordninger." },
  { icon: Scale, label: "Skatt & Skattelov", count: 13, desc: "Skatteplanlegging, skattemelding og fradragsmuligheter." },
  { icon: FileText, label: "Årsregnskap", count: 9, desc: "Årsoppgjør, noter, resultat og balanse." },
  { icon: Calculator, label: "Lønn & Personal", count: 10, desc: "Lønnskjøring, feriepenger, sykepenger og innrapportering." },
  { icon: Building2, label: "Selskapsrett", count: 7, desc: "Stiftelse, aksjelov, utbytte og omdanning." },
  { icon: BarChart3, label: "Analyse & Rapportering", count: 8, desc: "Nøkkeltall, budsjettering og økonomisk analyse." },
];

const highlights = [
  "Utviklet av statsautoriserte regnskapsførere",
  "Praktiske eksempler fra norske bedrifter",
  "Oppdatert med gjeldende lover og regler",
  "Kursbevis ved gjennomført kurs",
  "Tilpasset alle nivåer — fra nybegynner til viderekomne",
  "Bestill enkelt online — 500 kr per kurs",
];

const KursRegnskap = () => {
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>Regnskapskurs — Lær regnskap fra eksperter | Avargo Kurs</title>
        <meta name="description" content="Praktiske regnskapskurs innen bokføring, MVA, skatt, årsregnskap og mer. Utviklet av statsautoriserte regnskapsførere for norske bedrifter." />
      </Helmet>

      {/* Hero */}
      <section className="py-24 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"><img src={heroImg} alt="" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5">Avargo Kurs · Regnskap</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.02] mb-6">
              Lær regnskap.<br />
              <span className="italic text-gradient-rose">Fra de som kan det.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mb-10">
              Praktiske kurs utviklet av statsautoriserte regnskapsførere. Fra grunnleggende bokføring til avansert skatteplanlegging — alt du trenger for å forstå og ta kontroll over tallene.
            </p>
            <Link
              to="/kurs/katalog"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-secondary text-secondary-foreground text-sm font-medium tracking-wider rounded-full hover:scale-[1.02] transition-all duration-500"
            >
              Se alle regnskapskurs
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 md:py-28 border-t border-border/10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mb-14">
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Hvorfor våre kurs</p>
            <h2 className="font-heading text-3xl md:text-5xl leading-tight mb-6">
              Kurs bygget for <span className="italic">virkeligheten.</span>
            </h2>
            <p className="text-muted-foreground font-light">
              Ingen tørr teori. Hvert kurs er fylt med praktiske eksempler, caser og sjekklister du kan bruke direkte i din bedrift.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-5 rounded-2xl border border-border/10 bg-muted/5"
              >
                <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/90 font-light">{h}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-32 border-t border-border/10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mb-14">
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Kategorier</p>
            <h2 className="font-heading text-3xl md:text-5xl leading-tight">
              Velg ditt <span className="italic">fagområde.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredCat(cat.label)}
                  onMouseLeave={() => setHoveredCat(null)}
                >
                  <Link
                    to={`/kurs/katalog`}
                    className={`block p-6 rounded-2xl border transition-all duration-300 group ${
                      hoveredCat === cat.label
                        ? "border-secondary/30 bg-secondary/5 scale-[1.01]"
                        : "border-border/10 bg-muted/5 hover:border-secondary/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Icon size={18} className="text-secondary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-sm font-heading">{cat.label}</h3>
                        <p className="text-[10px] text-muted-foreground">{cat.count} kurs</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">{cat.desc}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      Se kurs <ArrowRight size={10} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t border-border/10 text-center">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GraduationCap size={40} className="text-secondary/30 mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl mb-4">
              Klar for å lære?
            </h2>
            <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto text-sm">
              Bla gjennom alle regnskapskursene og bestill direkte.
            </p>
            <Link
              to="/kurs/katalog"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-secondary text-secondary-foreground text-sm font-medium tracking-wider rounded-full hover:scale-[1.02] transition-all duration-500"
            >
              Gå til kurskatalogen
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default KursRegnskap;
