import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";
import { LanguageProvider } from "@/lib/i18n";
import Index from "./pages/Index";
import Learning from "./pages/Learning";
import Quiz from "./pages/Quiz";
import ModuleSelection from "./pages/ModuleSelection";
import RoleSelection from "./pages/RoleSelection";
import Auth from "./pages/Auth";
import Sustainability from "./pages/Sustainability";
import Legal from "./pages/Legal";
import Terms from "./pages/Terms";
import Market from "./pages/Market";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AnimatedBackground />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/market" element={<Market />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/modules" element={<ModuleSelection />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
