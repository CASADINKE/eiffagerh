
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
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bulletin de Paie</h1>
            <p>Période: ${payslip.periode_paie}</p>
          </div>
          
          <div class="info-section">
            <div class="info-block">
              <h3>Informations Employé</h3>
              <p><strong>Nom:</strong> ${payslip.nom}</p>
              <p><strong>Matricule:</strong> ${payslip.matricule}</p>
            </div>
            <div class="info-block">
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
                <th>Montant (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Salaire de base</td>
                <td>${payslip.salaire_base.toLocaleString('fr-FR')}</td>
              </tr>
              <tr>
                <td>Sursalaire</td>
                <td>${payslip.sursalaire.toLocaleString('fr-FR')}</td>
              </tr>
              <tr>
                <td>Prime de transport</td>
                <td>${payslip.prime_transport.toLocaleString('fr-FR')}</td>
              </tr>
              <tr>
                <td>Indemnité de déplacement</td>
                <td>${payslip.indemnite_deplacement.toLocaleString('fr-FR')}</td>
              </tr>
              <tr class="total-row">
                <td>Total Brut</td>
                <td>${payslip.total_brut.toLocaleString('fr-FR')}</td>
              </tr>
              <tr>
                <td>IPRES Général</td>
                <td>-${payslip.ipres_general.toLocaleString('fr-FR')}</td>
              </tr>
              <tr>
                <td>TRIMF</td>
                <td>-${payslip.trimf.toLocaleString('fr-FR')}</td>
              </tr>
              <tr>
                <td>Retenue IR</td>
                <td>-${payslip.retenue_ir.toLocaleString('fr-FR')}</td>
              </tr>
              <tr class="total-row">
                <td>Net à Payer</td>
                <td>${payslip.net_a_payer.toLocaleString('fr-FR')}</td>
              </tr>
            </tbody>
          </table>
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
