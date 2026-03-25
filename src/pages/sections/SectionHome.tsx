import { useState, useEffect, useCallback } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, TrendingUp, Shield, Zap, Globe, Building2, Briefcase, Landmark,
  Tractor, ShoppingCart, HardHat, Heart, Store, Users,
  Sparkles, Eye, PiggyBank, Handshake, Gem, Flame, Crown, Target,
  ChevronDown, Award, Clock, CheckCircle2,
  FileText, Scale, BarChart3, Calculator, ClipboardList,
  UserCheck, BookOpen, HeartHandshake, GraduationCap, Megaphone,
  Search, Share2, Palette, Video, Mail,
  Code, Bot, Cpu, Database, Layers, Monitor, type LucideIcon,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import TaxDeadlineWidget from "@/components/TaxDeadlineWidget";
import MetodenSection from "@/components/MetodenSection";
import { SECTIONS, SECTION_LIST, type SectionId } from "@/contexts/SectionContext";
import heroBg from "@/assets/hero-bg.jpg";

const serviceBgPaths = [
  () => import("@/assets/service-bg-1.jpg"),
  () => import("@/assets/service-bg-2.jpg"),
  () => import("@/assets/service-bg-3.jpg"),
  () => import("@/assets/service-bg-4.jpg"),
  () => import("@/assets/service-bg-5.jpg"),
];

const useServiceBg = (index: number) => {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    serviceBgPaths[index % serviceBgPaths.length]().then(mod => setSrc(mod.default));
  }, [index]);
  return src;
};

/* ——————————————————————————————————
   SECTION-SPECIFIC CONTENT
   —————————————————————————————————— */

interface SectionHomeContent {
  hero: { tagline: string; h1: React.ReactNode; sub: string; priceLine: string; ctaPrimary: string; ctaSecondary: string; ctaSecondaryHref: string };
  socialProof: { icon: LucideIcon; value: string; label: string; sub: string }[];
  hookSlides: { heading: React.ReactNode; body: string; tagline: string }[];
  services: { icon: LucideIcon; title: string; desc: string; href: string }[];
  industries: { icon: LucideIcon; name: string; slug: string; tagline: string; desc: string }[];
  conviction: { headline: React.ReactNode; items: { icon: LucideIcon; metric: string; label: string; text: string }[] };
  cta: { tag: string; headline: React.ReactNode; sub: string; italic: string; button: string };
  faq: { q: string; a: string }[];
  marqueeLabel: string;
}

