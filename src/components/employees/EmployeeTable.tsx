
import { EmployeeUI } from "@/types/employee";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeTableProps {
  employees: EmployeeUI[];
  isLoading: boolean;
  isError: boolean;
}

const EmployeeTable = ({ employees, isLoading, isError }: EmployeeTableProps) => {
  const renderTableContent = () => {
    if (isLoading) {
      return Array(5).fill(0).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
          <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
        </TableRow>
      ));
    }

    if (employees.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            Aucun employé trouvé.
          </TableCell>
        </TableRow>
      );
    }

    return employees.map((employee) => (
      <TableRow key={employee.id}>
        <TableCell className="font-medium">{employee.name}</TableCell>
        <TableCell>{employee.email}</TableCell>
        <TableCell>{employee.department}</TableCell>
        <TableCell>{employee.position}</TableCell>
        <TableCell>
          <span className={`px-2 py-1 text-xs rounded-full ${
            employee.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' :
            employee.status === 'on-leave' ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50' :
            'bg-red-900/30 text-red-400 border border-red-800/50'
          }`}>
            {employee.status === 'active' ? 'Actif' : 
             employee.status === 'on-leave' ? 'En congé' : 'Terminé'}
          </span>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="border border-border rounded-md overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="font-semibold text-foreground">MATRICULE</TableHead>
            <TableHead className="font-semibold text-foreground">NOM & PRÉNOM</TableHead>
            <TableHead className="font-semibold text-foreground">POSTE</TableHead>
            <TableHead className="font-semibold text-foreground">SITE</TableHead>
            <TableHead className="font-semibold text-foreground">TÉLÉPHONE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-destructive">
                Erreur lors du chargement des données. Veuillez réessayer.
              </TableCell>
            </TableRow>
          ) : (
            renderTableContent()
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
