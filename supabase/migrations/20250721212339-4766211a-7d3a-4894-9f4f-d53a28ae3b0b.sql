-- Phase 1: Fix RLS policies pour la sécurité multi-tenant

-- 1. Améliorer la politique des contacts pour vérifier l'organisation
DROP POLICY IF EXISTS "Users can create contacts" ON public.contacts;
CREATE POLICY "Users can create contacts in their organization" 
ON public.contacts 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 2. Améliorer la politique des entreprises
DROP POLICY IF EXISTS "Users can create entreprises" ON public.entreprises;
CREATE POLICY "Users can create entreprises in their organization" 
ON public.entreprises 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 3. Améliorer la politique des devis
DROP POLICY IF EXISTS "Users can create devis" ON public.devis;
CREATE POLICY "Users can create devis in their organization" 
ON public.devis 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 4. Améliorer la politique des factures
DROP POLICY IF EXISTS "Users can create factures" ON public.factures;
CREATE POLICY "Users can create factures in their organization" 
ON public.factures 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 5. Améliorer la politique des paiements
DROP POLICY IF EXISTS "Users can create paiements" ON public.paiements;
CREATE POLICY "Users can create paiements in their organization" 
ON public.paiements 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 6. Améliorer la politique des prestations
DROP POLICY IF EXISTS "Users can create prestations" ON public.prestations;
CREATE POLICY "Users can create prestations in their organization" 
ON public.prestations 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 7. Améliorer la politique des reclamations
DROP POLICY IF EXISTS "Users can create reclamations" ON public.reclamations;
CREATE POLICY "Users can create reclamations in their organization" 
ON public.reclamations 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 8. Améliorer la politique des interactions
DROP POLICY IF EXISTS "Users can create interactions" ON public.interactions;
CREATE POLICY "Users can create interactions in their organization" 
ON public.interactions 
FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 9. Créer une fonction pour créer automatiquement une organisation lors de l'inscription
CREATE OR REPLACE FUNCTION public.create_organization_for_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_org_id uuid;
  org_name text;
BEGIN
  -- Créer un nom d'organisation basé sur l'email
  org_name := split_part(NEW.email, '@', 1) || ' Organization';
  
  -- Créer une nouvelle organisation
  INSERT INTO public.organizations (name, slug, description)
  VALUES (
    org_name,
    lower(replace(split_part(NEW.email, '@', 1), '.', '-')) || '-' || substr(NEW.id::text, 1, 8),
    'Organisation créée automatiquement'
  )
  RETURNING id INTO new_org_id;
  
  -- Ajouter l'utilisateur comme propriétaire de l'organisation
  INSERT INTO public.organization_members (organization_id, user_id, role, invited_by)
  VALUES (new_org_id, NEW.id, 'owner', NEW.id);
  
  RETURN NEW;
END;
$$;

-- 10. Créer un trigger pour exécuter cette fonction après la création d'un profil
CREATE OR REPLACE TRIGGER create_organization_after_profile_creation
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_organization_for_new_user();