
import { useState, useEffect } from "react";
import { toast } from "sonner";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { useEmployeeOperations } from "@/hooks/useEmployeeOperations";
import EmployeeActionBar from "@/components/employees/EmployeeActionBar";
import EmployeeSearchBar from "@/components/employees/EmployeeSearchBar";
import EmployeeTable from "@/components/employees/EmployeeTable";
import DeleteRecentEmployeesDialog from "@/components/employees/DeleteRecentEmployeesDialog";
import { Employee } from "@/hooks/useEmployees";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
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
      
      // Map the returned data to match the Employee type
      const mappedEmployees: Employee[] = rawData.map(emp => ({
        id: emp.id,
        name: `${emp.nom} ${emp.prenom}`,
        position: emp.poste,
        department: emp.affectation,
        email: emp.matricule, // Using matricule as email since there's no direct email field
        phone: emp.telephone,
        status: "active", // Default status
        avatar: undefined,
        // Add the missing properties
        matricule: emp.matricule,
        site: emp.site
      }));
      
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
