
import React from "react";
import { Loader2, User } from "lucide-react";
import { EmployeeUI } from "@/types/employee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EmployeeTableProps {
  employees: EmployeeUI[];
  isLoading: boolean;
  isError: boolean;
  onRowClick?: (employee: EmployeeUI) => void;
}

const EmployeeTable = ({ employees, isLoading, isError, onRowClick }: EmployeeTableProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md">
        Erreur lors du chargement des employés. Veuillez réessayer.
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="w-full bg-muted p-6 text-center rounded-md border">
        Aucun employé trouvé. Utilisez le bouton "Ajouter un employé" pour en créer un.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">MATRICULE</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">NOM & PRÉNOM</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">POSTE</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">EMPLOYEUR</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">STATUT</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr 
                key={employee.id} 
                className="border-t hover:bg-muted/50 cursor-pointer"
                onClick={() => onRowClick?.(employee)}
              >
                <td className="py-3 px-4">{employee.matricule}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {employee.avatar ? (
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                      ) : (
                        <AvatarFallback>
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {employee.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{employee.position}</td>
                <td className="py-3 px-4">{employee.employer}</td>
                <td className="py-3 px-4 text-right">
                  <Badge
                    variant={
                      employee.status === "active"
                        ? "success"
                        : employee.status === "on-leave"
                        ? "secondary"
                        : "destructive"
                    }
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {employee.status === "active"
                      ? "Actif"
                      : employee.status === "on-leave"
                      ? "En congé"
                      : "Terminé"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
