import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReclamations } from "@/hooks/useReclamations";
import { Loader2, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusColors = {
  prise_en_compte: "bg-yellow-100 text-yellow-800",
  en_cours: "bg-blue-100 text-blue-800",
  traitee: "bg-green-100 text-green-800",
  rejetee: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  prise_en_compte: "Prise en compte",
  en_cours: "En cours",
  traitee: "Traitée",
  rejetee: "Rejetée",
};

const statusIcons = {
  prise_en_compte: Clock,
  en_cours: AlertTriangle,
  traitee: CheckCircle,
  rejetee: XCircle,
};

export default function Reclamations() {
  const { data: reclamations, isLoading, error } = useReclamations();

  const reclamationsPrisesEnCompte = reclamations?.filter(r => r.statut === 'prise_en_compte').length || 0;
  const reclamationsEnCours = reclamations?.filter(r => r.statut === 'en_cours').length || 0;
  const reclamationsTraitees = reclamations?.filter(r => r.statut === 'traitee').length || 0;

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
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">Erreur lors du chargement des réclamations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Réclamations</h1>
          <p className="text-muted-foreground">Gérez les réclamations et suivez leur traitement</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prises en compte</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reclamationsPrisesEnCompte}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reclamationsEnCours}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traitées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reclamationsTraitees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reclamations?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des réclamations</CardTitle>
          <CardDescription>
            Toutes les réclamations et leur statut de traitement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Thème</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reclamations?.map((reclamation) => {
                const StatusIcon = statusIcons[reclamation.statut as keyof typeof statusIcons] || Clock;
                return (
                  <TableRow key={reclamation.id}>
                    <TableCell className="font-medium">{reclamation.numero_reclamation}</TableCell>
                    <TableCell>
                      {reclamation.contacts ? 
                        `${reclamation.contacts.nom} ${reclamation.contacts.prenom || ''}`.trim() :
                        reclamation.entreprises?.raison_sociale || '-'
                      }
                    </TableCell>
                    <TableCell>{reclamation.theme || '-'}</TableCell>
                    <TableCell>{reclamation.type_theme || '-'}</TableCell>
                    <TableCell>
                      {reclamation.created_at ? 
                        format(new Date(reclamation.created_at), 'dd/MM/yyyy', { locale: fr }) : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={statusColors[reclamation.statut as keyof typeof statusColors] || statusColors.prise_en_compte}>
                          {statusLabels[reclamation.statut as keyof typeof statusLabels] || reclamation.statut}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{reclamation.description || '-'}</TableCell>
                  </TableRow>
                );
              })}
              {(!reclamations || reclamations.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune réclamation trouvée
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