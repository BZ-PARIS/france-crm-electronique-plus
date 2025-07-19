# France CRM Electronique Plus

> 🚀 **SaaS CRM robuste et multi-tenant** pour la gestion commerciale et administrative

[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
[![Coverage](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)

## 📋 Fonctionnalités

- 🔐 **Authentification Supabase** avec gestion des rôles
- 👥 **Multi-tenant** avec organisations isolées
- 💳 **Intégration Stripe** pour les abonnements
- 📊 **Tableaux de bord** avec métriques temps réel
- 🏢 **Gestion d'entreprises et contacts**
- 📄 **Devis, factures et prestations**
- 📈 **KPI et analytics**
- 🔧 **Architecture moderne** React + TypeScript + Tailwind

## 🏗️ Architecture Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le dev server
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants
- **React Query** pour la gestion d'état serveur
- **React Router** pour la navigation

### Backend
- **Supabase** (PostgreSQL + Auth + Realtime + Edge Functions)
- **Row Level Security (RLS)** pour l'isolation des données
- **Stripe** pour les paiements et abonnements

### DevOps
- **GitHub Actions** pour CI/CD
- **Jest + React Testing Library** pour les tests
- **Prettier + ESLint** pour la qualité du code

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ ([installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Compte [Supabase](https://supabase.com)
- Compte [Stripe](https://stripe.com) (optionnel pour les paiements)

### 1. Cloner le projet
```bash
git clone https://github.com/YOUR_USERNAME/france-crm-electronique-plus.git
cd france-crm-electronique-plus
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Supabase

#### a) Créer un projet Supabase
1. Créez un projet sur [Supabase](https://supabase.com/dashboard)
2. Récupérez l'URL et la clé anonyme dans Settings > API

#### b) Configurer les variables d'environnement
```bash
cp .env.example .env
```

Éditez `.env` avec vos valeurs :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### c) Exécuter les migrations de base de données
```bash
# Installer Supabase CLI
npm install -g @supabase/cli

# Se connecter à votre projet
supabase login
supabase link --project-ref votre-project-ref

# Appliquer les migrations
supabase db push
```

### 4. Configuration Stripe (optionnel)

1. Créez un compte [Stripe](https://dashboard.stripe.com)
2. Récupérez vos clés API dans Developers > API keys
3. Configurez les secrets dans Supabase Edge Functions :

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

### 5. Démarrer l'application

#### Développement
```bash
npm run dev
```

#### Production
```bash
npm run build
npm run preview
```

## 🧪 Tests et Qualité

### Lancer les tests
```bash
npm test                # Tests unitaires
npm run test:watch      # Tests en mode watch
npm run test:coverage   # Tests avec couverture
```

### Vérifications qualité
```bash
npm run lint            # ESLint
npm run format          # Prettier (formatage)
npm run format:check    # Vérifier le formatage
```

## 📦 Déploiement

### 1. Via Lovable (Recommandé)
1. Connectez le projet à GitHub
2. Cliquez sur "Publish" dans l'interface Lovable
3. Configurez votre domaine personnalisé si nécessaire

### 2. Via Vercel
```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel --prod
```

### 3. Via Netlify
```bash
# Build
npm run build

# Déployer le dossier dist/
```

### Variables d'environnement de production
Configurez ces variables dans votre plateforme de déploiement :

```env
VITE_SUPABASE_URL=https://votre-projet-prod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Structure de la Base de Données

### Tables principales
- `profiles` - Profils utilisateurs avec rôles
- `organizations` - Organisations multi-tenant
- `contacts` - Contacts clients/prospects
- `entreprises` - Données d'entreprises
- `devis` - Devis commerciaux
- `factures` - Factures
- `prestations` - Prestations de service
- `subscriptions` - Abonnements Stripe

### Politiques RLS
Toutes les tables implémentent Row Level Security pour isoler les données par organisation.

## 💳 Gestion des Abonnements

### Plans disponibles
- **Gratuit** : 5 contacts, fonctionnalités de base
- **Pro** : 100 contacts, devis/factures, support
- **Enterprise** : Illimité, API, support prioritaire

### Intégration Stripe
```typescript
// Créer une session de paiement
const { data } = await supabase.functions.invoke('create-stripe-session', {
  body: { plan: 'pro' }
});

// Rediriger vers Stripe Checkout
window.location.href = data.url;
```

## 🛠️ Développement

### Architecture des composants
```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants shadcn/ui
│   └── layout/         # Layout et navigation
├── pages/              # Pages de l'application
├── hooks/              # Custom hooks
├── contexts/           # Contextes React
├── lib/                # Utilitaires
└── integrations/       # Intégrations externes
```

### Conventions de code
- **Composants** : PascalCase
- **Hooks** : préfixe `use`
- **Types** : suffixe `Type` ou `Interface`
- **Tests** : fichiers `.test.tsx`

### Contribution
1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Pushez sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📞 Support

- 📧 **Email** : support@france-crm.fr
- 📖 **Documentation** : [docs.france-crm.fr](https://docs.france-crm.fr)
- 🐛 **Issues** : [GitHub Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Développé avec ❤️ par l'équipe France CRM Electronique Plus**
