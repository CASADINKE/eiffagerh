
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type PayslipStatus = 'En attente' | 'Validé' | 'Payé';
export type PaymentMethod = 'Virement' | 'Espèces' | 'Mobile Money';

export interface Payslip {
  id: string;
  matricule: string;
  nom: string;
  periode_paie: string;
  salaire_base: number;
  sursalaire: number;
  prime_transport: number;
  indemnite_deplacement: number;
  ipres_general: number;
  trimf: number;
  retenue_ir: number;
  total_brut: number;
  net_a_payer: number;
  statut_paiement: PayslipStatus;
  mode_paiement: PaymentMethod | null;
  date_paiement: string | null;
}

export const fetchPayslips = async () => {
  try {
    const { data, error } = await supabase
      .from('bulletins_paie')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erreur lors de la récupération des bulletins de paie:", error);
      throw error;
    }
    
    return data as Payslip[];
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};

export const updatePayslipStatus = async (
  payslipId: string, 
  status: PayslipStatus, 
  paymentMethod?: PaymentMethod,
  paymentDate?: string
) => {
  try {
    const updateData: any = { statut_paiement: status };
    
    if (paymentMethod) {
      updateData.mode_paiement = paymentMethod;
    }
    
    if (paymentDate) {
      updateData.date_paiement = paymentDate;
    } else if (status === 'Payé') {
      // Si le statut est 'Payé' et qu'aucune date n'est fournie, utiliser la date actuelle
      updateData.date_paiement = new Date().toISOString().split('T')[0];
    }
    
    const { error } = await supabase
      .from('bulletins_paie')
      .update(updateData)
      .eq('id', payslipId);
    
    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    }
    
    toast.success(`Statut du bulletin mis à jour: ${status}`);
    return true;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};

