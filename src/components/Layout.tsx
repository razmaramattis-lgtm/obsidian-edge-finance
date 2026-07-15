import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AdminFloatingBar from "@/components/AdminFloatingBar";
import StickyMobileCta from "@/components/StickyMobileCta";
import ExitIntentDialog from "@/components/ExitIntentDialog";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import Breadcrumbs from "@/components/Breadcrumbs";
import Logo from "@/components/Logo";

import {
  Menu, X, ChevronDown, BookOpen, TrendingUp, Briefcase,
  Building2, Landmark, HardHat, Store, Heart, Zap,
  BookMarked, Newspaper, CalendarClock, FileSignature,
  Calculator, ArrowRight, Receipt, PieChart, BarChart3, Users, Globe, Car,
  Mail, ShieldCheck,
} from "lucide-react";

/* ── Editorial nav data — regnskap first, HR as one line at the end ── */
const tjenesterCore = [
  { icon: BookOpen,   title: "Dedikert regnskapsfører",      desc: "Én fast kontaktperson som kjenner bedriften din.", href: "/tjenester/regnskapsforer" },
  { icon: PieChart,   title: "Årsregnskap & skattemelding",  desc: "Komplett årsoppgjør — levert i god tid før fristen.", href: "/tjenester/arsregnskap" },
  { icon: Receipt,    title: "Lønn & rapportering",          desc: "Presis lønnskjøring, A-melding og feriepenger.", href: "/tjenester/lonn" },
  { icon: Receipt,    title: "Fakturering & innkreving",     desc: "Utgående faktura, purringer og oppfølging.", href: "/tjenester/fakturering" },
  { icon: TrendingUp, title: "Skatterådgivning",             desc: "Optimaliser skatteposisjonen — hele året, ikke bare i mai.", href: "/tjenester/skatteplanlegging" },
  { icon: Briefcase,  title: "CFO-rådgivning",               desc: "Erfaren økonomisjef på timen — når du trenger et strategisk blikk.", href: "/tjenester/cfo" },
  { icon: BarChart3,  title: "1-1 regnskapsgjennomgang",     desc: "En time dedikert til dine tall — med konkret handlingsplan.", href: "/tjenester/1-1-regnskap" },
];

const tjenesterHr = [
  { icon: Users,      title: "HR & personaladministrasjon",  desc: "Kontrakter, arbeidsrett og personalhåndbok som ekstra tjeneste.", href: "/tjenester/hr-og-lonn" },
];

const bransjerItems = [
  { icon: Globe,      title: "Tech & SaaS",           desc: "MRR-rapportering, investorkommunikasjon og skalerbar økonomistyring.", href: "/bransjer/tech-saas" },
  { icon: Building2,  title: "Eiendom & utvikling",   desc: "Prosjektregnskap, avskrivninger og skatteoptimalisering.", href: "/bransjer/eiendom" },
  { icon: Landmark,   title: "Holding & investering", desc: "Konsernregnskap, utbytteplanlegging og strukturering.", href: "/bransjer/holding" },
  { icon: Briefcase,  title: "Consulting & rådgivning", desc: "Prosjektbasert fakturering, timeregnskap og lønnsomhet.", href: "/bransjer/consulting" },
  { icon: HardHat,    title: "Bygg & anlegg",         desc: "Løpende avregning, underentreprenører og HMS-dokumentasjon.", href: "/bransjer/bygg-anlegg" },
  { icon: Store,      title: "Nettbutikk & e-handel", desc: "Varelager, betalingsintegrasjoner og MVA over landegrenser.", href: "/bransjer/nettbutikk" },
  { icon: Heart,      title: "Helse & velvære",       desc: "Klinikker og terapeuter — konsesjoner og MVA-tilpasning.", href: "/bransjer/helse" },
  { icon: TrendingUp, title: "Restaurant & servering", desc: "Kassaoppgjør, varekostkontroll og personaladministrasjon.", href: "/bransjer/restaurant" },
  { icon: Users,      title: "Frisør & skjønnhet",    desc: "Stolleie, MVA på tjenester og enkel driftsøkonomi.", href: "/bransjer/frisor" },
  { icon: Zap,        title: "Håndverkere & fagfolk", desc: "Fakturering, prosjekt­oppfølging og skatteplanlegging.", href: "/bransjer/handverkere" },
];

