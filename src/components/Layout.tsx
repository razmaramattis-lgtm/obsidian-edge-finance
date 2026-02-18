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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 backdrop-blur-2xl bg-background/50">
        <div className="container mx-auto flex items-center justify-between h-[72px] px-6">
          <Link to="/" className="font-heading text-2xl text-primary tracking-wide">
            Avargo
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-500 tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/kontakt"
              className="px-7 py-2.5 text-[13px] font-medium bg-primary text-primary-foreground rounded-full hover:scale-[1.02] transition-all duration-500 tracking-wide"
            >
              Kom i gang
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/10 bg-background/95 backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-1 p-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-4 text-[13px] text-muted-foreground hover:text-foreground transition-colors border-b border-border/10 tracking-wide"
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

      <main className="pt-[72px]">{children}</main>

      <footer className="border-t border-border/10 py-24 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-6 relative">
          <div className="grid md:grid-cols-4 gap-14">
            <div>
              <span className="font-heading text-2xl text-primary">Avargo</span>
              <p className="mt-5 text-sm text-muted-foreground leading-relaxed font-light">
                Din finansielle arkitekt.<br />Presisjon. Innsikt. Vekst.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6">Løsninger</h4>
              <div className="flex flex-col gap-3 text-sm text-foreground/40 font-light">
                <span>AI-drevet regnskap</span>
                <span>Skatteoptimalisering</span>
                <span>Likviditetsprediksjon</span>
                <span>CFO-as-a-Service</span>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6">Bransjer</h4>
              <div className="flex flex-col gap-3 text-sm text-foreground/40 font-light">
                <span>Tech & SaaS</span>
                <span>Eiendom</span>
                <span>Holding</span>
                <span>Consulting</span>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6">Kontakt</h4>
              <div className="flex flex-col gap-3 text-sm text-foreground/40 font-light">
                <span>post@avargo.no</span>
                <span>+47 22 00 00 00</span>
                <span>Oslo, Norge</span>
              </div>
            </div>
          </div>
          <div className="line-accent mt-16 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/30">
            <span>© 2026 Avargo</span>
            <div className="flex gap-8">
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
