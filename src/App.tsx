import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Metoden from "./pages/Metoden";
import Tjenester from "./pages/Tjenester";
import Bransjer from "./pages/Bransjer";
import Ressurser from "./pages/Ressurser";
import BlogListing from "./pages/BlogListing";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
// Tjeneste-undersider
import Regnskapsforer from "./pages/tjenester/Regnskapsforer";
import AiInnsikt from "./pages/tjenester/AiInnsikt";
import CFO from "./pages/tjenester/CFO";
import HR from "./pages/tjenester/HR";
import Nettsider from "./pages/tjenester/Nettsider";
import SEO from "./pages/tjenester/SEO";
import MetaAnnonser from "./pages/tjenester/MetaAnnonser";
import GoogleAds from "./pages/tjenester/GoogleAds";
import Nettbutikk from "./pages/tjenester/Nettbutikk";
import AiAutomatisering from "./pages/tjenester/AiAutomatisering";
import Kurs from "./pages/tjenester/Kurs";
import EnTilEnRegnskap from "./pages/tjenester/EnTilEnRegnskap";
import KursDetalj from "./pages/tjenester/KursDetalj";
// Bransje-undersider
import TechSaas from "./pages/bransjer/TechSaas";
import Eiendom from "./pages/bransjer/Eiendom";
import Holding from "./pages/bransjer/Holding";
import Consulting from "./pages/bransjer/Consulting";
import Landbruk from "./pages/bransjer/Landbruk";
import Varehandel from "./pages/bransjer/Varehandel";
import ByggAnlegg from "./pages/bransjer/ByggAnlegg";
import NettbutikkBransje from "./pages/bransjer/NettbutikkBransje";
import Helse from "./pages/bransjer/Helse";
import Restaurant from "./pages/bransjer/Restaurant";
import Frisor from "./pages/bransjer/Frisor";
import Handverkere from "./pages/bransjer/Handverkere";
import TransportLogistikk from "./pages/bransjer/TransportLogistikk";
import IndustriProduksjon from "./pages/bransjer/IndustriProduksjon";
import RenholdFacility from "./pages/bransjer/RenholdFacility";
import KulturMedia from "./pages/bransjer/KulturMedia";
import SportFritid from "./pages/bransjer/SportFritid";
import UtdanningKurs from "./pages/bransjer/UtdanningKurs";
import JuridiskAdvokat from "./pages/bransjer/JuridiskAdvokat";
import ArkitekturDesign from "./pages/bransjer/ArkitekturDesign";
import MarkedsforingReklame from "./pages/bransjer/MarkedsforingReklame";
import BemanningRekruttering from "./pages/bransjer/BemanningRekruttering";
import ReiselivTurisme from "./pages/bransjer/ReiselivTurisme";
import BilVerksted from "./pages/bransjer/BilVerksted";
import EnergiMiljo from "./pages/bransjer/EnergiMiljo";

const queryClient = new QueryClient();

// Protected route for admin dashboard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">Laster…</div></div>;
  if (!user) return <Navigate to="/admin/logg-inn" replace />;
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
            <Routes>
              {/* Admin routes (no Layout wrapper) */}
              <Route path="/admin/logg-inn" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<Navigate to="/admin/logg-inn" replace />} />

              {/* Public routes */}
              <Route path="/*" element={
                <Layout>
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
                    <Route path="/nyheter" element={<BlogListing />} />
                    <Route path="/nyhet/:slug" element={<BlogPost />} />
                    <Route path="/om-oss" element={<About />} />
                    <Route path="/kontakt" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
