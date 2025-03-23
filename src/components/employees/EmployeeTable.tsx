
import { Employee } from "@/hooks/useEmployees";
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
  employees: Employee[];
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
            employee.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
            employee.status === 'on-leave' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
            'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {employee.status === 'active' ? 'Actif' : 
             employee.status === 'on-leave' ? 'En congé' : 'Terminé'}
          </span>
        </TableCell>
      </TableRow>
    ));
  };

  return (
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
  );
};

export default EmployeeTable;
