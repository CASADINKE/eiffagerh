
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import { useEmployees, Employee } from "@/hooks/useEmployees";

const Employees = () => {
  const { data: employees = [], isLoading, isError } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Extraction des départements uniques
  const departments = useMemo(() => {
    return [...new Set(employees.map(emp => emp.department))];
  }, [employees]);

  // Filtrage des employés
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, searchTerm, statusFilter, departmentFilter]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Employés</h1>
          <p className="text-muted-foreground">Gérez les dossiers et informations de vos employés</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          <span>Ajouter un employé</span>
        </Button>
      </div>
      
      <EmployeeFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        departments={departments}
      />
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="py-10 text-center">
          <p className="text-destructive">Erreur lors du chargement des données. Veuillez réessayer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center">
              <p className="text-muted-foreground">Aucun employé ne correspond aux critères de recherche.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Employees;
