import { useState } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    description: 'Pour démarrer votre activité',
    icon: Star,
    features: [
      '5 contacts maximum',
      'Gestion de base des entreprises',
      'Support par email',
      'Stockage 1 GB',
    ],
    limitations: [
      'Pas de devis/factures',
      'Pas d\'intégrations',
      'Support standard',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Pour les professionnels en croissance',
    icon: Zap,
    popular: true,
    features: [
      '100 contacts',
      'Devis et factures illimités',
      'Gestion des prestations',
      'Tableaux de bord avancés',
      'Intégrations tierces',
      'Support prioritaire',
      'Stockage 10 GB',
      'Export PDF/Excel',
    ],
    limitations: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    description: 'Pour les grandes équipes',
    icon: Check,
    features: [
      'Contacts illimités',
      'Multi-utilisateurs',
      'API complète',
      'Personnalisation avancée',
      'Support dédié 24/7',
      'Stockage illimité',
      'Formation incluse',
      'SLA garanti',
      'Sauvegarde quotidienne',
    ],
    limitations: [],
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour souscrire à un abonnement');
      return;
    }

    setLoading(planId);

    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-session', {
        body: { plan_id: planId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      toast.error('Erreur lors de la création de la session de paiement');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Développez votre entreprise avec les outils adaptés à vos besoins.
            Commencez gratuitement et évoluez à votre rythme.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <Badge
                    variant="default"
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  >
                    Le plus populaire
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/mois</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {loading === plan.id ? (
                      'Chargement...'
                    ) : plan.price === 0 ? (
                      'Commencer gratuitement'
                    ) : (
                      'Choisir ce plan'
                    )}
                  </Button>

                  {plan.limitations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Limitations :
                      </p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <li
                            key={index}
                            className="text-xs text-muted-foreground"
                          >
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment.
                Les changements prennent effet immédiatement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Y a-t-il des frais d'installation ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Non, aucun frais d'installation. Vous payez uniquement votre
                abonnement mensuel.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Proposez-vous un support technique ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Oui, tous nos plans incluent un support par email. Les plans Pro
                et Enterprise bénéficient d'un support prioritaire.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Mes données sont-elles sécurisées ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Absolument. Nous utilisons un chiffrement de niveau bancaire et
                des sauvegardes quotidiennes pour protéger vos données.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}