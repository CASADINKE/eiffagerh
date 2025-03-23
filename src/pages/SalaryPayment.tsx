import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEmployees } from "@/hooks/useEmployees";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { createPayslips } from "@/services/payslipService";
import { useSalaryPayments, usePayslipsByPaymentId } from "@/hooks/useSalaryPayments";
import { SalaryPaymentDialog } from "@/components/salary/SalaryPaymentDialog";
import { PayslipsList } from "@/components/salary/PayslipsList";
import { PayslipDetails } from "@/components/salary/PayslipDetails";
import { Payslip } from "@/services/payslipService";
import { exportToCSV } from "@/utils/exportUtils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";

const SalaryPayment = () => {
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees();
  const { data: payments, isLoading: isLoadingPayments } = useSalaryPayments();
  
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const { data: payslips, isLoading: isLoadingPayslips } = usePayslipsByPaymentId(selectedPaymentId);
  
  const [generatingPayslips, setGeneratingPayslips] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const currentMonth = format(currentDate, 'MMMM yyyy', { locale: fr });
  
  const latestPayment = payments && payments.length > 0 
    ? payments[0] 
    : null;
  
  const generatePayslips = async () => {
    if (!latestPayment || !employees || employees.length === 0) {
      toast.error("Aucun employé ou paiement disponible pour générer les bulletins");
      return;
    }
    
    setGeneratingPayslips(true);
    
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser || !authUser.user) {
        toast.error("Utilisateur non connecté");
        setGeneratingPayslips(false);
        return;
      }
      
      const profilePromises = employees.map(async (employee) => {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', employee.id)
          .single();
        
        if (!existingProfile) {
          await supabase
            .from('profiles')
            .insert({
              id: employee.id,
              full_name: `${employee.prenom} ${employee.nom}`,
              role: employee.poste || "Employé",
              avatar_url: null,
              department_id: null,
              updated_at: new Date().toISOString()
            });
        }
        
        return employee;
      });
      
      await Promise.all(profilePromises);
      
      const newPayslips = employees.map(employee => {
        const baseSalary = Math.floor(Math.random() * 300000) + 150000;
        const allowances = Math.floor(baseSalary * 0.2);
        const deductions = Math.floor(baseSalary * 0.1);
        const taxAmount = Math.floor(baseSalary * 0.15);
        const netSalary = baseSalary + allowances - deductions - taxAmount;
        
        return {
          employee_id: employee.id,
          salary_payment_id: latestPayment.id,
          base_salary: baseSalary,
          allowances,
          deductions,
          tax_amount: taxAmount,
          net_salary: netSalary,
          status: 'generated'
        };
      });
      
      const success = await createPayslips(newPayslips);
      
      if (success) {
        setSelectedPaymentId(latestPayment.id);
        queryClient.invalidateQueries({queryKey: ["payslips"]});
        queryClient.invalidateQueries({queryKey: ["salary-payments"]});
        toast.success(`${newPayslips.length} bulletins de paie générés avec succès`);
      }
    } catch (error) {
      console.error("Error generating payslips:", error);
      toast.error("Erreur lors de la génération des bulletins de paie");
    } finally {
      setGeneratingPayslips(false);
    }
  };
  
  const showPayslipPreview = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setShowPreview(true);
  };
  
  const closePreview = () => {
    setShowPreview(false);
    setSelectedPayslip(null);
  };
  
  const printPayslip = () => {
    window.print();
    toast.success("Bulletin de paie envoyé à l'imprimante");
  };
  
  const downloadPayslip = () => {
    if (!selectedPayslip) return;
    
    const payslipData = [{
      id: selectedPayslip.id,
      employee: selectedPayslip.employee?.full_name || "Employé",
      poste: selectedPayslip.employee?.role || "N/A",
      periode: latestPayment?.payment_period || currentMonth,
      salaire_base: selectedPayslip.base_salary,
      indemnites: selectedPayslip.allowances,
      deductions: selectedPayslip.deductions,
      impots: selectedPayslip.tax_amount,
      salaire_net: selectedPayslip.net_salary,
      mode_paiement: latestPayment?.payment_method || "virement bancaire"
    }];
    
    exportToCSV(
      payslipData,
      `bulletin-paie-${selectedPayslip.employee?.full_name || "employe"}-${(latestPayment?.payment_period || currentMonth).replace(/\s/g, "-")}`,
      {
        id: "Identifiant",
        employee: "Employé",
        poste: "Poste",
        periode: "Période",
        salaire_base: "Salaire de base",
        indemnites: "Indemnités",
        deductions: "Déductions",
        impots: "Impôts",
        salaire_net: "Salaire net",
        mode_paiement: "Mode de paiement"
      }
    );
    
    toast.success("Bulletin de paie téléchargé");
    setTimeout(() => {
      closePreview();
    }, 1500);
  };
  
  const isLoading = isLoadingEmployees || isLoadingPayments || isLoadingPayslips;
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Paiement des Salaires</h1>
          <p className="text-muted-foreground">Générez et gérez les bulletins de paie des employés</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <SalaryPaymentDialog />
          <Button 
            onClick={generatePayslips} 
            disabled={generatingPayslips || isLoading || !latestPayment}
          >
            {generatingPayslips ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              "Générer les bulletins de paie"
            )}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Résumé de la paie - {latestPayment ? latestPayment.payment_period : currentMonth}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-600 font-medium">Employés</p>
                  <p className="text-2xl font-bold">{employees?.length || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-green-600 font-medium">Bulletins générés</p>
                  <p className="text-2xl font-bold">{payslips?.length || 0}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <p className="text-amber-600 font-medium">Montant total</p>
                  <p className="text-2xl font-bold">
                    {payslips ? payslips.reduce((sum, p) => sum + p.net_salary, 0).toLocaleString() : 0} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <PayslipsList 
            payslips={payslips} 
            latestPayment={latestPayment} 
            onViewPayslip={showPayslipPreview} 
          />
          
          {showPreview && selectedPayslip && (
            <PayslipDetails 
              payslip={selectedPayslip}
              paymentPeriod={latestPayment?.payment_period || currentMonth}
              paymentMethod={latestPayment?.payment_method || "virement bancaire"}
              onClose={closePreview}
              onPrint={printPayslip}
              onDownload={downloadPayslip}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SalaryPayment;
