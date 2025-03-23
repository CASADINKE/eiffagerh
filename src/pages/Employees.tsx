
import { useState, useEffect } from "react";
import { toast } from "sonner";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { useEmployeeOperations } from "@/hooks/useEmployeeOperations";
import EmployeePageHeader from "@/components/employees/EmployeePageHeader";
import EmployeeActionBar from "@/components/employees/EmployeeActionBar";
import EmployeeTableSection from "@/components/employees/EmployeeTableSection";
import EmployeeSearchBar from "@/components/employees/EmployeeSearchBar";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { fetchEmployees } = useEmployeeOperations();
  
  useEffect(() => {
    loadEmployees();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.matricule.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);
  
  const loadEmployees = async () => {
    setLoading(true);
    const data = await fetchEmployees();
    setEmployees(data);
    setFilteredEmployees(data);
    setLoading(false);
  };
  
  const handleAddEmployee = () => {
    setOpenForm(true);
  };

  const handleRefresh = () => {
    toast.info("Rafraîchissement des données...");
    loadEmployees();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <EmployeePageHeader />

      <EmployeeActionBar 
        onAddEmployee={handleAddEmployee} 
        onRefresh={handleRefresh}
      />

      <div className="flex items-center bg-gray-200 p-3 rounded-t-md border border-gray-300">
        <div className="text-lg font-medium text-gray-700">Employés</div>
        <div className="ml-auto flex gap-2">
          <EmployeeQuickActions onAddEmployee={handleAddEmployee} />
        </div>
      </div>

      <EmployeeSearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <EmployeeTableSection 
        loading={loading} 
        filteredEmployees={filteredEmployees} 
      />

      <div className="flex justify-center mt-6">
        <AddEmployeeButton onClick={handleAddEmployee} />
      </div>

      <EmployeeFormDialog open={openForm} onOpenChange={setOpenForm} />
    </div>
  );
};

export default Employees;
