
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

// Function to create multiple payslips for a payment
export const createPayslips = async (payslips: Omit<Payslip, 'id' | 'created_at' | 'updated_at' | 'generated_date'>[]): Promise<boolean> => {
  try {
    // Add generated_date field to all payslips
    const payslipsToInsert = payslips.map(payslip => ({
      ...payslip,
      generated_date: new Date().toISOString()
    }));
    
    // Use type assertion to handle table not being in TypeScript defs
    const { error } = await supabase
      .from('payslips' as any)
      .insert(payslipsToInsert as any);

    if (error) {
      console.error("Error creating payslips:", error);
      toast.error("Erreur lors de la création des bulletins de paie");
      return false;
    }
    
    // Calculate total amount of all payslips
    const totalAmount = payslips.reduce((sum, payslip) => sum + payslip.net_salary, 0);
    
    // Update the salary payment with the calculated total amount
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

// Function to update the total amount of a salary payment
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

// Function to get payslips by salary payment ID
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
    
    return data as Payslip[];
  } catch (error) {
    console.error("Error fetching payslips:", error);
    toast.error("Erreur lors de la récupération des bulletins de paie");
    return [];
  }
};

// Function to get employee's payslips
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

// Function to get a specific payslip by ID
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
    
    return data as Payslip;
  } catch (error) {
    console.error("Error fetching payslip:", error);
    toast.error("Erreur lors de la récupération du bulletin de paie");
    return null;
  }
};
