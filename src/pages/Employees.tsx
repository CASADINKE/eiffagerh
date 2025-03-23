
import { useState, useMemo } from "react";
import { Plus, RotateCcw, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import { useEmployees } from "@/hooks/useEmployees";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { toast } from "sonner";

const Employees = () => {
  const { data: employees = [], isLoading, isError } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Extraction des départements uniques
  const departments = useMemo(() => {
    return [...new Set(employees.map(emp => emp.department))];
  }, [employees]);

  // Filtrage des employés
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, searchTerm, statusFilter, departmentFilter]);

  const handleAddEmployee = () => {
    toast.info("Fonctionnalité à implémenter");
  };

  const handleExport = () => {
    toast.info("Fonctionnalité d'exportation à implémenter");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-6 py-2">
        <div className="flex items-center text-muted-foreground text-sm">
          <Button variant="ghost" size="sm" className="gap-1 p-0">
            <ArrowLeft size={14} />
            Accueil
          </Button>
          <span className="mx-2">/</span>
          <span>Employés</span>
        </div>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-lg font-medium">Employés</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <RotateCcw size={14} />
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink size={14} />
            </Button>
            <Button variant="default" size="sm" className="gap-1" onClick={handleAddEmployee}>
              <Plus size={14} />
              <span>Ajouter</span>
            </Button>
          </div>
        </div>

        <div className="p-4 border-b">
          <EmployeeFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            departments={departments}
          />

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-1">
              Ajouter
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              Suspendus
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              Supprimés
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="py-10 text-center">
            <p className="text-destructive">Erreur lors du chargement des données. Veuillez réessayer.</p>
          </div>
        ) : (
          <div className="p-4">
            {filteredEmployees.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                            employee.status === 'on-leave' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                            'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {employee.status === 'active' ? 'Actif' : 
                             employee.status === 'on-leave' ? 'En congé' : 'Terminé'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Affichage de {filteredEmployees.length} sur {employees.length} employés
                  </div>
                  <div className="flex gap-2">
                    <select className="border rounded p-1 text-sm">
                      <option>Action groupée</option>
                    </select>
                    <Button variant="default" size="sm" className="gap-1" onClick={handleExport}>
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                <span className="flex items-center">
                  Aucun élément trouvé.
                  <button className="ml-auto text-yellow-600">&times;</button>
                </span>
              </div>
            )}
            
            {filteredEmployees.length === 0 && (
              <div className="flex justify-center mt-6">
                <Button variant="default" className="gap-1" onClick={handleAddEmployee}>
                  <Plus size={16} />
                  Nouvel employé
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
