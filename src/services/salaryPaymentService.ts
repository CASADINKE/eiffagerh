
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Payslip } from "./payslipService";

export interface SalaryPayment {
  id: string;
  payment_date: string;
  payment_period: string;
  payment_method: string;
  description: string | null;
  total_amount: number;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Function to create a new salary payment
export const createSalaryPayment = async (paymentData: Omit<SalaryPayment, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<string | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("Utilisateur non connecté");
      return null;
    }

    const { data, error } = await supabase
      .from('salary_payments' as any)
      .insert({
        ...paymentData,
        created_by: user.user.id
      } as any)
      .select('id')
      .single();

    if (error) {
      console.error("Error creating salary payment:", error);
      toast.error("Erreur lors de la création du paiement de salaire");
      return null;
    }
    
    // Type assertion to ensure we can access the id property
    return (data as any).id;
  } catch (error) {
    console.error("Error creating salary payment:", error);
    toast.error("Erreur lors de la création du paiement de salaire");
    return null;
  }
};

// Function to get all salary payments
export const getSalaryPayments = async (): Promise<SalaryPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('salary_payments' as any)
      .select('*')
      .order('payment_date', { ascending: false }) as any;

    if (error) {
      console.error("Error fetching salary payments:", error);
      toast.error("Erreur lors de la récupération des paiements de salaire");
      return [];
    }
    
    return data as SalaryPayment[];
  } catch (error) {
    console.error("Error fetching salary payments:", error);
    toast.error("Erreur lors de la récupération des paiements de salaire");
    return [];
  }
};

// Re-export types and functions from payslipService for backwards compatibility
export type { Payslip } from "./payslipService";
export { 
  createPayslips, 
  getPayslipsByPaymentId, 
  getEmployeePayslips, 
  getPayslipById 
} from "./payslipService";
