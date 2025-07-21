import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  settings?: any;
}

interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface UseOrganizationReturn {
  organization: Organization | null;
  memberInfo: OrganizationMember | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrganization = (): UseOrganizationReturn => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [memberInfo, setMemberInfo] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer les informations de membre d'organisation
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations (
            id,
            name,
            slug,
            description,
            settings
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (memberError) {
        if (memberError.code === 'PGRST116') {
          // Aucune organisation trouvée - c'est normal pour un nouvel utilisateur
          setOrganization(null);
          setMemberInfo(null);
        } else {
          throw memberError;
        }
      } else {
        setMemberInfo(memberData);
        // Relations Supabase typées dynamiquement
        setOrganization((memberData as any).organizations);
      }
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [user?.id]);

  const refetch = async () => {
    await fetchOrganization();
  };

  return {
    organization,
    memberInfo,
    loading,
    error,
    refetch,
  };
};