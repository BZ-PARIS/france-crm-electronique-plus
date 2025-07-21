-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE public.contact_type AS ENUM ('particulier', 'entreprise');
CREATE TYPE public.interaction_type AS ENUM ('email', 'appel', 'tchat', 'reunion_presentiel', 'reunion_distanciel', 'formulaire', 'rencontre');
CREATE TYPE public.devis_status AS ENUM ('brouillon', 'envoye', 'accepte', 'refuse', 'expire');
CREATE TYPE public.prestation_status AS ENUM ('planifie', 'en_cours', 'termine', 'annule');
CREATE TYPE public.facture_status AS ENUM ('brouillon', 'envoyee', 'payee', 'en_retard', 'annulee');
CREATE TYPE public.paiement_status AS ENUM ('en_attente', 'recu', 'rapproche');
CREATE TYPE public.tache_status AS ENUM ('a_faire', 'en_cours', 'terminee', 'annulee');
CREATE TYPE public.reclamation_status AS ENUM ('prise_en_compte', 'en_cours', 'traitee', 'rejetee');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT,
  fonction TEXT,
  date_arrivee DATE DEFAULT CURRENT_DATE,
  date_depart DATE,
  competences TEXT[],
  statut TEXT DEFAULT 'interne',
  tags TEXT[],
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create entreprises table
CREATE TABLE public.entreprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  siren TEXT,
  siret TEXT,
  raison_sociale TEXT NOT NULL,
  secteur TEXT,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  tva TEXT,
  taille TEXT,
  site_web TEXT,
  iban TEXT,
  bic TEXT,
  banque TEXT,
  commentaires TEXT,
  type_relation TEXT DEFAULT 'client', -- client, prestataire, partenaire, concurrent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  nom TEXT NOT NULL,
  prenom TEXT,
  telephone TEXT,
  type contact_type DEFAULT 'particulier',
  entreprise_id UUID REFERENCES public.entreprises(id),
  collaborateur_id UUID REFERENCES public.profiles(id),
  statut TEXT,
  canal_acquisition TEXT,
  date_acquisition DATE DEFAULT CURRENT_DATE,
  tags TEXT[],
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create catalogue table (produits/services)
CREATE TABLE public.catalogue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  description TEXT,
  classification TEXT,
  prix_unitaire_ht DECIMAL(10,2),
  fiche_produit TEXT,
  lien_pdf TEXT,
  statut TEXT DEFAULT 'actif',
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interactions table
CREATE TABLE public.interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type interaction_type NOT NULL,
  date_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  heure TIME,
  lien_visio TEXT,
  contact_id UUID REFERENCES public.contacts(id),
  entreprise_id UUID REFERENCES public.entreprises(id),
  collaborateur_id UUID REFERENCES public.profiles(id),
  description TEXT,
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devis table
CREATE TABLE public.devis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_devis TEXT UNIQUE NOT NULL,
  date_emission DATE DEFAULT CURRENT_DATE,
  contact_id UUID REFERENCES public.contacts(id),
  entreprise_id UUID REFERENCES public.entreprises(id),
  canal_acquisition TEXT,
  statut devis_status DEFAULT 'brouillon',
  montant_ht DECIMAL(10,2),
  montant_tva DECIMAL(10,2),
  montant_ttc DECIMAL(10,2),
  verrouille BOOLEAN DEFAULT FALSE,
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devis_items table (products in quotes)
CREATE TABLE public.devis_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  devis_id UUID REFERENCES public.devis(id) ON DELETE CASCADE,
  catalogue_id UUID REFERENCES public.catalogue(id),
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(10,2),
  remise DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prestations table
CREATE TABLE public.prestations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  designation TEXT NOT NULL,
  contact_id UUID REFERENCES public.contacts(id),
  entreprise_id UUID REFERENCES public.entreprises(id),
  devis_id UUID REFERENCES public.devis(id),
  statut prestation_status DEFAULT 'planifie',
  date_debut DATE,
  date_fin DATE,
  localisation TEXT,
  intervenants UUID[] DEFAULT '{}',
  montant DECIMAL(10,2),
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create factures table
CREATE TABLE public.factures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_facture TEXT UNIQUE NOT NULL,
  prestation_id UUID REFERENCES public.prestations(id),
  devis_id UUID REFERENCES public.devis(id),
  contact_id UUID REFERENCES public.contacts(id),
  entreprise_id UUID REFERENCES public.entreprises(id),
  date_emission DATE DEFAULT CURRENT_DATE,
  date_echeance DATE,
  statut facture_status DEFAULT 'brouillon',
  montant_ht DECIMAL(10,2),
  montant_tva DECIMAL(10,2),
  montant_ttc DECIMAL(10,2),
  conditions_paiement TEXT,
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create paiements table
CREATE TABLE public.paiements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_paiement TEXT UNIQUE NOT NULL,
  facture_id UUID REFERENCES public.factures(id),
  contact_id UUID REFERENCES public.contacts(id),
  entreprise_id UUID REFERENCES public.entreprises(id),
  statut paiement_status DEFAULT 'en_attente',
  type_paiement TEXT,
  montant DECIMAL(10,2),
  date_paiement DATE,
  reste_a_payer DECIMAL(10,2),
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create taches table
CREATE TABLE public.taches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  description TEXT,
  collaborateur_id UUID REFERENCES public.profiles(id),
  date_debut DATE,
  date_fin DATE,
  date_echeance DATE,
  statut tache_status DEFAULT 'a_faire',
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reclamations table
CREATE TABLE public.reclamations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_reclamation TEXT UNIQUE NOT NULL,
  entreprise_id UUID REFERENCES public.entreprises(id),
  contact_id UUID REFERENCES public.contacts(id),
  theme TEXT,
  type_theme TEXT, -- technique, financier, autre
  statut reclamation_status DEFAULT 'prise_en_compte',
  description TEXT,
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kpi table
CREATE TABLE public.kpi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  designation TEXT NOT NULL,
  valeur DECIMAL(15,2),
  analyse_kpi TEXT,
  date_revision DATE,
  date_expiration DATE,
  canaux TEXT[],
  collaborateur_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_entreprise ON public.contacts(entreprise_id);
