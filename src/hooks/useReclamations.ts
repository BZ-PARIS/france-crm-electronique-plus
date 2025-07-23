import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Reclamation {
  id: string;
  numero_reclamation: string;
  contact_id?: string;
  entreprise_id?: string;
  theme?: string;
  type_theme?: string;
  description?: string;
  statut?: "prise_en_compte" | "en_cours" | "traitee" | "rejetee";
  commentaires?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
  contacts?: { nom: string; prenom?: string };
  entreprises?: { raison_sociale: string };
}

export interface CreateReclamationData {
  numero_reclamation: string;
  contact_id?: string;
  entreprise_id?: string;
  theme?: string;
  type_theme?: string;
  description?: string;
  statut?: "prise_en_compte" | "en_cours" | "traitee" | "rejetee";
  commentaires?: string;
}

export function useReclamations() {
  return useQuery({
    queryKey: ["reclamations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reclamations")
        .select(`
          *,
          contacts(nom, prenom),
          entreprises(raison_sociale)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Reclamation[];
    },
  });
}

export function useCreateReclamation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateReclamationData) => {
      const { data: result, error } = await supabase
        .from("reclamations")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reclamations"] });
      toast({
        title: "Réclamation créée",
        description: "La réclamation a été créée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la réclamation.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateReclamation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Reclamation> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("reclamations")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reclamations"] });
      toast({
        title: "Réclamation modifiée",
        description: "La réclamation a été modifiée avec succès.",
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