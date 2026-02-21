import { Link, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, BookOpen, TrendingUp, Briefcase, Users,
  LayoutTemplate, Search, Megaphone, Globe, ShoppingCart, Bot,
  Building2, Landmark, HardHat, Store, Heart, Tractor, Zap,
  Mail, Info, FileText, BookMarked, Newspaper, Lock, Archive,
} from "lucide-react";

const tjenesterGroups = [
  {
    label: "Regnskap & Økonomi",
    items: [
      { icon: BookOpen, title: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
      { icon: Briefcase, title: "CFO-as-a-Service", href: "/tjenester/cfo" },
      { icon: Users, title: "Lønn & HR-administrasjon", href: "/tjenester/hr-og-lonn" },
      { icon: BookOpen, title: "Regnskapskurs", href: "/tjenester/kurs" },
    ],
  },
  {
    label: "Markedsføring & Vekst",
    items: [
      { icon: LayoutTemplate, title: "Nettsider & digitale flater", href: "/tjenester/nettsider" },
      { icon: Search, title: "SEO & søkbarhet", href: "/tjenester/seo" },
      { icon: Megaphone, title: "Meta-annonser", href: "/tjenester/meta-annonser" },
      { icon: Globe, title: "Google Ads", href: "/tjenester/google-ads" },
      { icon: ShoppingCart, title: "Nettbutikk & e-handel", href: "/tjenester/nettbutikk" },
      { icon: Bot, title: "AI & automatisering", href: "/tjenester/ai-automatisering" },
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
  { icon: Info, title: "Om oss", desc: "Hvem vi er og hva vi tror på", href: "/om-oss" },
  { icon: Mail, title: "Kontakt", desc: "Ta kontakt med oss direkte", href: "/kontakt" },
  { icon: Lock, title: "Ansatte-login", desc: "Intern portal for Avargo-ansatte", href: "/admin/logg-inn" },
];

const ressurserLinks = [
  { icon: Newspaper, title: "Nyheter", desc: "Siste nytt fra Avargo", href: "/ressurser?tab=nyheter" },
  { icon: FileText, title: "Blogg", desc: "Artikler om regnskap og økonomi", href: "/ressurser?tab=blogg" },
  { icon: BookMarked, title: "Guider", desc: "Praktiske guider for bedriftseiere", href: "/ressurser?tab=guider" },
  { icon: Archive, title: "Arkiv", desc: "Skjemaer og maler til nedlasting", href: "/ressurser?tab=arkiv" },
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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 backdrop-blur-2xl bg-background/50">
        <div className="container mx-auto flex items-center justify-between h-16 md:h-[72px] px-4 md:px-6">
          <Link to="/" className="font-heading text-xl md:text-2xl text-primary tracking-wide">
            Avargo
          </Link>

          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {/* Hjem */}
            <Link to="/" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">Hjem</Link>

            {/* Metoden */}
            <Link to="/metoden" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">Metoden</Link>

            {/* Tjenester */}
            <div className="relative" {...makeHandlers(setTjenesterOpen, tjenesterRef)}>
              <button className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
                Tjenester <ChevronDown size={12} className={`transition-transform duration-300 ${tjenesterOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {tjenesterOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] glass rounded-2xl border border-border/20 shadow-2xl p-5"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {tjenesterGroups.map((group) => (
                        <div key={group.label}>
                          <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/50 px-2.5 mb-2">{group.label}</p>
                          <div className="flex flex-col gap-0.5">
                            {group.items.map((item) => (
                              <Link key={item.href} to={item.href} onClick={() => setTjenesterOpen(false)}
                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-primary/8 group transition-colors duration-200"
                              >
                                <div className="w-6 h-6 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                                  <item.icon size={12} className="text-primary" strokeWidth={1.5} />
                                </div>
                                <span className="text-[11.5px] text-foreground/70 group-hover:text-foreground transition-colors duration-200 leading-tight">{item.title}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/10">
                      <Link to="/tjenester" onClick={() => setTjenesterOpen(false)} className="text-[11px] tracking-wider text-muted-foreground/50 hover:text-primary transition-colors duration-200">Se alle tjenester →</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bransjer */}
            <div className="relative" {...makeHandlers(setBransjerOpen, bransjerRef)}>
              <button className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
                Bransjer <ChevronDown size={12} className={`transition-transform duration-300 ${bransjerOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {bransjerOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 glass rounded-2xl border border-border/20 shadow-2xl p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      {bransjerItems.map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setBransjerOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-primary/8 group transition-colors duration-200"
                        >
                          <div className="w-6 h-6 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                            <item.icon size={12} className="text-primary" strokeWidth={1.5} />
                          </div>
                          <span className="text-[11.5px] text-foreground/70 group-hover:text-foreground transition-colors duration-200">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-border/10">
                      <Link to="/bransjer" onClick={() => setBransjerOpen(false)} className="text-[11px] tracking-wider text-muted-foreground/50 hover:text-primary transition-colors duration-200">Se alle bransjer →</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Priser */}
            <Link to="/priser" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">Priser</Link>

            {/* Selskapet */}
            <div className="relative" {...makeHandlers(setSelskapetOpen, selskapetRef)}>
              <button className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
                Selskapet <ChevronDown size={12} className={`transition-transform duration-300 ${selskapetOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {selskapetOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full right-0 mt-3 w-56 glass rounded-2xl border border-border/20 shadow-2xl p-3"
                  >
                    {selskapetLinks.map((item) => (
                      <Link key={item.href} to={item.href} onClick={() => setSelskapetOpen(false)}
                        className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-primary/8 group transition-colors duration-200"
                      >
                        <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-200 mt-0.5">
                          <item.icon size={13} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[12px] text-foreground/80 group-hover:text-foreground font-medium transition-colors duration-200">{item.title}</p>
                          <p className="text-[10.5px] text-muted-foreground/60 leading-tight">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ressurser */}
            <div className="relative" {...makeHandlers(setRessurserOpen, ressurserRef)}>
              <button className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
                Ressurser <ChevronDown size={12} className={`transition-transform duration-300 ${ressurserOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {ressurserOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full right-0 mt-3 w-60 glass rounded-2xl border border-border/20 shadow-2xl p-3"
                  >
                    {ressurserLinks.map((item) => (
                      <Link key={item.title} to={item.href} onClick={() => setRessurserOpen(false)}
                        className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-primary/8 group transition-colors duration-200"
                      >
                        <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-200 mt-0.5">
                          <item.icon size={13} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[12px] text-foreground/80 group-hover:text-foreground font-medium transition-colors duration-200">{item.title}</p>
                          <p className="text-[10.5px] text-muted-foreground/60 leading-tight">{item.desc}</p>
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

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-1" aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/10 bg-background/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-1 p-5">
                <Link to="/" onClick={() => setMenuOpen(false)} className="py-4 text-[14px] text-muted-foreground hover:text-foreground transition-colors border-b border-border/10 tracking-wide">Hjem</Link>
                <Link to="/metoden" onClick={() => setMenuOpen(false)} className="py-4 text-[14px] text-muted-foreground hover:text-foreground transition-colors border-b border-border/10 tracking-wide">Metoden</Link>

                {/* Mobile Tjenester */}
                <button onClick={() => setMobileTjenesterOpen(!mobileTjenesterOpen)} className="flex items-center justify-between py-4 text-[14px] text-muted-foreground border-b border-border/10 tracking-wide w-full">
                  Tjenester <ChevronDown size={14} className={`transition-transform duration-300 ${mobileTjenesterOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileTjenesterOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {tjenesterGroups.map((group) => (
                          <div key={group.label} className="mb-3">
                            <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 px-2 mb-1.5">{group.label}</p>
                            {group.items.map((item) => (
                              <Link key={item.href} to={item.href} onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                                className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <item.icon size={12} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile Bransjer */}
                <button onClick={() => setMobileBransjerOpen(!mobileBransjerOpen)} className="flex items-center justify-between py-4 text-[14px] text-muted-foreground border-b border-border/10 tracking-wide w-full">
                  Bransjer <ChevronDown size={14} className={`transition-transform duration-300 ${mobileBransjerOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileBransjerOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {bransjerItems.map((item) => (
                          <Link key={item.href + item.title} to={item.href} onClick={() => { setMenuOpen(false); setMobileBransjerOpen(false); }}
                            className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <item.icon size={12} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link to="/priser" onClick={() => setMenuOpen(false)} className="py-4 text-[14px] text-muted-foreground hover:text-foreground transition-colors border-b border-border/10 tracking-wide">Priser</Link>

                {/* Mobile Selskapet */}
                <button onClick={() => setMobileSelskapetOpen(!mobileSelskapetOpen)} className="flex items-center justify-between py-4 text-[14px] text-muted-foreground border-b border-border/10 tracking-wide w-full">
                  Selskapet <ChevronDown size={14} className={`transition-transform duration-300 ${mobileSelskapetOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileSelskapetOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {selskapetLinks.map((item) => (
                          <Link key={item.href} to={item.href} onClick={() => { setMenuOpen(false); setMobileSelskapetOpen(false); }}
                            className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <item.icon size={13} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile Ressurser */}
                <button onClick={() => setMobileRessurserOpen(!mobileRessurserOpen)} className="flex items-center justify-between py-4 text-[14px] text-muted-foreground border-b border-border/10 tracking-wide w-full">
                  Ressurser <ChevronDown size={14} className={`transition-transform duration-300 ${mobileRessurserOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileRessurserOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {ressurserLinks.map((item) => (
                          <Link key={item.title} to={item.href} onClick={() => { setMenuOpen(false); setMobileRessurserOpen(false); }}
                            className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <item.icon size={13} className="text-primary shrink-0" strokeWidth={1.5} /> {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link to="/kontakt" onClick={() => setMenuOpen(false)} className="mt-4 px-5 py-3.5 text-[13px] font-medium bg-primary text-primary-foreground rounded-full text-center">
                  Kom i gang
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16 md:pt-[72px]">{children}</main>

      <footer className="border-t border-border/10 py-16 md:py-24 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14">
            <div className="col-span-2 md:col-span-1">
              <span className="font-heading text-2xl text-primary">Avargo</span>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed font-light">
                Din finansielle arkitekt.<br />Presisjon. Innsikt. Vekst.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">Tjenester</h4>
              <div className="flex flex-col gap-3 text-sm font-light">
                <Link to="/tjenester/regnskapsforer" className="text-foreground/40 hover:text-foreground transition-colors">Dedikert regnskapsfører</Link>
                <Link to="/tjenester/ai-innsikt" className="text-foreground/40 hover:text-foreground transition-colors">AI-drevet innsikt</Link>
                <Link to="/tjenester/hr-og-lonn" className="text-foreground/40 hover:text-foreground transition-colors">Lønn & HR</Link>
                <Link to="/tjenester/cfo" className="text-foreground/40 hover:text-foreground transition-colors">CFO-as-a-Service</Link>
                <Link to="/tjenester" className="text-foreground/40 hover:text-foreground transition-colors">Se alle tjenester →</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">Bransjer</h4>
              <div className="flex flex-col gap-3 text-sm font-light">
                <Link to="/bransjer/tech-saas" className="text-foreground/40 hover:text-foreground transition-colors">Tech & SaaS</Link>
                <Link to="/bransjer/eiendom" className="text-foreground/40 hover:text-foreground transition-colors">Eiendom & Utvikling</Link>
                <Link to="/bransjer/landbruk" className="text-foreground/40 hover:text-foreground transition-colors">Landbruk</Link>
                <Link to="/bransjer/bygg-anlegg" className="text-foreground/40 hover:text-foreground transition-colors">Bygg & Anlegg</Link>
                <Link to="/bransjer" className="text-foreground/40 hover:text-foreground transition-colors">Se alle bransjer →</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">Kontakt</h4>
              <div className="flex flex-col gap-3 text-sm font-light">
                <a href="mailto:post@avargo.no" className="text-foreground/40 hover:text-foreground transition-colors">post@avargo.no</a>
                <a href="tel:+4722000000" className="text-foreground/40 hover:text-foreground transition-colors">+47 22 00 00 00</a>
                <Link to="/kontakt" className="text-foreground/40 hover:text-foreground transition-colors">Oslo, Norge</Link>
              </div>
            </div>
          </div>
          <div className="line-accent mt-12 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/30">
            <span>© 2026 Avargo</span>
            <div className="flex gap-8">
              <span className="hover:text-foreground transition-colors cursor-pointer">Personvern</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Vilkår</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
