import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Entreprise } from '@/types/domain';

export { Entreprise };

export interface CreateEntrepriseData {
  raison_sociale: string;
  siren: string | null;
  siret: string | null;
  secteur: string | null;
  taille: string | null;
  type_relation: string | null;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
  pays: string | null;
  tva: string | null;
  iban: string | null;
  bic: string | null;
  banque: string | null;
  commentaires: string | null;
}

export const useEntreprises = () => {
  return useQuery({
    queryKey: ['entreprises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useCreateEntreprise = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { organizationId } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateEntrepriseData) => {
      if (!organizationId) {
        throw new Error('Organisation introuvable');
      }

      const payload = { ...data, organization_id: organizationId };

      const { data: entreprise, error } = await supabase
        .from('entreprises')
        .insert([payload])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return entreprise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entreprises'] });
      toast({
        title: "Entreprise créée",
        description: "L'entreprise a été créée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEntreprise = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Entreprise> & { id: string }) => {
      const { data: entreprise, error } = await supabase
        .from('entreprises')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return entreprise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entreprises'] });
      toast({
        title: "Entreprise mise à jour",
        description: "L'entreprise a été mise à jour avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEntreprise = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('entreprises')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entreprises'] });
      toast({
        title: "Entreprise supprimée",
        description: "L'entreprise a été supprimée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
