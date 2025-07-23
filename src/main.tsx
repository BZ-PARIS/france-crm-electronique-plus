import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CRMErrorBoundary } from './components/CRMErrorBoundary'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <CRMErrorBoundary>
    <App />
  </CRMErrorBoundary>
);
