
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
import { useState } from "react";
import { read, utils } from "xlsx";
import { toast } from "sonner";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "import";
}

const EmployeeFormDialog = ({ open, onOpenChange, mode = "add" }: EmployeeFormDialogProps) => {
  const { createEmployee, isLoading } = useEmployeeOperations();
  const [importing, setImporting] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setImporting(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<any>(worksheet);
      
      if (jsonData.length === 0) {
        toast.error("Fichier vide ou format incorrect");
        return;
      }
      
      // Log the first row to debug structure
      console.log("First row of Excel data:", jsonData[0]);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const row of jsonData) {
        try {
          // Map Excel columns to our data structure
          // Assuming Excel columns match our field names or can be mapped
          const employeeData: EmployeeFormData = {
            matricule: row.matricule || row.Matricule || "",
            employeur: row.employeur || row.Employeur || "",
            nom: row.nom || row.Nom || "",
            prenom: row.prenom || row.Prenom || "",
            date_naissance: row.date_naissance || row["Date de naissance"] 
              ? new Date(row.date_naissance || row["Date de naissance"]) 
              : new Date(),
            poste: row.poste || row.Poste || "",
            adresse: row.adresse || row.Adresse || "",
            telephone: row.telephone || row.Telephone || row["Téléphone"] || "",
            affectation: row.affectation || row.Affectation || "",
            site: row.site || row.Site || "",
          };
          
          // Create employee
          const result = await createEmployee(employeeData);
          if (result) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error("Error processing row:", row, error);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} employé(s) importé(s) avec succès`);
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} employé(s) n'ont pas pu être importés`);
      }
      
      // Reset the file input
      e.target.value = "";
      
      if (successCount > 0) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error processing Excel file:", error);
      toast.error("Erreur lors du traitement du fichier Excel");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Ajouter un nouvel employé" : "Importer des employés"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Remplissez tous les champs pour créer un nouvel employé."
              : "Sélectionnez un fichier Excel (.xlsx) contenant la liste des employés à importer."}
          </DialogDescription>
        </DialogHeader>
        
        {mode === "add" ? (
          <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
        ) : (
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Format attendu: fichier Excel (.xlsx) avec les colonnes suivantes:
                  </p>
                  <div className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                    matricule, employeur, nom, prenom, date_naissance, poste, adresse, telephone, affectation, site
                  </div>
                </div>
                
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary/90"
                  disabled={importing}
                />
                
                {importing && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Importation en cours...</p>
                    <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse w-1/2"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={importing}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