export const getPayslipById = async (payslipId: string) => {
  try {
    const { data, error } = await supabase
      .from('bulletins_paie')
      .select('*')
      .eq('id', payslipId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération du bulletin de paie:", error);
      throw error;
    }
    
    return data as Payslip;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};

export const deletePayslip = async (payslipId: string) => {
  try {
    const { error } = await supabase
      .from('bulletins_paie')
      .delete()
      .eq('id', payslipId);
    
    if (error) {
      console.error("Erreur lors de la suppression du bulletin de paie:", error);
      toast.error("Erreur lors de la suppression du bulletin de paie");
      throw error;
    }
    
    toast.success("Bulletin de paie supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};

export const generatePayslipPDF = async (payslip: Payslip) => {
  try {
    // Fetch employee details from database
    const { data: employeeData, error: employeeError } = await supabase
      .from('listes_employées')
      .select('*')
      .eq('matricule', payslip.matricule)
      .single();
    
    if (employeeError) {
      console.error("Erreur lors de la récupération des données de l'employé:", employeeError);
      toast.error("Erreur lors de la récupération des données de l'employé");
    }
    
    // Use employee data from database if available, fallback to payslip data
    const employeeInfo = employeeData || { 
      nom: payslip.nom,
      prenom: '',
      matricule: payslip.matricule,
      poste: 'Non spécifié',
      date_naissance: null
    };
    
    const employeeName = employeeData ? 
      `${employeeInfo.prenom} ${employeeInfo.nom}` : 
      payslip.nom;
    
    const dateNaissance = employeeInfo.date_naissance ? 
      new Date(employeeInfo.date_naissance).toLocaleDateString('fr-FR') : 
      '10/10/1988'; // Fallback date
      
    // Calculate total values
    const salaireBrut = payslip.salaire_base + payslip.sursalaire;
    const totalBrut = salaireBrut + payslip.indemnite_deplacement + payslip.prime_transport;
    const totalDeductions = payslip.ipres_general + payslip.trimf + payslip.retenue_ir;
    
    // Génération du contenu HTML pour le PDF
    const html = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
            body { 
              font-family: 'Roboto', Arial, sans-serif;
              padding: 20px;
              color: #333;
              font-size: 12px;
              line-height: 1.5;
            }
            h1 { 
              text-align: center; 
              color: #333; 
              font-size: 22px;
              margin-bottom: 15px;
            }
            h2 {
              font-size: 16px;
              margin-bottom: 10px;
              color: #2c3e50;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
            }
            .info-section { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 20px; 
            }
            .info-block { 
              width: 48%; 
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th, td { 
              padding: 12px 15px; 
              text-align: left; 
              border-bottom: 1px solid #e0e0e0; 
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: 600;
              color: #2c3e50;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .total-row { 
              font-weight: bold; 
              background-color: #edf2f7 !important; 
              border-top: 2px solid #cbd5e0;
            }
            
            /* Improved styling for payslip */
            .payslip-container { 
              border: 2px solid #2c3e50; 
              padding: 25px;
              border-radius: 10px;
              background-color: white;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .company-header { 
              display: flex; 
              justify-content: space-between; 
              border-bottom: 2px solid #2c3e50; 
              padding-bottom: 15px; 
              margin-bottom: 25px; 
            }
            .employee-info { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 25px; 
            }
            .employee-details { 
              border: 1px solid #cbd5e0; 
              padding: 15px;
              border-radius: 8px;
              background-color: #f8f9fa;
            }
            .employee-details h3 {
              margin-top: 0;
              color: #2c3e50;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .employee-details p {
              margin: 8px 0;
            }
            .employee-details strong {
              font-weight: 600;
              color: #2c3e50;
            }
            .amount-column {
              text-align: right;
              font-family: 'Courier New', monospace;
            }
            .signature-area {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              width: 45%;
              border-top: 1px solid #cbd5e0;
              padding-top: 10px;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #718096;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }
            /* Print optimization */
            @media print {
              body { 
                padding: 0;
                font-size: 11px;
              }
              .payslip-container {
                border: 1px solid #2c3e50;
                padding: 15px;
                box-shadow: none;
              }
              .employee-details, .info-block {
                background-color: #f8f9fa !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              th {
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              tr:nth-child(even) {
                background-color: #f8f9fa !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .total-row {
                background-color: #edf2f7 !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="payslip-container">
            <div class="company-header">
              <div>
                <h2>EIFFAGE ENERGIE</h2>
                <p>T&D Sénégal</p>
                <p style="color: #666; font-size: 10px;">AV. FELIX EBOUE X RTE DES BRASSERIES<br>DAKAR SENEGAL</p>
              </div>
              <div>
                <h1>Bulletin de Paie</h1>
                <p style="text-align: right;"><strong>Période:</strong> ${payslip.periode_paie}</p>
              </div>
            </div>
            
            <div class="employee-info">
              <div class="employee-details">
                <h3>Informations Employé</h3>
                <p><strong>Matricule:</strong> ${payslip.matricule}</p>
                <p><strong>Nom:</strong> ${employeeName}</p>
                <p><strong>Date de naissance:</strong> ${dateNaissance}</p>
                <p><strong>Poste:</strong> ${employeeInfo.poste || 'Non spécifié'}</p>
              </div>
              <div class="employee-details">
                <h3>Informations Paiement</h3>
                <p><strong>Statut:</strong> ${payslip.statut_paiement}</p>
                <p><strong>Mode de paiement:</strong> ${payslip.mode_paiement || 'Non défini'}</p>
                <p><strong>Date de paiement:</strong> ${payslip.date_paiement ? new Date(payslip.date_paiement).toLocaleDateString('fr-FR') : 'Non défini'}</p>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style="width: 40%;">Désignation</th>
                  <th style="width: 20%; text-align: right;">Base</th>
                  <th style="width: 10%; text-align: center;">Taux</th>
                  <th style="width: 30%; text-align: right;">Montant (FCFA)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Salaire de base</td>
                  <td style="text-align: right;">${payslip.salaire_base.toLocaleString('fr-FR')}</td>
                  <td style="text-align: center;">100%</td>
                  <td style="text-align: right;" class="amount-column">${payslip.salaire_base.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Sursalaire</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column">${payslip.sursalaire.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Prime de transport</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column">${payslip.prime_transport.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Indemnité de déplacement</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column">${payslip.indemnite_deplacement.toLocaleString('fr-FR')}</td>
                </tr>
                <tr class="total-row">
                  <td><strong>Total Brut</strong></td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column"><strong>${totalBrut.toLocaleString('fr-FR')}</strong></td>
                </tr>
                
                <!-- Déductions -->
                <tr>
                  <td>IPRES Général</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column">-${payslip.ipres_general.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>TRIMF</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column">-${payslip.trimf.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Retenue IR</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column">-${payslip.retenue_ir.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td><strong>Total des retenues</strong></td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column"><strong>${totalDeductions.toLocaleString('fr-FR')}</strong></td>
                </tr>
                
                <tr class="total-row">
                  <td><strong>Net à Payer</strong></td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: center;"></td>
                  <td style="text-align: right;" class="amount-column"><strong>${payslip.net_a_payer.toLocaleString('fr-FR')}</strong></td>
                </tr>
              </tbody>
            </table>
            
            <div class="signature-area">
              <div class="signature-box">
                <p>Signature de l'employeur</p>
              </div>
              <div class="signature-box">
                <p>Signature de l'employé</p>
              </div>
            </div>
            
            <div class="footer">
              <p>Document généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
              <p>Ce bulletin est un document officiel. Conservez-le précieusement.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Créer un blob avec le contenu HTML
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Ouvrir le contenu dans une nouvelle fenêtre pour l'impression
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error("Erreur lors de la génération du PDF");
    throw error;
  }
};
