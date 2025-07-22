import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Devis {
  id: string;
  numero_devis: string;
  date_emission?: string;
  contact_id?: string;
  entreprise_id?: string;
  statut?: "brouillon" | "envoye" | "accepte" | "refuse" | "expire";
  montant_ht?: number;
  montant_tva?: number;
  montant_ttc?: number;
  verrouille?: boolean;
  canal_acquisition?: string;
  commentaires?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
  contacts?: { nom: string; prenom?: string };
  entreprises?: { raison_sociale: string };
}

export interface CreateDevisData {
  numero_devis: string;
  date_emission?: string;
  contact_id?: string;
  entreprise_id?: string;
  statut?: "brouillon" | "envoye" | "accepte" | "refuse" | "expire";
  montant_ht?: number;
  montant_tva?: number;
  montant_ttc?: number;
  canal_acquisition?: string;
  commentaires?: string;
}

export function useDevis() {
  return useQuery({
    queryKey: ["devis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devis")
        .select(`
          *,
          contacts(nom, prenom),
          entreprises(raison_sociale)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Devis[];
    },
  });
}

export function useCreateDevis() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateDevisData) => {
      const { data: result, error } = await supabase
        .from("devis")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devis"] });
      toast({
        title: "Devis créé",
        description: "Le devis a été créé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du devis.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateDevis() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Devis> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("devis")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devis"] });
      toast({
        title: "Devis modifié",
        description: "Le devis a été modifié avec succès.",
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