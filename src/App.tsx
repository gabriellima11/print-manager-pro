import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Impressoras from "./pages/Impressoras";
import Alertas from "./pages/Alertas";
import Relatorios from "./pages/Relatorios";
import Sedes from "./pages/Sedes";
import Estoque from "./pages/Estoque";
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
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/impressoras" element={<ProtectedRoute><Impressoras /></ProtectedRoute>} />
          <Route path="/alertas" element={<ProtectedRoute><Alertas /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
          <Route path="/sedes" element={<ProtectedRoute><Sedes /></ProtectedRoute>} />
          <Route path="/estoque" element={<ProtectedRoute><Estoque /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
