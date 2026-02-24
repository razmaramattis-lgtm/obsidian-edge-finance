import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowLeft, ChevronRight, ChevronDown, Home, BookOpen, Briefcase, Building2, CreditCard, Mail, Info, FileText } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useSection, type SectionConfig } from "@/contexts/SectionContext";
import networkImg from "@/assets/karriere-network-glow.jpg";

const getNavItems = (section: SectionConfig) => [
  { label: "Hjem", path: section.basePath, icon: Home, exact: true },
  { label: "Metoden", path: `${section.basePath}/metoden`, icon: BookOpen },
  { label: "Tjenester", path: `${section.basePath}/tjenester`, icon: Briefcase },
  { label: "Bransjer", path: `${section.basePath}/bransjer`, icon: Building2 },
  { label: "Priser", path: `${section.basePath}/priser`, icon: CreditCard },
  { label: "Kontakt", path: `${section.basePath}/kontakt`, icon: Mail },
  { label: "Om oss", path: `${section.basePath}/om-oss`, icon: Info },
  { label: "Ressurser", path: `${section.basePath}/ressurser`, icon: FileText },
];

/* ── Section Header ── */
const SectionHeader = ({ section }: { section: SectionConfig }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navItems = getNavItems(section);

  const accentColor = `hsl(${section.accent.h} ${section.accent.s}% ${section.accent.l}%)`;
  const accentGlow = `hsl(${section.accentGlow.h} ${section.accentGlow.s}% ${section.accentGlow.l}%)`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string, exact?: boolean) =>
    exact ? pathname === path : pathname.startsWith(path);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-background/80 backdrop-blur-3xl border-b border-border/10 shadow-2xl shadow-background/50"
            : "bg-transparent"
        }`}
      >
        {/* Animated accent line using section color */}
        <div className="h-[2px] w-full relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${accentColor}30, ${accentGlow}30, ${accentColor}30)`,
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              width: "40%",
              background: `linear-gradient(to right, ${accentColor}, ${accentGlow}, ${accentColor})`,
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={section.basePath} className="flex items-center gap-3 group relative">
              <div
                className="absolute -inset-4 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ backgroundColor: `${accentColor}08` }}
              />
              <img src="/logo.png" alt="Avargo" className="h-7 relative z-10" />
              <div className="relative z-10 flex flex-col">
                <span
                  className="text-[10px] tracking-[0.25em] uppercase font-semibold leading-none"
                  style={{ color: accentColor }}
                >
                  {section.shortName}
                </span>
                <span className="text-[8px] tracking-[0.15em] uppercase text-muted-foreground/50 leading-none mt-0.5">
                  {section.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 relative">
              <div className="absolute inset-0 rounded-2xl bg-muted/15 backdrop-blur-md border border-border/5 -m-1.5" />
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative z-10 flex items-center gap-1.5 px-3 xl:px-4 py-2.5 rounded-xl text-[12.5px] font-medium transition-all duration-300 ${
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Icon size={13} className={active ? "text-primary-foreground" : ""} />
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="section-nav-indicator"
                        className="absolute inset-0 rounded-xl shadow-lg -z-10"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: `0 4px 14px ${accentColor}40`,
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop back link */}
            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-border/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              <ArrowLeft size={12} /> avargo.no
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-foreground hover:bg-muted/30 transition-colors relative"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16 md:h-20" />

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-3xl lg:hidden flex flex-col"
          >
            <div className="absolute inset-0 opacity-[0.06]">
              <img src={networkImg} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: i % 2 === 0 ? `${accentColor}66` : `${accentGlow}4D`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
                />
              ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-3 relative z-10 px-8 pt-16">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="w-full max-w-sm"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-medium transition-all ${
                        active
                          ? "text-primary-foreground shadow-2xl"
                          : "text-foreground hover:bg-muted/20 border border-border/10"
                      }`}
                      style={active ? {
                        backgroundColor: accentColor,
                        boxShadow: `0 8px 30px ${accentColor}40`,
                      } : undefined}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: active ? "rgba(255,255,255,0.15)" : `${accentColor}15`,
                        }}
                      >
                        <Icon size={16} style={{ color: active ? "white" : accentColor }} />
                      </div>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4">
                <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={14} /> Tilbake til avargo.no
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ── Section Footer ── */
const SectionFooter = ({ section }: { section: SectionConfig }) => {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const navItems = getNavItems(section);
  const accentColor = `hsl(${section.accent.h} ${section.accent.s}% ${section.accent.l}%)`;

  return (
    <footer ref={footerRef} className="relative border-t border-border/10 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]">
        <img src={networkImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />

      <motion.div style={{ opacity, y }} className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div className="md:col-span-1">
            <Link to={section.basePath} className="flex items-center gap-2 mb-5">
              <img src="/logo.png" alt="Avargo" className="h-6" />
              <span className="text-xs tracking-[0.15em] uppercase font-semibold" style={{ color: accentColor }}>
                {section.shortName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {section.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-5">{section.shortName}</h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                    <span
                      className="w-0 group-hover:w-3 h-px transition-all duration-300"
                      style={{ backgroundColor: accentColor }}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-5">Avdelinger</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Avargo</Link></li>
              <li><Link to="/regnskap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Regnskap</Link></li>
              <li><Link to="/hr" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Personal</Link></li>
              <li><Link to="/markedsforing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Marked</Link></li>
              <li><Link to="/it" className="text-sm text-muted-foreground hover:text-foreground transition-colors">IT</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-5">Avargo</h4>
            <ul className="space-y-3">
              <li><Link to="/om-oss" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Om oss</Link></li>
              <li><Link to="/kontakt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kontakt</Link></li>
              <li><Link to="/karriere" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Karriere</Link></li>
              <li><Link to="/personvern" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Personvern</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">avargo.no</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Avargo AS. Alle rettigheter reservert.</p>
          <div className="flex items-center gap-4">
            <div
              className="h-px w-16"
              style={{
                background: `linear-gradient(to right, ${accentColor}4D, ${accentColor}1A)`,
              }}
            />
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <ArrowLeft size={11} /> Gå til avargo.no
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

const SectionLayout = () => {
  const { section } = useSection();

  if (!section) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SectionHeader section={section} />
      <main className="flex-1">
        <Outlet />
      </main>
      <SectionFooter section={section} />
    </div>
  );
};

export default SectionLayout;
