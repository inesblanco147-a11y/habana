import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import Index from "./pages/Index";
import NosotrosPage from "./pages/NosotrosPage";
import ServiciosPage from "./pages/ServiciosPage";
import CursosPage from "./pages/CursosPage";
import ProductosPage from "./pages/ProductosPage";
import GaleriaPage from "./pages/GaleriaPage";
import CitaPage from "./pages/CitaPage";
import ContactPage from "./pages/ContactPage";
import AdminPanel from "./pages/AdminPanel";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
      networkMode: 'always',
    },
  },
});

const GlobalErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", event.reason);
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description: "Ocurrió un error. Por favor, recarga la página.",
      });
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, [toast]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GlobalErrorHandler>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/servicios" element={<ServiciosPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/galeria" element={<GaleriaPage />} />
            <Route path="/cita" element={<CitaPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GlobalErrorHandler>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
