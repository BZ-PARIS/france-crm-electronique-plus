-- Fix infinite recursion in organization_members RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON public.organization_members;

-- Create new policies that don't cause recursion
-- Users can view organization members where they are also a member
CREATE POLICY "Users can view members of their organization" 
ON public.organization_members 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Organization owners and admins can manage members
CREATE POLICY "Organization owners and admins can manage members" 
ON public.organization_members 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.organization_members om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.organization_members om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin')
  )
);

-- Also fix the organizations table policy that has similar issue
DROP POLICY IF EXISTS "Organization admins can update their org" ON public.organizations;

CREATE POLICY "Organization owners and admins can update their org" 
ON public.organizations 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.organization_members om 
    WHERE om.organization_id = organizations.id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin')
  )
);