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
  User,
  UserCheck,
  Users,
  Edit,
  Trash2,
  Eye
} from "lucide-react"

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Données d'exemple
  const contacts = [
    {
      id: 1,
      nom: "Martin",
      prenom: "Jean",
      email: "jean.martin@acme-corp.fr",
      telephone: "01 23 45 67 89",
      type: "entreprise",
      entreprise: "ACME Corporation",
      fonction: "Directeur Général",
      statut: "actif",
      source: "prospection",
      tags: ["VIP", "Décideur"],
      dateAjout: "2024-01-15",
      derniereInteraction: "2024-01-10"
    },
    {
      id: 2,
      nom: "Durand",
      prenom: "Marie",
      email: "marie.durand@techstart.fr",
      telephone: "06 12 34 56 78",
      type: "entreprise",
      entreprise: "TechStart SARL",
      fonction: "Responsable Achats",
      statut: "prospect",
      source: "site_web",
      tags: ["Nouveau"],
      dateAjout: "2024-01-12",
      derniereInteraction: "2024-01-08"
    },
    {
      id: 3,
      nom: "Blanc",
      prenom: "Pierre",
      email: "pierre.blanc@gmail.com",
      telephone: "07 98 76 54 32",
      type: "particulier",
      entreprise: null,
      fonction: null,
      statut: "actif",
      source: "recommandation",
      tags: ["Particulier"],
      dateAjout: "2024-01-08",
      derniereInteraction: "2024-01-05"
    },
    {
      id: 4,
      nom: "Garcia",
      prenom: "Anna",
      email: "a.garcia@design-studio.com",
      telephone: "01 45 67 89 12",
      type: "entreprise",
      entreprise: "Design Studio",
      fonction: "Chef de projet",
      statut: "inactif",
      source: "salon",
      tags: ["Design", "Créatif"],
      dateAjout: "2024-01-05",
      derniereInteraction: "2023-12-20"
    }
  ]

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return <Badge variant="default" className="bg-success text-success-foreground">Actif</Badge>
      case "prospect":
        return <Badge variant="default" className="bg-info text-info-foreground">Prospect</Badge>
      case "inactif":
        return <Badge variant="secondary">Inactif</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "entreprise":
        return <Badge variant="outline"><Building2 className="w-3 h-3 mr-1" />Entreprise</Badge>
      case "particulier":
        return <Badge variant="outline"><User className="w-3 h-3 mr-1" />Particulier</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  const getSourceLabel = (source: string) => {
    const sources: Record<string, string> = {
      "prospection": "Prospection",
      "site_web": "Site web",
      "recommandation": "Recommandation",
      "salon": "Salon",
      "publicite": "Publicité",
      "autres": "Autres"
    }
    return sources[source] || source
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.entreprise?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === "all" || contact.type === filterType
    const matchesStatus = filterStatus === "all" || contact.statut === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">
            Gérez vos contacts clients, prospects et partenaires
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.statut === "actif").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
            <User className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.statut === "prospect").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entreprises</CardTitle>
            <Building2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.type === "entreprise").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des contacts</CardTitle>
              <CardDescription>
                {filteredContacts.length} contact(s) affiché(s)
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
                  <SelectItem value="entreprise">Entreprise</SelectItem>
                  <SelectItem value="particulier">Particulier</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Dernière interaction</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {contact.prenom} {contact.nom}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1" />
                        {contact.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-3 h-3 mr-1" />
                        {contact.telephone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(contact.type)}</TableCell>
                  <TableCell>
                    {contact.entreprise ? (
                      <div>
                        <div className="font-medium">{contact.entreprise}</div>
                        {contact.fonction && (
                          <div className="text-sm text-muted-foreground">
                            {contact.fonction}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(contact.statut)}</TableCell>
                  <TableCell>{getSourceLabel(contact.source)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(contact.derniereInteraction).toLocaleDateString('fr-FR')}
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