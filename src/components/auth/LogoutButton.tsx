
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LogoutButton() {
  const { signOut, user, userRole } = useAuth();

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user) return "?";
    
    const fullName = user.user_metadata.full_name as string || "";
    if (!fullName) return user.email?.charAt(0).toUpperCase() || "?";
    
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  };

  // Formatter le rôle pour l'affichage
  const formatRole = (role: string | null) => {
    if (!role) return "Employé";
    
    const roleMap: Record<string, string> = {
      'super_admin': 'Super Admin',
      'admin': 'Administrateur',
      'manager': 'Manager',
      'employee': 'Employé'
    };
    
    return roleMap[role] || role;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block">{user?.user_metadata.full_name || user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuItem disabled className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <div className="flex flex-col">
            <span>{user?.user_metadata.full_name || user?.email}</span>
            <span className="text-xs text-muted-foreground">{formatRole(userRole)}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
