import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  Sparkles, Calendar, MessageSquare, Gift, Monitor, 
  ArrowRight, Coffee, Heart, Users, Shield, Mail, Building
} from "lucide-react";
import heroImg from "@/assets/karriere-hero-futuristic.jpg";
import teamImg from "@/assets/karriere-team-meeting.jpg";
import cultureImg from "@/assets/karriere-culture.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const TIMELINE = [
  {
    icon: Mail,
    title: "Bekreft tilbudet",
    description: "Send oss informasjonen vi trenger (personnummer, kontonummer og nærmeste pårørende) til kontaktpersonen din.",
    accent: "from-primary to-primary/60",
  },
  {
    icon: Monitor,
    title: "Få tilgang til adminpanelet",
    description: "Så fort arbeidsavtalen er signert, vil du motta innlogging til adminpanelet ditt. Der finner du alt fra chat, dokumenter og ressurser til samarbeidsavtaler og fordeler.",
    accent: "from-secondary to-secondary/60",
  },
  {
    icon: MessageSquare,
    title: "Bli med i chatten",
    description: "Si hei til kollegaene dine! Chatten er der vi deler nyheter, tips og god stemning. Meld deg inn og bli en del av fellesskapet allerede nå.",
    accent: "from-primary to-secondary",
  },
  {
    icon: Coffee,
    title: "Kom på besøk når du vil",
    description: "Du er alltid velkommen til kontoret – også før oppstartsdato. Stikk innom for en kaffe, si hei, og kjenn på stemningen. Vi gleder oss til å se deg!",
    accent: "from-secondary to-primary",
  },
  {
    icon: Calendar,
    title: "Din første dag",
    description: "Første dag starter med en rolig innsjekk, introduksjon til teamet og alt du trenger for å komme i gang. Vi sørger for at du føler deg velkommen fra første stund.",
    accent: "from-primary to-primary/80",
  },
];

const BENEFITS = [
  { icon: Heart, label: "Konkurransedyktig lønn & gode forsikringer" },
  { icon: Users, label: "Et inkluderende og sosialt arbeidsmiljø" },
  { icon: Gift, label: "Eksklusive samarbeidsavtaler og fordeler" },
  { icon: Shield, label: "Ingen overtid – vi verdsetter balanse" },
  { icon: Building, label: "Moderne kontorer og topp teknologi" },
  { icon: Sparkles, label: "Kontinuerlig faglig utvikling og kursing" },
];

const KarriereVelkommen = () => {
  return (
    <>
      <Helmet>
        <title>Velkommen til Avargo | Din nye reise starter her</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? "hsl(var(--primary) / 0.5)" : "hsl(var(--secondary) / 0.4)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 border border-primary/20 backdrop-blur-md mb-8"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm font-medium text-primary">Gratulerer med jobbtilbudet!</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Velkommen til{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Avargo
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Vi er utrolig glade for at du har valgt å bli en del av teamet vårt. 
            Her finner du alt du trenger å vite om veien frem til din første dag – og litt til.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display text-3xl md:text-4xl font-bold mb-4"
            >
              Din reise mot oppstart
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground text-lg max-w-xl mx-auto"
            >
              Slik forbereder vi oss – sammen med deg
            </motion.p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-0">
            {TIMELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  custom={i}
                  variants={fadeUp}
                  className="relative flex gap-6 pb-12 last:pb-0"
                >
                  {/* Vertical line */}
                  {i < TIMELINE.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-border/40 to-transparent" />
                  )}

                  {/* Icon */}
                  <div className={`relative shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${step.accent} flex items-center justify-center shadow-lg`}>
                    <Icon size={20} className="text-primary-foreground" />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.accent} blur-xl opacity-30`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3]"
            >
              <img src={teamImg} alt="Teamet hos Avargo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Et team som{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  heier på deg
                </span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Hos Avargo tror vi på at de beste resultatene skapes i et miljø hvor folk trives. 
                Vi jobber tverrfaglig, deler kunnskap og løfter hverandre. Fra første dag vil du 
                ha et helt team rundt deg som er klare til å hjelpe deg i gang.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                De første ukene handler om å bli kjent – med kollegaer, verktøy og arbeidsmåter. 
                Du vil få en fadder som følger deg tett, og du kan alltid spørre om hva som helst.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display text-3xl md:text-4xl font-bold mb-4"
            >
              Fordeler som ansatt i Avargo
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground text-lg max-w-xl mx-auto"
            >
              Vi tar vare på våre folk – her er noe av det du kan se frem til
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="group relative p-5 rounded-2xl border border-border/10 bg-card/30 backdrop-blur-sm hover:border-primary/20 hover:bg-primary/[0.03] transition-all duration-500"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground/90">{b.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-muted/20 border border-border/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                <Gift size={22} className="text-secondary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold mb-1">Alle fordeler og samarbeidsavtaler finner du i adminpanelet</p>
                <p className="text-xs text-muted-foreground">
                  Har du ikke fått tilgang ennå? Send en e-post til{" "}
                  <a href="mailto:kontakt@avargo.no" className="text-primary hover:underline font-medium">
                    kontakt@avargo.no
                  </a>{" "}
                  så ordner vi det med en gang.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Culture image */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden aspect-[21/9] max-w-5xl mx-auto"
          >
            <img src={cultureImg} alt="Arbeidsmiljø hos Avargo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8 md:p-12">
              <p className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                Vi gleder oss til å ha deg med på laget 🎉
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Klar for eventyret?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Vi kan knapt vente. Utforsk gjerne nettsiden vår for å bli enda bedre kjent med oss.
            </p>
            <a
              href="https://www.avargo.no"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
            >
              Utforsk avargo.no <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default KarriereVelkommen;
