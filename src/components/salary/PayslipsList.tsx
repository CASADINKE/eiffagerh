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
import { Eye, FileDown, FileText, File } from "lucide-react";
import { toast } from "sonner";
import { Payslip } from "@/services/payslipService";
import { SalaryPayment } from "@/services/salaryPaymentService";
import { exportToCSV } from "@/utils/exportUtils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PayslipsListProps {
  payslips: Payslip[] | undefined;
  latestPayment: SalaryPayment | null;
  onViewPayslip: (payslip: Payslip) => void;
}

export function PayslipsList({ payslips, latestPayment, onViewPayslip }: PayslipsListProps) {
  
  const handleDownloadPayslip = (payslip: Payslip) => {
    const payslipData = [{
      id: payslip.id,
      employee: payslip.employee?.full_name || "Employé",
      poste: payslip.employee?.role || "N/A",
      periode: latestPayment?.payment_period || "Période actuelle",
      salaire_base: payslip.base_salary,
      indemnites: payslip.allowances,
      deductions: payslip.deductions,
      impots: payslip.tax_amount,
      salaire_net: payslip.net_salary,
      mode_paiement: latestPayment?.payment_method || "virement bancaire"
    }];

    exportToCSV(
      payslipData,
      `bulletin-paie-${payslip.employee?.full_name || "employe"}-${latestPayment?.payment_period?.replace(/\s/g, "-") || "periode"}`,
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
    
    toast.success(`Bulletin téléchargé pour ${payslip.employee?.full_name || "l'employé"}`);
  };

  const handleDownloadPDF = async (payslip: Payslip) => {
    onViewPayslip(payslip);
    
    setTimeout(async () => {
      try {
        const payslipElement = document.querySelector(".payslip-content") as HTMLElement;
        
        if (!payslipElement) {
          toast.error("Impossible de générer le PDF. Élément non trouvé.");
          return;
        }
        
        toast.info("Génération du PDF en cours...");
        
        const canvas = await html2canvas(payslipElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff"
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`bulletin-paie-${payslip.employee?.full_name || "employe"}-${latestPayment?.payment_period?.replace(/\s/g, "-") || "periode"}.pdf`);
        
        toast.success(`Bulletin PDF téléchargé pour ${payslip.employee?.full_name || "l'employé"}`);
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 500);
  };

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
                          title="Voir"
                          onClick={() => onViewPayslip(payslip)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              title="Exporter"
                            >
                              <FileDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownloadPayslip(payslip)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Télécharger CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(payslip)}>
                              <File className="mr-2 h-4 w-4" />
                              Télécharger PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
