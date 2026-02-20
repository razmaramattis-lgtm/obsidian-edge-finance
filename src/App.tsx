import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Metoden from "./pages/Metoden";
import Tjenester from "./pages/Tjenester";
import NotFound from "./pages/NotFound";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="/metoden" element={<Metoden />} />
            <Route path="/priser" element={<Pricing />} />
            <Route path="/om-oss" element={<About />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