const sectionHomeContent: Record<SectionId, SectionHomeContent> = {
  /* ═══════════════ REGNSKAP ═══════════════ */
  regnskap: {
    hero: {
      tagline: "For små og mellomstore bedrifter som ønsker trygghet",
      h1: <>Regnskapet ditt<br /><span className="text-gradient-rose italic">fortjener bedre.</span></>,
      sub: "Du får en fast, statsautorisert regnskapsfører som kjenner selskapet ditt — støttet av et helt team som tar seg av regnskap, rådgivning og det du ikke har tid til selv. Alt inkludert. Ingen overraskelser.",
      priceLine: "Fra 1 499 kr/mnd for nyoppstartede selskaper.",
      ctaPrimary: "Få et uforpliktende tilbud",
      ctaSecondary: "Slik jobber vi",
      ctaSecondaryHref: "#metoden",
    },
    socialProof: [
      { icon: Award, value: "Godkjent", label: "regnskapsførerselskap", sub: "Finanstilsynet" },
      { icon: Users, value: "25+", label: "bransjer dekket", sub: "Hele Norge" },
      { icon: Clock, value: "24 timer", label: "garantert svar", sub: "Rask respons" },
      { icon: CheckCircle2, value: "100%", label: "fast pris", sub: "Ingen skjulte kostnader" },
    ],
    hookSlides: [
      { heading: <>Store selskaper har hele økonomiavdelinger.{" "}<span className="italic text-gradient-teal">Nå har du det også.</span></>, body: "Regnskapsfører, skatterådgiver og CFO — det er teamet store selskaper bygger internt for millioner. Hos Avargo får du det samme, dedikert til ditt selskap, til en brøkdel av prisen.", tagline: "Bygget for bedrifter som fortjener mer enn bare bokføring." },
      { heading: <>Du startet bedriften for å bygge noe.{" "}<span className="italic text-gradient-teal">Ikke for å sitte med bilag.</span></>, body: "De fleste bedriftseiere bruker timer hver uke på fakturering, rapporter og frister. Med Avargo overlater du alt det til noen som faktisk brenner for det.", tagline: "Vi finnes for at du skal slippe å gjøre alt selv." },
      { heading: <>Samme trygghet som de store.{" "}<span className="italic text-gradient-teal">Uten byråkratiet.</span></>, body: "Storkonsern har egne økonomiavdelinger og rådgivere. Du har Avargo. Samme kompetanse, samme tilgjengelighet — men uten faste ansatte og millionbudsjetter.", tagline: "Laget for bedrifter som tenker stort — uansett størrelse." },
    ],
    services: [
      { icon: Handshake, title: "Dedikert regnskapsfører", desc: "Du får én fast person som kjenner selskapet ditt godt. Svar innen 24 timer.", href: "/regnskap/tjenester/regnskapsforer" },
      { icon: Gem, title: "Alt inkludert i regnskapet", desc: "Bokføring, årsregnskap, skattemelding, MVA-rapportering og aksjonærregisteroppgave. Ingenting er «ekstra».", href: "/regnskap/tjenester/1-1-regnskap" },
      { icon: Users, title: "Lønn & Personal", desc: "Full lønnskjøring, feriepenger, A-melding og arbeidsgiveravgift — inkludert i fastprisen.", href: "/regnskap/tjenester/lonn" },
      { icon: PiggyBank, title: "Skatteoptimalisering", desc: "Kvartalsvis gjennomgang av skatteposisjonen din. Vi finner fradragene du ikke visste om.", href: "/regnskap/tjenester/cfo" },
      { icon: Sparkles, title: "AI-drevet innsikt", desc: "Vi bruker AI til å oppdage fradrag, risiko og muligheter du ikke ser selv.", href: "/regnskap/tjenester/ai-innsikt" },
      { icon: BarChart3, title: "Rapportering & dashboards", desc: "Månedlig resultat, likviditetsoversikt og prognoser — levert til deg automatisk.", href: "/regnskap/tjenester/dashboard" },
      { icon: Crown, title: "Rådgivning inkludert", desc: "Utbytte, kapitalforhøyelse, fusjoner — spør oss om hva som helst. Rådgivning er standard.", href: "/regnskap/tjenester/cfo" },
      { icon: Calculator, title: "MVA & rapportering", desc: "Vi håndterer alle MVA-oppgaver, termin for termin, med full kontroll og dokumentasjon.", href: "/regnskap/tjenester/regnskapsforer" },
      { icon: Target, title: "Frister? Vårt ansvar.", desc: "MVA-frist, skattemelding, årsregnskap — vi leverer alt i tide, hver gang.", href: "/regnskap/tjenester/regnskapsforer" },
    ],
    industries: [
      { icon: Globe, name: "Tech & SaaS", slug: "tech-saas", tagline: "Vi vokser i takt med deg", desc: "Startups og tech-selskaper trenger en regnskapsfører som forstår vekst, investorer og SaaS-modeller." },
      { icon: Building2, name: "Eiendom", slug: "eiendom", tagline: "Oversikt fra kjøp til salg", desc: "Full kontroll over eiendomsporteføljen — hva du tjener, hva det koster, og hvordan du kan gjøre det smartere." },
      { icon: Landmark, name: "Holding", slug: "holding", tagline: "Strukturen som beskytter", desc: "Vi hjelper deg å bygge en ryddig og trygg struktur for aksjer, eiendom og investeringer." },
      { icon: Briefcase, name: "Consulting", slug: "consulting", tagline: "Mer tid til det du er best på", desc: "Vi tar oss av det administrative, slik at du kan bruke tiden på kundene dine." },
      { icon: HardHat, name: "Bygg & Anlegg", slug: "bygg-anlegg", tagline: "Vi holder orden", desc: "God oversikt over hvert prosjekt, slik at du alltid vet om du tjener penger." },
      { icon: Tractor, name: "Landbruk", slug: "landbruk", tagline: "Vi kjenner gårdens rytme", desc: "Sesongsvingninger, støtteordninger og maskinpark — vi sørger for at du aldri går glipp av noe." },
      { icon: Store, name: "Nettbutikk", slug: "nettbutikk", tagline: "Skalér trygt", desc: "Styr på inntekter, avgifter og kostnader — uansett om du selger til Norge eller utlandet." },
      { icon: Heart, name: "Helse", slug: "helse", tagline: "Fokuser på menneskene", desc: "Vi ordner det økonomiske i bakgrunnen mens du gir full oppmerksomhet til dem du er der for." },
      { icon: TrendingUp, name: "Restaurant", slug: "restaurant", tagline: "Hjulene i gang", desc: "God oversikt over driften slik at du kan ta bedre beslutninger." },
    ],
    conviction: {
      headline: <>De fleste betaler for mye.{" "}<span className="italic text-gradient-rose">Og får for lite tilbake.</span></>,
      items: [
        { icon: Shield, metric: "100%", label: "fastpris — ingen tillegg", text: "Bokføring, MVA, lønn, årsregnskap, skattemelding og rådgivning inkludert i én fast månedspris. Ingen timefakturering." },
        { icon: Handshake, metric: "1 person", label: "din statsautoriserte regnskapsfører", text: "Du får én navngitt, statsautorisert regnskapsfører som lærer seg selskapet ditt, bransjen din og målene dine." },
        { icon: Sparkles, metric: "25+", label: "bransjer vi dekker", text: "Uansett om du driver restaurant, eiendom, tech eller bygg — regnskapsføreren din forstår bransjen." },
        { icon: Zap, metric: "24 timer", label: "svar — alltid", text: "Når du sender en melding eller ringer, svarer vi innen 24 timer. Alltid." },
      ],
    },
    cta: {
      tag: "Uforpliktende gjennomgang",
      headline: <>Usikker på om du får nok <span className="italic text-gradient-rose">tilbake fra regnskapsføreren din?</span></>,
      sub: "Vi gjennomgår regnskapet ditt gratis og viser deg konkret hva du kan spare — på skatt, kostnader og tid.",
      italic: "Helt uforpliktende. Ingen binding. Bare en god samtale.",
      button: "Bestill din gratis gjennomgang",
    },
    faq: [
      { q: "Hva koster en regnskapsfører hos Avargo?", a: "Vi opererer med faste månedspriser uten skjulte kostnader. Alt fra bokføring, MVA, lønn, årsregnskap og skattemelding er inkludert." },
      { q: "Er regnskapsførerne deres statsautoriserte?", a: "Ja, alle våre regnskapsførere er statsautoriserte og godkjent av Finanstilsynet." },
      { q: "Kan jeg bytte regnskapsfører midt i året?", a: "Absolutt. Vi håndterer hele overgangen for deg — inkludert kontakt med din nåværende regnskapsfører." },
      { q: "Hvor lang er bindingstiden?", a: "Vi har ingen bindingstid. Du kan si opp når som helst med én måneds varsel." },
      { q: "Dekker dere min bransje?", a: "Vi dekker over 25 bransjer — fra tech og SaaS til bygg, restaurant, eiendom og landbruk." },
      { q: "Hva skiller Avargo fra andre regnskapsbyråer?", a: "Du får én dedikert regnskapsfører, støttet av et helt team. Alt inkludert i fastprisen — ingen tillegg for rådgivning." },
    ],
    marqueeLabel: "Regnskap & Økonomi",
  },

  /* ═══════════════ HR ═══════════════ */
  hr: {
    hero: {
      tagline: "For bedrifter som vil ta vare på sine ansatte — riktig",
      h1: <>Menneskene dine<br /><span className="text-gradient-rose italic">fortjener en trygg arbeidsgiver.</span></>,
      sub: "Du får en dedikert HR-rådgiver som tar seg av lønn, kontrakter, arbeidsrett og alt det personaladministrative — slik at du kan fokusere på teamet og kundene dine.",
      priceLine: "Fra 2 990 kr/mnd for bedrifter med opptil 5 ansatte.",
      ctaPrimary: "Snakk med en HR-rådgiver",
      ctaSecondary: "Se hva vi tilbyr",
      ctaSecondaryHref: "/hr/tjenester",
    },
    socialProof: [
      { icon: UserCheck, value: "Spesialisert", label: "HR-rådgivning", sub: "Norsk arbeidsrett" },
      { icon: Users, value: "25+", label: "bransjer dekket", sub: "Hele Norge" },
      { icon: Clock, value: "24 timer", label: "garantert svar", sub: "Rask respons" },
      { icon: Shield, value: "Trygt", label: "lønn og personal", sub: "Alt inkludert" },
    ],
    hookSlides: [
      { heading: <>Store selskaper har egne HR-avdelinger.{" "}<span className="italic text-gradient-teal">Nå har du det også.</span></>, body: "HR-sjef, lønnsansvarlig og arbeidsrettsjurist — det er teamet store selskaper bygger internt. Hos Avargo får du det samme, dedikert til din bedrift, til en brøkdel av prisen.", tagline: "Bygget for arbeidsgivere som vil gjøre det riktig." },
      { heading: <>Du ansatte folk for å bygge noe.{" "}<span className="italic text-gradient-teal">Ikke for å drukne i kontrakter.</span></>, body: "De fleste arbeidsgivere bruker timer på lønnsspørsmål, HMS-dokumentasjon og personalproblemer. Med Avargo overlater du det til noen som lever for det.", tagline: "Vi tar HR-byrden — du tar vare på menneskene." },
      { heading: <>Samme trygghet som store arbeidsgivere.{" "}<span className="italic text-gradient-teal">Uten egen HR-avdeling.</span></>, body: "Storkonsern har HR-sjefer og advokater på kontoret. Du har Avargo. Samme kompetanse, samme tilgjengelighet — uten faste ansatte.", tagline: "Laget for arbeidsgivere som bryr seg — uansett størrelse." },
    ],
    services: [
      { icon: ClipboardList, title: "Full lønnskjøring", desc: "Lønn, feriepenger, sykepenger, A-melding og arbeidsgiveravgift. Alt på plass, hver måned.", href: "/hr/tjenester/lonn" },
      { icon: FileText, title: "Arbeidskontrakter", desc: "Skreddersydde kontrakter som følger norsk lov — tilpasset din bedrift og bransje.", href: "/hr/tjenester/ansettelse" },
      { icon: BookOpen, title: "Personalhåndbok", desc: "Komplett håndbok tilpasset din bedrift, klar til bruk fra dag én.", href: "/hr/tjenester/personalhandbok" },
      { icon: Scale, title: "Arbeidsrett & HMS", desc: "Vi hjelper deg med reglene, dokumentasjonen og de vanskelige sakene.", href: "/hr/tjenester/arbeidsrett" },
      { icon: UserCheck, title: "Rekruttering", desc: "Fra stillingsannonse til signert kontrakt — vi tar hele prosessen.", href: "/hr/tjenester/ansettelse" },
      { icon: HeartHandshake, title: "Sykefraværsoppfølging", desc: "Strukturert oppfølging av sykmeldte med dokumentasjon og tilrettelegging.", href: "/hr/tjenester/hr-og-lonn" },
      { icon: GraduationCap, title: "HR-kurs", desc: "Opplæring for ledere i arbeidsrett, vanskelige samtaler og personalledelse.", href: "/hr/tjenester/hr-kurs" },
      { icon: Shield, title: "Varslingsrutiner", desc: "Lovpålagte varslingskanaler og rutiner — satt opp riktig og dokumentert.", href: "/hr/tjenester/arbeidsrett" },
      { icon: Users, title: "Medarbeidersamtaler", desc: "Maler, prosesser og oppfølging for effektive og dokumenterte samtaler.", href: "/hr/tjenester/hr-og-lonn" },
    ],
    industries: [
      { icon: HardHat, name: "Bygg & Anlegg", slug: "bygg-anlegg", tagline: "Trygg arbeidsgiver på byggeplassen", desc: "Skiftarbeid, HMS-krav og innleie — vi sørger for at alt er i henhold til loven." },
      { icon: Heart, name: "Helse & Velvære", slug: "helse", tagline: "Omsorg for de som gir omsorg", desc: "Turnus, overtid og spesialkrav — vi tar personaladministrasjonen for helsebransjen." },
      { icon: TrendingUp, name: "Restaurant & Uteliv", slug: "restaurant", tagline: "Riktig bemanning, alltid", desc: "Deltid, tips, overtid og sesongarbeid — vi holder orden på alt." },
      { icon: ShoppingCart, name: "Varehandel", slug: "varehandel", tagline: "Butikkansatte trygt ivaretatt", desc: "Deltidskontrakter, helgearbeid og ferieplanlegging gjort riktig." },
      { icon: Briefcase, name: "Consulting", slug: "consulting", tagline: "Struktur for kunnskapsbedrifter", desc: "Bonusordninger, IP-klausuler og konkurranseforbud — vi tar de viktige detaljene." },
      { icon: Globe, name: "Tech & SaaS", slug: "tech-saas", tagline: "HR for vekstselskaper", desc: "Opsjonsavtaler, remote-arbeid og raske ansettelser — vi holder tritt med veksten." },
      { icon: Users, name: "Frisør & Skjønnhet", slug: "frisor", tagline: "Stol-leie eller ansatt?", desc: "Vi hjelper deg med den riktige modellen og kontraktene som beskytter begge parter." },
      { icon: Zap, name: "Håndverkere", slug: "handverkere", tagline: "Trygg arbeidsgiver i felten", desc: "Lærlingeordninger, HMS og tariff — vi sørger for at du oppfyller alle krav." },
      { icon: Store, name: "Nettbutikk", slug: "nettbutikk", tagline: "Skalering med riktig team", desc: "Fra enmannsforetak til lagerteam — vi tar personaladministrasjonen i takt med veksten." },
    ],
    conviction: {
      headline: <>De fleste arbeidsgivere gjetter.{" "}<span className="italic text-gradient-rose">Det koster mer enn du tror.</span></>,
      items: [
        { icon: Shield, metric: "Trygt", label: "arbeidsrett dekket", text: "Vi sørger for at du følger alle lover og regler — fra kontrakter til oppsigelser. Du slipper risikoen." },
        { icon: Handshake, metric: "1 person", label: "din faste HR-rådgiver", text: "Du får én navngitt HR-rådgiver som kjenner bedriften din, bransjen din og de ansatte." },
        { icon: Sparkles, metric: "Alt inkl.", label: "lønn, rett og håndbok", text: "Lønnskjøring, arbeidskontrakter, personalhåndbok og HMS — alt er inkludert i fastprisen." },
        { icon: Zap, metric: "24 timer", label: "svar — alltid", text: "Står du i en vanskelig personalsak? Vi svarer innen 24 timer. Alltid." },
      ],
    },
    cta: {
      tag: "Uforpliktende HR-gjennomgang",
      headline: <>Usikker på om du gjør HR <span className="italic text-gradient-rose">riktig som arbeidsgiver?</span></>,
      sub: "Vi gjennomgår personalrutinene dine gratis og viser deg hva som mangler — og hva som kan bli bedre.",
      italic: "Helt uforpliktende. Ingen binding. Bare tryggere HR.",
      button: "Bestill din gratis gjennomgang",
    },
    faq: [
      { q: "Hva koster HR-tjenestene?", a: "Vi har faste månedspriser fra 2 990 kr/mnd. Alt fra lønnskjøring, kontrakter og personalhåndbok er inkludert." },
      { q: "Hva inkluderer lønnskjøringen?", a: "Full lønnskjøring med feriepenger, sykepenger, A-melding, arbeidsgiveravgift og skattetrekk." },
      { q: "Hjelper dere med oppsigelser?", a: "Ja. Vi bistår med hele prosessen — fra drøftingsmøte til oppsigelsesdokumentasjon — i tråd med arbeidsmiljøloven." },
      { q: "Trenger vi personalhåndbok?", a: "Ja, alle bedrifter med ansatte bør ha en. Det gir trygghet for både arbeidsgiver og ansatt." },
      { q: "Dekker dere min bransje?", a: "Vi dekker over 25 bransjer og tilpasser HR-opplegget til din bransjes krav og utfordringer." },
      { q: "Hva skiller Avargo HR fra andre?", a: "Du får én fast HR-rådgiver som kjenner bedriften din — ikke et callsenter. Alt inkludert i fastpris." },
    ],
    marqueeLabel: "HR & Personal",
  },

  /* ═══════════════ MARKED ═══════════════ */
  markedsforing: {
    hero: {
      tagline: "For bedrifter som vil vokse — synlig og målbart",
      h1: <>Synligheten din<br /><span className="text-gradient-rose italic">fortjener en strategi.</span></>,
      sub: "Du får en dedikert markedsfører som kobler SEO, annonsering og innhold direkte til de faktiske tallene dine. Slik at du vet hva som fungerer — og hva som ikke gjør det.",
      priceLine: "Fra 4 990 kr/mnd for bedrifter som vil bli synlige.",
      ctaPrimary: "Snakk med en markedsfører",
      ctaSecondary: "Se hva vi tilbyr",
      ctaSecondaryHref: "/markedsforing/tjenester",
    },
    socialProof: [
      { icon: TrendingUp, value: "Datadrevet", label: "markedsføring", sub: "Koblet til regnskap" },
      { icon: Eye, value: "Full", label: "synlighet", sub: "Google & SoMe" },
      { icon: Clock, value: "24 timer", label: "garantert svar", sub: "Rask respons" },
      { icon: CheckCircle2, value: "100%", label: "fast pris", sub: "Ingen timefakturering" },
    ],
    hookSlides: [
      { heading: <>Store selskaper har egne markedsavdelinger.{" "}<span className="italic text-gradient-teal">Nå har du det også.</span></>, body: "Markedssjef, SEO-spesialist og annonsør — det er teamet store selskaper har internt. Hos Avargo får du det samme, dedikert til din bedrift.", tagline: "Bygget for bedrifter som vil vokse med kontroll." },
      { heading: <>Du startet bedriften for å bygge noe.{" "}<span className="italic text-gradient-teal">Ikke for å gjette på annonser.</span></>, body: "De fleste bedrifter kaster penger på markedsføring uten å vite hva som fungerer. Med Avargo ser du nøyaktig hva som gir resultater — koblet til regnskapet.", tagline: "Datadrevet markedsføring — ingen gjetning." },
      { heading: <>Samme synlighet som de store.{" "}<span className="italic text-gradient-teal">Uten milliardbudsjettet.</span></>, body: "Store merkevarer har egne markedsteam. Du har Avargo. Samme strategi, samme verktøy — uten faste ansatte og byråhonorarer.", tagline: "Laget for bedrifter som tenker stort." },
    ],
    services: [
      { icon: Search, title: "SEO & søkbarhet", desc: "Bli funnet på Google når kundene dine søker etter det du tilbyr — helt organisk.", href: "/markedsforing/tjenester/seo" },
      { icon: Target, title: "Google Ads", desc: "Målrettede annonser som treffer riktig — med full kontroll på budsjettet.", href: "/markedsforing/tjenester/google-ads" },
      { icon: Share2, title: "Meta & SoMe-annonsering", desc: "Facebook og Instagram-annonser som bygger merkevare og driver konvertering.", href: "/markedsforing/tjenester/meta-annonser" },
      { icon: ShoppingCart, title: "Nettbutikk", desc: "Moderne butikk som selger — med betaling, frakt og lager.", href: "/markedsforing/tjenester/nettbutikk" },
      { icon: Palette, title: "Nettsider", desc: "Konverterende nettsider som bygger tillit og driver leads.", href: "/markedsforing/tjenester/nettsider" },
      { icon: Mail, title: "E-postmarkedsføring", desc: "Automatiserte kampanjer som pleier leads og driver gjenkjøp.", href: "/markedsforing/tjenester/ai-automatisering" },
      { icon: BarChart3, title: "Datadrevet rapportering", desc: "Hver krone spores fra klikk til kundeforhold — koblet til regnskapet.", href: "/markedsforing/tjenester/dashboard" },
      { icon: Video, title: "Innholdsproduksjon", desc: "Tekst, bilder og video som engasjerer målgruppen din og bygger autoritet.", href: "/markedsforing/tjenester/nettsider" },
      { icon: Megaphone, title: "Strategi & rådgivning", desc: "Helhetlig vekststrategi tilpasset din bransje, dine mål og ditt budsjett.", href: "/markedsforing/tjenester/google-ads" },
    ],
    industries: [
      { icon: Store, name: "Nettbutikk", slug: "nettbutikk", tagline: "Synlig i et hav av konkurrenter", desc: "SEO, Google Shopping og sosiale medier — vi driver trafikk som konverterer til salg." },
      { icon: Heart, name: "Helse & Velvære", slug: "helse", tagline: "Fylt timebok, alltid", desc: "Lokal SEO, Google Ads og sosiale medier som fyller kalenderen din med nye kunder." },
      { icon: TrendingUp, name: "Restaurant", slug: "restaurant", tagline: "Fulle bord, hver kveld", desc: "Google Maps, lokal synlighet og sosiale medier som gjør deg til førstevalget." },
      { icon: Briefcase, name: "Consulting", slug: "consulting", tagline: "Thought leadership som selger", desc: "LinkedIn, innholdsstrategi og SEO som posisjonerer deg som eksperten i bransjen." },
      { icon: Building2, name: "Eiendom", slug: "eiendom", tagline: "Synlighet som selger eiendommer", desc: "Målrettede annonser og lokal SEO som finner kjøperne for deg." },
      { icon: Users, name: "Frisør & Skjønnhet", slug: "frisor", tagline: "Lokal synlighet som fyller stolen", desc: "Google Maps, Instagram og booking-integrasjon som gir en jevn strøm av kunder." },
      { icon: HardHat, name: "Bygg & Anlegg", slug: "bygg-anlegg", tagline: "Synlig for de rette prosjektene", desc: "Lokal SEO og målrettede kampanjer som trekker inn riktige oppdrag." },
      { icon: Globe, name: "Tech & SaaS", slug: "tech-saas", tagline: "Vekst gjennom inbound", desc: "Content marketing, SEO og performance ads som skalerer sammen med produktet." },
      { icon: ShoppingCart, name: "Varehandel", slug: "varehandel", tagline: "Flere kunder i butikken", desc: "Lokal synlighet, Google Ads og sosiale medier som driver fottrafikk og netthandel." },
    ],
    conviction: {
      headline: <>De fleste kaster penger på markedsføring.{" "}<span className="italic text-gradient-rose">Uten å vite hva som fungerer.</span></>,
      items: [
        { icon: BarChart3, metric: "100%", label: "sporbart — fra klikk til kunde", text: "Hver krone du bruker på markedsføring spores helt til bunnlinjen. Du ser nøyaktig hva som gir resultater." },
        { icon: Handshake, metric: "1 person", label: "din dedikerte markedsfører", text: "Du får én navngitt markedsfører som kjenner bedriften, bransjen og målgruppen din." },
        { icon: Sparkles, metric: "Helhet", label: "SEO + Ads + innhold", text: "Vi kjører ikke bare annonser — vi bygger en helhetlig strategi som vokser over tid." },
        { icon: Zap, metric: "24 timer", label: "svar — alltid", text: "Trenger du en rask justering eller har et spørsmål? Vi svarer innen 24 timer." },
      ],
    },
    cta: {
      tag: "Uforpliktende synlighets-sjekk",
      headline: <>Usikker på om markedsføringen din <span className="italic text-gradient-rose">faktisk gir resultater?</span></>,
      sub: "Vi analyserer synligheten din gratis og viser deg konkret hva du kan gjøre for å nå flere kunder.",
      italic: "Helt uforpliktende. Ingen binding. Bare en god strategi.",
      button: "Bestill din gratis analyse",
    },
    faq: [
      { q: "Hva koster markedsføring hos Avargo?", a: "Vi har faste månedspriser fra 4 990 kr/mnd. Annonsebudsjett kommer i tillegg — du bestemmer selv hvor mye." },
      { q: "Inkluderer dere annonsebudsjett?", a: "Nei, annonsebudsjettet betaler du direkte til Google/Meta. Vi tar oss av alt det strategiske og operative." },
      { q: "Hvor raskt ser jeg resultater?", a: "Google Ads gir resultater fra dag én. SEO bygger seg opp over 3–6 måneder, men effekten varer." },
      { q: "Kan dere hjelpe med nettside også?", a: "Absolutt. Vi bygger konverterende nettsider som er optimalisert for søkemotorer fra dag én." },
      { q: "Dekker dere min bransje?", a: "Vi dekker over 25 bransjer og tilpasser strategien til din bransjes utfordringer og muligheter." },
      { q: "Hva skiller Avargo fra andre byråer?", a: "Vi kobler markedsføringen til regnskapet, slik at du ser den faktiske ROI-en — ikke bare klikk og visninger." },
    ],
    marqueeLabel: "Markedsføring & Vekst",
  },

  /* ═══════════════ IT ═══════════════ */
  it: {
    hero: {
      tagline: "For bedrifter som vil digitalisere — med fornuft",
      h1: <>Teknologien din<br /><span className="text-gradient-rose italic">fortjener å fungere.</span></>,
      sub: "Du får et dedikert utviklerteam som bygger nettsider, systemer og AI-løsninger tilpasset din bedrift — ikke hyllevare. Pragmatisk teknologi som faktisk sparer deg tid og penger.",
      priceLine: "Nettside fra 14 900 kr. Løpende drift fra 6 500 kr/mnd.",
      ctaPrimary: "Snakk med en IT-rådgiver",
      ctaSecondary: "Se hva vi bygger",
      ctaSecondaryHref: "/it/tjenester",
    },
    socialProof: [
      { icon: Code, value: "Skreddersydd", label: "utvikling", sub: "Ingen hyllevare" },
      { icon: Bot, value: "AI", label: "integrert", sub: "Chatbot & automatisering" },
      { icon: Clock, value: "24 timer", label: "garantert svar", sub: "Rask respons" },
      { icon: CheckCircle2, value: "Fast pris", label: "ingen timefakturering", sub: "Forutsigbart" },
    ],
    hookSlides: [
      { heading: <>Store selskaper har egne IT-avdelinger.{" "}<span className="italic text-gradient-teal">Nå har du det også.</span></>, body: "CTO, utviklere og IT-support — det er teamet store selskaper bygger internt. Hos Avargo får du det samme, dedikert til din bedrift, til en brøkdel av prisen.", tagline: "Bygget for bedrifter som vil digitalisere med fornuft." },
      { heading: <>Du startet bedriften for å bygge noe.{" "}<span className="italic text-gradient-teal">Ikke for å slite med systemer.</span></>, body: "De fleste bedriftseiere bruker timer på tekniske problemer, manglende integrasjoner og utdaterte nettsider. Med Avargo bygger vi alt du trenger — og holder det oppdatert.", tagline: "Vi bygger teknologi som forenkler — ikke kompliserer." },
      { heading: <>Samme digitale muskler som de store.{" "}<span className="italic text-gradient-teal">Uten IT-budsjettet.</span></>, body: "Storkonsern har utviklerteam og egne systemer. Du har Avargo. Samme kvalitet, samme tilgjengelighet — uten faste ansatte og millioninvesteringer.", tagline: "Pragmatisk teknologi — bygget for din bedrift." },
    ],
    services: [
      { icon: Monitor, title: "Skreddersydde nettsider", desc: "Moderne, raske nettsider som gir resultater — designet og bygget for din bedrift.", href: "/it/tjenester/nettsider" },
      { icon: Bot, title: "AI-chatbot", desc: "Kundeservice 24/7 — uten at du trenger å ansette flere. Trent på ditt innhold.", href: "/it/tjenester/chatbot" },
      { icon: Cpu, title: "AI & automatisering", desc: "La maskiner gjøre de kjedelige oppgavene. Vi automatiserer prosessene dine.", href: "/it/tjenester/ai-automatisering" },
      { icon: Layers, title: "Interne systemer", desc: "Dashboards, kundeportaler og verktøy tilpasset akkurat din bedrift.", href: "/it/tjenester/internsystemer" },
      { icon: ShoppingCart, title: "Nettbutikk", desc: "Moderne butikk som selger — med betaling, frakt og lagerstyring.", href: "/it/tjenester/nettbutikk" },
      { icon: Database, title: "Integrasjoner", desc: "Vi kobler systemene dine sammen — regnskap, CRM, e-post og lagerstyring.", href: "/it/tjenester/ai-automatisering" },
      { icon: Search, title: "SEO-oppsett", desc: "Teknisk SEO-grunnlag slik at nettsiden din blir funnet på Google.", href: "/it/tjenester/seo" },
      { icon: Shield, title: "Sikkerhet & backup", desc: "Overvåking, oppdateringer og backup — vi holder systemene dine trygge.", href: "/it/tjenester/internsystemer" },
      { icon: BarChart3, title: "Dashboard & rapportering", desc: "Visualiser dataene dine med sanntids-dashboards tilpasset dine behov.", href: "/it/tjenester/dashboard" },
    ],
    industries: [
      { icon: Briefcase, name: "Consulting", slug: "consulting", tagline: "Digitale verktøy som imponerer", desc: "Kundeportaler, booking-systemer og automatisert rapportering for rådgivere." },
      { icon: TrendingUp, name: "Restaurant", slug: "restaurant", tagline: "Teknologi som serverer", desc: "Bordbestilling, meny-systemer og integrasjon med kasse og lager." },
      { icon: Heart, name: "Helse", slug: "helse", tagline: "Digitale løsninger for helse", desc: "Booking, journalsystemer og pasientkommunikasjon — trygt og effektivt." },
      { icon: Building2, name: "Eiendom", slug: "eiendom", tagline: "Porteføljestyring digitalisert", desc: "Dashboards for eiendomsforvaltning med oversikt over leie, vedlikehold og økonomi." },
      { icon: Store, name: "Nettbutikk", slug: "nettbutikk", tagline: "E-handel som skalerer", desc: "Moderne butikk-plattform med lagerstyring, betaling og integrasjon med regnskap." },
      { icon: HardHat, name: "Bygg & Anlegg", slug: "bygg-anlegg", tagline: "Prosjektstyring digitalisert", desc: "Systemer for timeføring, prosjektoppfølging og dokumenthåndtering." },
      { icon: ShoppingCart, name: "Varehandel", slug: "varehandel", tagline: "Omnichannel-løsninger", desc: "Kobling mellom fysisk butikk og netthandel med felles lagerstyring." },
      { icon: Users, name: "Frisør & Skjønnhet", slug: "frisor", tagline: "Alt i ett system", desc: "Booking, kundehistorikk og kassesystem — alt integrert i én løsning." },
      { icon: Tractor, name: "Landbruk", slug: "landbruk", tagline: "Gårdsdrift digitalisert", desc: "Oversikt over maskinpark, produksjon og økonomi i ett dashboard." },
    ],
    conviction: {
      headline: <>De fleste betaler for mye for teknologi.{" "}<span className="italic text-gradient-rose">Og får hyllevare tilbake.</span></>,
      items: [
        { icon: Code, metric: "Skreddersydd", label: "bygget for din bedrift", text: "Vi bygger løsninger som passer din bedrift — ikke en generisk mal alle andre også bruker." },
        { icon: Handshake, metric: "1 team", label: "ditt dedikerte utviklerteam", text: "Du får et navngitt team som kjenner systemene dine, bransjen din og behovene dine." },
        { icon: Sparkles, metric: "AI integrert", label: "smartere systemer", text: "Vi bygger inn AI og automatisering der det gir verdi — ikke for å være fancy, men for å spare deg tid." },
        { icon: Zap, metric: "24 timer", label: "support — alltid", text: "Trenger du hjelp med noe teknisk? Vi svarer innen 24 timer. Alltid." },
      ],
    },
    cta: {
      tag: "Uforpliktende teknologigjennomgang",
      headline: <>Usikker på om du får nok <span className="italic text-gradient-rose">verdi ut av teknologien din?</span></>,
      sub: "Vi gjennomgår den digitale infrastrukturen din gratis og viser deg hva som kan forenkles, automatiseres eller forbedres.",
      italic: "Helt uforpliktende. Ingen binding. Bare pragmatisk rådgivning.",
      button: "Bestill din gratis gjennomgang",
    },
    faq: [
      { q: "Hva koster en nettside?", a: "En skreddersydd nettside starter på 14 900 kr som engangssum. Vedlikehold og hosting er fra 990 kr/mnd." },
      { q: "Kan dere bygge hva som helst?", a: "Vi bygger nettsider, nettbutikker, interne systemer, dashboards, chatboter og automatiseringsløsninger." },
      { q: "Hvor lang tid tar et prosjekt?", a: "En nettside leveres typisk på 2–4 uker. Større systemer tar 4–12 uker, avhengig av kompleksitet." },
      { q: "Hvem drifter etter lansering?", a: "Vi tar oss av all drift, oppdateringer og support — alt inkludert i den løpende prisen." },
      { q: "Bruker dere AI?", a: "Ja, vi integrerer AI der det gir verdi — som chatboter, automatisering og datadrevet innsikt." },
      { q: "Hva skiller Avargo IT fra andre?", a: "Vi bygger pragmatiske løsninger til fast pris. Ingen timefakturering, ingen overraskelser — bare teknologi som fungerer." },
    ],
    marqueeLabel: "IT & Utvikling",
  },
};

