import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Sparkles, RefreshCw, Send } from "lucide-react";
import heroImg from "@/assets/karriere-hero-futuristic.jpg";

const KarriereTilbakemelding = () => {
  return (
    <>
      <Helmet>
        <title>Tilbakemelding på søknad | Avargo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/85 to-background" />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? "hsl(var(--primary) / 0.4)" : "hsl(var(--secondary) / 0.3)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-24 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/15 border border-secondary/20 backdrop-blur-md mb-8"
          >
            <Heart size={14} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">Takk for din søknad</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Takk for at du{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              søkte hos oss
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-muted-foreground leading-relaxed mb-6"
          >
            Dessverre gikk vi videre med andre kandidater denne gangen. Men dette betyr ikke at 
            veien til Avargo er lukket – vi vil gjerne se deg søke igjen ved en senere anledning.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-muted-foreground leading-relaxed"
          >
            Konkurransen var sterk, og vi setter enorm pris på at du tok deg tid til å søke hos oss. 
            Din kompetanse er verdifull, og vi håper virkelig at du tar med deg motivasjonen videre.
          </motion.p>
        </div>
      </section>

      {/* Encouragement cards */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
        <div className="relative z-10 container mx-auto px-4 max-w-3xl">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 rounded-2xl border border-border/10 bg-card/30 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <RefreshCw size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-2">Søk igjen</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Vi utlyser jevnlig nye stillinger. Hold et øye med karrieresiden vår, 
                    eller send en åpen søknad – vi leser hver eneste en.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 md:p-8 rounded-2xl border border-border/10 bg-card/30 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Send size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-2">Ta kontakt</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Har du spørsmål om prosessen eller ønsker ytterligere tilbakemelding? 
                    Vi svarer gjerne på{" "}
                    <a href="mailto:kontakt@avargo.no" className="text-primary hover:underline font-medium">
                      kontakt@avargo.no
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 md:p-8 rounded-2xl border border-border/10 bg-card/30 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-2">Bli kjent med oss</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Selv om det ikke ble denne gangen, oppfordrer vi deg til å utforske hva Avargo tilbyr. 
                    Kanskje finner du noe som passer enda bedre neste gang.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto"
          >
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              Vi ønsker deg alt godt videre, og håper veiene våre krysses igjen. 💛
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
              >
                Utforsk avargo.no <ArrowRight size={18} />
              </Link>
              <Link
                to="/karriere"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-border/20 text-foreground font-semibold text-base hover:bg-muted/20 transition-all"
              >
                Se ledige stillinger
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default KarriereTilbakemelding;
