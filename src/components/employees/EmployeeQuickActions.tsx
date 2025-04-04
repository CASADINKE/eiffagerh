
import React from "react";
import { Plus, RotateCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmployeeQuickActionsProps {
  onAddEmployee: () => void;
  onRefresh?: () => void;
  onDeleteEmployees?: () => void;
}

const EmployeeQuickActions = ({ 
  onAddEmployee, 
  onRefresh, 
  onDeleteEmployees 
}: EmployeeQuickActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-1" onClick={onAddEmployee}>
        <Plus size={16} />
        Ajouter
      </Button>
      
      {onRefresh && (
        <Button variant="outline" size="sm" className="gap-1" onClick={onRefresh}>
          <RotateCw size={16} />
          Rafraîchir
        </Button>
      )}
      
      {onDeleteEmployees && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10 border-border" 
                onClick={onDeleteEmployees}
              >
                <Trash2 size={16} />
                Supprimer employés
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sélectionner et supprimer des employés</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default EmployeeQuickActions;
