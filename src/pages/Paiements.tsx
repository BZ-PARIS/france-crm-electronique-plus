import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePaiements } from "@/hooks/usePaiements";
import { Loader2, Euro, CreditCard, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusColors = {
  en_attente: "bg-yellow-100 text-yellow-800",
  recu: "bg-green-100 text-green-800",
  rapproche: "bg-blue-100 text-blue-800",
};

const statusLabels = {
  en_attente: "En attente",
  recu: "Reçu",
  rapproche: "Rapproché",
};

export default function Paiements() {
  const { data: paiements, isLoading, error } = usePaiements();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const totalPaiements = paiements?.reduce((sum, p) => sum + (p.montant || 0), 0) || 0;
  const paiementsEnAttente = paiements?.filter(p => p.statut === 'en_attente').length || 0;
  const paiementsRecus = paiements?.filter(p => p.statut === 'recu').length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">Erreur lors du chargement des paiements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Paiements</h1>
          <p className="text-muted-foreground">Gérez vos paiements et suivez leur statut</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paiements</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaiements)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paiementsEnAttente}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reçus</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paiementsRecus}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paiements?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des paiements</CardTitle>
          <CardDescription>
            Tous vos paiements et leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Reste à payer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paiements?.map((paiement) => (
                <TableRow key={paiement.id}>
                  <TableCell className="font-medium">{paiement.reference_paiement}</TableCell>
                  <TableCell>
                    {paiement.contacts ? 
                      `${paiement.contacts.nom} ${paiement.contacts.prenom || ''}`.trim() :
                      paiement.entreprises?.raison_sociale || '-'
                    }
                  </TableCell>
                  <TableCell>
                    {paiement.date_paiement ? 
                      format(new Date(paiement.date_paiement), 'dd/MM/yyyy', { locale: fr }) : 
                      '-'
                    }
                  </TableCell>
                  <TableCell>
                    {paiement.montant ? formatCurrency(paiement.montant) : '-'}
                  </TableCell>
                  <TableCell>{paiement.type_paiement || '-'}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[paiement.statut as keyof typeof statusColors] || statusColors.en_attente}>
                      {statusLabels[paiement.statut as keyof typeof statusLabels] || paiement.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {paiement.reste_a_payer ? formatCurrency(paiement.reste_a_payer) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {(!paiements || paiements.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun paiement trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}