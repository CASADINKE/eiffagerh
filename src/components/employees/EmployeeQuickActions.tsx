
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmployeeQuickActionsProps {
  onAddEmployee: () => void;
}

const EmployeeQuickActions = ({ onAddEmployee }: EmployeeQuickActionsProps) => {
  const handleSuspended = () => {
    toast.info("Affichage des employés suspendus");
    // Logique pour afficher les employés suspendus
  };

  const handleDeleted = () => {
    toast.info("Affichage des employés supprimés");
    // Logique pour afficher les employés supprimés
  };

  return (
    <>
      <Button 
        variant="default" 
        size="sm" 
        className="gap-1"
        onClick={onAddEmployee}
      >
        Ajouter
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1 bg-white"
        onClick={handleSuspended}
      >
        Suspendus
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1 bg-white"
        onClick={handleDeleted}
      >
        Supprimés
      </Button>
    </>
  );
};

export default EmployeeQuickActions;
