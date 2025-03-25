import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

export const fetchSalaires = async () => {
  try {
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
    const { data, error } = await supabase
      .from('salaires')
      .insert([formData]);
    
    if (error) {
      console.error("Erreur lors de la création du salaire:", error);
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

// Add this function at the end of the file or before the existing export statement
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
