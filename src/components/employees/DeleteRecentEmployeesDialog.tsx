
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
import { AlertTriangle, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEmployeeOperations } from "@/hooks/useEmployeeOperations";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface DeleteEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteEmployeesDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: DeleteEmployeesDialogProps) => {
  const { fetchEmployees, deleteMultipleEmployees, isLoading } = useEmployeeOperations();
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Record<string, boolean>>({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      loadEmployees();
    }
  }, [open]);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.matricule.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const loadEmployees = async () => {
    try {
      const employees = await fetchEmployees();
      console.log("Employés chargés:", employees);
      setEmployees(employees);
      setFilteredEmployees(employees);
      
      // Initialize selected state
      const initialSelected: Record<string, boolean> = {};
      employees.forEach(emp => {
        initialSelected[emp.id] = false;
      });
      setSelectedEmployees(initialSelected);
      setIsAllSelected(false);
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
      toast.error("Erreur lors du chargement des employés");
    }
  };

  const handleEmployeeSelect = (id: string, checked: boolean) => {
    setSelectedEmployees(prev => ({
      ...prev,
      [id]: checked
    }));
    
    // Check if all are now selected
    const updatedSelected = { ...selectedEmployees, [id]: checked };
    const allSelected = filteredEmployees.every(emp => updatedSelected[emp.id]);
    setIsAllSelected(allSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    setIsAllSelected(checked);
    const newSelectedState: Record<string, boolean> = { ...selectedEmployees };
    filteredEmployees.forEach(emp => {
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
    if (selectedIds.length === 0) {
      toast.error("Veuillez sélectionner au moins un employé");
      return;
    }

    setDeleting(true);
    try {
      console.log("Suppression des employés:", selectedIds);
      const success = await deleteMultipleEmployees(selectedIds);
      if (success) {
        toast.success(`${selectedIds.length} employé(s) supprimé(s) avec succès!`);
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des employés:", error);
      toast.error("Échec de la suppression des employés");
    } finally {
      setDeleting(false);
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
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Supprimer des employés
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Sélectionnez les employés que vous souhaitez supprimer. Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par matricule ou nom..."
              className="pl-8 bg-background border-border text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-card/50 p-4 rounded-md mb-4 border border-border">
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-border">
            <Checkbox 
              id="select-all" 
              checked={isAllSelected}
              onCheckedChange={(checked) => handleSelectAll(!!checked)}
            />
            <Label htmlFor="select-all" className="text-sm font-medium text-foreground">
              Sélectionner tout ({filteredEmployees.length} employés)
            </Label>
            {selectedCount > 0 && (
              <span className="ml-auto text-sm text-muted-foreground">
                {selectedCount} sélectionné(s)
              </span>
            )}
          </div>

          {filteredEmployees.length > 0 ? (
            <div className="space-y-2">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 hover:bg-muted/20 rounded border border-border/40">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id={`employee-${employee.id}`} 
                      checked={selectedEmployees[employee.id]}
                      onCheckedChange={(checked) => handleEmployeeSelect(employee.id, !!checked)}
                      className="mt-1"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`employee-${employee.id}`} className="font-medium text-foreground">
                          {employee.prenom} {employee.nom}
                        </Label>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {employee.poste}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-sm">
                        <p className="text-muted-foreground">
                          <span className="text-foreground/70">Matricule:</span> {employee.matricule}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-foreground/70">Téléphone:</span> {employee.telephone || 'Non renseigné'}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-foreground/70">Site:</span> {employee.site || 'Non renseigné'}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-foreground/70">Affectation:</span> {employee.affectation || 'Non renseigné'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-col items-end">
                    <span className="text-foreground/70">Ajouté le:</span>
                    <span>{formatDate(employee.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground border border-dashed border-border rounded-md">
              {searchTerm ? "Aucun résultat pour cette recherche." : "Aucun employé trouvé."}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-border text-foreground">Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={selectedCount === 0 || isLoading || deleting}
          >
            {deleting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Suppression en cours...
              </div>
            ) : (
              `Supprimer ${selectedCount} employé${selectedCount > 1 ? 's' : ''}`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEmployeesDialog;