const ressurserLinks = [
  { icon: Calculator,   title: "Kontohjelp",         desc: "Slå opp riktig konto — 400+ kontoer med eksempler og forklaring.",     href: "/ressurser/kontohjelp", featured: true },
  { icon: Newspaper,    title: "Nyheter & artikler", desc: "Fagartikler om skatt, lovendringer og praktisk drift for norske SMB.", href: "/ressurser?tab=nyheter" },
  { icon: BookMarked,   title: "Guider & maler",     desc: "Sjekklister, kontrakter og steg-for-steg guider til nedlasting.",       href: "/ressurser?tab=guider" },
  { icon: CalendarClock,title: "Skattekalender",     desc: "Alle frister for MVA, årsregnskap og a-melding gjennom året.",          href: "/ressurser/skattekalender" },
  { icon: FileSignature,title: "Protokollgenerator", desc: "Lag juridisk korrekte styreprotokoller og generalforsamlingsdokumenter.", href: "/ressurser/protokollgenerator" },
  { icon: Car,          title: "Firmabilkalkulator", desc: "Beregn skattepliktig fordel av firmabil etter gjeldende sjablongregler.", href: "/ressurser/firmabilkalkulator" },
];

/* ── Editorial dropdown panel ── */
const DropdownPanel = ({ open, children, className = "" }: { open: boolean; children: React.ReactNode; className?: string }) => (
  <div
    className={`transition-all duration-300 ease-out ${className} ${
      open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
    }`}
    style={{ visibility: open ? "visible" : "hidden" }}
  >
    {children}
  </div>
);

