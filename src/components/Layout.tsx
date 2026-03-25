import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useMemo } from "react";
import AdminFloatingBar from "@/components/AdminFloatingBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSection, SECTION_LIST, SECTIONS, type SectionId } from "@/contexts/SectionContext";
import { sectionTjenesterGroups } from "@/config/sectionContent";
import avargoLogo from "@/assets/avargo-logo.png";
import {
  Menu, X, ChevronDown, ChevronRight, BookOpen, TrendingUp, Briefcase, Users,
  LayoutTemplate, Search, Megaphone, Globe, ShoppingCart, Bot,
  Building2, Landmark, HardHat, Store, Heart, Tractor, Zap,
  Mail, Info, FileText, BookMarked, Newspaper, Lock, Archive, CalendarClock,
  GraduationCap, Calculator, HelpCircle, Download, Flame, ArrowRight, Layers,
  Monitor, Code, Cpu, Receipt, PieChart, BarChart3, UserPlus, Scale,
} from "lucide-react";

/** Maps tjenester group label → section basePath for auto-routing */
const groupSectionMap: Record<string, string> = {
  "Regnskap & Økonomi": "/regnskap",
  "HR & Personal": "/hr",
  "Markedsføring & Vekst": "/markedsforing",
  "IT & Utvikling": "/it",
};

/** Maps tjenester group label → SectionId for accent colors */
const groupSectionIdMap: Record<string, string> = {
  "Regnskap & Økonomi": "regnskap",
  "HR & Personal": "hr",
  "Markedsføring & Vekst": "markedsforing",
  "IT & Utvikling": "it",
};

const tjenesterGroups = [
  {
    label: "Regnskap & Økonomi",
    items: [
      { icon: BookOpen, title: "Dedikert regnskapsfører", desc: "Din faste kontaktperson for alt regnskap", href: "/tjenester/regnskapsforer" },
      { icon: Receipt, title: "Lønn & lønnskjøring", desc: "Automatisert lønnskjøring og rapportering", href: "/tjenester/lonn" },
      { icon: PieChart, title: "Årsregnskap & skattemelding", desc: "Komplett årsoppgjør og innlevering", href: "/tjenester/arsregnskap" },
      { icon: Briefcase, title: "CFO-as-a-Service", desc: "Strategisk økonomisk rådgivning", href: "/tjenester/cfo" },
      { icon: Receipt, title: "Fakturering & innkreving", desc: "Effektiv fakturering og oppfølging", href: "/tjenester/fakturering" },
      { icon: TrendingUp, title: "Skatteplanlegging", desc: "Optimaliser skatteposisjonen din", href: "/tjenester/skatteplanlegging" },
      { icon: BarChart3, title: "1-1 Regnskap", desc: "Personlig regnskapsoppfølging", href: "/tjenester/1-1-regnskap" },
      { icon: Monitor, title: "Avargo Dashboard", desc: "Sanntidsoversikt over økonomien", href: "/tjenester/dashboard" },
    ],
  },
  {
    label: "HR & Personal",
    items: [
      { icon: Users, title: "Lønn & HR-administrasjon", desc: "Komplett HR-løsning for din bedrift", href: "/tjenester/hr-og-lonn" },
      { icon: UserPlus, title: "Ansettelse & rekruttering", desc: "Finn og ansett riktig kandidat", href: "/tjenester/ansettelse" },
      { icon: FileText, title: "Personalhåndbok", desc: "Skreddersydde retningslinjer", href: "/tjenester/personalhandbok" },
      { icon: Scale, title: "Arbeidsrett & HMS", desc: "Juridisk trygghet og HMS-system", href: "/tjenester/arbeidsrett" },
    ],
  },
  {
    label: "Markedsføring & Vekst",
    items: [
      { icon: Search, title: "SEO & søkbarhet", desc: "Bli funnet av kundene dine", href: "/tjenester/seo" },
      { icon: Megaphone, title: "Meta-annonser", desc: "Facebook & Instagram-annonsering", href: "/tjenester/meta-annonser" },
      { icon: Globe, title: "Google Ads", desc: "Målrettet annonsering på Google", href: "/tjenester/google-ads" },
      { icon: ShoppingCart, title: "Nettbutikk & e-handel", desc: "Salgsplattform som konverterer", href: "/tjenester/nettbutikk" },
    ],
  },
  {
    label: "IT & Utvikling",
    items: [
      { icon: Monitor, title: "Skreddersydde nettsider", desc: "Unikt design som skiller seg ut", href: "/tjenester/nettsider" },
      { icon: Bot, title: "AI-chatbot & kundeservice", desc: "Automatisert kundehåndtering 24/7", href: "/tjenester/chatbot" },
      { icon: Code, title: "Interne systemer", desc: "Skreddersydde verktøy for teamet", href: "/tjenester/internsystemer" },
      { icon: Cpu, title: "AI & automatisering", desc: "Smartere drift med AI-løsninger", href: "/tjenester/ai-automatisering" },
    ],
  },
];

