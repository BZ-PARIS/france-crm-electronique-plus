-- RLS policies allowed cross-tenant access due to USING (true). Replace with tenant scoped rules.
-- Contacts
DROP POLICY IF EXISTS "Users can create contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can delete contacts" ON public.contacts;
CREATE POLICY "Contacts org policy" ON public.contacts
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Devis
DROP POLICY IF EXISTS "Authenticated users can view devis" ON public.devis;
DROP POLICY IF EXISTS "Users can create devis in their organization" ON public.devis;
DROP POLICY IF EXISTS "Users can update devis" ON public.devis;
CREATE POLICY "Devis org policy" ON public.devis
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Devis items
DROP POLICY IF EXISTS "Authenticated users can view devis items" ON public.devis_items;
DROP POLICY IF EXISTS "Users can manage devis items" ON public.devis_items;
CREATE POLICY "Devis items org policy" ON public.devis_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.devis d
      WHERE d.id = devis_items.devis_id
      AND d.organization_id = get_user_organization_id(auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.devis d
      WHERE d.id = devis_items.devis_id
      AND d.organization_id = get_user_organization_id(auth.uid())
    )
  );

-- Factures
DROP POLICY IF EXISTS "Authenticated users can view factures" ON public.factures;
DROP POLICY IF EXISTS "Users can create factures in their organization" ON public.factures;
DROP POLICY IF EXISTS "Users can update factures" ON public.factures;
CREATE POLICY "Factures org policy" ON public.factures
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Paiements
DROP POLICY IF EXISTS "Authenticated users can view paiements" ON public.paiements;
DROP POLICY IF EXISTS "Users can create paiements" ON public.paiements;
DROP POLICY IF EXISTS "Users can update paiements" ON public.paiements;
CREATE POLICY "Paiements org policy" ON public.paiements
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Prestations
DROP POLICY IF EXISTS "Authenticated users can view prestations" ON public.prestations;
DROP POLICY IF EXISTS "Users can create prestations" ON public.prestations;
DROP POLICY IF EXISTS "Users can update prestations" ON public.prestations;
CREATE POLICY "Prestations org policy" ON public.prestations
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Interactions
DROP POLICY IF EXISTS "Authenticated users can view interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can create interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can update interactions" ON public.interactions;
CREATE POLICY "Interactions org policy" ON public.interactions
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Reclamations
DROP POLICY IF EXISTS "Authenticated users can view reclamations" ON public.reclamations;
DROP POLICY IF EXISTS "Users can create reclamations" ON public.reclamations;
DROP POLICY IF EXISTS "Users can update reclamations" ON public.reclamations;
CREATE POLICY "Reclamations org policy" ON public.reclamations
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Catalogue
DROP POLICY IF EXISTS "Authenticated users can view catalogue" ON public.catalogue;
DROP POLICY IF EXISTS "Managers can manage catalogue" ON public.catalogue;
CREATE POLICY "Catalogue org policy" ON public.catalogue
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Taches
DROP POLICY IF EXISTS "Users can view assigned tasks" ON public.taches;
DROP POLICY IF EXISTS "Users can create tasks" ON public.taches;
DROP POLICY IF EXISTS "Users can update assigned tasks" ON public.taches;
CREATE POLICY "Taches org policy" ON public.taches
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- KPI
DROP POLICY IF EXISTS "Authenticated users can view KPI" ON public.kpi;
DROP POLICY IF EXISTS "Managers can manage KPI" ON public.kpi;
CREATE POLICY "KPI org policy" ON public.kpi
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()))
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));
