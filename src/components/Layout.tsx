import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import AvailabilityWidget from "./AvailabilityWidget";

const navItems = [
  { label: "Metoden", href: "/#metoden" },
  { label: "Bransjer", href: "/#bransjer" },
  { label: "Priser", href: "/priser" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kontakt", href: "/kontakt" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="font-heading text-xl font-bold tracking-tight text-primary">
            AVARGO
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/kontakt"
              className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              Søk om medlemskap
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-1 p-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-border/30"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/kontakt"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded text-center"
                >
                  Søk om medlemskap
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <span className="font-heading text-lg font-bold text-primary">AVARGO</span>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Din finansielle arkitekt.<br />Sanntid. Prediksjon. Kontroll.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Tjenester</h4>
              <div className="flex flex-col gap-2 text-sm text-foreground/70">
                <span>AI-drevet regnskap</span>
                <span>Skatteoptimalisering</span>
                <span>Likviditetsprediksjon</span>
                <span>CFO-as-a-Service</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Bransjer</h4>
              <div className="flex flex-col gap-2 text-sm text-foreground/70">
                <span>Tech & SaaS</span>
                <span>Eiendom</span>
                <span>Holding</span>
                <span>High-End Consulting</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Kontakt</h4>
              <div className="flex flex-col gap-2 text-sm text-foreground/70">
                <span>post@avargo.no</span>
                <span>+47 22 00 00 00</span>
                <span>Oslo, Norge</span>
              </div>
            </div>
          </div>
          <div className="line-accent mt-12 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <span>© 2026 Avargo. Alle rettigheter reservert.</span>
            <div className="flex gap-6">
              <span>Personvern</span>
              <span>Vilkår</span>
            </div>
          </div>
        </div>
      </footer>

      <AvailabilityWidget />
    </div>
  );
};

export default Layout;
