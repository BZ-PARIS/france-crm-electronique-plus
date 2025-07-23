import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateCatalogueItem } from "@/hooks/useCatalogue";
import { Plus } from "lucide-react";

const catalogueSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  reference: z.string().min(1, "La référence est requise"),
  classification: z.string().optional(),
  prix_unitaire_ht: z.number().min(0, "Le prix doit être positif").optional(),
  fiche_produit: z.string().optional(),
  lien_pdf: z.string().url("URL invalide").optional().or(z.literal("")),
  statut: z.string().optional(),
  commentaires: z.string().optional(),
});

type CatalogueFormData = z.infer<typeof catalogueSchema>;

export function CatalogueForm() {
  const [open, setOpen] = useState(false);
  const { mutate: createItem, isPending } = useCreateCatalogueItem();

  const form = useForm<CatalogueFormData>({
    resolver: zodResolver(catalogueSchema),
    defaultValues: {
      nom: "",
      description: "",
      reference: "",
      classification: "",
      prix_unitaire_ht: undefined,
      fiche_produit: "",
      lien_pdf: "",
      statut: "actif",
      commentaires: "",
    },
  });

  const onSubmit = (data: CatalogueFormData) => {
    const cleanData = {
      nom: data.nom,
      reference: data.reference,
      description: data.description || undefined,
      classification: data.classification || undefined,
      prix_unitaire_ht: data.prix_unitaire_ht || undefined,
      fiche_produit: data.fiche_produit || undefined,
      lien_pdf: data.lien_pdf || undefined,
      statut: data.statut || "actif",
      commentaires: data.commentaires || undefined,
    };

    createItem(cleanData, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau produit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence *</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="classification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classification</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Électronique, Service..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prix_unitaire_ht"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix unitaire HT (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fiche_produit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiche produit</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Description technique..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lien_pdf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien PDF</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Création..." : "Créer le produit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}