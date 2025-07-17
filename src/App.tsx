import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Entreprises from "./pages/Entreprises";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/entreprises" element={<Entreprises />} />
            <Route path="/collaborateurs" element={<div className="p-8"><h1 className="text-2xl font-bold">Collaborateurs</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/catalogue" element={<div className="p-8"><h1 className="text-2xl font-bold">Catalogue</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/devis" element={<div className="p-8"><h1 className="text-2xl font-bold">Devis</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/prestations" element={<div className="p-8"><h1 className="text-2xl font-bold">Prestations</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/factures" element={<div className="p-8"><h1 className="text-2xl font-bold">Factures</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/paiements" element={<div className="p-8"><h1 className="text-2xl font-bold">Paiements</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/taches" element={<div className="p-8"><h1 className="text-2xl font-bold">Tâches</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/reclamations" element={<div className="p-8"><h1 className="text-2xl font-bold">Réclamations</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/kpi" element={<div className="p-8"><h1 className="text-2xl font-bold">KPI</h1><p className="text-muted-foreground">Module en cours de développement</p></div>} />
            <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Paramètres</h1><p className="text-muted-foreground">Configuration du CRM</p></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
