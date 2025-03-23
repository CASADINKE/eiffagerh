
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={signOut}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span>Déconnexion</span>
    </Button>
  );
}
