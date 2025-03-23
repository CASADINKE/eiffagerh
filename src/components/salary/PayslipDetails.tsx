
import { useState } from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Payslip } from "@/services/payslipService";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PayslipDetailsProps {
  payslip: Payslip;
  paymentPeriod: string;
  paymentMethod: string;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

export function PayslipDetails({
  payslip,
  paymentPeriod,
  paymentMethod,
  onClose,
  onPrint,
  onDownload,
}: PayslipDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Extract metadata from payslip
  const metadata = payslip.employee_metadata || {};
  const matricule = metadata.matricule || "00115";
  const convention = metadata.convention || "Convention Collective Nationale";
  const statut = metadata.statut || "C.D.I";
  const parts_IR = metadata.parts_IR || 1;
  const qualification = metadata.qualification || "CONDUCTEUR ENGINS";
  const date_naissance = metadata.date_naissance || "10/10/1988";
  const employer = metadata.employer || "EIFFAGE ENERGIE T&D Sénégal";
  const site = metadata.site || "AV PETIT MBAO X RTE DES BRAS BP 29389 DAKAR SÉNÉGAL";
  const transportAllowance = metadata.transport_allowance || 26000;
  const displacementAllowance = metadata.displacement_allowance || 197000;
  const totalGains = payslip.base_salary + transportAllowance + displacementAllowance;
  const socialGross = metadata.social_gross || 443511;
  const irBase = metadata.ir_base || 443511;
  const trimfGen = payslip.deductions;
  const trimf = payslip.tax_amount;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto payslip-content bg-white">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10 border-b">
          <CardTitle className="text-xl">Bulletin de Paie</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onPrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="print:bg-white">
            {/* Payslip Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold border-2 border-gray-300 py-2 mb-2">BULLETIN DE PAIE</h2>
              <p className="text-right text-sm mb-2">Période de paie: {paymentPeriod}</p>
            </div>
            
            {/* Employer and Employee Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border-2 border-gray-300 p-3">
                <p className="font-semibold">Employeur</p>
                <div className="flex flex-col items-center justify-center h-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600"></div>
                    <div className="font-bold">{employer}</div>
                  </div>
                  <div className="text-xs text-center mt-2">{site}</div>
                </div>
              </div>
              
              <div className="border-2 border-gray-300 p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-semibold">Matricule: {matricule}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{payslip.employee?.full_name || "SEIDU SOULEYMANE"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Convention */}
            <div className="mb-4">
              <p className="font-semibold border-2 border-gray-300 p-2 text-sm">{convention}</p>
            </div>
            
            {/* Employee Details */}
            <table className="w-full border-2 border-gray-300 text-sm mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-1 text-left">Embauche</th>
                  <th className="border p-1 text-left">Statut</th>
                  <th className="border p-1 text-left">Parts IR</th>
                  <th className="border p-1 text-left">Qualification</th>
                  <th className="border p-1 text-left">Date Naissance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">10/10/23</td>
                  <td className="border p-1">{statut}</td>
                  <td className="border p-1">{parts_IR}</td>
                  <td className="border p-1">{qualification}</td>
                  <td className="border p-1">{date_naissance}</td>
                </tr>
              </tbody>
            </table>
            
            {/* Salary Details */}
            <table className="w-full border-2 border-gray-300 text-xs mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-1 text-left">Libellé</th>
                  <th className="border p-1 text-left">Nombre ou Base</th>
                  <th className="border p-1 text-left">Taux</th>
                  <th className="border p-1 text-left">Gain</th>
                  <th className="border p-1 text-left">Taux Salarial</th>
                  <th className="border p-1 text-left">Montant Employé</th>
                  <th className="border p-1 text-left">Montant Employeur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">102</span>
                      <span>Salaire de base du mois</span>
                    </div>
                  </td>
                  <td className="border p-1">150 000</td>
                  <td className="border p-1">1.00</td>
                  <td className="border p-1">{payslip.base_salary.toLocaleString()}</td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                </tr>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">315</span>
                      <span>Salaire Brut</span>
                    </div>
                  </td>
                  <td className="border p-1">150 000</td>
                  <td className="border p-1">1.0000</td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                </tr>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">317</span>
                      <span>Indemnité de déplacement</span>
                    </div>
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">{displacementAllowance.toLocaleString()}</td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                </tr>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">411</span>
                      <span>Retenue I.R</span>
                    </div>
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">37 255</td>
                </tr>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">435</span>
                      <span>TRIM général</span>
                    </div>
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">89 308</td>
                  <td className="border p-1">24 836</td>
                  <td className="border p-1"></td>
                </tr>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">430</span>
                      <span>TRIMF</span>
                    </div>
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">3 000</td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                </tr>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">420</span>
                      <span>Prime de transport</span>
                    </div>
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">{transportAllowance.toLocaleString()}</td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                </tr>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">9673</span>
                      <span>Arrondi mois précédent</span>
                    </div>
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">71</td>
                  <td className="border p-1"></td>
                </tr>
                <tr>
                  <td className="border p-1">
                    <div className="flex">
                      <span className="w-6">9699</span>
                      <span>Arrondi du mois</span>
                    </div>
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="border p-1 text-right" colSpan={3}>TOTAUX</td>
                  <td className="border p-1">{totalGains.toLocaleString()}</td>
                  <td className="border p-1"></td>
                  <td className="border p-1">{(payslip.deductions + payslip.tax_amount).toLocaleString()}</td>
                  <td className="border p-1">37 255</td>
                </tr>
              </tbody>
            </table>
            
            {/* Summary */}
            <table className="w-full border-2 border-gray-300 text-xs mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-1 text-center" colSpan={2}>Brut Social</th>
                  <th className="border p-1 text-center" colSpan={2}>Base IR</th>
                  <th className="border p-1 text-center">TRIMF Gén</th>
                  <th className="border p-1 text-center">IR</th>
                  <th className="border p-1 text-center">NET A PAYER EN FRANCS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 text-center" colSpan={2}>{socialGross.toLocaleString()}</td>
                  <td className="border p-1 text-center" colSpan={2}>{irBase.toLocaleString()}</td>
                  <td className="border p-1 text-center">{trimfGen.toLocaleString()}</td>
                  <td className="border p-1 text-center">{trimf.toLocaleString()}</td>
                  <td className="border p-1 text-center font-bold">{payslip.net_salary.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border p-1 text-center" colSpan={2}>CUMUL: 1 716 057</td>
                  <td className="border p-1 text-center" colSpan={2}>1 716 057</td>
                  <td className="border p-1 text-center">96 059</td>
                  <td className="border p-1 text-center">312 731</td>
                  <td className="border p-1 text-center">1 000</td>
                </tr>
              </tbody>
            </table>
            
            {/* Additional Info */}
            <div className="grid grid-cols-2 mb-4 text-xs">
              <div className="border-2 border-gray-300 p-2">
                <p className="font-bold">CONGES PAYES</p>
                <p>Restant: 143 025</p>
              </div>
              <div className="border-2 border-gray-300 p-2">
                <p className="font-bold">PRIX PAR ENTREPRISE</p>
                <p>Mois: 507 131</p>
                <p>Cumul: 1 978 988</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end print:hidden">
            <Button variant="default" onClick={onPrint} className="mr-2">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
