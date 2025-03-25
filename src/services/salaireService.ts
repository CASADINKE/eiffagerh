import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export type SalairePaiementStatus = 'En attente' | 'Validé' | 'Payé';
export type ModePaiement = 'Virement' | 'Espèces' | 'Mobile Money';

export interface Salaire {
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
  net_a_payer: number;
  statut_paiement: SalairePaiementStatus;
  mode_paiement: ModePaiement | null;
  date_paiement: string | null;
  user_id?: string; // Added the user_id field
}

export interface SalaireFormData {
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
  net_a_payer: number;
  statut_paiement: SalairePaiementStatus;
  user_id?: string; // Added the user_id field
}

export const fetchSalaires = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Utilisateur non authentifié");
      return [];
    }
    
    const { data, error } = await supabase
      .from('salaires')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erreur lors de la récupération des salaires:", error);
      throw error;
    }
    
    return data as Salaire[];
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};

export const createSalaire = async (formData: SalaireFormData) => {
  try {
    console.log("Creating salary with data:", formData);
    
    if (!formData.user_id) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        formData.user_id = user.id;
      }
    }
    
    const { data, error } = await supabase
      .from('salaires')
      .insert([formData]);
    
    if (error) {
      console.error("Erreur lors de la création du salaire:", error);
      toast.error(`Erreur: ${error.message}`);
      throw error;
    }
    
    toast.success("Salaire créé avec succès!");
    return data;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    toast.error("Erreur lors de la création du salaire");
    throw error;
  }
};

export const updateSalaireStatus = async (
  salaireId: string, 
  status: SalairePaiementStatus,
  modePaiement?: ModePaiement,
  datePaiement?: string
) => {
  try {
    const updateData: any = { statut_paiement: status };
    
    if (modePaiement) {
      updateData.mode_paiement = modePaiement;
    }
    
    if (datePaiement) {
      updateData.date_paiement = datePaiement;
    }
    
    const { error } = await supabase
      .from('salaires')
      .update(updateData)
      .eq('id', salaireId);
    
    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    }
    
    toast.success(`Statut du salaire mis à jour: ${status}`);
    return true;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};

export const getSalairesByMatricule = async (matricule: string) => {
  try {
    const { data, error } = await supabase
      .from('salaires')
      .select('*')
      .eq('matricule', matricule)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erreur lors de la récupération des salaires par matricule:", error);
      throw error;
    }
    
    return data as Salaire[];
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};

export const deleteSalaire = async (salaireId: string) => {
  try {
    const { error } = await supabase
      .from('salaires')
      .delete()
      .eq('id', salaireId);
    
    if (error) {
      console.error("Erreur lors de la suppression du salaire:", error);
      toast.error("Erreur lors de la suppression du salaire");
      throw error;
    }
    
    toast.success("Salaire supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};

export const generatePDF = async (salaireId: string) => {
  try {
    const { data: salaire, error } = await supabase
      .from('salaires')
      .select('*')
      .eq('id', salaireId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération du salaire:", error);
      toast.error("Erreur lors de la génération du PDF");
      throw error;
    }
    
    const { data: employeeData, error: employeeError } = await supabase
      .from('listes_employées')
      .select('*')
      .eq('matricule', salaire.matricule)
      .single();
    
    if (employeeError) {
      console.error("Erreur lors de la récupération des données de l'employé:", employeeError);
      console.log("Matricule recherché:", salaire.matricule);
    }
    
    const employeeInfo = employeeData || { 
      nom: salaire.nom,
      prenom: '',
      matricule: salaire.matricule,
      poste: 'Non spécifié',
      date_naissance: null
    };
    
    const employeeName = employeeData ? 
      `${employeeInfo.prenom} ${employeeInfo.nom}` : 
      salaire.nom;
    
    const dateNaissance = employeeInfo.date_naissance ? 
      new Date(employeeInfo.date_naissance).toLocaleDateString('fr-FR') : 
      '10/10/1988'; // Fallback date
      
    const salaireBrut = salaire.salaire_base + salaire.sursalaire;
    const totalBrut = salaireBrut + salaire.indemnite_deplacement + salaire.prime_transport;
    const totalDeductions = salaire.ipres_general + salaire.trimf + salaire.retenue_ir;
    
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
                <p>Période: ${salaire.periode_paie}</p>
              </div>
            </div>
            
            <div class="employee-info">
              <div class="employee-details">
                <h3>Informations Employé</h3>
                <p><strong>Matricule:</strong> ${salaire.matricule}</p>
                <p><strong>Nom:</strong> ${employeeName}</p>
                <p><strong>Date de naissance:</strong> ${dateNaissance}</p>
                <p><strong>Poste:</strong> ${employeeInfo.poste || 'Non spécifié'}</p>
              </div>
              <div class="employee-details">
                <h3>Informations Paiement</h3>
                <p><strong>Statut:</strong> ${salaire.statut_paiement}</p>
                <p><strong>Mode de paiement:</strong> ${salaire.mode_paiement || 'Non défini'}</p>
                <p><strong>Date de paiement:</strong> ${salaire.date_paiement || 'Non défini'}</p>
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
                  <td style="text-align: right;">${salaire.salaire_base.toLocaleString('fr-FR')}</td>
                  <td style="text-align: right;">${salaire.salaire_base.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Sursalaire</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${salaire.sursalaire.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Prime de transport</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${salaire.prime_transport.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Indemnité de déplacement</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${salaire.indemnite_deplacement.toLocaleString('fr-FR')}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Brut</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${totalBrut.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>IPRES Général</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">-${salaire.ipres_general.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>TRIMF</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">-${salaire.trimf.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td>Retenue IR</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">-${salaire.retenue_ir.toLocaleString('fr-FR')}</td>
                </tr>
                <tr class="total-row">
                  <td>Net à Payer</td>
                  <td style="text-align: right;"></td>
                  <td style="text-align: right;">${salaire.net_a_payer.toLocaleString('fr-FR')}</td>
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
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    
    toast.success("Bulletin de paie généré avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error("Erreur lors de la génération du PDF");
    throw error;
  }
};

export const getSalaireById = async (salaireId: string) => {
  try {
    const { data, error } = await supabase
      .from('salaires')
      .select('*')
      .eq('id', salaireId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération du salaire:", error);
      throw error;
    }
    
    return data as Salaire;
  } catch (error) {
    console.error("Erreur inattendue:", error);
    throw error;
  }
};
