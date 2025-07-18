import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Entreprises from "./pages/Entreprises";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              <ProtectedRoute>
                <Layout>
                  <Contacts />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/entreprises" element={
              <ProtectedRoute>
                <Layout>
                  <Entreprises />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/collaborateurs" element={
              <ProtectedRoute requiredRole="manager">
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Collaborateurs</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/catalogue" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Catalogue</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/devis" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Devis</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/prestations" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Prestations</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/factures" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Factures</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/paiements" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Paiements</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/taches" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Tâches</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reclamations" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Réclamations</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/kpi" element={
              <ProtectedRoute requiredRole="manager">
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">KPI</h1><p className="text-muted-foreground">Module en cours de développement</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <div className="p-8"><h1 className="text-2xl font-bold">Paramètres</h1><p className="text-muted-foreground">Configuration du CRM</p></div>
                </Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
