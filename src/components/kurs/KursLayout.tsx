import { useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen, GraduationCap, Users, Briefcase, Sparkles, Calculator } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === "/kurs" ? pathname === "/kurs" : pathname.startsWith(path);

  return (
    <>
      {/* Desktop header */}
      <header className="fixed top-0 inset-x-0 z-50 hidden md:block bg-background/80 backdrop-blur-3xl border-b border-border/10 shadow-2xl shadow-background/50">
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
          <div className="flex items-center justify-between h-20">
            <Link to="/kurs" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Avargo" className="h-7" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-secondary leading-none">Kurs</span>
            </Link>

            <nav className="flex items-center gap-1 relative">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-border/10 hover:border-secondary/20 hover:bg-secondary/5 transition-all duration-300"
            >
              <ArrowLeft size={12} /> avargo.no
            </Link>
          </div>
        </div>
      </header>

      <div className="hidden md:block h-20" />

      {/* Mobile minimal top bar */}
      <header className="fixed top-0 inset-x-0 z-50 md:hidden bg-background/90 backdrop-blur-2xl border-b border-border/10">
        <div className="flex items-center justify-between h-12 px-4">
          <Link to="/kurs" className="flex items-center gap-2">
            <img src="/logo.png" alt="Avargo" className="h-5" />
            <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-secondary">Kurs</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={11} /> avargo.no
          </Link>
        </div>
      </header>

      <div className="md:hidden h-12" />
    </>
  );
};

/* ── Mobile bottom tab bar ── */
const MobileTabBar = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === "/kurs" ? pathname === "/kurs" : pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-background/95 backdrop-blur-2xl border-t border-border/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors duration-200 ${
                active ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {active && (
                  <motion.div
                    layoutId="kurs-tab-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                  />
                )}
              </div>
              <span className={`text-[10px] leading-none ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
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

      <motion.div style={{ opacity, y }} className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/kurs" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Avargo" className="h-5 md:h-6" />
              <span className="text-xs tracking-[0.15em] uppercase font-semibold text-secondary">Kurs</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Kompetanseheving innen regnskap, HR, AI og ledelse.
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
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-4">Kurs</h4>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-4">Fagområder</h4>
            <ul className="space-y-2.5">
              {["Regnskap & Økonomi", "HR & Personal", "AI & Teknologi", "Markedsføring"].map((dept) => (
                <li key={dept}>
                  <Link to="/kurs/katalog" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                    {dept}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-4">Avargo</h4>
            <ul className="space-y-2.5">
              <li><Link to="/om-oss" className="text-sm text-muted-foreground hover:text-secondary transition-colors">Om oss</Link></li>
              <li><Link to="/kontakt" className="text-sm text-muted-foreground hover:text-secondary transition-colors">Kontakt</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-secondary transition-colors">avargo.no</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Avargo AS</p>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <ArrowLeft size={11} /> Gå til avargo.no
          </Link>
        </div>
      </motion.div>

      <div className="md:hidden h-20" />
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
    <MobileTabBar />
  </div>
);

export default KursLayout;
