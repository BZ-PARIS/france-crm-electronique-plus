import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";

export default function Prestations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prestations</h1>
          <p className="text-muted-foreground">Gérez vos prestations et interventions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle prestation
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Module Prestations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Interface de gestion des prestations prête à être développée.
            Fonctionnalités à implémenter : planification, suivi, facturation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}