CREATE INDEX idx_contacts_collaborateur ON public.contacts(collaborateur_id);
CREATE INDEX idx_devis_contact ON public.devis(contact_id);
CREATE INDEX idx_devis_entreprise ON public.devis(entreprise_id);
CREATE INDEX idx_factures_contact ON public.factures(contact_id);
CREATE INDEX idx_factures_entreprise ON public.factures(entreprise_id);
CREATE INDEX idx_prestations_entreprise ON public.prestations(entreprise_id);
CREATE INDEX idx_interactions_contact ON public.interactions(contact_id);
CREATE INDEX idx_interactions_entreprise ON public.interactions(entreprise_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entreprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devis_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reclamations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi ENABLE ROW LEVEL SECURITY;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for entreprises (accessible to all authenticated users)
CREATE POLICY "Authenticated users can view entreprises" ON public.entreprises
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create entreprises" ON public.entreprises
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update entreprises" ON public.entreprises
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete entreprises" ON public.entreprises
  FOR DELETE TO authenticated USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for contacts
CREATE POLICY "Authenticated users can view contacts" ON public.contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create contacts" ON public.contacts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update contacts" ON public.contacts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete contacts" ON public.contacts
  FOR DELETE TO authenticated USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for catalogue
CREATE POLICY "Authenticated users can view catalogue" ON public.catalogue
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage catalogue" ON public.catalogue
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for interactions
CREATE POLICY "Authenticated users can view interactions" ON public.interactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create interactions" ON public.interactions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update interactions" ON public.interactions
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for devis
CREATE POLICY "Authenticated users can view devis" ON public.devis
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create devis" ON public.devis
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update devis" ON public.devis
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for devis_items
CREATE POLICY "Authenticated users can view devis items" ON public.devis_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage devis items" ON public.devis_items
  FOR ALL TO authenticated USING (true);

-- RLS Policies for prestations
CREATE POLICY "Authenticated users can view prestations" ON public.prestations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create prestations" ON public.prestations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update prestations" ON public.prestations
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for factures
CREATE POLICY "Authenticated users can view factures" ON public.factures
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create factures" ON public.factures
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update factures" ON public.factures
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for paiements
CREATE POLICY "Authenticated users can view paiements" ON public.paiements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create paiements" ON public.paiements
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update paiements" ON public.paiements
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for taches
CREATE POLICY "Users can view assigned tasks" ON public.taches
  FOR SELECT TO authenticated USING (collaborateur_id = auth.uid() OR public.get_user_role(auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Users can create tasks" ON public.taches
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update assigned tasks" ON public.taches
  FOR UPDATE TO authenticated USING (collaborateur_id = auth.uid() OR public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- RLS Policies for reclamations
CREATE POLICY "Authenticated users can view reclamations" ON public.reclamations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create reclamations" ON public.reclamations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update reclamations" ON public.reclamations
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for kpi
CREATE POLICY "Authenticated users can view KPI" ON public.kpi
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage KPI" ON public.kpi
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('admin', 'manager'));

-- Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_entreprises_updated_at BEFORE UPDATE ON public.entreprises FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_catalogue_updated_at BEFORE UPDATE ON public.catalogue FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON public.interactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_devis_updated_at BEFORE UPDATE ON public.devis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prestations_updated_at BEFORE UPDATE ON public.prestations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON public.factures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_paiements_updated_at BEFORE UPDATE ON public.paiements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_taches_updated_at BEFORE UPDATE ON public.taches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reclamations_updated_at BEFORE UPDATE ON public.reclamations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kpi_updated_at BEFORE UPDATE ON public.kpi FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nom, prenom)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
