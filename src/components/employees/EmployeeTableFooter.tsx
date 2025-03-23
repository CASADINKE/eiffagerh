
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/exportUtils";

interface EmployeeTableFooterProps {
  filteredCount: number;
  totalCount: number;
  showAddButton: boolean;
  employees?: any[];
}

const EmployeeTableFooter = ({ 
  filteredCount, 
  totalCount, 
  showAddButton,
  employees = []
}: EmployeeTableFooterProps) => {
  const handleAddEmployee = () => {
    toast.info("Fonctionnalité à implémenter");
  };

  const handleExport = () => {
    if (!employees || employees.length === 0) {
      toast.error("Aucun employé à exporter");
      return;
    }

    // Définition des entêtes pour l'export CSV
    const headers = {
      matricule: "Matricule",
      nom: "Nom",
      prenom: "Prénom",
      poste: "Poste",
      site: "Site",
      telephone: "Téléphone",
      affectation: "Affectation",
      employeur: "Employeur",
      adresse: "Adresse",
      date_naissance: "Date de naissance"
    };

    exportToCSV(employees, "liste-employes", headers);
    toast.success("Export des employés réussi");
  };

  if (showAddButton) {
    return (
      <div className="flex justify-center mt-6">
        <Button 
          variant="default" 
          className="gap-1 bg-blue-600 hover:bg-blue-700" 
          onClick={handleAddEmployee}
        >
          <Plus size={16} />
          Nouvel employé
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-muted-foreground">
        Affichage de {filteredCount} sur {totalCount} employés
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={handleExport}
        >
          <Download size={16} />
          Exporter
        </Button>
        <select className="border rounded p-1 text-sm">
          <option>Action groupée</option>
        </select>
        <Button 
          variant="default" 
          size="sm" 
          className="gap-1 bg-amber-500 hover:bg-amber-600" 
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default EmployeeTableFooter;
