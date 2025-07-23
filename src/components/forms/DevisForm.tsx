import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateDevis } from "@/hooks/useDevis";
import { useContacts } from "@/hooks/useContacts";
import { useEntreprises } from "@/hooks/useEntreprises";
import { Plus } from "lucide-react";

const devisSchema = z.object({
  numero_devis: z.string().min(1, "Le numéro de devis est requis"),
  date_emission: z.string().optional(),
  contact_id: z.string().optional(),
  entreprise_id: z.string().optional(),
  statut: z.enum(["brouillon", "envoye", "accepte", "refuse", "expire"]).default("brouillon"),
  montant_ht: z.number().min(0, "Le montant doit être positif").optional(),
  montant_tva: z.number().min(0, "Le montant doit être positif").optional(),
  montant_ttc: z.number().min(0, "Le montant doit être positif").optional(),
  canal_acquisition: z.string().optional(),
  commentaires: z.string().optional(),
});

type DevisFormData = z.infer<typeof devisSchema>;

export function DevisForm() {
  const [open, setOpen] = useState(false);
  const { mutate: createDevis, isPending } = useCreateDevis();
  const { data: contacts } = useContacts();
  const { data: entreprises } = useEntreprises();

  const form = useForm<DevisFormData>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      numero_devis: "",
      date_emission: new Date().toISOString().split('T')[0],
      contact_id: "",
      entreprise_id: "",
      statut: "brouillon",
      montant_ht: undefined,
      montant_tva: undefined,
      montant_ttc: undefined,
      canal_acquisition: "",
      commentaires: "",
    },
  });

  const onSubmit = (data: DevisFormData) => {
    const cleanData = {
      numero_devis: data.numero_devis,
      date_emission: data.date_emission || undefined,
      contact_id: data.contact_id || undefined,
      entreprise_id: data.entreprise_id || undefined,
      statut: data.statut,
      montant_ht: data.montant_ht || undefined,
      montant_tva: data.montant_tva || undefined,
      montant_ttc: data.montant_ttc || undefined,
      canal_acquisition: data.canal_acquisition || undefined,
      commentaires: data.commentaires || undefined,
    };

    createDevis(cleanData, {
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
          Nouveau devis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau devis</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero_devis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de devis *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="DEV-2024-001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_emission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'émission</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un contact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts?.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {`${contact.nom} ${contact.prenom || ''}`.trim()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entreprise_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entreprises?.map((entreprise) => (
                          <SelectItem key={entreprise.id} value={entreprise.id}>
                            {entreprise.raison_sociale}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="brouillon">Brouillon</SelectItem>
                      <SelectItem value="envoye">Envoyé</SelectItem>
                      <SelectItem value="accepte">Accepté</SelectItem>
                      <SelectItem value="refuse">Refusé</SelectItem>
                      <SelectItem value="expire">Expiré</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="montant_ht"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant HT (€)</FormLabel>
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
              <FormField
                control={form.control}
                name="montant_tva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant TVA (€)</FormLabel>
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
              <FormField
                control={form.control}
                name="montant_ttc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant TTC (€)</FormLabel>
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

            <FormField
              control={form.control}
              name="canal_acquisition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canal d'acquisition</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Site web, Référencement..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isPending ? "Création..." : "Créer le devis"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}