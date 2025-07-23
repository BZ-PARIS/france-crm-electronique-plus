import React from 'react';

export function init() {
  // placeholder for Sentry initialization
}

export function captureException(error: unknown) {
  console.error('Captured error', error);
}

export class ErrorBoundary extends React.Component<{ fallback?: React.ReactNode }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    captureException(error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
