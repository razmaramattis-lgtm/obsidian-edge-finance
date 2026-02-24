import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowLeft, ChevronRight, BookOpen, GraduationCap, Users, Building2, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import networkImg from "@/assets/karriere-network-glow.jpg";

const NAV_ITEMS = [
  { label: "Alle kurs", path: "/akademi", icon: Sparkles },
  { label: "Bedriftskurs", path: "/akademi/bedriftskurs", icon: Building2 },
  { label: "HR & Arbeidsgiver", path: "/akademi/hr-kurs", icon: Users },
];

const ACCENT = "hsl(35 80% 58%)";
const ACCENT_GLOW = "hsl(35 90% 68%)";

/* ── Header ── */
const AkademiHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) =>
    path === "/akademi" ? pathname === "/akademi" : pathname.startsWith(path);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-background/80 backdrop-blur-3xl border-b border-border/10 shadow-2xl shadow-background/50"
            : "bg-transparent"
        }`}
      >
        <div className="h-[2px] w-full relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${ACCENT}30, ${ACCENT_GLOW}30, ${ACCENT}30)` }} />
          <motion.div
            className="absolute inset-0"
            style={{ width: "40%", background: `linear-gradient(to right, ${ACCENT}, ${ACCENT_GLOW}, ${ACCENT})` }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/akademi" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ backgroundColor: `${ACCENT}08` }} />
              <img src="/logo.png" alt="Avargo" className="h-7 relative z-10" />
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold leading-none" style={{ color: ACCENT }}>Akademi</span>
                <span className="text-[8px] tracking-[0.15em] uppercase text-muted-foreground/50 leading-none mt-0.5">Kurs & kompetanse</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 relative">
              <div className="absolute inset-0 rounded-2xl bg-muted/15 backdrop-blur-md border border-border/5 -m-1.5" />
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Icon size={14} className={active ? "text-primary-foreground" : ""} />
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="akademi-nav-indicator"
                        className="absolute inset-0 rounded-xl shadow-lg -z-10"
                        style={{ backgroundColor: ACCENT, boxShadow: `0 4px 14px ${ACCENT}40` }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-border/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              <ArrowLeft size={12} /> avargo.no
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-foreground hover:bg-muted/30 transition-colors relative"
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

      <div className="h-16 md:h-20" />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-3xl md:hidden flex flex-col"
          >
            <div className="absolute inset-0 opacity-[0.06]">
              <img src={networkImg} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: i % 2 === 0 ? `${ACCENT}66` : `${ACCENT_GLOW}4D`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
                />
              ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10 px-8">
              {NAV_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="w-full max-w-sm"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-lg font-medium transition-all ${
                        active ? "text-primary-foreground shadow-2xl" : "text-foreground hover:bg-muted/20 border border-border/10"
                      }`}
                      style={active ? { backgroundColor: ACCENT, boxShadow: `0 8px 30px ${ACCENT}40` } : undefined}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: active ? "rgba(255,255,255,0.15)" : `${ACCENT}15` }}>
                        <Icon size={18} style={{ color: active ? "white" : ACCENT }} />
                      </div>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6">
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

/* ── Footer ── */
const AkademiFooter = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <footer ref={footerRef} className="relative border-t border-border/10 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]">
        <img src={networkImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />

      <motion.div style={{ opacity, y }} className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div className="md:col-span-1">
            <Link to="/akademi" className="flex items-center gap-2 mb-5">
              <img src="/logo.png" alt="Avargo" className="h-6" />
              <span className="text-xs tracking-[0.15em] uppercase font-semibold" style={{ color: ACCENT }}>Akademi</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Praktiske kurs innen regnskap, HR, markedsføring og teknologi — bygget for norske bedriftseiere og ledere.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: ACCENT }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: ACCENT }} />
              </span>
              Nye kurs lanseres løpende
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-5">Akademi</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-300" style={{ backgroundColor: ACCENT }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-5">Kategorier</h4>
            <ul className="space-y-3">
              {["Regnskap", "HR & Personal", "Markedsføring", "IT & AI"].map((cat) => (
                <li key={cat}>
                  <Link to="/akademi" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-300" style={{ backgroundColor: ACCENT }} />
                    {cat}
                  </Link>
                </li>
              ))}
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
            <div className="h-px w-16" style={{ background: `linear-gradient(to right, ${ACCENT}4D, ${ACCENT}1A)` }} />
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <ArrowLeft size={11} /> Gå til avargo.no
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

const AkademiLayout = () => (
  <div className="min-h-screen flex flex-col">
    <AkademiHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <AkademiFooter />
  </div>
);

export default AkademiLayout;
