import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CatalogueItem {
  id: string;
  nom: string;
  description?: string;
  reference: string;
  classification?: string;
  prix_unitaire_ht?: number;
  fiche_produit?: string;
  lien_pdf?: string;
  statut?: string;
  commentaires?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCatalogueData {
  nom: string;
  description?: string;
  reference: string;
  classification?: string;
  prix_unitaire_ht?: number;
  fiche_produit?: string;
  lien_pdf?: string;
  statut?: string;
  commentaires?: string;
}

export function useCatalogue() {
  return useQuery({
    queryKey: ["catalogue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalogue")
        .select("*")
        .order("nom");

      if (error) throw error;
      return data as CatalogueItem[];
    },
  });
}

export function useCreateCatalogueItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateCatalogueData) => {
      const { data: result, error } = await supabase
        .from("catalogue")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogue"] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté au catalogue avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du produit.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCatalogueItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<CatalogueItem> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("catalogue")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogue"] });
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la modification.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCatalogueItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("catalogue")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogue"] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé du catalogue.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    },
  });
}