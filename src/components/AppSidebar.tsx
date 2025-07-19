import { 
  Users, 
  Building2, 
  Phone, 
  Package, 
  FileText, 
  Wrench, 
  CreditCard, 
  Banknote,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Home,
  Settings
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Tableau de bord", url: "/", icon: Home },
  { title: "Collaborateurs", url: "/collaborateurs", icon: Users },
  { title: "Contacts", url: "/contacts", icon: Phone },
  { title: "Entreprises", url: "/entreprises", icon: Building2 },
  { title: "Catalogue", url: "/catalogue", icon: Package },
  { title: "Devis", url: "/devis", icon: FileText },
  { title: "Prestations", url: "/prestations", icon: Wrench },
  { title: "Factures", url: "/factures", icon: CreditCard },
  { title: "Paiements", url: "/paiements", icon: Banknote },
  { title: "Tâches", url: "/taches", icon: CheckSquare },
  { title: "Réclamations", url: "/reclamations", icon: AlertTriangle },
  { title: "KPI", url: "/kpi", icon: BarChart3 },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`)
  
  // Custom NavLink class function to handle active state styling
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
      : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"

  return (
    <Sidebar
      className={state === "collapsed" ? "w-[3rem]" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-3">
          {state !== "collapsed" && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">CRM Pro</h1>
              <p className="text-xs text-sidebar-foreground/70">Gestion complète</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={isActive("/settings")}
              tooltip="Paramètres"
            >
              <NavLink to="/settings" className={getNavClass}>
                <Settings className="size-4" />
                <span>Paramètres</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
