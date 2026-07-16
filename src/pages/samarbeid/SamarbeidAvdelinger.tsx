import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calculator, Users, Monitor, Megaphone, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/samarbeid-hero.jpg";

const DIVISIONS = [
  {
    icon: Calculator,
    title: "Avargo Regnskap",
    desc: "Vår kjernevirksomhet. Profesjonell regnskapsføring, årsoppgjør, skatteplanlegging og løpende rådgivning for bedrifter i alle størrelser.",
    features: [
      "Løpende regnskapsføring og bokføring",
      "Årsoppgjør og ligningspapirer",
      "MVA-rapportering og skattemelding",
      "Skatteplanlegging og rådgivning",
      "CFO-tjenester og økonomistyring",
      "1-til-1 dedikert regnskapsfører",
    ],
    color: "primary",
  },
  {
    icon: Users,
    title: "Avargo Personal",
    desc: "Komplett HR-avdeling som tar seg av alt fra personalhåndbok og arbeidsrett til lønnsadministrasjon og rekruttering.",
    features: [
      "Personalhåndbok og policyer",
      "Arbeidsrett og juridisk rådgivning",
      "Lønnskjøring og administrasjon",
      "Rekruttering og onboarding",
      "HMS-dokumentasjon og internkontroll",
      "Kurs og kompetanseutvikling",
    ],
    color: "secondary",
  },
  {
    icon: Megaphone,
    title: "Avargo Marked",
    desc: "Digital markedsføring som gir resultater. Fra SEO og Google Ads til sosiale medier — vi hjelper deg med å bli synlig og vokse.",
    features: [
      "SEO-optimalisering og synlighet",
      "Google Ads og betalt annonsering",
      "Meta-annonser og sosiale medier",
      "Innholdsstrategi og copywriting",
      "Analyse og rapportering",
      "Markedsplan og strategi",
    ],
    color: "primary",
  },
  {
    icon: Monitor,
    title: "Avargo IT",
    desc: "Teknologi som driver virksomheten fremover. Vi bygger nettsider, interne systemer, chatboter og AI-løsninger tilpasset din bedrift.",
    features: [
      "Profesjonelle nettsider og nettbutikker",
      "Interne systemer og dashboards",
      "AI-chatboter og automatisering",
      "Integrasjoner og API-utvikling",
      "Teknisk support og vedlikehold",
      "Skyløsninger og infrastruktur",
    ],
    color: "secondary",
  },
];

const SamarbeidAvdelinger = () => (
  <>
    <Helmet>
      <title>Våre avdelinger | Avargo Samarbeid</title>
      <meta name="description" content="Utforsk Avargos fire avdelinger: Regnskap, Personal, Marked og IT. Som samarbeidspartner får du tilgang til alle ressursene." />
    </Helmet>

    {/* Hero */}
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Avdelinger</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Våre avdelinger</h1>
          <p className="text-lg text-white/60 max-w-xl leading-relaxed">
            Som en del av Avargo får du tilgang til fire spesialiserte avdelinger. Alt du trenger for å drive et moderne regnskapsbyrå — uten å måtte bygge det selv.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Divisions */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="space-y-10 max-w-4xl mx-auto">
          {DIVISIONS.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-8 md:p-10 border border-border/10 hover:border-primary/20 transition-all">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <d.icon size={26} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{d.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{d.desc}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {d.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 md:py-24 bg-muted/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Klar for tilgang til alt dette?</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">Start en uforpliktende kartlegging så tar vi kontakt for en konfidensiell samtale.</p>
        <Link to="/samarbeid/soknad" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/30">
          Start kartlegging <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  </>
);

export default SamarbeidAvdelinger;
