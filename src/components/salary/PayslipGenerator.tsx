
import React, { useRef, useEffect, useState } from "react";
import { Salaire } from "@/services/salaireService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PayslipGeneratorProps {
  salaire: Salaire;
  onClose: () => void;
}

interface EmployeeData {
  nom: string;
  prenom: string;
  matricule: string;
  poste: string;
  date_naissance: string | null;
  adresse: string;
  telephone: string;
  [key: string]: any;
}

export function PayslipGenerator({ salaire, onClose }: PayslipGeneratorProps) {
  const payslipRef = useRef<HTMLDivElement>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('listes_employées')
          .select('*')
          .eq('matricule', salaire.matricule)
          .maybeSingle();
          
        if (error) {
          console.error("Erreur lors de la récupération des données de l'employé:", error);
          console.log("Matricule recherché:", salaire.matricule);
        } else if (data) {
          setEmployeeData(data as EmployeeData);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployeeData();
  }, [salaire.matricule]);

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

  // Function to generate the HTML content for printing
  const generateBulletinHTML = () => {
    const employeeName = employeeData 
      ? `${employeeData.prenom} ${employeeData.nom}`
      : salaire.nom;
      
    const dateNaissance = employeeData && employeeData.date_naissance
      ? new Date(employeeData.date_naissance).toLocaleDateString('fr-FR')
      : '10/10/1988'; // Fallback date

    // Calculate values for the payslip
    const salaireBrut = salaire.salaire_base;
    const sursalaire = salaire.sursalaire || 0;
    const indemniteDeplacement = salaire.indemnite_deplacement || 0;
    const primeTransport = salaire.prime_transport || 0;
    const retenues = {
      ipresGen: salaire.ipres_general || 0,
      trimf: salaire.trimf || 0,
      ir: salaire.retenue_ir || 0
    };
    
    const totalGain = salaireBrut + sursalaire + indemniteDeplacement + primeTransport;
    const totalRetenues = retenues.ipresGen + retenues.trimf + retenues.ir;
    const netAPayer = salaire.net_a_payer;
    
    // Mock values for cumulated data
    const cumulValues = {
      brutSocial: 443511,
      baseIR: 443511,
      ipresGen: 24836,
      ipresCad: 0,
      ir: 89308,
      trimf: 1000,
      netAPayer: 354360
    };
    
    // Mock values for additional information
    const congesPayes = 143005;
    const prixParEntreprise = {
      mois: 507131,
      cumul: 1278988
    };

    const html = `
      <html>
        <head>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 10pt;
              line-height: 1.3;
              margin: 0;
              padding: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 2mm;
              text-align: left;
              vertical-align: top;
            }
            th {
              font-weight: bold;
              background-color: #f2f2f2;
            }
            .text-center {
              text-align: center;
            }
            .text-right {
              text-align: right;
            }
            .header-title {
              border: 1px solid black;
              padding: 3mm;
              text-align: center;
              font-weight: bold;
              font-size: 14pt;
              margin-bottom: 5mm;
            }
            .employer-info {
              font-size: 9pt;
            }
            .clearfix::after {
              content: "";
              clear: both;
              display: table;
            }
            .eiffage-logo {
              color: #e2001a;
              font-weight: bold;
              font-size: 16pt;
            }
            .td-division {
              font-weight: bold;
              font-size: 12pt;
            }
          </style>
        </head>
        <body>
          <div class="header-title">BULLETIN DE PAIE</div>
          
          <div class="clearfix">
            <table style="width: 70%; float: left; margin-bottom: 5mm;">
              <tr>
                <td>
                  <div class="eiffage-logo">
                    <img src="/lovable-uploads/0a8437e4-516c-4ba1-b2d9-24ddef68546b.png" alt="EIFFAGE ENERGIE" height="40">
                  </div>
                  <div class="td-division">T&D Sénégal</div>
                  <div class="employer-info">
                    AV. FELIX EBOUE X RTE DES BRASSERIES<br>
                    BP<br>
                    DAKAR SENEGAL
                  </div>
                  <div class="employer-info">Convention Collective Nationale</div>
                </td>
              </tr>
            </table>
            
            <div style="width: 29%; float: right;">
              <div style="margin-bottom: 5mm;">
                <strong>Période de paie: ${salaire.periode_paie}</strong>
              </div>
              <div>
                <strong>Matricule: ${salaire.matricule}</strong><br>
                <strong>${employeeName.toUpperCase()}</strong>
              </div>
            </div>
          </div>
          
          <table style="margin-bottom: 5mm;">
            <tr>
              <th>Embauche</th>
              <th>Statut</th>
              <th>Parts IR</th>
              <th>Qualification</th>
              <th>Date Naissance</th>
            </tr>
            <tr>
              <td>02/10/23</td>
              <td>E G</td>
              <td>1</td>
              <td>${employeeData?.poste || 'CONDUCTEUR ENGINS'}</td>
              <td>${dateNaissance}</td>
            </tr>
          </table>
          
          <table style="margin-bottom: 5mm;">
            <tr>
              <th>Libellé</th>
              <th>Nombre ou Base</th>
              <th>Taux</th>
              <th>Gain</th>
              <th>Taux Salarial</th>
              <th>Montant Employé</th>
              <th>Montant Employeur</th>
            </tr>
            <tr>
              <td>102 Salaire de base du mois</td>
              <td class="text-right">${salaireBrut.toLocaleString('fr')}</td>
              <td>1.00</td>
              <td class="text-right">${salaireBrut.toLocaleString('fr')}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>105 Sursalaire</td>
              <td class="text-right">${salaireBrut.toLocaleString('fr')}</td>
              <td>1.00000</td>
              <td class="text-right">${sursalaire.toLocaleString('fr')}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>217 Indemnité de déplacement</td>
              <td></td>
              <td></td>
              <td class="text-right">${indemniteDeplacement.toLocaleString('fr')}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>411 Retenue I.R</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right">${retenues.ir.toLocaleString('fr')}</td>
              <td></td>
            </tr>
            <tr>
              <td>414 IPRES général</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right">${retenues.ipresGen.toLocaleString('fr')}</td>
              <td class="text-right">37 255</td>
            </tr>
            <tr>
              <td>420 TRIMF</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right">${retenues.trimf.toLocaleString('fr')}</td>
              <td></td>
            </tr>
            <tr>
              <td>420 Prime de transport</td>
              <td class="text-right">26 000</td>
              <td></td>
              <td class="text-right">${primeTransport.toLocaleString('fr')}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            
            <tr>
              <th colspan="3" class="text-right">TOTAUX</th>
              <th class="text-right">${totalGain.toLocaleString('fr')}</th>
              <th></th>
              <th class="text-right">${totalRetenues.toLocaleString('fr')}</th>
              <th class="text-right">37 255</th>
            </tr>
          </table>
          
          <table style="margin-bottom: 5mm;">
            <tr>
              <td style="width: 10%"></td>
              <th style="width: 15%">Brut Social</th>
              <th style="width: 15%">Base IR</th>
              <th style="width: 15%">IPRES Gen.</th>
              <th style="width: 15%">IPRES Cad.</th>
              <th style="width: 15%">IR</th>
              <th style="width: 15%">TRIMF</th>
            </tr>
            <tr>
              <th>MOIS</th>
              <td class="text-right">${cumulValues.brutSocial.toLocaleString('fr')}</td>
              <td class="text-right">${cumulValues.baseIR.toLocaleString('fr')}</td>
              <td class="text-right">${cumulValues.ipresGen.toLocaleString('fr')}</td>
              <td></td>
              <td class="text-right">${cumulValues.ir.toLocaleString('fr')}</td>
              <td class="text-right">${cumulValues.trimf.toLocaleString('fr')}</td>
            </tr>
            <tr>
              <th>CUMUL</th>
              <td class="text-right">1 716 057</td>
              <td class="text-right">1 716 057</td>
              <td class="text-right">96 009</td>
              <td></td>
              <td class="text-right">312 731</td>
              <td class="text-right">4 400</td>
            </tr>
          </table>
          
          <table style="margin-bottom: 5mm; text-align: center;">
            <tr>
              <th>NET A PAYER EN FRANCS</th>
            </tr>
            <tr>
              <td class="text-center" style="font-size: 14pt; font-weight: bold;">${netAPayer.toLocaleString('fr')}</td>
            </tr>
            <tr>
              <td class="text-center">1 378 988</td>
            </tr>
          </table>
          
          <table>
            <tr>
              <td style="width: 50%">
                <strong>CONGES PAYES</strong><br>
                Montant: ${congesPayes.toLocaleString('fr')}
              </td>
              <td style="width: 50%">
                <strong>PRIX PAR ENTREPRISE</strong><br>
                Mois: ${prixParEntreprise.mois.toLocaleString('fr')}<br>
                Cumul: ${prixParEntreprise.cumul.toLocaleString('fr')}
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
    
    return html;
  };

  // Function to generate and display bulletin
  const generateBulletin = () => {
    const html = generateBulletinHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const printPayslip = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement des données employé...</div>;
  }

  // Current date
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'MMMM yyyy', { locale: fr });

  // Get employee display name
  const employeeName = employeeData 
    ? `${employeeData.prenom} ${employeeData.nom}`
    : salaire.nom;

  // Get employee birth date
  const dateNaissance = employeeData && employeeData.date_naissance
    ? new Date(employeeData.date_naissance).toLocaleDateString('fr-FR')
    : '10/10/1988'; // Fallback date

  // Calculate values for the payslip
  const salaireBrut = salaire.salaire_base;
  const sursalaire = salaire.sursalaire || 0;
  const indemniteDeplacement = salaire.indemnite_deplacement || 0;
  const primeTransport = salaire.prime_transport || 0;
  const retenues = {
    ipresGen: salaire.ipres_general || 0,
    trimf: salaire.trimf || 0,
    ir: salaire.retenue_ir || 0
  };
  
  const totalGain = salaireBrut + sursalaire + indemniteDeplacement + primeTransport;
  const totalRetenues = retenues.ipresGen + retenues.trimf + retenues.ir;
  const netAPayer = salaire.net_a_payer;

  // Mock values for cumulated data (these would normally be calculated from historical data)
  const cumulValues = {
    brutSocial: 443511,
    baseIR: 443511,
    ipresGen: 24836,
    ipresCad: 0,
    ir: 89308,
    trimf: 1000,
    netAPayer: 354360
  };

  // Mock values for additional information
  const congesPayes = 143005;
  const prixParEntreprise = {
    mois: 507131,
    cumul: 1278988
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-4">
      <div className="flex justify-end space-x-2 mb-4 print:hidden">
        <Button variant="outline" onClick={generatePDF}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
        <Button variant="outline" onClick={generateBulletin}>
          <FileText className="h-4 w-4 mr-2" />
          Bulletin
        </Button>
        <Button variant="outline" onClick={printPayslip}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
      
      <div ref={payslipRef} className="payslip bg-white text-black font-mono text-xs border border-black">
        {/* Header */}
        <div className="text-center border-b border-black p-1">
          <div className="text-sm font-bold">BULLETIN DE PAIE</div>
          <div className="text-right">Période de paie: {salaire.periode_paie}</div>
          <div className="text-right">
            Matricule: {salaire.matricule}<br />
            {employeeName.toUpperCase()}
          </div>
        </div>
        
        {/* Company Info */}
        <div className="grid grid-cols-1 border-b border-black">
          <div className="border-b border-black p-2">
            <div className="flex items-center">
              <div className="text-red-600 font-bold">
                <img 
                  src="/lovable-uploads/0a8437e4-516c-4ba1-b2d9-24ddef68546b.png"
                  alt="EIFFAGE ENERGIE"
                  className="h-12"
                />
              </div>
            </div>
            <div className="font-bold">EIFFAGE ENERGIE</div>
            <div className="font-bold">T&D Sénégal</div>
            <div className="text-xs">
              AV. FELIX EBOUE X RTE DES BRASSERIES<br />
              BP<br />
              DAKAR SENEGAL
            </div>
            <div className="text-xs">Convention Collective Nationale</div>
          </div>
          
          {/* Employee address */}
          <div className="p-2 text-right">
            <div>NDIHEM</div>
          </div>
        </div>
        
        {/* Employee Information */}
        <div className="border-b border-black">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="border border-black p-1 text-left">Embauche</th>
                <th className="border border-black p-1 text-left">Statut</th>
                <th className="border border-black p-1 text-left">Parts IR</th>
                <th className="border border-black p-1 text-left">Qualification</th>
                <th className="border border-black p-1 text-left">Date Naissance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1">02/10/23</td>
                <td className="border border-black p-1">E G</td>
                <td className="border border-black p-1">1</td>
                <td className="border border-black p-1">CONDUCTEUR ENGINS</td>
                <td className="border border-black p-1">{dateNaissance}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Salary Details */}
        <div className="border-b border-black">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="border border-black p-1 text-left">Libellé</th>
                <th className="border border-black p-1 text-left">Nombre ou Base</th>
                <th className="border border-black p-1 text-left">Taux</th>
                <th className="border border-black p-1 text-left">Gain</th>
                <th className="border border-black p-1 text-left">Taux Salarial</th>
                <th className="border border-black p-1 text-left">Montant Employé</th>
                <th className="border border-black p-1 text-left">Montant Employeur</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r border-black p-1">102 Salaire de base du mois</td>
                <td className="border-r border-black p-1 text-right">{salaireBrut.toLocaleString('fr')}</td>
                <td className="border-r border-black p-1 text-right">1.00</td>
                <td className="border-r border-black p-1 text-right">{salaireBrut.toLocaleString('fr')}</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="p-1"></td>
              </tr>
              <tr>
                <td className="border-r border-black p-1">105 Sursalaire</td>
                <td className="border-r border-black p-1 text-right">{salaireBrut.toLocaleString('fr')}</td>
                <td className="border-r border-black p-1 text-right">1.00000</td>
                <td className="border-r border-black p-1 text-right">{sursalaire.toLocaleString('fr')}</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="p-1"></td>
              </tr>
              <tr>
                <td className="border-r border-black p-1">217 Indemnité de déplacement</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right">{indemniteDeplacement.toLocaleString('fr')}</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="p-1"></td>
              </tr>
              <tr>
                <td className="border-r border-black p-1">411 Retenue I.R</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right">{retenues.ir.toLocaleString('fr')}</td>
                <td className="p-1"></td>
              </tr>
              <tr>
                <td className="border-r border-black p-1">414 IPRES général</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right">{retenues.ipresGen.toLocaleString('fr')}</td>
                <td className="p-1 text-right">37 255</td>
              </tr>
              <tr>
                <td className="border-r border-black p-1">420 TRIMF</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right">{retenues.trimf.toLocaleString('fr')}</td>
                <td className="p-1"></td>
              </tr>
              <tr>
                <td className="border-r border-black p-1">420 Prime de transport</td>
                <td className="border-r border-black p-1 text-right">26 000</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right">{primeTransport.toLocaleString('fr')}</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1"></td>
                <td className="p-1"></td>
              </tr>
              
              {/* Empty rows for spacing */}
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="border-r border-black p-1">&nbsp;</td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td>
                  <td className="p-1"></td>
                </tr>
              ))}
              
              {/* Totals row */}
              <tr className="font-bold">
                <td className="border-r border-t border-black p-1 text-right" colSpan={3}>TOTAUX</td>
                <td className="border-r border-t border-black p-1 text-right">{totalGain.toLocaleString('fr')}</td>
                <td className="border-r border-t border-black p-1"></td>
                <td className="border-r border-t border-black p-1 text-right">{totalRetenues.toLocaleString('fr')}</td>
                <td className="border-t border-black p-1 text-right">37 255</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Summary Section */}
        <div className="grid grid-cols-7 border-b border-black">
          <div className="col-span-3 border-r border-black">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border-r border-b border-black p-1 text-left"></th>
                  <th className="border-r border-b border-black p-1 text-left">Brut Social</th>
                  <th className="border-r border-b border-black p-1 text-left">Base IR</th>
                  <th className="border-r border-b border-black p-1 text-left">IPRES Gen.</th>
                  <th className="border-r border-b border-black p-1 text-left">IPRES Cad.</th>
                  <th className="border-b border-black p-1 text-left">IR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-black p-1 font-bold">MOIS</td>
                  <td className="border-r border-black p-1 text-right">{cumulValues.brutSocial.toLocaleString('fr')}</td>
                  <td className="border-r border-black p-1 text-right">{cumulValues.baseIR.toLocaleString('fr')}</td>
                  <td className="border-r border-black p-1 text-right">{cumulValues.ipresGen.toLocaleString('fr')}</td>
                  <td className="border-r border-black p-1"></td>
                  <td className="p-1 text-right">{cumulValues.ir.toLocaleString('fr')}</td>
                </tr>
                <tr>
                  <td className="border-r border-black p-1 font-bold">CUMUL</td>
                  <td className="border-r border-black p-1 text-right">1 716 057</td>
                  <td className="border-r border-black p-1 text-right">1 716 057</td>
                  <td className="border-r border-black p-1 text-right">96 009</td>
                  <td className="border-r border-black p-1"></td>
                  <td className="p-1 text-right">312 731</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-span-2 border-r border-black">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-black p-1 text-left">TRIMF</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1 text-right">{cumulValues.trimf.toLocaleString('fr')}</td>
                </tr>
                <tr>
                  <td className="p-1 text-right">4 400</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-span-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-black p-1 text-center">NET A PAYER<br />EN FRANCS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1 text-center font-bold text-lg">{netAPayer.toLocaleString('fr')}</td>
                </tr>
                <tr>
                  <td className="p-1 text-center">1 378 988</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footer */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-1">
            <div className="font-bold">CONGES PAYES</div>
            <div className="grid grid-cols-2">
              <div>Montant:</div>
              <div className="font-semibold">{congesPayes.toLocaleString('fr')}</div>
            </div>
          </div>
          <div className="p-1">
            <div className="font-bold">PRIX PAR ENTREPRISE</div>
            <div className="grid grid-cols-2">
              <div>Mois:</div>
              <div className="font-semibold">{prixParEntreprise.mois.toLocaleString('fr')}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>Cumul:</div>
              <div className="font-semibold">{prixParEntreprise.cumul.toLocaleString('fr')}</div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .payslip, .payslip * {
            visibility: visible;
          }
          
          .payslip {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}
      </style>
    </div>
  );
}
