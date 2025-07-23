import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OrganizationGuard } from "@/components/OrganizationGuard";
import { OnboardingCheck } from "@/components/OnboardingCheck";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Entreprises from "./pages/Entreprises";
import Catalogue from "./pages/Catalogue";
import Devis from "./pages/Devis";
import Prestations from "./pages/Prestations";
import Factures from "./pages/Factures";
import Paiements from "./pages/Paiements";
import Reclamations from "./pages/Reclamations";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OnboardingCheck>
            <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/" element={
              <ProtectedRoute>
                <OrganizationGuard>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </OrganizationGuard>
              </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              <ProtectedRoute>
                <OrganizationGuard>
                  <Layout>
                    <Contacts />
                  </Layout>
                </OrganizationGuard>
              </ProtectedRoute>
            } />
            <Route path="/entreprises" element={
              <ProtectedRoute>
                <OrganizationGuard>
                  <Layout>
                    <Entreprises />
                  </Layout>
                </OrganizationGuard>
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
                <OrganizationGuard>
                  <Layout>
                    <Catalogue />
                  </Layout>
                </OrganizationGuard>
              </ProtectedRoute>
            } />
            <Route path="/devis" element={
              <ProtectedRoute>
                <OrganizationGuard>
                  <Layout>
                    <Devis />
                  </Layout>
                </OrganizationGuard>
              </ProtectedRoute>
            } />
            <Route path="/prestations" element={
              <ProtectedRoute>
                <OrganizationGuard>
                  <Layout>
                    <Prestations />
                  </Layout>
                </OrganizationGuard>
              </ProtectedRoute>
            } />
            <Route path="/factures" element={
              <ProtectedRoute>
                <OrganizationGuard>
                  <Layout>
                    <Factures />
                  </Layout>
                </OrganizationGuard>
              </ProtectedRoute>
            } />
            <Route path="/paiements" element={
              <ProtectedRoute>
                <OrganizationGuard>
                  <Layout>
                    <Paiements />
                  </Layout>
                </OrganizationGuard>
              </ProtectedRoute>
            } />
            <Route path="/reclamations" element={
              <ProtectedRoute>
                <OrganizationGuard>
                  <Layout>
                    <Reclamations />
                  </Layout>
                </OrganizationGuard>
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
          </OnboardingCheck>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
