
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSalaryPayments } from "@/hooks/useSalaryPayments";
import { useSalaryDetails } from "@/hooks/useSalaryDetails";
import { SalaryPaymentsTable } from "@/components/salary/SalaryPaymentsTable";
import { SalaryDetailsTable } from "@/components/salary/SalaryDetailsTable";
import { SalaryPaymentDialog } from "@/components/salary/SalaryPaymentDialog";
import { Link } from "react-router-dom";
import { SalaryHeader } from "@/components/salary/SalaryHeader";
import { exportToCSV } from "@/utils/exportUtils";
import { toast } from "sonner";
import { SalaryDetailDialog } from "@/components/salary/SalaryDetailDialog";

const Salary = () => {
  const { data: salaryPayments, isLoading: isLoadingPayments } = useSalaryPayments();
  const { data: salaryDetails, isLoading: isLoadingDetails } = useSalaryDetails();
  const [isSalaryDetailDialogOpen, setIsSalaryDetailDialogOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Log de débogage pour vérifier les données récupérées
  console.log("Salary payments data:", salaryPayments);
  console.log("Salary details data:", salaryDetails);

  const handleExportPayslips = (format?: string) => {
    if (!salaryPayments || salaryPayments.length === 0) {
      toast.error("Aucune donnée de paiement à exporter");
      return;
    }

    if (format === 'csv') {
      const exportData = salaryPayments.map(payment => ({
        periode: payment.payment_period,
        date: payment.payment_date,
        methode: payment.payment_method,
        montant: payment.total_amount,
        statut: payment.status
      }));

      exportToCSV(
        exportData,
        "paiements-salaires",
        {
          periode: "Période",
          date: "Date de paiement",
          methode: "Méthode",
          montant: "Montant total",
          statut: "Statut"
        }
      );
      
      toast.success("Données exportées avec succès en CSV");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <SalaryHeader exportPayslips={handleExportPayslips} />

      <div className="grid gap-6 salary-content" ref={contentRef}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Détails des salaires</h2>
          <Button 
            onClick={() => setIsSalaryDetailDialogOpen(true)}
            size="sm"
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter un salaire
          </Button>
        </div>

        <SalaryDetailsTable 
          salaryDetails={salaryDetails || []} 
          isLoading={isLoadingDetails} 
        />
        
        <SalaryPaymentsTable 
          payments={salaryPayments || []} 
          isLoading={isLoadingPayments} 
        />
      </div>

      <SalaryDetailDialog 
        open={isSalaryDetailDialogOpen}
        onOpenChange={setIsSalaryDetailDialogOpen}
        onSuccess={() => {
          toast.success("Détails du salaire enregistrés avec succès");
        }}
      />

      <div className="fixed bottom-8 right-8">
        <SalaryPaymentDialog />
      </div>
    </div>
  );
};

export default Salary;
