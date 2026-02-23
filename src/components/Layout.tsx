import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useMemo } from "react";
import AdminFloatingBar from "@/components/AdminFloatingBar";
import { useSection, SECTION_LIST, SECTIONS } from "@/contexts/SectionContext";
import { sectionTjenesterGroups } from "@/config/sectionContent";
import {
  Menu, X, ChevronDown, BookOpen, TrendingUp, Briefcase, Users,
  LayoutTemplate, Search, Megaphone, Globe, ShoppingCart, Bot,
  Building2, Landmark, HardHat, Store, Heart, Tractor, Zap,
  Mail, Info, FileText, BookMarked, Newspaper, Lock, Archive, CalendarClock,
} from "lucide-react";

/** Maps tjenester group label → section basePath for auto-routing */
const groupSectionMap: Record<string, string> = {
  "Regnskap & Økonomi": "/regnskap",
  "HR & Personal": "/hr",
  "Markedsføring & Vekst": "/markedsforing",
  "IT & Utvikling": "/it",
  "Kurs & Opplæring": "/regnskap",
};

/** Maps tjenester group label → SectionId for accent colors */
const groupSectionIdMap: Record<string, string> = {
  "Regnskap & Økonomi": "regnskap",
  "HR & Personal": "hr",
  "Markedsføring & Vekst": "markedsforing",
  "IT & Utvikling": "it",
  "Kurs & Opplæring": "regnskap",
};

