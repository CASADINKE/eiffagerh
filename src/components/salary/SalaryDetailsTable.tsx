
import React from "react";
import { Edit, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SalaryDetail } from "@/services/salaryDetailsService";
import { SalaryDetailDialog } from "./SalaryDetailDialog";

interface SalaryDetailsTableProps {
  salaryDetails: SalaryDetail[];
  isLoading: boolean;
}

export function SalaryDetailsTable({ salaryDetails, isLoading }: SalaryDetailsTableProps) {
  const [editingSalaryDetail, setEditingSalaryDetail] = React.useState<SalaryDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleEdit = (salaryDetail: SalaryDetail) => {
    setEditingSalaryDetail(salaryDetail);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingSalaryDetail(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSalaryDetail(null);
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold">Détails des salaires</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold">Détails des salaires</h2>
        <Button onClick={handleAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter un détail de salaire
        </Button>
      </div>
      <div className="overflow-x-auto">
        {salaryDetails.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Aucun détail de salaire trouvé. Ajoutez des détails de salaire en cliquant sur le bouton ci-dessus.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Type de contrat</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead className="text-right">Salaire de base</TableHead>
                <TableHead>Fréquence</TableHead>
                <TableHead>Taux d'imposition</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryDetails.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell className="font-medium">{detail.employee?.full_name || "N/A"}</TableCell>
                  <TableCell>{detail.employee?.role || "N/A"}</TableCell>
                  <TableCell>{detail.contract_type}</TableCell>
                  <TableCell>{detail.pay_grade || "N/A"}</TableCell>
                  <TableCell className="text-right">{detail.base_salary.toLocaleString()} {detail.currency}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {detail.payment_frequency === 'monthly' ? 'Mensuel' : 
                       detail.payment_frequency === 'biweekly' ? 'Bimensuel' : 
                       detail.payment_frequency === 'weekly' ? 'Hebdomadaire' : 
                       detail.payment_frequency}
                    </Badge>
                  </TableCell>
                  <TableCell>{detail.tax_rate ? `${(detail.tax_rate * 100).toFixed(1)}%` : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(detail)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      <span>Modifier</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {isDialogOpen && (
        <SalaryDetailDialog 
          open={isDialogOpen} 
          onOpenChange={handleCloseDialog} 
          salaryDetail={editingSalaryDetail} 
        />
      )}
    </Card>
  );
}
