import { Entreprise } from "@/hooks/useEntreprises";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EntrepriseDetailsDialogProps {
  entreprise: Entreprise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EntrepriseDetailsDialog({ entreprise, open, onOpenChange }: EntrepriseDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Détails de l'entreprise</DialogTitle>
        </DialogHeader>
        {entreprise && (
          <div className="space-y-2">
            <div><strong>Raison sociale:</strong> {entreprise.raison_sociale}</div>
            {entreprise.secteur && <div><strong>Secteur:</strong> {entreprise.secteur}</div>}
            {entreprise.adresse && (
              <div>
                <strong>Adresse:</strong> {entreprise.adresse}
              </div>
            )}
            {(entreprise.code_postal || entreprise.ville) && (
              <div>
                <strong>Ville:</strong> {entreprise.code_postal} {entreprise.ville}
              </div>
            )}
            {entreprise.site_web && <div><strong>Site web:</strong> {entreprise.site_web}</div>}
            {entreprise.commentaires && <div><strong>Commentaires:</strong> {entreprise.commentaires}</div>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
