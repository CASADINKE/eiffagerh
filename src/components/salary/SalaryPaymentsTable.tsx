
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

interface SalaryPaymentsTableProps {
  payments: SalaryPayment[];
  isLoading: boolean;
}

export function SalaryPaymentsTable({ payments, isLoading }: SalaryPaymentsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Chargement des paiements...</p>
        </div>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Aucun paiement de salaire trouvé</p>
        </div>
      </Card>
    );
  }

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
                <TableCell>{format(parseISO(payment.payment_date), 'dd MMMM yyyy', { locale: fr })}</TableCell>
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
                      size="sm" 
                      asChild
                    >
                      <Link to={`/salary-payment/${payment.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        <span>Détails</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // This would be replaced with actual export functionality
                        alert(`Export des bulletins pour ${payment.payment_period}`);
                      }}
                    >
                      <FileDown className="h-4 w-4 mr-1" />
                      <span>Exporter</span>
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
