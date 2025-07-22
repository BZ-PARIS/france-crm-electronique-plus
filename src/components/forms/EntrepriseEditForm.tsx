import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Entreprise, useUpdateEntreprise } from "@/hooks/useEntreprises";

const entrepriseSchema = z.object({
  raison_sociale: z.string().min(1, "La raison sociale est requise"),
  siren: z.string().optional(),
  siret: z.string().optional(),
  tva: z.string().optional(),
  adresse: z.string().optional(),
  code_postal: z.string().optional(),
  ville: z.string().optional(),
  site_web: z.string().optional(),
  secteur: z.string().optional(),
  taille: z.string().optional(),
  type_relation: z.string().default("client"),
  banque: z.string().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
  commentaires: z.string().optional(),
});

type EntrepriseFormData = z.infer<typeof entrepriseSchema>;

interface EntrepriseEditFormProps {
  entreprise: Entreprise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EntrepriseEditForm({ entreprise, open, onOpenChange }: EntrepriseEditFormProps) {
  const { mutate: updateEntreprise, isPending } = useUpdateEntreprise();

  const form = useForm<EntrepriseFormData>({
    resolver: zodResolver(entrepriseSchema),
    defaultValues: {
      raison_sociale: "",
      siren: "",
      siret: "",
      tva: "",
      adresse: "",
      code_postal: "",
      ville: "",
      site_web: "",
      secteur: "",
      taille: "",
      type_relation: "client",
      banque: "",
      iban: "",
      bic: "",
      commentaires: "",
    },
  });

  useEffect(() => {
    if (entreprise) {
      form.reset({
        raison_sociale: entreprise.raison_sociale,
        siren: entreprise.siren || "",
        siret: entreprise.siret || "",
        tva: entreprise.tva || "",
        adresse: entreprise.adresse || "",
        code_postal: entreprise.code_postal || "",
        ville: entreprise.ville || "",
        site_web: entreprise.site_web || "",
        secteur: entreprise.secteur || "",
        taille: entreprise.taille || "",
        type_relation: entreprise.type_relation || "client",
        banque: entreprise.banque || "",
        iban: entreprise.iban || "",
        bic: entreprise.bic || "",
        commentaires: entreprise.commentaires || "",
      });
    }
  }, [entreprise, form]);

  const onSubmit = (data: EntrepriseFormData) => {
    if (!entreprise) return;
    const cleanData = {
      raison_sociale: data.raison_sociale,
      type_relation: data.type_relation,
      siren: data.siren || null,
      siret: data.siret || null,
      tva: data.tva || null,
      adresse: data.adresse || null,
      code_postal: data.code_postal || null,
      ville: data.ville || null,
      site_web: data.site_web || null,
      secteur: data.secteur || null,
      taille: data.taille || null,
      banque: data.banque || null,
      iban: data.iban || null,
      bic: data.bic || null,
      commentaires: data.commentaires || null,
    };

    updateEntreprise(
      { id: entreprise.id, ...cleanData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'entreprise</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="raison_sociale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raison sociale *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type_relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de relation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                        <SelectItem value="fournisseur">Fournisseur</SelectItem>
                        <SelectItem value="partenaire">Partenaire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="siren"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIREN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIRET</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° TVA</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code_postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ville"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="site_web"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site web</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secteur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secteur</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="taille"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taille de l'entreprise</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une taille" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tpe">TPE (1-9 salariés)</SelectItem>
                      <SelectItem value="pme">PME (10-249 salariés)</SelectItem>
                      <SelectItem value="eti">ETI (250-4999 salariés)</SelectItem>
                      <SelectItem value="ge">Grande entreprise (5000+ salariés)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="banque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banque</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BIC</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="commentaires"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaires</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Sauvegarde..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
