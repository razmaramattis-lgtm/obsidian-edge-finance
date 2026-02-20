import { Link, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, BookOpen, TrendingUp, Briefcase, Users,
  LayoutTemplate, Search, Megaphone, Globe, ShoppingCart, Bot,
} from "lucide-react";

const tjenesterGroups = [
  {
    label: "Regnskap & Økonomi",
    items: [
      { icon: BookOpen, title: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
      { icon: TrendingUp, title: "AI-drevet finansiell innsikt", href: "/tjenester/ai-innsikt" },
    ],
  },
  {
    label: "CFO & HR",
    items: [
      { icon: Briefcase, title: "CFO-as-a-Service", href: "/tjenester/cfo" },
      { icon: Users, title: "Lønn & HR-administrasjon", href: "/tjenester/hr-og-lonn" },
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

const navItems = [
  { label: "Bransjer", href: "/bransjer" },
  { label: "Metoden", href: "/metoden" },
  { label: "Priser", href: "/priser" },
  { label: "Om oss", href: "/om-oss" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tjenesterOpen, setTjenesterOpen] = useState(false);
  const [mobileTjenesterOpen, setMobileTjenesterOpen] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setTjenesterOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setTjenesterOpen(false), 120);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 backdrop-blur-2xl bg-background/50">
        <div className="container mx-auto flex items-center justify-between h-16 md:h-[72px] px-4 md:px-6">
          <Link to="/" className="font-heading text-xl md:text-2xl text-primary tracking-wide">
            Avargo
          </Link>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {/* Tjenester med hover-dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
                Tjenester
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-300 ${tjenesterOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {tjenesterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[620px] glass rounded-2xl border border-border/20 shadow-2xl p-5 overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-1">
                      {tjenesterGroups.map((group) => (
                        <div key={group.label}>
                          <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/50 px-2.5 mb-2">
                            {group.label}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setTjenesterOpen(false)}
                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-primary/8 group transition-colors duration-200"
                              >
                                <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                                  <item.icon size={13} className="text-primary" strokeWidth={1.5} />
                                </div>
                                <span className="text-[12px] text-foreground/70 group-hover:text-foreground transition-colors duration-200 leading-tight">
                                  {item.title}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/10">
                      <Link
                        to="/tjenester"
                        onClick={() => setTjenesterOpen(false)}
                        className="text-[11px] tracking-wider text-muted-foreground/50 hover:text-primary transition-colors duration-200"
                      >
                        Se alle tjenester →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/kontakt"
              className="px-6 lg:px-7 py-2.5 text-[13px] font-medium bg-primary text-primary-foreground rounded-full hover:scale-[1.02] transition-all duration-500 tracking-wide"
            >
              Kom i gang
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-foreground p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/10 bg-background/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-1 p-5">
                {/* Mobile Tjenester accordion */}
                <button
                  onClick={() => setMobileTjenesterOpen(!mobileTjenesterOpen)}
                  className="flex items-center justify-between py-4 text-[14px] text-muted-foreground hover:text-foreground transition-colors border-b border-border/10 tracking-wide w-full"
                >
                  Tjenester
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${mobileTjenesterOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileTjenesterOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="py-2 pl-3 flex flex-col gap-0.5">
                        {tjenesterGroups.map((group) => (
                          <div key={group.label} className="mb-3">
                            <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 px-2 mb-1.5">
                              {group.label}
                            </p>
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => { setMenuOpen(false); setMobileTjenesterOpen(false); }}
                                className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <item.icon size={13} className="text-primary shrink-0" strokeWidth={1.5} />
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-4 text-[14px] text-muted-foreground hover:text-foreground transition-colors border-b border-border/10 tracking-wide"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/kontakt"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 px-5 py-3.5 text-[13px] font-medium bg-primary text-primary-foreground rounded-full text-center"
                >
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
