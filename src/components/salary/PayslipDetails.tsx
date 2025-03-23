
import React from "react";
import { Printer, FileDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Payslip } from "@/services/salaryPaymentService";
import { format } from "date-fns";

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
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
          <h2 className="text-xl font-semibold">Bulletin de paie</h2>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button size="sm" variant="outline" onClick={onDownload}>
              <FileDown className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto p-6">
          <div className="border rounded-md overflow-hidden">
            {/* En-tête du bulletin */}
            <div className="text-center font-bold text-lg py-2 border-b bg-muted/20">
              BULLETIN DE PAIE
            </div>
            
            <div className="flex border-b">
              {/* Partie gauche - Information employeur */}
              <div className="w-1/2 p-4 border-r">
                <div className="font-bold">Employeur</div>
                <div className="flex items-center mt-2">
                  <img 
                    src="/lovable-uploads/95f61541-ced4-45dc-ab8a-070c9c0c67f3.png" 
                    alt="EIFFAGE" 
                    className="h-8 mr-2"
                  />
                  <div>
                    <div className="font-bold">EIFFAGE</div>
                    <div>ÉNERGIE</div>
                    <div className="text-sm">T&D Sénégal</div>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  AV FÉLIX EBOUÉ 5 KM DES BRAS<br />
                  BP<br />
                  DAKAR SÉNÉGAL
                </div>
              </div>
              
              {/* Partie droite - Information paie */}
              <div className="w-1/2 p-4">
                <div className="text-right">
                  <div>Période de paie: {paymentPeriod || format(new Date(), 'MMMM yyyy')}</div>
                  <div className="mt-2">
                    <div>Matricule: {payslip.employee_id.substring(0, 5).toUpperCase()}</div>
                    <div>{payslip.employee?.full_name || "Employé"}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Corps du bulletin */}
            <div className="px-4 py-2 border-b bg-muted/20 font-semibold">
              Convention Collective Nationale
            </div>
            
            <div className="border-b">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/10 text-sm">
                    <th className="border-r px-2 py-1 text-left">Rubrique</th>
                    <th className="border-r px-2 py-1 text-center">Statut</th>
                    <th className="border-r px-2 py-1 text-center">Parts IR</th>
                    <th className="border-r px-2 py-1 text-center">Qualification</th>
                    <th className="px-2 py-1 text-center">Date Naissance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-sm">
                    <td className="border-r px-2 py-1">10/10/23</td>
                    <td className="border-r px-2 py-1 text-center">E.R</td>
                    <td className="border-r px-2 py-1 text-center">1</td>
                    <td className="border-r px-2 py-1 text-center">{payslip.employee?.role || "CONDUCTEUR ENGINS"}</td>
                    <td className="px-2 py-1 text-center">10/10/1988</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Détails des rubriques */}
            <table className="w-full">
              <thead>
                <tr className="bg-muted/10 text-sm">
                  <th className="border-r px-2 py-1 text-left">Libellé</th>
                  <th className="border-r px-2 py-1 text-center">Nombre ou Base</th>
                  <th className="border-r px-2 py-1 text-center">Taux</th>
                  <th className="border-r px-2 py-1 text-center">Retenue Salariale</th>
                  <th className="border-r px-2 py-1 text-center">Gain</th>
                  <th className="border-r px-2 py-1 text-center">Taux Employeur</th>
                  <th className="px-2 py-1 text-center">Montant Employeur</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm">
                  <td className="border-r px-2 py-1">102 Salaire de base du mois</td>
                  <td className="border-r px-2 py-1 text-right">{payslip.base_salary.toLocaleString()}</td>
                  <td className="border-r px-2 py-1 text-center">1.00</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1 text-right">{payslip.base_salary.toLocaleString()}</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                </tr>
                <tr className="text-sm">
                  <td className="border-r px-2 py-1">105 IPRES</td>
                  <td className="border-r px-2 py-1 text-right">{payslip.base_salary.toLocaleString()}</td>
                  <td className="border-r px-2 py-1 text-center">0.0580</td>
                  <td className="border-r px-2 py-1 text-right">{Math.floor(payslip.base_salary * 0.058).toLocaleString()}</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1 text-center">0.0870</td>
                  <td className="px-2 py-1 text-right">{Math.floor(payslip.base_salary * 0.087).toLocaleString()}</td>
                </tr>
                <tr className="text-sm">
                  <td className="border-r px-2 py-1">317 Indemnité de déplacement</td>
                  <td className="border-r px-2 py-1 text-right">{Math.floor(payslip.allowances * 0.7).toLocaleString()}</td>
                  <td className="border-r px-2 py-1 text-center">1.000</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1 text-right">{Math.floor(payslip.allowances * 0.7).toLocaleString()}</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                </tr>
                <tr className="text-sm">
                  <td className="border-r px-2 py-1">420 Prime de transport</td>
                  <td className="border-r px-2 py-1 text-right">26 000</td>
                  <td className="border-r px-2 py-1 text-center">1.000</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1 text-right">26 000</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                </tr>
                <tr className="text-sm">
                  <td className="border-r px-2 py-1">401 Impôt général</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1 text-right">{(payslip.tax_amount - 3000).toLocaleString()}</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                </tr>
                <tr className="text-sm">
                  <td className="border-r px-2 py-1">410 TRIMF</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1 text-right">3 000</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                </tr>
                <tr className="text-sm">
                  <td className="border-r px-2 py-1">6673 Avance sur prêt</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1 text-right">{Math.floor(payslip.deductions - 3000).toLocaleString()}</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="px-2 py-1"></td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-muted/10 text-sm font-bold">
                  <td className="border-r px-2 py-1 text-right" colSpan={2}>TOTAUX</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="border-r px-2 py-1 text-right">{(payslip.deductions + payslip.tax_amount).toLocaleString()}</td>
                  <td className="border-r px-2 py-1 text-right">{(payslip.base_salary + payslip.allowances).toLocaleString()}</td>
                  <td className="border-r px-2 py-1"></td>
                  <td className="px-2 py-1 text-right">{Math.floor(payslip.base_salary * 0.087).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
            
            {/* Résumé */}
            <div className="border-t">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/10 text-sm">
                    <th className="border-r px-2 py-1 text-center" colSpan={2}>Brut Social</th>
                    <th className="border-r px-2 py-1 text-center" colSpan={2}>Base IR</th>
                    <th className="border-r px-2 py-1 text-center">IPRES Gén.</th>
                    <th className="border-r px-2 py-1 text-center">IPRES Cad.</th>
                    <th className="border-r px-2 py-1 text-center">IR</th>
                    <th className="border-r px-2 py-1 text-center">TRIMF</th>
                    <th className="px-2 py-1 text-center">NET A PAYER<br />EN FRANCS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-sm">
                    <td className="border-r px-2 py-1 text-center" colSpan={2}>{payslip.base_salary.toLocaleString()}</td>
                    <td className="border-r px-2 py-1 text-center" colSpan={2}>{(payslip.base_salary - Math.floor(payslip.base_salary * 0.058)).toLocaleString()}</td>
                    <td className="border-r px-2 py-1 text-center">{Math.floor(payslip.base_salary * 0.058).toLocaleString()}</td>
                    <td className="border-r px-2 py-1 text-center"></td>
                    <td className="border-r px-2 py-1 text-center">{(payslip.tax_amount - 3000).toLocaleString()}</td>
                    <td className="border-r px-2 py-1 text-center">3 000</td>
                    <td className="px-2 py-1 text-center font-bold">{payslip.net_salary.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Pied de page */}
            <div className="border-t p-3 text-sm grid grid-cols-2 gap-4">
              <div>
                <div>CONGES PAYES: {Math.floor(payslip.base_salary / 12).toLocaleString()}</div>
                <div>Règlement: {paymentMethod}</div>
                <div>Montant: {payslip.net_salary.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div>PRIX DIV ENTREPRISE</div>
                <div>Mois: {Math.floor(payslip.net_salary * 0.02).toLocaleString()}</div>
                <div>Cumul: {Math.floor(payslip.net_salary * 0.06).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
