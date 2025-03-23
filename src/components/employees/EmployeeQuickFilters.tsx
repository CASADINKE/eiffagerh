
import { Button } from "@/components/ui/button";

const EmployeeQuickFilters = () => {
  return (
    <div className="flex gap-2 mt-4">
      <Button variant="outline" size="sm" className="gap-1">
        Actifs
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        En congé
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        Terminés
      </Button>
    </div>
  );
};

export default EmployeeQuickFilters;
