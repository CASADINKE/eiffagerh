
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";
import { toast } from "sonner";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeFormDialog = ({ open, onOpenChange }: EmployeeFormDialogProps) => {
  const handleSubmit = (values: any) => {
    console.log("Form submitted with values:", values);
    toast.success("Employé ajouté avec succès!");
    onOpenChange(false);
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
        <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
