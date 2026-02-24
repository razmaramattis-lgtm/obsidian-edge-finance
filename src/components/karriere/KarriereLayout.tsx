import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Hjem", path: "/karriere" },
  { label: "Fagområder", path: "/karriere/fagomrader" },
  { label: "Stillinger", path: "/karriere/stillinger" },
  { label: "Avargo Fri", path: "/karriere/avargo-fri" },
];

const KarriereHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === "/karriere" ? pathname === "/karriere" : pathname.startsWith(path);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/karriere" className="flex items-center gap-2">
              <img src="/logo.png" alt="Avargo" className="h-7" />
              <span className="text-xs tracking-[0.15em] uppercase font-semibold text-primary">Karriere</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop back link */}
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={13} /> avargo.no
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-foreground hover:bg-muted/30 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/10 md:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:bg-muted/30"
                  }`}
                >
                  {item.label}
                  <ChevronRight size={14} className="text-muted-foreground" />
                </Link>
              ))}
              <div className="pt-3 border-t border-border/10">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={14} /> Tilbake til avargo.no
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const KarriereFooter = () => (
  <footer className="border-t border-border/10 bg-muted/5">
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/karriere" className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Avargo" className="h-6" />
            <span className="text-xs tracking-[0.15em] uppercase font-semibold text-primary">Karriere</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bli en del av teamet som bygger fremtidens rådgivning. Vi søker alltid etter flinke folk.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-4">Karriere</h4>
          <ul className="space-y-2.5">
            {NAV_ITEMS.map(item => (
              <li key={item.path}>
                <Link to={item.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Avdelinger */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-4">Fagområder</h4>
          <ul className="space-y-2.5">
            {["Regnskap", "Personal", "Marked", "IT"].map(dept => (
              <li key={dept}>
                <Link to="/karriere/fagomrader" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {dept}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Selskapet */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-foreground font-semibold mb-4">Avargo</h4>
          <ul className="space-y-2.5">
            <li><Link to="/om-oss" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Om oss</Link></li>
            <li><Link to="/kontakt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kontakt</Link></li>
            <li><Link to="/personvern" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Personvern</Link></li>
            <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">avargo.no</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Avargo AS. Alle rettigheter reservert.</p>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <ArrowLeft size={11} /> Gå til avargo.no
        </Link>
      </div>
    </div>
  </footer>
);

const KarriereLayout = () => (
  <div className="min-h-screen flex flex-col">
    <KarriereHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <KarriereFooter />
  </div>
);

export default KarriereLayout;
