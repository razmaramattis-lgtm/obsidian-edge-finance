import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb, Users, Eye, MessageSquare, ArrowRight, Smile, HandMetal, Shirt, Wind, Brain, HelpCircle, RotateCcw } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

const tips9 = [
  "Møt forberedt! Les deg grundig opp på Avargo og sett deg inn i hva som kreves av stillingen.",
  "Kom i tide, puss tennene, husk et solid håndtrykk og godt blikk.",
  "Er jobbintervjuet digitalt? Sjekk at lenken fungerer. Last ned Teams eller Zoom på forhånd.",
  "Slå av mobilen.",
  "Kle deg pent – heller litt for pent enn for uformelt.",
  "Dropp sigaretter, makrell i tomat og lignende duftbomber før du går til intervju.",
  "Kjenn din kompetanse og forbered deg på å gjengi din historie. Hvem er du? Hvorfor har du søkt? Hvorfor skal de ansette deg?",
  "Pust med magen! Overbevis deg selv om at dette går bra, da blir du mer avslappet.",
  "Forbered spørsmål du ønsker å stille til oss – det viser engasjement og nysgjerrighet.",
];

const Intervjutips = () => (
  <>
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
      <title>Forbered deg til intervju | Avargo Karriere</title>
    </Helmet>

    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 max-w-3xl">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.25em] uppercase text-primary font-semibold mb-4">Intervjuguide</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Forbered deg til intervjuet
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Vi gleder oss til å møte deg! Her er våre beste tips for å gjøre et godt inntrykk og føle deg trygg i intervjusituasjonen.
          </p>
        </motion.div>

        {/* 9 tips */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lightbulb className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold">9 tips for et godt førsteinntrykk</h2>
          </div>
          <div className="space-y-4">
            {tips9.map((tip, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                className="flex gap-4 p-4 rounded-xl border border-border/20 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tre hovedbekymringer */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Brain className="text-secondary" size={20} />
            </div>
            <h2 className="text-xl font-bold">Arbeidsgiverens tre hovedspørsmål</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Både i søknaden og på intervjuet bør du ha gode svar på disse:
          </p>
          <div className="grid gap-4">
            {[
              "Er du i stand til å utføre jobben?",
              "Er du motivert til å gjøre akkurat denne jobben på akkurat denne arbeidsplassen?",
              "Vil du passe inn på arbeidsplassen?",
            ].map((q, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                <CheckCircle2 size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{q}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Forberedelser */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Eye className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold">Slik forbereder du deg</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-2 text-base">Forstå kravene til stillingen</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Se nøye på stillingsannonsen og skriv ned hvordan du matcher hvert punkt. Tenk over hvilke erfaringer som gjør deg kvalifisert.
                Gjør en kompetanseanalyse av dine harde og myke ferdigheter – finn konkrete eksempler på når du har brukt dem.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-base">Forstå bedriften og bransjen</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sørg for at du forstår hva Avargo gjør, hvilke verdier vi har og hvem vi konkurrerer mot. Gjør et nytt søk i dagene
                før intervjuet og følg med på relevante bransjenyheter. Sjekk LinkedIn for eventuelle kontakter.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-base">Visualiser intervjusituasjonen</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Se for deg møtet med intervjueren. Du er rolig og trygg, hilser med et stødig håndtrykk og føler deg oppvakt og klar.
                Forskning viser at mental visualisering forsterker de samme nervekoblingene som den faktiske handlingen.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-base">Forbered en heispitch (30 sek)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Mange intervjuer åpner med «fortell litt om deg selv». Forbered en kort pitch som dekker:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Navnet ditt",
                  "Hva du har gjort før (siste jobb/studie)",
                  "Styrker og egenskaper relevante for jobben",
                  "Ambisjoner og fremtidsplaner",
                  "Hvorfor du søker / er ledig nå",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Fysisk forberedelse */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smile className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold">Førsteinntrykket</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Førsteinntrykket skaper du bare én gang – gjør du et godt inntrykk, er intervjuerne allerede på din side.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Smile, title: "Øv deg på å smile", desc: "Et naturlig smil er avvæpnende. Øv foran speilet." },
              { icon: HandMetal, title: "Fast håndtrykk", desc: "Gir inntrykk av ærlighet, selvsikkerhet og varme." },
              { icon: Shirt, title: "Planlegg antrekket", desc: "Tilpass deg kleskoden – heller litt for pent enn for uformelt." },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} className="p-5 rounded-xl border border-border/20 bg-card/50 text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Under intervjuet */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Users className="text-secondary" size={20} />
            </div>
            <h2 className="text-xl font-bold">Under intervjuet</h2>
          </div>

          <div className="space-y-4">
            {[
              "Vær presis – møt helst litt før tiden. Ring og si fra hvis du blir forsinket.",
              "Vær høflig mot alle du møter – du vet aldri hvem som blir spurt om sitt inntrykk av deg.",
              "Pust med magen. Dype åndedrag senker pulsen og gjør stemmen mer naturlig.",
              "Smil og hold øyekontakt. Sitt fremoverlent – det viser at du er engasjert.",
              "Ikke fold armene – det signaliserer at du lukker deg inne.",
              "Bruk håndbevegelser til å understreke poenger.",
              "Hold nervøse vaner under kontroll (risting med fot, plukking på fingrene osv.).",
            ].map((tip, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} className="flex items-start gap-3 text-sm">
                <CheckCircle2 size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-foreground/90">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Still spørsmål */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold">Spørsmål du kan stille oss</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Forbered spørsmål på forhånd – men ikke spør om noe du allerede har fått svar på i løpet av intervjuet.
          </p>
          <div className="space-y-3">
            {[
              "Hvordan har det seg at denne stillingen er ledig nå?",
              "Hvordan vil prestasjonene mine måles, og hvordan får jeg tilbakemeldinger?",
              "Hvem vil være min nærmeste kontakt i bedriften?",
              "Hva kan du fortelle meg om bedriftskulturen?",
              "Hva liker du best med å jobbe her?",
              "Hvilke utfordringer bør jeg forvente i denne stillingen?",
              "Hva er neste steg i prosessen?",
            ].map((q, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                <MessageSquare size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">{q}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-muted/10 border border-border/10">
            <p className="text-xs text-muted-foreground">
              <strong>Tips:</strong> Ikke spør om lønn i første intervju. La arbeidsgiver ta opp det temaet på riktig tidspunkt i prosessen.
            </p>
          </div>
        </motion.section>

        {/* Etter intervjuet */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <RotateCcw className="text-secondary" size={20} />
            </div>
            <h2 className="text-xl font-bold">Etter intervjuet</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-base">Ta kontakt</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send gjerne en kort, personlig takk til den som intervjuet deg. Fortell nok en gang hvor interessert du er i stillingen.
                Hvis ingen nevnte tidslinje, kan du sende én oppfølgings-e-post etter ca. en uke.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-base">Reflekter</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Skriv ned hva som gikk bra og hva som kunne vært bedre. Spør deg selv:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Er det noe jeg ville gjort annerledes i klesstil, holdning eller kroppsspråk?",
                  "Hvilke spørsmål burde jeg svart annerledes på?",
                  "Hvordan fungerte heispitchen min?",
                  "Fikk jeg noen spørsmål jeg ikke var forberedt på?",
                  "Hadde jeg gjort nok research på forhånd?",
                ].map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-base">Flere intervjurunder?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Still like godt forberedt til hver runde. Gå gjennom refleksjonsnotatene dine og forbedre deg.
                Ha med referanser og kopier av vitnemål hvis det er aktuelt.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
        >
          <p className="text-lg font-semibold mb-2">Vi gleder oss til å møte deg! 🎉</p>
          <p className="text-sm text-muted-foreground">
            Husk – vi ønsker at du skal lykkes. Vær deg selv, pust rolig, og vis oss hvem du er.
          </p>
        </motion.div>
      </div>
    </div>
  </>
);

export default Intervjutips;