/* ══════════════════════════════════════════════════
   LAYOUT
   ══════════════════════════════════════════════════ */
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tjenesterOpen, setTjenesterOpen] = useState(false);
  const [bransjerOpen, setBransjerOpen] = useState(false);
  const [ressurserOpen, setRessurserOpen] = useState(false);
  const [mobileTjenesterOpen, setMobileTjenesterOpen] = useState(false);
  const [mobileBransjerOpen, setMobileBransjerOpen] = useState(false);
  const [mobileRessurserOpen, setMobileRessurserOpen] = useState(false);

  const tjenesterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bransjerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ressurserRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  // ── Subtil scroll-reaksjon for header ─────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Subtil parallax for footer-wordmark ───────────
  const footerRef = useRef<HTMLElement | null>(null);
  const footerWordmarkRef = useRef<HTMLDivElement | null>(null);
  const footerGlowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const update = () => {
      const el = footerRef.current;
      if (!el) { ticking = false; return; }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress 0..1 idet footer glir inn i viewport nedenfra
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height * 0.5)));
      if (footerWordmarkRef.current) {
        footerWordmarkRef.current.style.transform = `translate3d(0, ${(1 - p) * 40}px, 0)`;
      }
      if (footerGlowRef.current) {
        footerGlowRef.current.style.transform = `translate3d(0, ${(1 - p) * -20}px, 0)`;
        footerGlowRef.current.style.opacity = String(0.4 + p * 0.5);
      }
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const closeAll = () => { setTjenesterOpen(false); setBransjerOpen(false); setRessurserOpen(false); };

  const makeHandlers = (
    setter: (v: boolean) => void,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) => ({
    onMouseEnter: () => { if (timerRef.current) clearTimeout(timerRef.current); closeAll(); setter(true); },
    onMouseLeave: () => { timerRef.current = setTimeout(() => setter(false), 150); },
  });

  const dropBtnClass = (isOpen: boolean) =>
    `flex items-center gap-1 px-3 py-2 rounded-md text-[13px] tracking-wide font-normal transition-all duration-200 ${
      isOpen ? "text-foreground bg-muted/70" : "text-foreground/75 hover:text-foreground hover:bg-muted/40"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* ── NAV BAR — editorial ─────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-[background-color,border-color,box-shadow] duration-500 ease-out ${
          scrolled
            ? "bg-card/95 border-border/80 shadow-[0_10px_30px_-18px_hsl(152_34%_10%/0.22)]"
            : "bg-card/90 border-border/60 shadow-none"
        }`}
      >

        <div
          className={`container mx-auto flex items-center justify-between px-4 md:px-8 transition-[height] duration-500 ease-out h-[64px] ${
            scrolled ? "lg:h-[64px]" : "lg:h-[76px]"
          }`}
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {/* Logo — offisiell Avargo-logo */}
          <Link to="/" className="flex items-center group">
            <Logo
              variant="full"
              className={`text-forest group-hover:text-copper transition-colors duration-500 ease-out ${
                scrolled ? "h-7 lg:h-8" : "h-8 lg:h-9"
              }`}
            />
          </Link>



          {/* ── Desktop nav ─────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Tjenester dropdown */}
            <div className="relative" {...makeHandlers(setTjenesterOpen, tjenesterRef)}>
              <Link to="/tjenester" onClick={() => setTjenesterOpen(false)} className={dropBtnClass(tjenesterOpen)}>
                Tjenester
                <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${tjenesterOpen ? "rotate-180" : ""}`} />
              </Link>
              <DropdownPanel open={tjenesterOpen} className="fixed top-[76px] left-0 right-0 z-50 bg-card border-b border-border shadow-[0_20px_60px_-30px_hsl(20_10%_12%/0.18)]">
                <div className="container mx-auto px-8 py-10 grid grid-cols-12 gap-10">
                  {/* Left column — editorial intro */}
                  <div className="col-span-3 border-r border-border/70 pr-8">
                    <p className="text-[10px] tracking-[0.35em] uppercase text-primary/80 font-semibold mb-3">Kjerneleveranse</p>
                    <h3 className="font-heading text-2xl leading-tight mb-4 text-foreground">Regnskap, levert med presisjon.</h3>
                    <p className="text-[12.5px] text-muted-foreground font-light leading-relaxed mb-6">
                      Autorisert regnskapsbyrå for små og mellomstore bedrifter. Fast pris, dedikert team og rask respons på hverdager.
                    </p>
                    <Link to="/tjenester" onClick={() => setTjenesterOpen(false)} className="inline-flex items-center gap-1.5 text-[12px] text-primary font-medium hover:gap-2.5 transition-all">
                      Se alle tjenester <ArrowRight size={11} />
                    </Link>
                  </div>

                  {/* Right column — services list */}
                  <div className="col-span-9 grid grid-cols-2 gap-x-8 gap-y-1">
                    {tjenesterCore.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setTjenesterOpen(false)}
                        className="group flex items-start gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-primary/8 border border-primary/12 group-hover:bg-primary/14 transition-colors">
                          <item.icon size={15} className="text-primary" strokeWidth={1.6} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-medium text-foreground leading-tight">{item.title}</p>
                          <p className="text-[11.5px] text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    ))}

                    {/* HR as understated secondary line */}
                    <div className="col-span-2 mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-3 items-center">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/80 font-semibold">Ekstratjenester</span>
                      {tjenesterHr.map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setTjenesterOpen(false)} className="text-[12.5px] text-foreground/70 hover:text-primary transition-colors underline-offset-4 hover:underline">
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </DropdownPanel>
            </div>

            {/* Bransjer dropdown */}
            <div className="relative" {...makeHandlers(setBransjerOpen, bransjerRef)}>
              <Link to="/bransjer" onClick={() => setBransjerOpen(false)} className={dropBtnClass(bransjerOpen)}>
                Bransjer
                <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${bransjerOpen ? "rotate-180" : ""}`} />
              </Link>
              <DropdownPanel open={bransjerOpen} className="fixed top-[76px] left-0 right-0 z-50 bg-card border-b border-border shadow-[0_20px_60px_-30px_hsl(20_10%_12%/0.18)]">
                <div className="container mx-auto px-8 py-10">
                  <div className="mb-6 flex items-end justify-between border-b border-border/60 pb-4">
                    <div>
                      <p className="text-[10px] tracking-[0.35em] uppercase text-primary/80 font-semibold mb-1">Bransjeekspertise</p>
                      <h3 className="font-heading text-2xl text-foreground">Vi kjenner bransjen din — og tilpasser regnskapet deretter.</h3>
                    </div>
                    <Link to="/bransjer" onClick={() => setBransjerOpen(false)} className="text-[12px] text-primary font-medium hover:gap-2.5 inline-flex items-center gap-1.5 transition-all shrink-0">
                      Se alle 20+ bransjer <ArrowRight size={11} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-4 gap-x-6 gap-y-1">
                    {bransjerItems.map((item) => (
                      <Link key={item.href} to={item.href} onClick={() => setBransjerOpen(false)}
                        className="group flex items-start gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <item.icon size={14} className="text-primary mt-0.5 shrink-0" strokeWidth={1.6} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-foreground leading-tight">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </DropdownPanel>
            </div>

            <NavButton to="/priser" label="Priser" isActive={location.pathname.startsWith("/priser")} />

            {/* Ressurser dropdown */}
            <div className="relative" {...makeHandlers(setRessurserOpen, ressurserRef)}>
              <Link to="/ressurser" onClick={() => setRessurserOpen(false)} className={dropBtnClass(ressurserOpen)}>
                Ressurser <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${ressurserOpen ? "rotate-180" : ""}`} />
              </Link>
              <DropdownPanel open={ressurserOpen} className="absolute top-full right-0 mt-2 w-[560px] bg-card border border-border rounded-xl shadow-[0_20px_60px_-30px_hsl(20_10%_12%/0.22)] p-3">
                <div className="grid grid-cols-2 gap-1">
                  {ressurserLinks.map((item) => (
                    <Link key={item.href} to={item.href} onClick={() => setRessurserOpen(false)}
                      className="group flex items-start gap-3 py-3 px-3 rounded-lg hover:bg-muted/60 transition-colors">
                      <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-primary/8 border border-primary/12 group-hover:bg-primary/14 transition-colors">
                        <item.icon size={15} className="text-primary" strokeWidth={1.6} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-foreground leading-tight">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </DropdownPanel>
            </div>

            {/* CTAs */}
            <div className="ml-4 flex items-center gap-2 pl-4 border-l border-border/70">
              <Link
                to="/book-mote"
                className="px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-border text-foreground/85 hover:border-foreground hover:text-foreground transition-all duration-300 tracking-wide"
              >
                Book møte
              </Link>
              <Link
                to="/kontakt"
                className="px-5 py-2.5 text-[12.5px] font-medium bg-foreground text-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-wide"
              >
                Bli kunde
              </Link>
            </div>
          </div>

          {/* Mobile/tablet toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <Link to="/book-mote" className="min-h-[40px] px-4 py-2 text-[13px] font-medium rounded-full border border-border text-foreground/80 active:bg-muted transition-colors flex items-center">
              Book møte
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-foreground p-3 -mr-2 rounded-lg active:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={menuOpen ? "Lukk meny" : "Åpne meny"} aria-expanded={menuOpen}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────── */}
        <div
          className={`lg:hidden border-t border-border/70 bg-background overflow-y-auto transition-all duration-300 ease-out ${
            menuOpen ? "max-h-[calc(100dvh-64px)] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex flex-col p-5 pb-10 gap-0.5">
            <MobileGroup label="Tjenester" open={mobileTjenesterOpen} setOpen={setMobileTjenesterOpen} listHref="/tjenester" onNavigate={() => setMenuOpen(false)}>
              {tjenesterCore.map((item) => (
                <Link key={item.href} to={item.href} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] text-foreground/85 active:bg-muted transition-colors">
                  <item.icon size={13} className="text-primary shrink-0" strokeWidth={1.6} /> {item.title}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-border/60 flex flex-wrap gap-x-4 gap-y-1 px-3">
                <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/80 font-semibold w-full">Ekstratjenester</span>
                {tjenesterHr.map((item) => (
                  <Link key={item.href} to={item.href} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                    className="text-[13px] text-foreground/70 py-1.5">{item.title}</Link>
                ))}
              </div>
            </MobileGroup>

            <MobileGroup label="Bransjer" open={mobileBransjerOpen} setOpen={setMobileBransjerOpen} listHref="/bransjer" onNavigate={() => setMenuOpen(false)}>
              {bransjerItems.slice(0, 8).map((item) => (
                <Link key={item.href} to={item.href} onClick={() => { setMenuOpen(false); setMobileBransjerOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] text-foreground/85 active:bg-muted transition-colors">
                  <item.icon size={13} className="text-primary shrink-0" strokeWidth={1.6} /> {item.title}
                </Link>
              ))}
              <Link to="/bransjer" onClick={() => { setMenuOpen(false); setMobileBransjerOpen(false); }}
                className="px-3 py-2 text-[13px] text-primary font-medium tracking-wide">Se alle bransjer →</Link>
            </MobileGroup>

            <MobileNavLink to="/priser" label="Priser" onClick={() => setMenuOpen(false)} />

            <MobileGroup label="Ressurser" open={mobileRessurserOpen} setOpen={setMobileRessurserOpen} listHref="/ressurser" onNavigate={() => setMenuOpen(false)}>
              {ressurserLinks.map((item) => (
                <Link key={item.href} to={item.href} onClick={() => { setMenuOpen(false); setMobileRessurserOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] text-foreground/85 active:bg-muted transition-colors">
                  <item.icon size={13} className="text-primary shrink-0" strokeWidth={1.6} /> {item.title}
                </Link>
              ))}
            </MobileGroup>

            <Link to="/kontakt" onClick={() => setMenuOpen(false)} className="mt-6 px-5 min-h-[56px] py-4 text-[16px] font-semibold bg-foreground text-background rounded-full text-center flex items-center justify-center active:scale-[0.98] transition-all">
              Bli kunde
            </Link>
            <Link to="/book-mote" onClick={() => setMenuOpen(false)} className="mt-2 px-5 min-h-[52px] py-3 text-[15px] font-medium border border-border text-foreground rounded-full text-center flex items-center justify-center transition-all">
              Book møte
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumbs & main ───────────────────── */}
      <div className="pt-16 lg:pt-[76px]">
        <Breadcrumbs />
      </div>

      <main>{children}</main>

      <StickyMobileCta />
      <ExitIntentDialog />
      <FloatingActionMenu />

      {/* ── Footer — editorial masthead ─────────── */}
      <footer ref={footerRef} className="relative border-t border-border/70 bg-secondary text-secondary-foreground mt-16 md:mt-24 overflow-hidden">
        {/* Ambient glow — subtil parallax */}
        <div
          ref={footerGlowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70 will-change-transform"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 12% 0%, hsl(26 46% 45% / 0.18) 0%, transparent 55%), radial-gradient(ellipse at 88% 100%, hsl(137 20% 62% / 0.10) 0%, transparent 55%)",
            transition: "opacity 400ms ease-out",
          }}
        />

        {/* Giant editorial wordmark backdrop — subtil parallax */}
        <div
          ref={footerWordmarkRef}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 md:-bottom-16 left-0 right-0 text-center font-heading select-none whitespace-nowrap opacity-[0.045] leading-none will-change-transform"
        >
          <span className="text-[22vw] md:text-[18vw] tracking-tighter">Avargo</span>
        </div>


        <div className="relative container mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-8">
          {/* Editorial eyebrow rule */}
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[10px] tracking-[0.45em] uppercase text-accent font-semibold">Est. 2026</span>
            <span className="flex-1 h-px bg-gradient-to-r from-accent/40 via-secondary-foreground/15 to-transparent" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-secondary-foreground/60 font-medium hidden md:inline">Regnskap · Rådgivning</span>
          </div>

          {/* Masthead */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12">
            {/* Brand column */}
            <div className="md:col-span-5">
              <Link to="/" className="inline-flex items-center mb-6 group">
                <Logo
                  variant="full"
                  className="h-9 md:h-10 text-cream group-hover:text-accent transition-colors duration-500"
                />
              </Link>
              <p className="font-heading text-2xl md:text-[28px] leading-[1.15] mb-5 max-w-md">
                Regnskap for bedrifter som <span className="italic text-primary">tar seg selv på alvor</span>.
              </p>
              <p className="text-[13px] text-secondary-foreground/70 font-light leading-relaxed max-w-md mb-7">
                Autorisert regnskapsbyrå. Fast månedspris, dedikert regnskapsfører og rask respons på hverdager.
              </p>

              {/* Kontakt-blokk */}
              <div className="flex flex-col gap-2 text-[13px] mb-7">
                <a href="mailto:kontakt@avargo.no" className="inline-flex items-center gap-2 text-secondary-foreground/85 hover:text-accent transition-colors">
                  <Mail size={13} strokeWidth={1.7} className="text-accent" /> kontakt@avargo.no
                </a>
                <span className="inline-flex items-center gap-2 text-secondary-foreground/70">
                  <ShieldCheck size={13} strokeWidth={1.7} className="text-accent" /> Autorisert regnskapsbyrå · Org.nr 938 076 669
                </span>
              </div>

              <Link to="/kontakt" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-[12.5px] font-medium rounded-full hover:brightness-110 transition-all duration-300 tracking-wide">
                Få et uforpliktende tilbud <ArrowRight size={13} />
              </Link>
            </div>

            {/* Navigation columns */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <p className="text-[13px] tracking-[0.28em] uppercase text-accent font-bold mb-5 flex items-center gap-2">
                  <span className="h-px w-4 bg-accent/60" /> Tjenester
                </p>
                <div className="flex flex-col gap-3 text-[13px] font-light">
                  <Link to="/tjenester/regnskapsforer" className="text-secondary-foreground/75 hover:text-accent transition-colors">Dedikert regnskapsfører</Link>
                  <Link to="/tjenester/arsregnskap"   className="text-secondary-foreground/75 hover:text-accent transition-colors">Årsregnskap</Link>
                  <Link to="/tjenester/lonn"          className="text-secondary-foreground/75 hover:text-accent transition-colors">Lønn & rapportering</Link>
                  <Link to="/tjenester/skatteplanlegging" className="text-secondary-foreground/75 hover:text-accent transition-colors">Skatterådgivning</Link>
                  <Link to="/tjenester/cfo"           className="text-secondary-foreground/75 hover:text-accent transition-colors">CFO-rådgivning</Link>
                  <Link to="/tjenester" className="text-primary font-medium hover:opacity-80 transition-opacity">Alle tjenester →</Link>
                </div>
              </div>

              <div>
                <p className="text-[13px] tracking-[0.28em] uppercase text-accent font-bold mb-5 flex items-center gap-2">
                  <span className="h-px w-4 bg-accent/60" /> Ressurser
                </p>
                <div className="flex flex-col gap-3 text-[13px] font-light">
                  <Link to="/ressurser/kontohjelp"      className="text-secondary-foreground/75 hover:text-accent transition-colors">Kontohjelp</Link>
                  <Link to="/ressurser/skattekalender"  className="text-secondary-foreground/75 hover:text-accent transition-colors">Skattekalender</Link>
                  <Link to="/guider/regnskapsforer-pris" className="text-secondary-foreground/75 hover:text-accent transition-colors">Prisguide</Link>
                  <Link to="/regnskapsforer-i"          className="text-secondary-foreground/75 hover:text-accent transition-colors">Regnskapsfører i din by</Link>
                  <Link to="/bransjer"                  className="text-secondary-foreground/75 hover:text-accent transition-colors">Bransjer</Link>
                  <Link to="/faq"                       className="text-secondary-foreground/75 hover:text-accent transition-colors">Vanlige spørsmål</Link>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <p className="text-[13px] tracking-[0.28em] uppercase text-accent font-bold mb-5 flex items-center gap-2">
                  <span className="h-px w-4 bg-accent/60" /> Selskapet
                </p>
                <div className="flex flex-col gap-3 text-[13px] font-light">
                  <Link to="/om-oss"   className="text-secondary-foreground/75 hover:text-accent transition-colors">Om Avargo</Link>
                  <Link to="/kontakt"  className="text-secondary-foreground/75 hover:text-accent transition-colors">Kontakt oss</Link>
                  <Link to="/book-mote" className="text-secondary-foreground/75 hover:text-accent transition-colors">Book møte</Link>
                  <Link to="/karriere" className="text-secondary-foreground/75 hover:text-accent transition-colors">Karriere</Link>
                  <Link to="/logg-inn" className="text-secondary-foreground/75 hover:text-accent transition-colors">Logg inn</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-secondary-foreground/15 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">
            <span className="text-[11px] text-secondary-foreground/55 font-light tracking-wide">
              © {new Date().getFullYear()} Avargo Regnskap AS · Bygget med presisjon.
            </span>
            <div className="flex items-center gap-6 text-[11px] text-secondary-foreground/60 font-light">
              <Link to="/personvern" className="hover:text-accent transition-colors">Personvern</Link>
              <Link to="/vilkar"     className="hover:text-accent transition-colors">Vilkår</Link>
              <Link to="/sikkerhet"  className="hover:text-accent transition-colors">Sikkerhet</Link>
            </div>
          </div>
        </div>
      </footer>

      <AdminFloatingBar />
    </div>
  );
};

/* ── Helper components ─────────────────────────── */
const NavButton = ({ to, label, isActive }: { to: string; label: string; isActive?: boolean }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-[13px] tracking-wide font-normal transition-all duration-200 ${
      isActive ? "text-foreground bg-muted/70" : "text-foreground/75 hover:text-foreground hover:bg-muted/40"
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link to={to} onClick={onClick} className="flex items-center min-h-[52px] py-4 text-[15px] text-foreground/90 active:bg-muted -mx-2 px-2 rounded-lg transition-colors border-b border-border/60 tracking-wide">
    {label}
  </Link>
);

const MobileGroup = ({
  label, open, setOpen, listHref, onNavigate, children,
}: {
  label: string; open: boolean; setOpen: (v: boolean) => void; listHref?: string; onNavigate: () => void; children: React.ReactNode;
}) => (
  <>
    <div className="flex items-center justify-between min-h-[52px] py-4 text-[15px] text-foreground/90 -mx-2 px-2 rounded-lg border-b border-border/60 tracking-wide">
      {listHref ? (
        <Link to={listHref} onClick={onNavigate} className="flex-1">{label}</Link>
      ) : (
        <span className="flex-1">{label}</span>
      )}
      <button onClick={() => setOpen(!open)} className="p-2 -mr-2 rounded-lg active:bg-muted">
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
    <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="py-2 pl-1 flex flex-col gap-0.5">{children}</div>
    </div>
  </>
);

export default Layout;
