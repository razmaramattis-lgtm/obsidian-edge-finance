import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "no" | "en";

type Dict = Record<string, { no: string; en: string }>;

// Landing-page only translations. Norwegian is the source; English is the
// translation shown when the user picks "EN" in the footer toggle on /.
export const translations: Dict = {
  // SEO
  "seo.title": {
    no: "Regnskapsfører for små og mellomstore bedrifter | Avargo",
    en: "Accountant for small and medium-sized businesses | Avargo",
  },
  "seo.description": {
    no: "Autorisert regnskapsbyrå med dedikert regnskapsfører, fast månedspris og rask respons på hverdager. Bytt regnskapsfører uten friksjon — vi tar hele overføringen.",
    en: "Authorised accounting firm with a dedicated accountant, fixed monthly price and fast responses on business days. Switch accountant without friction — we handle the whole transition.",
  },

  // Hero
  "hero.eyebrow": { no: "Autorisert regnskapsbyrå", en: "Authorised accounting firm" },
  "hero.title.a": { no: "Regnskap som", en: "Accounting that" },
  "hero.title.b": { no: "frigjør tid.", en: "frees up time." },
  "hero.body": {
    no: "Regnskapsbyrået for gründere og daglige ledere som vil vokse — ikke drukne i bilag. Fast månedspris, dedikert regnskapsfører og reell rådgivning. Vi tar hele byttet.",
    en: "The accounting firm for founders and managers who want to grow — not drown in paperwork. Fixed monthly price, a dedicated accountant and real advice. We handle the entire switch.",
  },
  "hero.cta.primary": { no: "Få et uforpliktende tilbud", en: "Get a no-obligation quote" },
  "hero.cta.secondary": { no: "Se våre tjenester", en: "See our services" },

  // Trust bar
  "trust.1.label": { no: "Godkjent regnskapsførerselskap", en: "Approved accounting firm" },
  "trust.1.sub": { no: "Finanstilsynet", en: "The Financial Supervisory Authority" },
  "trust.2.label": { no: "Rask respons", en: "Fast response" },
  "trust.2.sub": { no: "Vi vet tiden din er verdifull", en: "We know your time is valuable" },
  "trust.3.label": { no: "Fast pris — alt inkludert", en: "Fixed price — everything included" },
  "trust.3.sub": { no: "Ingen skjulte kostnader", en: "No hidden costs" },

  // Switch check
  "switch.eyebrow": { no: "Bytte regnskapsfører", en: "Switching accountant" },
  "switch.title.a": { no: "Er vi", en: "Are we" },
  "switch.title.b": { no: "riktig for deg?", en: "right for you?" },
  "switch.body": {
    no: "Riktig regnskapsfører er et viktig valg. Svar på fem korte spørsmål, så får du en personlig vurdering — og ærlig beskjed hvis vi ikke passer.",
    en: "Choosing the right accountant is an important decision. Answer five short questions and get a personal assessment — and an honest answer if we're not a fit.",
  },
  "switch.benefit.1": { no: "Få en tydelig plan for overtagelse og ansvar", en: "Get a clear plan for handover and responsibility" },
  "switch.benefit.2": { no: "Avklar behov for system, rapportering og rådgivning", en: "Clarify needs for systems, reporting and advisory" },
  "switch.benefit.3": { no: "Sikre god flyt uten stopp i drift og frister", en: "Ensure smooth flow without disruption to operations and deadlines" },
  "switch.cta.primary": { no: "Ta sjekken", en: "Take the check" },
  "switch.cta.secondary": { no: "Slik bytter du regnskapsfører", en: "How to switch accountant" },
  "switch.card.title": { no: "5 spørsmål", en: "5 questions" },
  "switch.card.sub": { no: "ca. 60 sekunder", en: "approx. 60 seconds" },

  // Value proposition
  "value.title.a": { no: "Hvorfor velge", en: "Why choose" },
  "value.title.b": { no: "?", en: "?" },
  "value.sub": { no: "Vi gjør det enkelt å drive bedrift i Norge.", en: "We make it easy to run a business in Norway." },
  "value.1.title": { no: "Én partner for regnskap og HR", en: "One partner for accounting and HR" },
  "value.1.desc": {
    no: "Slutt med å koordinere mellom regnskapsfører og HR-konsulent. Ett team, én kontaktperson, én faktura.",
    en: "Stop coordinating between accountant and HR consultant. One team, one contact person, one invoice.",
  },
  "value.2.title": { no: "Fast pris, ingen overraskelser", en: "Fixed price, no surprises" },
  "value.2.desc": {
    no: "Du vet nøyaktig hva du betaler hver måned. Rådgivning, rapportering og support er alltid inkludert.",
    en: "You know exactly what you pay each month. Advisory, reporting and support are always included.",
  },
  "value.3.title": { no: "Dedikert team som kjenner deg", en: "Dedicated team who knows you" },
  "value.3.desc": {
    no: "Du får faste kontaktpersoner som lærer bedriften din å kjenne — ikke en ny saksbehandler hver gang.",
    en: "You get permanent contact people who get to know your business — not a new case handler each time.",
  },

  // FAQ
  "faq.eyebrow": { no: "Vanlige spørsmål", en: "Frequently asked questions" },
  "faq.title.a": { no: "Det folk lurer på", en: "What people wonder about" },
  "faq.title.b": { no: "før de bytter", en: "before switching" },
  "faq.body": {
    no: "Får du ikke svar her? Ta en uforpliktende prat — vi svarer ærlig, også på det vanskelige.",
    en: "Not finding your answer? Have a no-obligation chat — we answer honestly, even the hard questions.",
  },
  "faq.link": { no: "Se alle 120+ spørsmål", en: "See all 120+ questions" },
  "faq.q1": { no: "Hva koster det å bruke Avargo?", en: "What does it cost to use Avargo?" },
  "faq.a1": {
    no: "Regnskap starter på 1 499 kr i måneden, og HR har egne fastprispakker. Alt er inkludert i prisen — ingen timefakturering, ingen skjulte tillegg. Kombinerer du regnskap og HR får du bedre totalpris og ett samlet team.",
    en: "Accounting starts at NOK 1,499 per month, and HR has its own fixed-price packages. Everything is included in the price — no hourly billing, no hidden add-ons. Combine accounting and HR for a better total price and one unified team.",
  },
  "faq.q2": { no: "Må jeg binde meg?", en: "Do I have to commit?" },
  "faq.a2": {
    no: "Nei. Vi jobber uten lange bindingstider. Du kan oppgradere, nedgradere eller avslutte med én måneds varsel. Vi tror vi må fortjene deg hver måned — ikke låse deg inne i en kontrakt.",
    en: "No. We work without long lock-in periods. You can upgrade, downgrade or cancel with one month's notice. We believe we should earn your trust every month — not lock you into a contract.",
  },
  "faq.q3": { no: "Hvor raskt svarer dere?", en: "How fast do you respond?" },
  "faq.a3": {
    no: "Vi prioriterer å svare deg raskt på alle henvendelser — i praksis er det som regel raskere. Du får en dedikert kontaktperson som kjenner bedriften din, ikke et generisk saksnummer.",
    en: "We prioritise responding quickly to every inquiry — in practice it's usually even faster. You get a dedicated contact who knows your business, not a generic case number.",
  },
  "faq.q4": { no: "Kan jeg bare bruke én avdeling?", en: "Can I use just one department?" },
  "faq.a4": {
    no: "Ja. Du velger fritt om du kun trenger regnskap, kun HR — eller begge deler. Mange starter med regnskap og legger til HR når bedriften vokser.",
    en: "Yes. You freely choose whether you need only accounting, only HR — or both. Many start with accounting and add HR as the business grows.",
  },
  "faq.q5": { no: "Hvordan bytter jeg fra dagens leverandør?", en: "How do I switch from my current provider?" },
  "faq.a5": {
    no: "Vi tar hele jobben. Vi henter ut data, koordinerer med din nåværende leverandør og setter opp alt sømløst — uten avbrudd i driften eller ekstra arbeid for deg.",
    en: "We do all the work. We retrieve the data, coordinate with your current provider and set everything up seamlessly — without disruption to your operations or extra work for you.",
  },
  "faq.q6": { no: "Hvilke selskaper passer for Avargo?", en: "Which companies fit Avargo?" },
  "faq.a6": {
    no: "Vi jobber primært med små og mellomstore bedrifter i Norge — fra nyetablerte AS til selskaper i sterk vekst. Vi tar ikke oppdrag innen sport og fritid.",
    en: "We mainly work with small and medium-sized businesses in Norway — from newly established limited companies to fast-growing companies. We don't take on assignments within sports and leisure.",
  },

  // CTA
  "cta.title": { no: "Klar for en enklere hverdag?", en: "Ready for an easier workday?" },
  "cta.sub": {
    no: "Ta en uforpliktende prat — vi hjelper deg å finne riktig løsning.",
    en: "Have a no-obligation chat — we'll help you find the right solution.",
  },
  "cta.button": { no: "Snakk med oss", en: "Talk to us" },

  // Hero contact form
  "form.eyebrow": { no: "Be oss ringe deg", en: "Ask us to call you" },
  "form.sub": { no: "Rask respons. Ingen binding.", en: "Fast response. No commitment." },
  "form.name": { no: "Navn *", en: "Name *" },
  "form.company": { no: "Firma", en: "Company" },
  "form.email": { no: "E-post *", en: "Email *" },
  "form.phone": { no: "Telefon", en: "Phone" },
  "form.message": { no: "Melding", en: "Message" },
  "form.submit": { no: "Send forespørsel", en: "Send request" },
  "form.sending": { no: "Sender...", en: "Sending..." },
  "form.footer": { no: "Tar 20 sekunder · Ingen binding · Rask respons", en: "Takes 20 seconds · No commitment · Fast response" },
  "form.done": {
    no: "Takk! Vi tar kontakt raskt — som regel samme arbeidsdag.",
    en: "Thank you! We'll be in touch quickly — usually the same business day.",
  },
  "form.done.sub.a": { no: "Bekreftelse er sendt til", en: "Confirmation sent to" },
  "form.done.sub.b": { no: "Vil du allerede nå dele mer?", en: "Want to share more already?" },
  "form.done.sub.link": { no: "Fyll ut detaljer", en: "Fill in details" },
  "form.error": {
    no: "Noe gikk galt. Prøv på nytt eller send e-post til kontakt@avargo.no",
    en: "Something went wrong. Please try again or email kontakt@avargo.no",
  },

  // Footer
  "footer.tagline.a": { no: "Regnskap for bedrifter som", en: "Accounting for businesses that" },
  "footer.tagline.b": { no: "vil konsentrere seg om driften", en: "want to focus on running the business" },
  "footer.desc": {
    no: "Autorisert regnskapsbyrå. Fast månedspris, dedikert regnskapsfører og rask respons på hverdager.",
    en: "Authorised accounting firm. Fixed monthly price, dedicated accountant and fast response on business days.",
  },
  "footer.orgline": { no: "Autorisert regnskapsbyrå · Org.nr 938 076 669", en: "Authorised accounting firm · Org.no 938 076 669" },
  "footer.cta": { no: "Få et uforpliktende tilbud", en: "Get a no-obligation quote" },
  "footer.col.services": { no: "Tjenester", en: "Services" },
  "footer.col.resources": { no: "Ressurser", en: "Resources" },
  "footer.col.company": { no: "Selskapet", en: "Company" },
  "footer.link.dedicated": { no: "Dedikert regnskapsfører", en: "Dedicated accountant" },
  "footer.link.arsregnskap": { no: "Årsregnskap", en: "Annual accounts" },
  "footer.link.lonn": { no: "Lønn & rapportering", en: "Payroll & reporting" },
  "footer.link.skatt": { no: "Skatterådgivning", en: "Tax advisory" },
  "footer.link.cfo": { no: "CFO-rådgivning", en: "CFO advisory" },
  "footer.link.all": { no: "Alle tjenester →", en: "All services →" },
  "footer.link.kontohjelp": { no: "Kontohjelp", en: "Account help" },
  "footer.link.skattekalender": { no: "Skattekalender", en: "Tax calendar" },
  "footer.link.prisguide": { no: "Prisguide", en: "Pricing guide" },
  "footer.link.byer": { no: "Regnskapsfører i din by", en: "Accountant in your city" },
  "footer.link.bransjer": { no: "Bransjer", en: "Industries" },
  "footer.link.faq": { no: "Vanlige spørsmål", en: "FAQ" },
  "footer.link.about": { no: "Om Avargo", en: "About Avargo" },
  "footer.link.contact": { no: "Kontakt oss", en: "Contact us" },
  "footer.link.book": { no: "Book møte", en: "Book meeting" },
  "footer.link.career": { no: "Karriere", en: "Careers" },
  "footer.link.login": { no: "Logg inn", en: "Sign in" },
  "footer.legal.privacy": { no: "Personvern", en: "Privacy" },
  "footer.legal.terms": { no: "Vilkår", en: "Terms" },
  "footer.legal.security": { no: "Sikkerhet", en: "Security" },
  "footer.copyright": { no: "Bygget med presisjon.", en: "Built with precision." },
  "footer.eyebrow.right": { no: "Regnskap · Rådgivning", en: "Accounting · Advisory" },

  // Scroll incentive
  "hero.scroll": { no: "Bla for å utforske", en: "Scroll to explore" },

  // Footer toggle label
  "lang.toggle": { no: "English", en: "Norsk" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof translations) => string };

const LanguageContext = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "no";
    const saved = window.localStorage.getItem("avargo-lang");
    return saved === "en" ? "en" : "no";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("avargo-lang", lang);
    } catch {}
  }, [lang]);

  const t = (key: keyof typeof translations) => translations[key]?.[lang] ?? String(key);
  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { lang: "no" as Lang, setLang: () => {}, t: (k: string) => translations[k]?.no ?? k };
  return ctx;
};
