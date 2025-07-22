import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, Package, Euro, MoreHorizontal, Eye, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useCatalogue } from "@/hooks/useCatalogue";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Catalogue() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClassification, setFilterClassification] = useState("all");

  const { data: catalogueItems = [], isLoading, error } = useCatalogue();

  const getStatusBadge = (statut: string | undefined) => {
    switch (statut) {
      case "actif":
        return <Badge variant="default" className="bg-success text-success-foreground">Actif</Badge>;
      case "inactif":
        return <Badge variant="secondary">Inactif</Badge>;
      case "archive":
        return <Badge variant="outline">Archivé</Badge>;
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

  const filteredItems = catalogueItems?.filter((item) => {
    const matchesSearch =
      item.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || item.statut === filterStatus;
    const matchesClassification = filterClassification === "all" || item.classification === filterClassification;

    return matchesSearch && matchesStatus && matchesClassification;
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
            Erreur lors du chargement du catalogue: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Catalogue</h1>
          <p className="text-muted-foreground">
            Gérez vos produits et services
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{catalogueItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits actifs</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {catalogueItems.filter(item => item.statut === "actif").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prix moyen</CardTitle>
            <Euro className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                catalogueItems.reduce((sum, item) => sum + (item.prix_unitaire_ht || 0), 0) / 
                catalogueItems.filter(item => item.prix_unitaire_ht).length || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classifications</CardTitle>
            <Package className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(catalogueItems.map(item => item.classification).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des produits</CardTitle>
              <CardDescription>
                {filteredItems.length} produit(s) affiché(s)
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
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="archive">Archivé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterClassification} onValueChange={setFilterClassification}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="produit">Produit</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="licence">Licence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-sm text-muted-foreground">
                {catalogueItems.length === 0 
                  ? "Ajoutez votre premier produit pour commencer" 
                  : "Essayez de modifier vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Prix unitaire HT</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.nom}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{item.reference}</TableCell>
                    <TableCell>
                      {item.classification ? (
                        <Badge variant="outline">{item.classification}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(item.prix_unitaire_ht)}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.statut)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.created_at 
                        ? new Date(item.created_at).toLocaleDateString('fr-FR')
                        : "-"
                      }
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