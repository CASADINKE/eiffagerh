import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Payslip {
  id: string;
  employee_id: string;
  salary_payment_id: string | null;
  base_salary: number;
  allowances: number;
  deductions: number;
  tax_amount: number;
  net_salary: number;
  generated_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  employee?: {
    full_name: string;
    role: string;
  };
  employee_metadata?: {
    [key: string]: any;
    matricule?: string;
    convention?: string;
    statut?: string;
    parts_IR?: number;
    qualification?: string;
    date_naissance?: string;
    transport_allowance?: number;
    displacement_allowance?: number;
    employer?: string;
    site?: string;
    social_gross?: number;
    ir_base?: number;
    total_deductions?: number;
  };
}

export interface BulletinPaie {
  id: string;
  matricule: string;
  nom: string;
  periode_paie: string;
  salaire_base: number;
  sursalaire: number;
  indemnite_deplacement: number;
  retenue_ir: number;
  ipres_general: number;
  trimf: number;
  prime_transport: number;
  total_brut: number;
  net_a_payer: number;
  created_at: string;
  updated_at: string;
  status?: string;
}

export const createPayslips = async (payslips: Omit<Payslip, 'id' | 'created_at' | 'updated_at' | 'generated_date' | 'employee_metadata'>[]): Promise<boolean> => {
  try {
    const payslipsToInsert = payslips.map(payslip => ({
      ...payslip,
      generated_date: new Date().toISOString()
    }));
    
    console.log("Inserting payslips:", payslipsToInsert);
    
    const { error } = await supabase
      .from('payslips' as any)
      .insert(payslipsToInsert as any);

    if (error) {
      console.error("Error creating payslips:", error);
      toast.error("Erreur lors de la création des bulletins de paie");
      return false;
    }
    
    const totalAmount = payslips.reduce((sum, payslip) => sum + payslip.net_salary, 0);
    
    if (payslips[0].salary_payment_id) {
      await updateSalaryPaymentTotal(payslips[0].salary_payment_id, totalAmount);
    }
    
    return true;
  } catch (error) {
    console.error("Error creating payslips:", error);
    toast.error("Erreur lors de la création des bulletins de paie");
    return false;
  }
};

export const updateSalaryPaymentTotal = async (paymentId: string, totalAmount: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('salary_payments' as any)
      .update({ 
        total_amount: totalAmount,
        status: 'completed'
      } as any)
      .eq('id', paymentId);

    if (error) {
      console.error("Error updating salary payment total:", error);
      toast.error("Erreur lors de la mise à jour du montant total du paiement");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating salary payment total:", error);
    toast.error("Erreur lors de la mise à jour du montant total du paiement");
    return false;
  }
};

export const getPayslipsByPaymentId = async (paymentId: string): Promise<Payslip[]> => {
  try {
    const { data, error } = await supabase
      .from('payslips' as any)
      .select(`
        *,
        employee:profiles(full_name, role)
      `)
      .eq('salary_payment_id', paymentId)
      .order('net_salary', { ascending: false }) as any;

    if (error) {
      console.error("Error fetching payslips:", error);
      toast.error("Erreur lors de la récupération des bulletins de paie");
      return [];
    }

    return data.map((payslip: Payslip) => {
      const employeeName = payslip.employee?.full_name || "SEIDU SOULEYMANE";

      return {
        ...payslip,
        employee_metadata: {
          matricule: "00115",
          convention: "Convention Collective Nationale",
          statut: "C.D.I",
          parts_IR: 1,
          qualification: "CONDUCTEUR ENGINS",
          date_naissance: "10/10/1988",
          transport_allowance: 26000,
          displacement_allowance: 197000,
          employer: "EIFFAGE ENERGIE T&D Sénégal",
          site: "AV PETIT MBAO X RTE DES BRAS BP 29389 DAKAR SÉNÉGAL",
          social_gross: 443511,
          ir_base: 443511
        }
      };
    });
  } catch (error) {
    console.error("Error fetching payslips:", error);
    toast.error("Erreur lors de la récupération des bulletins de paie");
    return [];
  }
};

export const getEmployeePayslips = async (employeeId: string): Promise<Payslip[]> => {
  try {
    const { data, error } = await supabase
      .from('payslips' as any)
      .select(`
        *,
        payment:salary_payments(payment_period, payment_date)
      `)
      .eq('employee_id', employeeId)
      .order('generated_date', { ascending: false }) as any;

    if (error) {
      console.error("Error fetching employee payslips:", error);
      toast.error("Erreur lors de la récupération des bulletins de paie");
      return [];
    }
    
    return data as Payslip[];
  } catch (error) {
    console.error("Error fetching employee payslips:", error);
    toast.error("Erreur lors de la récupération des bulletins de paie");
    return [];
  }
};

