import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Entreprise {
  id: string;
  raison_sociale: string;
  siren?: string;
  siret?: string;
  secteur?: string;
  taille?: string;
  type_relation?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  site_web?: string;
  tva?: string;
  iban?: string;
  bic?: string;
  banque?: string;
  commentaires?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEntrepriseData {
  raison_sociale: string;
  siren?: string;
  siret?: string;
  secteur?: string;
  taille?: string;
  type_relation?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  site_web?: string;
  tva?: string;
  iban?: string;
  bic?: string;
  banque?: string;
  commentaires?: string;
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

  return useMutation({
    mutationFn: async (data: CreateEntrepriseData) => {
      const { data: entreprise, error } = await supabase
        .from('entreprises')
        .insert([data])
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
