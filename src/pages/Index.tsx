import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight, TrendingUp, Shield, Zap, Globe, Building2, Briefcase, Landmark,
  Tractor, ShoppingCart, HardHat, Heart, Store, Users,
  Sparkles, Eye, PiggyBank, Handshake, Gem, Flame, Crown, Target,
  ChevronDown, Award, Clock, CheckCircle2
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import TaxDeadlineWidget from "@/components/TaxDeadlineWidget";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

// Lazy-load service backgrounds — only import on demand
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
    const bgIndex = index % serviceBgPaths.length;
    serviceBgPaths[bgIndex]().then(mod => setSrc(mod.default));
  }, [index]);
  return src;
};

const hookSlides = [
  {
    heading: <>Store selskaper har hele avdelinger.{" "}<span className="italic text-gradient-teal">Nå har du det også.</span></>,
    body: "Regnskapsfører, HR-rådgiver, markedsfører og utvikler — det er teamet som store selskaper bygger internt for millioner i året. Hos Avargo får du det samme teamet, dedikert til ditt selskap, til en brøkdel av prisen.",
    tagline: "Bygget for små og mellomstore bedrifter som fortjener mer.",
  },
  {
    heading: <>Du startet bedriften for å bygge noe.{" "}<span className="italic text-gradient-teal">Ikke for å sitte med bilag.</span></>,
    body: "De fleste bedriftseiere bruker timer hver uke på fakturering, rapporter og frister — tid som burde gått til kunder, ansatte og vekst. Med Avargo overlater du alt det til noen som faktisk brenner for det.",
    tagline: "Vi finnes for at du skal slippe å gjøre alt selv.",
  },
  {
    heading: <>Samme trygghet som de store.{" "}<span className="italic text-gradient-teal">Uten byråkratiet.</span></>,
    body: "Storkonsern har egne økonomiavdelinger, HR-team og rådgivere. Du har Avargo. Samme kompetanse, samme tilgjengelighet — men uten faste ansatte, kontorlokaler og millionbudsjetter.",
    tagline: "Laget for bedrifter som tenker stort — uansett størrelse.",
  },
];

