import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SectionProvider } from "@/contexts/SectionContext";
import Layout from "./components/Layout";
import SectionTheme from "./components/SectionTheme";
import ScrollToTop from "./components/ScrollToTop";
import { useSubdomainRedirect } from "./hooks/useSubdomainRedirect";

// Eagerly load Hub (new landing page)
import Hub from "./pages/Hub";

// Lazy-load everything else
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Metoden = lazy(() => import("./pages/Metoden"));
const Tjenester = lazy(() => import("./pages/Tjenester"));
const Bransjer = lazy(() => import("./pages/Bransjer"));
const Ressurser = lazy(() => import("./pages/Ressurser"));
const Skattekalender = lazy(() => import("./pages/Skattekalender"));
const Kontohjelp = lazy(() => import("./pages/Kontohjelp"));
const KontohjelpDetalj = lazy(() => import("./pages/KontohjelpDetalj"));
const Regnskapsord = lazy(() => import("./pages/Regnskapsord"));
const RegnskapsordDetalj = lazy(() => import("./pages/RegnskapsordDetalj"));
const BlogListing = lazy(() => import("./pages/BlogListing"));
const FAQ = lazy(() => import("./pages/FAQ"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Personvern = lazy(() => import("./pages/Personvern"));
const Vilkar = lazy(() => import("./pages/Vilkar"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const KundeLogin = lazy(() => import("./pages/kunde/KundeLogin"));
const KundeDashboard = lazy(() => import("./pages/kunde/KundeDashboard"));

// Section pages
const SectionHome = lazy(() => import("./pages/sections/SectionHome"));
const SectionTjenester = lazy(() => import("./pages/sections/SectionTjenester"));
const SectionBransjerGenerell = lazy(() => import("./pages/sections/SectionBransjerGenerell"));

// Tjeneste-undersider
const Regnskapsforer = lazy(() => import("./pages/tjenester/Regnskapsforer"));
const AiInnsikt = lazy(() => import("./pages/tjenester/AiInnsikt"));
const CFO = lazy(() => import("./pages/tjenester/CFO"));
const HR = lazy(() => import("./pages/tjenester/HR"));
const Nettsider = lazy(() => import("./pages/tjenester/Nettsider"));
const SEO = lazy(() => import("./pages/tjenester/SEO"));
const MetaAnnonser = lazy(() => import("./pages/tjenester/MetaAnnonser"));
const GoogleAds = lazy(() => import("./pages/tjenester/GoogleAds"));
const Nettbutikk = lazy(() => import("./pages/tjenester/Nettbutikk"));
const AiAutomatisering = lazy(() => import("./pages/tjenester/AiAutomatisering"));
const Kurs = lazy(() => import("./pages/tjenester/Kurs"));
const EnTilEnRegnskap = lazy(() => import("./pages/tjenester/EnTilEnRegnskap"));
const KursDetalj = lazy(() => import("./pages/tjenester/KursDetalj"));
const Lonn = lazy(() => import("./pages/tjenester/Lonn"));
const Arsregnskap = lazy(() => import("./pages/tjenester/Arsregnskap"));
const Fakturering = lazy(() => import("./pages/tjenester/Fakturering"));
const Skatteplanlegging = lazy(() => import("./pages/tjenester/Skatteplanlegging"));
const DashboardPage = lazy(() => import("./pages/tjenester/Dashboard"));
const Ansettelse = lazy(() => import("./pages/tjenester/Ansettelse"));
const Personalhandbok = lazy(() => import("./pages/tjenester/Personalhandbok"));
const Arbeidsrett = lazy(() => import("./pages/tjenester/Arbeidsrett"));
const Chatbot = lazy(() => import("./pages/tjenester/Chatbot"));
const Internsystemer = lazy(() => import("./pages/tjenester/Internsystemer"));
const HrKurs = lazy(() => import("./pages/tjenester/HrKurs"));
const Bedriftskurs = lazy(() => import("./pages/tjenester/Bedriftskurs"));

// Bransje-undersider
const TechSaas = lazy(() => import("./pages/bransjer/TechSaas"));
const Eiendom = lazy(() => import("./pages/bransjer/Eiendom"));
const Holding = lazy(() => import("./pages/bransjer/Holding"));
const Consulting = lazy(() => import("./pages/bransjer/Consulting"));
const Landbruk = lazy(() => import("./pages/bransjer/Landbruk"));
const Varehandel = lazy(() => import("./pages/bransjer/Varehandel"));
const ByggAnlegg = lazy(() => import("./pages/bransjer/ByggAnlegg"));
const NettbutikkBransje = lazy(() => import("./pages/bransjer/NettbutikkBransje"));
const Helse = lazy(() => import("./pages/bransjer/Helse"));
const Restaurant = lazy(() => import("./pages/bransjer/Restaurant"));
const Frisor = lazy(() => import("./pages/bransjer/Frisor"));
const Handverkere = lazy(() => import("./pages/bransjer/Handverkere"));
const TransportLogistikk = lazy(() => import("./pages/bransjer/TransportLogistikk"));
const IndustriProduksjon = lazy(() => import("./pages/bransjer/IndustriProduksjon"));
const RenholdFacility = lazy(() => import("./pages/bransjer/RenholdFacility"));
const KulturMedia = lazy(() => import("./pages/bransjer/KulturMedia"));
const SportFritid = lazy(() => import("./pages/bransjer/SportFritid"));
const UtdanningKurs = lazy(() => import("./pages/bransjer/UtdanningKurs"));
const JuridiskAdvokat = lazy(() => import("./pages/bransjer/JuridiskAdvokat"));
const ArkitekturDesign = lazy(() => import("./pages/bransjer/ArkitekturDesign"));
const MarkedsforingReklame = lazy(() => import("./pages/bransjer/MarkedsforingReklame"));
const BemanningRekruttering = lazy(() => import("./pages/bransjer/BemanningRekruttering"));
const ReiselivTurisme = lazy(() => import("./pages/bransjer/ReiselivTurisme"));
const BilVerksted = lazy(() => import("./pages/bransjer/BilVerksted"));
const EnergiMiljo = lazy(() => import("./pages/bransjer/EnergiMiljo"));

const queryClient = new QueryClient();

const prefetchRoutes = () => {
  const prefetch = (fn: () => Promise<unknown>) => fn().catch(() => {});
  prefetch(() => import("./pages/Pricing"));
  prefetch(() => import("./pages/Contact"));
  prefetch(() => import("./pages/Metoden"));
  prefetch(() => import("./pages/Tjenester"));
  prefetch(() => import("./pages/About"));
  prefetch(() => import("./pages/Bransjer"));
  prefetch(() => import("./pages/sections/SectionHome"));
  prefetch(() => import("./pages/sections/SectionTjenester"));

  setTimeout(() => {
    prefetch(() => import("./pages/tjenester/Regnskapsforer"));
    prefetch(() => import("./pages/tjenester/CFO"));
    prefetch(() => import("./pages/tjenester/Lonn"));
    prefetch(() => import("./pages/tjenester/Nettsider"));
    prefetch(() => import("./pages/tjenester/SEO"));
    prefetch(() => import("./pages/tjenester/HR"));
    prefetch(() => import("./pages/Ressurser"));
    prefetch(() => import("./pages/FAQ"));
    prefetch(() => import("./pages/admin/AdminLogin"));
    prefetch(() => import("./pages/kunde/KundeLogin"));
  }, 500);
};

const PageFallback = () => (
  <div className="min-h-screen bg-background" />
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageFallback />;
  if (!user) return <Navigate to="/admin/logg-inn" replace />;
  return <>{children}</>;
};

const CustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageFallback />;
  if (!user) return <Navigate to="/kunde/logg-inn" replace />;
  return <>{children}</>;
};

const PrefetchTrigger = () => {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchRoutes, { timeout: 1000 });
    } else {
      setTimeout(prefetchRoutes, 500);
    }
  }, []);
  return null;
};

