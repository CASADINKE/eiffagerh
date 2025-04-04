
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";
import { useEmployeeOperations, EmployeeFormData } from "@/hooks/useEmployeeOperations";
import { useEffect, useState } from "react";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  employeeToEdit?: any;
  mode?: "create" | "edit";
}

const EmployeeFormDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  employeeToEdit, 
  mode = "create" 
}: EmployeeFormDialogProps) => {
  const { createEmployee, updateEmployee, isLoading } = useEmployeeOperations();
  const [initialValues, setInitialValues] = useState<Partial<EmployeeFormData> | undefined>(undefined);

  useEffect(() => {
    if (mode === "edit" && employeeToEdit) {
      console.log("Initializing form with employee data:", employeeToEdit);
      // Format the data for the form
      setInitialValues({
        ...employeeToEdit,
        date_naissance: employeeToEdit.date_naissance ? new Date(employeeToEdit.date_naissance) : undefined,
      });
    } else {
      setInitialValues(undefined);
    }
  }, [mode, employeeToEdit]);

  const handleSubmit = async (values: EmployeeFormData) => {
    console.log("Form submitted with values:", values);
    console.log("Current mode:", mode);
    
    let result;
    try {
      if (mode === "edit" && employeeToEdit) {
        console.log("Updating employee with ID:", employeeToEdit.id);
        result = await updateEmployee(employeeToEdit.id, values);
      } else {
        result = await createEmployee(values);
      }
      
      if (result) {
        console.log("Operation successful, result:", result);
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const dialogTitle = mode === "create" ? "Ajouter un nouvel employé" : "Modifier l'employé";
  const dialogDescription = mode === "create" 
    ? "Remplissez tous les champs pour créer un nouvel employé."
    : "Modifiez les informations de l'employé.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
          isLoading={isLoading}
          initialValues={initialValues}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
