
import React from "react";
import { ArrowLeft, RotateCcw, Settings, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmployeeActionBarProps {
  onAddEmployee: () => void;
  onRefresh: () => void;
  onDeleteEmployees?: () => void;
}

const EmployeeActionBar = ({ onAddEmployee, onRefresh, onDeleteEmployees }: EmployeeActionBarProps) => {
  const handleBack = () => {
    toast.info("Retour à la page précédente");
    // Logique de navigation ici
  };

  const handleSettings = () => {
    toast.info("Paramètres ouverts");
    // Logique pour ouvrir les paramètres ici
  };

  const handleDeleteEmployees = () => {
    if (onDeleteEmployees) {
      onDeleteEmployees();
    } else {
      toast.info("Supprimer employés");
    }
  };

  return (
    <div className="flex justify-between items-center mb-4 mt-6">
      <div className="py-3 px-4 bg-card rounded-t-md border border-border flex-1">
        <h1 className="text-lg font-medium text-foreground">Employés</h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="default" 
          className="gap-1 rounded-md"
          onClick={onAddEmployee}
        >
          <Plus size={16} />
          Ajouter
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="gap-1 bg-secondary text-foreground border-border"
          onClick={onRefresh}
        >
          <RotateCcw size={16} />
        </Button>
        <Button 
          variant="destructive" 
          size="default" 
          className="gap-1"
          onClick={handleDeleteEmployees}
        >
          <Trash2 size={16} />
          Supprimer employés
        </Button>
      </div>
    </div>
  );
};

export default EmployeeActionBar;