/* ——————————————————————————————————
   SHARED COMPONENTS (mirroring Index.tsx)
   —————————————————————————————————— */

const FaqAccordion = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <span className="text-sm md:text-base text-foreground/90 font-light pr-4">{question}</span>
        <ChevronDown size={16} className={`text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="px-6 pb-5 text-sm text-foreground/60 font-light leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const StickyMobileCta = ({ label, to }: { label: string; to: string }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      setVisible(scrollY > winHeight * 0.6 && scrollY + winHeight < docHeight - 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/20 p-3 safe-area-bottom transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <Link to={to} className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose">
        {label} <ArrowRight size={14} />
      </Link>
    </div>
  );
};

/* ——————————————————————————————————
   MAIN COMPONENT
   —————————————————————————————————— */

const SectionHome = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? SECTIONS[sectionId as SectionId] : null;
  const sId = section?.id ?? "regnskap";
  const c = sectionHomeContent[sId];

  // All hooks must be before early return
  const [hookIndex, setHookIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [serviceAutoplay, setServiceAutoplay] = useState(true);
  const [serviceKey, setServiceKey] = useState(0);
  const serviceBgSrc = useServiceBg(activeService);
  const [industryPage, setIndustryPage] = useState(0);
  const industriesPerPage = 3;
  const totalPages = Math.ceil(c.industries.length / industriesPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setHookIndex((prev) => (prev + 1) % c.hookSlides.length);
      setFadeKey((prev) => prev + 1);
    }, 12000);
    return () => clearInterval(timer);
  }, [c.hookSlides.length]);

  useEffect(() => {
    if (!serviceAutoplay) return;
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % c.services.length);
      setServiceKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [serviceAutoplay, c.services.length]);

  const goToService = useCallback((index: number) => {
    setActiveService(index);
    setServiceKey((prev) => prev + 1);
    setServiceAutoplay(false);
    setTimeout(() => setServiceAutoplay(true), 15000);
  }, []);

  const nextService = useCallback(() => goToService((activeService + 1) % c.services.length), [activeService, c.services.length, goToService]);
  const prevService = useCallback(() => goToService((activeService - 1 + c.services.length) % c.services.length), [activeService, c.services.length, goToService]);

  useEffect(() => {
    const timer = setInterval(() => setIndustryPage((prev) => (prev + 1) % totalPages), 10000);
    return () => clearInterval(timer);
  }, [totalPages]);

  if (!section) return <Navigate to="/" replace />;

  const sp = (path: string) => `${section.basePath}${path}`;
  const otherSections = SECTION_LIST.filter((s) => s.id !== section.id);
  const slide = c.hookSlides[hookIndex];
  const current = c.services[activeService];
  const CurrentIcon = current.icon;
  const visibleIndustries = c.industries.slice(industryPage * industriesPerPage, industryPage * industriesPerPage + industriesPerPage);



  return (
    <>
      <Helmet>
        <title>{section.name} | Avargo</title>
        <meta name="description" content={section.description} />
        <link rel="canonical" href={`https://avargo.no${section.basePath}`} />
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-50" width={1920} height={1080} fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          <div className="absolute inset-0 ambient-glow" />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="hero-fade hero-delay-1 text-[11px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-foreground/60 mb-8 md:mb-12">
              {c.hero.tagline}
            </p>
            <h1 className="hero-fade hero-delay-2 font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.05] mb-6 md:mb-8">
              {c.hero.h1}
            </h1>
            <p className="hero-fade hero-delay-3 text-base md:text-lg text-foreground/70 max-w-xl mx-auto mb-5 md:mb-6 leading-relaxed font-light">
              {c.hero.sub}
            </p>
            <div className="hero-fade hero-delay-4 mb-10 md:mb-14" />
            <div className="hero-fade hero-delay-5 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-12 md:mb-16">
              <Link to={sp("/kontakt")} className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                {c.hero.ctaPrimary} <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              {c.hero.ctaSecondaryHref.startsWith("#") ? (
                <a href={c.hero.ctaSecondaryHref} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/80 tracking-wider rounded-full border border-border/40 hover:border-primary/30 hover:text-foreground transition-all duration-500">
                  {c.hero.ctaSecondary}
                </a>
              ) : (
                <Link to={c.hero.ctaSecondaryHref.startsWith("/") && !c.hero.ctaSecondaryHref.startsWith(section.basePath) ? c.hero.ctaSecondaryHref : sp(c.hero.ctaSecondaryHref.replace(section.basePath, ""))} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/80 tracking-wider rounded-full border border-border/40 hover:border-primary/30 hover:text-foreground transition-all duration-500">
                  {c.hero.ctaSecondary}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-px h-10 md:h-12 bg-gradient-to-b from-primary/40 to-transparent" />
        </div>
      </section>

      {/* MARQUEE BANDS */}
      <div className="relative py-8 md:py-10 border-y border-border/15 overflow-hidden select-none">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="relative flex overflow-hidden mb-4 md:mb-5">
          <div className="flex shrink-0 animate-marquee gap-10 md:gap-12 pr-10 md:pr-12">
            {[...c.services, ...c.services].map((s, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                <s.icon size={12} className="text-primary/60 shrink-0" strokeWidth={1.5} />
                <span className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] uppercase text-foreground/60 font-light">{s.title}</span>
                <span className="text-primary/30 mx-2 md:mx-3">·</span>
              </div>
            ))}
          </div>
        </div>
        {section.id === "regnskap" && (
          <div className="relative flex overflow-hidden">
            <div className="flex shrink-0 animate-marquee-reverse gap-10 md:gap-12 pr-10 md:pr-12">
              {[...c.industries, ...c.industries].map((ind, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                  <ind.icon size={12} className="text-secondary/60 shrink-0" strokeWidth={1.5} />
                  <span className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] uppercase text-foreground/60 font-light">{ind.name}</span>
                  <span className="text-secondary/30 mx-2 md:mx-3">·</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SOCIAL PROOF BAR */}
      <section className="py-12 md:py-16 border-b border-border/15 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {c.socialProof.map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex p-2.5 bg-primary/10 rounded-xl mb-3">
                  <item.icon size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <p className="font-heading text-2xl md:text-3xl text-gradient-rose">{item.value}</p>
                <p className="text-xs text-foreground/70 font-light mt-1">{item.label}</p>
                <p className="text-[10px] text-foreground/40 font-light">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROTATING HOOK */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div key={fadeKey} className="css-fade-in">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl leading-snug mb-8 md:mb-10">{slide.heading}</h2>
              <p className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto font-light mb-6 md:mb-8">{slide.body}</p>
              <p className="text-primary text-lg font-heading italic">{slide.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* METODEN — embedded */}
      <MetodenSection />

      {/* SERVICES CAROUSEL */}
      <section className="relative overflow-hidden">
        {serviceBgSrc && (
          <div key={`bg-${activeService}`} className="absolute inset-0 css-fade-in">
            <img src={serviceBgSrc} alt="" className="w-full h-full object-cover" loading="lazy" width={1920} height={1080} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />

        <button aria-label="Forrige" className="absolute inset-y-0 left-0 w-1/2 z-20 cursor-w-resize bg-transparent border-0" onClick={prevService} />
        <button aria-label="Neste" className="absolute inset-y-0 right-0 w-1/2 z-20 cursor-e-resize bg-transparent border-0" onClick={nextService} />

        <div className="relative z-30 py-24 md:py-40 pointer-events-none">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection>
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Alt inkludert</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-6 md:mb-8 max-w-4xl leading-snug">
                Én fast pris.{" "}<span className="italic text-gradient-rose">Alt du trenger.</span>
              </h2>
            </AnimatedSection>

            <div className="max-w-2xl relative z-30 pointer-events-none">
              <div key={serviceKey} className="css-slide-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg shadow-primary/5">
                    <CurrentIcon size={28} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="font-heading text-6xl md:text-7xl text-primary/15 select-none">
                    {String(activeService + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-heading text-3xl md:text-5xl mb-4 md:mb-6">{current.title}</h3>
                <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-light mb-8 md:mb-10 max-w-lg">{current.desc}</p>
                <Link to={current.href} className="pointer-events-auto group inline-flex items-center gap-3 px-8 py-3.5 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm tracking-wider rounded-full hover:bg-primary/20 transition-all duration-500">
                  Les mer <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-16 md:mt-20">
              {c.services.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-500 ${i === activeService ? "w-8 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-foreground/20"}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/10 z-30">
          <div
            key={`progress-${activeService}-${serviceAutoplay}`}
            className="h-full bg-gradient-to-r from-primary to-rose-glow"
            style={{ animation: serviceAutoplay ? "progressBar 5s linear forwards" : "none", width: serviceAutoplay ? undefined : "0%" }}
          />
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* INDUSTRIES — only regnskap */}
      {section.id === "regnskap" ? (
        <section className="py-24 md:py-40 relative">
          <div className="absolute inset-0 ambient-glow opacity-40" />
          <div className="container mx-auto px-4 md:px-6 relative">
            <AnimatedSection>
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Bransjer vi dekker</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 max-w-4xl leading-snug">
                Vi kjenner bransjen din.{" "}<span className="italic text-gradient-rose">Ikke bare behovene.</span>
              </h2>
              <p className="text-foreground/70 text-base md:text-lg font-light mb-4 md:mb-6 max-w-2xl">
                Uansett hva du driver med, møter du en rådgiver hos oss som forstår hverdagen din.
              </p>
              <p className="text-sm text-primary/80 italic font-light mb-14 md:mb-20">
                Vi dekker over 25 bransjer. Her er noen av dem.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-h-[320px]">
              {visibleIndustries.map((ind) => (
                <div key={ind.slug + industryPage} className="css-fade-in">
                  <Link to={sp(`/bransjer/${ind.slug}`)} className="group p-6 md:p-8 glass rounded-3xl card-lift relative overflow-hidden h-full block">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors duration-700" />
                    <div className="p-3 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-2xl inline-block mb-4 md:mb-5">
                      <ind.icon size={18} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-lg md:text-xl mb-1">{ind.name}</h3>
                    <p className="text-sm text-primary/80 italic mb-3">{ind.tagline}</p>
                    <p className="text-sm text-foreground/60 leading-relaxed font-light">{ind.desc}</p>
                    <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-primary/70 group-hover:text-primary transition-colors duration-300 mt-4">
                      Les mer <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} aria-label={`Side ${i + 1}`} onClick={() => setIndustryPage(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === industryPage ? "bg-primary w-6" : "bg-foreground/20 hover:bg-foreground/40"}`} />
              ))}
            </div>

            <AnimatedSection delay={0.3}>
              <div className="mt-8 text-center">
                <Link to={sp("/bransjer")} className="text-sm text-primary hover:text-primary/80 transition-colors font-light">
                  Se alle bransjer vi dekker →
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      ) : (
        /* TRUST / PROCESS — for HR, Marked, IT */
        <section className="py-24 md:py-40 relative">
          <div className="absolute inset-0 ambient-glow opacity-40" />
          <div className="container mx-auto px-4 md:px-6 relative">
            <AnimatedSection>
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Slik jobber vi</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 max-w-4xl leading-snug">
                Tre steg til en enklere hverdag.{" "}<span className="italic text-gradient-rose">Ingen kompleksitet.</span>
              </h2>
              <p className="text-foreground/70 text-base md:text-lg font-light mb-14 md:mb-20 max-w-2xl">
                Vi gjør oppstarten enkel og smertefri — så du kan fokusere på det som betyr noe.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { step: "01", title: "Vi snakker sammen", desc: "En uforpliktende prat der vi forstår behovene dine og forteller deg hva vi kan hjelpe med." },
                { step: "02", title: "Vi setter opp alt", desc: "Vi tar oss av hele oppsettet — fra systemer til rutiner. Du trenger bare å godkjenne." },
                { step: "03", title: "Du har en partner", desc: "Fra dag én har du en fast kontaktperson som kjenner deg, bransjen din og målene dine." },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.12}>
                  <div className="group p-8 md:p-10 glass rounded-3xl card-lift relative overflow-hidden h-full">
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                    <span className="font-heading text-6xl md:text-7xl text-primary/10 select-none block mb-4">{item.step}</span>
                    <h3 className="font-heading text-xl md:text-2xl mb-3">{item.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.4}>
              <div className="mt-12 text-center">
                <Link to={sp("/kontakt")} className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                  Start samtalen <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* TAX DEADLINES (only for regnskap) */}
      {section.id === "regnskap" && (
        <>
          <section className="py-24 md:py-40 relative">
            <div className="absolute inset-0 ambient-glow opacity-30" />
            <div className="container mx-auto px-4 md:px-6 relative">
              <AnimatedSection>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-start">
                  <div className="lg:col-span-2">
                    <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Alltid oppdatert</p>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6 leading-snug">
                      Kommende <span className="italic text-gradient-rose">skattefrister</span>
                    </h2>
                    <p className="text-foreground/60 text-sm md:text-base font-light leading-relaxed mb-4">
                      Hold deg oppdatert på de viktigste fristene. Vi henter dem automatisk, så du aldri går glipp av en frist.
                    </p>
                    <p className="text-xs text-primary/80 italic font-light">Kilde: skatteetaten.no</p>
                  </div>
                  <div className="lg:col-span-3"><TaxDeadlineWidget limit={6} /></div>
                </div>
              </AnimatedSection>
            </div>
          </section>
          <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>
        </>
      )}

      {/* CONVICTION SECTION */}
      <section className="py-24 md:py-40 border-y border-border/15">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-14 md:mb-20">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvorfor Avargo</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl max-w-3xl mx-auto leading-snug">
                {c.conviction.headline}
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {c.conviction.items.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="group p-8 md:p-10 glass rounded-3xl h-full flex flex-col card-lift relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-5 md:mb-6">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <item.icon size={18} className="text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <span className="font-heading text-3xl md:text-4xl text-gradient-rose">{item.metric}</span>
                        <p className="text-[10px] text-foreground/50 tracking-widest uppercase">{item.label}</p>
                      </div>
                    </div>
                    <p className="text-foreground/70 leading-relaxed flex-1 font-light text-sm md:text-base">{item.text}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow" />
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6 md:mb-8">{c.cta.tag}</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-6 md:mb-8 leading-snug">
                {c.cta.headline}
              </h2>
              <p className="text-foreground/70 text-base md:text-lg font-light mb-5 md:mb-6 leading-relaxed max-w-lg mx-auto">
                {c.cta.sub}
              </p>
              <p className="text-sm text-primary italic font-light mb-10 md:mb-12">{c.cta.italic}</p>
              <Link to={sp("/kontakt")} className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                {c.cta.button} <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-14 md:mb-20">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Vanlige spørsmål</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl max-w-3xl mx-auto leading-snug">
                Alt du lurer på.{" "}<span className="italic text-gradient-rose">Rett fra oss.</span>
              </h2>
            </div>
          </AnimatedSection>
          <div className="max-w-2xl mx-auto space-y-3">
            {c.faq.map((faq, i) => (
              <FaqAccordion key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
          <AnimatedSection delay={0.2}>
            <div className="text-center mt-10">
              <Link to={sp("/faq")} className="text-sm text-primary hover:text-primary/80 transition-colors font-light">
                Se alle vanlige spørsmål →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CROSS-SELL TRIGGER POINTS */}
      <section className="py-24 md:py-36 border-t border-border/10 relative">
        <div className="absolute inset-0 ambient-glow opacity-15" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-14 md:mb-20">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5">Trenger du mer?</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl max-w-2xl mx-auto leading-snug">
                Vi dekker hele{" "}<span className="italic text-gradient-rose">bedriftens behov.</span>
              </h2>
              <p className="text-foreground/60 text-base font-light mt-5 max-w-lg mx-auto">
                Avargo er mer enn {sectionId === "regnskap" ? "regnskap" : sectionId === "hr" ? "HR" : sectionId === "markedsforing" ? "markedsføring" : "IT"}. Kombiner tjenestene og få én partner for alt.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
            {otherSections.map((s) => (
              <AnimatedSection key={s.id} delay={0.1}>
                <Link to={s.basePath} className="group block glass rounded-2xl p-6 md:p-8 card-lift border border-border/10 hover:border-border/25 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-300"
                      style={{ backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.1)`, borderColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.2)` }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)` }} />
                    </div>
                    <div>
                      <p className="text-base font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground italic">{s.tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed mb-5">{s.description}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wider group-hover:gap-3 transition-all duration-300"
                    style={{ color: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)` }}>
                    Utforsk {s.shortName} <ArrowRight size={13} />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <StickyMobileCta label={c.hero.ctaPrimary} to={sp("/kontakt")} />
    </>
  );
};

export default SectionHome;
