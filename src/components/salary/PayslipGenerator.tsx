
import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Salaire } from "@/services/salaireService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface PayslipGeneratorProps {
  salaire: Salaire;
  onClose: () => void;
}

export function PayslipGenerator({ salaire, onClose }: PayslipGeneratorProps) {
  const payslipRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!payslipRef.current) return;
    
    try {
      const canvas = await html2canvas(payslipRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`bulletin-paie-${salaire.matricule}-${salaire.periode_paie.replace('/', '-')}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };

  // Calculate various values
  const salaireBrut = salaire.salaire_base + salaire.sursalaire;
  const totalBrut = salaireBrut + salaire.indemnite_deplacement + salaire.prime_transport;
  const totalDeductions = salaire.ipres_general + salaire.trimf + salaire.retenue_ir;
  const montantEmployeur = totalBrut - salaire.net_a_payer;
  
  // Current date
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'MMMM yyyy', { locale: fr });

  // Mock data based on image - in real implementation, this would come from the database
  const employeeData = {
    embauche: "02/10/23",
    statut: "E G",
    partsIR: 1,
    qualification: "CONDUCTEUR ENGINS",
    dateNaissance: "10/10/1988",
    gain: {
      salaireBrut: salaire.salaire_base,
      sursalaire: salaire.sursalaire,
      indemniteLogement: 150000,
      indemniteTransport: 107500,
    },
    tauxJournalier: {
      base: 1.00,
      sursalaire: 1.00000,
    },
    cotisations: {
      ipresGen: salaire.ipres_general,
      ipresCad: 0,
      ir: salaire.retenue_ir,
      trimf: salaire.trimf,
    },
    totalMensuel: {
      brut: salaireBrut,
      cotisations: totalDeductions,
      netAPayer: salaire.net_a_payer,
    },
    cumul: {
      brut: 1716057,
      ir: 1716057,
      ipresGen: 96009,
      ipresCad: 0,
      trimf: 312731,
      netAPayer: 1378988,
    },
    congesPaies: 143705,
    prixEntreprise: 907131
  };

  const printPayslip = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-4">
      <div className="flex justify-end space-x-2 mb-4 print:hidden">
        <Button variant="outline" onClick={generatePDF}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
        <Button variant="outline" onClick={printPayslip}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
      
      <div ref={payslipRef} className="border-2 border-gray-500 p-4 print:p-2 bg-white text-black">
        {/* Header */}
        <div className="text-center border-2 border-gray-500 p-2 mb-2 bg-gray-100">
          <h2 className="text-lg font-bold uppercase">Bulletin de paie</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Employer Information */}
          <div className="border-2 border-gray-500 p-2 bg-gray-50">
            <div className="flex items-center">
              <div className="text-red-600 font-bold mr-2">
                <img 
                  src="/lovable-uploads/0a8437e4-516c-4ba1-b2d9-24ddef68546b.png"
                  alt="EIFFAGE ENERGIE"
                  className="h-12"
                />
              </div>
            </div>
            <div className="font-bold mt-2">EIFFAGE ENERGIE</div>
            <div className="font-bold">T&D Sénégal</div>
            <div className="text-xs mt-2 text-black">
              AV. FELIX EBOUE X RTE DES BRASSERIES<br />
              BP<br />
              DAKAR SENEGAL
            </div>
            <div className="text-xs mt-2 text-black">Convention Collective Nationale</div>
          </div>
          
          {/* Period and Employee Info */}
          <div className="border-t-2 border-r-2 border-b-2 border-gray-500 p-2 bg-gray-50">
            <div className="text-right mb-4">
              <div className="font-semibold">Période de paie: {salaire.periode_paie}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-semibold">Matricule: {salaire.matricule}</div>
                <div className="font-bold">SEIDI SULEIMANE</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">NDIHEM</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Employee Status Information */}
        <div className="border-2 border-gray-500 mb-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Embauche</th>
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Statut</th>
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Parts IR</th>
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Qualification</th>
                <th className="border-b-2 border-gray-500 p-1 text-left font-bold">Date Naissance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r-2 border-gray-500 p-1 bg-white">{employeeData.embauche}</td>
                <td className="border-r-2 border-gray-500 p-1 bg-white">{employeeData.statut}</td>
                <td className="border-r-2 border-gray-500 p-1 bg-white">{employeeData.partsIR}</td>
                <td className="border-r-2 border-gray-500 p-1 bg-white">{employeeData.qualification}</td>
                <td className="p-1 bg-white">{employeeData.dateNaissance}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Salary Breakdown */}
        <div className="border-2 border-gray-500 mb-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Libellé</th>
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Nombre ou Base</th>
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Taux</th>
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Gain</th>
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Taux Salarial</th>
                <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Montant</th>
                <th className="border-b-2 border-gray-500 p-1 text-left font-bold">Montant Employeur</th>
              </tr>
            </thead>
            <tbody>
              <tr className="even:bg-gray-50">
                <td className="border-r-2 border-gray-500 p-1">102 Salaire de base du mois</td>
                <td className="border-r-2 border-gray-500 p-1">{employeeData.gain.salaireBrut.toLocaleString('fr-FR')}</td>
                <td className="border-r-2 border-gray-500 p-1">{employeeData.tauxJournalier.base}</td>
                <td className="border-r-2 border-gray-500 p-1">{employeeData.gain.salaireBrut.toLocaleString('fr-FR')}</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="p-1"></td>
              </tr>
              <tr className="odd:bg-white">
                <td className="border-r-2 border-gray-500 p-1">105 Sursalaire</td>
                <td className="border-r-2 border-gray-500 p-1">{employeeData.gain.salaireBrut.toLocaleString('fr-FR')}</td>
                <td className="border-r-2 border-gray-500 p-1">{employeeData.tauxJournalier.sursalaire}</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="p-1"></td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border-r-2 border-gray-500 p-1">217 Indemnité de déplacement</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1">{employeeData.gain.indemniteLogement.toLocaleString('fr-FR')}</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="p-1"></td>
              </tr>
              <tr className="odd:bg-white">
                <td className="border-r-2 border-gray-500 p-1">411 Retenue I.R</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1">89 308</td>
                <td className="border-r-2 border-gray-500 p-1 font-semibold">{employeeData.cotisations.ir.toLocaleString('fr-FR')}</td>
                <td className="p-1"></td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border-r-2 border-gray-500 p-1">414 IPRES général</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1">24 838</td>
                <td className="border-r-2 border-gray-500 p-1 font-semibold">{employeeData.cotisations.ipresGen.toLocaleString('fr-FR')}</td>
                <td className="p-1">37 255</td>
              </tr>
              <tr className="odd:bg-white">
                <td className="border-r-2 border-gray-500 p-1">420 TRIMF</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1 font-semibold">{employeeData.cotisations.trimf.toLocaleString('fr-FR')}</td>
                <td className="p-1"></td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border-r-2 border-gray-500 p-1">420 Prime de transport</td>
                <td className="border-r-2 border-gray-500 p-1">26 000</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1">26 000</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="p-1"></td>
              </tr>
              <tr className="odd:bg-white">
                <td className="border-r-2 border-gray-500 p-1">0673 Arrondi mois précédent</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1">71</td>
                <td className="p-1"></td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border-r-2 border-gray-500 p-1">0670 Arrondi du mois</td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-gray-500 p-1"></td>
                <td className="p-1"></td>
              </tr>
              
              {/* Empty rows for spacing */}
              {[...Array(10)].map((_, i) => (
                <tr key={i} className={i % 2 === 0 ? "odd:bg-white" : "even:bg-gray-50"}>
                  <td className="border-r-2 border-gray-500 p-1">&nbsp;</td>
                  <td className="border-r-2 border-gray-500 p-1"></td>
                  <td className="border-r-2 border-gray-500 p-1"></td>
                  <td className="border-r-2 border-gray-500 p-1"></td>
                  <td className="border-r-2 border-gray-500 p-1"></td>
                  <td className="border-r-2 border-gray-500 p-1"></td>
                  <td className="p-1"></td>
                </tr>
              ))}
              
              {/* Totals row */}
              <tr className="bg-gray-200">
                <td className="border-r-2 border-t-2 border-gray-500 p-1 text-right font-bold" colSpan={3}>TOTAUX</td>
                <td className="border-r-2 border-t-2 border-gray-500 p-1 font-bold">{totalBrut.toLocaleString('fr-FR')}</td>
                <td className="border-r-2 border-t-2 border-gray-500 p-1"></td>
                <td className="border-r-2 border-t-2 border-gray-500 p-1 font-bold">{totalDeductions.toLocaleString('fr-FR')}</td>
                <td className="border-t-2 border-gray-500 p-1 font-bold">{montantEmployeur.toLocaleString('fr-FR')}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Summary */}
        <div className="grid grid-cols-7 border-2 border-gray-500 mb-2">
          <div className="col-span-3 border-r-2 border-gray-500 p-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold"></th>
                  <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Brut Social</th>
                  <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">Base IR</th>
                  <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">IPRES Gen.</th>
                  <th className="border-r-2 border-b-2 border-gray-500 p-1 text-left font-bold">IPRES Cad.</th>
                  <th className="border-b-2 border-gray-500 p-1 text-left font-bold">IR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r-2 border-gray-500 p-1 font-bold">MOIS</td>
                  <td className="border-r-2 border-gray-500 p-1">{salaireBrut.toLocaleString('fr-FR')}</td>
                  <td className="border-r-2 border-gray-500 p-1">{salaireBrut.toLocaleString('fr-FR')}</td>
                  <td className="border-r-2 border-gray-500 p-1">{employeeData.cotisations.ipresGen.toLocaleString('fr-FR')}</td>
                  <td className="border-r-2 border-gray-500 p-1"></td>
                  <td className="p-1">{employeeData.cotisations.ir.toLocaleString('fr-FR')}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-r-2 border-gray-500 p-1 font-bold">CUMUL</td>
                  <td className="border-r-2 border-gray-500 p-1">{employeeData.cumul.brut.toLocaleString('fr-FR')}</td>
                  <td className="border-r-2 border-gray-500 p-1">{employeeData.cumul.ir.toLocaleString('fr-FR')}</td>
                  <td className="border-r-2 border-gray-500 p-1">{employeeData.cumul.ipresGen.toLocaleString('fr-FR')}</td>
                  <td className="border-r-2 border-gray-500 p-1"></td>
                  <td className="p-1">{employeeData.cumul.trimf.toLocaleString('fr-FR')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-span-2 border-r-2 border-gray-500 p-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-b-2 border-gray-500 p-1 text-left font-bold">TRIMF</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1">{employeeData.cotisations.trimf.toLocaleString('fr-FR')}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-1">{employeeData.cumul.trimf.toLocaleString('fr-FR')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-span-2 p-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-b-2 border-gray-500 p-1 text-center font-bold">NET A PAYER EN FRANCS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1 text-center font-bold text-xl bg-gray-100">{salaire.net_a_payer.toLocaleString('fr-FR')}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-1 text-center">{employeeData.cumul.netAPayer.toLocaleString('fr-FR')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footer */}
        <div className="grid grid-cols-2 border-2 border-gray-500">
          <div className="border-r-2 border-gray-500 p-1 bg-gray-50">
            <div className="text-xs">
              <div className="font-bold">CONGES PAYES</div>
              <div className="grid grid-cols-2">
                <div>Montant:</div>
                <div className="font-semibold">{employeeData.congesPaies.toLocaleString('fr-FR')}</div>
              </div>
            </div>
          </div>
          <div className="p-1 bg-gray-50">
            <div className="text-xs">
              <div className="font-bold">PRIX PAR ENTREPRISE</div>
              <div className="grid grid-cols-2">
                <div>Mois:</div>
                <div className="font-semibold">{employeeData.prixEntreprise.toLocaleString('fr-FR')}</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Cumul:</div>
                <div className="font-semibold">{employeeData.cumul.netAPayer.toLocaleString('fr-FR')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
