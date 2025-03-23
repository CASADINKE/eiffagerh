
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users,
  Calendar, 
  DollarSign, 
  Clock, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = [
  { path: "/dashboard", title: "Tableau de bord", icon: LayoutDashboard },
  { path: "/employees", title: "Employés", icon: Users },
  { path: "/leave", title: "Gestion des congés", icon: Calendar },
  { path: "/salary", title: "Paie", icon: DollarSign },
  { path: "/time-tracking", title: "Suivi du temps", icon: Clock },
  { path: "/settings", title: "Paramètres", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <SidebarComponent className="transition-all duration-300 ease-in-out">
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {!collapsed && (
            <span className="font-semibold text-lg text-sidebar-foreground animate-fade-in">
              RH Zénith
            </span>
          )}
          {collapsed && (
            <span className="font-bold text-lg text-primary animate-fade-in">RH</span>
          )}
        </div>
        
        {!isMobile && (
          <button 
            onClick={toggleSidebar}
            className="text-sidebar-foreground hover:text-primary transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
            Navigation principale
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-sidebar-primary-foreground bg-sidebar-primary"
                          : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent",
                        collapsed && "justify-center"
                      )}
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="text-xs font-semibold">AD</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Administrateur</span>
              <span className="text-xs text-sidebar-foreground/70">Admin</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
