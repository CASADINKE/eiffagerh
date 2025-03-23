
import React from "react";
import { ArrowLeft, RotateCcw, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmployeeActionBarProps {
  onAddEmployee: () => void;
  onRefresh: () => void;
}

const EmployeeActionBar = ({ onAddEmployee, onRefresh }: EmployeeActionBarProps) => {
  const handleBack = () => {
    toast.info("Retour à la page précédente");
    // Logique de navigation ici
  };

  const handleSettings = () => {
    toast.info("Paramètres ouverts");
    // Logique pour ouvrir les paramètres ici
  };

  const handleBulkAction = () => {
    toast.info("Action groupée sélectionnée");
    // Logique pour les actions groupées ici
  };

  return (
    <div className="flex justify-between items-center mb-4 mt-6 bg-white border rounded-t-md p-2">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-gray-700"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-gray-700"
          onClick={onRefresh}
        >
          <RotateCcw size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-gray-700"
          onClick={handleSettings}
        >
          <Settings size={16} />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="sm" 
          className="gap-1"
          onClick={onAddEmployee}
        >
          <Plus size={16} />
          Ajouter
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-gray-700"
          onClick={handleBulkAction}
        >
          Actions
        </Button>
      </div>
    </div>
  );
};

export default EmployeeActionBar;
