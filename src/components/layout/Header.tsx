
import { useState } from "react";
import { Bell, Search, Moon, Sun, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "Vous n'avez pas de nouvelles notifications",
    });
  };

  return (
    <header className="h-16 border-b border-border/70 backdrop-blur-sm bg-background/80 sticky top-0 z-10 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/5bf70fa7-08a9-4818-b349-27239b6e83cf.png" 
          alt="EIFFAGE" 
          className="h-10 mr-4"
        />
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            type="search" 
            placeholder="Rechercher..." 
            className="pl-10 h-9 bg-secondary/80 border-none w-full rounded-full" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          onClick={handleNotificationClick}
        >
          <Bell size={18} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          onClick={toggleTheme}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 font-normal rounded-full hover:bg-secondary/80">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-sm">
                <span className="text-xs font-semibold">AD</span>
              </div>
              <span className="hidden sm:inline">Administrateur</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
