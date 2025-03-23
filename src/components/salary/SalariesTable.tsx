
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SalaryData {
  id: string;
  employee: string;
  position: string;
  department: string;
  baseSalary: number;
  bonus: number;
  totalSalary: number;
  paymentStatus: string;
  lastPayment: string;
}

interface SalariesTableProps {
  filteredData: SalaryData[];
  departmentFilter: string;
  setDepartmentFilter: (filter: string) => void;
  departments: string[];
}

export function SalariesTable({ 
  filteredData, 
  departmentFilter, 
  setDepartmentFilter,
  departments 
}: SalariesTableProps) {
  return (
    <Card className="mb-8">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-lg font-semibold">Salaires des employés</h2>
        <div className="w-full sm:w-auto">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrer par département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Département</TableHead>
              <TableHead className="text-right">Salaire de base</TableHead>
              <TableHead className="text-right">Prime</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Dernier paiement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.employee}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell className="text-right">{item.baseSalary.toLocaleString()} FCFA</TableCell>
                <TableCell className="text-right">{item.bonus.toLocaleString()} FCFA</TableCell>
                <TableCell className="text-right font-medium">{item.totalSalary.toLocaleString()} FCFA</TableCell>
                <TableCell>{new Date(item.lastPayment).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Modifier le salaire</DropdownMenuItem>
                      <DropdownMenuItem>Historique des salaires</DropdownMenuItem>
                      <DropdownMenuItem>Générer la fiche de paie</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
