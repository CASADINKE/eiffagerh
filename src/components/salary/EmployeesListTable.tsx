
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { Loader2 } from "lucide-react";
import { formatDateFR } from "@/utils/exportUtils";

interface EmployeesListTableProps {
  employees: Employee[];
  isLoading: boolean;
}

export function EmployeesListTable({ employees, isLoading }: EmployeesListTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des employés</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : employees.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Aucun employé trouvé
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Affectation</TableHead>
                  <TableHead>Site</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.matricule}</TableCell>
                    <TableCell>{employee.nom}</TableCell>
                    <TableCell>{employee.prenom}</TableCell>
                    <TableCell>{employee.poste}</TableCell>
                    <TableCell>{formatDateFR(employee.date_naissance)}</TableCell>
                    <TableCell>{employee.telephone}</TableCell>
                    <TableCell>{employee.adresse}</TableCell>
                    <TableCell>{employee.affectation}</TableCell>
                    <TableCell>{employee.site}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