const SubdomainRedirect = () => {
  useSubdomainRedirect();
  return null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SectionProvider>
              <ScrollToTop />
              <PrefetchTrigger />
              <SubdomainRedirect />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* Admin routes (no Layout wrapper) */}
                  <Route path="/admin/logg-inn" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><Navigate to="/admin/dashboard" replace /></ProtectedRoute>} />

                  {/* Customer routes */}
                  <Route path="/kunde/logg-inn" element={<KundeLogin />} />
                  <Route path="/kunde/dashboard" element={<CustomerRoute><KundeDashboard /></CustomerRoute>} />
                  <Route path="/kunde" element={<Navigate to="/kunde/logg-inn" replace />} />

                  {/* Public routes */}
                  <Route path="/*" element={
                    <SectionTheme>
                      <Layout>
                        <Suspense fallback={<PageFallback />}>
                          <Routes>
                            {/* Hub / landing */}
                            <Route path="/" element={<Hub />} />

                            {/* Section routes */}
                            <Route path="/:sectionId" element={<SectionHome />} />
                            <Route path="/:sectionId/tjenester" element={<SectionTjenester />} />
                            <Route path="/:sectionId/bransjer" element={<Bransjer />} />
                            <Route path="/:sectionId/bransjer/alle" element={<SectionBransjerGenerell />} />
                            <Route path="/:sectionId/priser" element={<Pricing />} />
                            <Route path="/:sectionId/kontakt" element={<Contact />} />
                            <Route path="/:sectionId/om-oss" element={<About />} />
                            <Route path="/:sectionId/metoden" element={<Metoden />} />

                            {/* Section tjeneste sub-pages */}
                            <Route path="/:sectionId/tjenester/regnskapsforer" element={<Regnskapsforer />} />
                            <Route path="/:sectionId/tjenester/ai-innsikt" element={<AiInnsikt />} />
                            <Route path="/:sectionId/tjenester/cfo" element={<CFO />} />
                            <Route path="/:sectionId/tjenester/hr-og-lonn" element={<HR />} />
                            <Route path="/:sectionId/tjenester/nettsider" element={<Nettsider />} />
                            <Route path="/:sectionId/tjenester/seo" element={<SEO />} />
                            <Route path="/:sectionId/tjenester/meta-annonser" element={<MetaAnnonser />} />
                            <Route path="/:sectionId/tjenester/google-ads" element={<GoogleAds />} />
                            <Route path="/:sectionId/tjenester/nettbutikk" element={<Nettbutikk />} />
                            <Route path="/:sectionId/tjenester/ai-automatisering" element={<AiAutomatisering />} />
                            <Route path="/:sectionId/tjenester/kurs" element={<Kurs />} />
                            <Route path="/:sectionId/tjenester/kurs/:slug" element={<KursDetalj />} />
                            <Route path="/:sectionId/tjenester/1-1-regnskap" element={<EnTilEnRegnskap />} />
                            <Route path="/:sectionId/tjenester/lonn" element={<Lonn />} />
                            <Route path="/:sectionId/tjenester/arsregnskap" element={<Arsregnskap />} />
                            <Route path="/:sectionId/tjenester/fakturering" element={<Fakturering />} />
                            <Route path="/:sectionId/tjenester/skatteplanlegging" element={<Skatteplanlegging />} />
                            <Route path="/:sectionId/tjenester/dashboard" element={<DashboardPage />} />
                            <Route path="/:sectionId/tjenester/ansettelse" element={<Ansettelse />} />
                            <Route path="/:sectionId/tjenester/personalhandbok" element={<Personalhandbok />} />
                            <Route path="/:sectionId/tjenester/arbeidsrett" element={<Arbeidsrett />} />
                            <Route path="/:sectionId/tjenester/chatbot" element={<Chatbot />} />
                            <Route path="/:sectionId/tjenester/internsystemer" element={<Internsystemer />} />
                            <Route path="/:sectionId/tjenester/hr-kurs" element={<HrKurs />} />
                            <Route path="/:sectionId/tjenester/bedriftskurs" element={<Bedriftskurs />} />

                            {/* Section bransje sub-pages */}
                            <Route path="/:sectionId/bransjer/tech-saas" element={<TechSaas />} />
                            <Route path="/:sectionId/bransjer/eiendom" element={<Eiendom />} />
                            <Route path="/:sectionId/bransjer/holding" element={<Holding />} />
                            <Route path="/:sectionId/bransjer/consulting" element={<Consulting />} />
                            <Route path="/:sectionId/bransjer/landbruk" element={<Landbruk />} />
                            <Route path="/:sectionId/bransjer/varehandel" element={<Varehandel />} />
                            <Route path="/:sectionId/bransjer/bygg-anlegg" element={<ByggAnlegg />} />
                            <Route path="/:sectionId/bransjer/nettbutikk" element={<NettbutikkBransje />} />
                            <Route path="/:sectionId/bransjer/helse" element={<Helse />} />
                            <Route path="/:sectionId/bransjer/restaurant" element={<Restaurant />} />
                            <Route path="/:sectionId/bransjer/frisor" element={<Frisor />} />
                            <Route path="/:sectionId/bransjer/handverkere" element={<Handverkere />} />
                            <Route path="/:sectionId/bransjer/transport" element={<TransportLogistikk />} />
                            <Route path="/:sectionId/bransjer/industri" element={<IndustriProduksjon />} />
                            <Route path="/:sectionId/bransjer/renhold" element={<RenholdFacility />} />
                            <Route path="/:sectionId/bransjer/kultur" element={<KulturMedia />} />
                            <Route path="/:sectionId/bransjer/sport" element={<SportFritid />} />
                            <Route path="/:sectionId/bransjer/utdanning" element={<UtdanningKurs />} />
                            <Route path="/:sectionId/bransjer/juridisk" element={<JuridiskAdvokat />} />
                            <Route path="/:sectionId/bransjer/arkitektur" element={<ArkitekturDesign />} />
                            <Route path="/:sectionId/bransjer/markedsforing" element={<MarkedsforingReklame />} />
                            <Route path="/:sectionId/bransjer/bemanning" element={<BemanningRekruttering />} />
                            <Route path="/:sectionId/bransjer/reiseliv" element={<ReiselivTurisme />} />
                            <Route path="/:sectionId/bransjer/bil" element={<BilVerksted />} />
                            <Route path="/:sectionId/bransjer/energi" element={<EnergiMiljo />} />

                            {/* Section ressurser sub-pages */}
                            <Route path="/:sectionId/ressurser" element={<Ressurser />} />
                            <Route path="/:sectionId/ressurser/skattekalender" element={<Skattekalender />} />
                            <Route path="/:sectionId/ressurser/kontohjelp" element={<Kontohjelp />} />
                            <Route path="/:sectionId/ressurser/kontohjelp/:slug" element={<KontohjelpDetalj />} />
                            <Route path="/:sectionId/nyheter" element={<BlogListing />} />
                            <Route path="/:sectionId/nyhet/:slug" element={<BlogPost />} />
                            <Route path="/:sectionId/faq" element={<FAQ />} />
                            <Route path="/:sectionId/regnskapsord" element={<Regnskapsord />} />
                            <Route path="/:sectionId/regnskapsord/:slug" element={<RegnskapsordDetalj />} />

                            {/* Legacy / shared routes */}
                            <Route path="/tjenester" element={<Tjenester />} />
                            <Route path="/tjenester/regnskapsforer" element={<Regnskapsforer />} />
                            <Route path="/tjenester/ai-innsikt" element={<AiInnsikt />} />
                            <Route path="/tjenester/cfo" element={<CFO />} />
                            <Route path="/tjenester/hr-og-lonn" element={<HR />} />
                            <Route path="/tjenester/nettsider" element={<Nettsider />} />
                            <Route path="/tjenester/seo" element={<SEO />} />
                            <Route path="/tjenester/meta-annonser" element={<MetaAnnonser />} />
                            <Route path="/tjenester/google-ads" element={<GoogleAds />} />
                            <Route path="/tjenester/nettbutikk" element={<Nettbutikk />} />
                            <Route path="/tjenester/ai-automatisering" element={<AiAutomatisering />} />
                            <Route path="/tjenester/kurs" element={<Kurs />} />
                            <Route path="/tjenester/kurs/:slug" element={<KursDetalj />} />
                            <Route path="/tjenester/1-1-regnskap" element={<EnTilEnRegnskap />} />
                            <Route path="/tjenester/lonn" element={<Lonn />} />
                            <Route path="/tjenester/arsregnskap" element={<Arsregnskap />} />
                            <Route path="/tjenester/fakturering" element={<Fakturering />} />
                            <Route path="/tjenester/skatteplanlegging" element={<Skatteplanlegging />} />
                            <Route path="/tjenester/dashboard" element={<DashboardPage />} />
                            <Route path="/tjenester/ansettelse" element={<Ansettelse />} />
                            <Route path="/tjenester/personalhandbok" element={<Personalhandbok />} />
                            <Route path="/tjenester/arbeidsrett" element={<Arbeidsrett />} />
                            <Route path="/tjenester/chatbot" element={<Chatbot />} />
                            <Route path="/tjenester/internsystemer" element={<Internsystemer />} />
                            <Route path="/tjenester/hr-kurs" element={<HrKurs />} />
                            <Route path="/tjenester/bedriftskurs" element={<Bedriftskurs />} />
                            <Route path="/bransjer" element={<Bransjer />} />
                            <Route path="/bransjer/tech-saas" element={<TechSaas />} />
                            <Route path="/bransjer/eiendom" element={<Eiendom />} />
                            <Route path="/bransjer/holding" element={<Holding />} />
                            <Route path="/bransjer/consulting" element={<Consulting />} />
                            <Route path="/bransjer/landbruk" element={<Landbruk />} />
                            <Route path="/bransjer/varehandel" element={<Varehandel />} />
                            <Route path="/bransjer/bygg-anlegg" element={<ByggAnlegg />} />
                            <Route path="/bransjer/nettbutikk" element={<NettbutikkBransje />} />
                            <Route path="/bransjer/helse" element={<Helse />} />
                            <Route path="/bransjer/restaurant" element={<Restaurant />} />
                            <Route path="/bransjer/frisor" element={<Frisor />} />
                            <Route path="/bransjer/handverkere" element={<Handverkere />} />
                            <Route path="/bransjer/transport" element={<TransportLogistikk />} />
                            <Route path="/bransjer/industri" element={<IndustriProduksjon />} />
                            <Route path="/bransjer/renhold" element={<RenholdFacility />} />
                            <Route path="/bransjer/kultur" element={<KulturMedia />} />
                            <Route path="/bransjer/sport" element={<SportFritid />} />
                            <Route path="/bransjer/utdanning" element={<UtdanningKurs />} />
                            <Route path="/bransjer/juridisk" element={<JuridiskAdvokat />} />
                            <Route path="/bransjer/arkitektur" element={<ArkitekturDesign />} />
                            <Route path="/bransjer/markedsforing" element={<MarkedsforingReklame />} />
                            <Route path="/bransjer/bemanning" element={<BemanningRekruttering />} />
                            <Route path="/bransjer/reiseliv" element={<ReiselivTurisme />} />
                            <Route path="/bransjer/bil" element={<BilVerksted />} />
                            <Route path="/bransjer/energi" element={<EnergiMiljo />} />
                            <Route path="/metoden" element={<Metoden />} />
                            <Route path="/priser" element={<Pricing />} />
                            <Route path="/ressurser" element={<Ressurser />} />
                            <Route path="/ressurser/skattekalender" element={<Skattekalender />} />
                            <Route path="/ressurser/kontohjelp" element={<Kontohjelp />} />
                            <Route path="/ressurser/kontohjelp/:slug" element={<KontohjelpDetalj />} />
                            <Route path="/nyheter" element={<BlogListing />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/nyhet/:slug" element={<BlogPost />} />
                            <Route path="/om-oss" element={<About />} />
                            <Route path="/kontakt" element={<Contact />} />
                            <Route path="/personvern" element={<Personvern />} />
                            <Route path="/vilkar" element={<Vilkar />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Suspense>
                      </Layout>
                    </SectionTheme>
                  } />
                </Routes>
              </Suspense>
            </SectionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
