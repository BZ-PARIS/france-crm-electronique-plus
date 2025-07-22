import { Contact } from "@/hooks/useContacts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContactDetailsDialogProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDetailsDialog({ contact, open, onOpenChange }: ContactDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du contact</DialogTitle>
        </DialogHeader>
        {contact && (
          <div className="space-y-2">
            <div><strong>Nom:</strong> {contact.nom}</div>
            {contact.prenom && <div><strong>Prénom:</strong> {contact.prenom}</div>}
            {contact.email && <div><strong>Email:</strong> {contact.email}</div>}
            {contact.telephone && <div><strong>Téléphone:</strong> {contact.telephone}</div>}
            <div><strong>Type:</strong> {contact.type}</div>
            {contact.statut && <div><strong>Statut:</strong> {contact.statut}</div>}
            {contact.canal_acquisition && <div><strong>Canal:</strong> {contact.canal_acquisition}</div>}
            {contact.commentaires && <div><strong>Commentaires:</strong> {contact.commentaires}</div>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
