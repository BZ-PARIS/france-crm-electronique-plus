import { ErrorBoundary } from '@/lib/sentry';
import React from 'react';

export function CRMErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<p>Une erreur est survenue</p>}>
      {children}
    </ErrorBoundary>
  );
}
