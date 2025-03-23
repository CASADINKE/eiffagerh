
import { useState, useEffect } from "react";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoutButton } from "@/components/auth/LogoutButton";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Initialize dark theme on component mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleNotificationClick = () => {
    toast.info("Vous n'avez pas de nouvelles notifications");
  };

  return (
    <header className="h-16 border-b border-border backdrop-blur-sm bg-background/90 sticky top-0 z-10 flex items-center justify-between px-6 shadow-sm">
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
            className="pl-10 h-9 bg-secondary border-none w-full rounded-full" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={handleNotificationClick}
        >
          <Bell size={18} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={toggleTheme}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
