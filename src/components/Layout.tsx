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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/15 backdrop-blur-2xl bg-background/60">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="font-heading text-xl font-semibold tracking-tight text-primary">
            Avargo
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-500"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/kontakt"
              className="px-6 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-500"
            >
              Kom i gang
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-foreground"
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
              className="md:hidden border-t border-border/15 bg-background/95 backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-1 p-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-3 text-[13px] text-muted-foreground hover:text-foreground transition-colors border-b border-border/10"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/kontakt"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 px-5 py-3 text-[13px] font-medium bg-primary text-primary-foreground rounded-full text-center"
                >
                  Kom i gang
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/15 py-20 relative">
        <div className="absolute inset-0 dreamy-bg opacity-30" />
        <div className="container mx-auto px-6 relative">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <span className="font-heading text-xl font-semibold text-primary">Avargo</span>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Din finansielle arkitekt.<br />Sanntid. Prediksjon. Kontroll.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-5">Løsninger</h4>
              <div className="flex flex-col gap-2.5 text-sm text-foreground/50">
                <span>AI-drevet regnskap</span>
                <span>Skatteoptimalisering</span>
                <span>Likviditetsprediksjon</span>
                <span>CFO-as-a-Service</span>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-5">Bransjer</h4>
              <div className="flex flex-col gap-2.5 text-sm text-foreground/50">
                <span>Tech & SaaS</span>
                <span>Eiendom</span>
                <span>Holding</span>
                <span>Consulting</span>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-5">Kontakt</h4>
              <div className="flex flex-col gap-2.5 text-sm text-foreground/50">
                <span>post@avargo.no</span>
                <span>+47 22 00 00 00</span>
                <span>Oslo, Norge</span>
              </div>
            </div>
          </div>
          <div className="line-accent mt-14 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/40">
            <span>© 2026 Avargo. Alle rettigheter reservert.</span>
            <div className="flex gap-6">
              <span className="hover:text-foreground transition-colors cursor-pointer">Personvern</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Vilkår</span>
            </div>
          </div>
        </div>
      </footer>

      <AvailabilityWidget />
    </div>
  );
};

export default Layout;
