
import { useState, useMemo } from "react";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import { useEmployees } from "@/hooks/useEmployees";
import EmployeeBreadcrumb from "@/components/employees/EmployeeBreadcrumb";
import EmployeeHeader from "@/components/employees/EmployeeHeader";
import EmployeeQuickFilters from "@/components/employees/EmployeeQuickFilters";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeeTableFooter from "@/components/employees/EmployeeTableFooter";

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
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, searchTerm, statusFilter, departmentFilter]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-6 py-2">
        <EmployeeBreadcrumb />
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        <EmployeeHeader />

        <div className="p-4 border-b">
          <EmployeeFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            departments={departments}
          />
          
          <EmployeeQuickFilters />
        </div>
        
        <div className="p-4">
          <EmployeeTable 
            employees={filteredEmployees}
            isLoading={isLoading}
            isError={isError}
          />
          
          {!isLoading && (
            <EmployeeTableFooter 
              filteredCount={filteredEmployees.length}
              totalCount={employees.length}
              showAddButton={filteredEmployees.length === 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
