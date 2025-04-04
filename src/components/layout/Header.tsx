
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { NotificationsIndicator } from "@/components/notifications/NotificationsIndicator"; 

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 w-full border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">HR Management</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user && <NotificationsIndicator />}
          <ModeToggle />
          {user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
};

export default Header;
