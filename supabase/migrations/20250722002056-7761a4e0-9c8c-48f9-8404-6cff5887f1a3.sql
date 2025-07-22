-- Fix infinite recursion in organization_members RLS policies by using a direct approach
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view members of their organization" ON public.organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can manage members" ON public.organization_members;

-- Create simple non-recursive policies
-- Allow users to view their own membership record
CREATE POLICY "Users can view their own membership" 
ON public.organization_members 
FOR SELECT 
USING (user_id = auth.uid());

-- Allow users to insert their own membership (for initial organization creation)
CREATE POLICY "Users can create their own membership" 
ON public.organization_members 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create a security definer function to check if user is admin/owner without recursion
CREATE OR REPLACE FUNCTION public.is_organization_admin(check_organization_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.organization_members 
    WHERE organization_id = check_organization_id 
    AND user_id = check_user_id 
    AND role IN ('owner', 'admin')
  );
$$;

-- Allow organization admins to manage all members in their organization
CREATE POLICY "Organization admins can manage all members" 
ON public.organization_members 
FOR ALL 
USING (public.is_organization_admin(organization_id, auth.uid()))
WITH CHECK (public.is_organization_admin(organization_id, auth.uid()));

-- Update the organizations table policy to use the new function
DROP POLICY IF EXISTS "Organization owners and admins can update their org" ON public.organizations;

CREATE POLICY "Organization owners and admins can update their org" 
ON public.organizations 
FOR UPDATE 
USING (public.is_organization_admin(id, auth.uid()));

-- Also create a policy for users to view their own organization
CREATE POLICY "Users can view their own organization" 
ON public.organizations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.organization_members 
    WHERE organization_id = organizations.id 
    AND user_id = auth.uid()
  )
);