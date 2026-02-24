import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useMemo } from "react";
import AdminFloatingBar from "@/components/AdminFloatingBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSection, SECTION_LIST, SECTIONS, type SectionId } from "@/contexts/SectionContext";
import { sectionTjenesterGroups } from "@/config/sectionContent";
import {
  Menu, X, ChevronDown, ChevronRight, BookOpen, TrendingUp, Briefcase, Users,
  LayoutTemplate, Search, Megaphone, Globe, ShoppingCart, Bot,
  Building2, Landmark, HardHat, Store, Heart, Tractor, Zap,
  Mail, Info, FileText, BookMarked, Newspaper, Lock, Archive, CalendarClock,
  GraduationCap, Calculator, HelpCircle, Download, Flame, ArrowRight, Layers,
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
      { icon: Users, title: "Lønn & lønnskjøring", desc: "Automatisert lønnskjøring og rapportering", href: "/tjenester/lonn" },
      { icon: BookOpen, title: "Årsregnskap & skattemelding", desc: "Komplett årsoppgjør og innlevering", href: "/tjenester/arsregnskap" },
      { icon: Briefcase, title: "CFO-as-a-Service", desc: "Strategisk økonomisk rådgivning", href: "/tjenester/cfo" },
      { icon: BookOpen, title: "Fakturering & innkreving", desc: "Effektiv fakturering og oppfølging", href: "/tjenester/fakturering" },
      { icon: TrendingUp, title: "Skatteplanlegging", desc: "Optimaliser skatteposisjonen din", href: "/tjenester/skatteplanlegging" },
      { icon: BookOpen, title: "1-1 Regnskap", desc: "Personlig regnskapsoppfølging", href: "/tjenester/1-1-regnskap" },
      { icon: LayoutTemplate, title: "Avargo Dashboard", desc: "Sanntidsoversikt over økonomien", href: "/tjenester/dashboard" },
    ],
  },
  {
    label: "HR & Personal",
    items: [
      { icon: Users, title: "Lønn & HR-administrasjon", desc: "Komplett HR-løsning for din bedrift", href: "/tjenester/hr-og-lonn" },
      { icon: Users, title: "Ansettelse & rekruttering", desc: "Finn og ansett riktig kandidat", href: "/tjenester/ansettelse" },
      { icon: BookOpen, title: "Personalhåndbok", desc: "Skreddersydde retningslinjer", href: "/tjenester/personalhandbok" },
      { icon: Briefcase, title: "Arbeidsrett & HMS", desc: "Juridisk trygghet og HMS-system", href: "/tjenester/arbeidsrett" },
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
      { icon: LayoutTemplate, title: "Skreddersydde nettsider", desc: "Unikt design som skiller seg ut", href: "/tjenester/nettsider" },
      { icon: Bot, title: "AI-chatbot & kundeservice", desc: "Automatisert kundehåndtering 24/7", href: "/tjenester/chatbot" },
      { icon: Bot, title: "Interne systemer", desc: "Skreddersydde verktøy for teamet", href: "/tjenester/internsystemer" },
      { icon: Bot, title: "AI & automatisering", desc: "Smartere drift med AI-løsninger", href: "/tjenester/ai-automatisering" },
    ],
  },
];

