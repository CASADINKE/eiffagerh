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
    const salaire = await getSalaireById(salaireId);
    
    if (!salaire) {
      toast.error("Bulletin de salaire introuvable");
      return null;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.className = 'payslip-container p-8 bg-white';
    tempDiv.style.width = '800px';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    
    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">BULLETIN DE PAIE</h1>
          <p style="font-size: 16px; color: #666;">${salaire.periode_paie}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="margin-bottom: 10px; font-size: 18px;">Informations Employé</h3>
            <p><strong>Matricule:</strong> ${salaire.matricule}</p>
            <p><strong>Nom:</strong> ${salaire.nom}</p>
          </div>
          <div>
            <h3 style="margin-bottom: 10px; font-size: 18px;">Informations Paiement</h3>
            <p><strong>Statut:</strong> ${salaire.statut_paiement}</p>
            <p><strong>Mode de paiement:</strong> ${salaire.mode_paiement || 'Non défini'}</p>
            <p><strong>Date de paiement:</strong> ${salaire.date_paiement || 'Non définie'}</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Rubrique</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Montant (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Salaire de base</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${salaire.salaire_base.toLocaleString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Sursalaire</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${salaire.sursalaire.toLocaleString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Prime de transport</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${salaire.prime_transport.toLocaleString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Indemnité de déplacement</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${salaire.indemnite_deplacement.toLocaleString('fr-FR')}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border-bottom: 2px solid #ddd;"><strong>Total Brut</strong></td>
              <td style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;"><strong>${(salaire.salaire_base + salaire.sursalaire + salaire.prime_transport + salaire.indemnite_deplacement).toLocaleString('fr-FR')}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">IPRES Général</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">-${salaire.ipres_general.toLocaleString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">TRIMF</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">-${salaire.trimf.toLocaleString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Retenue IR</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">-${salaire.retenue_ir.toLocaleString('fr-FR')}</td>
            </tr>
            <tr style="background-color: #f3f4f6; font-weight: bold;">
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">NET A PAYER</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${salaire.net_a_payer.toLocaleString('fr-FR')}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin-top: 40px; font-size: 12px; color: #666; text-align: center;">
          <p>Ce bulletin est généré électroniquement et ne nécessite pas de signature.</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(tempDiv);
    
    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bulletin_${salaire.matricule}_${salaire.periode_paie.replace(/\s/g, '_')}.pdf`);
      
      toast.success("Bulletin de paie téléchargé avec succès");
      return true;
    } finally {
      document.body.removeChild(tempDiv);
    }
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error("Erreur lors de la génération du PDF");
    return null;
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
