
import { Plus, RotateCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmployeeHeader = () => {
  const handleAddEmployee = () => {
    toast.info("Fonctionnalité à implémenter");
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-lg font-medium">Employés</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <RotateCcw size={14} />
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <ExternalLink size={14} />
        </Button>
        <Button variant="default" size="sm" className="gap-1" onClick={handleAddEmployee}>
          <Plus size={14} />
          <span>Ajouter</span>
        </Button>
      </div>
    </div>
  );
};

export default EmployeeHeader;