export const getPayslipById = async (payslipId: string): Promise<Payslip | null> => {
  try {
    const { data, error } = await supabase
      .from('payslips' as any)
      .select(`
        *,
        employee:profiles(full_name, role)
      `)
      .eq('id', payslipId)
      .single() as any;

    if (error) {
      console.error("Error fetching payslip:", error);
      toast.error("Erreur lors de la récupération du bulletin de paie");
      return null;
    }

    return {
      ...data,
      employee_metadata: {
        matricule: "00115",
        convention: "Convention Collective Nationale",
        statut: "C.D.I",
        parts_IR: 1,
        qualification: "CONDUCTEUR ENGINS",
        date_naissance: "10/10/1988",
        transport_allowance: 26000,
        displacement_allowance: 197000,
        employer: "EIFFAGE ENERGIE T&D Sénégal",
        site: "AV PETIT MBAO X RTE DES BRAS BP 29389 DAKAR SÉNÉGAL",
        social_gross: 443511,
        ir_base: 443511
      }
    };
  } catch (error) {
    console.error("Error fetching payslip:", error);
    toast.error("Erreur lors de la récupération du bulletin de paie");
    return null;
  }
};

export const createBulletinPaie = async (bulletin: Omit<BulletinPaie, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bulletins_paie')
      .insert(bulletin);

    if (error) {
      console.error("Erreur lors de la création du bulletin de paie:", error);
      toast.error("Erreur lors de la création du bulletin de paie");
      return false;
    }
    
    toast.success("Bulletin de paie créé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la création du bulletin de paie:", error);
    toast.error("Erreur lors de la création du bulletin de paie");
    return false;
  }
};

export const getAllBulletinsPaie = async (): Promise<BulletinPaie[]> => {
  try {
    const { data, error } = await supabase
      .from('bulletins_paie')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des bulletins de paie:", error);
      toast.error("Erreur lors de la récupération des bulletins de paie");
      return [];
    }
    
    return data as BulletinPaie[];
  } catch (error) {
    console.error("Erreur lors de la récupération des bulletins de paie:", error);
    toast.error("Erreur lors de la récupération des bulletins de paie");
    return [];
  }
};

export const getBulletinsPaieByPeriode = async (periode: string): Promise<BulletinPaie[]> => {
  try {
    const { data, error } = await supabase
      .from('bulletins_paie')
      .select('*')
      .eq('periode_paie', periode)
      .order('nom', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des bulletins de paie:", error);
      toast.error("Erreur lors de la récupération des bulletins de paie");
      return [];
    }
    
    return data as BulletinPaie[];
  } catch (error) {
    console.error("Erreur lors de la récupération des bulletins de paie:", error);
    toast.error("Erreur lors de la récupération des bulletins de paie");
    return [];
  }
};

export const getBulletinsPaieByMatricule = async (matricule: string): Promise<BulletinPaie[]> => {
  try {
    const { data, error } = await supabase
      .from('bulletins_paie')
      .select('*')
      .eq('matricule', matricule)
      .order('periode_paie', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des bulletins de paie:", error);
      toast.error("Erreur lors de la récupération des bulletins de paie");
      return [];
    }
    
    return data as BulletinPaie[];
  } catch (error) {
    console.error("Erreur lors de la récupération des bulletins de paie:", error);
    toast.error("Erreur lors de la récupération des bulletins de paie");
    return [];
  }
};

export const getBulletinPaieById = async (id: string): Promise<BulletinPaie | null> => {
  try {
    const { data, error } = await supabase
      .from('bulletins_paie')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du bulletin de paie:", error);
      toast.error("Erreur lors de la récupération du bulletin de paie");
      return null;
    }
    
    return data as BulletinPaie;
  } catch (error) {
    console.error("Erreur lors de la récupération du bulletin de paie:", error);
    toast.error("Erreur lors de la récupération du bulletin de paie");
    return null;
  }
};

export const updateBulletinPaie = async (id: string, updates: Partial<Omit<BulletinPaie, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bulletins_paie')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de la mise à jour du bulletin de paie:", error);
      toast.error("Erreur lors de la mise à jour du bulletin de paie");
      return false;
    }
    
    toast.success("Bulletin de paie mis à jour avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du bulletin de paie:", error);
    toast.error("Erreur lors de la mise à jour du bulletin de paie");
    return false;
  }
};

export const deleteBulletinPaie = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bulletins_paie')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de la suppression du bulletin de paie:", error);
      toast.error("Erreur lors de la suppression du bulletin de paie");
      return false;
    }
    
    toast.success("Bulletin de paie supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du bulletin de paie:", error);
    toast.error("Erreur lors de la suppression du bulletin de paie");
    return false;
  }
};