const bransjerItems = [
  { icon: Globe, title: "Tech & SaaS", desc: "Skalerbar økonomistyring tilpasset abonnementsmodeller, MRR-rapportering og investorkommunikasjon.", href: "/bransjer/tech-saas" },
  { icon: Building2, title: "Eiendom & Utvikling", desc: "Prosjektregnskap, avskrivninger og skatteoptimalisering for eiendomsselskaper og utviklere.", href: "/bransjer/eiendom" },
  { icon: Landmark, title: "Holding & Investering", desc: "Konsernregnskap, utbytteplanlegging og strukturering for holdingselskaper med flere datterselskaper.", href: "/bransjer/holding" },
  { icon: Briefcase, title: "Consulting & Rådgivning", desc: "Prosjektbasert fakturering, timeregnskap og lønnsomhetsanalyse for rådgivningsfirmaer.", href: "/bransjer/consulting" },
  { icon: Tractor, title: "Landbruk", desc: "Spesialtilpasset regnskapsføring med jordbruksfradrag, tilskuddsrapportering og MVA på landbruk.", href: "/bransjer/landbruk" },
  { icon: HardHat, title: "Bygg & Anlegg", desc: "Prosjektregnskap med løpende avregning, underentreprenørhåndtering og HMS-dokumentasjon.", href: "/bransjer/bygg-anlegg" },
  { icon: Store, title: "Nettbutikk & E-commerce", desc: "Varelagerføring, integrasjon med Shopify/WooCommerce og MVA på tvers av landegrenser.", href: "/bransjer/nettbutikk" },
  { icon: Heart, title: "Helse & Velvære", desc: "Regnskap for klinikker, terapeuter og helsebedrifter med fokus på merverdiavgift og konsesjoner.", href: "/bransjer/helse" },
  { icon: TrendingUp, title: "Restaurant & Uteliv", desc: "Daglig kassaoppgjør, varekostkontroll og personaladministrasjon for serveringsbransjen.", href: "/bransjer/restaurant" },
  { icon: Users, title: "Frisør & Skjønnhet", desc: "Stolleie-modeller, MVA på tjenester og enkel økonomistyring for frisør- og skjønnhetssalonger.", href: "/bransjer/frisor" },
  { icon: Zap, title: "Håndverkere & Fagfolk", desc: "Fakturering, prosjektoppfølging og skatteplanlegging skreddersydd for håndverksbedrifter.", href: "/bransjer/handverkere" },
];

const selskapetLinks = [
  { icon: Users, title: "Kundeportal", desc: "Logg inn for å se regnskapet ditt, dokumenter og kommunisere med din rådgiver — alt samlet i én oversiktlig portal.", href: "/kunde/logg-inn", absolute: true },
  { icon: Lock, title: "Ansatte-login", desc: "Intern portal for Avargo-teamet med tilgang til arbeidsverktøy, kundedata og samarbeidsplattformen.", href: "/admin/logg-inn", absolute: true },
  { icon: Mail, title: "Kontakt oss", desc: "Få et uforpliktende tilbud eller still spørsmål om våre tjenester. Vi svarer normalt innen én arbeidsdag.", href: "/kontakt", absolute: false },
  { icon: Info, title: "Om Avargo", desc: "Møt teamet bak Avargo. Les om vår visjon, metode og hva som driver oss til å levere bedre løsninger for norske bedrifter.", href: "/om-oss", absolute: false },
  { icon: Briefcase, title: "Karriere", desc: "Se ledige stillinger og bli en del av et voksende team. Vi ser etter dyktige mennesker innen regnskap, HR, marked og teknologi.", href: "/karriere", absolute: true },
];

const ressurserLinks: { icon: typeof BookOpen; title: string; desc: string; href: string; accent?: string; featured?: boolean }[] = [
  { icon: GraduationCap, title: "Avargo Kurs", desc: "Over 130 kurs innen regnskap, HR og ledelse. Tilgjengelig digitalt med kursbevis — perfekt for å holde teamet oppdatert.", href: "/kurs", accent: "hsl(var(--primary))", featured: true },
  { icon: Calculator, title: "Kontohjelp", desc: "Søk opp riktig konto for bokføring. Vår kontoguide dekker alle vanlige og spesielle posteringer med eksempler og forklaringer.", href: "/ressurser/kontohjelp", accent: "hsl(45 80% 60%)" },
  { icon: Newspaper, title: "Nyheter", desc: "Hold deg oppdatert på endringer i skatteregler, nye lover og viktige frister som påvirker bedriften din.", href: "/ressurser?tab=nyheter" },
  { icon: Flame, title: "Blogg", desc: "Fagartikler og praktiske tips om regnskap, økonomi, HR og vekst — skrevet for norske bedriftseiere.", href: "/ressurser?tab=blogg" },
  { icon: BookMarked, title: "Guider", desc: "Steg-for-steg guider til alt fra MVA-registrering og ansettelse til årsoppgjør og skatteplanlegging.", href: "/ressurser?tab=guider" },
  { icon: Download, title: "Arkiv & maler", desc: "Last ned gratis maler, sjekklister og skjemaer. Alt du trenger for å holde orden på bedriftens dokumenter.", href: "/ressurser?tab=arkiv" },
  { icon: CalendarClock, title: "Skattekalender", desc: "Oversikt over alle viktige frister for MVA, skattemelding, årsregnskap og a-melding gjennom hele året.", href: "/ressurser/skattekalender" },
];

