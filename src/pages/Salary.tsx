
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSalaryPayments } from "@/hooks/useSalaryPayments";
import { SalaryPaymentsTable } from "@/components/salary/SalaryPaymentsTable";
import { SalaryPaymentDialog } from "@/components/salary/SalaryPaymentDialog";
import { Link } from "react-router-dom";

const Salary = () => {
  const { data: salaryPayments, isLoading: isLoadingPayments } = useSalaryPayments();
  
  // Log de débogage pour vérifier les données récupérées
  console.log("Salary payments data:", salaryPayments);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Salaires</h1>
          <p className="text-muted-foreground">
            Gérez les paiements de salaire et les bulletins de paie des employés
          </p>
        </div>
        <div className="flex gap-2">
          <SalaryPaymentDialog />
          <Button asChild>
            <Link to="/salary-payment">
              <PlusCircle className="h-4 w-4 mr-2" />
              Bulletins de paie
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <SalaryPaymentsTable 
          payments={salaryPayments || []} 
          isLoading={isLoadingPayments} 
        />
      </div>
    </div>
  );
};

export default Salary;
