
import { Download, FileText } from "lucide-react";
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

interface PayslipData {
  id: string;
  employee: string;
  position: string;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
  date: string;
}

interface PayslipsTableProps {
  paySlipData: PayslipData[];
}

export function PayslipsTable({ paySlipData }: PayslipsTableProps) {
  return (
    <Card>
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-lg font-semibold">Bulletins de paie</h2>
        <div className="flex gap-3">
          <Select defaultValue="mai-2024">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mai-2024">Mai 2024</SelectItem>
              <SelectItem value="avril-2024">Avril 2024</SelectItem>
              <SelectItem value="mars-2024">Mars 2024</SelectItem>
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
              <TableHead>Période</TableHead>
              <TableHead className="text-right">Salaire de base</TableHead>
              <TableHead className="text-right">Indemnités</TableHead>
              <TableHead className="text-right">Déductions</TableHead>
              <TableHead className="text-right">Net à payer</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paySlipData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.employee}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.period}</TableCell>
                <TableCell className="text-right">{item.baseSalary.toLocaleString()} FCFA</TableCell>
                <TableCell className="text-right">{item.allowances.toLocaleString()} FCFA</TableCell>
                <TableCell className="text-right">{item.deductions.toLocaleString()} FCFA</TableCell>
                <TableCell className="text-right font-medium">{item.netSalary.toLocaleString()} FCFA</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Visualiser
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>Envoyer par email</DropdownMenuItem>
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
