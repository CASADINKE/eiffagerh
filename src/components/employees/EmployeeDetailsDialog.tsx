
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User, MapPin, Phone, Briefcase, Calendar, Building, Tag, CreditCard } from "lucide-react";
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

  const formatCurrency = (value?: string | number) => {
    if (!value) return 'Non renseigné';
    return `${Number(value).toLocaleString('fr-FR')} FCFA`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Détails de l'employé</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{employee.prenom} {employee.nom}</h2>
              <p className="text-muted-foreground">{employee.poste}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">Matricule</p>
            <p className="text-lg font-semibold">{employee.matricule}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Informations personnelles</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                    <p>{employee.date_naissance ? format(new Date(employee.date_naissance), 'dd MMMM yyyy', { locale: fr }) : 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                    <p>{employee.adresse || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <p>{employee.telephone || 'Non renseigné'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Informations professionnelles</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Employeur</p>
                    <p>{employee.employeur || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Site</p>
                    <p>{employee.site || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Affectation</p>
                    <p>{employee.affectation || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                    <p>{employee.categorie || 'Non renseigné'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Informations salariales</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Salaire de base</p>
                    <p>{formatCurrency(employee.salaire_base)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sursalaire</p>
                    <p>{formatCurrency(employee.sursalaire)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prime de déplacement</p>
                    <p>{formatCurrency(employee.prime_deplacement)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Commentaires</h3>
              <div className="border rounded-md p-3">
                {employee.commentaire || 'Aucun commentaire'}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
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
