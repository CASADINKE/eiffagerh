
import { Button } from "@/components/ui/button";

const EmployeeQuickFilters = () => {
  return (
    <div className="flex gap-2 mt-4">
      <Button variant="outline" size="sm" className="gap-1 bg-white">
        Ajouter
      </Button>
      <Button variant="outline" size="sm" className="gap-1 bg-white">
        Suspendus
      </Button>
      <Button variant="outline" size="sm" className="gap-1 bg-white">
        Supprimés
      </Button>
    </div>
  );
};

export default EmployeeQuickFilters;
