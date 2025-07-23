import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, FileText, Euro, Calendar, MoreHorizontal, Eye, Edit, Trash2, Loader2, AlertTriangle, Send, Download } from "lucide-react";
import { useDevis } from "@/hooks/useDevis";
import { DevisForm } from "@/components/forms/DevisForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Devis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  const { data: devis = [], isLoading, error } = useDevis();

  const getStatusBadge = (statut: string | undefined) => {
    switch (statut) {
      case "brouillon":
        return <Badge variant="secondary">Brouillon</Badge>;
      case "envoye":
        return <Badge variant="default" className="bg-info text-info-foreground">Envoyé</Badge>;
      case "accepte":
        return <Badge variant="default" className="bg-success text-success-foreground">Accepté</Badge>;
      case "refuse":
        return <Badge variant="destructive">Refusé</Badge>;
      case "expire":
        return <Badge variant="outline">Expiré</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const filteredDevis = devis?.filter((item) => {
    const matchesSearch =
      item.numero_devis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contacts?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entreprises?.raison_sociale?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || item.statut === filterStatus;

    // Filter by period (last 30 days, 3 months, etc.)
    let matchesPeriod = true;
    if (filterPeriod !== "all" && item.date_emission) {
      const devisDate = new Date(item.date_emission);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - devisDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filterPeriod) {
        case "30days":
          matchesPeriod = diffDays <= 30;
          break;
        case "3months":
          matchesPeriod = diffDays <= 90;
          break;
        case "6months":
          matchesPeriod = diffDays <= 180;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesPeriod;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des devis: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalMontant = devis.reduce((sum, item) => sum + (item.montant_ttc || 0), 0);
  const acceptedDevis = devis.filter(item => item.statut === "accepte");
  const pendingDevis = devis.filter(item => item.statut === "envoye");
  const conversionRate = devis.length > 0 ? (acceptedDevis.length / devis.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Devis</h1>
          <p className="text-muted-foreground">
            Gérez vos devis et propositions commerciales
          </p>
        </div>
        <DevisForm />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total devis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devis.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
            <Euro className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalMontant)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDevis.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux conversion</CardTitle>
            <FileText className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des devis</CardTitle>
              <CardDescription>
                {filteredDevis.length} devis affiché(s)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="brouillon">Brouillon</SelectItem>
                  <SelectItem value="envoye">Envoyé</SelectItem>
                  <SelectItem value="accepte">Accepté</SelectItem>
                  <SelectItem value="refuse">Refusé</SelectItem>
                  <SelectItem value="expire">Expiré</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="30days">30 derniers jours</SelectItem>
                  <SelectItem value="3months">3 derniers mois</SelectItem>
                  <SelectItem value="6months">6 derniers mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDevis.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Aucun devis trouvé
              </h3>
              <p className="text-sm text-muted-foreground">
                {devis.length === 0 
                  ? "Créez votre premier devis pour commencer" 
                  : "Essayez de modifier vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date d'émission</TableHead>
                  <TableHead>Montant TTC</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevis.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono font-medium">
                      {item.numero_devis}
                    </TableCell>
                    <TableCell>
                      <div>
                        {item.entreprises?.raison_sociale && (
                          <div className="font-medium">{item.entreprises.raison_sociale}</div>
                        )}
                        {item.contacts && (
                          <div className="text-sm text-muted-foreground">
                            {item.contacts.nom} {item.contacts.prenom}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.date_emission 
                        ? new Date(item.date_emission).toLocaleDateString('fr-FR')
                        : "-"
                      }
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(item.montant_ttc)}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.statut)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.canal_acquisition || "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}