import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Shield, Users, Monitor, Calculator, TrendingUp, Handshake, CheckCircle2, Building2, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

import heroImg from "@/assets/samarbeid-hero.jpg";
import teamImg from "@/assets/samarbeid-team.jpg";
import networkImg from "@/assets/samarbeid-network.jpg";

const BENEFITS = [
  { icon: Calculator, title: "Regnskapsressurser", desc: "Tilgang til avanserte systemer, fagmiljø og kvalitetssikring fra dag én." },
  { icon: Users, title: "HR & Personal", desc: "Komplett HR-støtte — personalhåndbok, arbeidsrett, lønnsadministrasjon og rekruttering." },
  { icon: Monitor, title: "IT & Utvikling", desc: "Nettsider, interne systemer, chatboter og AI-automatisering for smartere drift." },
  { icon: Shield, title: "Hvitvasking & Internkontroll", desc: "Alt av AML-rutiner, risikovurdering og compliance dekkes av hovedorganisasjonen." },
  { icon: Megaphone, title: "Markedsføring & SEO", desc: "Profesjonell markedsføring, SEO-optimalisering og digital synlighet for din avdeling." },
  { icon: TrendingUp, title: "Stordriftsfordeler", desc: "Felles innkjøp, lisenser og forhandlede avtaler gir lavere kostnader og bedre marginer." },
];

const MODELS = [
  { title: "Fullt oppkjøp — du trer ut", desc: "Vi overtar hele selskapet. Du får en god avtale og trer ut av den daglige driften med trygghet.", badge: null },
  { title: "Fullt oppkjøp — med videre ansettelse", desc: "Vi overtar selskapet, men du fortsetter som ansatt leder i din avdeling. Trygg overgang.", badge: "Populært" },
  { title: "Delvis oppkjøp", desc: "Vi kjøper en andel og du beholder resten. Du eier en del i din egen avdeling og vi vokser sammen.", badge: null },
  { title: "Samarbeidsavtale", desc: "Behold eierskap og selvstendighet, men nyt godt av Avargos ressurser og nettverk. Forutsetter at alle våre kriterier er oppfylt.", badge: null },
];

const SamarbeidForside = () => (
  <>
    <Helmet>
      <title>Avargo Samarbeid | Selg eller samarbeid med Norges mest ambisiøse regnskapsnettverk</title>
      <meta name="description" content="Utforsk mulighetene med Avargo Samarbeid. Selg regnskapsbyrået ditt, inngå samarbeidsavtale eller bli en del av et voksende nettverk med tilgang til HR, IT, AML og stordriftsfordeler." />
      <link rel="canonical" href="https://avargo.no/samarbeid" />
    </Helmet>

    {/* Hero */}
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="container mx-auto px-4 relative z-10 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6 backdrop-blur-sm">
            <Handshake size={13} /> Avargo Samarbeid
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
            Bli en del av<br />
            <span className="text-primary">noe større</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed mb-8">
            Vi ønsker å vokse sammen med ambisiøse regnskapsbyrå. Enten du vil selge, samarbeide eller finne en partner som tar byrden av drift — har vi en modell som passer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/samarbeid/soknad" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/30">
              Send søknad <ArrowRight size={15} />
            </Link>
            <Link to="/samarbeid/modeller" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all backdrop-blur-sm">
              Se modellene
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* What you get */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Hva du får</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Alt du trenger — under ett tak</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Som en del av Avargo-nettverket får du tilgang til et komplett økosystem av ressurser, slik at du kan fokusere på det du gjør best: rådgivning.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 border border-border/10 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <b.icon size={22} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Ownership model highlight */}
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]">
        <img src={networkImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Eierskap i egen avdeling</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Du selger ikke bare — du investerer i fremtiden</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Vår modell er unik: Vi ønsker at selger skal eie en del i sin egen avdeling. Det betyr at du fortsetter å dra nytte av veksten du skaper, samtidig som du får tilgang til hele Avargos støtteapparat.
            </p>
            <div className="space-y-3">
              {[
                "Behold eierskap og innflytelse i din avdeling",
                "Slip alle administrative byrder — vi tar alt",
                "Hvitvasking, internkontroll og compliance dekkes sentralt",
                "Felles innkjøpsavtaler gir bedre priser på alt",
                "Tilgang til IT, HR, marked og juridisk ekspertise",
                "Vi hjelper med alt — fra dag én",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={teamImg} alt="Avargo samarbeid" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Models preview */}
    <section className="py-16 md:py-24 bg-muted/5">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Samarbeidsmodeller</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Fire veier inn</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Vi tilpasser oss din situasjon. Uansett om du ønsker å selge helt, beholde eierskap eller finne en mellomløsning.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {MODELS.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-border/10 hover:border-primary/20 transition-all relative">
              {m.badge && (
                <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">{m.badge}</span>
              )}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Building2 size={18} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/samarbeid/modeller" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
            Les mer om modellene <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Klar for neste steg?</h2>
          <p className="text-lg text-white/60 max-w-lg mx-auto mb-8">Send inn en uforpliktende søknad så tar vi kontakt for en konfidensiell samtale.</p>
          <Link to="/samarbeid/soknad" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/30">
            Send søknad <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
);

export default SamarbeidForside;
