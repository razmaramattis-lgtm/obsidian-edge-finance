import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowLeft, ChevronRight, BookOpen, GraduationCap, Users, Briefcase, Sparkles, Calculator } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import patternImg from "@/assets/kurs-pattern.jpg";

const NAV_ITEMS = [
  { label: "Hjem", path: "/kurs", icon: Sparkles },
  { label: "Kurskatalog", path: "/kurs/katalog", icon: BookOpen },
  { label: "Regnskapskurs", path: "/kurs/regnskap", icon: Calculator },
  { label: "Bedriftskurs", path: "/kurs/bedriftskurs", icon: Briefcase },
  { label: "HR-kurs", path: "/kurs/hr-kurs", icon: Users },
  { label: "Om kursene", path: "/kurs/om", icon: GraduationCap },
];

/* ── Header ── */
const KursHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) =>
    path === "/kurs" ? pathname === "/kurs" : pathname.startsWith(path);

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
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 via-primary/30 to-secondary/30" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ width: "40%" }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/kurs" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-4 rounded-2xl bg-secondary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img src="/logo.png" alt="Avargo" className="h-7 relative z-10" />
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-secondary leading-none">Kurs</span>
                <span className="text-[8px] tracking-[0.15em] uppercase text-muted-foreground/50 leading-none mt-0.5">Kompetanseheving</span>
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
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Icon size={14} className={active ? "text-primary-foreground" : ""} />
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="kurs-nav-indicator"
                        className="absolute inset-0 rounded-xl bg-secondary shadow-lg shadow-secondary/30 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-border/10 hover:border-secondary/20 hover:bg-secondary/5 transition-all duration-300"
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
              <img src={patternImg} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "hsl(var(--secondary) / 0.4)" : "hsl(var(--primary) / 0.3)",
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
                        active
                          ? "text-primary-foreground bg-secondary shadow-2xl shadow-secondary/30"
                          : "text-foreground hover:bg-muted/20 border border-border/10"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        active ? "bg-primary-foreground/20" : "bg-secondary/10"
                      }`}>
                        <Icon size={18} className={active ? "text-primary-foreground" : "text-secondary"} />
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
const KursFooter = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <footer ref={footerRef} className="relative border-t border-border/10 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]">
        <img src={patternImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />

      <motion.div style={{ opacity, y }} className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div className="md:col-span-1">
            <Link to="/kurs" className="flex items-center gap-2 mb-5">
              <img src="/logo.png" alt="Avargo" className="h-6" />
              <span className="text-xs tracking-[0.15em] uppercase font-semibold text-secondary">Kurs</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Kompetanseheving innen regnskap, HR, AI, markedsføring og ledelse — levert av Avargo.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              130+ tilgjengelige kurs
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-5">Kurs</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-secondary transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-5">Fagområder</h4>
            <ul className="space-y-3">
              {["Regnskap & Økonomi", "HR & Personal", "AI & Teknologi", "Markedsføring"].map((dept) => (
                <li key={dept}>
                  <Link to="/kurs/katalog" className="text-sm text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-secondary transition-all duration-300" />
                    {dept}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-5">Avargo</h4>
            <ul className="space-y-3">
              <li><Link to="/om-oss" className="text-sm text-muted-foreground hover:text-secondary transition-colors">Om oss</Link></li>
              <li><Link to="/kontakt" className="text-sm text-muted-foreground hover:text-secondary transition-colors">Kontakt</Link></li>
              <li><Link to="/karriere" className="text-sm text-muted-foreground hover:text-secondary transition-colors">Karriere</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-secondary transition-colors">avargo.no</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Avargo AS. Alle rettigheter reservert.</p>
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-secondary/30 to-primary/30" />
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <ArrowLeft size={11} /> Gå til avargo.no
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

const KursLayout = () => (
  <div className="min-h-screen flex flex-col">
    <KursHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <KursFooter />
  </div>
);

export default KursLayout;
