import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingCheckProps {
  children: React.ReactNode;
}

export const OnboardingCheck: React.FC<OnboardingCheckProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading || !user || profile === null) return;

    // Pages exclues de la vérification d'onboarding
    const excludedPaths = ['/auth', '/onboarding', '/pricing'];
    if (excludedPaths.includes(location.pathname)) return;

    // Vérifier si l'onboarding a été complété
    const onboardingCompleted = profile?.onboarding_completed;

    if (!onboardingCompleted) {
      navigate('/onboarding');
    }
  }, [user, profile?.onboarding_completed, loading, navigate, location.pathname]);

  // Si on est en cours de chargement ou sur une page exclue, afficher le contenu normalement
  if (loading || profile === null || ['/auth', '/onboarding', '/pricing'].includes(location.pathname)) {
    return <>{children}</>;
  }

  // Si l'onboarding n'est pas complété, ne rien afficher (la redirection se fera)
  const onboardingCompleted = profile?.onboarding_completed;
  if (!onboardingCompleted && user) {
    return null;
  }

  return <>{children}</>;
};
