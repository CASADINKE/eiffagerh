
import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEmployeeOperations } from "@/hooks/useEmployeeOperations";

interface DeleteRecentEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteRecentEmployeesDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: DeleteRecentEmployeesDialogProps) => {
  const { fetchRecentEmployees, deleteMultipleEmployees, isLoading } = useEmployeeOperations();
  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Record<string, boolean>>({});
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (open) {
      loadRecentEmployees();
    }
  }, [open]);

  const loadRecentEmployees = async () => {
    const employees = await fetchRecentEmployees(20);
    setRecentEmployees(employees);
    
    // Initialize selected state
    const initialSelected: Record<string, boolean> = {};
    employees.forEach(emp => {
      initialSelected[emp.id] = false;
    });
    setSelectedEmployees(initialSelected);
    setIsAllSelected(false);
  };

  const handleEmployeeSelect = (id: string, checked: boolean) => {
    setSelectedEmployees(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setIsAllSelected(checked);
    const newSelectedState: Record<string, boolean> = {};
    recentEmployees.forEach(emp => {
      newSelectedState[emp.id] = checked;
    });
    setSelectedEmployees(newSelectedState);
  };

  const getSelectedEmployeeIds = () => {
    return Object.entries(selectedEmployees)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
  };

  const handleDelete = async () => {
    const selectedIds = getSelectedEmployeeIds();
    if (selectedIds.length === 0) return;

    try {
      await deleteMultipleEmployees(selectedIds);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete employees:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };
  
  const selectedCount = getSelectedEmployeeIds().length;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Supprimer les employés récemment ajoutés
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sélectionnez les employés récemment ajoutés que vous souhaitez supprimer. Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b">
            <Checkbox 
              id="select-all" 
              checked={isAllSelected}
              onCheckedChange={(checked) => handleSelectAll(!!checked)}
            />
            <Label htmlFor="select-all" className="text-sm font-medium">
              Sélectionner tout ({recentEmployees.length} employés)
            </Label>
          </div>

          {recentEmployees.length > 0 ? (
            <div className="space-y-2">
              {recentEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`employee-${employee.id}`} 
                      checked={selectedEmployees[employee.id]}
                      onCheckedChange={(checked) => handleEmployeeSelect(employee.id, !!checked)}
                    />
                    <Label htmlFor={`employee-${employee.id}`} className="font-medium">
                      {employee.nom} {employee.prenom}
                    </Label>
                  </div>
                  <div className="text-xs text-gray-500 flex gap-4">
                    <span>Matricule: {employee.matricule}</span>
                    <span>Ajouté le: {formatDate(employee.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Aucun employé récent trouvé.
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={selectedCount === 0 || isLoading}
          >
            {isLoading ? "Suppression..." : `Supprimer ${selectedCount} employé${selectedCount > 1 ? 's' : ''}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecentEmployeesDialog;
