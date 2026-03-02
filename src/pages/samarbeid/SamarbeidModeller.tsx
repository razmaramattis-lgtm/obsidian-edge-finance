import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Building2, Handshake, TrendingUp, Shield, Users, Monitor, Scale, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/samarbeid-hero.jpg";
import teamImg from "@/assets/samarbeid-team.jpg";

const MODELS = [
  {
    icon: Building2,
    title: "Fullt oppkjøp",
    subtitle: "Vi overtar — du leder videre",
    points: [
      "Avargo kjøper 100 % av selskapet ditt",
      "Du kan fortsette som daglig leder i din avdeling",
      "Mulighet for eierandel i avdelingen din",
      "Alle ansatte beholder jobben — vi verdsetter kompetanse",
      "Komplett integrasjon i Avargo-økosystemet",
      "Konkurransedyktig pris basert på verdivurdering",
    ],
    highlight: true,
  },
  {
    icon: Handshake,
    title: "Samarbeidsavtale",
    subtitle: "Behold selskapet — nyt fordelene",
    points: [
      "Du beholder fullt eierskap og selvstendighet",
      "Tilgang til Avargos ressurser og støtteapparat",
      "Felles innkjøpsavtaler og stordriftsfordeler",
      "Delt merkevare eller egen profil — du velger",
      "Faglig nettverk og kompetansedeling",
      "Fleksible avtalevilkår tilpasset din virksomhet",
    ],
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: "Delvis oppkjøp",
    subtitle: "Vi vokser sammen",
    points: [
      "Avargo kjøper en avtalt andel (f.eks. 51 %)",
      "Du beholder resten og eier i din avdeling",
      "Felles strategi og vekstplan",
      "Redusert risiko for begge parter",
      "Gradvis integrasjon i ditt eget tempo",
      "Opsjon på full overtakelse senere",
    ],
    highlight: false,
  },
];

const ADVANTAGES = [
  { icon: Shield, title: "Hvitvasking & AML", desc: "Alle lovpålagte rutiner for anti-hvitvasking, risikovurdering og kundekontroll dekkes av sentralorganisasjonen. Du trenger aldri å tenke på dette igjen." },
  { icon: Scale, title: "Internkontroll & Compliance", desc: "Vi har et dedikert team som holder alle rutiner oppdatert i henhold til gjeldende regelverk — inkludert GDPR, hvitvaskingsloven og bokføringsloven." },
  { icon: Users, title: "HR & Personalstøtte", desc: "Komplett HR-avdeling med personalhåndbok, arbeidsrett, lønnskjøring, rekruttering og opplæring av nye ansatte." },
  { icon: Monitor, title: "IT & Teknologi", desc: "Profesjonelle nettsider, interne systemer, AI-verktøy og teknisk support. Alt av IT-infrastruktur er på plass." },
  { icon: Calculator, title: "Faglig kvalitetssikring", desc: "Tilgang til et sterkt fagmiljø med løpende oppdatering, kursing og sparring med erfarne rådgivere." },
  { icon: TrendingUp, title: "Stordriftsfordeler", desc: "Felles lisenser, programvare, forsikringer og leverandøravtaler — vesentlig reduserte driftskostnader." },
];

const SamarbeidModeller = () => (
  <>
    <Helmet>
      <title>Samarbeidsmodeller | Avargo Samarbeid</title>
      <meta name="description" content="Utforsk våre tre samarbeidsmodeller: fullt oppkjøp, samarbeidsavtale og delvis oppkjøp. Finn modellen som passer din situasjon." />
    </Helmet>

    {/* Hero */}
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src={teamImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Modeller</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Tre veier til samarbeid</h1>
          <p className="text-lg text-white/60 max-w-xl leading-relaxed">
            Uansett om du vil selge helt, samarbeide tett eller finne en mellomløsning — vi har en modell som passer akkurat din situasjon.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Models */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="space-y-8 max-w-4xl mx-auto">
          {MODELS.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`glass rounded-3xl p-8 md:p-10 border ${m.highlight ? "border-primary/30 ring-1 ring-primary/10" : "border-border/10"}`}>
              <div className="flex items-start gap-5 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${m.highlight ? "bg-primary/20" : "bg-primary/10"}`}>
                  <m.icon size={26} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{m.title}</h2>
                  <p className="text-muted-foreground">{m.subtitle}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {m.points.map((p, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Advantages */}
    <section className="py-16 md:py-24 bg-muted/5">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Fordeler</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Alt dette er inkludert</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Uansett hvilken modell du velger, får du tilgang til hele Avargos økosystem.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {ADVANTAGES.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 border border-border/10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <a.icon size={22} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold mb-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Interessert?</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">Send inn en uforpliktende søknad så tar vi kontakt for en konfidensiell samtale om mulighetene.</p>
        <Link to="/samarbeid/soknad" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/30">
          Send søknad <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  </>
);

export default SamarbeidModeller;
