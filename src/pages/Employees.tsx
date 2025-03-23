
import { useState } from "react";
import { Search, Plus, ArrowLeft, RotateCcw, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  
  const handleAddEmployee = () => {
    setOpenForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header avec le titre */}
      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-700">Lister les employés</h1>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-gray-500">Accueil</span>
          <span className="text-gray-500">&gt;</span>
          <span className="text-gray-700">Employés</span>
        </div>
      </div>

      {/* Barre d'actions principale */}
      <div className="flex justify-between items-center mb-4 mt-6 bg-white border rounded-t-md p-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1 text-gray-700">
            <ArrowLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-gray-700">
            <RotateCcw size={16} />
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-gray-700">
            <Settings size={16} />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1 bg-blue-500 hover:bg-blue-600"
            onClick={handleAddEmployee}
          >
            <Plus size={16} />
            Ajouter
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-gray-700">
            Actions
          </Button>
        </div>
      </div>

      {/* Entête de la liste */}
      <div className="flex items-center bg-gray-200 p-3 rounded-t-md border border-gray-300">
        <div className="text-lg font-medium text-gray-700">Employés</div>
        <div className="ml-auto flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1 bg-blue-500 hover:bg-blue-600"
            onClick={handleAddEmployee}
          >
            Ajouter
          </Button>
          <Button variant="outline" size="sm" className="gap-1 bg-white">
            Suspendus
          </Button>
          <Button variant="outline" size="sm" className="gap-1 bg-white">
            Supprimés
          </Button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="p-4 bg-white border-x border-b flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Nom / Email" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pr-10"
          />
          <Button 
            variant="default" 
            size="sm" 
            className="absolute right-0 top-0 h-full rounded-l-none bg-amber-400 hover:bg-amber-500"
          >
            <Search size={16} />
            Filtrer
          </Button>
        </div>
        <div className="flex justify-between items-center gap-2">
          <select className="border rounded p-2 text-sm md:ml-auto">
            <option>Action groupée</option>
          </select>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1 bg-amber-400 hover:bg-amber-500"
          >
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Contenu - Message "Aucun élément trouvé" */}
      <div className="p-6 bg-yellow-50 border border-yellow-200 text-amber-800 flex justify-between items-center">
        <div>Aucun élément trouvé.</div>
        <Button variant="ghost" size="sm" className="text-amber-800 hover:bg-yellow-100">
          <X size={16} />
        </Button>
      </div>

      {/* Bouton pour ajouter un nouvel employé */}
      <div className="flex justify-center mt-6">
        <Button 
          variant="default" 
          className="gap-2 bg-blue-500 hover:bg-blue-600 px-5 py-2" 
          onClick={handleAddEmployee}
        >
          <Plus size={16} />
          Nouvel employé
        </Button>
      </div>

      {/* Dialog pour le formulaire d'ajout d'employé */}
      <EmployeeFormDialog open={openForm} onOpenChange={setOpenForm} />
    </div>
  );
};

export default Employees;
