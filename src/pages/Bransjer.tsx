import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Globe, Building2, Landmark, Briefcase, Tractor, ShoppingCart,
  HardHat, Store, Heart, TrendingUp, Users, Zap, ChevronRight,
  Truck, Factory, Sparkles, Film, Dumbbell, GraduationCap, Scale,
  Palette, Megaphone, UserPlus, Plane, Car, Leaf,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const industries = [
  { icon: Globe, name: "Tech & SaaS", slug: "tech-saas", tagline: "Vi vokser i takt med deg", short: "Fra pre-revenue til scale-up. Vi forstår investorrunder, MRR-rapportering og alt mellom." },
  { icon: Building2, name: "Eiendom & Utvikling", slug: "eiendom", tagline: "Oversikt fra kjøp til salg", short: "Full kontroll over portefølje, skatt og likviditet — enten du har én eller hundre enheter." },
  { icon: Landmark, name: "Holding & Investering", slug: "holding", tagline: "Strukturen som beskytter deg", short: "Konsernregnskap, utbytte, kapitalforvaltning og skatteoptimalisering på tvers av selskaper." },
  { icon: Briefcase, name: "Consulting & Rådgivning", slug: "consulting", tagline: "Mer tid til det du er best på", short: "Prosjektøkonomi, fakturering og skatteplanlegging for konsulenter og rådgivningsbyråer." },
  { icon: Tractor, name: "Landbruk", slug: "landbruk", tagline: "Vi kjenner gårdens rytme", short: "Jordbruksfradrag, produksjonstilskudd og sesongøkonomi — vi kjenner regelverket." },
  { icon: ShoppingCart, name: "Varehandel", slug: "varehandel", tagline: "Alltid kontroll på varene og pengene", short: "Lager, innkjøp, marginer og svinn — oversikt som hjelper deg å selge smartere." },
  { icon: HardHat, name: "Bygg & Anlegg", slug: "bygg-anlegg", tagline: "Vi holder orden mens du bygger", short: "Prosjektregnskap, anbudskalkylering og fakturering tilpasset byggebransjen." },
  { icon: Store, name: "Nettbutikk & E-commerce", slug: "nettbutikk", tagline: "Skalér trygt — vi har ryggen din", short: "MVA på tvers av landegrenser, betalingsplattformer og automatisert ordreøkonomi." },
  { icon: Heart, name: "Helse & Velvære", slug: "helse", tagline: "Fokuser på menneskene du hjelper", short: "Klinikker, treningssentre og helseforetak — vi tar det administrative mens du hjelper." },
  { icon: TrendingUp, name: "Restaurant & Uteliv", slug: "restaurant", tagline: "Vi hjelper deg å holde hjulene i gang", short: "Tynne marginer og hektisk drift krever presis økonomi. Vi gir deg oversikten." },
  { icon: Users, name: "Frisør & Skjønnhet", slug: "frisor", tagline: "Mer tid bak stolen, ikke ved skrivebordet", short: "Enkel og oversiktlig økonomi for salonger, uansett om du er solo eller team." },
  { icon: Zap, name: "Håndverkere & Fagfolk", slug: "handverkere", tagline: "Fagmann på jobb, vi tar resten", short: "Elektrikere, rørleggere, malere og tømrere — vi holder orden mens du er ute hos kunder." },
  { icon: Truck, name: "Transport & Logistikk", slug: "transport", tagline: "Vi holder oversikt mens du holder hjulene i gang", short: "Flåtestyring, drivstoffkostnader og sjåførlønn — full kontroll per kjøretøy og rute." },
  { icon: Factory, name: "Industri & Produksjon", slug: "industri", tagline: "Orden i regnskapet gir orden i produksjonen", short: "Varekostberegning, lagerstyring og SkatteFUNN — vi forstår produksjonsøkonomien." },
  { icon: Sparkles, name: "Renhold & Facility", slug: "renhold", tagline: "Rene tall for ren drift", short: "Mange ansatte og stramme marginer krever presist regnskap. Vi gir deg kontroll per kontrakt." },
  { icon: Film, name: "Kultur, Media & Underholdning", slug: "kultur", tagline: "Kreativiteten er din — økonomien er vår", short: "Prosjektbasert økonomi, tilskudd og rettigheter — vi holder orden bak kulissene." },
  { icon: Dumbbell, name: "Sport & Fritid", slug: "sport", tagline: "Fokus på trening — vi tar tallene", short: "Medlemsøkonomi, sesongsvingninger og PT-inntekter — full oversikt for treningsbransjen." },
  { icon: GraduationCap, name: "Utdanning & Kurs", slug: "utdanning", tagline: "Du lærer bort — vi holder orden", short: "Kursarrangører og e-læringsplattformer — vi navigerer MVA-fritak og tilskudd for deg." },
  { icon: Scale, name: "Juridisk & Advokat", slug: "juridisk", tagline: "Du håndterer juss — vi håndterer regnskapet", short: "Klientmidler, timeregistrering og partnerkompensasjon — presist og compliant." },
  { icon: Palette, name: "Arkitektur & Design", slug: "arkitektur", tagline: "Du tegner fremtiden — vi holder orden", short: "Prosjektregnskap og lønnsomhetsanalyser per oppdrag for kreative bransjer." },
  { icon: Megaphone, name: "Markedsføring & Reklame", slug: "markedsforing", tagline: "Du bygger merkevarer — vi bygger bunnlinjen", short: "Kundelønnsomhet, mediaspend og frilanserhonorarer — byråregnskap som gir oversikt." },
  { icon: UserPlus, name: "Bemanning & Rekruttering", slug: "bemanning", tagline: "Du finner folkene — vi ordner tallene", short: "Margin per utleid person, kompleks lønnskjøring og likviditetsstyring ved vekst." },
  { icon: Plane, name: "Reiseliv & Turisme", slug: "reiseliv", tagline: "Vi styrer økonomien — du skaper opplevelsene", short: "Sesongplanlegging, ulike MVA-satser og bookingplattformer — full kontroll for reiseliv." },
  { icon: Car, name: "Bil & Verksted", slug: "bil", tagline: "Du fikser bilene — vi fikser regnskapet", short: "Varelager, timesatskalkyle og arbeidsordreanalyse for verksteder og bilbransjen." },
  { icon: Leaf, name: "Energi & Miljø", slug: "energi", tagline: "Bærekraftig økonomi for bærekraftige selskaper", short: "Investeringsanalyser, Enova-tilskudd og ESG-rapportering for fremtidens bransjer." },
];

