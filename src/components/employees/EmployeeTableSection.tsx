
import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EmployeeDetailsDialog from "./EmployeeDetailsDialog";
import { useEmployeeOperations } from "@/hooks/useEmployeeOperations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmployeeTableSectionProps {
  loading: boolean;
  filteredEmployees: any[];
  onRefresh: () => void;
}

const EmployeeTableSection = ({ loading, filteredEmployees, onRefresh }: EmployeeTableSectionProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  
  const { deleteEmployee } = useEmployeeOperations();

  const handleCloseNoResults = () => {
    toast.info("Notification fermée");
  };

  const handleRowClick = (employee: any) => {
    setSelectedEmployee(employee);
    setDetailsOpen(true);
  };

  const handleEditEmployee = () => {
    setDetailsOpen(false);
    // Here you would open the edit form dialog
    toast.info("Fonctionnalité de modification à implémenter");
  };

  const handleDeleteEmployee = () => {
    setDetailsOpen(false);
    setEmployeeToDelete(selectedEmployee);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    try {
      await deleteEmployee(employeeToDelete.id);
      toast.success("Employé supprimé avec succès");
      onRefresh();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <>
      {loading ? (
        <div className="p-6 bg-white border border-gray-200">
          Chargement des données...
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="bg-white border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom & Prénom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(employee)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.matricule}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.nom} {employee.prenom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.poste}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.site}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.telephone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 border border-yellow-200 text-amber-800 flex justify-between items-center">
          <div>Aucun élément trouvé.</div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-amber-800 hover:bg-yellow-100"
            onClick={handleCloseNoResults}
          >
            <X size={16} />
          </Button>
        </div>
      )}

      {/* Employee Details Dialog */}
      {selectedEmployee && (
        <EmployeeDetailsDialog
          employee={selectedEmployee}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
              {employeeToDelete && (
                <div className="mt-2 p-3 bg-gray-100 rounded-md">
                  <p><strong>Matricule:</strong> {employeeToDelete.matricule}</p>
                  <p><strong>Nom:</strong> {employeeToDelete.nom} {employeeToDelete.prenom}</p>
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
    </>
  );
};

export default EmployeeTableSection;
