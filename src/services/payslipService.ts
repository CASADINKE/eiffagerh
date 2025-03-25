
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
