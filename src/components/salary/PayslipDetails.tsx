
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

  // Extraire les métadonnées du payslip ou utiliser des valeurs par défaut
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
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto payslip-content">
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
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold border-2 border-gray-300 py-2 mb-4">BULLETIN DE PAIE</h2>
            <p className="text-right mb-4">Période de paie: mai 2024</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border-2 border-gray-300 p-4">
              <p className="font-semibold">Employeur</p>
              <div className="flex justify-center items-center h-20">
                <div className="flex flex-col items-center">
                  <div className="font-bold">{employer}</div>
                  <div className="text-sm text-center mt-2">{site}</div>
                </div>
              </div>
            </div>
            
            <div className="border-2 border-gray-300 p-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold">Matricule:</p>
                  <p>{matricule}</p>
                </div>
                <div>
                  <p className="font-semibold">NIDCHM</p>
                  <p></p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold">SEIDOU SOULEYMANE</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="font-semibold border-2 border-gray-300 p-2">{convention}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Embauche</th>
                  <th className="border p-2 text-left">Statut</th>
                  <th className="border p-2 text-left">Parts IR</th>
                  <th className="border p-2 text-left">Qualification</th>
                  <th className="border p-2 text-left">Date Naissance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">10/10/23</td>
                  <td className="border p-2">{statut}</td>
                  <td className="border p-2">{parts_IR}</td>
                  <td className="border p-2">{qualification}</td>
                  <td className="border p-2">{date_naissance}</td>
                </tr>
              </tbody>
            </table>
            
            <table className="w-full border-2 border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Libellé</th>
                  <th className="border p-2 text-left">Nombre ou Base</th>
                  <th className="border p-2 text-left">Taux</th>
                  <th className="border p-2 text-left">Gain</th>
                  <th className="border p-2 text-left">Taux Salarial</th>
                  <th className="border p-2 text-left">Montant Employé</th>
                  <th className="border p-2 text-left">Montant Employeur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">102</span>
                      <span>Salaire de base du mois</span>
                    </div>
                  </td>
                  <td className="border p-2">30 H 00</td>
                  <td className="border p-2">1.00</td>
                  <td className="border p-2">{payslip.base_salary.toLocaleString()}</td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">315</span>
                      <span>Salaire Brut</span>
                    </div>
                  </td>
                  <td className="border p-2">180 000</td>
                  <td className="border p-2">1.0000</td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">317</span>
                      <span>Indemnité de déplacement</span>
                    </div>
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2">{displacementAllowance.toLocaleString()}</td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">411</span>
                      <span>Retenue I.R</span>
                    </div>
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2">37 255</td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">435</span>
                      <span>TRIM général</span>
                    </div>
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2">89 308</td>
                  <td className="border p-2">24 836</td>
                  <td className="border p-2"></td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">430</span>
                      <span>TRIMF</span>
                    </div>
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2">3 000</td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">420</span>
                      <span>Prime de transport</span>
                    </div>
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2">{transportAllowance.toLocaleString()}</td>
                  <td className="border p-2"></td>
                  <td className="border p-2">26 000</td>
                  <td className="border p-2"></td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">9672</span>
                      <span>Arrondi mois précédent</span>
                    </div>
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2">71</td>
                  <td className="border p-2"></td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <div className="flex">
                      <span className="w-8">9699</span>
                      <span>Arrondi du mois</span>
                    </div>
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="border p-2 text-right" colSpan={3}>TOTAUX</td>
                  <td className="border p-2">{(payslip.base_salary + transportAllowance + displacementAllowance).toLocaleString()}</td>
                  <td className="border p-2"></td>
                  <td className="border p-2">{(payslip.deductions + payslip.tax_amount).toLocaleString()}</td>
                  <td className="border p-2">37 255</td>
                </tr>
              </tbody>
            </table>
            
            <table className="w-full border-2 border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-center" colSpan={2}>Brut Social</th>
                  <th className="border p-2 text-center" colSpan={2}>Base IR</th>
                  <th className="border p-2 text-center">TRIMF Gén</th>
                  <th className="border p-2 text-center">TRIMF</th>
                  <th className="border p-2 text-center">NET A PAYER EN FRANCS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 text-center" colSpan={2}>443 511</td>
                  <td className="border p-2 text-center" colSpan={2}>443 511</td>
                  <td className="border p-2 text-center">24 836</td>
                  <td className="border p-2 text-center">89 308</td>
                  <td className="border p-2 text-center font-bold">{payslip.net_salary.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border p-2 text-center" colSpan={2}>CUMUL: 1 716 057</td>
                  <td className="border p-2 text-center" colSpan={2}>1 716 057</td>
                  <td className="border p-2 text-center">96 059</td>
                  <td className="border p-2 text-center">312 731</td>
                  <td className="border p-2 text-center">4 450</td>
                </tr>
              </tbody>
            </table>
            
            <div className="grid grid-cols-2 mt-4">
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
          
          <div className="mt-8 flex justify-end">
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
