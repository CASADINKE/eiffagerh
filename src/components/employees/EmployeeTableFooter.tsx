
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmployeeTableFooterProps {
  filteredCount: number;
  totalCount: number;
  showAddButton: boolean;
}

const EmployeeTableFooter = ({ 
  filteredCount, 
  totalCount, 
  showAddButton 
}: EmployeeTableFooterProps) => {
  const handleAddEmployee = () => {
    toast.info("Fonctionnalité à implémenter");
  };

  const handleExport = () => {
    toast.info("Fonctionnalité d'exportation à implémenter");
  };

  if (showAddButton) {
    return (
      <div className="flex justify-center mt-6">
        <Button variant="default" className="gap-1" onClick={handleAddEmployee}>
          <Plus size={16} />
          Nouvel employé
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-muted-foreground">
        Affichage de {filteredCount} sur {totalCount} employés
      </div>
      <div className="flex gap-2">
        <select className="border rounded p-1 text-sm">
          <option>Action groupée</option>
        </select>
        <Button variant="default" size="sm" className="gap-1" onClick={handleExport}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default EmployeeTableFooter;
