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
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
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
  CircleDollarSign
} from "lucide-react"

export default function Entreprises() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSecteur, setFilterSecteur] = useState("all")

  // Données d'exemple
  const entreprises = [
    {
      id: 1,
      raisonSociale: "ACME Corporation",
      siren: "123456789",
      siret: "12345678900001",
      tva: "FR12345678900",
      type: "client",
      secteur: "industrie",
      taille: "grande",
      adresse: "123 Avenue de la République",
      codePostal: "75011",
      ville: "Paris",
      siteWeb: "https://www.acme-corp.fr",
      contacts: 3,
      dateAjout: "2024-01-05",
      tags: ["VIP", "International"]
    },
    {
      id: 2,
      raisonSociale: "TechStart SARL",
      siren: "987654321",
      siret: "98765432100001",
      tva: "FR98765432100",
      type: "prospect",
      secteur: "tech",
      taille: "pme",
      adresse: "45 Rue de l'Innovation",
      codePostal: "69002",
      ville: "Lyon",
      siteWeb: "https://www.techstart.fr",
      contacts: 1,
      dateAjout: "2024-01-10",
      tags: ["Startup"]
    },
    {
      id: 3,
      raisonSociale: "Design Studio",
      siren: "456789123",
      siret: "45678912300001",
      tva: "FR45678912300",
      type: "client",
      secteur: "services",
      taille: "petite",
      adresse: "78 Boulevard des Arts",
      codePostal: "33000",
      ville: "Bordeaux",
      siteWeb: "https://www.design-studio.com",
      contacts: 2,
      dateAjout: "2024-01-08",
      tags: ["Design", "Créatif"]
    },
    {
      id: 4,
      raisonSociale: "Logistique Express",
      siren: "258369147",
      siret: "25836914700001",
      tva: "FR25836914700",
      type: "fournisseur",
      secteur: "transport",
      taille: "moyenne",
      adresse: "12 Route de la Livraison",
      codePostal: "44000",
      ville: "Nantes",
      siteWeb: "https://www.logistique-express.fr",
      contacts: 1,
      dateAjout: "2024-01-12",
      tags: ["Transport"]
    }
  ]

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "client":
        return <Badge variant="default" className="bg-success text-success-foreground"><Briefcase className="w-3 h-3 mr-1" />Client</Badge>
      case "prospect":
        return <Badge variant="default" className="bg-info text-info-foreground"><Handshake className="w-3 h-3 mr-1" />Prospect</Badge>
      case "fournisseur":
        return <Badge variant="default" className="bg-warning text-warning-foreground"><Truck className="w-3 h-3 mr-1" />Fournisseur</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  const getTailleLabel = (taille: string) => {
    const tailles: Record<string, string> = {
      "grande": "Grande entreprise",
      "moyenne": "ETI",
      "pme": "PME",
      "petite": "TPE"
    }
    return tailles[taille] || taille
  }

  const getSecteurLabel = (secteur: string) => {
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

  const filteredEntreprises = entreprises.filter(entreprise => {
    const matchesSearch = 
      entreprise.raisonSociale.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entreprise.siren.includes(searchQuery) ||
      entreprise.siret.includes(searchQuery) ||
      entreprise.ville.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === "all" || entreprise.type === filterType
    const matchesSecteur = filterSecteur === "all" || entreprise.secteur === filterSecteur
    
    return matchesSearch && matchesType && matchesSecteur
  })

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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle entreprise
        </Button>
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
              {entreprises.filter(e => e.type === "client").length}
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
              {entreprises.filter(e => e.type === "prospect").length}
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
              {entreprises.filter(e => e.type === "fournisseur").length}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>SIREN/SIRET</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Secteur</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntreprises.map((entreprise) => (
                <TableRow key={entreprise.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{entreprise.raisonSociale}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Globe className="w-3 h-3 mr-1" />
                        {entreprise.siteWeb.replace(/^https?:\/\//, '')}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CircleDollarSign className="w-3 h-3 mr-1" />
                        TVA: {entreprise.tva}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    <div className="text-sm">SIREN: {entreprise.siren}</div>
                    <div className="text-sm">SIRET: {entreprise.siret}</div>
                  </TableCell>
                  <TableCell>{getTypeBadge(entreprise.type)}</TableCell>
                  <TableCell>
                    <div>
                      <div>{getSecteurLabel(entreprise.secteur)}</div>
                      <div className="text-sm text-muted-foreground">{getTailleLabel(entreprise.taille)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <div>
                        <div className="text-sm">{entreprise.codePostal} {entreprise.ville}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{entreprise.contacts}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {entreprise.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
        </CardContent>
      </Card>
    </div>
  )
}