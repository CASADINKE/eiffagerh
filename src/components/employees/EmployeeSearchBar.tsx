
import React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EmployeeSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const EmployeeSearchBar = ({ searchTerm, setSearchTerm }: EmployeeSearchBarProps) => {
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

  return (
    <div className="p-4 bg-card border-x border-b border-border flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Input 
          type="text" 
          placeholder="Nom / Email / Matricule" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 pr-24 bg-secondary text-foreground"
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
          className="border rounded p-2 text-sm md:ml-auto bg-secondary text-foreground border-border"
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
  );
};

export default EmployeeSearchBar;
