import { Link, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminFloatingBar from "@/components/AdminFloatingBar";
import {
  Menu, X, ChevronDown, BookOpen, TrendingUp, Briefcase, Users,
  LayoutTemplate, Search, Megaphone, Globe, ShoppingCart, Bot,
  Building2, Landmark, HardHat, Store, Heart, Tractor, Zap,
  Mail, Info, FileText, BookMarked, Newspaper, Lock, Archive, CalendarClock,
} from "lucide-react";

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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tjenesterOpen, setTjenesterOpen] = useState(false);
  const [bransjerOpen, setBransjerOpen] = useState(false);
  const [selskapetOpen, setSelskapetOpen] = useState(false);
  const [ressurserOpen, setRessurserOpen] = useState(false);
  const [mobileTjenesterOpen, setMobileTjenesterOpen] = useState(false);
  const [mobileBransjerOpen, setMobileBransjerOpen] = useState(false);
  const [mobileSelskapetOpen, setMobileSelskapetOpen] = useState(false);
  const [mobileRessurserOpen, setMobileRessurserOpen] = useState(false);

  const tjenesterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bransjerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selskapetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ressurserRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const closeAll = () => { setTjenesterOpen(false); setBransjerOpen(false); setSelskapetOpen(false); setRessurserOpen(false); };

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
          <Link to="/" className="font-heading text-xl md:text-2xl text-primary tracking-wide">
            Avargo
          </Link>

          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            <Link to="/" className="text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">Hjem</Link>
            <Link to="/metoden" className="text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">Metoden</Link>

            {/* Tjenester */}
            <div className="relative" {...makeHandlers(setTjenesterOpen, tjenesterRef)}>
              <button className="flex items-center gap-1 text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">
                Tjenester <ChevronDown size={12} className={`transition-transform duration-300 ${tjenesterOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {tjenesterOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed top-[72px] left-0 right-0 bg-card/95 backdrop-blur-2xl border-b border-border/30 shadow-2xl p-6"
                  >
                    <div className="container mx-auto">
                    <div className="grid grid-cols-5 gap-6">
                      {tjenesterGroups.map((group) => (
                        <div key={group.label}>
                          <p className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 px-2.5 mb-2 font-medium">{group.label}</p>
                          <div className="flex flex-col gap-0.5">
                            {group.items.slice(0, 4).map((item) => (
                              <Link key={item.href} to={item.href} onClick={() => setTjenesterOpen(false)}
                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-primary/10 group transition-colors duration-200"
                              >
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                                  <item.icon size={13} className="text-primary" strokeWidth={1.5} />
                                </div>
                                <span className="text-[12.5px] text-foreground/80 group-hover:text-foreground transition-colors duration-200 leading-tight">{item.title}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/15">
                      <Link to="/tjenester" onClick={() => setTjenesterOpen(false)} className="text-[12px] tracking-wider text-primary/80 hover:text-primary transition-colors duration-200 font-medium">Se alle tjenester →</Link>
                    </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bransjer */}
            <div className="relative" {...makeHandlers(setBransjerOpen, bransjerRef)}>
              <button className="flex items-center gap-1 text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">
                Bransjer <ChevronDown size={12} className={`transition-transform duration-300 ${bransjerOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {bransjerOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/30 shadow-2xl p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      {bransjerItems.map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setBransjerOpen(false)}
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
                      <Link to="/bransjer" onClick={() => setBransjerOpen(false)} className="text-[12px] tracking-wider text-primary/80 hover:text-primary transition-colors duration-200 font-medium">Se alle bransjer →</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/priser" className="text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">Priser</Link>

            {/* Selskapet */}
            <div className="relative" {...makeHandlers(setSelskapetOpen, selskapetRef)}>
              <button className="flex items-center gap-1 text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">
                Selskapet <ChevronDown size={12} className={`transition-transform duration-300 ${selskapetOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {selskapetOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full right-0 mt-3 w-60 bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/30 shadow-2xl p-3"
                  >
                    {selskapetLinks.map((item) => (
                      <Link key={item.href} to={item.href} onClick={() => setSelskapetOpen(false)}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ressurser */}
            <div className="relative" {...makeHandlers(setRessurserOpen, ressurserRef)}>
              <button className="flex items-center gap-1 text-[13px] text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-light">
                Ressurser <ChevronDown size={12} className={`transition-transform duration-300 ${ressurserOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {ressurserOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full right-0 mt-3 w-64 bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/30 shadow-2xl p-3"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/kontakt" className="px-5 lg:px-6 py-2.5 text-[12px] font-medium bg-primary text-primary-foreground rounded-full hover:scale-[1.02] transition-all duration-500 tracking-wide">
              Kom i gang
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-2.5 -mr-2 rounded-xl active:bg-muted/40 transition-colors" aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/15 bg-background/98 backdrop-blur-2xl overflow-y-auto max-h-[calc(100dvh-64px)]"
            >
              <div className="flex flex-col gap-0 p-5 pb-8">
                <Link to="/" onClick={() => setMenuOpen(false)} className="py-4 text-[15px] text-foreground/80 hover:text-foreground transition-colors border-b border-border/15 tracking-wide">Hjem</Link>
                <Link to="/metoden" onClick={() => setMenuOpen(false)} className="py-4 text-[15px] text-foreground/80 hover:text-foreground transition-colors border-b border-border/15 tracking-wide">Metoden</Link>

                <button onClick={() => setMobileTjenesterOpen(!mobileTjenesterOpen)} className="flex items-center justify-between py-4 text-[15px] text-foreground/80 border-b border-border/15 tracking-wide w-full">
                  Tjenester <ChevronDown size={14} className={`transition-transform duration-300 ${mobileTjenesterOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileTjenesterOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {tjenesterGroups.map((group) => (
                          <div key={group.label} className="mb-3">
                            <p className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 px-2 mb-1.5 font-medium">{group.label}</p>
                            {group.items.map((item) => (
                              <Link key={item.href} to={item.href} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                                className="flex items-center gap-2.5 px-2 py-3 rounded-xl text-[14px] text-foreground/70 active:text-foreground active:bg-primary/5 hover:text-foreground transition-colors"
                              >
                                <item.icon size={13} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={() => setMobileBransjerOpen(!mobileBransjerOpen)} className="flex items-center justify-between py-4 text-[15px] text-foreground/80 border-b border-border/15 tracking-wide w-full">
                  Bransjer <ChevronDown size={14} className={`transition-transform duration-300 ${mobileBransjerOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileBransjerOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {bransjerItems.map((item) => (
                          <Link key={item.href + item.title} to={item.href} onClick={() => { setMenuOpen(false); setMobileBransjerOpen(false); }}
                            className="flex items-center gap-2.5 px-2 py-3 rounded-xl text-[14px] text-foreground/70 active:text-foreground active:bg-primary/5 hover:text-foreground transition-colors"
                          >
                            <item.icon size={13} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link to="/priser" onClick={() => setMenuOpen(false)} className="py-4 text-[15px] text-foreground/80 hover:text-foreground transition-colors border-b border-border/15 tracking-wide">Priser</Link>

                <button onClick={() => setMobileSelskapetOpen(!mobileSelskapetOpen)} className="flex items-center justify-between py-4 text-[15px] text-foreground/80 border-b border-border/15 tracking-wide w-full">
                  Selskapet <ChevronDown size={14} className={`transition-transform duration-300 ${mobileSelskapetOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileSelskapetOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {selskapetLinks.map((item) => (
                          <Link key={item.href} to={item.href} onClick={() => { setMenuOpen(false); setMobileSelskapetOpen(false); }}
                            className="flex items-center gap-2.5 px-2 py-3 rounded-xl text-[14px] text-foreground/70 hover:text-foreground transition-colors"
                          >
                            <item.icon size={14} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={() => setMobileRessurserOpen(!mobileRessurserOpen)} className="flex items-center justify-between py-4 text-[15px] text-foreground/80 border-b border-border/15 tracking-wide w-full">
                  Ressurser <ChevronDown size={14} className={`transition-transform duration-300 ${mobileRessurserOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileRessurserOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {ressurserLinks.map((item) => (
                          <Link key={item.title} to={item.href} onClick={() => { setMenuOpen(false); setMobileRessurserOpen(false); }}
                            className="flex items-center gap-2.5 px-2 py-3 rounded-xl text-[14px] text-foreground/70 hover:text-foreground transition-colors"
                          >
                            <item.icon size={14} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link to="/kontakt" onClick={() => setMenuOpen(false)} className="mt-5 px-5 py-4 text-[15px] font-medium bg-primary text-primary-foreground rounded-2xl text-center active:scale-[0.98] transition-all">
                  Kom i gang
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16 md:pt-[72px]">{children}</main>

      <footer className="border-t border-border/15 py-12 md:py-24 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-5 md:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-8">
            <div className="col-span-2 md:col-span-1 mb-4 md:mb-0">
              <Link to="/" className="font-heading text-2xl text-primary">Avargo</Link>
              <p className="mt-3 text-sm text-foreground/60 leading-relaxed font-light">
                Din finansielle arkitekt.<br />Presisjon. Innsikt. Vekst.
              </p>
              <Link to="/kontakt" className="inline-block mt-4 px-5 py-2.5 text-[12px] font-medium bg-primary text-primary-foreground rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 tracking-wide">
                Kom i gang
              </Link>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Tjenester</h4>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <Link to="/tjenester/regnskapsforer" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Dedikert regnskapsfører</Link>
                <Link to="/tjenester/cfo" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">CFO-as-a-Service</Link>
                <Link to="/tjenester/hr-og-lonn" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Lønn & HR</Link>
                <Link to="/tjenester/nettsider" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Nettsider</Link>
                <Link to="/tjenester/seo" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">SEO & søkbarhet</Link>
                <Link to="/tjenester/ai-automatisering" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">AI & automatisering</Link>
                <Link to="/tjenester" className="text-primary hover:text-primary/80 transition-colors text-[13px] mt-1 py-0.5">Se alle tjenester →</Link>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Bransjer</h4>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <Link to="/bransjer/tech-saas" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Tech & SaaS</Link>
                <Link to="/bransjer/eiendom" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Eiendom</Link>
                <Link to="/bransjer/bygg-anlegg" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Bygg & Anlegg</Link>
                <Link to="/bransjer/restaurant" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Restaurant & Uteliv</Link>
                <Link to="/bransjer/consulting" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Consulting</Link>
                <Link to="/bransjer" className="text-primary hover:text-primary/80 transition-colors text-[13px] mt-1 py-0.5">Se alle bransjer →</Link>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Ressurser</h4>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <Link to="/ressurser?tab=blogg" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Blogg</Link>
                <Link to="/ressurser?tab=guider" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Guider</Link>
                <Link to="/ressurser?tab=arkiv" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Arkiv & maler</Link>
                <Link to="/ressurser/kontohjelp" className="text-foreground/70 hover:text-foreground transition-colors">Kontohjelp</Link>
                <Link to="/ressurser/skattekalender" className="text-foreground/70 hover:text-foreground transition-colors">Skattekalender</Link>
                <Link to="/priser" className="text-foreground/70 hover:text-foreground transition-colors">Priser</Link>
                <Link to="/metoden" className="text-foreground/70 hover:text-foreground transition-colors">Vår metode</Link>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-foreground/60 mb-5 font-medium">Selskapet</h4>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <Link to="/om-oss" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Om Avargo</Link>
                <Link to="/kontakt" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Kontakt oss</Link>
                <Link to="/kunde/logg-inn" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Kundeportal</Link>
                <Link to="/faq" className="text-foreground/70 hover:text-foreground active:text-foreground transition-colors py-0.5">Vanlige spørsmål</Link>
                <Link to="/admin/logg-inn" className="text-foreground/70 hover:text-foreground transition-colors">Ansatt-innlogging</Link>
                <a href="mailto:kontakt@avargo.no" className="text-foreground/70 hover:text-foreground transition-colors">kontakt@avargo.no</a>
              </div>
            </div>
          </div>

          <div className="line-accent mt-12 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/40">
            <span>© 2026 Avargo. Alle rettigheter reservert.</span>
            <div className="flex gap-8">
              <Link to="/om-oss" className="hover:text-foreground transition-colors">Personvern</Link>
              <Link to="/om-oss" className="hover:text-foreground transition-colors">Vilkår</Link>
            </div>
          </div>
        </div>
    </footer>
      <AdminFloatingBar />
    </div>
  );
};

export default Layout;
