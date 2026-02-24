import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Users, Scale, FileText, Award } from "lucide-react";
import { Helmet } from "react-helmet-async";
import learningImg from "@/assets/kurs-learning.jpg";
import patternImg from "@/assets/kurs-pattern.jpg";

const topics = [
  "Arbeidsmiljøloven i praksis",
  "Lønn & feriepenger",
  "Onboarding & offboarding",
  "Personalhåndbok & reglement",
  "Sykefraværsoppfølging",
  "Oppsigelse & sluttavtaler",
  "HMS-arbeid",
  "Kursbevis / sertifisering",
];

const whyItems = [
  { num: "01", title: "Praktisk fokus.", desc: "Reelle eksempler og caser fra norsk arbeidsliv — bruk kunnskapen med én gang." },
  { num: "02", title: "Oppdatert regelverk.", desc: "Arbeidsretten endres. Vi sørger for at du alltid lærer gjeldende regler og praksis." },
  { num: "03", title: "Tilpasset ditt nivå.", desc: "Enten du er fersk leder eller erfaren HR-ansvarlig — kurset tilpasses ditt utgangspunkt." },
  { num: "04", title: "Sertifisert.", desc: "Du får kursbevis som dokumenterer gjennomføring. Verdifullt for deg og for bedriften." },
];

const KursHr = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <>
      <Helmet>
        <title>HR & arbeidsgiveransvar — kurs | Avargo Kurs</title>
        <meta name="description" content="Kurs i arbeidsrett, lønnsprosesser og personalledelse. Forstå regelverket og ta bedre beslutninger som arbeidsgiver." />
      </Helmet>

      {/* Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src={learningImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-2xl">
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5">HR-kurs</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.02] mb-6">
              Bli en bedre <span className="italic text-gradient-rose">arbeidsgiver.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-xl">
              Kurs i arbeidsrett, lønnsprosesser og personalledelse. For deg som vil forstå regelverket og ta bedre beslutninger.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Topics + Why */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva du lærer</p>
              <h2 className="font-heading text-3xl md:text-4xl mb-8">Komplett <span className="italic text-gradient-rose">pensum.</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topics.map((t, i) => (
                  <motion.div key={t} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border/10 bg-muted/5">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    <span className="text-sm">{t}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hvorfor dette kurset</p>
              {whyItems.map((item, i) => (
                <motion.div key={item.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-5">
                  <span className="text-3xl font-heading text-secondary/30">{item.num}</span>
                  <div>
                    <h3 className="font-heading text-base mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/5" />
        <div className="absolute inset-0 opacity-[0.04]"><img src={patternImg} alt="" className="w-full h-full object-cover" /></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Award size={32} className="text-secondary mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-5xl mb-4">Klar for å <span className="italic text-gradient-rose">lære?</span></h2>
            <p className="text-sm text-muted-foreground font-light max-w-md mx-auto mb-10">Praktiske kurs som gjør deg tryggere som arbeidsgiver.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kurs/katalog" className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-secondary text-secondary-foreground text-sm font-medium tracking-wider rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20">
                Se alle HR-kurs <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link to="/kurs/bedriftskurs" className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-border/20 text-foreground text-sm font-medium tracking-wider rounded-full hover:border-secondary/30 transition-all">
                Bedriftskurs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default KursHr;