const RotatingHook = () => {
  const [hookIndex, setHookIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHookIndex((prev) => (prev + 1) % hookSlides.length);
      setFadeKey((prev) => prev + 1);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const slide = hookSlides[hookIndex];

  return (
    <section className="py-24 md:py-40 relative">
      <div className="absolute inset-0 ambient-glow opacity-60" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div key={fadeKey} className="css-fade-in">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl leading-snug mb-8 md:mb-10">
              {slide.heading}
            </h2>
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto font-light mb-6 md:mb-8">
              {slide.body}
            </p>
            <p className="text-primary text-lg font-heading italic">
              {slide.tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const faqItems = [
  { q: "Hva koster en regnskapsfører hos Avargo?", a: "Vi opererer med faste månedspriser uten skjulte kostnader. Alt fra bokføring, MVA, lønn, årsregnskap og skattemelding er inkludert. Prisen avhenger av selskapets størrelse og kompleksitet." },
  { q: "Er regnskapsførerne deres statsautoriserte?", a: "Ja, alle våre regnskapsførere er statsautoriserte og godkjent av Finanstilsynet. Vi er også et godkjent regnskapsførerselskap." },
  { q: "Kan jeg bytte regnskapsfører midt i året?", a: "Absolutt. Vi håndterer hele overgangen for deg — inkludert kontakt med din nåværende regnskapsfører, overføring av regnskapsmateriale og oppsett i våre systemer." },
  { q: "Hvor lang er bindingstiden?", a: "Vi har ingen bindingstid. Du kan si opp når som helst med én måneds varsel. Vi tror på å beholde kunder gjennom kvalitet, ikke kontrakter." },
  { q: "Dekker dere min bransje?", a: "Vi dekker over 25 bransjer — fra tech og SaaS til bygg, restaurant, eiendom og landbruk. Hver kunde får en regnskapsfører som forstår bransjen din." },
  { q: "Hva skiller Avargo fra andre regnskapsbyråer?", a: "Du får én dedikert regnskapsfører som kjenner selskapet ditt, støttet av et helt team innen HR, skatteplanlegging og digital markedsføring. Alt inkludert i fastprisen — ingen tillegg for rådgivning." },
];

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

const StickyMobileCta = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const pastHero = scrollY > winHeight * 0.6;
      const nearBottom = scrollY + winHeight > docHeight - 200;
      setVisible(pastHero && !nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/20 p-3 safe-area-bottom transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <Link to="/kontakt" className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose">
        Få et uforpliktende tilbud
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};

const Index = () => {
  const [lowestPrice, setLowestPrice] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowest = async () => {
      const { data } = await supabase
        .from("pricing_plans")
        .select("price")
        .eq("active", true)
        .order("price", { ascending: true })
        .limit(1);
      if (data && data.length > 0) {
        setLowestPrice(data[0].price.toLocaleString("nb-NO"));
      }
    };
    fetchLowest();
  }, []);

  const industries = [
    { icon: Globe, name: "Tech & SaaS", slug: "tech-saas", tagline: "Vi vokser i takt med deg", desc: "Startups og tech-selskaper trenger en regnskapsfører som forstår vekst, investorer og SaaS-modeller. Det gjør vi." },
    { icon: Building2, name: "Eiendom & Utvikling", slug: "eiendom", tagline: "Oversikt fra kjøp til salg", desc: "Full kontroll over eiendomsporteføljen din — hva du tjener, hva det koster og hvordan du kan gjøre det smartere." },
    { icon: Landmark, name: "Holding & Investering", slug: "holding", tagline: "Strukturen som beskytter deg", desc: "Vi hjelper deg å bygge en ryddig og trygg struktur for aksjer, eiendom og andre investeringer." },
    { icon: Briefcase, name: "Consulting & Rådgivning", slug: "consulting", desc: "Vi tar oss av det administrative, slik at du kan bruke tiden din på det du faktisk er god på.", tagline: "Mer tid til det du er best på" },
    { icon: Tractor, name: "Landbruk", slug: "landbruk", tagline: "Vi kjenner gårdens rytme", desc: "Sesongsvingninger, støtteordninger og maskinpark — vi sørger for at du aldri går glipp av det du har krav på." },
    { icon: ShoppingCart, name: "Varehandel", slug: "varehandel", tagline: "Kontroll på varene og pengene", desc: "Vi hjelper deg å forstå hva som lønner seg å selge og gir deg et klart bilde av driften." },
    { icon: HardHat, name: "Bygg & Anlegg", slug: "bygg-anlegg", tagline: "Vi holder orden mens du bygger", desc: "God oversikt over hvert prosjekt, slik at du alltid vet om du tjener penger." },
    { icon: Store, name: "Nettbutikk & E-commerce", slug: "nettbutikk", tagline: "Skalér trygt", desc: "Styr på inntekter, avgifter og kostnader — uansett om du selger til Norge eller utlandet." },
    { icon: Heart, name: "Helse & Velvære", slug: "helse", tagline: "Fokuser på menneskene", desc: "Vi ordner det økonomiske i bakgrunnen mens du gir full oppmerksomhet til dem du er der for." },
    { icon: TrendingUp, name: "Restaurant & Uteliv", slug: "restaurant", tagline: "Hjulene i gang", desc: "God oversikt over driften slik at du kan ta bedre beslutninger og sove litt bedre om natten." },
    { icon: Users, name: "Frisør & Skjønnhet", slug: "frisor", tagline: "Mer tid bak stolen", desc: "Du er ekspert på ditt håndverk — vi tar oss av regnskapet fra A til Å." },
    { icon: Zap, name: "Håndverkere & Fagfolk", slug: "handverkere", tagline: "Fagmann på jobb, vi tar resten", desc: "Vi sørger for at alt det administrative er i orden mens du gjør jobben din." },
  ];

  const [industryPage, setIndustryPage] = useState(0);
  const industriesPerPage = 3;
  const totalPages = Math.ceil(industries.length / industriesPerPage);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIndustryPage((prev) => (prev + 1) % totalPages);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const visibleIndustries = industries.slice(
    industryPage * industriesPerPage,
    industryPage * industriesPerPage + industriesPerPage
  );

  const services = [
    { icon: Handshake, title: "Dedikert regnskapsfører", desc: "Du får én fast person som kjenner selskapet ditt godt. Alltid tilgjengelig, alltid oppdatert — ingen ventelinjer eller chatboter.", href: "/tjenester/regnskapsforer" },
    { icon: Users, title: "Lønn & HR", desc: "Full lønnskjøring, feriepenger, A-melding og arbeidsgiveravgift. Alt er inkludert i fastprisen — uten skjulte kostnader.", href: "/tjenester/hr" },
    { icon: Flame, title: "Nettsider & markedsføring", desc: "Moderne nettsider, SEO, Google Ads og sosiale medier — alt koblet til de faktiske tallene dine for smartere vekst.", href: "/tjenester/nettsider" },
    { icon: Sparkles, title: "AI-drevet innsikt", desc: "Vi bruker AI til å oppdage fradrag, risiko og muligheter du ikke ser selv — slik at du alltid ligger et steg foran.", href: "/tjenester/ai-innsikt" },
    { icon: Gem, title: "Alt inkludert i regnskapet", desc: "Bokføring, årsregnskap, skattemelding, MVA-rapportering og aksjonærregisteroppgave. Hos oss er ingenting «ekstra».", href: "/tjenester/en-til-en-regnskap" },
    { icon: PiggyBank, title: "Skatteoptimalisering", desc: "Kvartalsvis gjennomgang av skatteposisjonen din. Vi finner fradragene du ikke visste om og strukturerer selskapet smart.", href: "/tjenester/cfo" },
    { icon: Eye, title: "SEO & søkbarhet", desc: "Bli synlig på Google med strategisk søkemotoroptimalisering som bygger langsiktig organisk trafikk til bedriften din.", href: "/tjenester/seo" },
    { icon: Crown, title: "Rådgivning inkludert", desc: "Utbytte, kapitalforhøyelse, fusjoner — spør oss om hva som helst. Rådgivning er standard hos Avargo, ikke et tillegg.", href: "/tjenester/cfo" },
    { icon: Target, title: "Frister? Vårt ansvar.", desc: "MVA-frist, skattemelding, årsregnskap — vi leverer alt i tide, hver gang. Du trenger aldri bekymre deg for en frist igjen.", href: "/tjenester/regnskapsforer" },
  ];

  const [activeService, setActiveService] = useState(0);
  const [serviceAutoplay, setServiceAutoplay] = useState(true);
  const [serviceKey, setServiceKey] = useState(0);
  const serviceBgSrc = useServiceBg(activeService);

  useEffect(() => {
    if (!serviceAutoplay) return;
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
      setServiceKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [serviceAutoplay, services.length]);

  const goToService = useCallback((index: number) => {
    setActiveService(index);
    setServiceKey((prev) => prev + 1);
    setServiceAutoplay(false);
    setTimeout(() => setServiceAutoplay(true), 15000);
  }, []);

  const nextService = useCallback(() => {
    goToService((activeService + 1) % services.length);
  }, [activeService, services.length, goToService]);

  const prevService = useCallback(() => {
    goToService((activeService - 1 + services.length) % services.length);
  }, [activeService, services.length, goToService]);

  const current = services[activeService];
  const CurrentIcon = current.icon;

  return (
    <>
      <Helmet>
        <title>Avargo | Regnskapsfører for små og mellomstore bedrifter</title>
        <meta name="description" content="Avargo er regnskapsbyrået for SMB-bedrifter som ønsker trygghet. Dedikert statsautorisert regnskapsfører, rådgivning og skatteoptimalisering — alt inkludert i fast pris." />
        <link rel="canonical" href="https://avargo.no" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["AccountingService", "LocalBusiness"],
          "name": "Avargo",
          "alternateName": "Avargo Regnskap",
          "description": "Regnskapsbyrå for små og mellomstore bedrifter i Norge. Dedikert statsautorisert regnskapsfører, skatteoptimalisering, lønn, HR og rådgivning — alt inkludert i fast pris.",
          "url": "https://avargo.no",
          "logo": "https://avargo.no/logo.png",
          "image": "https://avargo.no/og-image.jpg",
          "email": "firmapost@avargo.no",
          "telephone": "+4798642391",
          "address": { "@type": "PostalAddress", "streetAddress": "Oscars gate 2B", "addressLocality": "Skien", "postalCode": "3714", "addressRegion": "Vestfold og Telemark", "addressCountry": "NO" },
          "geo": { "@type": "GeoCoordinates", "latitude": 59.2084, "longitude": 9.6069 },
          "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "16:00" }],
          "areaServed": [{ "@type": "Country", "name": "Norway" }, { "@type": "City", "name": "Skien" }, { "@type": "City", "name": "Oslo" }, { "@type": "City", "name": "Bergen" }, { "@type": "City", "name": "Trondheim" }],
          "priceRange": lowestPrice ? `Fra ${lowestPrice} kr/mnd` : "Fra 1 499 kr/mnd",
          "currenciesAccepted": "NOK",
          "paymentAccepted": "Faktura",
          "serviceType": ["Regnskap", "Regnskapsfører", "Skatteoptimalisering", "CFO-rådgivning", "Lønnskjøring", "HR", "Årsregnskap", "Skattemelding", "MVA-rapportering", "Bokføring"],
          "knowsAbout": ["Regnskap", "Skatteplanlegging", "Aksjeselskap", "Enkeltpersonforetak", "MVA", "Lønn", "HR", "Årsoppgjør"],
          "hasOfferCatalog": {
            "@type": "OfferCatalog", "name": "Regnskapstjenester",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Oppstart", "description": "Regnskapsfører for nyoppstartede selskaper", "url": "https://avargo.no/priser" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vekst", "description": "Regnskapsfører for selskaper i vekst", "url": "https://avargo.no/priser" }},
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Rådgivning", "description": "CFO-rådgivning og skatteplanlegging", "url": "https://avargo.no/priser" }}
            ]
          },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "bestRating": "5", "ratingCount": "12" },
          "sameAs": []
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "WebPage",
          "name": "Avargo — Regnskapsfører og rådgiver",
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".hero-description", ".hero-tagline"] },
          "url": "https://avargo.no"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": faqItems.map(faq => ({
            "@type": "Question", "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a }
          }))
        })}</script>
      </Helmet>

      {/* HERO — Pure CSS animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Avargo kontorlandskap" className="w-full h-full object-cover opacity-50" width={1920} height={1080} fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          <div className="absolute inset-0 ambient-glow" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="hero-fade hero-delay-1 text-[11px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-foreground/60 mb-8 md:mb-12">
              For små og mellomstore bedrifter som ønsker trygghet
            </p>
            <h1 className="hero-fade hero-delay-2 font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.05] mb-6 md:mb-8">
              Regnskapet ditt<br />
              <span className="text-gradient-rose italic">fortjener bedre.</span>
            </h1>
            <p className="hero-fade hero-delay-3 hero-description text-base md:text-lg text-foreground/70 max-w-xl mx-auto mb-5 md:mb-6 leading-relaxed font-light">
              Du får en fast, statsautorisert regnskapsfører som kjenner selskapet ditt — støttet av et helt team som tar seg av regnskap, rådgivning og det du ikke har tid til selv. Alt inkludert. Ingen overraskelser.
            </p>
            <p className="hero-fade hero-delay-4 hero-tagline text-sm text-primary italic mb-10 md:mb-14 font-light">
              {lowestPrice ? `Fra ${lowestPrice} kr/mnd for nyoppstartede selskaper.` : "Fast pris for nyoppstartede selskaper."}
            </p>
            <div className="hero-fade hero-delay-5 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-12 md:mb-16">
              <Link to="/kontakt" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                Få et uforpliktende tilbud
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link to="/metoden" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/80 tracking-wider rounded-full border border-border/40 hover:border-primary/30 hover:text-foreground transition-all duration-500">
                Slik jobber vi
              </Link>
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
            {[...services, ...services].map((s, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                <s.icon size={12} className="text-primary/60 shrink-0" strokeWidth={1.5} />
                <span className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] uppercase text-foreground/60 font-light">{s.title}</span>
                <span className="text-primary/30 mx-2 md:mx-3">·</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee-reverse gap-10 md:gap-12 pr-10 md:pr-12">
            {[...industries, ...industries].map((ind, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                <ind.icon size={12} className="text-secondary/60 shrink-0" strokeWidth={1.5} />
                <span className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] uppercase text-foreground/60 font-light">{ind.name}</span>
                <span className="text-secondary/30 mx-2 md:mx-3">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF BAR */}
      <section className="py-12 md:py-16 border-b border-border/15 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Award, value: "Godkjent", label: "regnskapsførerselskap", sub: "Finanstilsynet" },
              { icon: Users, value: "25+", label: "bransjer dekket", sub: "Hele Norge" },
              { icon: Clock, value: "24 timer", label: "garantert svar", sub: "Alltid tilgjengelig" },
              { icon: CheckCircle2, value: "100%", label: "fast pris", sub: "Ingen skjulte kostnader" },
            ].map((item, i) => (
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

      {/* THE HOOK — rotating */}
      <RotatingHook />

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* SERVICES — immersive fullwidth carousel, CSS-only transitions */}
      <section id="tjenester" className="relative overflow-hidden">
        {/* Background image with CSS crossfade */}
        {serviceBgSrc && (
          <div key={`bg-${activeService}`} className="absolute inset-0 css-fade-in">
            <img src={serviceBgSrc} alt="" className="w-full h-full object-cover" loading="lazy" width={1920} height={1080} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />

        <button aria-label="Forrige tjeneste" className="absolute inset-y-0 left-0 w-1/2 z-20 cursor-w-resize bg-transparent border-0" onClick={prevService} />
        <button aria-label="Neste tjeneste" className="absolute inset-y-0 right-0 w-1/2 z-20 cursor-e-resize bg-transparent border-0" onClick={nextService} />

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
                  Les mer
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-16 md:mt-20">
              {services.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-500 ${i === activeService ? "w-8 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-foreground/20"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar — CSS animation */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/10 z-30">
          <div
            key={`progress-${activeService}-${serviceAutoplay}`}
            className="h-full bg-gradient-to-r from-primary to-rose-glow"
            style={{
              animation: serviceAutoplay ? "progressBar 5s linear forwards" : "none",
              width: serviceAutoplay ? undefined : "0%",
            }}
          />
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* INDUSTRIES — rotating 3 at a time */}
      <section id="bransjer" className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Bransjer vi dekker</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 max-w-4xl leading-snug">
              Vi kjenner bransjen din.{" "}<span className="italic text-gradient-rose">Ikke bare tallene.</span>
            </h2>
            <p className="text-foreground/70 text-base md:text-lg font-light mb-4 md:mb-6 max-w-2xl">
              Uansett hva du driver med, møter du en regnskapsfører hos oss som forstår hverdagen din — ikke bare tallene i regnskapet.
            </p>
            <p className="text-sm text-primary/80 italic font-light mb-14 md:mb-20">
              Vi dekker over 25 bransjer. Her er noen av dem.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-h-[320px]">
            {visibleIndustries.map((ind) => (
              <div key={ind.slug + industryPage} className="css-fade-in">
                <Link to={`/bransjer/${ind.slug}`} className="group p-6 md:p-8 glass rounded-3xl card-lift relative overflow-hidden h-full block">
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
              <button key={i} aria-label={`Bransje-side ${i + 1}`} onClick={() => setIndustryPage(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === industryPage ? "bg-primary w-6" : "bg-foreground/20 hover:bg-foreground/40"}`} />
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div className="mt-8 text-center">
              <Link to="/bransjer" className="text-sm text-primary hover:text-primary/80 transition-colors font-light">
                Se alle {industries.length}+ bransjer vi dekker →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* SKATTEFRISTER */}
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
                  Hold deg oppdatert på de viktigste fristene fra Skatteetaten. Vi henter dem automatisk, så du aldri går glipp av en frist.
                </p>
                <p className="text-xs text-primary/80 italic font-light">
                  Kilde: skatteetaten.no — oppdateres i sanntid.
                </p>
              </div>
              <div className="lg:col-span-3">
                <TaxDeadlineWidget limit={6} />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* CONVICTION SECTION */}
      <section className="py-24 md:py-40 border-y border-border/15">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-14 md:mb-20">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvorfor Avargo</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl max-w-3xl mx-auto leading-snug">
                De fleste betaler for mye.{" "}<span className="italic text-gradient-rose">Og får for lite tilbake.</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: Shield, metric: "100%", label: "fastpris — ingen tillegg", text: "Hos oss er bokføring, MVA, lønn, årsregnskap, skattemelding og rådgivning inkludert i én fast månedspris. Ingen timefakturering. Ingen overraskelser. Du vet alltid hva det koster." },
              { icon: Handshake, metric: "1 person", label: "din statsautoriserte regnskapsfører", text: "Du slipper callsenter og tilfeldige saksbehandlere. Du får én navngitt, statsautorisert regnskapsfører som lærer seg selskapet ditt, bransjen din og målene dine — og som du kan ringe direkte." },
              { icon: Sparkles, metric: "25+", label: "bransjer vi dekker", text: "Uansett om du driver restaurant, eiendom, tech eller bygg — regnskapsføreren din forstår bransjen din. Du slipper å forklare det grunnleggende hver gang." },
              { icon: Zap, metric: "24 timer", label: "svar — alltid", text: "Når du sender en melding eller ringer, svarer vi innen 24 timer. Alltid. Fordi trygghet handler om å vite at noen er der når du trenger det." },
            ].map((item, i) => (
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
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6 md:mb-8">Uforpliktende gjennomgang</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-6 md:mb-8 leading-snug">
                Usikker på om du får nok <span className="italic text-gradient-rose">tilbake fra regnskapsføreren din?</span>
              </h2>
              <p className="text-foreground/70 text-base md:text-lg font-light mb-5 md:mb-6 leading-relaxed max-w-lg mx-auto">
                Vi gjennomgår regnskapet ditt gratis og viser deg konkret hva du kan spare — på skatt, kostnader og tid. En av våre statsautoriserte regnskapsførere kontakter deg innen 24 timer.
              </p>
              <p className="text-sm text-primary italic font-light mb-10 md:mb-12">
                Helt uforpliktende. Ingen binding. Bare en god samtale.
              </p>
              <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                Bestill din gratis gjennomgang
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
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
            {faqItems.map((faq, i) => (
              <FaqAccordion key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
          <AnimatedSection delay={0.2}>
            <div className="text-center mt-10">
              <Link to="/faq" className="text-sm text-primary hover:text-primary/80 transition-colors font-light">
                Se alle vanlige spørsmål →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sticky mobile CTA — hides when near footer */}
      <StickyMobileCta />
    </>
  );
};

export default Index;