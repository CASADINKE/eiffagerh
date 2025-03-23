
import { cn } from "@/lib/utils";
import { MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmployeeUI } from "@/types/employee";

interface EmployeeCardProps {
  employee: EmployeeUI;
  className?: string;
}

const EmployeeCard = ({ employee, className }: EmployeeCardProps) => {
  const statusColors = {
    "active": "bg-emerald-50 text-emerald-600 border-emerald-200",
    "on-leave": "bg-amber-50 text-amber-600 border-amber-200",
    "terminated": "bg-red-50 text-red-600 border-red-200",
  };

  const statusText = {
    "active": "Actif",
    "on-leave": "En congé",
    "terminated": "Terminé",
  };

  return (
    <div className={cn(
      "rounded-xl bg-card border p-5 shadow-elevation-1 transition-all hover:shadow-elevation-2",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {employee.avatar ? (
              <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-medium text-primary">
                {employee.name.split(" ").map(n => n[0]).join("")}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Voir le profil</DropdownMenuItem>
            <DropdownMenuItem>Modifier l'employé</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              {employee.status === "terminated" ? "Supprimer l'employé" : "Mettre fin au contrat"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid grid-cols-1 gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Mail size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground">{employee.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground">{employee.phone}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{employee.department}</span>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full border",
          statusColors[employee.status]
        )}>
          {statusText[employee.status]}
        </span>
      </div>
    </div>
  );
};

export default EmployeeCard;
