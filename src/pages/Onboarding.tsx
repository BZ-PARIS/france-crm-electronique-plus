import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/hooks/useOrganization';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Building2, Users, Settings, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { organization, refetch } = useOrganization();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Données du formulaire
  const [organizationData, setOrganizationData] = useState({
    name: organization?.name || '',
    description: organization?.description || '',
  });

  const [profileData, setProfileData] = useState({
    fonction: profile?.fonction || '',
    telephone: profile?.telephone || '',
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue !',
      description: 'Configurons votre espace de travail',
      icon: <CheckCircle className="h-6 w-6" />,
      completed: false,
    },
    {
      id: 'organization',
      title: 'Votre organisation',
      description: 'Personnalisez les informations de votre organisation',
      icon: <Building2 className="h-6 w-6" />,
      completed: false,
    },
    {
      id: 'profile',
      title: 'Votre profil',
      description: 'Complétez vos informations personnelles',
      icon: <Users className="h-6 w-6" />,
      completed: false,
    },
    {
      id: 'complete',
      title: 'Configuration terminée',
      description: 'Votre CRM est prêt à être utilisé !',
      icon: <Settings className="h-6 w-6" />,
      completed: false,
    },
  ];

  const updateOrganization = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('organizations')
        .update({
          name: organizationData.name,
          description: organizationData.description,
        })
        .eq('id', organization.id);

      if (error) throw error;

      await refetch();
      toast({
        title: 'Organisation mise à jour',
        description: 'Les informations de votre organisation ont été sauvegardées.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour l'organisation.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          fonction: profileData.fonction,
          telephone: profileData.telephone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été sauvegardées.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      await updateOrganization();
    } else if (currentStep === 2) {
      await updateProfile();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marquer l'onboarding comme terminé dans la base de données
      if (user?.id) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);
        await refreshProfile();
      }
      navigate('/');
    }
  };

  const skipOnboarding = async () => {
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      await refreshProfile();
    }
    navigate('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold">Bienvenue dans votre CRM !</h2>
              <p className="text-muted-foreground">
                Nous allons configurer votre espace de travail en quelques étapes simples. Cela ne
                prendra que quelques minutes.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <Badge variant="secondary">
                <CheckCircle className="mr-1 h-3 w-3" />
                Organisation créée
              </Badge>
              <Badge variant="secondary">
                <CheckCircle className="mr-1 h-3 w-3" />
                Compte activé
              </Badge>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">Configurez votre organisation</h2>
              <p className="text-muted-foreground">
                Personnalisez les informations de votre organisation
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="orgName">Nom de l'organisation</Label>
                <Input
                  id="orgName"
                  value={organizationData.name}
                  onChange={(e) =>
                    setOrganizationData({ ...organizationData, name: e.target.value })
                  }
                  placeholder="Ex: Mon Entreprise SAS"
                />
              </div>
              <div>
                <Label htmlFor="orgDescription">Description (optionnel)</Label>
                <Textarea
                  id="orgDescription"
                  value={organizationData.description}
                  onChange={(e) =>
                    setOrganizationData({ ...organizationData, description: e.target.value })
                  }
                  placeholder="Décrivez brièvement votre activité..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">Votre profil</h2>
              <p className="text-muted-foreground">Complétez vos informations personnelles</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fonction">Fonction</Label>
                <Input
                  id="fonction"
                  value={profileData.fonction}
                  onChange={(e) => setProfileData({ ...profileData, fonction: e.target.value })}
                  placeholder="Ex: Directeur commercial, Responsable CRM..."
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone (optionnel)</Label>
                <Input
                  id="telephone"
                  value={profileData.telephone}
                  onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                  placeholder="Ex: +33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold">Configuration terminée !</h2>
              <p className="text-muted-foreground">
                Votre CRM est maintenant configuré et prêt à être utilisé. Vous pouvez commencer à
                gérer vos contacts, entreprises et plus encore.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <Users className="mx-auto mb-2 h-6 w-6 text-primary" />
                <div className="font-medium">Contacts</div>
                <div className="text-muted-foreground">Gérez vos relations clients</div>
              </div>
              <div className="rounded-lg border p-4">
                <Building2 className="mx-auto mb-2 h-6 w-6 text-primary" />
                <div className="font-medium">Entreprises</div>
                <div className="text-muted-foreground">Suivez vos comptes</div>
              </div>
              <div className="rounded-lg border p-4">
                <Settings className="mx-auto mb-2 h-6 w-6 text-primary" />
                <div className="font-medium">Tableau de bord</div>
                <div className="text-muted-foreground">Visualisez vos KPIs</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {steps[currentStep].icon}
                Configuration initiale
              </CardTitle>
              <CardDescription>
                Étape {currentStep + 1} sur {steps.length}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={skipOnboarding}>
              Passer
            </Button>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Précédent
            </Button>

            <Button onClick={handleNext} disabled={loading} className="flex items-center gap-2">
              {currentStep === steps.length - 1 ? (
                <>
                  Commencer
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
