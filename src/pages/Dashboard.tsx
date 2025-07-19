import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Building2, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro
} from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Contacts actifs",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Entreprises",
      value: "156",
      change: "+3%",
      trend: "up",
      icon: Building2,
      color: "text-accent"
    },
    {
      title: "Devis en cours",
      value: "23",
      change: "-5%",
      trend: "down",
      icon: FileText,
      color: "text-warning"
    },
    {
      title: "CA mensuel",
      value: "187.2k €",
      change: "+18%",
      trend: "up",
      icon: Euro,
      color: "text-success"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "Devis accepté",
      client: "ACME Corporation",
      amount: "15,750 €",
      status: "success",
      time: "Il y a 2h"
    },
    {
      id: 2,
      type: "Nouvelle entreprise",
      client: "TechStart SARL",
      amount: null,
      status: "info",
      time: "Il y a 4h"
    },
    {
      id: 3,
      type: "Facture impayée",
      client: "Design Studio",
      amount: "8,500 €",
      status: "warning",
      time: "Il y a 1j"
    },
    {
      id: 4,
      type: "Prestation terminée",
      client: "Global Industries",
      amount: "25,200 €",
      status: "success",
      time: "Il y a 2j"
    }
  ]

  const tasksPriority = [
    { task: "Relance client ABC Corp", priority: "high", deadline: "Aujourd'hui" },
    { task: "Préparer devis renovation", priority: "medium", deadline: "Demain" },
    { task: "Formation équipe", priority: "low", deadline: "Cette semaine" },
    { task: "Audit qualité", priority: "high", deadline: "Vendredi" }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "info":
        return <Clock className="h-4 w-4 text-info" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Urgent</Badge>
      case "medium":
        return <Badge variant="secondary">Moyen</Badge>
      case "low":
        return <Badge variant="outline">Faible</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre activité commerciale
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <TrendingUp className={`h-3 w-3 ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`} />
                  <span className={
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }>
                    {stat.change}
                  </span>
                  <span>par rapport au mois dernier</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Dernières actions importantes dans votre CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="text-sm font-medium">{activity.type}</p>
                      <p className="text-xs text-muted-foreground">{activity.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="text-sm font-medium">{activity.amount}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tâches prioritaires</CardTitle>
            <CardDescription>
              Actions à traiter en priorité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasksPriority.map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{task.task}</p>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground">{task.deadline}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Objectifs mensuels</CardTitle>
            <CardDescription>
              Progression vers vos objectifs commerciaux
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Chiffre d'affaires</span>
                <span>187.2k € / 250k €</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nouveaux clients</span>
                <span>12 / 15</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Devis convertis</span>
                <span>23 / 30</span>
              </div>
              <Progress value={77} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des factures</CardTitle>
            <CardDescription>
              Répartition de vos factures par statut
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm">Payées</span>
              </div>
              <span className="text-sm font-medium">145,750 €</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-sm">En attente</span>
              </div>
              <span className="text-sm font-medium">32,100 €</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-sm">En retard</span>
              </div>
              <span className="text-sm font-medium">8,500 €</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
