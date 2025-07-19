-- Create organizations table for multi-tenancy
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscriptions table for Stripe integration
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan_id TEXT,
  plan_name TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create organization_members table for user-organization relationships
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Add organization_id to existing tables for multi-tenancy
ALTER TABLE public.contacts ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.entreprises ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.devis ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.factures ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.prestations ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.interactions ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.reclamations ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.paiements ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.taches ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.kpi ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.catalogue ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Enable RLS on new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Create function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization_id(user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = get_user_organization_id.user_id 
  LIMIT 1;
$$;

-- RLS Policies for organizations
CREATE POLICY "Users can view their organization" 
ON public.organizations 
FOR SELECT 
USING (id = get_user_organization_id(auth.uid()));

CREATE POLICY "Organization admins can update their org" 
ON public.organizations 
FOR UPDATE 
USING (
  id = get_user_organization_id(auth.uid()) AND 
  EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = id 
    AND user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  )
);

-- RLS Policies for subscriptions
CREATE POLICY "Organization members can view subscription" 
ON public.subscriptions 
FOR SELECT 
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Organization admins can manage subscription" 
ON public.subscriptions 
FOR ALL 
USING (
  organization_id = get_user_organization_id(auth.uid()) AND 
  EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = subscriptions.organization_id 
    AND user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  )
);

-- RLS Policies for organization_members
CREATE POLICY "Users can view their organization members" 
ON public.organization_members 
FOR SELECT 
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Organization admins can manage members" 
ON public.organization_members 
FOR ALL 
USING (
  organization_id = get_user_organization_id(auth.uid()) AND 
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('admin', 'owner')
  )
);

-- Update existing RLS policies to include organization filtering
-- Contacts
DROP POLICY IF EXISTS "Authenticated users can view contacts" ON public.contacts;
CREATE POLICY "Organization members can view contacts" 
ON public.contacts 
FOR SELECT 
USING (organization_id = get_user_organization_id(auth.uid()));

-- Entreprises
DROP POLICY IF EXISTS "Authenticated users can view entreprises" ON public.entreprises;
CREATE POLICY "Organization members can view entreprises" 
ON public.entreprises 
FOR SELECT 
USING (organization_id = get_user_organization_id(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();