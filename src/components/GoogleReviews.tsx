import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/contexts/LanguageContext";

type Review = { id: string; name: string; photo: string | null; rating: number; text: string; date: string };
type Payload = { averageRating: number; totalReviewCount: number; reviews: Review[] };

const INTERVAL = 6000;
const REVIEWS_URL = "https://www.google.com/search?q=Avargo+Regnskap+AS+anmeldelser";

function useVisibleCount() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const f = () => setN(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return n;
}

const GoogleReviews = () => {
  const { lang } = useLang();
  const [data, setData] = useState<Payload | null>(null);
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const visible = useVisibleCount();

  useEffect(() => {
    supabase.functions.invoke("google-reviews", { method: "GET" }).then(({ data, error }) => {
      if (!error && data?.reviews?.length) setData(data as Payload);
    });
  }, []);

  const reviews = data?.reviews ?? [];
  const canRotate = reviews.length > visible;

  useEffect(() => {
    if (!canRotate || paused) return;
    const t = setInterval(() => setStart((s) => (s + 1) % reviews.length), INTERVAL);
    return () => clearInterval(t);
  }, [canRotate, paused, reviews.length]);

  if (!reviews.length) return null;

  const shown = Array.from({ length: Math.min(visible, reviews.length) }, (_, i) => reviews[(start + i) % reviews.length]);
  const avg = data!.averageRating || reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const total = data!.totalReviewCount || reviews.length;

  return (
    <section className="py-16 md:py-24 bg-background" aria-label={lang === "en" ? "Google reviews" : "Google-anmeldelser"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-3">
            {lang === "en" ? "What our clients say" : "Hva kundene sier om oss"}
          </h2>
          <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="fill-primary text-primary" />
              ))}
            </span>
            <span className="font-semibold text-foreground">{avg.toFixed(1).replace(".", lang === "en" ? "." : ",")}</span>
            <span>· {total} {lang === "en" ? "reviews on Google" : "anmeldelser på Google"}</span>
          </a>
        </div>

        <div className="relative max-w-6xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }}>
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((r) => (
                <motion.article
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="rounded-xl bg-card border border-border/40 shadow-sm p-6 flex flex-col h-full"
                >
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6 flex-1 whitespace-pre-line">{r.text}</p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/40">
                    {r.photo ? (
                      <img src={r.photo} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{r.name[0]}</div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">Google</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {canRotate && (
            <div className="flex justify-center gap-3 mt-8">
              <button aria-label={lang === "en" ? "Previous" : "Forrige"} onClick={() => setStart((s) => (s - 1 + reviews.length) % reviews.length)} className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button aria-label={lang === "en" ? "Next" : "Neste"} onClick={() => setStart((s) => (s + 1) % reviews.length)} className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
