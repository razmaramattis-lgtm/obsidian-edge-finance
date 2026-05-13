import { useEffect, useState } from "react";
import { Mail, MessageSquare, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";

const HIDDEN_ROUTES = ["/logg-inn", "/admin", "/kunde", "/workspace"];

const FloatingActionMenu = () => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isHidden = HIDDEN_ROUTES.some((p) => location.pathname.startsWith(p));
    setHidden(isHidden);
    setOpen(false);
  }, [location.pathname]);

  if (hidden) return null;

  const sectionContactPath = (() => {
    const p = location.pathname;
    const seg = p.split("/")[1];
    if (["regnskap", "hr", "markedsforing", "it"].includes(seg)) return `/${seg}/kontakt`;
    return "/kontakt";
  })();

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[60] pointer-events-none">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto mb-3 w-[280px] rounded-2xl glass border border-border/30 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border/15 bg-primary/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-medium">Snarvei</p>
              <p className="font-heading text-base mt-0.5">Hvordan vil du kontakte oss?</p>
            </div>
            <div className="p-2 space-y-1">
              <Link
                to={sectionContactPath}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/8 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <Sparkles size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/90">Be om uforpliktende tilbud</p>
                  <p className="text-[11px] text-foreground/50 font-light mt-0.5">Svar innen 24 timer</p>
                </div>
              </Link>
              <a
                href="mailto:kontakt@avargo.no"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/8 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <Mail size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/90">Send e-post</p>
                  <p className="text-[11px] text-foreground/50 font-light mt-0.5 truncate">kontakt@avargo.no</p>
                </div>
              </a>
              <Link
                to="/faq"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/8 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <MessageSquare size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/90">Få svar på vanlige spørsmål</p>
                  <p className="text-[11px] text-foreground/50 font-light mt-0.5">120+ svar i FAQ</p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Lukk meny" : "Kontakt oss"}
        className="pointer-events-auto w-14 h-14 rounded-full bg-primary text-primary-foreground glow-rose flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </div>
  );
};

export default FloatingActionMenu;
