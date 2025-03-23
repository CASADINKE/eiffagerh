
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

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeFormDialog = ({ open, onOpenChange }: EmployeeFormDialogProps) => {
  const { createEmployee, isLoading } = useEmployeeOperations();

  const handleSubmit = async (values: EmployeeFormData) => {
    console.log("Form submitted with values:", values);
    const result = await createEmployee(values);
    if (result) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
          <DialogDescription>
            Remplissez tous les champs pour créer un nouvel employé.
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
