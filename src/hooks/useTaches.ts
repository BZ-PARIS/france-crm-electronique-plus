import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Tache {
  id: string;
  nom: string;
  reference: string;
  description?: string;
  statut?: "a_faire" | "en_cours" | "terminee" | "annulee";
  date_debut?: string;
  date_echeance?: string;
  date_fin?: string;
  collaborateur_id?: string;
  commentaires?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTacheData {
  nom: string;
  reference: string;
  description?: string;
  statut?: "a_faire" | "en_cours" | "terminee" | "annulee";
  date_debut?: string;
  date_echeance?: string;
  date_fin?: string;
  collaborateur_id?: string;
  commentaires?: string;
}

export function useTaches() {
  return useQuery({
    queryKey: ["taches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("taches")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tache[];
    },
  });
}

export function useCreateTache() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateTacheData) => {
      const { data: result, error } = await supabase
        .from("taches")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taches"] });
      toast({
        title: "Tâche créée",
        description: "La tâche a été créée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la tâche.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTache() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Tache> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("taches")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taches"] });
      toast({
        title: "Tâche modifiée",
        description: "La tâche a été modifiée avec succès.",
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