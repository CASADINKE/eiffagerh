
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Payslip, SalaryPayment } from "@/services/salaryPaymentService";

interface PayslipsListProps {
  payslips: Payslip[] | undefined;
  latestPayment: SalaryPayment | null;
  onViewPayslip: (payslip: Payslip) => void;
}

export function PayslipsList({ payslips, latestPayment, onViewPayslip }: PayslipsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Bulletins de paie</CardTitle>
      </CardHeader>
      <CardContent>
        {!latestPayment ? (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">
              Aucun paiement de salaire créé. Cliquez sur "Paiement Salaire" pour commencer.
            </p>
          </div>
        ) : payslips && payslips.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="w-full border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-3 text-left font-medium">Employé</TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">Poste</TableHead>
                  <TableHead className="px-4 py-3 text-right font-medium">Salaire brut</TableHead>
                  <TableHead className="px-4 py-3 text-right font-medium">Cotisations</TableHead>
                  <TableHead className="px-4 py-3 text-right font-medium">Salaire net</TableHead>
                  <TableHead className="px-4 py-3 text-center font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.id} className="border-b hover:bg-muted/30">
                    <TableCell className="px-4 py-3 font-medium">{payslip.employee?.full_name || "Employé"}</TableCell>
                    <TableCell className="px-4 py-3">{payslip.employee?.role || "N/A"}</TableCell>
                    <TableCell className="px-4 py-3 text-right">{payslip.base_salary.toLocaleString()} FCFA</TableCell>
                    <TableCell className="px-4 py-3 text-right text-red-500">
                      -{(payslip.deductions + payslip.tax_amount).toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium">{payslip.net_salary.toLocaleString()} FCFA</TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => onViewPayslip(payslip)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            toast.success(`Bulletin téléchargé`);
                          }}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">
              Aucun bulletin de paie généré. Cliquez sur "Générer les bulletins de paie" pour commencer.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