const tjenesterGroups = [
  {
    label: "Regnskap & Økonomi",
    items: [
      { icon: BookOpen, title: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
      { icon: Users, title: "Lønn & lønnskjøring", href: "/tjenester/lonn" },
      { icon: BookOpen, title: "Årsregnskap & skattemelding", href: "/tjenester/arsregnskap" },
      { icon: Briefcase, title: "CFO-as-a-Service", href: "/tjenester/cfo" },
      { icon: BookOpen, title: "Fakturering & innkreving", href: "/tjenester/fakturering" },
      { icon: TrendingUp, title: "Skatteplanlegging", href: "/tjenester/skatteplanlegging" },
      { icon: BookOpen, title: "1-1 Regnskap", href: "/tjenester/1-1-regnskap" },
      { icon: LayoutTemplate, title: "Avargo Dashboard", href: "/tjenester/dashboard" },
    ],
  },
  {
    label: "HR & Personal",
    items: [
      { icon: Users, title: "Lønn & HR-administrasjon", href: "/tjenester/hr-og-lonn" },
      { icon: Users, title: "Ansettelse & rekruttering", href: "/tjenester/ansettelse" },
      { icon: BookOpen, title: "Personalhåndbok", href: "/tjenester/personalhandbok" },
      { icon: Briefcase, title: "Arbeidsrett & HMS", href: "/tjenester/arbeidsrett" },
    ],
  },
  {
    label: "Markedsføring & Vekst",
    items: [
      { icon: Search, title: "SEO & søkbarhet", href: "/tjenester/seo" },
      { icon: Megaphone, title: "Meta-annonser", href: "/tjenester/meta-annonser" },
      { icon: Globe, title: "Google Ads", href: "/tjenester/google-ads" },
      { icon: ShoppingCart, title: "Nettbutikk & e-handel", href: "/tjenester/nettbutikk" },
    ],
  },
  {
    label: "IT & Utvikling",
    items: [
      { icon: LayoutTemplate, title: "Skreddersydde nettsider", href: "/tjenester/nettsider" },
      { icon: Bot, title: "AI-chatbot & kundeservice", href: "/tjenester/chatbot" },
      { icon: Bot, title: "Interne systemer", href: "/tjenester/internsystemer" },
      { icon: Bot, title: "AI & automatisering", href: "/tjenester/ai-automatisering" },
    ],
  },
  {
    label: "Kurs & Opplæring",
    items: [
      { icon: BookOpen, title: "Regnskapskurs", href: "/tjenester/kurs" },
      { icon: Users, title: "HR & arbeidsgiveransvar", href: "/tjenester/hr-kurs" },
      { icon: TrendingUp, title: "Skreddersydde bedriftskurs", href: "/tjenester/bedriftskurs" },
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
  { icon: Users, title: "Kundeportal", desc: "Logg inn som kunde", href: "/kunde/logg-inn" },
  { icon: Lock, title: "Ansatte-login", desc: "Intern portal for Avargo-ansatte", href: "/admin/logg-inn" },
  { icon: Mail, title: "Kontakt", desc: "Ta kontakt med oss direkte", href: "/kontakt" },
  { icon: Info, title: "Om oss", desc: "Hvem vi er og hva vi tror på", href: "/om-oss" },
];

const ressurserLinks = [
  { icon: BookOpen, title: "Kontohjelp", desc: "Finn riktig konto for regnskapet", href: "/ressurser/kontohjelp" },
  { icon: Newspaper, title: "Nyheter", desc: "Siste nytt fra Avargo", href: "/ressurser?tab=nyheter" },
  { icon: FileText, title: "Blogg", desc: "Artikler om regnskap og økonomi", href: "/ressurser?tab=blogg" },
  { icon: BookMarked, title: "Guider", desc: "Praktiske guider for bedriftseiere", href: "/ressurser?tab=guider" },
  { icon: Archive, title: "Arkiv", desc: "Skjemaer og maler til nedlasting", href: "/ressurser?tab=arkiv" },
  { icon: CalendarClock, title: "Skatteetatens kalender", desc: "Alle frister for næringsdrivende", href: "/ressurser/skattekalender" },
];

const DropdownPanel = ({ open, children, className = "" }: { open: boolean; children: React.ReactNode; className?: string }) => (
  <div
    className={`transition-all duration-200 ease-out ${className} ${
      open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
    }`}
    style={{ visibility: open ? "visible" : "hidden" }}
  >
    {children}
  </div>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { section, isInSection } = useSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tjenesterOpen, setTjenesterOpen] = useState(false);
  const [bransjerOpen, setBransjerOpen] = useState(false);
  const [selskapetOpen, setSelskapetOpen] = useState(false);
  const [ressurserOpen, setRessurserOpen] = useState(false);
  const [mobileTjenesterOpen, setMobileTjenesterOpen] = useState(false);
  const [mobileBransjerOpen, setMobileBransjerOpen] = useState(false);

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
    onMouseLeave: () => { timerRef.current = setTimeout(() => setter(false), 120); },
  });

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/15 backdrop-blur-2xl bg-background/70">
        <div className="container mx-auto flex items-center justify-between h-16 md:h-[72px] px-4 md:px-6">
          <Link to={isInSection && section ? section.basePath : "/"} className="font-heading text-xl md:text-2xl text-primary tracking-wide">
            Avargo{isInSection && section ? <span className="text-foreground/40 text-lg ml-1">· {section.shortName}</span> : null}
          </Link>

          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            <Link to={isInSection && section ? section.basePath : "/"} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">Hjem</Link>
            <Link to={sp("/metoden")} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">Metoden</Link>

            {/* Tjenester */}
            <div className="relative" {...makeHandlers(setTjenesterOpen, tjenesterRef)}>
              <button className="flex items-center gap-1 text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">
                Tjenester <ChevronDown size={12} className={`transition-transform duration-300 ${tjenesterOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={tjenesterOpen} className="fixed top-[72px] left-0 right-0 bg-card/95 backdrop-blur-2xl border-b border-border/30 shadow-2xl p-6">
                <div className="container mx-auto">
                   <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${Math.min(visibleTjenesterGroups.length, 5)}, 1fr)` }}>
                     {visibleTjenesterGroups.map((group) => {
                       const sId = groupSectionIdMap[group.label];
                       const accent = sId && !isInSection ? SECTIONS[sId as keyof typeof SECTIONS]?.accent : null;
                       const accentColor = accent ? `hsl(${accent.h} ${accent.s}% ${accent.l}%)` : undefined;
                       return (
                         <div key={group.label}>
                           <p
                             className={`text-[10px] tracking-[0.35em] uppercase px-2.5 mb-2 font-medium ${accent ? "" : "text-foreground/50"}`}
                             style={accent ? { color: accentColor } : undefined}
                           >
                             {group.label}
                           </p>
                           <div className="flex flex-col gap-0.5">
                             {group.items.map((item) => (
                               <Link key={item.href} to={tjenesterPath(item.href, group.label)} onClick={() => setTjenesterOpen(false)}
                                 className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-primary/10 group transition-colors duration-200"
                               >
                                 <div
                                   className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 group-hover:brightness-125 transition-all duration-200"
                                   style={{ backgroundColor: accent ? `hsl(${accent.h} ${accent.s}% ${accent.l}% / 0.12)` : undefined }}
                                 >
                                   <item.icon size={13} className={accent ? "" : "text-primary"} style={accent ? { color: accentColor } : undefined} strokeWidth={1.5} />
                                 </div>
                                 <span className="text-[12.5px] text-foreground/80 group-hover:text-foreground transition-colors duration-200 leading-tight">{item.title}</span>
                               </Link>
                             ))}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                  <div className="mt-3 pt-3 border-t border-border/15">
                    <Link to={sp("/tjenester")} onClick={() => setTjenesterOpen(false)} className="text-[12px] tracking-wider text-primary/80 hover:text-primary transition-colors duration-200 font-medium">Se alle tjenester →</Link>
                  </div>
                </div>
              </DropdownPanel>
            </div>

            {/* Bransjer */}
            {isInSection && section && section.id !== "regnskap" ? (
              <Link to={sp("/bransjer")} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">Bransjer</Link>
            ) : (
              <div className="relative" {...makeHandlers(setBransjerOpen, bransjerRef)}>
                <button className="flex items-center gap-1 text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">
                  Bransjer <ChevronDown size={12} className={`transition-transform duration-300 ${bransjerOpen ? "rotate-180" : ""}`} />
                </button>
                <DropdownPanel open={bransjerOpen} className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/30 shadow-2xl p-3">
                  <div className="flex flex-col gap-0.5">
                    {bransjerItems.map((item) => (
                      <Link key={item.href} to={sp(item.href)} onClick={() => setBransjerOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-primary/10 group transition-colors duration-200"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                          <item.icon size={13} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <span className="text-[12.5px] text-foreground/80 group-hover:text-foreground transition-colors duration-200">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/15">
                    <Link to={sp("/bransjer")} onClick={() => setBransjerOpen(false)} className="text-[12px] tracking-wider text-primary/80 hover:text-primary transition-colors duration-200 font-medium">Se alle bransjer →</Link>
                  </div>
                </DropdownPanel>
              </div>
            )}

            <Link to={sp("/priser")} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">Priser</Link>

            {/* Selskapet */}
            <div className="relative" {...makeHandlers(setSelskapetOpen, selskapetRef)}>
              <button className="flex items-center gap-1 text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">
                Selskapet <ChevronDown size={12} className={`transition-transform duration-300 ${selskapetOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={selskapetOpen} className="absolute top-full right-0 mt-3 w-60 bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/30 shadow-2xl p-3">
                {selskapetLinks.map((item) => (
                  <Link key={item.href} to={sp(item.href)} onClick={() => setSelskapetOpen(false)}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 group transition-colors duration-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200 mt-0.5">
                      <item.icon size={13} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[13px] text-foreground/90 group-hover:text-foreground font-medium transition-colors duration-200">{item.title}</p>
                      <p className="text-[11px] text-foreground/50 leading-tight">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </DropdownPanel>
            </div>

            {/* Ressurser */}
            <div className="relative" {...makeHandlers(setRessurserOpen, ressurserRef)}>
              <button className="flex items-center gap-1 text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">
                Ressurser <ChevronDown size={12} className={`transition-transform duration-300 ${ressurserOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={ressurserOpen} className="absolute top-full right-0 mt-3 w-64 bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/30 shadow-2xl p-3">
                {ressurserLinks.map((item) => (
                  <Link key={item.title} to={item.href} onClick={() => setRessurserOpen(false)}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 group transition-colors duration-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200 mt-0.5">
                      <item.icon size={13} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[13px] text-foreground/90 group-hover:text-foreground font-medium transition-colors duration-200">{item.title}</p>
                      <p className="text-[11px] text-foreground/50 leading-tight">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </DropdownPanel>
            </div>

            <Link to={sp("/kontakt")} className="px-5 lg:px-6 py-2.5 text-[12px] font-medium bg-primary text-primary-foreground rounded-full hover:scale-[1.02] transition-all duration-500 tracking-wide">
              Få tilbud
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-2.5 -mr-2 rounded-xl active:bg-muted/40 transition-colors" aria-label="Åpne meny">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu — CSS transition */}
        <div
          className={`md:hidden border-t border-border/15 bg-background/98 backdrop-blur-2xl overflow-y-auto transition-all duration-200 ease-out ${
            menuOpen ? "max-h-[calc(100dvh-64px)] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col p-5 pb-8">
            <Link to={isInSection && section ? section.basePath : "/"} onClick={() => setMenuOpen(false)} className="py-3.5 text-[15px] text-foreground/80 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Hjem</Link>
            <Link to={sp("/metoden")} onClick={() => setMenuOpen(false)} className="py-3.5 text-[15px] text-foreground/80 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Metoden</Link>

            <button onClick={() => setMobileTjenesterOpen(!mobileTjenesterOpen)} className="flex items-center justify-between py-3.5 text-[15px] text-foreground/80 border-b border-border/10 tracking-wide w-full">
              Tjenester <ChevronDown size={14} className={`transition-transform duration-200 ${mobileTjenesterOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${mobileTjenesterOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="py-2 pl-2 flex flex-col gap-0.5">
                {visibleTjenesterGroups.map((group) => {
                  const Icon = group.items[0].icon;
                  return (
                    <Link key={group.label} to={tjenesterPath("/tjenester", group.label)} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-foreground/70 active:text-foreground active:bg-primary/5 transition-colors"
                    >
                      <Icon size={14} className="text-primary shrink-0" strokeWidth={1.5} />
                      {group.label}
                    </Link>
                  );
                })}
                <Link to={sp("/tjenester")} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                  className="px-3 py-2 text-[13px] text-primary font-medium tracking-wide">
                  Se alle tjenester →
                </Link>
              </div>
            </div>

            {isInSection && section && section.id !== "regnskap" ? (
              <Link to={sp("/bransjer")} onClick={() => setMenuOpen(false)} className="py-3.5 text-[15px] text-foreground/80 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Bransjer</Link>
            ) : (
              <>
                <button onClick={() => setMobileBransjerOpen(!mobileBransjerOpen)} className="flex items-center justify-between py-3.5 text-[15px] text-foreground/80 border-b border-border/10 tracking-wide w-full">
                  Bransjer <ChevronDown size={14} className={`transition-transform duration-200 ${mobileBransjerOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${mobileBransjerOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="py-2 pl-2 flex flex-col gap-0.5">
                    {bransjerItems.slice(0, 5).map((item) => (
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
            )}

            <Link to={sp("/priser")} onClick={() => setMenuOpen(false)} className="py-3.5 text-[15px] text-foreground/80 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Priser</Link>
            <Link to={sp("/kontakt")} onClick={() => setMenuOpen(false)} className="py-3.5 text-[15px] text-foreground/80 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Kontakt</Link>
            <Link to={sp("/om-oss")} onClick={() => setMenuOpen(false)} className="py-3.5 text-[15px] text-foreground/80 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Om oss</Link>
            <Link to="/ressurser" onClick={() => setMenuOpen(false)} className="py-3.5 text-[15px] text-foreground/80 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Ressurser</Link>
            <Link to="/ressurser/kontohjelp" onClick={() => setMenuOpen(false)} className="py-2.5 pl-4 text-[13px] text-foreground/60 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Kontohjelp</Link>
            <Link to="/ressurser?tab=arkiv" onClick={() => setMenuOpen(false)} className="py-2.5 pl-4 text-[13px] text-foreground/60 active:text-foreground transition-colors border-b border-border/10 tracking-wide">Arkiv & maler</Link>

            <div className="flex gap-3 mt-4">
              <Link to="/kunde/logg-inn" onClick={() => setMenuOpen(false)} className="flex-1 py-3 text-[13px] font-medium text-foreground/70 border border-border/20 rounded-xl text-center active:bg-muted/30 transition-colors">
                Kundeportal
              </Link>
              <Link to="/admin/logg-inn" onClick={() => setMenuOpen(false)} className="flex-1 py-3 text-[13px] font-medium text-foreground/70 border border-border/20 rounded-xl text-center active:bg-muted/30 transition-colors">
                Ansatt-login
              </Link>
            </div>

            <Link to={sp("/kontakt")} onClick={() => setMenuOpen(false)} className="mt-3 px-5 py-3.5 text-[15px] font-medium bg-primary text-primary-foreground rounded-2xl text-center active:scale-[0.98] transition-all">
              Få tilbud
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16 md:pt-[72px]">{children}</main>

      <footer className="border-t border-border/15 py-12 md:py-24 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-5 md:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-8">
            {/* Brand column — section-aware */}
            <div className="col-span-2 md:col-span-1 mb-4 md:mb-0">
              <Link to={isInSection && section ? section.basePath : "/"} className="font-heading text-2xl text-primary">
                Avargo{isInSection && section ? <span className="text-foreground/40 text-lg ml-1">· {section.shortName}</span> : null}
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

            {/* Tjenester — section-filtered */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Tjenester</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                {(!isInSection || !section || section.id === "regnskap") && (
                  <>
                    <Link to={sp("/tjenester/regnskapsforer")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Dedikert regnskapsfører</Link>
                    <Link to={sp("/tjenester/cfo")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">CFO-as-a-Service</Link>
                    <Link to={sp("/tjenester/lonn")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Lønn & lønnskjøring</Link>
                    <Link to={sp("/tjenester/skatteplanlegging")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Skatteplanlegging</Link>
                  </>
                )}
                {isInSection && section?.id === "hr" && (
                  <>
                    <Link to={sp("/tjenester/hr-og-lonn")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Lønn & HR</Link>
                    <Link to={sp("/tjenester/ansettelse")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Ansettelse & rekruttering</Link>
                    <Link to={sp("/tjenester/personalhandbok")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Personalhåndbok</Link>
                    <Link to={sp("/tjenester/arbeidsrett")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Arbeidsrett & HMS</Link>
                  </>
                )}
                {isInSection && section?.id === "markedsforing" && (
                  <>
                    <Link to={sp("/tjenester/seo")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">SEO & søkbarhet</Link>
                    <Link to={sp("/tjenester/meta-annonser")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Meta-annonser</Link>
                    <Link to={sp("/tjenester/google-ads")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Google Ads</Link>
                    <Link to={sp("/tjenester/nettbutikk")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Nettbutikk & e-handel</Link>
                  </>
                )}
                {isInSection && section?.id === "it" && (
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

            {/* Bransjer — section-aware */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Bransjer</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                {(!isInSection || !section || section.id === "regnskap") ? (
                  <>
                    <Link to={sp("/bransjer/tech-saas")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Tech & SaaS</Link>
                    <Link to={sp("/bransjer/eiendom")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Eiendom</Link>
                    <Link to={sp("/bransjer/bygg-anlegg")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Bygg & Anlegg</Link>
                    <Link to={sp("/bransjer/restaurant")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Restaurant & Uteliv</Link>
                    <Link to={sp("/bransjer/consulting")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Consulting</Link>
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
                <Link to="/ressurser?tab=blogg" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Blogg</Link>
                <Link to="/ressurser?tab=guider" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Guider</Link>
                <Link to="/ressurser?tab=arkiv" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Arkiv & maler</Link>
                <Link to="/ressurser/kontohjelp" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Kontohjelp</Link>
                <Link to="/ressurser/skattekalender" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Skattekalender</Link>
                <Link to={sp("/priser")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Priser</Link>
                <Link to={sp("/metoden")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Vår metode</Link>
              </div>
            </div>

            {/* Selskapet + Avdelinger */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Selskapet</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <Link to={sp("/om-oss")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Om Avargo</Link>
                <Link to={sp("/kontakt")} className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Kontakt oss</Link>
                <Link to="/kunde/logg-inn" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Kundeportal</Link>
                <Link to="/faq" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Vanlige spørsmål</Link>
                <Link to="/admin/logg-inn" className="text-foreground/70 hover:text-foreground transition-colors py-0.5">Ansatt-innlogging</Link>
              </div>

              {/* Avdelinger — compact inline pills */}
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-3 mt-6 font-medium">Avdelinger</p>
              <div className="flex flex-wrap gap-1.5">
                {SECTION_LIST.map((s) => (
                  <Link
                    key={s.id}
                    to={s.basePath}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] tracking-wide border transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      color: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)`,
                      borderColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.25)`,
                      backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.08)`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)` }} />
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

export default Layout;