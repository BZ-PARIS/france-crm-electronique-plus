import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Paiement {
  id: string;
  reference_paiement: string;
  facture_id?: string;
  contact_id?: string;
  entreprise_id?: string;
  statut?: "en_attente" | "recu" | "rapproche";
  montant?: number;
  date_paiement?: string;
  reste_a_payer?: number;
  type_paiement?: string;
  commentaires?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
  contacts?: { nom: string; prenom?: string };
  entreprises?: { raison_sociale: string };
}

export interface CreatePaiementData {
  reference_paiement: string;
  facture_id?: string;
  contact_id?: string;
  entreprise_id?: string;
  statut?: "en_attente" | "recu" | "rapproche";
  montant?: number;
  date_paiement?: string;
  reste_a_payer?: number;
  type_paiement?: string;
  commentaires?: string;
}

export function usePaiements() {
  return useQuery({
    queryKey: ["paiements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paiements")
        .select(`
          *,
          contacts(nom, prenom),
          entreprises(raison_sociale)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Paiement[];
    },
  });
}

export function useCreatePaiement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreatePaiementData) => {
      const { data: result, error } = await supabase
        .from("paiements")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paiements"] });
      toast({
        title: "Paiement créé",
        description: "Le paiement a été créé avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du paiement.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePaiement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Paiement> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("paiements")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paiements"] });
      toast({
        title: "Paiement modifié",
        description: "Le paiement a été modifié avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la modification.",
        variant: "destructive",
      });
    },
  });
}