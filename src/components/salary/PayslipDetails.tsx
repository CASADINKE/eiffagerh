
import React, { useRef } from "react";
import { Printer, FileDown, X, FilePdf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Payslip } from "@/services/salaryPaymentService";
import { format } from "date-fns";
import { exportToCSV } from "@/utils/exportUtils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PayslipDetailsProps {
  payslip: Payslip;
  paymentPeriod?: string;
  paymentMethod?: string;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

export function PayslipDetails({ 
  payslip, 
  paymentPeriod, 
  paymentMethod = "virement bancaire",
  onClose, 
  onPrint, 
  onDownload 
}: PayslipDetailsProps) {
  const payslipRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // Prepare payslip data for download
    const payslipData = [{
      id: payslip.id,
      employee: payslip.employee?.full_name || "Employé",
      poste: payslip.employee?.role || "N/A",
      periode: paymentPeriod || format(new Date(), 'MMMM yyyy'),
      salaire_base: payslip.base_salary,
      indemnites: payslip.allowances,
      deductions: payslip.deductions,
      impots: payslip.tax_amount,
      salaire_net: payslip.net_salary,
      mode_paiement: paymentMethod
    }];

    // Use the exportToCSV function from exportUtils
    exportToCSV(
      payslipData,
      `bulletin-paie-${payslip.employee?.full_name || "employe"}-${paymentPeriod?.replace(/\s/g, "-") || "periode"}`,
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
    
    // Call the onDownload prop
    onDownload();
  };

  const handleDownloadPDF = async () => {
    if (!payslipRef.current) {
      toast.error("Impossible de générer le PDF");
      return;
    }

    try {
      toast.info("Génération du PDF en cours...");
      
      const canvas = await html2canvas(payslipRef.current, {
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
      
      // Calculate dimensions to fit the content properly
      const imgWidth = 210; // A4 width in mm (210mm)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`bulletin-paie-${payslip.employee?.full_name || "employe"}-${paymentPeriod?.replace(/\s/g, "-") || "periode"}.pdf`);
      
      toast.success(`Bulletin PDF téléchargé`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-blue-800">
          <h2 className="text-xl font-bold text-white">Bulletin de paie</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold" 
              onClick={onPrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button 
              size="sm" 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold" 
              onClick={handleDownload}
            >
              <FileDown className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button 
              size="sm" 
              variant="default" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold" 
              onClick={handleDownloadPDF}
            >
              <FilePdf className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white border-gray-400 hover:bg-gray-100 font-medium"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto p-6 bg-gray-100">
          <div ref={payslipRef} className="payslip-content border rounded-md overflow-hidden shadow-lg bg-white">
            {/* En-tête du bulletin */}
            <div className="text-center font-bold text-lg py-3 border-b bg-gray-900 text-white">
              BULLETIN DE PAIE
            </div>
            
            <div className="flex border-b">
              {/* Partie gauche - Information employeur */}
              <div className="w-1/2 p-4 border-r bg-gray-100">
                <div className="font-bold text-gray-900 text-base">Employeur</div>
                <div className="flex items-center mt-2">
                  <img 
                    src="/lovable-uploads/5bf70fa7-08a9-4818-b349-27239b6e83cf.png" 
                    alt="EIFFAGE" 
                    className="h-8 mr-2"
                  />
                  <div>
                    <div className="font-bold text-gray-900">EIFFAGE</div>
                    <div className="text-gray-800 font-medium">ÉNERGIE</div>
                    <div className="text-sm text-gray-700 font-medium">T&D Sénégal</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-800 font-medium">
                  AV FÉLIX EBOUÉ 5 KM DES BRAS<br />
                  BP<br />
                  DAKAR SÉNÉGAL
                </div>
              </div>
              
              {/* Partie droite - Information paie */}
              <div className="w-1/2 p-4 bg-gray-100">
                <div className="text-right">
                  <div className="text-gray-900 font-medium">Période de paie: <span className="font-bold">{paymentPeriod || format(new Date(), 'MMMM yyyy')}</span></div>
                  <div className="mt-2">
                    <div className="text-gray-800 font-medium">Matricule: <span className="font-bold">{payslip.employee_id.substring(0, 5)}</span></div>
                    <div className="font-bold text-gray-900">{payslip.employee?.full_name || "Employé"}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Corps du bulletin */}
            <div className="px-4 py-2 border-b bg-blue-800 text-white font-semibold">
              Convention Collective Nationale
            </div>
            
            <div className="border-b">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 text-sm">
                    <th className="border-r px-2 py-1 text-left font-bold text-gray-900">Rubrique</th>
                    <th className="border-r px-2 py-1 text-center font-bold text-gray-900">Statut</th>
                    <th className="border-r px-2 py-1 text-center font-bold text-gray-900">Parts IR</th>
                    <th className="border-r px-2 py-1 text-center font-bold text-gray-900">Qualification</th>
                    <th className="px-2 py-1 text-center font-bold text-gray-900">Date Naissance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-sm bg-white">
                    <td className="border-r px-2 py-1 font-medium text-gray-800">10/10/23</td>
                    <td className="border-r px-2 py-1 text-center font-medium text-gray-800">E.R</td>
                    <td className="border-r px-2 py-1 text-center font-medium text-gray-800">1</td>
                    <td className="border-r px-2 py-1 text-center font-medium text-gray-800">{payslip.employee?.role || "EMPLOYE"}</td>
                    <td className="px-2 py-1 text-center font-medium text-gray-800">10/10/1988</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Détails des rubriques */}
            <table className="w-full">
              <thead>
                <tr className="bg-gray-300 text-sm">
                  <th className="border-r px-2 py-2 text-left font-bold text-gray-900">Libellé</th>
                  <th className="border-r px-2 py-2 text-center font-bold text-gray-900">Nombre ou Base</th>
                  <th className="border-r px-2 py-2 text-center font-bold text-gray-900">Taux</th>
                  <th className="border-r px-2 py-2 text-center font-bold text-gray-900">Retenue Salariale</th>
                  <th className="border-r px-2 py-2 text-center font-bold text-gray-900">Gain</th>
                  <th className="border-r px-2 py-2 text-center font-bold text-gray-900">Taux Employeur</th>
                  <th className="px-2 py-2 text-center font-bold text-gray-900">Montant Employeur</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm bg-white hover:bg-gray-50">
                  <td className="border-r px-2 py-2 font-medium text-gray-800">101 Salaire de base du mois</td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">{payslip.base_salary.toLocaleString()}</td>
                  <td className="border-r px-2 py-2 text-center font-medium text-gray-800">1.00</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">{payslip.base_salary.toLocaleString()}</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                </tr>
                <tr className="text-sm bg-blue-100 hover:bg-blue-200">
                  <td className="border-r px-2 py-2 font-medium text-gray-800">105 IPRES</td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">{payslip.base_salary.toLocaleString()}</td>
                  <td className="border-r px-2 py-2 text-center font-medium text-gray-800">0.0580</td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">{Math.floor(payslip.base_salary * 0.058).toLocaleString()}</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2 text-center font-medium text-gray-800">0.0870</td>
                  <td className="px-2 py-2 text-right font-medium text-gray-800">{Math.floor(payslip.base_salary * 0.087).toLocaleString()}</td>
                </tr>
                <tr className="text-sm bg-white hover:bg-gray-50">
                  <td className="border-r px-2 py-2 font-medium text-gray-800">317 Indemnité de déplacement</td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">{Math.floor(payslip.allowances * 0.7).toLocaleString()}</td>
                  <td className="border-r px-2 py-2 text-center font-medium text-gray-800">1.000</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">{Math.floor(payslip.allowances * 0.7).toLocaleString()}</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                </tr>
                <tr className="text-sm bg-blue-100 hover:bg-blue-200">
                  <td className="border-r px-2 py-2 font-medium text-gray-800">420 Prime de transport</td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">26 000</td>
                  <td className="border-r px-2 py-2 text-center font-medium text-gray-800">1.000</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">26 000</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                </tr>
                <tr className="text-sm bg-white hover:bg-gray-50">
                  <td className="border-r px-2 py-2 font-medium text-gray-800">401 Impôt général</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">{payslip.tax_amount.toLocaleString()}</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                </tr>
                <tr className="text-sm bg-blue-100 hover:bg-blue-200">
                  <td className="border-r px-2 py-2 font-medium text-gray-800">410 TRIMF</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">3 000</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                </tr>
                <tr className="text-sm bg-white hover:bg-gray-50">
                  <td className="border-r px-2 py-2 font-medium text-gray-800">6673 Acompte sur prêt</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2 text-right font-medium text-gray-800">{Math.floor(payslip.deductions - 3000).toLocaleString()}</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-gray-900 text-sm font-bold text-white">
                  <td className="border-r px-2 py-2 text-right" colSpan={2}>TOTAUX</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="border-r px-2 py-2 text-right">{(payslip.deductions + payslip.tax_amount).toLocaleString()}</td>
                  <td className="border-r px-2 py-2 text-right">{(payslip.base_salary + payslip.allowances).toLocaleString()}</td>
                  <td className="border-r px-2 py-2"></td>
                  <td className="px-2 py-2 text-right">{Math.floor(payslip.base_salary * 0.087).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
            
            {/* Résumé */}
            <div className="border-t">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-300 text-sm">
                    <th className="border-r px-2 py-2 text-center font-bold text-gray-900" colSpan={2}>Brut Social</th>
                    <th className="border-r px-2 py-2 text-center font-bold text-gray-900" colSpan={2}>Base IR</th>
                    <th className="border-r px-2 py-2 text-center font-bold text-gray-900">IPRES Gén.</th>
                    <th className="border-r px-2 py-2 text-center font-bold text-gray-900">IPRES Cad.</th>
                    <th className="border-r px-2 py-2 text-center font-bold text-gray-900">IR</th>
                    <th className="border-r px-2 py-2 text-center font-bold text-gray-900">TRIMF</th>
                    <th className="px-2 py-2 text-center font-bold text-gray-900">NET A PAYER<br />EN FRANCS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-sm bg-white">
                    <td className="border-r px-2 py-2 text-center font-medium text-gray-800" colSpan={2}>{(payslip.base_salary).toLocaleString()}</td>
                    <td className="border-r px-2 py-2 text-center font-medium text-gray-800" colSpan={2}>{(payslip.base_salary - Math.floor(payslip.base_salary * 0.058)).toLocaleString()}</td>
                    <td className="border-r px-2 py-2 text-center font-medium text-gray-800">{Math.floor(payslip.base_salary * 0.058).toLocaleString()}</td>
                    <td className="border-r px-2 py-2 text-center font-medium text-gray-800"></td>
                    <td className="border-r px-2 py-2 text-center font-medium text-gray-800">{(payslip.tax_amount - 3000).toLocaleString()}</td>
                    <td className="border-r px-2 py-2 text-center font-medium text-gray-800">3 000</td>
                    <td className="px-2 py-2 text-center font-bold bg-blue-700 text-white text-lg">{payslip.net_salary.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Pied de page */}
            <div className="border-t p-3 text-sm grid grid-cols-2 gap-4 bg-gray-100">
              <div className="text-gray-800">
                <div><span className="font-bold text-gray-900">CONGES PAYES:</span> {Math.floor(payslip.base_salary / 12).toLocaleString()}</div>
                <div><span className="font-bold text-gray-900">Règlement:</span> {paymentMethod}</div>
                <div><span className="font-bold text-gray-900">Montant:</span> {payslip.net_salary.toLocaleString()}</div>
              </div>
              <div className="text-right text-gray-800">
                <div className="font-bold text-gray-900">PRIX DIV ENTREPRISE</div>
                <div className="font-medium">Mois: {Math.floor(payslip.net_salary * 0.02).toLocaleString()}</div>
                <div className="font-medium">Cumul: {Math.floor(payslip.net_salary * 0.06).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
