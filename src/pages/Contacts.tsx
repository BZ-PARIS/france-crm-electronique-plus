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
  Mail,
  Phone,
  Building2,
  User,
  UserCheck,
  Users,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { useContacts } from "@/hooks/useContacts"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const { data: contacts = [], isLoading, error } = useContacts()

  const getStatusBadge = (statut: string | undefined) => {
    switch (statut) {
      case "actif":
        return <Badge variant="default" className="bg-success text-success-foreground">Actif</Badge>
      case "prospect":
        return <Badge variant="default" className="bg-info text-info-foreground">Prospect</Badge>
      case "inactif":
        return <Badge variant="secondary">Inactif</Badge>
      default:
        return <Badge variant="outline">Non défini</Badge>
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

  const getSourceLabel = (source: string | undefined) => {
    if (!source) return "Non défini"
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

  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = 
      contact.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === "all" || contact.type === filterType
    const matchesStatus = filterStatus === "all" || contact.statut === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
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
            Erreur lors du chargement des contacts: {error.message}
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
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Aucun contact trouvé
              </h3>
              <p className="text-sm text-muted-foreground">
                {contacts.length === 0 
                  ? "Ajoutez votre premier contact pour commencer" 
                  : "Essayez de modifier vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Date d'ajout</TableHead>
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
                        {contact.email && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" />
                            {contact.email}
                          </div>
                        )}
                        {contact.telephone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="w-3 h-3 mr-1" />
                            {contact.telephone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(contact.type)}</TableCell>
                    <TableCell>
                      {/* @ts-ignore - entreprises relation */}
                      {contact.entreprises?.raison_sociale ? (
                        <div className="font-medium">
                          {/* @ts-ignore */}
                          {contact.entreprises.raison_sociale}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(contact.statut)}</TableCell>
                    <TableCell>{getSourceLabel(contact.canal_acquisition)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        )) || (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contact.created_at 
                        ? new Date(contact.created_at).toLocaleDateString('fr-FR')
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
