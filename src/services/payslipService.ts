
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
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            .header { text-align: center; margin-bottom: 20px; }
            .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .info-block { width: 48%; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
            
            /* Improved styling for payslip */
            .payslip-container { border: 2px solid #333; padding: 20px; }
            .company-header { display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .employee-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .employee-details { border: 1px solid #ddd; padding: 10px; }
          </style>
        </head>
        <body>
          <div class="payslip-container">
            <div class="company-header">
              <div>
                <h2>EIFFAGE ENERGIE</h2>
                <p>T&D Sénégal</p>
              </div>
              <div>
                <h1>Bulletin de Paie</h1>
                <p>Période: ${payslip.periode_paie}</p>
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
                <p><strong>Date de paiement:</strong> ${payslip.date_paiement || 'Non défini'}</p>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Désignation</th>
                  <th style="text-align: right;">Base</th>
                  <th style="text-align: right;">Montant (FCFA)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Salaire de base</td>
                  <td style="text-align: right;">${payslip.salaire_base.toLocaleString('fr-FR')}</td>
                  <td style="text-align: right;">${payslip.salaire_base.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Sursalaire</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${payslip.sursalaire.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Prime de transport</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${payslip.prime_transport.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Indemnité de déplacement</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${payslip.indemnite_deplacement.toLocaleString('fr-FR')}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Brut</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${totalBrut.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>IPRES Général</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">-${payslip.ipres_general.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>TRIMF</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">-${payslip.trimf.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Retenue IR</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">-${payslip.retenue_ir.toLocaleString('fr-FR')}</td>
                </tr>
                <tr class="total-row">
                  <td>Net à Payer</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${payslip.net_a_payer.toLocaleString('fr-FR')}</td>
                </tr>
              </tbody>
            </table>
            
            <div style="margin-top: 30px; text-align: right;">
              <p><strong>Date d'émission:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
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
