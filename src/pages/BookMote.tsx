import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calculator, Users, ArrowRight, Clock, ShieldCheck, Video, ExternalLink } from "lucide-react";

type ServiceId = "regnskap" | "hr";

const services = [
  {
    id: "regnskap" as const,
    label: "Regnskap & økonomi",
    desc: "Bokføring, årsregnskap, MVA og økonomisk rådgivning.",
    icon: Calculator,
    url: "https://outlook.office.com/book/AvargoRegnskap@avargo.no/?ismsaljsauthenabled",
  },
  {
    id: "hr" as const,
    label: "HR & personal",
    desc: "Ansettelse, lønn, personalhåndbok og lederstøtte.",
    icon: Users,
    url: "https://outlook.office.com/book/AvargoHR@avargo.no/?ismsaljsauthenabled",
  },
];

const BookMote = () => {
  const isMobile = useIsMobile();
  const [service, setService] = useState<ServiceId | null>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const active = services.find(s => s.id === service);

  useEffect(() => {
    if (service && !isMobile && bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [service, isMobile]);

  return (
    <>
      <Helmet>
        <title>Book møte – uforpliktende rådgivning | Avargo</title>
        <meta name="description" content="Book et 30-minutters uforpliktende møte med en rådgiver hos Avargo. Velg regnskap eller HR og finn en ledig tid direkte i kalenderen." />
        <link rel="canonical" href="https://avargo.no/book-mote" />
        <meta property="og:title" content="Book møte – Avargo" />
        <meta property="og:description" content="Uforpliktende 30-min rådgivning. Velg område og book direkte i kalenderen." />
        <meta property="og:url" content="https://avargo.no/book-mote" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Uforpliktende rådgivningsmøte",
          "serviceType": "Rådgivningsmøte",
          "description": "30 minutters uforpliktende møte med en rådgiver om regnskap, lønn eller HR. Digitalt via Teams.",
          "url": "https://avargo.no/book-mote",
          "provider": { "@type": "AccountingService", "name": "Avargo Regnskap AS", "url": "https://avargo.no/", "telephone": "+4798642391", "email": "kontakt@avargo.no" },
          "areaServed": { "@type": "Country", "name": "Norge" },
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "NOK", "availability": "https://schema.org/InStock", "url": "https://avargo.no/book-mote" },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Hjem", "item": "https://avargo.no/" },
            { "@type": "ListItem", "position": 2, "name": "Book møte", "item": "https://avargo.no/book-mote" },
          ],
        })}</script>
      </Helmet>

      <section className="pt-28 pb-20 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center space-y-3 mb-8">
            <p className="text-xs uppercase tracking-widest text-primary">Book møte</p>
            <h1 className="text-3xl md:text-4xl font-semibold">Velg område og finn en tid</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Ingen skjema og ingen spørsmålsrunde — velg hva du trenger hjelp med, så går du rett til kalenderen.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-primary" /> 30 minutter</span>
              <span className="inline-flex items-center gap-1.5"><Video size={13} className="text-primary" /> Digitalt via Teams</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-primary" /> Helt uforpliktende</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {services.map(s => {
              const Icon = s.icon;
              const isActive = service === s.id;
              const cardClass = `text-left p-5 rounded-2xl border transition-all block ${isActive && !isMobile ? "border-primary bg-primary/5" : "border-border/20 hover:border-primary/40 hover:bg-muted/20"}`;
              const inner = (
                <>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-border/20 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary mt-3">
                    Book tid {isMobile ? <ExternalLink size={13} /> : <ArrowRight size={13} />}
                  </span>
                </>
              );

              return isMobile ? (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  {inner}
                </a>
              ) : (
                <button key={s.id} onClick={() => setService(s.id)} className={cardClass}>
                  {inner}
                </button>
              );
            })}
          </div>

          <div ref={bookingRef} className="scroll-mt-28">
            <AnimatePresence mode="wait">
              {active && !isMobile && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 rounded-3xl border border-border/20 overflow-hidden bg-card"
                >
                  <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border/20">
                    <p className="text-sm font-medium">{active.label}</p>
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
                    >
                      Åpne i nytt vindu <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="h-[1000px] bg-white">
                    <iframe
                      key={active.url}
                      src={active.url}
                      title={`Book møte – ${active.label}`}
                      width="100%"
                      height="100%"
                      scrolling="yes"
                      style={{ border: 0 }}
                    />
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {!active && (
            <p className="text-center text-xs text-muted-foreground mt-8">
              Foretrekker du å snakke med oss først? Ring <a href="tel:+4798642391" className="text-foreground hover:text-primary transition">98 64 23 91</a> eller send en melding via <Link to="/kontakt" className="text-foreground hover:text-primary transition">kontaktskjemaet</Link>.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default BookMote;
