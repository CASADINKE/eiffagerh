
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  departments: string[];
}

const EmployeeFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  departments
}: EmployeeFiltersProps) => {
  const handleFilter = () => {
    // Filtrage déjà géré par le composant parent via les états
    console.log("Filtrer avec:", searchTerm, statusFilter, departmentFilter);
  };

  return (
    <div className="flex">
      <div className="relative flex-1">
        <Input 
          type="search" 
          placeholder="Nom / Email" 
          className="w-[230px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Button 
        variant="default" 
        className="ml-2 bg-amber-500 hover:bg-amber-600"
        onClick={handleFilter}
      >
        <Search size={16} className="mr-1" />
        Filtrer
      </Button>
    </div>
  );
};

export default EmployeeFilters;