const bransjerItems = [
  { icon: Globe, title: "Tech & SaaS", href: "/bransjer/tech-saas" },
  { icon: Building2, title: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
  { icon: Landmark, title: "Holding & Investering", href: "/bransjer/holding" },
  { icon: Briefcase, title: "Consulting & Rådgivning", href: "/bransjer/consulting" },
  { icon: Tractor, title: "Landbruk", href: "/bransjer/landbruk" },
  { icon: HardHat, title: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
  { icon: Store, title: "Nettbutikk & E-commerce", href: "/bransjer/nettbutikk" },
  { icon: Heart, title: "Helse & Velvære", href: "/bransjer/helse" },
  { icon: TrendingUp, title: "Restaurant & Uteliv", href: "/bransjer/restaurant" },
  { icon: Users, title: "Frisør & Skjønnhet", href: "/bransjer/frisor" },
  { icon: Zap, title: "Håndverkere & Fagfolk", href: "/bransjer/handverkere" },
];

const selskapetLinks = [
  { icon: Users, title: "Kundeportal", desc: "Logg inn som kunde", href: "/kunde/logg-inn", absolute: true },
  { icon: Lock, title: "Ansatte-login", desc: "Intern portal for Avargo-ansatte", href: "/admin/logg-inn", absolute: true },
  { icon: Mail, title: "Kontakt", desc: "Ta kontakt med oss direkte", href: "/kontakt", absolute: false },
  { icon: Info, title: "Om oss", desc: "Hvem vi er og hva vi tror på", href: "/om-oss", absolute: false },
  { icon: Briefcase, title: "Jobb hos oss", desc: "Se ledige stillinger", href: "/karriere", absolute: true },
];

const ressurserLinks: { icon: typeof BookOpen; title: string; desc: string; href: string; accent?: string; featured?: boolean }[] = [
  { icon: GraduationCap, title: "Avargo Kurs", desc: "130+ kurs for kompetanseheving", href: "/kurs", accent: "hsl(var(--primary))", featured: true },
  { icon: Calculator, title: "Kontohjelp", desc: "Finn riktig konto for regnskapet", href: "/ressurser/kontohjelp", accent: "hsl(45 80% 60%)" },
  { icon: Newspaper, title: "Nyheter", desc: "Siste nytt fra Avargo", href: "/ressurser?tab=nyheter" },
  { icon: Flame, title: "Blogg", desc: "Artikler om regnskap og økonomi", href: "/ressurser?tab=blogg" },
  { icon: BookMarked, title: "Guider", desc: "Praktiske guider for bedriftseiere", href: "/ressurser?tab=guider" },
  { icon: Download, title: "Arkiv & maler", desc: "Skjemaer og maler til nedlasting", href: "/ressurser?tab=arkiv" },
  { icon: CalendarClock, title: "Skattekalender", desc: "Alle frister for næringsdrivende", href: "/ressurser/skattekalender" },
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

  // Section-aware path helper
  const sp = (path: string) => isInSection && section ? `${section.basePath}${path}` : path;

  // For tjenester items: use current section prefix if in a section, otherwise auto-route to the group's section
  const tjenesterPath = (href: string, groupLabel: string) => {
    if (isInSection && section) return `${section.basePath}${href}`;
    return `${groupSectionMap[groupLabel] || ""}${href}`;
  };

  // Filter tjenester groups when inside a section
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

  // Active accent color for current section
  const sectionAccent = isInSection && section ? accentHsl(section.id) : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* ── NAV BAR ────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-background/75">
        {/* Top accent line when in section */}
        {isInSection && section && (
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${sectionAccent}, transparent)` }} />
        )}

        <div className="container mx-auto flex items-center justify-between h-16 md:h-[72px] px-4 md:px-6">
          {/* Logo */}
          {isInSection && section ? (
            <span className="font-heading text-xl md:text-2xl tracking-wide flex items-baseline gap-1">
              <Link to="/" className="text-primary hover:text-primary/80 transition-colors">Avargo</Link>
              <span className="text-foreground/20">·</span>
              <Link to={section.basePath} className="transition-colors text-lg" style={{ color: sectionAccent }}>
                {section.shortName}
              </Link>
            </span>
          ) : (
            <Link to="/" className="font-heading text-xl md:text-2xl text-primary tracking-wide">Avargo</Link>
          )}

          {/* ── Desktop nav ─────────────────────────── */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {/* Nav pills */}
            <NavButton to="/" label="Hjem" isActive={location.pathname === "/"} />
            <NavButton to={sp("/metoden")} label="Metoden" isActive={location.pathname.endsWith("/metoden")} />

            {/* Tjenester dropdown */}
            <div className="relative" {...makeHandlers(setTjenesterOpen, tjenesterRef)}>
              <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] tracking-wide font-light transition-all duration-200 ${
                tjenesterOpen ? "bg-primary/10 text-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
              }`}>
                Tjenester <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${tjenesterOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Tjenester mega-menu */}
              <DropdownPanel
                open={tjenesterOpen}
                className="fixed top-[72px] left-0 right-0 z-50 bg-card/98 backdrop-blur-3xl border-b border-border/20 shadow-2xl"
              >
                {isInSection && section && (
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent 10%, ${sectionAccent} 50%, transparent 90%)` }} />
                )}
                <div className="container mx-auto px-6 py-8">
                  {!isInSection ? (
                    /* ── Hub: 4 department cards ────── */
                    <div className="grid grid-cols-4 gap-5">
                      {tjenesterGroups.map((group) => {
                        const sId = groupSectionIdMap[group.label];
                        const accent = accentHsl(sId);
                        const bg = accentBg(sId, 0.06);
                        const targetPath = groupSectionMap[group.label] || "/tjenester";
                        const sectionData = SECTIONS[sId as SectionId];
                        return (
                          <Link
                            key={group.label}
                            to={`${targetPath}/tjenester`}
                            onClick={() => setTjenesterOpen(false)}
                            className="group relative p-6 rounded-2xl border border-border/10 hover:border-border/30 transition-all duration-300 overflow-hidden"
                            style={{ backgroundColor: bg }}
                          >
                            {/* Glow */}
                            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl" style={{ backgroundColor: accent }} />
                            <div className="relative">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border transition-colors duration-300" style={{ backgroundColor: accentBg(sId, 0.12), borderColor: accentBg(sId, 0.2) }}>
                                <Layers size={17} style={{ color: accent }} strokeWidth={1.5} />
                              </div>
                              <h3 className="font-heading text-base mb-1" style={{ color: accent }}>{group.label}</h3>
                              <p className="text-[11px] text-foreground/50 font-light leading-relaxed mb-4">
                                {sectionData?.tagline}
                              </p>
                              <div className="space-y-1.5 mb-4">
                                {group.items.slice(0, 3).map(item => (
                                  <div key={item.href} className="flex items-center gap-2 text-[11px] text-foreground/50">
                                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} />
                                    {item.title}
                                  </div>
                                ))}
                                {group.items.length > 3 && (
                                  <p className="text-[10px] text-foreground/35 pl-3">+{group.items.length - 3} mer</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
                                Utforsk <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    /* ── Section: service grid ─────── */
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentBg(section.id, 0.12) }}>
                          <Layers size={14} style={{ color: sectionAccent }} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-sm font-heading" style={{ color: sectionAccent }}>{section.name}</h3>
                          <p className="text-[10px] text-foreground/40">{section.tagline}</p>
                        </div>
                      </div>
                      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${Math.min(visibleTjenesterGroups.length === 1 ? 2 : visibleTjenesterGroups.length, 4)}, 1fr)` }}>
                        {visibleTjenesterGroups.map((group) => (
                          <div key={group.label}>
                            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-3 px-2 font-medium">{group.label}</p>
                            <div className="flex flex-col gap-0.5">
                              {group.items.map((item) => (
                                <Link
                                  key={item.href}
                                  to={tjenesterPath(item.href, group.label)}
                                  onClick={() => setTjenesterOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 group/item transition-all duration-200"
                                >
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200" style={{ backgroundColor: accentBg(section.id, 0.08) }}>
                                    <item.icon size={14} style={{ color: sectionAccent }} strokeWidth={1.5} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[12.5px] text-foreground/80 group-hover/item:text-foreground font-medium transition-colors leading-tight">{item.title}</p>
                                    <p className="text-[10px] text-foreground/40 leading-tight mt-0.5">{item.desc}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-border/10 flex items-center justify-between">
                        <Link to={sp("/tjenester")} onClick={() => setTjenesterOpen(false)} className="text-[12px] tracking-wider font-medium transition-colors duration-200 flex items-center gap-1.5" style={{ color: sectionAccent }}>
                          Se alle tjenester <ArrowRight size={11} />
                        </Link>
                        {/* Cross-nav to other departments */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-foreground/30 mr-1">Andre avdelinger:</span>
                          {SECTION_LIST.filter(s => s.id !== section.id).map(s => (
                            <Link
                              key={s.id}
                              to={`${s.basePath}/tjenester`}
                              onClick={() => setTjenesterOpen(false)}
                              className="px-2.5 py-1 rounded-md text-[10px] font-medium border transition-all duration-200 hover:scale-[1.03]"
                              style={{ color: accentHsl(s.id), borderColor: accentBg(s.id, 0.25), backgroundColor: accentBg(s.id, 0.06) }}
                            >
                              {s.shortName}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </DropdownPanel>
            </div>

            {/* Bransjer — only show in sections */}
            {isInSection && section && (
              section.id !== "regnskap" ? (
                <NavButton to={sp("/bransjer")} label="Bransjer" isActive={location.pathname.includes("/bransjer")} />
              ) : (
                <div className="relative" {...makeHandlers(setBransjerOpen, bransjerRef)}>
                  <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] tracking-wide font-light transition-all duration-200 ${
                    bransjerOpen ? "bg-primary/10 text-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
                  }`}>
                    Bransjer <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${bransjerOpen ? "rotate-180" : ""}`} />
                  </button>
                  <DropdownPanel open={bransjerOpen} className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[320px] bg-card/98 backdrop-blur-3xl rounded-2xl border border-border/20 shadow-2xl p-3 z-50">
                    <div className="grid grid-cols-2 gap-1">
                      {bransjerItems.map((item) => (
                        <Link key={item.href} to={sp(item.href)} onClick={() => setBransjerOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-primary/8 group transition-colors duration-200"
                        >
                          <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                            <item.icon size={12} className="text-primary" strokeWidth={1.5} />
                          </div>
                          <span className="text-[11.5px] text-foreground/70 group-hover:text-foreground transition-colors duration-200 leading-tight">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-border/10">
                      <Link to={sp("/bransjer")} onClick={() => setBransjerOpen(false)} className="text-[11px] tracking-wider text-primary/80 hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1 px-3 py-1">
                        Se alle bransjer <ArrowRight size={10} />
                      </Link>
                    </div>
                  </DropdownPanel>
                </div>
              )
            )}

            {/* Priser — only show in sections */}
            {isInSection && section && (
              <NavButton to={sp("/priser")} label="Priser" isActive={location.pathname.includes("/priser")} />
            )}

            {/* Selskapet */}
            <div className="relative" {...makeHandlers(setSelskapetOpen, selskapetRef)}>
              <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] tracking-wide font-light transition-all duration-200 ${
                selskapetOpen ? "bg-primary/10 text-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
              }`}>
                Selskapet <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${selskapetOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={selskapetOpen} className="absolute top-full right-0 mt-3 w-[280px] bg-card/98 backdrop-blur-3xl rounded-2xl border border-border/20 shadow-2xl p-2 z-50">
                {selskapetLinks.map((item, i) => (
                  <Link key={item.href} to={item.absolute ? item.href : sp(item.href)} onClick={() => setSelskapetOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-primary/8 group transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                      <item.icon size={14} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] text-foreground/80 group-hover:text-foreground font-medium transition-colors duration-200">{item.title}</p>
                      <p className="text-[10.5px] text-foreground/40 leading-tight">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </DropdownPanel>
            </div>

            {/* Ressurser — only on hub */}
            {!isInSection && (
              <div className="relative" {...makeHandlers(setRessurserOpen, ressurserRef)}>
                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] tracking-wide font-light transition-all duration-200 ${
                  ressurserOpen ? "bg-primary/10 text-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
                }`}>
                  Ressurser <ChevronDown size={11} className={`ml-0.5 transition-transform duration-300 ${ressurserOpen ? "rotate-180" : ""}`} />
                </button>
                <DropdownPanel open={ressurserOpen} className="absolute top-full right-0 mt-3 w-[340px] bg-card/98 backdrop-blur-3xl rounded-2xl border border-border/20 shadow-2xl p-2 z-50">
                  {ressurserLinks.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href.startsWith("/kurs") || item.href.startsWith("/ressurser") ? item.href : sp(item.href)}
                      onClick={() => setRessurserOpen(false)}
                      className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-primary/8 group transition-all duration-200 ${item.featured ? "bg-primary/[0.04] mb-1" : ""}`}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300"
                        style={{ backgroundColor: item.accent ? `${item.accent.replace(")", " / 0.1)")}` : "hsl(var(--primary) / 0.08)" }}
                      >
                        <item.icon
                          size={15}
                          className={item.accent ? "" : "text-primary"}
                          style={item.accent ? { color: item.accent } : undefined}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[12.5px] group-hover:text-foreground font-medium transition-colors duration-200 ${item.featured ? "text-foreground" : "text-foreground/80"}`}>
                          {item.title}
                          {item.featured && <span className="ml-2 text-[9px] tracking-wider uppercase text-primary font-semibold">Nytt</span>}
                        </p>
                        <p className="text-[10.5px] text-foreground/40 leading-tight">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
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

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-2.5 -mr-2 rounded-xl active:bg-muted/40 transition-colors" aria-label="Åpne meny">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Mobile menu ──────────────────────────── */}
        <div
          className={`md:hidden border-t border-border/10 bg-background/98 backdrop-blur-2xl overflow-y-auto transition-all duration-300 ease-out ${
            menuOpen ? "max-h-[calc(100dvh-64px)] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col p-5 pb-8 gap-0.5">
            {/* Section indicator */}
            {isInSection && section && (
              <div className="mb-4 p-3 rounded-xl border" style={{ borderColor: accentBg(section.id, 0.25), backgroundColor: accentBg(section.id, 0.05) }}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Du er i</p>
                <p className="font-heading text-base" style={{ color: sectionAccent }}>{section.name}</p>
              </div>
            )}

            <MobileNavLink to="/" label="Hjem" onClick={() => setMenuOpen(false)} />
            <MobileNavLink to={sp("/metoden")} label="Metoden" onClick={() => setMenuOpen(false)} />

            {/* Mobile Tjenester */}
            <button onClick={() => setMobileTjenesterOpen(!mobileTjenesterOpen)} className="flex items-center justify-between py-3.5 text-[15px] text-foreground/80 border-b border-border/10 tracking-wide w-full">
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
                        <p className="text-[10px] tracking-[0.25em] uppercase font-medium mt-3 mb-1.5 px-3" style={{ color: accent }}>{group.label}</p>
                      )}
                      {(!isInSection ? group.items.slice(0, 2) : group.items).map(item => (
                        <Link key={item.href} to={tjenesterPath(item.href, group.label)} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-foreground/70 active:text-foreground active:bg-primary/5 transition-colors"
                        >
                          <item.icon size={14} className="shrink-0" style={{ color: isInSection ? sectionAccent : accent }} strokeWidth={1.5} />
                          {item.title}
                        </Link>
                      ))}
                      {!isInSection && group.items.length > 2 && (
                        <Link to={`${groupSectionMap[group.label]}/tjenester`} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                          className="px-3 py-1 text-[11px] font-medium" style={{ color: accent }}>
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
              section.id !== "regnskap" ? (
                <MobileNavLink to={sp("/bransjer")} label="Bransjer" onClick={() => setMenuOpen(false)} />
              ) : (
                <>
                  <button onClick={() => setMobileBransjerOpen(!mobileBransjerOpen)} className="flex items-center justify-between py-3.5 text-[15px] text-foreground/80 border-b border-border/10 tracking-wide w-full">
                    Bransjer <ChevronDown size={14} className={`transition-transform duration-200 ${mobileBransjerOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${mobileBransjerOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="py-2 pl-1 flex flex-col gap-0.5">
                      {bransjerItems.slice(0, 6).map((item) => (
                        <Link key={item.href} to={sp(item.href)} onClick={() => { setMenuOpen(false); setMobileBransjerOpen(false); }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-foreground/70 active:text-foreground active:bg-primary/5 transition-colors"
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
              )
            )}

            {/* Mobile Priser */}
            {isInSection && section && (
              <MobileNavLink to={sp("/priser")} label="Priser" onClick={() => setMenuOpen(false)} />
            )}

            {/* Mobile Selskapet */}
            <button onClick={() => setMobileSelskapetOpen(!mobileSelskapetOpen)} className="flex items-center justify-between py-3.5 text-[15px] text-foreground/80 border-b border-border/10 tracking-wide w-full">
              Selskapet <ChevronDown size={14} className={`transition-transform duration-200 ${mobileSelskapetOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileSelskapetOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="py-2 pl-1 flex flex-col gap-0.5">
                {selskapetLinks.map(item => (
                  <Link key={item.href} to={item.absolute ? item.href : sp(item.href)} onClick={() => { setMenuOpen(false); setMobileSelskapetOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-foreground/70 active:text-foreground active:bg-primary/5 transition-colors"
                  >
                    <item.icon size={14} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Ressurser */}
            {!isInSection && (
              <>
                <MobileNavLink to="/ressurser" label="Ressurser" onClick={() => setMenuOpen(false)} />
                <Link to="/kurs" onClick={() => setMenuOpen(false)} className="py-2.5 pl-4 text-[13px] text-foreground/50 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Avargo Kurs</Link>
              </>
            )}

            {/* Cross-navigation on mobile when in section */}
            {isInSection && section && (
              <div className="mt-4 mb-2">
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-2 font-medium">Andre avdelinger</p>
                <div className="flex flex-wrap gap-2">
                  {SECTION_LIST.filter(s => s.id !== section.id).map(s => (
                    <Link
                      key={s.id}
                      to={s.basePath}
                      onClick={() => setMenuOpen(false)}
                      className="px-3.5 py-2 rounded-xl text-[12px] font-medium border transition-all active:scale-95"
                      style={{ color: accentHsl(s.id), borderColor: accentBg(s.id, 0.2), backgroundColor: accentBg(s.id, 0.06) }}
                    >
                      {s.shortName}
                    </Link>
                  ))}
                  <Link to="/" onClick={() => setMenuOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-[12px] font-medium text-primary border border-primary/20 bg-primary/5 transition-all active:scale-95">
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
        <div className="h-px w-full bg-border/15" />
      </nav>

      {/* ── Breadcrumbs ────────────────────────────── */}
      <div className="pt-16 md:pt-[72px]">
        <Breadcrumbs />
      </div>

      <main>{children}</main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="border-t border-border/15 py-12 md:py-24 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-5 md:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-6">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 mb-4 md:mb-0">
              <Link to={isInSection && section ? section.basePath : "/"} className="font-heading text-2xl text-primary">
                Avargo{isInSection && section ? <span className="text-lg ml-1" style={{ color: sectionAccent }}>· {section.shortName}</span> : null}
              </Link>
              <p className="mt-3 text-sm text-foreground/60 leading-relaxed font-light">
                {isInSection && section
                  ? section.description
                  : <>Regnskapsbyrået for små og mellomstore bedrifter.<br />Trygghet. Oversikt. Vekst.</>
                }
              </p>
              <p className="mt-2 text-xs text-foreground/40 font-light leading-relaxed">
                Oscars gate 2B, 3714 Skien
              </p>
              <Link to={sp("/kontakt")} className="inline-block mt-4 px-5 py-2.5 text-[12px] font-medium bg-primary text-primary-foreground rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 tracking-wide">
                Få tilbud
              </Link>
            </div>

            {/* Tjenester */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Tjenester</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                {!isInSection || !section ? (
                  <>
                    <Link to="/hr/tjenester" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Personal</Link>
                    <Link to="/markedsforing/tjenester" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Marked</Link>
                    <Link to="/it/tjenester" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">IT</Link>
                    <Link to="/regnskap/tjenester" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Regnskap</Link>
                  </>
                ) : section.id === "regnskap" ? (
                  <>
                    <Link to={sp("/tjenester/regnskapsforer")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Dedikert regnskapsfører</Link>
                    <Link to={sp("/tjenester/cfo")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">CFO-as-a-Service</Link>
                    <Link to={sp("/tjenester/lonn")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Lønn & lønnskjøring</Link>
                    <Link to={sp("/tjenester/skatteplanlegging")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Skatteplanlegging</Link>
                  </>
                ) : section.id === "hr" ? (
                  <>
                    <Link to={sp("/tjenester/hr-og-lonn")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Lønn & HR</Link>
                    <Link to={sp("/tjenester/ansettelse")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Ansettelse & rekruttering</Link>
                    <Link to={sp("/tjenester/personalhandbok")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Personalhåndbok</Link>
                    <Link to={sp("/tjenester/arbeidsrett")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Arbeidsrett & HMS</Link>
                  </>
                ) : section.id === "markedsforing" ? (
                  <>
                    <Link to={sp("/tjenester/seo")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">SEO & søkbarhet</Link>
                    <Link to={sp("/tjenester/meta-annonser")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Meta-annonser</Link>
                    <Link to={sp("/tjenester/google-ads")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Google Ads</Link>
                    <Link to={sp("/tjenester/nettbutikk")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Nettbutikk & e-handel</Link>
                  </>
                ) : (
                  <>
                    <Link to={sp("/tjenester/nettsider")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Skreddersydde nettsider</Link>
                    <Link to={sp("/tjenester/chatbot")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">AI-chatbot</Link>
                    <Link to={sp("/tjenester/internsystemer")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Interne systemer</Link>
                    <Link to={sp("/tjenester/ai-automatisering")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">AI & automatisering</Link>
                  </>
                )}
                <Link to={sp("/tjenester")} className="text-primary hover:text-primary/80 transition-colors text-[13px] mt-1 py-0.5">Se alle tjenester →</Link>
              </div>
            </div>

            {/* Bransjer */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Bransjer</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                {(isInSection && section && section.id === "regnskap") ? (
                  <>
                    <Link to={sp("/bransjer/tech-saas")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Tech & SaaS</Link>
                    <Link to={sp("/bransjer/eiendom")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Eiendom</Link>
                    <Link to={sp("/bransjer/bygg-anlegg")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Bygg & Anlegg</Link>
                    <Link to={sp("/bransjer/restaurant")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Restaurant & Uteliv</Link>
                    <Link to={sp("/bransjer")} className="text-primary hover:text-primary/80 transition-colors text-[13px] mt-1 py-0.5">Se alle bransjer →</Link>
                  </>
                ) : (
                  <>
                    <p className="text-foreground/50 text-[13px] leading-relaxed">Vi tilpasser oss din bransje — uansett hva du driver med.</p>
                    <Link to={sp("/bransjer")} className="text-primary hover:text-primary/80 transition-colors text-[13px] mt-1 py-0.5">Les mer →</Link>
                  </>
                )}
              </div>
            </div>

            {/* Ressurser */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Ressurser</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <Link to="/ressurser?tab=arkiv" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Arkiv & maler</Link>
                <Link to="/ressurser/kontohjelp" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Kontohjelp</Link>
                <Link to="/ressurser?tab=guider" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Guider</Link>
                <Link to="/ressurser?tab=blogg" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Blogg</Link>
              </div>
            </div>

            {/* Selskapet */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Selskapet</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <Link to={sp("/kontakt")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Kontakt oss</Link>
                <Link to="/faq" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Vanlige spørsmål</Link>
                <Link to="/kunde/logg-inn" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Kundeportal</Link>
                <Link to={sp("/om-oss")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Om Avargo</Link>
                <Link to="/karriere" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Jobb hos oss</Link>
                <Link to="/kurs" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Avargo Kurs</Link>
              </div>
            </div>

            {/* Avdelinger */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Avdelinger</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Avargo</Link>
                {SECTION_LIST.map((s) => (
                  <Link key={s.id} to={s.basePath} className="text-foreground/70 hover:text-foreground transition-colors py-0.5" style={{ color: isInSection && section?.id === s.id ? accentHsl(s.id) : undefined }}>
                    {s.shortName}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="line-accent mt-12 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/40">
            <span>© 2026 Avargo. Alle rettigheter reservert.</span>
            <div className="flex gap-8">
              <Link to="/personvern" className="hover:text-foreground transition-colors">Personvern</Link>
              <Link to="/vilkar" className="hover:text-foreground transition-colors">Vilkår</Link>
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
      isActive ? "bg-primary/10 text-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link to={to} onClick={onClick} className="py-3.5 text-[15px] text-foreground/80 active:text-foreground transition-colors border-b border-border/10 tracking-wide">
    {label}
  </Link>
);

export default Layout;
