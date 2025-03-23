import { useState, useEffect } from "react";
import { Search, Plus, ArrowLeft, RotateCcw, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import { useEmployeeOperations } from "@/hooks/useEmployeeOperations";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { fetchEmployees } = useEmployeeOperations();
  
  useEffect(() => {
    loadEmployees();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.matricule.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);
  
  const loadEmployees = async () => {
    setLoading(true);
    const data = await fetchEmployees();
    setEmployees(data);
    setFilteredEmployees(data);
    setLoading(false);
  };
  
  const handleAddEmployee = () => {
    setOpenForm(true);
  };

  const handleRefresh = () => {
    toast.info("Rafraîchissement des données...");
    loadEmployees();
  };

  const handleBack = () => {
    toast.info("Retour à la page précédente");
    // Logique de navigation ici
  };

  const handleSettings = () => {
    toast.info("Paramètres ouverts");
    // Logique pour ouvrir les paramètres ici
  };

  const handleFilter = () => {
    toast.success(`Filtrage avec le terme: ${searchTerm}`);
    // Logique de filtrage ici
  };

  const handleBulkAction = () => {
    toast.info("Action groupée sélectionnée");
    // Logique pour les actions groupées ici
  };

  const handleSave = () => {
    toast.success("Modifications enregistrées");
    // Logique d'enregistrement ici
  };

  const handleSuspended = () => {
    toast.info("Affichage des employés suspendus");
    // Logique pour afficher les employés suspendus
  };

  const handleDeleted = () => {
    toast.info("Affichage des employés supprimés");
    // Logique pour afficher les employés supprimés
  };

  const handleCloseNoResults = () => {
    toast.info("Notification fermée");
    // Logique pour fermer la notification
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-700">Lister les employés</h1>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-gray-500">Accueil</span>
          <span className="text-gray-500">&gt;</span>
          <span className="text-gray-700">Employés</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 mt-6 bg-white border rounded-t-md p-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-gray-700"
            onClick={handleBack}
          >
            <ArrowLeft size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-gray-700"
            onClick={handleRefresh}
          >
            <RotateCcw size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-gray-700"
            onClick={handleSettings}
          >
            <Settings size={16} />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={handleAddEmployee}
          >
            <Plus size={16} />
            Ajouter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-gray-700"
            onClick={handleBulkAction}
          >
            Actions
          </Button>
        </div>
      </div>

      <div className="flex items-center bg-gray-200 p-3 rounded-t-md border border-gray-300">
        <div className="text-lg font-medium text-gray-700">Employés</div>
        <div className="ml-auto flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={handleAddEmployee}
          >
            Ajouter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 bg-white"
            onClick={handleSuspended}
          >
            Suspendus
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 bg-white"
            onClick={handleDeleted}
          >
            Supprimés
          </Button>
        </div>
      </div>

      <div className="p-4 bg-white border-x border-b flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Nom / Email / Matricule" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pr-10"
          />
          <Button 
            variant="default" 
            size="sm" 
            className="absolute right-0 top-0 h-full rounded-l-none"
            onClick={handleFilter}
          >
            <Search size={16} />
            Filtrer
          </Button>
        </div>
        <div className="flex justify-between items-center gap-2">
          <select 
            className="border rounded p-2 text-sm md:ml-auto"
            onChange={handleBulkAction}
          >
            <option>Action groupée</option>
            <option value="delete">Supprimer</option>
            <option value="suspend">Suspendre</option>
            <option value="activate">Activer</option>
          </select>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={handleSave}
          >
            Enregistrer
          </Button>
        </div>
      </div>

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

      <div className="flex justify-center mt-6">
        <Button 
          variant="default" 
          className="gap-2 px-5 py-2" 
          onClick={handleAddEmployee}
        >
          <Plus size={16} />
          Nouvel employé
        </Button>
      </div>

      <EmployeeFormDialog open={openForm} onOpenChange={setOpenForm} />
    </div>
  );
};

export default Employees;