const Bransjer = () => (
  <>
    {/* HERO */}
    <section className="py-28 md:py-44 relative overflow-hidden">
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5 md:mb-6">
            Avargo · Bransjer
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Vi kjenner bransjen din.{" "}
            <span className="italic text-gradient-rose">Ikke bare tallene.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-5 md:mb-6">
            Uansett hvilken bransje du er i, møter du noen hos oss som forstår hverdagen din — sesongsvingninger, bransjespesifikke skatteregler, og utfordringene du faktisk møter i driften.
          </p>
          <p className="text-sm text-primary/60 italic font-light mb-10 md:mb-14">
            {industries.length} spesialiserte bransjeområder. Én dedikert regnskapsfører som kjenner din.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/kontakt"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Finn din bransjeekspert
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link
              to="/tjenester"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500"
            >
              Se alle tjenester
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

    {/* INDUSTRY GRID */}
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Spesialisering</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 md:mb-6 max-w-3xl leading-snug">
            Velg din bransje og se{" "}
            <span className="italic text-gradient-teal">hva vi kan gjøre for deg.</span>
          </h2>
          <p className="text-muted-foreground font-light text-sm md:text-base mb-14 md:mb-20 max-w-xl">
            Klikk på bransjen din for å se spesifikk informasjon om hva vi leverer, hvilke regler som gjelder, og hva kundene i din bransje vanligvis oppdager hos oss.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {industries.map((ind, i) => (
            <AnimatedSection key={ind.slug} delay={i * 0.05}>
              <Link
                to={`/bransjer/${ind.slug}`}
                className="group p-7 md:p-9 glass rounded-3xl card-lift relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center mb-5 md:mb-6 group-hover:from-primary/20 group-hover:to-secondary/15 transition-all duration-500">
                  <ind.icon size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl md:text-2xl mb-1.5">{ind.name}</h3>
                <p className="text-sm text-primary/60 italic mb-3 font-light">{ind.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed font-light flex-1">{ind.short}</p>
                <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-primary/60 group-hover:text-primary transition-colors duration-300 mt-5">
                  Les mer <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <div className="mt-10 md:mt-14 p-7 md:p-10 glass rounded-3xl text-center">
            <p className="text-muted-foreground font-light text-sm md:text-base">
              Er bransjen din ikke på listen?{" "}
              <span className="text-foreground">Vi tar på oss alle typer bedrifter.</span>{" "}
              <Link to="/kontakt" className="text-primary hover:underline underline-offset-4 transition-all">
                Ta kontakt
              </Link>{" "}
              — vi setter oss raskt inn i din hverdag.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* WHY SPECIALIZATION MATTERS */}
    <section className="py-24 md:py-40 border-y border-border/10 relative">
      <div className="absolute inset-0 ambient-glow opacity-15" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvorfor det betyr noe</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
            En regnskapsfører som kjenner bransjen gjør en{" "}
            <span className="italic text-gradient-rose">grunnleggende forskjell.</span>
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {[
            { num: "01", title: "Bransjespesifikke fradrag.", desc: "Hver bransje har egne skattefordeler, tilskudd og fradragsmuligheter. En regnskapsfører som ikke kjenner din bransje vil overse disse. Vi gjør ikke det." },
            { num: "02", title: "Regler du ikke kan gjette deg til.", desc: "Landbruksstøtte, MVA-unntak for helsetjenester, prosjektregnskap i bygg — dette er komplekst. Vi kjenner regelverket for din bransje og sikrer at du alltid er compliant." },
            { num: "03", title: "Innsikt som faktisk er relevant.", desc: "En generalist gir deg generelle råd. Vi gir deg innsikt basert på hva som faktisk gjelder for din bransje — og sammenlignet med andre i din bransje." },
          ].map((p, i) => (
            <AnimatedSection key={p.num} delay={i * 0.12}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <span className="font-heading text-5xl text-primary/20">{p.num}</span>
                <h3 className="font-heading text-xl md:text-2xl mt-5 mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{p.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 md:py-40 text-center relative">
      <div className="absolute inset-0 ambient-glow opacity-25" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-6 md:mb-8">Kom i gang</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 leading-snug max-w-3xl mx-auto">
            Finn en regnskapsfører som{" "}
            <span className="italic text-gradient-rose">kjenner din verden.</span>
          </h2>
          <p className="text-muted-foreground font-light mb-10 md:mb-14 max-w-lg mx-auto text-sm md:text-base">
            Én samtale er nok til å matche deg med riktig person. Gratis, uforpliktende og raskt.
          </p>
          <Link
            to="/kontakt"
            className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
          >
            Book en gjennomgang
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default Bransjer;
