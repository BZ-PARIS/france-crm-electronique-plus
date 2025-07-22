import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Building2,
  MapPin,
  Globe,
  Users,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  Handshake,
  Truck,
  CircleDollarSign,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { useEntreprises } from "@/hooks/useEntreprises"
import { EntrepriseForm } from "@/components/forms/EntrepriseForm"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Entreprises() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSecteur, setFilterSecteur] = useState("all")

  const { data: entreprises = [], isLoading, error } = useEntreprises()

  const getTypeBadge = (type: string | undefined) => {
    switch (type) {
      case "client":
        return <Badge variant="default" className="bg-success text-success-foreground"><Briefcase className="w-3 h-3 mr-1" />Client</Badge>
      case "prospect":
        return <Badge variant="default" className="bg-info text-info-foreground"><Handshake className="w-3 h-3 mr-1" />Prospect</Badge>
      case "fournisseur":
        return <Badge variant="default" className="bg-warning text-warning-foreground"><Truck className="w-3 h-3 mr-1" />Fournisseur</Badge>
      default:
        return <Badge variant="outline">Non défini</Badge>
    }
  }

  const getTailleLabel = (taille: string | undefined) => {
    if (!taille) return "Non définie"
    const tailles: Record<string, string> = {
      "grande": "Grande entreprise",
      "moyenne": "ETI",
      "pme": "PME",
      "petite": "TPE"
    }
    return tailles[taille] || taille
  }

  const getSecteurLabel = (secteur: string | undefined) => {
    if (!secteur) return "Non défini"
    const secteurs: Record<string, string> = {
      "industrie": "Industrie",
      "tech": "Technologie",
      "services": "Services",
      "transport": "Transport",
      "commerce": "Commerce",
      "construction": "Construction",
      "autres": "Autres"
    }
    return secteurs[secteur] || secteur
  }

  const filteredEntreprises = entreprises?.filter(entreprise => {
    const matchesSearch = 
      entreprise.raison_sociale?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entreprise.siren?.includes(searchQuery) ||
      entreprise.siret?.includes(searchQuery) ||
      entreprise.ville?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === "all" || entreprise.type_relation === filterType
    const matchesSecteur = filterSecteur === "all" || entreprise.secteur === filterSecteur
    
    return matchesSearch && matchesType && matchesSecteur
  }) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des entreprises: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Entreprises</h1>
          <p className="text-muted-foreground">
            Gérez vos clients, prospects et fournisseurs
          </p>
        </div>
        <EntrepriseForm />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total entreprises</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entreprises.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Briefcase className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entreprises.filter(e => e.type_relation === "client").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
            <Handshake className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entreprises.filter(e => e.type_relation === "prospect").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fournisseurs</CardTitle>
            <Truck className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entreprises.filter(e => e.type_relation === "fournisseur").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des entreprises</CardTitle>
              <CardDescription>
                {filteredEntreprises.length} entreprise(s) affichée(s)
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
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="fournisseur">Fournisseur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSecteur} onValueChange={setFilterSecteur}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  <SelectItem value="industrie">Industrie</SelectItem>
                  <SelectItem value="tech">Technologie</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEntreprises.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Aucune entreprise trouvée
              </h3>
              <p className="text-sm text-muted-foreground">
                {entreprises.length === 0 
                  ? "Ajoutez votre première entreprise pour commencer" 
                  : "Essayez de modifier vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>SIREN/SIRET</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Secteur</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntreprises.map((entreprise) => (
                  <TableRow key={entreprise.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entreprise.raison_sociale}</div>
                        {entreprise.site_web && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Globe className="w-3 h-3 mr-1" />
                            {entreprise.site_web.replace(/^https?:\/\//, '')}
                          </div>
                        )}
                        {entreprise.tva && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CircleDollarSign className="w-3 h-3 mr-1" />
                            TVA: {entreprise.tva}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {entreprise.siren && (
                        <div className="text-sm">SIREN: {entreprise.siren}</div>
                      )}
                      {entreprise.siret && (
                        <div className="text-sm">SIRET: {entreprise.siret}</div>
                      )}
                      {!entreprise.siren && !entreprise.siret && (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getTypeBadge(entreprise.type_relation)}</TableCell>
                    <TableCell>
                      <div>
                        <div>{getSecteurLabel(entreprise.secteur)}</div>
                        <div className="text-sm text-muted-foreground">{getTailleLabel(entreprise.taille)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {entreprise.ville || entreprise.code_postal ? (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <div>
                            <div className="text-sm">
                              {entreprise.code_postal} {entreprise.ville}
                            </div>
                            {entreprise.adresse && (
                              <div className="text-xs text-muted-foreground">
                                {entreprise.adresse}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entreprise.created_at 
                        ? new Date(entreprise.created_at).toLocaleDateString('fr-FR')
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
  )
}
