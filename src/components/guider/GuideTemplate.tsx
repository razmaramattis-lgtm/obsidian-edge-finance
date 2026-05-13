import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ReactNode } from "react";
import { ArrowRight, BookOpen } from "lucide-react";

export type GuidePageProps = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: ReactNode }[];
  faq: { q: string; a: string }[];
  cta?: { heading: string; body: string };
};

const GuideTemplate = ({ slug, title, metaTitle, metaDescription, intro, sections, faq, cta }: GuidePageProps) => {
  const url = `https://avargo.no/guider/${slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: metaDescription,
    author: { "@type": "Organization", name: "Avargo" },
    publisher: { "@type": "Organization", name: "Avargo", logo: { "@type": "ImageObject", url: "https://avargo.no/logo.png" } },
    mainEntityOfPage: url,
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden border-b border-border/10 pt-12 md:pt-20 pb-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="container mx-auto px-5 md:px-6 max-w-3xl relative">
            <nav className="flex items-center gap-2 text-[12px] text-foreground/40 mb-6">
              <Link to="/" className="hover:text-foreground/70">Hjem</Link>
              <span>/</span>
              <Link to="/ressurser" className="hover:text-foreground/70">Ressurser</Link>
              <span>/</span>
              <span className="text-foreground/60">Guide</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] tracking-wider uppercase mb-6">
              <BookOpen className="w-3 h-3" />
              Guide
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] text-foreground mb-6">
              {title}
            </h1>
            <p className="text-lg text-foreground/70 font-light leading-relaxed">{intro}</p>
          </div>
        </section>

        <article className="py-12 md:py-16">
          <div className="container mx-auto px-5 md:px-6 max-w-3xl">
            {sections.map((s) => (
              <section key={s.heading} className="mb-12">
                <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-5">{s.heading}</h2>
                <div className="prose prose-invert max-w-none text-foreground/75 font-light leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground [&_strong]:font-medium">
                  {s.body}
                </div>
              </section>
            ))}

            {/* FAQ */}
            <section className="mt-16 pt-12 border-t border-border/15">
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-8">Vanlige spørsmål</h2>
              <div className="space-y-3">
                {faq.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-border/15 bg-card/30 p-5">
                    <summary className="cursor-pointer flex items-center justify-between gap-4 font-serif text-lg text-foreground">
                      {f.q}
                      <ArrowRight className="w-4 h-4 text-primary group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="mt-3 text-foreground/65 font-light leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="mt-16 p-8 md:p-10 rounded-3xl border border-primary/20 bg-primary/5 text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-3">
                {cta?.heading || "Klar for et regnskapsbyrå som faktisk svarer?"}
              </h2>
              <p className="text-foreground/70 font-light mb-6">
                {cta?.body || "Send en uforpliktende henvendelse — vi gir tilbud innen 24 timer."}
              </p>
              <Link to="/kontakt" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-[14px] font-medium hover:scale-[1.02] transition-transform">
                Få tilbud nå
                <ArrowRight className="w-4 h-4" />
              </Link>
            </section>
          </div>
        </article>
      </div>
    </>
  );
};

export default GuideTemplate;
