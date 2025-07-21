-- Introduce is_user_member_of_org helper function and update policies

-- 1. Create helper function
CREATE OR REPLACE FUNCTION public.is_user_member_of_org(p_user uuid, p_org uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = p_user AND organization_id = p_org
  );
$$;

-- Ensure the function owner is postgres and has BYPASSRLS
ALTER FUNCTION public.is_user_member_of_org(uuid, uuid) OWNER TO postgres;
ALTER ROLE postgres BYPASSRLS;

-- 2. Update policies on organization_members to use the new function
DROP POLICY IF EXISTS "Users can view their organization members" ON public.organization_members;
CREATE POLICY "Users can view their organization members"
ON public.organization_members
FOR SELECT
USING (public.is_user_member_of_org(auth.uid(), organization_id));

DROP POLICY IF EXISTS "Organization admins can manage members" ON public.organization_members;
CREATE POLICY "Organization admins can manage members"
ON public.organization_members
FOR ALL
USING (
  public.is_user_member_of_org(auth.uid(), organization_id) AND
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role IN ('admin', 'owner')
  )
);
