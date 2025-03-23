
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
  ChevronRight,
  Building
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
    <SidebarComponent className="transition-all duration-300 ease-in-out border-r border-sidebar-border shadow-sm bg-[#1a202c] text-white">
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {!collapsed && (
            <div className="flex items-center animate-fade-in">
              <img 
                src="/lovable-uploads/5bf70fa7-08a9-4818-b349-27239b6e83cf.png" 
                alt="EIFFAGE" 
                className="h-6 mr-1"
              />
              <span className="font-semibold text-lg text-white">
                RH
              </span>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center animate-fade-in p-1 rounded-lg">
              <img 
                src="/lovable-uploads/5bf70fa7-08a9-4818-b349-27239b6e83cf.png" 
                alt="EIFFAGE" 
                className="h-6"
              />
            </div>
          )}
        </div>
        
        {!isMobile && (
          <button 
            onClick={toggleSidebar}
            className="text-white hover:text-blue-300 transition-colors bg-slate-700/50 p-1 rounded-md hover:bg-slate-700"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn("text-xs uppercase tracking-wider text-gray-400 px-4 pt-4", collapsed && "sr-only")}>
            NAVIGATION PRINCIPALE
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2 px-2">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 my-1",
                        isActive
                          ? "text-white bg-blue-600"
                          : "text-gray-300 hover:text-white hover:bg-blue-600/90",
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
      
      <SidebarFooter className="px-4 py-3 border-t border-slate-700/50 mt-auto">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <span className="text-xs font-semibold">AD</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Administrateur</span>
              <span className="text-xs text-gray-400">Admin</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
