
import React from "react";
import { Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeQuickActionsProps {
  onAddEmployee: () => void;
  onRefresh?: () => void;
}

const EmployeeQuickActions = ({ onAddEmployee, onRefresh }: EmployeeQuickActionsProps) => {
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
    </div>
  );
};

export default EmployeeQuickActions;
