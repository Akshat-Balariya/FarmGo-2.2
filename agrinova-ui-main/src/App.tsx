import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Schemes from "./pages/Schemes";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import CropMonitoring from "./pages/CropMonitoring";
import DiseaseDetection from "./pages/DiseaseDetection";
import YieldPrediction from "./pages/YieldPrediction";
import Marketplace from "./pages/Marketplace";
import FinancialSupport from "./pages/FinancialSupport";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/crop-monitoring" element={<CropMonitoring />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/financial-support" element={<FinancialSupport />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
