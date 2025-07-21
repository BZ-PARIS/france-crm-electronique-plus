import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/hooks/useOrganization';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building2, AlertCircle } from 'lucide-react';

interface OrganizationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const OrganizationGuard: React.FC<OrganizationGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { organization, loading: orgLoading, error, refetch } = useOrganization();

  // Chargement de l'authentification
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Utilisateur non connecté
  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Chargement de l'organisation
  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre organisation...</p>
        </div>
      </div>
    );
  }

  // Erreur lors du chargement de l'organisation
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Erreur</CardTitle>
            <CardDescription>
              Une erreur est survenue lors du chargement de votre organisation.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={refetch} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Aucune organisation trouvée
  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Organisation en cours de création</CardTitle>
            <CardDescription>
              Votre organisation est en cours de création. Cela peut prendre quelques instants.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={refetch} variant="outline">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Vérifier à nouveau
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tout est OK, afficher le contenu
  return <>{children}</>;
};