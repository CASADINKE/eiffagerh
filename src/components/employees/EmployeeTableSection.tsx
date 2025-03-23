
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmployeeTableSectionProps {
  loading: boolean;
  filteredEmployees: any[];
}

const EmployeeTableSection = ({ loading, filteredEmployees }: EmployeeTableSectionProps) => {
  const handleCloseNoResults = () => {
    toast.info("Notification fermée");
    // Logique pour fermer la notification
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
                <tr key={employee.id} className="hover:bg-gray-50">
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
    </>
  );
};

export default EmployeeTableSection;
