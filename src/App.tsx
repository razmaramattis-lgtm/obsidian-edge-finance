import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Eagerly load Index (landing page) for fastest FCP/LCP
import Index from "./pages/Index";

// Lazy-load everything else
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Metoden = lazy(() => import("./pages/Metoden"));
const Tjenester = lazy(() => import("./pages/Tjenester"));
const Bransjer = lazy(() => import("./pages/Bransjer"));
const Ressurser = lazy(() => import("./pages/Ressurser"));
const Skattekalender = lazy(() => import("./pages/Skattekalender"));
const BlogListing = lazy(() => import("./pages/BlogListing"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const KundeLogin = lazy(() => import("./pages/kunde/KundeLogin"));
const KundeDashboard = lazy(() => import("./pages/kunde/KundeDashboard"));

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

const PageFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-muted-foreground text-sm">Laster…</div>
  </div>
);

// Protected route for admin dashboard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageFallback />;
  if (!user) return <Navigate to="/admin/logg-inn" replace />;
  return <>{children}</>;
};

// Protected route for customer dashboard
const CustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageFallback />;
  if (!user) return <Navigate to="/kunde/logg-inn" replace />;
  return <>{children}</>;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Admin routes (no Layout wrapper) */}
                <Route path="/admin/logg-inn" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<Navigate to="/admin/logg-inn" replace />} />

                {/* Customer routes */}
                <Route path="/kunde/logg-inn" element={<KundeLogin />} />
                <Route path="/kunde/dashboard" element={<CustomerRoute><KundeDashboard /></CustomerRoute>} />
                <Route path="/kunde" element={<Navigate to="/kunde/logg-inn" replace />} />

                {/* Public routes */}
                <Route path="/*" element={
                  <Layout>
                    <Suspense fallback={<PageFallback />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
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
                        <Route path="/nyheter" element={<BlogListing />} />
                        <Route path="/nyhet/:slug" element={<BlogPost />} />
                        <Route path="/om-oss" element={<About />} />
                        <Route path="/kontakt" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </Layout>
                } />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;