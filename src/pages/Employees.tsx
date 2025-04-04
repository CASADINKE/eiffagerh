
import { useState, useEffect } from "react";
import { toast } from "sonner";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { useEmployeeOperations } from "@/hooks/useEmployeeOperations";
import EmployeeActionBar from "@/components/employees/EmployeeActionBar";
import EmployeeSearchBar from "@/components/employees/EmployeeSearchBar";
import EmployeeTable from "@/components/employees/EmployeeTable";
import DeleteRecentEmployeesDialog from "@/components/employees/DeleteRecentEmployeesDialog";
import EmployeeDetailsDialog from "@/components/employees/EmployeeDetailsDialog";
import { EmployeeUI, mapEmployeesToUI } from "@/types/employee";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<EmployeeUI[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeUI[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteRecentDialogOpen, setDeleteRecentDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const { fetchEmployees, fetchEmployeeById, deleteEmployee } = useEmployeeOperations();
  
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
  
  const handleRowClick = async (employee: EmployeeUI) => {
    try {
      const fullEmployeeData = await fetchEmployeeById(employee.id);
      if (fullEmployeeData) {
        setSelectedEmployee(fullEmployeeData);
        setDetailsDialogOpen(true);
      } else {
        toast.error("Impossible de charger les détails de l'employé");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Erreur lors du chargement des détails de l'employé");
    }
  };
  
  const handleEditEmployee = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };
  
  const handleDeleteEmployeeClick = () => {
    setDetailsDialogOpen(false);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      await deleteEmployee(selectedEmployee.id);
      toast.success("Employé supprimé avec succès");
      loadEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    }
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
        onRowClick={handleRowClick}
      />

      <EmployeeFormDialog 
        open={openForm} 
        onOpenChange={setOpenForm} 
        onSuccess={loadEmployees}
      />

      {selectedEmployee && (
        <EmployeeFormDialog 
          open={editDialogOpen} 
          onOpenChange={setEditDialogOpen} 
          onSuccess={loadEmployees}
          employeeToEdit={selectedEmployee}
          mode="edit"
        />
      )}

      <DeleteRecentEmployeesDialog
        open={deleteRecentDialogOpen}
        onOpenChange={setDeleteRecentDialogOpen}
        onSuccess={loadEmployees}
      />
      
      {selectedEmployee && (
        <EmployeeDetailsDialog
          employee={selectedEmployee}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployeeClick}
        />
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
              {selectedEmployee && (
                <div className="mt-2 p-3 bg-gray-100 rounded-md">
                  <p><strong>Matricule:</strong> {selectedEmployee.matricule}</p>
                  <p><strong>Nom:</strong> {selectedEmployee.nom} {selectedEmployee.prenom}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Employees;
