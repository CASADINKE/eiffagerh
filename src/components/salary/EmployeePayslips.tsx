
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payslip } from "@/services/payslipService";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EmployeePayslipsProps {
  employeeId: string;
}

export default function EmployeePayslips({ employeeId }: EmployeePayslipsProps) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayslips();
  }, [employeeId]);

  const fetchPayslips = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bulletins_paie")
      .select("*")
      .eq("matricule", employeeId);
    
    if (!error) {
      setPayslips(data as Payslip[]);
    } else {
      console.error("Error fetching payslips:", error);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Historique des Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">Chargement des données...</div>
        ) : payslips.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucun bulletin de paie trouvé pour cet employé
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Net à Payer</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Mode de Paiement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((payslip) => (
                <TableRow key={payslip.id}>
                  <TableCell>{payslip.periode_paie}</TableCell>
                  <TableCell>{payslip.net_a_payer.toLocaleString('fr-FR')} FCFA</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payslip.statut_paiement} />
                  </TableCell>
                  <TableCell>{payslip.mode_paiement || "Non défini"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
