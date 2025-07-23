-- Missing B-tree indexes on organization_id columns slowed down RLS policies.
-- Add missing indexes for RLS performance
-- Index on contacts.organization_id
CREATE INDEX IF NOT EXISTS idx_contacts_organization ON public.contacts(organization_id);
-- Index on devis.organization_id (user column not present, indexing organization)
CREATE INDEX IF NOT EXISTS idx_devis_organization ON public.devis(organization_id);
-- Index on organization_members.user_id for fast lookup
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON public.organization_members(user_id);