/* ── Dropdown panel ─────────────────────────────── */
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

/* ── Accent helper ──────────────────────────────── */
const accentHsl = (sId: string) => {
  const s = SECTIONS[sId as SectionId];
  return s ? `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)` : undefined;
};
const accentBg = (sId: string, opacity = 0.1) => {
  const s = SECTIONS[sId as SectionId];
  return s ? `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / ${opacity})` : undefined;
};

/* ── Consistent dropdown item ───────────────────── */
const DropdownItem = ({
  to,
  icon: Icon,
  title,
  desc,
  onClick,
  iconColor,
  iconBg,
}: {
  to: string;
  icon: typeof BookOpen;
  title: string;
  desc?: string;
  onClick?: () => void;
  iconColor?: string;
  iconBg?: string;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 group/item transition-all duration-200"
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
      style={{ backgroundColor: iconBg || "hsl(var(--primary) / 0.1)", }}
    >
      <Icon size={14} style={{ color: iconColor || "hsl(var(--primary))" }} strokeWidth={1.5} />
    </div>
    <div className="min-w-0">
      <p className="text-[13px] text-foreground/90 group-hover/item:text-foreground font-medium transition-colors leading-tight">{title}</p>
      {desc && <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{desc}</p>}
    </div>
  </Link>
);

/* ══════════════════════════════════════════════════
   LAYOUT
   ══════════════════════════════════════════════════ */
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { section, isInSection } = useSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tjenesterOpen, setTjenesterOpen] = useState(false);
  const [bransjerOpen, setBransjerOpen] = useState(false);
  const [selskapetOpen, setSelskapetOpen] = useState(false);
  const [ressurserOpen, setRessurserOpen] = useState(false);
  const [mobileTjenesterOpen, setMobileTjenesterOpen] = useState(false);
  const [mobileBransjerOpen, setMobileBransjerOpen] = useState(false);
  const [mobileSelskapetOpen, setMobileSelskapetOpen] = useState(false);

  const tjenesterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bransjerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selskapetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ressurserRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const closeAll = () => { setTjenesterOpen(false); setBransjerOpen(false); setSelskapetOpen(false); setRessurserOpen(false); };

  const sp = (path: string) => isInSection && section ? `${section.basePath}${path}` : path;

  const tjenesterPath = (href: string, groupLabel: string) => {
    if (isInSection && section) return `${section.basePath}${href}`;
    return `${groupSectionMap[groupLabel] || ""}${href}`;
  };

  const visibleTjenesterGroups = useMemo(() => {
    if (!isInSection || !section) return tjenesterGroups;
    const allowed = sectionTjenesterGroups[section.id];
    return tjenesterGroups.filter(g => allowed.includes(g.label));
  }, [isInSection, section]);

  const makeHandlers = (
    setter: (v: boolean) => void,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) => ({
    onMouseEnter: () => { if (timerRef.current) clearTimeout(timerRef.current); closeAll(); setter(true); },
    onMouseLeave: () => { timerRef.current = setTimeout(() => setter(false), 150); },
  });

  const sectionAccent = isInSection && section ? accentHsl(section.id) : undefined;

  /* Shared dropdown button style */
  const dropBtnClass = (isOpen: boolean) =>
    `flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] tracking-wide font-light transition-all duration-200 ${
      isOpen ? "bg-primary/10 text-foreground" : "text-foreground/80 hover:text-foreground hover:bg-muted/40"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* ── NAV BAR ────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-background/80">
        {isInSection && section && (
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${sectionAccent}, transparent)` }} />
        )}

        <div className="container mx-auto flex items-center justify-between h-16 md:h-[72px] px-4 md:px-6">
          {/* Logo */}
          {isInSection && section ? (
            <span className="font-heading text-xl md:text-2xl tracking-wide flex items-baseline gap-1">
              <Link to="/" className="text-primary hover:text-primary/80 transition-colors">Avargo</Link>
              <span className="text-foreground/30">·</span>
              <Link to={section.basePath} className="transition-colors text-lg" style={{ color: sectionAccent }}>
                {section.shortName}
              </Link>
            </span>
          ) : (
            <Link to="/" className="font-heading text-xl md:text-2xl text-primary tracking-wide">Avargo</Link>
          )}

          {/* ── Desktop nav ─────────────────────────── */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <NavButton to="/" label="Hjem" isActive={location.pathname === "/"} />
            

            {/* ─── Tjenester dropdown ─── */}
            <div className="relative" {...makeHandlers(setTjenesterOpen, tjenesterRef)}>
              <button className={dropBtnClass(tjenesterOpen)}>
                Tjenester <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${tjenesterOpen ? "rotate-180" : ""}`} />
              </button>

              <DropdownPanel
                open={tjenesterOpen}
                className="fixed top-[72px] left-0 right-0 z-50 bg-card border-b border-border/20 shadow-2xl"
              >
                {isInSection && section && (
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent 10%, ${sectionAccent} 50%, transparent 90%)` }} />
                )}
                <div className="container mx-auto px-6 py-8">
                  {isInSection && section ? (
                    /* ── Section view: same rich card layout as hub ── */
                    (() => {
                      const currentGroup = tjenesterGroups.find(g => groupSectionIdMap[g.label] === section.id);
                      const otherGroups = tjenesterGroups.filter(g => groupSectionIdMap[g.label] !== section.id);
                      return (
                        <div className="relative">
                          {/* Small department links in top-right corner */}
                          <div className="absolute top-0 right-0 flex items-center gap-4 z-10">
                            {otherGroups.map(g => {
                              const sId = groupSectionIdMap[g.label];
                              const accent = accentHsl(sId);
                              const targetPath = groupSectionMap[g.label] || "";
                              const sData = SECTIONS[sId as SectionId];
                              return (
                                <Link
                                  key={g.label}
                                  to={`${targetPath}/tjenester`}
                                  onClick={() => setTjenesterOpen(false)}
                                  className="group/dept flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-border/20 transition-all duration-300"
                                  style={{ color: accent }}
                                >
                                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: accentBg(sId, 0.15) }}>
                                    <Layers size={10} style={{ color: accent }} strokeWidth={1.5} />
                                  </div>
                                  <span className="text-[11px] tracking-wide font-medium opacity-60 group-hover/dept:opacity-100 transition-opacity">{sData?.shortName}</span>
                                  <ArrowRight size={9} className="opacity-0 group-hover/dept:opacity-60 -ml-1 transition-all duration-200" />
                                </Link>
                              );
                            })}
                          </div>

                          {/* Section heading */}
                          <div className="mb-6">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-300" style={{ backgroundColor: accentBg(section.id, 0.15), borderColor: accentBg(section.id, 0.25) }}>
                                <Layers size={17} style={{ color: sectionAccent }} strokeWidth={1.5} />
                              </div>
                              <div>
                                <h3 className="font-heading text-lg" style={{ color: sectionAccent }}>{section.name}</h3>
                                <p className="text-[12px] text-foreground/50 font-light">{section.tagline}</p>
                              </div>
                            </div>
                          </div>

                          {/* Current section services in rich card grid */}
                          <div className="grid grid-cols-4 gap-5">
                            {(currentGroup?.items || []).map(item => (
                              <Link
                                key={item.href}
                                to={`${section.basePath}${item.href}`}
                                onClick={() => setTjenesterOpen(false)}
                                className="group relative p-6 rounded-2xl border border-border/15 hover:border-border/40 transition-all duration-300 overflow-hidden"
                                style={{ backgroundColor: accentBg(section.id, 0.06) }}
                              >
                                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl" style={{ backgroundColor: sectionAccent }} />
                                <div className="relative">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border transition-colors duration-300" style={{ backgroundColor: accentBg(section.id, 0.15), borderColor: accentBg(section.id, 0.25) }}>
                                    <item.icon size={17} style={{ color: sectionAccent }} strokeWidth={1.5} />
                                  </div>
                                  <h3 className="font-heading text-base mb-1.5 text-foreground/90 group-hover:text-foreground transition-colors">{item.title}</h3>
                                  <p className="text-[12px] text-foreground/60 font-light leading-relaxed mb-4">{item.desc}</p>
                                  <div className="flex items-center gap-1.5 text-[12px] font-medium opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: sectionAccent }}>
                                    Les mer <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                  /* ── Hub view: department cards grid ── */
                  <div className="grid gap-5 grid-cols-4">
                    {tjenesterGroups.map((group) => {
                        const sId = groupSectionIdMap[group.label];
                        const accent = accentHsl(sId);
                        const bg = accentBg(sId, 0.06);
                        const targetPath = groupSectionMap[group.label] || "";
                        const sectionData = SECTIONS[sId as SectionId];
                        return (
                          <Link
                            key={group.label}
                            to={`${targetPath}/tjenester`}
                            onClick={() => setTjenesterOpen(false)}
                            className="group relative p-6 rounded-2xl border border-border/15 hover:border-border/40 transition-all duration-300 overflow-hidden"
                            style={{ backgroundColor: bg }}
                          >
                            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl" style={{ backgroundColor: accent }} />
                            <div className="relative">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border transition-colors duration-300" style={{ backgroundColor: accentBg(sId, 0.15), borderColor: accentBg(sId, 0.25) }}>
                                <Layers size={17} style={{ color: accent }} strokeWidth={1.5} />
                              </div>
                              <h3 className="font-heading text-base mb-1.5" style={{ color: accent }}>{group.label}</h3>
                              <p className="text-[12px] text-foreground/65 font-light leading-relaxed mb-4">
                                {sectionData?.tagline}
                              </p>
                              <div className="space-y-2 mb-4">
                                {group.items.slice(0, 4).map(item => (
                                  <div key={item.href} className="flex items-center gap-2 text-[12px] text-foreground/75">
                                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} />
                                    {item.title}
                                  </div>
                                ))}
                                {group.items.length > 4 && (
                                  <p className="text-[11px] text-foreground/50 pl-3">+{group.items.length - 4} mer</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[12px] font-medium opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
                                Utforsk <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  )}
                </div>
              </DropdownPanel>
            </div>

            {/* ─── Bransjer dropdown (all sections + hub) ─── */}
            {isInSection && section ? (
              section.id === "regnskap" ? (
              <div className="relative" {...makeHandlers(setBransjerOpen, bransjerRef)}>
                <button className={dropBtnClass(bransjerOpen)}>
                  Bransjer <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${bransjerOpen ? "rotate-180" : ""}`} />
                </button>
                <DropdownPanel open={bransjerOpen} className="fixed top-[72px] left-0 right-0 z-50 bg-card border-b border-border/20 shadow-2xl">
                  <div className="container mx-auto px-6 py-8">
                    <div className="mb-6">
                      <p className="text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-1">Bransjeekspertise</p>
                      <h3 className="font-heading text-lg text-foreground/90">Vi forstår din bransje — og tilpasser regnskapet deretter.</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {bransjerItems.map((item) => (
                        <Link
                          key={item.href}
                          to={sp(item.href)}
                          onClick={() => setBransjerOpen(false)}
                          className="group relative p-5 rounded-2xl border border-border/15 hover:border-border/40 transition-all duration-300 overflow-hidden bg-muted/20 hover:bg-muted/40"
                        >
                          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl bg-primary" />
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-primary/15 bg-primary/8 group-hover:bg-primary/15 transition-colors duration-300">
                              <item.icon size={17} className="text-primary" strokeWidth={1.5} />
                            </div>
                            <h4 className="font-heading text-sm mb-1.5 text-foreground/90 group-hover:text-foreground transition-colors">{item.title}</h4>
                            <p className="text-[11px] text-foreground/55 font-light leading-relaxed mb-3">{item.desc}</p>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-primary/70 group-hover:text-primary transition-colors">
                              Les mer <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      ))}
                      {/* "Se alle" card filling the empty grid slot */}
                      <Link
                        to={sp("/bransjer")}
                        onClick={() => setBransjerOpen(false)}
                        className="group relative p-5 rounded-2xl border border-dashed border-primary/25 hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center bg-primary/[0.03] hover:bg-primary/[0.08]"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-2xl bg-primary" />
                        <div className="relative flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-primary/20 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                            <ArrowRight size={20} className="text-primary group-hover:translate-x-0.5 transition-transform duration-300" />
                          </div>
                          <div>
                            <h4 className="font-heading text-sm text-primary/80 group-hover:text-primary transition-colors mb-1">Se alle bransjer</h4>
                            <p className="text-[11px] text-foreground/45 font-light">Utforsk alle {bransjerItems.length}+ bransjer vi dekker</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </DropdownPanel>
              </div>
              ) : (
              <NavButton to={sp("/bransjer")} label="Bransjer" isActive={location.pathname.includes("/bransjer")} />
              )
            ) : null}

            {/* Priser — only show in sections */}
            {isInSection && section && (
              <NavButton to={sp("/priser")} label="Priser" isActive={location.pathname.includes("/priser")} />
            )}

            {/* ─── Selskapet dropdown ─── */}
            <div className="relative" {...makeHandlers(setSelskapetOpen, selskapetRef)}>
              <button className={dropBtnClass(selskapetOpen)}>
                Selskapet <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${selskapetOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={selskapetOpen} className="fixed top-[72px] left-0 right-0 z-50 bg-card border-b border-border/20 shadow-2xl">
                <div className="container mx-auto px-6 py-8">
                  <div className="mb-6">
                    <p className="text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-1">Avargo</p>
                    <h3 className="font-heading text-lg text-foreground/90">Bli kjent med oss — eller logg inn på din portal.</h3>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {selskapetLinks.map((item) => (
                      <Link
                        key={item.href}
                        to={item.absolute ? item.href : sp(item.href)}
                        onClick={() => setSelskapetOpen(false)}
                        className="group relative p-5 rounded-2xl border border-border/15 hover:border-border/40 transition-all duration-300 overflow-hidden bg-muted/20 hover:bg-muted/40"
                      >
                        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl bg-primary" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-primary/15 bg-primary/8 group-hover:bg-primary/15 transition-colors duration-300">
                            <item.icon size={17} className="text-primary" strokeWidth={1.5} />
                          </div>
                          <h4 className="font-heading text-sm mb-1.5 text-foreground/90 group-hover:text-foreground transition-colors">{item.title}</h4>
                          <p className="text-[11px] text-foreground/55 font-light leading-relaxed">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </DropdownPanel>
            </div>

            {/* ─── Ressurser dropdown — only on hub ─── */}
            {!isInSection && (
              <div className="relative" {...makeHandlers(setRessurserOpen, ressurserRef)}>
                <button className={dropBtnClass(ressurserOpen)}>
                  Ressurser <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${ressurserOpen ? "rotate-180" : ""}`} />
                </button>
                <DropdownPanel open={ressurserOpen} className="fixed top-[72px] left-0 right-0 z-50 bg-card border-b border-border/20 shadow-2xl">
                  <div className="container mx-auto px-6 py-8">
                    <div className="mb-6">
                      <p className="text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-1">Kunnskapssenter</p>
                      <h3 className="font-heading text-lg text-foreground/90">Kurs, guider og verktøy som gjør deg smartere — helt gratis.</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {ressurserLinks.map((item) => {
                        const itemAccent = item.accent || "hsl(var(--primary))";
                        const itemBg = item.accent ? `${item.accent.replace(")", " / 0.08)")}` : "hsl(var(--primary) / 0.08)";
                        const itemBorder = item.accent ? `${item.accent.replace(")", " / 0.15)")}` : "hsl(var(--primary) / 0.15)";
                        return (
                          <Link
                            key={item.title}
                            to={item.href.startsWith("/kurs") || item.href.startsWith("/ressurser") ? item.href : sp(item.href)}
                            onClick={() => setRessurserOpen(false)}
                            className={`group relative p-5 rounded-2xl border border-border/15 hover:border-border/40 transition-all duration-300 overflow-hidden ${item.featured ? "col-span-2 row-span-1" : ""} bg-muted/20 hover:bg-muted/40`}
                          >
                            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl" style={{ backgroundColor: itemAccent }} />
                            <div className="relative">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border transition-colors duration-300" style={{ backgroundColor: itemBg, borderColor: itemBorder }}>
                                <item.icon size={17} style={{ color: itemAccent }} strokeWidth={1.5} />
                              </div>
                              <h4 className="font-heading text-sm mb-1.5 text-foreground/90 group-hover:text-foreground transition-colors">{item.title}</h4>
                              <p className="text-[11px] text-foreground/55 font-light leading-relaxed">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </DropdownPanel>
              </div>
            )}


            {/* CTA button */}
            <Link
              to={sp("/kontakt")}
              className="ml-2 px-5 lg:px-6 py-2.5 text-[12px] font-medium bg-primary text-primary-foreground rounded-full hover:scale-[1.02] transition-all duration-500 tracking-wide shadow-lg shadow-primary/20"
            >
              Få tilbud
            </Link>
          </div>

          {/* Mobile: login buttons + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/kunde/logg-inn" className="px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border/20 text-foreground/80 active:bg-muted/40 transition-colors">
              Kunde
            </Link>
            <Link to="/admin/logg-inn" className="px-3 py-1.5 text-[11px] font-medium rounded-lg border border-primary/30 text-primary bg-primary/5 active:bg-primary/10 transition-colors">
              Admin
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-foreground p-2.5 -mr-2 rounded-xl active:bg-muted/40 transition-colors" aria-label="Åpne meny">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────── */}
        <div
          className={`md:hidden border-t border-border/15 bg-background backdrop-blur-2xl overflow-y-auto transition-all duration-300 ease-out ${
            menuOpen ? "max-h-[calc(100dvh-64px)] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col p-5 pb-8 gap-0.5">
            {isInSection && section && (
              <div className="mb-4 p-3 rounded-xl border" style={{ borderColor: accentBg(section.id, 0.3), backgroundColor: accentBg(section.id, 0.06) }}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-1">Du er i</p>
                <p className="font-heading text-base" style={{ color: sectionAccent }}>{section.name}</p>
              </div>
            )}

            <MobileNavLink to="/" label="Hjem" onClick={() => setMenuOpen(false)} />
            


            {/* Mobile Tjenester */}
            <button onClick={() => setMobileTjenesterOpen(!mobileTjenesterOpen)} className="flex items-center justify-between py-3.5 text-[15px] text-foreground/90 border-b border-border/15 tracking-wide w-full">
              Tjenester <ChevronDown size={14} className={`transition-transform duration-200 ${mobileTjenesterOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileTjenesterOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="py-2 pl-1 flex flex-col gap-0.5">
                {visibleTjenesterGroups.map((group) => {
                  const sId = groupSectionIdMap[group.label];
                  const accent = accentHsl(sId);
                  return (
                    <div key={group.label}>
                      {!isInSection && (
                        <p className="text-[11px] tracking-[0.25em] uppercase font-medium mt-3 mb-1.5 px-3" style={{ color: accent }}>{group.label}</p>
                      )}
                      {(!isInSection ? group.items.slice(0, 2) : group.items).map(item => (
                        <Link key={item.href} to={tjenesterPath(item.href, group.label)} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-foreground/85 active:text-foreground active:bg-primary/5 transition-colors"
                        >
                          <item.icon size={14} className="shrink-0" style={{ color: isInSection ? sectionAccent : accent }} strokeWidth={1.5} />
                          {item.title}
                        </Link>
                      ))}
                      {!isInSection && group.items.length > 2 && (
                        <Link to={`${groupSectionMap[group.label]}/tjenester`} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                          className="px-3 py-1 text-[12px] font-medium" style={{ color: accent }}>
                          +{group.items.length - 2} mer →
                        </Link>
                      )}
                    </div>
                  );
                })}
                <Link to={sp("/tjenester")} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                  className="px-3 py-2 text-[13px] text-primary font-medium tracking-wide mt-1">
                  Se alle tjenester →
                </Link>
              </div>
            </div>

            {/* Mobile Bransjer */}
            {isInSection && section && (
              <>
                <button onClick={() => setMobileBransjerOpen(!mobileBransjerOpen)} className="flex items-center justify-between py-3.5 text-[15px] text-foreground/90 border-b border-border/15 tracking-wide w-full">
                  Bransjer <ChevronDown size={14} className={`transition-transform duration-200 ${mobileBransjerOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileBransjerOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="py-2 pl-1 flex flex-col gap-0.5">
                    {bransjerItems.slice(0, 6).map((item) => (
                      <Link key={item.href} to={sp(item.href)} onClick={() => { setMenuOpen(false); setMobileBransjerOpen(false); }}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-foreground/85 active:text-foreground active:bg-primary/5 transition-colors"
                      >
                        <item.icon size={14} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                      </Link>
                    ))}
                    <Link to={sp("/bransjer")} onClick={() => { setMenuOpen(false); setMobileBransjerOpen(false); }}
                      className="px-3 py-2 text-[13px] text-primary font-medium tracking-wide">
                      Se alle bransjer →
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Mobile Priser */}
            {isInSection && section && (
              <MobileNavLink to={sp("/priser")} label="Priser" onClick={() => setMenuOpen(false)} />
            )}

            {/* ─── Direct links: Om oss, Karriere, Akademi ─── */}
            <MobileNavLink to={sp("/om-oss")} label="Om oss" onClick={() => setMenuOpen(false)} />
            <MobileNavLink to="/karriere" label="Karriere" onClick={() => setMenuOpen(false)} />
            <MobileNavLink to="/kurs" label="Akademi" onClick={() => setMenuOpen(false)} />

            {/* Mobile Selskapet */}
            <button onClick={() => setMobileSelskapetOpen(!mobileSelskapetOpen)} className="flex items-center justify-between py-3.5 text-[15px] text-foreground/90 border-b border-border/15 tracking-wide w-full">
              Mer <ChevronDown size={14} className={`transition-transform duration-200 ${mobileSelskapetOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileSelskapetOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="py-2 pl-1 flex flex-col gap-0.5">
                {selskapetLinks.filter(item => item.href !== "/om-oss" && item.href !== "/karriere").map(item => (
                  <Link key={item.href} to={item.absolute ? item.href : sp(item.href)} onClick={() => { setMenuOpen(false); setMobileSelskapetOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-foreground/85 active:text-foreground active:bg-primary/5 transition-colors"
                  >
                    <item.icon size={14} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Ressurser */}
            {!isInSection && (
              <MobileNavLink to="/ressurser" label="Ressurser" onClick={() => setMenuOpen(false)} />
            )}

            {/* Cross-navigation on mobile when in section */}
            {isInSection && section && (
              <div className="mt-4 mb-2">
                <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-2 font-medium">Andre avdelinger</p>
                <div className="flex flex-wrap gap-2">
                  {SECTION_LIST.filter(s => s.id !== section.id).map(s => (
                    <Link
                      key={s.id}
                      to={s.basePath}
                      onClick={() => setMenuOpen(false)}
                      className="px-3.5 py-2 rounded-xl text-[12px] font-medium border transition-all active:scale-95"
                      style={{ color: accentHsl(s.id), borderColor: accentBg(s.id, 0.25), backgroundColor: accentBg(s.id, 0.08) }}
                    >
                      {s.shortName}
                    </Link>
                  ))}
                  <Link to="/" onClick={() => setMenuOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-[12px] font-medium text-primary border border-primary/25 bg-primary/5 transition-all active:scale-95">
                    Avargo
                  </Link>
                </div>
              </div>
            )}

            {/* CTA */}
            <Link to={sp("/kontakt")} onClick={() => setMenuOpen(false)} className="mt-4 px-5 py-3.5 text-[15px] font-medium bg-primary text-primary-foreground rounded-2xl text-center active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
              Få tilbud
            </Link>
          </div>
        </div>

        {/* Bottom border */}
        <div className="h-px w-full bg-border/20" />
      </nav>

      {/* ── Breadcrumbs ────────────────────────────── */}
      <div className="pt-16 md:pt-[72px]">
        <Breadcrumbs />
      </div>

      <main>{children}</main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="relative overflow-hidden">
        {/* CTA band */}
        <div className="relative border-t border-border/10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
          <div className="container mx-auto px-5 md:px-6 relative py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl md:text-2xl text-foreground mb-1">Klar for en enklere hverdag?</h3>
              <p className="text-sm text-foreground/60 font-light">La oss ta en uforpliktende prat om hvordan vi kan hjelpe din bedrift.</p>
            </div>
            <Link to={sp("/kontakt")} className="shrink-0 px-8 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-primary/25">
              Få tilbud →
            </Link>
          </div>
        </div>

        {/* Main footer */}
        <div className="border-t border-border/10">
          <div className="absolute inset-0 ambient-glow opacity-10" />
          <div className="container mx-auto px-5 md:px-6 relative pt-12 md:pt-20 pb-8">
            {/* Logo top center */}
            <div className="flex justify-center mb-12 md:mb-16">
              <Link to="/">
                <img src={avargoLogo} alt="Avargo" className="h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Footer columns — centered */}
            <div className="flex flex-wrap justify-center gap-12 md:gap-16 lg:gap-20 text-center">

              {/* Bransjer */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-semibold">Bransjer</p>
                <div className="flex flex-col gap-2 text-[13px] font-light">
                  <Link to={sp("/bransjer/tech-saas")} className="text-foreground/60 hover:text-primary transition-colors">Tech & SaaS</Link>
                  <Link to={sp("/bransjer/eiendom")} className="text-foreground/60 hover:text-primary transition-colors">Eiendom</Link>
                  <Link to={sp("/bransjer/bygg-anlegg")} className="text-foreground/60 hover:text-primary transition-colors">Bygg & Anlegg</Link>
                  <Link to={sp("/bransjer/restaurant")} className="text-foreground/60 hover:text-primary transition-colors">Restaurant</Link>
                  <Link to={sp("/bransjer")} className="text-primary/80 hover:text-primary transition-colors text-[12px] mt-1">Alle bransjer →</Link>
                </div>
              </div>

              {/* Ressurser */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-semibold">Ressurser</p>
                <div className="flex flex-col gap-2 text-[13px] font-light">
                  <Link to="/kurs" className="text-foreground/60 hover:text-primary transition-colors">Avargo Kurs</Link>
                  <Link to="/ressurser/kontohjelp" className="text-foreground/60 hover:text-primary transition-colors">Kontohjelp</Link>
                  <Link to="/ressurser?tab=blogg" className="text-foreground/60 hover:text-primary transition-colors">Blogg</Link>
                  <Link to="/ressurser?tab=guider" className="text-foreground/60 hover:text-primary transition-colors">Guider</Link>
                  <Link to="/ressurser?tab=arkiv" className="text-foreground/60 hover:text-primary transition-colors">Arkiv & maler</Link>
                  <Link to="/ressurser/skattekalender" className="text-foreground/60 hover:text-primary transition-colors">Skattekalender</Link>
                </div>
              </div>

              {/* Selskapet */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-semibold">Selskapet</p>
                <div className="flex flex-col gap-2 text-[13px] font-light">
                  <Link to={sp("/kontakt")} className="text-foreground/60 hover:text-primary transition-colors">Kontakt oss</Link>
                  <Link to={sp("/om-oss")} className="text-foreground/60 hover:text-primary transition-colors">Om Avargo</Link>
                  <Link to="/faq" className="text-foreground/60 hover:text-primary transition-colors">Vanlige spørsmål</Link>
                  <Link to="/karriere" className="text-foreground/60 hover:text-primary transition-colors">Jobb hos oss</Link>
                  <Link to="/kunde/logg-inn" className="text-foreground/60 hover:text-primary transition-colors">Kundeportal</Link>
                  <Link to="/samarbeid" className="text-foreground/60 hover:text-primary transition-colors">Samarbeid</Link>
                </div>
              </div>

              {/* Avdelinger */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-semibold">Avdelinger</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {SECTION_LIST.map((s) => (
                    <Link key={s.id} to={s.basePath}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all hover:scale-[1.02]"
                      style={{
                        color: accentHsl(s.id),
                        borderColor: accentBg(s.id, 0.2),
                        ...(isInSection && section?.id === s.id ? { backgroundColor: accentBg(s.id, 0.1) } : {}),
                      }}
                    >
                      {s.shortName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 pt-6 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-[11px] text-foreground/40">© 2026 Avargo. Alle rettigheter reservert.</span>
              <div className="flex gap-6 text-[11px] text-foreground/40">
                <Link to="/personvern" className="hover:text-foreground/70 transition-colors">Personvern</Link>
                <Link to="/vilkar" className="hover:text-foreground/70 transition-colors">Vilkår</Link>
              </div>
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
    className={`px-3 py-2 rounded-lg text-[13px] tracking-wide font-light transition-all duration-200 ${
      isActive ? "bg-primary/10 text-foreground" : "text-foreground/80 hover:text-foreground hover:bg-muted/40"
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link to={to} onClick={onClick} className="py-3.5 text-[15px] text-foreground/90 active:text-foreground transition-colors border-b border-border/15 tracking-wide">
    {label}
  </Link>
);

export default Layout;
