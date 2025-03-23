
import React from "react";
import { Eye, FileDown, ChevronRight } from "lucide-react";
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
import { SalaryPayment } from "@/services/salaryPaymentService";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToCSV } from "@/utils/exportUtils";
import { toast } from "sonner";

interface SalaryPaymentsTableProps {
  payments: SalaryPayment[];
  isLoading: boolean;
}

export function SalaryPaymentsTable({ payments, isLoading }: SalaryPaymentsTableProps) {
  console.log("SalaryPaymentsTable received payments:", payments);
  
  if (isLoading) {
    return (
      <Card>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold">Historique des paiements de salaire</h2>
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

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold">Historique des paiements de salaire</h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Aucun paiement de salaire trouvé. Créez votre premier paiement de salaire en cliquant sur "Paiement Salaire".</p>
        </div>
      </Card>
    );
  }

  const handleExportPayment = (payment: SalaryPayment) => {
    const paymentData = [{
      periode: payment.payment_period,
      date_paiement: payment.payment_date ? format(parseISO(payment.payment_date), 'dd MMMM yyyy', { locale: fr }) : "Non définie",
      methode: payment.payment_method === 'virement' ? 'Virement bancaire' :
               payment.payment_method === 'cheque' ? 'Chèque' :
               payment.payment_method === 'especes' ? 'Espèces' : 
               payment.payment_method === 'mobile' ? 'Paiement mobile' : 
               payment.payment_method,
      montant_total: payment.total_amount,
      statut: payment.status === 'completed' ? 'Terminé' : 
              payment.status === 'pending' ? 'En attente' : 
              payment.status
    }];

    exportToCSV(
      paymentData,
      `paiement-salaire-${payment.payment_period.replace(/\s/g, "-")}`,
      {
        periode: "Période",
        date_paiement: "Date de paiement",
        methode: "Méthode de paiement",
        montant_total: "Montant total",
        statut: "Statut"
      }
    );
    
    toast.success(`Détails du paiement pour ${payment.payment_period} exportés avec succès`);
  };

  return (
    <Card>
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold">Historique des paiements de salaire</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Période</TableHead>
              <TableHead>Date de paiement</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead className="text-right">Montant total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.payment_period}</TableCell>
                <TableCell>
                  {payment.payment_date ? 
                    format(parseISO(payment.payment_date), 'dd MMMM yyyy', { locale: fr }) :
                    "Non définie"}
                </TableCell>
                <TableCell>
                  {payment.payment_method === 'virement' ? 'Virement bancaire' :
                   payment.payment_method === 'cheque' ? 'Chèque' :
                   payment.payment_method === 'especes' ? 'Espèces' : 
                   payment.payment_method === 'mobile' ? 'Paiement mobile' : 
                   payment.payment_method}
                </TableCell>
                <TableCell className="text-right">{payment.total_amount.toLocaleString()} FCFA</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      payment.status === 'completed' ? "success" : 
                      payment.status === 'pending' ? "outline" : 
                      "secondary"
                    }
                  >
                    {payment.status === 'completed' ? 'Terminé' : 
                     payment.status === 'pending' ? 'En attente' : 
                     payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      asChild
                      title="Voir les détails"
                    >
                      <Link to={`/salary-payment/${payment.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      title="Exporter"
                      onClick={() => handleExportPayment(payment)}
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
    </Card>
  );
}
