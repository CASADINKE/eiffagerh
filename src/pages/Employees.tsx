import { useState, useEffect } from "react";
import { toast } from "sonner";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { useEmployeeOperations } from "@/hooks/useEmployeeOperations";
import EmployeeActionBar from "@/components/employees/EmployeeActionBar";
import EmployeeSearchBar from "@/components/employees/EmployeeSearchBar";
import EmployeeTable from "@/components/employees/EmployeeTable";
import DeleteRecentEmployeesDialog from "@/components/employees/DeleteRecentEmployeesDialog";
import { Employee } from "@/hooks/useEmployees";
import { EmployeeUI, mapEmployeesToUI } from "@/types/employee";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<EmployeeUI[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeUI[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteRecentDialogOpen, setDeleteRecentDialogOpen] = useState(false);
  
  const { fetchEmployees } = useEmployeeOperations();
  
  useEffect(() => {
    loadEmployees();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);
  
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const rawData = await fetchEmployees();
      const mappedEmployees = mapEmployeesToUI(rawData);
      setEmployees(mappedEmployees);
      setFilteredEmployees(mappedEmployees);
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
      toast.error("Erreur lors du chargement des employés");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddEmployee = () => {
    setOpenForm(true);
  };

  const handleRefresh = () => {
    toast.info("Rafraîchissement des données...");
    loadEmployees();
  };

  const handleDeleteRecent = () => {
    setDeleteRecentDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <EmployeeActionBar 
        onAddEmployee={handleAddEmployee} 
        onRefresh={handleRefresh}
        onDeleteRecent={handleDeleteRecent}
      />

      <EmployeeSearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <EmployeeTable 
        employees={filteredEmployees}
        isLoading={loading} 
        isError={false}
      />

      <EmployeeFormDialog 
        open={openForm} 
        onOpenChange={setOpenForm} 
        onSuccess={loadEmployees}
      />

      <DeleteRecentEmployeesDialog
        open={deleteRecentDialogOpen}
        onOpenChange={setDeleteRecentDialogOpen}
        onSuccess={loadEmployees}
      />
    </div>
  );
};

export default Employees;
