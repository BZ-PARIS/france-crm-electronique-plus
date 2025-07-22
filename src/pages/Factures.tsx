import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";

export default function Factures() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Factures</h1>
          <p className="text-muted-foreground">Gérez vos factures et encaissements</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Module Factures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Interface de gestion des factures prête à être développée.
            Fonctionnalités à implémenter : création, envoi, suivi des paiements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}