
import React from "react";
import { Plus, RotateCw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmployeeQuickActionsProps {
  onAddEmployee: () => void;
  onRefresh?: () => void;
  onDeleteRecent?: () => void;
}

const EmployeeQuickActions = ({ 
  onAddEmployee, 
  onRefresh, 
  onDeleteRecent 
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
      
      {onDeleteRecent && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50" 
                onClick={onDeleteRecent}
              >
                <Trash size={16} />
                Supprimer récents
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Supprimer les employés récemment ajoutés</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default EmployeeQuickActions;
