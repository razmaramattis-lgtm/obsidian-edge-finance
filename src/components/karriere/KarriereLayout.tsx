import { useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowLeft, Zap, Briefcase, Users, Sparkles, Home } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import networkImg from "@/assets/karriere-network-glow.jpg";

const NAV_ITEMS = [
  { label: "Hjem", path: "/karriere", icon: Home },
  { label: "Fagområder", path: "/karriere/fagomrader", icon: Users },
  { label: "Stillinger", path: "/karriere/stillinger", icon: Briefcase },
  { label: "Avargo Fri", path: "/karriere/avargo-fri", icon: Zap },
];

/* ── Header (desktop top bar + mobile minimal top bar) ── */
const KarriereHeader = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === "/karriere" ? pathname === "/karriere" : pathname.startsWith(path);

  return (
    <>
      {/* ── Desktop header ── */}
      <header className="fixed top-0 inset-x-0 z-[80] hidden md:block bg-background/80 backdrop-blur-3xl border-b border-border/10 shadow-2xl shadow-background/50">
        {/* Animated accent line */}
        <div className="h-[2px] w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ width: "40%" }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/karriere" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Avargo" className="h-7" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary leading-none">Karriere</span>
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
                        layoutId="karriere-nav-indicator"
                        className="absolute inset-0 rounded-xl bg-primary shadow-lg shadow-primary/30 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-border/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              <ArrowLeft size={12} /> avargo.no
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop spacer */}
      <div className="hidden md:block h-20" />

      {/* ── Mobile minimal top bar ── */}
      <header className="fixed top-0 inset-x-0 z-[80] md:hidden bg-background/90 backdrop-blur-2xl border-b border-border/10">
        <div className="flex items-center justify-between h-12 px-4">
          <Link to="/karriere" className="flex items-center gap-2">
            <img src="/logo.png" alt="Avargo" className="h-5" />
            <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-primary">Karriere</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={11} /> avargo.no
          </Link>
        </div>
      </header>

      {/* Mobile spacer */}
      <div className="md:hidden h-12" />
    </>
  );
};

/* ── Mobile bottom tab bar (app-style) ── */
const MobileTabBar = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === "/karriere" ? pathname === "/karriere" : pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[80] md:hidden bg-background/95 backdrop-blur-2xl border-t border-border/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors duration-200 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {active && (
                  <motion.div
                    layoutId="karriere-tab-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
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
const KarriereFooter = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <footer ref={footerRef} className="relative overflow-hidden">
      {/* CTA band */}
      <div className="relative border-t border-border/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="container mx-auto px-4 relative py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-xl md:text-2xl text-foreground mb-1">Bli en del av Avargo</h3>
            <p className="text-sm text-muted-foreground font-light">Se ledige stillinger og søk i dag.</p>
          </div>
          <Link to="/karriere/stillinger" className="shrink-0 px-8 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-primary/25">
            Se stillinger →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-border/10 relative">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src={networkImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/98 to-background/90" />
        <motion.div style={{ opacity, y }} className="relative z-10 container mx-auto px-4 pt-12 md:pt-20 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
            {/* Brand */}
            <div className="col-span-2 md:col-span-3">
              <Link to="/karriere" className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Avargo" className="h-5 md:h-6" />
                <span className="text-xs tracking-[0.15em] uppercase font-semibold text-primary">Karriere</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-[260px]">
                Bli en del av teamet som bygger fremtidens rådgivning.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
                Vi rekrutterer nå
              </div>
            </div>

            {/* Karriere */}
            <div className="col-span-1 md:col-span-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-semibold">Karriere</p>
              <ul className="space-y-2 text-[13px] font-light">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}><Link to={item.path} className="text-muted-foreground hover:text-primary transition-colors">{item.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Fagområder */}
            <div className="col-span-1 md:col-span-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-semibold">Fagområder</p>
              <ul className="space-y-2 text-[13px] font-light">
                {["Regnskap", "Personal", "Marked", "IT"].map((dept) => (
                  <li key={dept}><Link to="/karriere/fagomrader" className="text-muted-foreground hover:text-primary transition-colors">{dept}</Link></li>
                ))}
              </ul>
            </div>

            {/* Avargo */}
            <div className="col-span-1 md:col-span-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-semibold">Avargo</p>
              <ul className="space-y-2 text-[13px] font-light">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">avargo.no</Link></li>
                <li><Link to="/om-oss" className="text-muted-foreground hover:text-primary transition-colors">Om oss</Link></li>
                <li><Link to="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">Kontakt</Link></li>
                <li><Link to="/samarbeid" className="text-muted-foreground hover:text-primary transition-colors">Samarbeid</Link></li>
              </ul>
            </div>

            {/* Ressurser */}
            <div className="col-span-1 md:col-span-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-semibold">Ressurser</p>
              <ul className="space-y-2 text-[13px] font-light">
                <li><Link to="/kurs" className="text-muted-foreground hover:text-primary transition-colors">Avargo Kurs</Link></li>
                <li><Link to="/ressurser?tab=blogg" className="text-muted-foreground hover:text-primary transition-colors">Blogg</Link></li>
                <li><Link to="/ressurser?tab=guider" className="text-muted-foreground hover:text-primary transition-colors">Guider</Link></li>
                <li><Link to="/ressurser/skattekalender" className="text-muted-foreground hover:text-primary transition-colors">Skattekalender</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground/60">© {new Date().getFullYear()} Avargo AS</p>
            <div className="flex gap-6 text-[11px] text-muted-foreground/60">
              <Link to="/personvern" className="hover:text-foreground/70 transition-colors">Personvern</Link>
              <Link to="/vilkar" className="hover:text-foreground/70 transition-colors">Vilkår</Link>
            </div>
          </div>
        </motion.div>
        <div className="md:hidden h-20" />
      </div>
    </footer>
  );
};

const KarriereLayout = () => (
  <div className="min-h-screen flex flex-col">
    <KarriereHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <KarriereFooter />
    <MobileTabBar />
  </div>
);

export default KarriereLayout;
