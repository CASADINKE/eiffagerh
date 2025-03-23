
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EmployeeDetailsProps {
  employee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeDetailsDialog = ({
  employee,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: EmployeeDetailsProps) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Détails de l'employé</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-6">
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Matricule</p>
            <p className="text-lg">{employee.matricule}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Employeur</p>
            <p className="text-lg">{employee.employeur}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Nom</p>
            <p className="text-lg">{employee.nom}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Prénom</p>
            <p className="text-lg">{employee.prenom}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Date de naissance</p>
            <p className="text-lg">
              {employee.date_naissance ? format(new Date(employee.date_naissance), 'dd MMMM yyyy', { locale: fr }) : 'Non renseigné'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Poste</p>
            <p className="text-lg">{employee.poste}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Adresse</p>
            <p className="text-lg">{employee.adresse}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Téléphone</p>
            <p className="text-lg">{employee.telephone}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Affectation</p>
            <p className="text-lg">{employee.affectation}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-500">Site</p>
            <p className="text-lg">{employee.site}</p>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" size="lg" onClick={onOpenChange.bind(null, false)}>
            Fermer
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="gap-2" onClick={onEdit}>
              <Pencil size={18} />
              Modifier
            </Button>
            <Button variant="destructive" size="lg" className="gap-2" onClick={onDelete}>
              <Trash2 size={18} />
              Supprimer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;
