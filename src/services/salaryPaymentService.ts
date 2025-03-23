import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      .from('salary_payments')
      .insert({
        ...paymentData,
        created_by: user.user.id
      })
      .select('id')
      .single();

    if (error) {
      console.error("Error creating salary payment:", error);
      toast.error("Erreur lors de la création du paiement de salaire");
      return null;
    }
    
    return data.id;
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
      .from('salary_payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error) {
      console.error("Error fetching salary payments:", error);
      toast.error("Erreur lors de la récupération des paiements de salaire");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching salary payments:", error);
    toast.error("Erreur lors de la récupération des paiements de salaire");
    return [];
  }
};

// Function to create multiple payslips for a payment
export const createPayslips = async (payslips: Omit<Payslip, 'id' | 'created_at' | 'updated_at' | 'generated_date'>[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payslips')
      .insert(payslips);

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
      .from('salary_payments')
      .update({ 
        total_amount: totalAmount,
        status: 'completed'
      })
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
      .from('payslips')
      .select(`
        *,
        employee:profiles(full_name, role)
      `)
      .eq('salary_payment_id', paymentId)
      .order('net_salary', { ascending: false });

    if (error) {
      console.error("Error fetching payslips:", error);
      toast.error("Erreur lors de la récupération des bulletins de paie");
      return [];
    }
    
    return data || [];
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
      .from('payslips')
      .select(`
        *,
        payment:salary_payments(payment_period, payment_date)
      `)
      .eq('employee_id', employeeId)
      .order('generated_date', { ascending: false });

    if (error) {
      console.error("Error fetching employee payslips:", error);
      toast.error("Erreur lors de la récupération des bulletins de paie");
      return [];
    }
    
    return data || [];
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
      .from('payslips')
      .select(`
        *,
        employee:profiles(full_name, role)
      `)
      .eq('id', payslipId)
      .single();

    if (error) {
      console.error("Error fetching payslip:", error);
      toast.error("Erreur lors de la récupération du bulletin de paie");
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error("Error fetching payslip:", error);
    toast.error("Erreur lors de la récupération du bulletin de paie");
    return null;
  }
};
